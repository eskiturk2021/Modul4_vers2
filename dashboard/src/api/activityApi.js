import apiClient from './apiClient';

/**
 * Получение последних активностей
 * @param {Object} params - Параметры запроса
 * @param {number} params.limit - Количество активностей
 * @param {number} params.offset - Смещение
 * @returns {Promise<Array>} - Список активностей
 */
export const getRecentActivity = async (params = { limit: 10, offset: 0 }) => {
  try {
    const response = await apiClient.get('/activity/recent', { params });

    // Проверяем, пришли ли данные в формате массива
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Если данные пришли в формате объекта с полем activities
    if (response.data && Array.isArray(response.data.activities)) {
      return response.data.activities;
    }

    // Если структура данных отличается от ожидаемой
    console.warn('Неожиданный формат ответа API:', response.data);
    return [];
  } catch (error) {
    console.error('Ошибка получения недавней активности:', error);

    // В случае ошибки пробуем получить моковые данные
    try {
      const mockResponse = await apiClient.get('/activity/recent/mock');
      return Array.isArray(mockResponse.data) ? mockResponse.data : [];
    } catch (mockError) {
      console.error('Ошибка получения моковых данных активности:', mockError);
      return [];
    }
  }
};