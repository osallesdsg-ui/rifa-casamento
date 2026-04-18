import { supabase } from './supabase';

export const fetchAllBuyers = async () => {
  const { data, error } = await supabase
    .from('buyers')
    .select(`
      *,
      buyer_tickets (
        ticket_id,
        tickets (number)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createBuyer = async (buyerData, ticketIds, initialStatus = 'pending', source = 'web') => {
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

  console.log('📦 createBuyer - Iniciando...');
  console.log('🎫 Ticket IDs recebidos:', ticketIds);
  console.log('📊 Status:', initialStatus, '| Fonte:', source);

  // Validação básica
  if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
    throw new Error('Nenhum ID de cota fornecido');
  }

  // 1. Criar comprador
  const { data: buyer, error: buyerError } = await supabase
    .from('buyers')
    .insert([{
      name: buyerData.name,
      whatsapp: buyerData.whatsapp,
      total_amount: buyerData.totalAmount,
      status: initialStatus,
      source: source,
      created_at: now,
      updated_at: now,
    }])
    .select()
    .single();

  if (buyerError) {
    console.error('❌ Erro ao criar buyer:', buyerError);
    throw buyerError;
  }

  console.log('✅ Buyer criado:', buyer);

  // 2. Atualizar tickets e criar relações
  const updatePromises = ticketIds.map(async (ticketId) => {
    // Atualizar status da ticket
    const { error: ticketError } = await supabase
      .from('tickets')
      .update({
        status: initialStatus,
        buyer_id: buyer.id,
        reserved_at: now,
        expires_at: initialStatus === 'pending' ? expiresAt : null,
        updated_at: now,
      })
      .eq('id', ticketId);

    if (ticketError) {
      console.error('❌ Erro ao atualizar ticket:', ticketError, 'ID:', ticketId);
      throw ticketError;
    }

    // Criar relação buyer_tickets
    const { error: relationError } = await supabase
      .from('buyer_tickets')
      .insert([{
        buyer_id: buyer.id,
        ticket_id: ticketId,
        created_at: now,
      }]);

    if (relationError) {
      console.error('❌ Erro ao criar relação:', relationError);
      throw relationError;
    }
  });

  // Executar todas as atualizações em paralelo
  await Promise.all(updatePromises);

  console.log('✅ Tickets atualizados e relações criadas com sucesso');
  return buyer;
};

export const updateBuyerStatus = async (buyerId, newStatus, ticketNumbers = []) => {
  const now = new Date().toISOString();

  // 1. Atualizar o comprador
  const { error: buyerError } = await supabase
    .from('buyers')
    .update({ status: newStatus, updated_at: now })
    .eq('id', buyerId);

  if (buyerError) throw buyerError;

  // 2. Buscar as tickets vinculadas a este comprador
  let targetTickets = [];
  
  if (ticketNumbers && ticketNumbers.length > 0) {
    const { data } = await supabase
      .from('tickets')
      .select('id, number')
      .in('number', ticketNumbers);
    targetTickets = data || [];
  } else {
    const { data } = await supabase
      .from('tickets')
      .select('id')
      .eq('buyer_id', buyerId);
    targetTickets = data || [];
  }

  // 3. Atualizar status das tickets
  if (targetTickets.length > 0) {
    const ticketIds = targetTickets.map(t => t.id);
    const ticketStatus = newStatus === 'canceled' ? 'available' : newStatus;
    const buyerIdValue = newStatus === 'canceled' ? null : buyerId;

    const { error: ticketError } = await supabase
      .from('tickets')
      .update({
        status: ticketStatus,
        buyer_id: buyerIdValue,
        reserved_at: newStatus === 'canceled' ? null : undefined,
        expires_at: newStatus === 'canceled' ? null : undefined,
        updated_at: now,
      })
      .in('id', ticketIds);

    if (ticketError) {
      console.error('Erro ao atualizar tickets:', ticketError);
      throw ticketError;
    }

    if (newStatus === 'canceled') {
      await supabase
        .from('buyer_tickets')
        .delete()
        .eq('buyer_id', buyerId);
    }
  }

  return true;
};

export const deleteBuyer = async (buyerId) => {
  const { data: buyerTickets, error: fetchError } = await supabase
    .from('buyer_tickets')
    .select('ticket_id')
    .eq('buyer_id', buyerId);

  if (fetchError) throw fetchError;

  if (buyerTickets && buyerTickets.length > 0) {
    const ticketIds = buyerTickets.map(bt => bt.ticket_id);
    
    await supabase
      .from('tickets')
      .update({
        status: 'available',
        buyer_id: null,
        reserved_at: null,
        expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .in('id', ticketIds);

    await supabase
      .from('buyer_tickets')
      .delete()
      .eq('buyer_id', buyerId);
  }

  const { error: deleteError } = await supabase
    .from('buyers')
    .delete()
    .eq('id', buyerId);

  if (deleteError) throw deleteError;
  return true;
};

export const updateBuyerInfo = async (buyerId, updates) => {
  const now = new Date().toISOString();

  console.log('✏️ updateBuyerInfo - Iniciando:', { buyerId, updates });

  // 1. Atualizar dados do comprador
  const { error: buyerError } = await supabase
    .from('buyers')
    .update({
      name: updates.name,
      whatsapp: updates.whatsapp,
      status: updates.status,
      updated_at: now,
    })
    .eq('id', buyerId);

  if (buyerError) {
    console.error('❌ Erro ao atualizar buyer:', buyerError);
    throw buyerError;
  }

  console.log('✅ Buyer atualizado no banco');

  // 2. Sincronizar status das cotas vinculadas
  const {  relations, error: relationsError } = await supabase
    .from('buyer_tickets')
    .select('ticket_id')
    .eq('buyer_id', buyerId);

  if (relationsError) {
    console.error('❌ Erro ao buscar relações:', relationsError);
    throw relationsError;
  }

  if (relations && relations.length > 0) {
    const ticketIds = relations.map(r => r.ticket_id);
    const ticketStatus = updates.status === 'canceled' ? 'available' : updates.status;
    const buyerIdValue = updates.status === 'canceled' ? null : buyerId;
    const expiresAtValue = updates.status === 'pending' ? new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() : null;

    console.log('🎫 Atualizando tickets:', { ticketIds, ticketStatus, buyerIdValue });

    const { error: ticketError } = await supabase
      .from('tickets')
      .update({
        status: ticketStatus,
        buyer_id: buyerIdValue,
        reserved_at: updates.status === 'canceled' ? null : undefined,
        expires_at: expiresAtValue,
        updated_at: now,
      })
      .in('id', ticketIds);

    if (ticketError) {
      console.error('❌ Erro ao atualizar tickets:', ticketError);
      throw ticketError;
    }

    // Se cancelado, remove as relações
    if (updates.status === 'canceled') {
      await supabase.from('buyer_tickets').delete().eq('buyer_id', buyerId);
    }
  }

  console.log('✅ updateBuyerInfo concluído com sucesso');
};