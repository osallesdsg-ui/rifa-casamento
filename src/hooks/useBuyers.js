import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllBuyers, 
  createBuyer, 
  updateBuyerStatus, 
  deleteBuyer, 
  updateBuyerInfo // ✅ IMPORTAÇÃO ADICIONADA AQUI
} from '../services/buyersService';

export const useBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBuyers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllBuyers();
      setBuyers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar e liberar cotas expiradas (12h)
  useEffect(() => {
    const checkExpiredReservations = async () => {
      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

      const expiredBuyers = buyers.filter(buyer => {
        const createdAt = new Date(buyer.created_at);
        return buyer.status === 'pending' && createdAt < twelveHoursAgo;
      });

      for (const buyer of expiredBuyers) {
        await deleteBuyer(buyer.id);
      }

      if (expiredBuyers.length > 0) {
        await loadBuyers();
      }
    };

    const interval = setInterval(checkExpiredReservations, 5 * 60 * 1000);
    
    if (buyers.length > 0) {
      checkExpiredReservations();
    }

    return () => clearInterval(interval);
  }, [buyers, loadBuyers]);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  const addBuyer = async (buyerData, ticketIds, status = 'pending', source = 'web') => {
    await createBuyer(buyerData, ticketIds, status, source);
    await loadBuyers();
  };

  const changeStatus = async (buyerId, status, ticketNumbers) => {
    await updateBuyerStatus(buyerId, status, ticketNumbers);
    await loadBuyers();
  };

  const removeBuyer = async (buyerId) => {
    await deleteBuyer(buyerId);
    await loadBuyers();
  };

  // ✅ Função de edição que estava faltando
  const updateBuyer = async (buyerId, updates) => {
  console.log('🔄 updateBuyer - Chamando updateBuyerInfo...');
  await updateBuyerInfo(buyerId, updates);
  console.log('🔄 updateBuyer - Recarregando lista...');
  await loadBuyers();
  console.log('✅ updateBuyer - Lista recarregada');
};

  return { 
    buyers, 
    loading, 
    error, 
    loadBuyers, 
    addBuyer, 
    changeStatus, 
    removeBuyer, 
    updateBuyer 
  };
};

export default useBuyers;