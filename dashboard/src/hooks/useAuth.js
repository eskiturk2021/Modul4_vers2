// Хук для работы с аутентификацией
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Хук для работы с аутентификацией, предоставляет доступ к контексту AuthContext
 * @returns {Object} Объект с данными и методами для работы с аутентификацией
 * @property {Object} user - Данные текущего пользователя
 * @property {boolean} isAuthenticated - Флаг, указывающий, аутентифицирован ли пользователь
 * @property {boolean} isLoading - Флаг загрузки
 * @property {string} error - Ошибка аутентификации (если есть)
 * @property {Function} login - Функция для входа в систему
 * @property {Function} logout - Функция для выхода из системы
 * @property {Function} checkAuth - Функция для проверки статуса аутентификации
 */
const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};

export default useAuth;
