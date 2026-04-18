import { motion } from 'framer-motion';

function RaffleFilters({ filter, onFilterChange }) {
  const filters = ['todas', 'disponíveis', 'vendidas'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-6 px-4"
    >
      <div className="max-w-md mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-white/6" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            Escolha suas cotas
          </p>
          <div className="h-px flex-1 bg-white/6" />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map(filterName => (
            <motion.button
              key={filterName}
              whileTap={{ scale: 0.96 }}
              onClick={() => onFilterChange(filterName)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                filter === filterName ? 'pill-active' : 'pill-inactive'
              }`}
            >
              {filterName}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default RaffleFilters;