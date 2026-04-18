import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, MessageCircle, X, RefreshCw } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import { useBuyers } from '../../hooks/useBuyers';
import { useSettings } from '../../hooks/useSettings';
import { openWhatsApp, generateChargeMessage } from '../../services/whatsappService';

function AdminDashboard() {
  const { tickets, loadTickets } = useTickets();
  const { buyers, changeStatus, loadBuyers } = useBuyers();
  const { settings } = useSettings();
  const [timeLeft, setTimeLeft] = useState({});
  const [syncing, setSyncing] = useState(false);

  // Força sincronização manual
  const handleSync = async () => {
    setSyncing(true);
    await Promise.all([loadBuyers(), loadTickets()]);
    setTimeout(() => setSyncing(false), 1000);
  };

  // Timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const twelveHours = 12 * 60 * 60 * 1000;
      const newTimeLeft = {};

      buyers.forEach(buyer => {
        if (buyer.status === 'pending') {
          const createdAt = new Date(buyer.created_at);
          const expiresAt = new Date(createdAt.getTime() + twelveHours);
          const remaining = expiresAt - now;

          if (remaining > 0) {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            newTimeLeft[buyer.id] = { hours, minutes, seconds, total: remaining };
          }
        }
      });
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [buyers]);

  // ✅ CÁLCULO SEGURO: Baseado em buyers para dinheiro, tickets para contagem
  const totalRaised = buyers
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const totalPending = buyers
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const stats = {
    paid: tickets.filter(t => t.status === 'paid').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    available: tickets.filter(t => t.status === 'available').length,
    total: 300, // Ou use settings?.total_tickets
  };

  const goal = 4500;
  const remaining = Math.max(goal - totalRaised, 0);

  const paidPercentage = Math.min((totalRaised / goal) * 100, 100);
  const pendingPercentage = Math.min((totalPending / goal) * 100, 100);

  const pendingBuyers = buyers.filter(b => b.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header com Sync */}
      <div className="flex justify-between items-center">
        <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider">Visão Geral</h2>
        <button
          onClick={handleSync}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            syncing ? 'bg-white/10 text-white/50' : 'bg-gold-400/10 text-gold-400 hover:bg-gold-400/20'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          Sincronizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider">Arrecadado</p>
          <p className="text-gold-400 font-display text-xl mt-1">R${totalRaised.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider">Pendente</p>
          <p className="text-cream/60 font-display text-xl mt-1">R${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider">Meta</p>
          <p className="text-cream font-display text-xl mt-1">R${goal.toLocaleString('pt-BR')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider">Falta</p>
          <p className="text-cream/60 font-display text-xl mt-1">R${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4">
        <h4 className="text-white/50 text-xs mb-3">Progresso Detalhado</h4>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
          <motion.div initial={{ width: 0 }} animate={{ width: `${paidPercentage}%` }} className="h-full bg-gold-gradient transition-all duration-1000" />
          <motion.div initial={{ width: 0 }} animate={{ width: `${pendingPercentage}%` }} className="h-full bg-white/10 transition-all duration-1000" />
          <div className="flex-1" />
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gold-400" />
            <span className="text-white/40">Pagas ({stats.paid})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/15" />
            <span className="text-white/30">Pendentes ({stats.pending})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/5" />
            <span className="text-white/20">Livres ({stats.available})</span>
          </div>
        </div>
      </motion.div>

      {/* Timer Section */}
      {pendingBuyers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 border-l-4 border-orange-400/50">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-orange-400" />
            <h4 className="text-orange-400 text-xs font-medium uppercase tracking-wider">
              Reservas Pendentes ({pendingBuyers.length})
            </h4>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide pr-1">
            {pendingBuyers.map(buyer => {
              const ticketNumbers = buyer.buyer_tickets?.map(bt => bt.tickets?.number).filter(Boolean) || [];
              const time = timeLeft[buyer.id];
              const isExpiringSoon = time && time.total < 2 * 60 * 60 * 1000;

              const handleCharge = () => {
                const msg = generateChargeMessage(buyer.name, ticketNumbers, buyer.total_amount);
                openWhatsApp(buyer.whatsapp, msg);
              };

              return (
                <div key={buyer.id} className={`p-3 rounded-lg transition-colors ${isExpiringSoon ? 'bg-red-400/10 border border-red-400/20' : 'bg-white/5 border border-white/5'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-cream text-sm font-medium truncate">{buyer.name}</p>
                      <p className="text-white/30 text-[10px]">{ticketNumbers.length} cota(s) • R${buyer.total_amount.toFixed(2)}</p>
                    </div>
                    {time && (
                      <div className={`text-right shrink-0 ${isExpiringSoon ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
                        <p className="text-xs font-mono font-medium">
                          {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => changeStatus(buyer.id, 'paid', ticketNumbers)} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gold-400/10 text-gold-400 rounded-lg text-[10px] font-medium hover:bg-gold-400/20 transition">
                      <Check className="w-3.5 h-3.5" /> Pago
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={handleCharge} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-white/5 text-white/40 rounded-lg text-[10px] font-medium hover:bg-white/10 transition">
                      <MessageCircle className="w-3.5 h-3.5" /> Cobrar
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => changeStatus(buyer.id, 'canceled', ticketNumbers)} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-red-400/5 text-red-400/70 rounded-lg text-[10px] font-medium hover:bg-red-400/10 transition">
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AdminDashboard;