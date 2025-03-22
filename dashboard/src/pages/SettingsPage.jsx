// Страница настроек

import React, { useState } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Button from '../components/common/Button';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useContext(ThemeContext) || { theme: 'light', setTheme: () => {} };

  // Функция для изменения активной вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Обработка изменения темы
  const handleThemeChange = (newTheme) => {
    if (setTheme) {
      setTheme(newTheme);
    }
  };

  // Компонент для вкладки Общие настройки
  const GeneralSettings = () => (
    <div className="settings-section">
      <h2>Общие настройки</h2>

      <div className="settings-group">
        <h3>Внешний вид</h3>
        <div className="settings-option">
          <label htmlFor="theme-select">Тема оформления</label>
          <select
            id="theme-select"
            value={theme || 'light'}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
            <option value="system">Системная</option>
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h3>Уведомления</h3>
        <div className="settings-option">
          <label>
            <input type="checkbox" defaultChecked />
            Показывать уведомления в браузере
          </label>
        </div>
        <div className="settings-option">
          <label>
            <input type="checkbox" defaultChecked />
            Звуковые уведомления
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h3>Язык и локализация</h3>
        <div className="settings-option">
          <label htmlFor="language-select">Язык интерфейса</label>
          <select id="language-select" defaultValue="ru">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Компонент для вкладки Настройки профиля
  const ProfileSettings = () => (
    <div className="settings-section">
      <h2>Настройки профиля</h2>

      <div className="settings-group">
        <h3>Личные данные</h3>
        <div className="form-group">
          <label htmlFor="profile-name">Имя</label>
          <input type="text" id="profile-name" defaultValue="Администратор" />
        </div>
        <div className="form-group">
          <label htmlFor="profile-email">Email</label>
          <input type="email" id="profile-email" defaultValue="admin@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="profile-phone">Телефон</label>
          <input type="tel" id="profile-phone" defaultValue="+7 (900) 123-45-67" />
        </div>
      </div>

      <div className="settings-group">
        <h3>Безопасность</h3>
        <Button variant="secondary">Изменить пароль</Button>
      </div>
    </div>
  );

  // Компонент для вкладки Настройки системы
  const SystemSettings = () => (
    <div className="settings-section">
      <h2>Настройки системы</h2>

      <div className="settings-group">
        <h3>Управление услугами</h3>
        <Button variant="secondary">Управление услугами</Button>
      </div>

      <div className="settings-group">
        <h3>Резервное копирование</h3>
        <Button variant="secondary">Создать резервную копию</Button>
      </div>

      <div className="settings-group">
        <h3>Интеграции</h3>
        <div className="settings-option">
          <label>
            <input type="checkbox" defaultChecked />
            Включить интеграцию с календарем
          </label>
        </div>
        <div className="settings-option">
          <label>
            <input type="checkbox" />
            Включить интеграцию с CRM
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Настройки</h1>
        <p>Управление настройками системы</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => handleTabChange('general')}
          >
            Общие
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            Профиль
          </button>
          <button
            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => handleTabChange('system')}
          >
            Система
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'system' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;