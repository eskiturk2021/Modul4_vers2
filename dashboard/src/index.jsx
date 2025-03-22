// Точка входа
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Создаем корневой элемент для приложения
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);