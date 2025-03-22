// Компонент ленты активности
import React from 'react';
import { Link } from 'react-router-dom';
import './ActivityFeed.css';

// Иконки для разных типов активности
const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'appointment':
      return (
        <div className="activity-icon appointment">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      );
    case 'customer':
      return (
        <div className="activity-icon customer">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      );
    case 'document':
      return (
        <div className="activity-icon document">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      );
    default:
      return (
        <div className="activity-icon default">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      );
  }
};

const ActivityFeed = ({ activities }) => {
  // Если нет активностей, показываем соответствующее сообщение
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-feed empty">
        <p className="no-activity">Нет недавней активности</p>
      </div>
    );
  }

  // Форматирование времени активности
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'только что';
    } else if (diffMin < 60) {
      return `${diffMin} мин. назад`;
    } else if (diffHour < 24) {
      return `${diffHour} ч. назад`;
    } else if (diffDay < 7) {
      return `${diffDay} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  return (
    <div className="activity-feed">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <ActivityIcon type={activity.type} />

          <div className="activity-content">
            <div className="activity-message">
              {activity.customer && (
                <Link to={`/customers/${activity.customer.id}`} className="customer-link">
                  {activity.customer.name}
                </Link>
              )}
              <span className="message-text">{activity.message}</span>
            </div>

            <div className="activity-time">
              {formatTime(activity.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;