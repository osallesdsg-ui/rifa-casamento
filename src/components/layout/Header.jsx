import { motion } from 'framer-motion';
import { Heart, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ showLogout = false, onLogout = null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Início', href: '#hero' },
    { label: 'Cotas', href: '#raffle-grid' },
    { label: 'Prêmio', href: '#gallery' },
    { label: 'Reservar', href: '#reservation-form' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-40 bg-dark-500/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gold-400" />
            <span className="font-display text-cream text-sm">
              Samuel & Isabela
            </span>
          </Link>

          {/* Desktop Nav */}
          {!showLogout && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/40 hover:text-gold-400 text-xs uppercase tracking-wider transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showLogout && onLogout && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white/40 hover:text-red-400 text-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/40 hover:text-cream transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-dark-500/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMenuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 z-40 w-64 h-full bg-dark-400 border-l border-white/5 md:hidden"
      >
        <div className="p-6 pt-20 flex flex-col gap-1">
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-cream/70 hover:text-gold-400 text-sm py-3 border-b border-white/5 transition-colors"
            >
              {item.label}
            </motion.a>
          ))}

          {showLogout && onLogout && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 mt-4 text-red-400/80 text-sm rounded-xl hover:bg-red-400/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair do Painel
            </motion.button>
          )}

          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-white/20 text-xs text-center">
              💛 Casamento 2026
            </p>
          </div>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="h-14" />
    </>
  );
}

export default Header;