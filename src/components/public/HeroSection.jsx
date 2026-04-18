import { motion } from 'framer-motion';

function HeroSection({ settings }) {
  const formatRaffleDate = () => {
    if (!settings?.raffle_date) return '';
    const date = new Date(settings.raffle_date + 'T00:00:00');
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Ambient Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Top Badge - Menor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 glass-card mb-6"
        >
          <div className="w-1 h-1 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-gold-400 font-medium">
            Rifa Oficial • Casamento 2026
          </span>
        </motion.div>

        {/* Main Title - Menor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-4"
        >
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-cream leading-tight">
            Um violão.
          </h1>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl italic text-gold-400 leading-tight my-1">
            Muita sorte.
          </h1>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-cream leading-tight">
            Um amor.
          </h1>
        </motion.div>

        {/* Subtitle - Mais compacto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/30 text-xs mb-8"
        >
          300 cotas • R$ 15 cada • sorteio {formatRaffleDate()}
        </motion.p>

        {/* ✅ Info cards removidos - aparecem apenas na seção StatsCards abaixo */}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-white/10 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gold-400/50 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;