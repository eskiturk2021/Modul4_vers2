// Хук для выполнения запросов
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

/**
 * Хук для выполнения HTTP запросов с обработкой состояния загрузки и ошибок
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции запроса
 * @param {string} options.method - HTTP метод (GET, POST, PUT, DELETE)
 * @param {Object} options.params - Параметры запроса
 * @param {Object} options.data - Данные для отправки
 * @param {boolean} options.immediate - Выполнять запрос сразу
 * @param {Function} options.onSuccess - Callback при успешном запросе
 * @param {Function} options.onError - Callback при ошибке
 * @returns {Object} Объект с данными и методами для работы с запросом
 */
const useFetch = (url, options = {}) => {
  const {
    method = 'GET',
    params = {},
    data = null,
    immediate = true,
    onSuccess = () => {},
    onError = () => {},
  } = options;

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для выполнения запроса
  const execute = useCallback(async (customData = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        params,
      };

      // Если есть данные для отправки, добавляем их в конфиг
      if (customData || data) {
        config.data = customData || data;
      }

      const result = await apiClient(config);
      setResponse(result.data);
      onSuccess(result.data);
      return result.data;
    } catch (err) {
      // Обработка ошибок
      let errorMessage = 'Произошла ошибка при выполнении запроса';

      if (err.response) {
        // Ошибка ответа от сервера
        errorMessage = err.response.data?.message ||
                      err.response.data?.error ||
                      `Ошибка сервера: ${err.response.status}`;
      } else if (err.request) {
        // Ошибка сети
        errorMessage = 'Не удалось соединиться с сервером. Проверьте подключение к интернету.';
      } else {
        // Прочие ошибки
        errorMessage = err.message;
      }

      setError(errorMessage);
      onError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, method, params, data, onSuccess, onError]);

  // Выполняем запрос при монтировании компонента, если immediate=true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Сброс состояния
  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    response,
    isLoading,
    error,
    execute,
    reset
  };
};

export default useFetch;