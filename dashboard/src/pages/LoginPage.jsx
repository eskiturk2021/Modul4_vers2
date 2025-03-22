// Страница входа
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, isAuthenticated, isLoading, error } = useContext(AuthContext);

  // Если пользователь уже аутентифицирован, перенаправляем на дашборд
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Валидация формы
    if (!email.trim()) {
      setFormError('Введите электронную почту');
      return;
    }

    if (!password) {
      setFormError('Введите пароль');
      return;
    }

    // Пытаемся авторизоваться
    const success = await login(email, password);

    if (!success) {
      setFormError('Неверный логин или пароль');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <h1>Панель управления</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Вход в систему</h2>

          {(formError || error) && (
            <div className="login-error">
              {formError || error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Выполняется вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 Система управления клиентами</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;