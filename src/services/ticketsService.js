import { supabase } from './supabase';

export const fetchAllTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('number', { ascending: true });

  if (error) throw error;
  return data;
};

export const updateTicketStatus = async (ticketId, status, buyerId = null, reservedAt = null, expiresAt = null) => {
  const { data, error } = await supabase
    .from('tickets')
    .update({
      status,
      buyer_id: buyerId,
      reserved_at: reservedAt,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const releaseExpiredTickets = async () => {
  const now = new Date().toISOString();

  // Buscar tickets pendentes expirados
  const { data: expiredTickets, error } = await supabase
    .from('tickets')
    .select('id, buyer_id')
    .eq('status', 'pending')
    .lt('expires_at', now);

  if (error) throw error;

  if (expiredTickets && expiredTickets.length > 0) {
    // Liberar tickets
    for (const ticket of expiredTickets) {
      await updateTicketStatus(ticket.id, 'available', null, null, null);
    }

    // Verificar se algum comprador ficou sem tickets e cancelar
    const buyerIds = [...new Set(expiredTickets.map(t => t.buyer_id))];

    for (const buyerId of buyerIds) {
      const { data: remainingTickets } = await supabase
        .from('buyer_tickets')
        .select('ticket_id')
        .eq('buyer_id', buyerId);

      if (remainingTickets && remainingTickets.length === 0) {
        await supabase
          .from('buyers')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('id', buyerId);
      }
    }
  }

  return expiredTickets;
};