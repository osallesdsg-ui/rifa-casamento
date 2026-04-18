import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Senha incorreta');
    }
  };

  return (
    <div className="glass-card-strong p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-gold-400" />
        </div>
        <h2 className="font-display text-xl text-cream">Painel Admin</h2>
        <p className="text-white/30 text-sm mt-2">Digite a senha para acessar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="input-dark text-center tracking-[0.3em]"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400/80 text-xs mt-2 text-center"
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full btn-gold text-sm"
        >
          Entrar
        </motion.button>
      </form>
    </div>
  );
}

export default AdminLogin;