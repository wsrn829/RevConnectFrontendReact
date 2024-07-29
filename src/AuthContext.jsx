import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    userID: null,
    username: null,
    isLoggedIn: false,
  });

  const login = (token) => {
    const decoded = jwtDecode(token);
    setAuth({
      token,
      userID: decoded.userID,
      username: decoded.username,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setAuth({
      token: null,
      userID: null,
      username: null,
      isLoggedIn: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
