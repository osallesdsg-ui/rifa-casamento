import { motion } from 'framer-motion';

function CountdownSection({ timeLeft }) {
  const units = [
    { label: 'dias', value: timeLeft?.days || 0 },
    { label: 'horas', value: timeLeft?.hours || 0 },
    { label: 'min', value: timeLeft?.minutes || 0 },
    { label: 'seg', value: timeLeft?.seconds || 0 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-10 px-4"
    >
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 text-center"
          >
            <motion.span
              key={unit.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="block font-display text-2xl text-gold-400"
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span className="text-white/30 text-[10px] uppercase tracking-wider mt-1 block">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default CountdownSection;