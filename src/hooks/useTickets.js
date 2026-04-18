import { useState, useEffect, useCallback } from 'react';
import { fetchAllTickets, updateTicketStatus, releaseExpiredTickets } from '../services/ticketsService';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(Date.now());

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      await releaseExpiredTickets();
      const data = await fetchAllTickets();
      setTickets(data);
      setLastSync(Date.now());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    
    // ✅ Refresh automático a cada 10 segundos
    const interval = setInterval(loadTickets, 10 * 1000);
    return () => clearInterval(interval);
  }, [loadTickets]);

  const updateStatus = async (ticketId, status, buyerId = null, reservedAt = null, expiresAt = null) => {
    await updateTicketStatus(ticketId, status, buyerId, reservedAt, expiresAt);
    await loadTickets();
  };

  return { tickets, loading, error, loadTickets, updateStatus, lastSync };
};