// API для работы с клиентами
import apiClient from './apiClient';

/**
 * Получение списка клиентов с фильтрацией и пагинацией
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {string} params.search - Поисковый запрос
 * @param {string} params.status - Фильтр по статусу
 * @param {string} params.sortBy - Поле для сортировки
 * @param {string} params.sortOrder - Порядок сортировки (asc/desc)
 * @returns {Promise<Object>} - Список клиентов и информация о пагинации
 */
export const getCustomers = async (params = {}) => {
  try {
    const response = await apiClient.get('/customers', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка получения списка клиентов:', error);
    throw error;
  }
};

/**
 * Получение информации о конкретном клиенте
 * @param {string} customerId - ID клиента
 * @returns {Promise<Object>} - Информация о клиенте
 */
export const getCustomer = async (customerId) => {
  try {
    const response = await apiClient.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения информации о клиенте ${customerId}:`, error);
    throw error;
  }
};

/**
 * Создание нового клиента
 * @param {Object} customerData - Данные клиента
 * @returns {Promise<Object>} - Созданный клиент
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания клиента:', error);
    throw error;
  }
};

/**
 * Обновление информации о клиенте
 * @param {string} customerId - ID клиента
 * @param {Object} customerData - Новые данные клиента
 * @returns {Promise<Object>} - Обновленный клиент
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await apiClient.put(`/customers/${customerId}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Ошибка обновления клиента ${customerId}:`, error);
    throw error;
  }
};

/**
 * Удаление клиента
 * @param {string} customerId - ID клиента
 * @returns {Promise<Object>} - Результат удаления
 */
export const deleteCustomer = async (customerId) => {
  try {
    const response = await apiClient.delete(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка удаления клиента ${customerId}:`, error);
    throw error;
  }
};

/**
 * Получение отчета по клиенту
 * @param {string} customerId - ID клиента
 * @returns {Promise<Object>} - Отчет по клиенту
 */
export const getCustomerReport = async (customerId) => {
  try {
    const response = await apiClient.get(`/customers/${customerId}/report`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения отчета по клиенту ${customerId}:`, error);
    throw error;
  }
};

/**
 * Экспорт списка клиентов
 * @param {Object} params - Параметры экспорта
 * @param {string} params.format - Формат экспорта (csv, xlsx)
 * @param {string} params.dateFrom - Начальная дата (YYYY-MM-DD)
 * @param {string} params.dateTo - Конечная дата (YYYY-MM-DD)
 * @param {string} params.status - Фильтр по статусу
 * @returns {Promise<Object>} - URL для скачивания файла
 */
export const exportCustomers = async (params = {}) => {
  try {
    const response = await apiClient.get('/customers/export', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка экспорта клиентов:', error);
    throw error;
  }
};