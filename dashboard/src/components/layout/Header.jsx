// Компонент шапки
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link to="/" className="header-logo">
          <span className="company-name">Система управления клиентами</span>
        </Link>
      </div>

      <div className="header-right">
        <div className="header-search">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Поиск..."
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="header-actions">
          <button className="action-button notification-button">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge">3</span>
          </button>

          <div className="user-profile">
            <span className="username">{user?.username || 'Пользователь'}</span>
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;