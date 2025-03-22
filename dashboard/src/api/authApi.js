// API для аутентификации
import apiClient from './apiClient';

/**
 * Авторизация пользователя
 * @param {string} username - Имя пользователя или email
 * @param {string} password - Пароль
 * @returns {Promise<Object>} - Токен и информация о пользователе
 */
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password });

    // Сохраняем токен в localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw error;
  }
};

/**
 * Обновление токена
 * @returns {Promise<Object>} - Новый токен
 */
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Токен авторизации отсутствует');
    }

    const response = await apiClient.post('/auth/refresh', { token });

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    throw error;
  }
};

/**
 * Получение профиля текущего пользователя
 * @returns {Promise<Object>} - Информация о пользователе
 */
export const getProfile = async () => {
  try {
    // Здесь должен быть эндпоинт для получения профиля пользователя
    // Так как в API не описан такой эндпоинт, предположим его наличие
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    throw error;
  }
};

/**
 * Выход из системы (очистка токенов)
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};