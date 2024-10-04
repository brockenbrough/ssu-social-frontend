import React, { createContext, useState, useEffect } from 'react';

export const TokenRefreshContext = createContext();

export const TokenRefreshProvider = ({ children }) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(() => {
    const savedTime = localStorage.getItem('lastRefreshTime');
    return savedTime ? parseInt(savedTime, 10) : Date.now();
  });

  // Save lastRefreshTime to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastRefreshTime', lastRefreshTime.toString());
  }, [lastRefreshTime]);

  return (
    <TokenRefreshContext.Provider value={{ lastRefreshTime, setLastRefreshTime }}>
      {children}
    </TokenRefreshContext.Provider>
  );
};
