import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { createBuyer } from '../../services/buyersService';
import { openWhatsApp, generateReservationMessage } from '../../services/whatsappService';
import { useTickets } from '../../hooks/useTickets';

function ReservationForm({ settings }) {
  const { selectedTickets, clearSelection } = useAppContext();
  const { tickets } = useTickets(); // ✅ Para buscar os IDs das cotas
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const ticketPrice = settings?.ticket_price || 15;
  const totalAmount = selectedTickets.length * ticketPrice;

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(settings?.pix_key || '');
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReservation = async () => {
    if (!name.trim() || !whatsapp.trim()) {
      alert('Por favor, preencha nome e WhatsApp.');
      return;
    }

    if (selectedTickets.length === 0) {
      alert('Selecione pelo menos uma cota.');
      return;
    }

    setLoading(true);

    try {
      // ✅ CORREÇÃO: Buscar os IDs das tickets baseado nos números selecionados
      const selectedTicketIds = tickets
        .filter(ticket => selectedTickets.includes(ticket.number))
        .map(ticket => ticket.id);

      console.log('🎫 Números selecionados:', selectedTickets);
      console.log('🎫 IDs encontrados:', selectedTicketIds);

      if (selectedTicketIds.length !== selectedTickets.length) {
        console.error('❌ Nem todas as cotas foram encontradas no banco!');
        alert('Erro ao encontrar algumas cotas. Tente novamente.');
        setLoading(false);
        return;
      }

      // ✅ Criar comprador com os IDs corretos
      await createBuyer(
        { 
          name, 
          whatsapp, 
          totalAmount 
        },
        selectedTicketIds // ✅ Passando os IDs, não os números
      );

      // ✅ Gerar mensagem WhatsApp com os números (não IDs)
      const message = generateReservationMessage(
        name,
        selectedTickets,
        totalAmount,
        settings?.admin_name || 'Samuel'
      );

      // ✅ Abrir WhatsApp
      openWhatsApp(settings?.admin_whatsapp || '+5511999999999', message);

      // ✅ Limpar seleção
      clearSelection();
      setName('');
      setWhatsapp('');
      
      alert('Reserva realizada com sucesso! Redirecionando para o WhatsApp...');
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Erro ao reservar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (selectedTickets.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="reservation-form"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 px-4 pb-40"
    >
      <div className="max-w-md mx-auto">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">
          Seus dados
        </p>

        <div className="glass-card-strong p-6">
          <p className="text-white/30 text-sm mb-6">
            Preencha abaixo para reservar. Confirmo via WhatsApp em até 24h.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/30 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="input-dark"
              />
            </div>
          </div>

          {/* Selected Tickets Summary */}
          <div className="glass-card p-4 mb-4">
            <p className="text-cream text-sm mb-1">
              {selectedTickets.length} cota{selectedTickets.length > 1 ? 's' : ''}: {selectedTickets.join(', ')}
            </p>
            <p className="text-gold-400 font-display text-lg">
              Total: R$ {totalAmount.toFixed(0)}
            </p>
          </div>

          {/* PIX Section */}
          {settings?.pix_key && (
            <div className="bg-green-900/10 border border-green-500/15 rounded-xl p-4 mb-5">
              <p className="text-green-400 text-xs font-medium mb-1">PIX</p>
              <p className="text-white/40 text-xs mb-3">
                Após reservar, envie o comprovante pelo WhatsApp.
              </p>
              <div className="flex items-center gap-3">
                <p className="text-cream text-xs break-all flex-1 font-mono">
                  {settings.pix_key}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={copyPix}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    pixCopied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:border-green-500/30'
                  }`}
                >
                  {pixCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      copiar chave Pix
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleReservation}
            disabled={loading}
            className={`w-full btn-gold text-center py-4 text-base ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processando...' : 'reservar e pagar via PIX'}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

export default ReservationForm;