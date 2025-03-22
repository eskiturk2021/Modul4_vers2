// Контекст уведомлений

import React, { createContext, useState, useCallback, useRef } from 'react';

export const NotificationContext = createContext();

// Типы уведомлений
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  // Хранилище таймеров для отложенного удаления
  const timeoutRefs = useRef({});

  // Добавляет уведомление
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, timeout = 5000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    const notification = {
      id,
      message,
      type,
      timestamp: new Date()
    };

    // Сохраняем новое уведомление в конце массива для правильного порядка
    setNotifications(prev => [...prev, notification]);

    // Автоматическое удаление уведомления через timeout, если задан
    if (timeout > 0) {
      // Сохраняем ссылку на таймер, чтобы его можно было очистить при необходимости
      const timerId = setTimeout(() => {
        removeNotification(id);
        // Очищаем ссылку на таймер после его срабатывания
        if (timeoutRefs.current[id]) {
          delete timeoutRefs.current[id];
        }
      }, timeout);

      timeoutRefs.current[id] = timerId;
    }

    return id;
  }, []);

  // Удаляет уведомление по ID
  const removeNotification = useCallback(id => {
    // Проверяем существование уведомления
    setNotifications(prev => {
      // Если уведомления с таким ID нет, просто возвращаем предыдущее состояние
      const exists = prev.some(notification => notification.id === id);
      if (!exists) {
        return prev;
      }
      return prev.filter(notification => notification.id !== id);
    });

    // Очищаем таймер удаления, если он существует
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  // Очищает все уведомления
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);

    // Очищаем все таймеры
    Object.keys(timeoutRefs.current).forEach(id => {
      clearTimeout(timeoutRefs.current[id]);
    });
    timeoutRefs.current = {};
  }, []);

  // Методы-помощники для разных типов уведомлений
  const showSuccess = useCallback((message, timeout) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, timeout);
  }, [addNotification]);

  const showError = useCallback((message, timeout) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, timeout);
  }, [addNotification]);

  const showWarning = useCallback((message, timeout) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, timeout);
  }, [addNotification]);

  const showInfo = useCallback((message, timeout) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, timeout);
  }, [addNotification]);

  // Обновляет существующее уведомление
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => {
      const index = prev.findIndex(notification => notification.id === id);
      if (index === -1) return prev;

      const newNotifications = [...prev];
      newNotifications[index] = { ...newNotifications[index], ...updates };
      return newNotifications;
    });
  }, []);

  // Очистка всех таймеров при размонтировании компонента
  React.useEffect(() => {
    return () => {
      Object.keys(timeoutRefs.current).forEach(id => {
        clearTimeout(timeoutRefs.current[id]);
      });
    };
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования контекста уведомлений
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};