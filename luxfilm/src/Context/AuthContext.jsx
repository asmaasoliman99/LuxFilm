import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const login = useCallback((email, password) => {
    const loggedUser = authService.loginUser(email, password);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

 const updateUser = useCallback((updatedData) => {
  const users = JSON.parse(localStorage.getItem('luxfilm_users') || '[]');

  const idx = users.findIndex((u) => u.id === user?.id);

  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updatedData };

    localStorage.setItem('luxfilm_users', JSON.stringify(users));

    const { password: _, ...sessionUser } = users[idx];

    localStorage.setItem('luxfilm_session', JSON.stringify(sessionUser));

    setUser(sessionUser);

    return sessionUser;
  }

  throw new Error('User not found');
}, [user]);
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
