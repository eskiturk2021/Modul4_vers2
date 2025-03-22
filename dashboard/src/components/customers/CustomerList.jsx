// Компонент списка клиентов
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCustomer } from '../../api/customersApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './CustomerList.css';

const CustomerStatusBadge = ({ status }) => {
  const statusMap = {
    'active': { label: 'Активен', className: 'status-active' },
    'inactive': { label: 'Неактивен', className: 'status-inactive' },
    'new': { label: 'Новый', className: 'status-new' },
    'vip': { label: 'VIP', className: 'status-vip' }
  };

  const { label, className } = statusMap[status] || { label: status, className: '' };

  return <span className={`status-badge ${className}`}>{label}</span>;
};

const CustomerList = ({ customers, onReload }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Открывает модальное окно для подтверждения удаления
  const openDeleteConfirm = (customer) => {
    setConfirmDelete(customer);
  };

  // Закрывает модальное окно
  const closeDeleteConfirm = () => {
    setConfirmDelete(null);
  };

  // Обработка удаления клиента
  const handleDeleteCustomer = async () => {
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteCustomer(confirmDelete.id);
      closeDeleteConfirm();
      onReload(); // Перезагружаем список после удаления
    } catch (err) {
      console.error('Ошибка при удалении клиента:', err);
      // Здесь можно добавить отображение ошибки
    } finally {
      setIsDeleting(false);
    }
  };

  if (customers.length === 0) {
    return (
      <div className="no-data-message">
        <p>Клиенты не найдены</p>
      </div>
    );
  }

  return (
    <div className="customer-list">
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Автомобиль</th>
            <th>Статус</th>
            <th>Последний визит</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>
                <Link to={`/customers/${customer.id}`} className="customer-name-link">
                  {customer.name}
                </Link>
              </td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                {customer.vehicle_make} {customer.vehicle_model} {customer.vehicle_year}
              </td>
              <td>
                <CustomerStatusBadge status={customer.status} />
              </td>
              <td>{customer.last_visit ? new Date(customer.last_visit).toLocaleDateString('ru-RU') : 'Нет визитов'}</td>
              <td className="actions-cell">
                <div className="actions-buttons">
                  <Link to={`/customers/${customer.id}`} className="action-button view-button" title="Просмотр">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </Link>

                  <Link to={`/customers/${customer.id}/edit`} className="action-button edit-button" title="Редактировать">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </Link>

                  <button
                    className="action-button delete-button"
                    onClick={() => openDeleteConfirm(customer)}
                    title="Удалить"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={!!confirmDelete}
        onClose={closeDeleteConfirm}
        title="Подтверждение удаления"
      >
        <div className="delete-confirmation">
          <p>Вы действительно хотите удалить клиента "{confirmDelete?.name}"?</p>
          <p className="warning">Это действие нельзя отменить.</p>

          <div className="modal-actions">
            <Button
              onClick={closeDeleteConfirm}
              variant="secondary"
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeleteCustomer}
              variant="danger"
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerList;