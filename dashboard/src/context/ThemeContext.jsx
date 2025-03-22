// Контекст темы оформления

import React, { createContext, useState, useEffect, useCallback } from 'react';

// Предопределенные темы
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// CSS переменные для каждой темы
const themeVariables = {
  [THEMES.LIGHT]: {
    // Основные цвета
    '--primary-color': '#0066cc',
    '--primary-light': '#3389dd',
    '--primary-dark': '#004c99',
    '--secondary-color': '#718096',
    '--success-color': '#38a169',
    '--danger-color': '#e53e3e',
    '--warning-color': '#f6ad55',
    '--info-color': '#4299e1',

    // Нейтральные оттенки
    '--gray-100': '#f7fafc',
    '--gray-200': '#edf2f7',
    '--gray-300': '#e2e8f0',
    '--gray-400': '#cbd5e0',
    '--gray-500': '#a0aec0',
    '--gray-600': '#718096',
    '--gray-700': '#4a5568',
    '--gray-800': '#2d3748',
    '--gray-900': '#1a202c',

    // Фоны и текст
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f7fafc',
    '--text-primary': '#2d3748',
    '--text-secondary': '#4a5568',
    '--border-color': '#e2e8f0'
  },
  [THEMES.DARK]: {
    // Основные цвета
    '--primary-color': '#4299e1',
    '--primary-light': '#63b3ed',
    '--primary-dark': '#2b6cb0',
    '--secondary-color': '#a0aec0',
    '--success-color': '#48bb78',
    '--danger-color': '#f56565',
    '--warning-color': '#ed8936',
    '--info-color': '#4299e1',

    // Нейтральные оттенки
    '--gray-100': '#1a202c',
    '--gray-200': '#2d3748',
    '--gray-300': '#4a5568',
    '--gray-400': '#718096',
    '--gray-500': '#a0aec0',
    '--gray-600': '#cbd5e0',
    '--gray-700': '#e2e8f0',
    '--gray-800': '#edf2f7',
    '--gray-900': '#f7fafc',

    // Фоны и текст
    '--bg-primary': '#1a202c',
    '--bg-secondary': '#2d3748',
    '--text-primary': '#f7fafc',
    '--text-secondary': '#e2e8f0',
    '--border-color': '#4a5568'
  }
};

export const ThemeContext = createContext();

// Безопасная проверка доступности медиа-запросов
const isMediaQuerySupported = () => {
  return typeof window !== 'undefined' && window.matchMedia;
};

// Безопасное получение системной темы
const getSystemTheme = () => {
  if (!isMediaQuerySupported()) {
    return THEMES.LIGHT; // По умолчанию, если API недоступно
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
};

export const ThemeProvider = ({ children }) => {
  // Используем localStorage для сохранения темы
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('theme') || THEMES.SYSTEM;
    } catch (error) {
      console.error('Ошибка при доступе к localStorage:', error);
      return THEMES.SYSTEM;
    }
  };

  const [theme, setThemeState] = useState(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Применяет переменные темы к документу
  const applyTheme = useCallback((themeName) => {
    // Проверяем, что themeName - это одна из поддерживаемых тем
    if (!Object.values(THEMES).includes(themeName)) {
      themeName = THEMES.LIGHT; // Используем светлую тему по умолчанию
    }

    // Если это системная тема, используем текущую системную тему
    const finalTheme = themeName === THEMES.SYSTEM ? systemTheme : themeName;

    // Проверяем, существует ли такая тема
    const themeVars = themeVariables[finalTheme];
    if (!themeVars) {
      console.error(`Тема '${finalTheme}' не определена`);
      return;
    }

    // Применяем переменные темы
    Object.entries(themeVars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  }, [systemTheme]);

  // Устанавливает тему и сохраняет в localStorage
  const setTheme = useCallback((newTheme) => {
    // Проверяем, что newTheme - это одна из поддерживаемых тем
    if (!Object.values(THEMES).includes(newTheme)) {
      console.error(`Тема '${newTheme}' не поддерживается`);
      newTheme = THEMES.LIGHT; // Используем светлую тему по умолчанию
    }

    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Ошибка при записи в localStorage:', error);
    }
  }, []);

  // Переключает между темами с учетом системной темы
  const toggleTheme = useCallback(() => {
    const currentTheme = theme === THEMES.SYSTEM ? systemTheme : theme;
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  }, [theme, systemTheme, setTheme]);

  // Отслеживаем изменение системной темы
  useEffect(() => {
    if (!isMediaQuerySupported()) {
      return; // Выходим, если API не поддерживается
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    };

    // Единообразно используем современный API, с запасным вариантом для старых браузеров
    try {
      // Современный способ добавления слушателя
      mediaQuery.addEventListener('change', handleChange);

      // Очистка при размонтировании
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch (error) {
      // Для старых браузеров
      mediaQuery.addListener(handleChange);

      // Очистка при размонтировании
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  // Применяем тему при изменении theme или systemTheme
  useEffect(() => {
    // Если выбрана системная тема, применяем системную, иначе выбранную пользователем
    const currentTheme = theme === THEMES.SYSTEM ? systemTheme : theme;
    applyTheme(currentTheme);
  }, [theme, systemTheme, applyTheme]);

  // Получаем актуальную текущую тему (светлая или темная)
  const getCurrentTheme = useCallback(() => {
    return theme === THEMES.SYSTEM ? systemTheme : theme;
  }, [theme, systemTheme]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    systemTheme,
    getCurrentTheme,
    isCurrentThemeDark: getCurrentTheme() === THEMES.DARK
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования контекста темы
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};