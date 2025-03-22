// Компонент индикатора загрузки

import React from 'react';
import './Loader.css';

/**
 * Компонент индикатора загрузки
 * @param {Object} props - Свойства компонента
 * @param {string} [props.size='medium'] - Размер индикатора (small, medium, large)
 * @param {string} [props.color='primary'] - Цвет индикатора (primary, secondary, white)
 * @param {string} [props.text] - Текст, отображаемый под индикатором
 * @param {boolean} [props.fullScreen=false] - Показывать на весь экран с затемнением
 */
const Loader = ({
  size = 'medium',
  color = 'primary',
  text,
  fullScreen = false
}) => {
  const loaderClasses = `loader loader-${size} loader-${color} ${fullScreen ? 'loader-fullscreen' : ''}`;

  const loaderContent = (
    <div className="loader-content">
      <div className="loader-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className={loaderClasses}>
          {loaderContent}
        </div>
      </div>
    );
  }

  return (
    <div className={loaderClasses}>
      {loaderContent}
    </div>
  );
};

export default Loader;