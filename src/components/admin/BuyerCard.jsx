import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Edit2, Trash2, Check, MessageCircle, X } from 'lucide-react';
import { openWhatsApp, generateChargeMessage } from '../../services/whatsappService';

function BuyerCard({ buyer, settings, isExpanded, onToggle, onStatusChange, onEdit, onDelete }) {
  // ✅ Extração robusta dos números das cotas
  const ticketNumbers = React.useMemo(() => {
    if (!buyer.buyer_tickets || buyer.buyer_tickets.length === 0) {
      return [];
    }
    
    return buyer.buyer_tickets
      .map(bt => {
        if (bt.tickets?.number) return bt.tickets.number;
        if (bt.ticket?.number) return bt.ticket.number;
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a - b);
  }, [buyer.buyer_tickets]);

  const handleCharge = () => {
    const message = generateChargeMessage(buyer.name, ticketNumbers, buyer.total_amount);
    openWhatsApp(buyer.whatsapp, message);
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja remover ${buyer.name} e liberar suas cotas?`)) {
      onDelete();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // ✅ Verifica se é comprador manual pendente (fluxo especial)
  const isManualPending = buyer.source === 'admin' && buyer.status === 'pending';

  return (
    <>
      {/* Card Compacto - Sempre visível */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          {/* Lado Esquerdo: Nome + Valor + Cotas */}
          <div className="flex-1 min-w-0">
            <h4 className="text-cream font-medium text-sm truncate">{buyer.name}</h4>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-gold-400 font-display text-base">
                R${buyer.total_amount.toFixed(0)}
              </p>
              {ticketNumbers.length > 0 && (
                <>
                  <span className="text-white/20">•</span>
                  <p className="text-white/40 text-xs truncate">
                    Cotas: {ticketNumbers.slice(0, 5).join(', ')}
                    {ticketNumbers.length > 5 && ` +${ticketNumbers.length - 5}`}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Lado Direito: Status + Seta */}
          <div className="flex items-center gap-3 ml-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider whitespace-nowrap ${
              buyer.status === 'paid' && 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
              || buyer.status === 'pending' && 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
              || buyer.status === 'canceled' && 'bg-red-400/10 text-red-400/80 border border-red-400/20'
            }`}>
              {buyer.status === 'paid' && 'Pago'}
              {buyer.status === 'pending' && 'Pendente'}
              {buyer.status === 'canceled' && 'Cancelado'}
            </span>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-white/30 shrink-0" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Painel Expansível - Detalhes */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="glass-card-strong p-4 border-t-0 rounded-t-none -mt-2">
              <div className="space-y-3">
                {/* Nome Completo */}
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Nome</p>
                  <p className="text-cream text-sm">{buyer.name}</p>
                </div>

                {/* WhatsApp */}
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">WhatsApp</p>
                  <p className="text-cream text-sm">{buyer.whatsapp}</p>
                </div>

                {/* Cotas */}
                {ticketNumbers.length > 0 && (
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">
                      Cotas ({ticketNumbers.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ticketNumbers.map(num => (
                        <span
                          key={num}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            buyer.status === 'paid'
                              ? 'bg-gold-400/10 text-gold-400/80'
                              : buyer.status === 'pending'
                              ? 'bg-orange-400/10 text-orange-400/80'
                              : 'bg-red-400/5 text-red-400/40 line-through'
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensagem se não tiver cotas */}
                {ticketNumbers.length === 0 && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/30 text-xs">Nenhuma cota vinculada</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Status</p>
                  <p className="text-cream text-sm capitalize">{buyer.status}</p>
                </div>

                {/* Fonte (para debug) */}
                {buyer.source && (
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Origem</p>
                    <p className="text-cream text-sm capitalize">{buyer.source === 'admin' ? 'Cadastro Manual' : 'Site'}</p>
                  </div>
                )}

                {/* Data e Hora */}
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Data da Compra</p>
                  <p className="text-cream text-sm">{formatDate(buyer.created_at)}</p>
                </div>

                {/* Valor Total */}
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Valor Total</p>
                  <p className="text-gold-400 font-display text-lg">R${buyer.total_amount.toFixed(2)}</p>
                </div>

                {/* ✅ AÇÕES CONDICIONAIS */}
                {isManualPending ? (
                  /* 🎯 Fluxo Especial: Manual + Pendente */
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(buyer.id, 'paid', ticketNumbers);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-400/10 text-gold-400 rounded-lg text-xs hover:bg-gold-400/20 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Pago
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(); // ✅ Cancelar = Apagar do sistema
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-400/10 text-red-400 rounded-lg text-xs hover:bg-red-400/20 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancelar
                    </motion.button>
                  </div>
                ) : (
                  /* 🎯 Fluxo Normal: Todos os outros casos */
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    {buyer.status === 'pending' && (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(buyer.id, 'paid', ticketNumbers);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-400/10 text-gold-400 rounded-lg text-xs hover:bg-gold-400/20 transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Marcar como Pago
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCharge();
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Cobrar
                        </motion.button>
                      </>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </motion.button>

                    {buyer.status !== 'canceled' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(buyer.id, 'canceled', ticketNumbers);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-400/5 text-red-400/60 rounded-lg text-xs hover:bg-red-400/10 transition"
                      >
                        <X className="w-3.5 h-3.5" /> Cancelar
                      </motion.button>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-400/5 text-red-400/60 rounded-lg text-xs hover:bg-red-400/10 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Apagar
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BuyerCard;