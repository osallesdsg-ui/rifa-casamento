import { motion } from 'framer-motion';

function StatsCards({ stats, ticketPrice }) {
  const cards = [
    {
      label: 'vendidas',
      value: stats.paid,
    },
    {
      label: 'disponíveis',
      value: stats.available,
    },
    {
      label: 'total',
      value: stats.total,
    },
    {
      label: 'por cota',
      value: `R$${ticketPrice}`,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-6 px-4"
    >
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 text-center"
          >
            <p className="font-display text-2xl text-gold-400">
              {card.value}
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mt-1">
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default StatsCards;