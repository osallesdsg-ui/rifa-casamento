import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

function SelectedTicketsBar({ onReserveClick }) {
  const { selectedTickets } = useAppContext();
  const ticketPrice = 15;
  const totalAmount = selectedTickets.length * ticketPrice;
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Formulário está visível quando 30% dele aparecer
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    const formElement = document.getElementById('reservation-form');
    if (formElement) {
      observer.observe(formElement);
    }

    return () => observer.disconnect();
  }, []);

  if (!selectedTickets || selectedTickets.length === 0) {
    return null;
  }

  // Se o formulário está visível, mostra barra diferente
  if (isFormVisible) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-dark-500/95 backdrop-blur-xl border-t border-white/6">
            <div className="max-w-lg mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">
                    {selectedTickets.length} cota{selectedTickets.length > 1 ? 's' : ''} selecionada{selectedTickets.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-gold-400 font-display text-lg">
                    R$ {totalAmount.toFixed(0)}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-outline text-xs px-5 py-3"
                >
                  ver formulário
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Barra normal (quando formulário NÃO está visível)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="bg-dark-500/95 backdrop-blur-xl border-t border-white/6">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">
                  {selectedTickets.length > 0
                    ? `${selectedTickets.length} cota${selectedTickets.length > 1 ? 's' : ''} selecionada${selectedTickets.length > 1 ? 's' : ''}`
                    : 'nenhuma cota selecionada'}
                </p>
                <p className="text-gold-400 font-display text-lg">
                  R$ {totalAmount.toFixed(0)}
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onReserveClick}
                className="btn-gold text-sm px-6 py-3"
              >
                reservar
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SelectedTicketsBar;