// Страница записей

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingAppointments } from '../api/appointmentsApi';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка списка записей
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await getUpcomingAppointments();
        setAppointments(response || []);
      } catch (err) {
        console.error('Ошибка при загрузке записей:', err);
        setError('Не удалось загрузить список записей');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Открытие модального окна для создания записи
  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="title-section">
          <h1>Записи</h1>
          <p>Управление записями клиентов</p>
        </div>

        <div className="actions-section">
          <Button onClick={openCreateModal} variant="primary">
            Создать запись
          </Button>
        </div>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="appointments-content">
          {appointments.length === 0 ? (
            <div className="no-data-message">
              <p>Записи не найдены</p>
            </div>
          ) : (
            <div className="appointments-list">
              {/* Временная заглушка для отображения списка записей */}
              <p>Здесь будет отображаться список записей</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Создать запись"
      >
        {/* Здесь будет форма создания записи */}
        <div>
          <p>Форма создания записи будет добавлена позже</p>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Button onClick={closeModal} variant="secondary" style={{ marginRight: '10px' }}>
              Отмена
            </Button>
            <Button onClick={closeModal} variant="primary">
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;