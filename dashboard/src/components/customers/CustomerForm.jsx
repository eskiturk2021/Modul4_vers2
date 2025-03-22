// Компонент формы клиента

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import './CustomerForm.css';

/**
 * Компонент формы для создания/редактирования клиента
 * @param {Object} props - Свойства компонента
 * @param {function} props.onSubmit - Функция обработки отправки формы
 * @param {function} props.onCancel - Функция отмены/закрытия формы
 * @param {Object} [props.initialData={}] - Начальные данные для формы (для режима редактирования)
 * @param {boolean} [props.isLoading=false] - Индикатор загрузки
 */
const CustomerForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false
}) => {
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    notes: '',
    ...initialData // Заполняем начальными данными если они есть
  });

  // Состояние ошибок валидации
  const [errors, setErrors] = useState({});

  // Обновление формы при изменении initialData (важно для случаев, когда данные загружаются асинхронно)
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      ...initialData
    }));
  }, [initialData]);

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Сбрасываем ошибку поля при его изменении
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Проверка имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }

    // Проверка email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    // Проверка телефона (простая проверка на наличие символов)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[+\d\s()-]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
    }

    // Проверка года автомобиля (если введен)
    if (formData.vehicle_year) {
      const year = parseInt(formData.vehicle_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.vehicle_year = `Год должен быть между 1900 и ${currentYear + 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация перед отправкой
    if (!validateForm()) {
      return;
    }

    // Вызываем обработчик из props
    onSubmit(formData);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">
            Имя <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Телефон <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="+7 (___) ___-__-__"
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="active">Активный</option>
            <option value="inactive">Неактивный</option>
            <option value="new">Новый</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="vehicle_make">Марка автомобиля</label>
          <input
            type="text"
            id="vehicle_make"
            name="vehicle_make"
            value={formData.vehicle_make}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicle_model">Модель автомобиля</label>
          <input
            type="text"
            id="vehicle_model"
            name="vehicle_model"
            value={formData.vehicle_model}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicle_year">Год выпуска</label>
          <input
            type="text"
            id="vehicle_year"
            name="vehicle_year"
            value={formData.vehicle_year}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.vehicle_year ? 'input-error' : ''}
          />
          {errors.vehicle_year && <div className="error-message">{errors.vehicle_year}</div>}
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="notes">Примечания</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          disabled={isLoading}
          rows={4}
        />
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : initialData.id ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;