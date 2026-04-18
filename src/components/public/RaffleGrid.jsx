import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

function RaffleGrid({ tickets }) {
  const { selectedTickets, selectTicket } = useAppContext();

  const getTicketStatus = (ticket) => {
    if (selectedTickets.includes(ticket.number)) return 'selected';
    if (ticket.status === 'paid') return 'paid';
    if (ticket.status === 'pending') return 'pending';
    return 'available';
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 px-4 pb-32"
    >
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
          {tickets.map((ticket, index) => {
            const status = getTicketStatus(ticket);

            return (
              <motion.button
                key={ticket.number}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  delay: Math.min(index * 0.002, 0.1),
                  duration: 0.15,
                  ease: "easeOut"
                }}
                whileTap={status !== 'pending' && status !== 'paid' ? { scale: 0.9 } : {}}
                onClick={() => {
                  if (status === 'available' || status === 'selected') {
                    selectTicket(ticket.number);
                  }
                }}
                disabled={status === 'pending' || status === 'paid'}
                className={`
                  relative w-full aspect-square rounded-xl font-sans text-sm font-medium
                  transition-all duration-200
                  ${status === 'available' && 'ticket-available'}
                  ${status === 'selected' && 'ticket-selected'}
                  ${status === 'pending' && 'ticket-pending'}
                  ${status === 'paid' && 'ticket-paid'}
                `}
              >
                <span className="relative z-10">{ticket.number}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Mensagem se não houver tickets */}
        {tickets.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">
            Nenhuma cota encontrada com este filtro
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default RaffleGrid;