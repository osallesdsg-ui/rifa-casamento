import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useBuyers } from '../../hooks/useBuyers';
import { useSettings } from '../../hooks/useSettings';
import BuyerCard from './BuyerCard';
import BuyerEditModal from './BuyerEditModal';
import AddBuyerModal from './AddBuyerModal';

function BuyersTab() {
  const { buyers, changeStatus, removeBuyer } = useBuyers();
  const { settings } = useSettings();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [expandedBuyerId, setExpandedBuyerId] = useState(null);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ✅ Filtrar E ordenar compradores
  const filteredBuyers = buyers
    .filter(buyer => {
      const matchesSearch = buyer.name.toLowerCase().includes(search.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === 'Pagos') matchesStatus = buyer.status === 'paid';
      else if (statusFilter === 'Pendentes') matchesStatus = buyer.status === 'pending';
      else if (statusFilter === 'Cancelados') matchesStatus = buyer.status === 'canceled';
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // ✅ Prioridade: pending + admin no topo
      const aPriority = (a.source === 'admin' && a.status === 'pending') ? 0 : 
                        (a.status === 'pending' ? 1 : a.status === 'paid' ? 2 : 3);
      const bPriority = (b.source === 'admin' && b.status === 'pending') ? 0 : 
                        (b.status === 'pending' ? 1 : b.status === 'paid' ? 2 : 3);
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Dentro da mesma prioridade, ordenar por data (mais recente primeiro)
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const toggleExpand = (buyerId) => {
    setExpandedBuyerId(expandedBuyerId === buyerId ? null : buyerId);
  };

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          {/* ✅ Ícone com pointer-events-none e z-10 para não bloquear o input */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none z-10" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome"
            /* ✅ pl-11 (2.75rem) dá mais espaço que pl-10, w-full garante largura total */
            className="input-dark pl-11 text-sm w-full"
          />
        </div>

        {/* ✅ shrink-0 evita que o botão encolha em telas menores */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="btn-gold text-xs px-4 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </motion.button>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {['Todos', 'Pagos', 'Pendentes', 'Cancelados'].map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === filter
                ? 'pill-active'
                : 'pill-inactive'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Buyers List - Compacta */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredBuyers.map(buyer => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              settings={settings}
              isExpanded={expandedBuyerId === buyer.id}
              onToggle={() => toggleExpand(buyer.id)}
              onStatusChange={(id, status, numbers) => changeStatus(id, status, numbers)}
              onEdit={() => setEditingBuyer(buyer)}
              onDelete={() => removeBuyer(buyer.id)}
            />
          ))}
        </AnimatePresence>

        {filteredBuyers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/20 text-sm"
          >
            {search || statusFilter !== 'Todos' 
              ? 'Nenhum comprador encontrado com estes filtros'
              : 'Nenhum comprador cadastrado'}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingBuyer && (
          <BuyerEditModal
            buyer={editingBuyer}
            onClose={() => setEditingBuyer(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddBuyerModal onClose={() => setIsAddModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default BuyersTab;