// API для работы с записями
import apiClient from './apiClient';

/**
 * Получение предстоящих записей на обслуживание
 * @param {Object} params - Параметры запроса
 * @param {number} params.limit - Количество записей
 * @param {number} params.offset - Смещение
 * @returns {Promise<Array>} - Список предстоящих записей
 */
export const getUpcomingAppointments = async (params = {}) => {
  try {
    const response = await apiClient.get('/appointments/upcoming', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения предстоящих записей:', error);
    throw error;
  }
};

/**
 * Получение информации о записи
 * @param {string} appointmentId - ID записи
 * @returns {Promise<Object>} - Информация о записи
 */
export const getAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения информации о записи ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Создание новой записи
 * @param {Object} appointmentData - Данные записи
 * @returns {Promise<Object>} - Созданная запись
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания записи:', error);
    throw error;
  }
};

/**
 * Обновление информации о записи
 * @param {string} appointmentId - ID записи
 * @param {Object} appointmentData - Новые данные записи
 * @returns {Promise<Object>} - Обновленная запись
 */
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const response = await apiClient.put(`/appointments/${appointmentId}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error(`Ошибка обновления записи ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Отмена записи
 * @param {string} appointmentId - ID записи
 * @returns {Promise<Object>} - Результат отмены
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка отмены записи ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Получение записей для календаря
 * @param {number} year - Год
 * @param {number} month - Месяц (1-12)
 * @returns {Promise<Array>} - Записи для календаря
 */
export const getCalendarAppointments = async (year, month) => {
  try {
    const response = await apiClient.get('/appointments/calendar', {
      params: { year, month }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения записей для календаря (${year}-${month}):`, error);
    throw error;
  }
};