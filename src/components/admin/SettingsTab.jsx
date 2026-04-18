import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';

function SettingsTab() {
  const { settings, update, loading } = useSettings();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await update(formData);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-white/20 text-sm">Carregando...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-strong p-6"
    >
      <h3 className="font-display text-lg text-cream mb-6">Configurações</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Data do Sorteio</label>
          <input
            type="date"
            value={formData.raffle_date || ''}
            onChange={(e) => handleChange('raffle_date', e.target.value)}
            className="input-dark text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Horário do Sorteio</label>
          <input
            type="time"
            value={formData.raffle_time || ''}
            onChange={(e) => handleChange('raffle_time', e.target.value)}
            className="input-dark text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Chave Pix</label>
          <input
            type="text"
            value={formData.pix_key || ''}
            onChange={(e) => handleChange('pix_key', e.target.value)}
            placeholder="sua-chave-pix"
            className="input-dark text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Nome do Administrador</label>
          <input
            type="text"
            value={formData.admin_name || ''}
            onChange={(e) => handleChange('admin_name', e.target.value)}
            placeholder="Samuel"
            className="input-dark text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">WhatsApp do Admin</label>
          <input
            type="tel"
            value={formData.admin_whatsapp || ''}
            onChange={(e) => handleChange('admin_whatsapp', e.target.value)}
            placeholder="+5511999999999"
            className="input-dark text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">Valor da Cota (R$)</label>
          <input
            type="number"
            value={formData.ticket_price || 15}
            onChange={(e) => handleChange('ticket_price', parseFloat(e.target.value))}
            className="input-dark text-sm"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full btn-gold text-sm mt-2"
        >
          Salvar Configurações
        </motion.button>
      </div>
    </motion.div>
  );
}

export default SettingsTab;