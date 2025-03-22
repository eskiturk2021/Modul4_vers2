// Контекст аутентификации
import React, { createContext, useState, useEffect } from 'react';
import { login, getProfile } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Ошибка проверки авторизации:', err);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция для авторизации
  const handleLogin = async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const { token, user: userData } = await login(email, password);

      localStorage.setItem('authToken', token);
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError(err.response?.data?.detail || 'Ошибка авторизации');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};