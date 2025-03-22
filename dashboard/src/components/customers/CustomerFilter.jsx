// Компонент фильтров для клиентов
import React, { useState, useEffect } from 'react';
import './CustomerFilter.css';

const CustomerFilter = ({ filters, onFilterChange }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'created_at');
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || 'desc');

  // Применяем поиск с задержкой для уменьшения количества запросов
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        handleFilterChange('search', searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Обработчик изменения фильтров
  const handleFilterChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  // Обработчик сброса фильтров
  const handleReset = () => {
    setSearchValue('');
    setStatus('');
    setSortBy('created_at');
    setSortOrder('desc');

    onFilterChange({
      search: '',
      status: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="customer-filter">
      <div className="filter-row">
        <div className="filter-group search-filter">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Поиск по имени, email или телефону"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchValue && (
              <button
                className="clear-search"
                onClick={() => setSearchValue('')}
                title="Очистить поиск"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Статус</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleFilterChange('status', e.target.value);
            }}
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
            <option value="new">Новые</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div className="filter-group sort-filter">
          <label htmlFor="sort-by">Сортировка</label>
          <div className="sort-controls">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                handleFilterChange('sortBy', e.target.value);
              }}
            >
              <option value="created_at">Дата создания</option>
              <option value="name">Имя</option>
              <option value="last_visit">Последний визит</option>
            </select>

            <button
              className={`sort-order-toggle ${sortOrder === 'asc' ? 'asc' : 'desc'}`}
              onClick={() => {
                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                setSortOrder(newOrder);
                handleFilterChange('sortOrder', newOrder);
              }}
              title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                {sortOrder === 'asc' ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="filter-actions">
          <button
            className="reset-filters"
            onClick={handleReset}
            title="Сбросить фильтры"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Сбросить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilter;