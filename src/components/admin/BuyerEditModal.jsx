import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useBuyers } from '../../hooks/useBuyers';

function BuyerEditModal({ buyer, onClose }) {
  const { updateBuyer } = useBuyers();
  const [name, setName] = useState(buyer.name);
  const [whatsapp, setWhatsapp] = useState(buyer.whatsapp);
  const [status, setStatus] = useState(buyer.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
  if (!name.trim() || !whatsapp.trim()) {
    alert('Preencha nome e WhatsApp.');
    return;
  }
  
  setLoading(true);
  try {
    console.log('💾 Salvando alterações:', { buyerId: buyer.id, name, whatsapp, status });
    
    await updateBuyer(buyer.id, {
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      status,
    });
    
    console.log('✅ Compra atualizado com sucesso!');
    alert('Comprador atualizado com sucesso!');
    onClose();
  } catch (err) {
    console.error('❌ Erro ao editar:', err);
    alert('Erro ao salvar: ' + (err.message || 'Tente novamente.'));
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
          <h3 className="font-display text-lg text-cream">Editar Comprador</h3>
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
              className="input-dark text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">WhatsApp</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="input-dark text-sm"
            />
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
              <option value="canceled">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-outline text-sm" disabled={loading}>
            Cancelar
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className="flex-1 btn-gold text-sm disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BuyerEditModal;