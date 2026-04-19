import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export function AppProvider({ children }) {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar seleção do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedTickets');
    if (saved) {
      try {
        setSelectedTickets(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar cotas salvas:', e);
      }
    }
  }, []);

  // Salvar seleção no localStorage
  useEffect(() => {
    localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets));
  }, [selectedTickets]);

  const selectTicket = useCallback((ticketNumber) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketNumber)) {
        return prev.filter(n => n !== ticketNumber);
      }
      return [...prev, ticketNumber];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTickets([]);
    localStorage.removeItem('selectedTickets');
  }, []);

  const login = useCallback((password) => {
    if (password === '092') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const value = {
    selectedTickets,
    selectTicket,
    clearSelection,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;