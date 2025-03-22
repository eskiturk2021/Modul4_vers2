// Компонент общего макета
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} />

      <div className="layout-content">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;