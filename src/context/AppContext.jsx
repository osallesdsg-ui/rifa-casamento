import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const selectTicket = useCallback((number) => {
    setSelectedTickets(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      }
      return [...prev, number];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTickets([]);
  }, []);

  const login = useCallback((password) => {
    if (password === '0912') {
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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};