// Компонент модального окна
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

/**
 * Компонент модального окна
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @param {Function} props.onClose - Обработчик закрытия
 * @param {string} props.title - Заголовок модального окна
 * @param {React.ReactNode} props.children - Содержимое модального окна
 * @param {string} [props.size='medium'] - Размер модального окна (small, medium, large)
 */
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const modalRoot = document.getElementById('modal-root') || document.body;

  // Предотвращаем прокрутку body когда открыто модальное окно
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Закрытие модального окна по клавише Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Предотвращаем всплытие клика внутри модального окна
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container modal-${size}`}
        onClick={handleModalClick}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;