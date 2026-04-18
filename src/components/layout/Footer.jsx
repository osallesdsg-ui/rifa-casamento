import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-8 px-4 border-t border-white/5"
    >
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-display text-cream/60 text-sm">
            Samuel & Isabela
          </span>
          <Heart className="w-3.5 h-3.5 text-gold-400" />
        </div>

        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} • Rifa do Violão Eagle CH888
        </p>
      </div>
    </motion.footer>
  );
}

export default Footer;