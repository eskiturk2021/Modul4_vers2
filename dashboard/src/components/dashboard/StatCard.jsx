// Компонент карточки статистики
import React from 'react';
import './StatCard.css';

// SVG иконки для карточек
const icons = {
  users: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  'user-plus': (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  ),
  repeat: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
      <polyline points="7 23 3 19 7 15"></polyline>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
};

const StatCard = ({ title, value, trend, icon }) => {
  const renderIcon = () => {
    if (icons[icon]) {
      return icons[icon];
    }

    // Иконка по умолчанию
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    );
  };

  const renderTrend = () => {
    if (!trend) return null;

    const { direction, value } = trend;

    const trendIcons = {
      up: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      ),
      down: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      ),
      same: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )
    };

    const trendClasses = {
      up: 'trend-up',
      down: 'trend-down',
      same: 'trend-same'
    };

    return (
      <div className={`trend ${trendClasses[direction] || ''}`}>
        {trendIcons[direction]}
        <span>{value}%</span>
      </div>
    );
  };

  return (
    <div className="stat-card">
      <div className="stat-icon">
        {renderIcon()}
      </div>

      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">{value}</div>
        {renderTrend()}
      </div>
    </div>
  );
};

export default StatCard;