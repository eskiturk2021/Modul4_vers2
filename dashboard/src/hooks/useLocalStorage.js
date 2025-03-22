// Хук для работы с localStorage
import { useState, useEffect } from 'react';

/**
 * Хук для работы с localStorage с поддержкой синхронизации между вкладками
 * @param {string} key - Ключ для хранения в localStorage
 * @param {any} initialValue - Начальное значение, если в localStorage ничего не найдено
 * @returns {Array} [storedValue, setValue] - Хранимое значение и функция для его изменения
 */
const useLocalStorage = (key, initialValue) => {
  // Создаем функцию для получения значения из localStorage
  // Это позволяет не выполнять эту логику при каждом рендере
  const readValue = () => {
    try {
      // Получаем значение из localStorage по ключу
      const item = window.localStorage.getItem(key);
      // Если значение существует, парсим JSON, иначе возвращаем initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Ошибка чтения из localStorage для ключа "${key}":`, error);
      return initialValue;
    }
  };

  // Создаем состояние с начальным значением из localStorage
  const [storedValue, setStoredValue] = useState(readValue);

  // Функция для обновления значения в localStorage и состоянии
  const setValue = (value) => {
    try {
      // Позволяем значению быть функцией как в useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Устанавливаем новое значение в состояние
      setStoredValue(valueToStore);

      // Сохраняем значение в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Генерируем событие для синхронизации между вкладками
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueToStore),
        oldValue: JSON.stringify(storedValue),
        storageArea: localStorage,
        url: window.location.href,
      }));
    } catch (error) {
      console.warn(`Ошибка записи в localStorage для ключа "${key}":`, error);
    }
  };

  // Подписываемся на события изменения в localStorage для синхронизации между вкладками
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue) {
        try {
          // Обновляем состояние новым значением
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.warn(`Ошибка парсинга значения из события storage для ключа "${key}":`, error);
        }
      }
    };

    // Добавляем слушатель события
    window.addEventListener('storage', handleStorageChange);

    // Убираем слушатель при размонтировании
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
