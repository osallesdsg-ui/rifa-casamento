import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import { useAppContext } from '../context/AppContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import BuyersTab from '../components/admin/BuyersTab';
import SettingsTab from '../components/admin/SettingsTab';

function Admin() {
  const { isAuthenticated, login, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <AdminLogin onLogin={login} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <Header showLogout={true} onLogout={logout} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-2"
        >
          <h1 className="font-display text-2xl text-cream">
            Painel Administrativo
          </h1>
          <p className="text-white/30 text-sm mt-1">
            Rifa do Violão Eagle CH888
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'buyers', label: 'Compradores' },
            { id: 'settings', label: 'Configurações' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'pill-active'
                  : 'pill-inactive'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'buyers' && <BuyersTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Admin;