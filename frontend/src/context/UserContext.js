import React, { createContext, useState, useContext } from 'react';
const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const login = (userData) => {
    setCurrentUser(userData);
  };
  const logout = () => {
    setCurrentUser(null);
  };
  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};