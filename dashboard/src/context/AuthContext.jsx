// Контекст аутентификации
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login, getProfile, refreshToken } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для проверки авторизации, вынесенная для переиспользования
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return false;
    }

    // Проверка срока действия токена
    if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
      try {
        // Пробуем обновить токен
        const refreshData = await refreshToken();
        localStorage.setItem('authToken', refreshData.token);

        // Устанавливаем новое время истечения (например, +1 час)
        const newExpiry = new Date();
        newExpiry.setHours(newExpiry.getHours() + 1);
        localStorage.setItem('tokenExpiry', newExpiry.toISOString());
      } catch (err) {
        console.error('Ошибка обновления токена:', err);
        setError('Сессия истекла, пожалуйста, войдите снова');
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    }

    try {
      const userData = await getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Ошибка проверки авторизации:', err);
      setError('Ошибка проверки авторизации');
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Функция для авторизации
  const handleLogin = async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const { token, user: userData, expiresIn } = await login(email, password);

      // Сохраняем токен и устанавливаем время истечения
      localStorage.setItem('authToken', token);

      // Устанавливаем время истечения токена, если API его предоставляет
      if (expiresIn) {
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
      } else {
        // Если API не предоставляет время истечения, устанавливаем по умолчанию (например, 1 час)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
      }

      setUser(userData);
      setIsAuthenticated(true);
      setError(null);

      return true;
    } catch (err) {
      console.error('Ошибка авторизации:', err);

      // Более надежная обработка ошибок
      let errorMessage = 'Ошибка авторизации';
      if (err.response) {
        // Ошибки от API
        errorMessage = err.response.data?.detail ||
                       err.response.data?.message ||
                       err.response.data?.error ||
                       `Ошибка сервера: ${err.response.status}`;
      } else if (err.request) {
        // Ошибки сети
        errorMessage = 'Сервер недоступен. Проверьте подключение к интернету.';
      } else {
        // Прочие ошибки
        errorMessage = err.message || 'Неизвестная ошибка авторизации';
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    checkAuth // Экспортируем функцию для возможности вызова извне
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};