// Страница клиентов
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../api/customersApi';
import CustomerList from '../components/customers/CustomerList';
import CustomerFilter from '../components/customers/CustomerFilter';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import CustomerForm from '../components/customers/CustomerForm';
import Loader from '../components/common/Loader';
import './CustomersPage.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Загрузка списка клиентов с учетом фильтров и пагинации
  const loadCustomers = async (page = 1, newFilters = filters) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        ...newFilters
      };

      const response = await getCustomers(params);
      setCustomers(response.customers);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Ошибка при загрузке клиентов:', err);
      setError('Не удалось загрузить список клиентов');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка клиентов при первой загрузке компонента
  useEffect(() => {
    loadCustomers();
  }, []);

  // Обработка изменения фильтров
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadCustomers(1, updatedFilters);
  };

  // Обработка изменения страницы
  const handlePageChange = (page) => {
    loadCustomers(page);
  };

  // Открытие модального окна для создания клиента
  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Обработка создания клиента
  const handleCreateCustomer = async (customerData) => {
    // Создание клиента будет реализовано в CustomerForm
    // После успешного создания перезагружаем список
    loadCustomers();
    closeModal();
  };

  if (isLoading && customers.length === 0) {
    return <Loader />;
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div className="title-section">
          <h1>Клиенты</h1>
          <p>Управление базой клиентов</p>
        </div>

        <div className="actions-section">
          <Button onClick={openCreateModal} variant="primary">
            Добавить клиента
          </Button>
        </div>
      </div>

      <CustomerFilter
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <CustomerList
            customers={customers}
            onReload={() => loadCustomers(pagination.currentPage)}
          />

          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="pagination-button"
            >
              &laquo; Назад
            </button>

            <span className="pagination-info">
              Страница {pagination.currentPage} из {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="pagination-button"
            >
              Вперед &raquo;
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Добавить клиента"
      >
        <CustomerForm
          onSubmit={handleCreateCustomer}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default CustomersPage;