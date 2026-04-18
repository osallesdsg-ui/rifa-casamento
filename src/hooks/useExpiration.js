import { useEffect, useCallback } from 'react';
import { releaseExpiredTickets } from '../services/ticketsService';

export const useExpiration = (enabled = true) => {
  const checkExpired = useCallback(async () => {
    try {
      await releaseExpiredTickets();
    } catch (error) {
      console.error('Error checking expired tickets:', error);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Verificar ao montar
    checkExpired();

    // Verificar a cada 5 minutos
    const interval = setInterval(checkExpired, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled, checkExpired]);
};