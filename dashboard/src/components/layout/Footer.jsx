// Компонент подвала
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          &copy; {currentYear} Система управления клиентами. Все права защищены.
        </div>
        <div className="version">
          Версия 1.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;