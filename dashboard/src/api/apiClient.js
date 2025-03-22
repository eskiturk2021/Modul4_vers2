// Базовый клиент API с авторизацией
import axios from 'axios';

// Создаем базовый экземпляр axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10 секунд
});

// Перехватчик запросов для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('authToken');
    const apiKey = process.env.REACT_APP_API_KEY || localStorage.getItem('apiKey');

    // Если токен есть, добавляем его в заголовок
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Добавляем API ключ, если есть
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов для обновления токена при 401 ошибке
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и запрос не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Если нет refresh токена, перенаправляем на страницу входа
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Делаем запрос на обновление токена
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/refresh`,
          { token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': process.env.REACT_APP_API_KEY || localStorage.getItem('apiKey')
            }
          }
        );

        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);

          // Обновляем заголовок в оригинальном запросе
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

          // Повторяем оригинальный запрос с новым токеном
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError);
        // Если не удалось обновить токен, перенаправляем на страницу входа
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Для других ошибок или если не удалось обновить токен
    return Promise.reject(error);
  }
);

export default apiClient;