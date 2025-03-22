// Страница документов

import React, { useState, useEffect } from 'react';
import { searchDocuments } from '../api/documentsApi';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка списка документов
  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const response = await searchDocuments({ query: searchQuery });
        setDocuments(response?.documents || []);
      } catch (err) {
        console.error('Ошибка при загрузке документов:', err);
        setError('Не удалось загрузить список документов');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [searchQuery]);

  // Открытие модального окна для загрузки документа
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  // Закрытие модального окна
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  // Обработка изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading && documents.length === 0) {
    return <Loader />;
  }

  return (
    <div className="documents-page">
      <div className="page-header">
        <div className="title-section">
          <h1>Документы</h1>
          <p>Управление документами и файлами</p>
        </div>

        <div className="actions-section">
          <Button onClick={openUploadModal} variant="primary">
            Загрузить документ
          </Button>
        </div>
      </div>

      <div className="documents-search">
        <input
          type="text"
          placeholder="Поиск документов..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="documents-content">
          {documents.length === 0 ? (
            <div className="no-data-message">
              <p>Документы не найдены</p>
            </div>
          ) : (
            <div className="documents-list">
              {/* Временная заглушка для отображения списка документов */}
              <p>Здесь будет отображаться список документов</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        title="Загрузить документ"
      >
        {/* Здесь будет форма загрузки документа */}
        <div>
          <p>Форма загрузки документа будет добавлена позже</p>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Button onClick={closeUploadModal} variant="secondary" style={{ marginRight: '10px' }}>
              Отмена
            </Button>
            <Button onClick={closeUploadModal} variant="primary">
              Загрузить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentsPage;