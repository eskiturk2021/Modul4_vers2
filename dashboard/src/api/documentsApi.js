// API для работы с документами
import apiClient from './apiClient';

/**
 * Получение документов клиента
 * @param {string} customerId - ID клиента
 * @returns {Promise<Array>} - Список документов клиента
 */
export const getCustomerDocuments = async (customerId) => {
  try {
    const response = await apiClient.get(`/customers/${customerId}/documents`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения документов клиента ${customerId}:`, error);
    throw error;
  }
};

/**
 * Получение информации о документе
 * @param {string} documentId - ID документа
 * @returns {Promise<Object>} - Информация о документе
 */
export const getDocument = async (documentId) => {
  try {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка получения информации о документе ${documentId}:`, error);
    throw error;
  }
};

/**
 * Загрузка документа
 * @param {FormData} formData - Данные документа и форма
 * @returns {Promise<Object>} - Результат загрузки
 */
export const uploadDocument = async (formData) => {
  try {
    const response = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки документа:', error);
    throw error;
  }
};

/**
 * Удаление документа
 * @param {string} documentId - ID документа
 * @returns {Promise<Object>} - Результат удаления
 */
export const deleteDocument = async (documentId) => {
  try {
    const response = await apiClient.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка удаления документа ${documentId}:`, error);
    throw error;
  }
};

/**
 * Поиск документов
 * @param {Object} params - Параметры поиска
 * @param {string} params.query - Поисковый запрос
 * @param {string} params.customerId - ID клиента (опционально)
 * @returns {Promise<Object>} - Результаты поиска
 */
export const searchDocuments = async (params) => {
  try {
    const response = await apiClient.get('/documents/search', { params });
    return response.data;
  } catch (error) {
    console.error('Ошибка поиска документов:', error);
    throw error;
  }
};