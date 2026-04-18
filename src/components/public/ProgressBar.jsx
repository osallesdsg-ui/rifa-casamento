import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ProgressBar({ totalRaised, goal, stats }) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentage = Math.min((totalRaised / goal) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-6 px-4 max-w-sm mx-auto"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/30 text-xs">
          {percentage.toFixed(1)}% vendido
        </span>
        <span className="text-white/30 text-xs">
          meta: {stats.total}
        </span>
      </div>
      <div className="progress-dark">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${animatedWidth}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="progress-fill"
        />
      </div>
    </motion.section>
  );
}

export default ProgressBar;