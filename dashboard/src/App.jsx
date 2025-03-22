// Главный компонент
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DocumentsPage from './pages/DocumentsPage';
import SettingsPage from './pages/SettingsPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerDetailsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointments/:id" element={<AppointmentDetailsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
