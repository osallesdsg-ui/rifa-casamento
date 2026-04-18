import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useBuyers } from '../../hooks/useBuyers';
import { supabase } from '../../services/supabase';

function AddBuyerModal({ onClose }) {
  const { addBuyer } = useBuyers();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ticketNumbers, setTicketNumbers] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !whatsapp.trim() || !ticketNumbers.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // 1. Extrair números
      const numbers = ticketNumbers
        .split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n) && n > 0 && n <= 300);

      if (numbers.length === 0) {
        alert('Por favor, insira números de cotas válidos (1 a 300).');
        setLoading(false);
        return;
      }

      console.log('🎫 Números digitados:', numbers);

      // 2. Buscar IDs reais no banco
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('id, number, status')
        .in('number', numbers);

      console.log('📦 Resposta do Supabase:', tickets, error);

      if (error) {
        console.error('Erro na query:', error);
        alert('Erro ao buscar cotas no banco: ' + error.message);
        setLoading(false);
        return;
      }

      if (!tickets || tickets.length === 0) {
        alert('Nenhuma cota encontrada. Verifique os números.');
        setLoading(false);
        return;
      }

      if (tickets.length !== numbers.length) {
        const foundNumbers = tickets.map(t => t.number);
        const missingNumbers = numbers.filter(n => !foundNumbers.includes(n));
        alert(`Cotas não encontradas: ${missingNumbers.join(', ')}`);
        setLoading(false);
        return;
      }

      // 3. Validar disponibilidade
      const unavailable = tickets.filter(t => t.status !== 'available');
      if (unavailable && unavailable.length > 0) {
        alert(`As cotas [${unavailable.map(t => t.number).join(', ')}] já estão reservadas ou vendidas.`);
        setLoading(false);
        return;
      }

      const ticketIds = tickets.map(t => t.id);
      console.log('✅ IDs encontrados:', ticketIds);
      
      const totalAmount = numbers.length * 15;

      // 4. Log detalhado antes de criar
      console.log('🎯 Chamando addBuyer com:');
      console.log('  - buyerData:', { name: name.trim(), whatsapp: whatsapp.trim(), totalAmount });
      console.log('  - ticketIds:', ticketIds);
      console.log('  - status:', status);
      console.log('  - source: admin');

      // 5. Criar comprador com IDs corretos
      await addBuyer(
        { name: name.trim(), whatsapp: whatsapp.trim(), totalAmount }, 
        ticketIds, 
        status, 
        'admin'
      );
      
      alert('Comprador adicionado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro completo:', err);
      alert(err.message || 'Erro ao adicionar comprador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card-strong p-6 w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg text-cream">Adicionar Comprador</h3>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-cream transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do comprador"
              className="input-dark text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">WhatsApp</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 99999-9999"
              className="input-dark text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
              Cotas (separadas por vírgula)
            </label>
            <input
              type="text"
              value={ticketNumbers}
              onChange={(e) => setTicketNumbers(e.target.value)}
              placeholder="Ex: 5, 12, 16"
              className="input-dark text-sm"
            />
            <p className="text-white/20 text-[10px] mt-1">Apenas cotas disponíveis serão vinculadas</p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-dark text-sm"
            >
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-outline text-sm" disabled={loading}>
            Cancelar
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={loading}
            className="flex-1 btn-gold text-sm disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Adicionar'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AddBuyerModal;