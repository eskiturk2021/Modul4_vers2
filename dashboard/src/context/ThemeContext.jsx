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

export const ThemeProvider = ({ children }) => {
  // Используем localStorage для сохранения темы
  const storedTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
  const [theme, setThemeState] = useState(storedTheme);
  const [systemTheme, setSystemTheme] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  });

  // Применяет переменные темы к документу
  const applyTheme = useCallback((themeName) => {
    const themeVars = themeVariables[themeName];
    if (themeVars) {
      Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    }
  }, []);

  // Устанавливает тему и сохраняет в localStorage
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  // Переключает между светлой и темной темой
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Отслеживаем изменение системной темы
  useEffect(() => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e) => {
        setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      };

      // Добавляем слушатель
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Для старых браузеров
        mediaQuery.addListener(handleChange);
      }

      // Очистка при размонтировании
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // Для старых браузеров
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  // Применяем тему при изменении theme или systemTheme
  useEffect(() => {
    // Если выбрана системная тема, применяем системную, иначе выбранную пользователем
    const currentTheme = theme === THEMES.SYSTEM ? systemTheme : theme;
    applyTheme(currentTheme);
  }, [theme, systemTheme, applyTheme]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    systemTheme,
    isCurrentThemeDark: theme === THEMES.DARK || (theme === THEMES.SYSTEM && systemTheme === THEMES.DARK)
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