// Компонент кнопки
import React from 'react';
import './Button.css';

/**
 * Универсальный компонент кнопки
 * @param {Object} props - Свойства компонента
 * @param {string} [props.variant='primary'] - Вариант кнопки (primary, secondary, danger, text)
 * @param {string} [props.size='medium'] - Размер кнопки (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Растягивать на всю ширину контейнера
 * @param {boolean} [props.disabled=false] - Отключена ли кнопка
 * @param {Function} props.onClick - Обработчик клика
 * @param {React.ReactNode} props.children - Содержимое кнопки
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  ...rest
}) => {
  const className = `
    button
    button-${variant}
    button-${size}
    ${fullWidth ? 'button-full-width' : ''}
  `;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;