// Главная страница дашборда
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';
import { getRecentActivity } from '../api/activityApi';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Loader from '../components/common/Loader';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, activityData] = await Promise.all([
          getDashboardStats(),
          getRecentActivity()
        ]);

        setStats(statsData);
        setActivity(activityData);
      } catch (err) {
        console.error('Ошибка при загрузке данных дашборда:', err);
        setError('Не удалось загрузить данные дашборда');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Обновление каждые 5 минут
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Дашборд</h1>
        <p>Обзор основных показателей и активности</p>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Всего клиентов"
          value={stats?.totalCustomers || 0}
          trend={stats?.totalCustomersTrend}
          icon="users"
        />
        <StatCard
          title="Новые клиенты"
          value={stats?.newCustomers || 0}
          trend={stats?.newCustomersTrend}
          icon="user-plus"
        />
        <StatCard
          title="Повторные клиенты"
          value={stats?.returningCustomersPercentage || "0%"}
          trend={stats?.returningCustomersTrend}
          icon="repeat"
        />
        <StatCard
          title="Запланированные записи"
          value={stats?.scheduledAppointments || 0}
          trend={stats?.scheduledAppointmentsTrend}
          icon="calendar"
        />
      </div>

      <div className="dashboard-charts">
        <ChartCard
          title="Клиенты по месяцам"
          chartType="line"
          data={stats?.customersChart || []}
        />
        <ChartCard
          title="Записи по услугам"
          chartType="pie"
          data={stats?.servicesPieChart || []}
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-recent-activity">
          <div className="section-header">
            <h2>Недавняя активность</h2>
            <Link to="/activity" className="view-all">Смотреть всё</Link>
          </div>
          <ActivityFeed activities={activity} />
        </div>

        <div className="dashboard-upcoming">
          <div className="section-header">
            <h2>Предстоящие записи</h2>
            <Link to="/appointments" className="view-all">Смотреть всё</Link>
          </div>
          <div className="upcoming-appointments">
            {stats?.upcomingAppointments ? (
              stats.upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-time">
                    <div className="date">{new Date(appointment.date).toLocaleDateString('ru-RU')}</div>
                    <div className="time">{appointment.time}</div>
                  </div>
                  <div className="appointment-details">
                    <div className="customer-name">{appointment.customer.name}</div>
                    <div className="service-type">{appointment.service.name}</div>
                  </div>
                  <div className={`appointment-status status-${appointment.status}`}>
                    {appointment.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Нет предстоящих записей</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;