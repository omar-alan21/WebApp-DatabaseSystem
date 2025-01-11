import React, { createContext, useState } from 'react';

// Create the Context
export const AppContext = createContext();

// Create the Provider
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
