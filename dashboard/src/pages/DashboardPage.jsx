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
        // Используем Promise.all с индивидуальной обработкой ошибок для каждого запроса
        const statsPromise = getDashboardStats().catch(err => {
          console.error('Ошибка при загрузке статистики:', err);
          return null;
        });

        const activityPromise = getRecentActivity().catch(err => {
          console.error('Ошибка при загрузке активности:', err);
          return [];
        });

        const [statsData, activityData] = await Promise.all([
          statsPromise,
          activityPromise
        ]);

        if (statsData) {
          setStats(statsData);
        } else {
          setError(prev => prev || 'Не удалось загрузить статистику');
        }

        setActivity(activityData || []);
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

  if (error && !stats) {
    return <div className="error-message">{error}</div>;
  }

  // Безопасный доступ к данным
  const safeStats = stats || {};
  const getTrendValue = (trend) => trend ? trend : { direction: 'same', value: 0 };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Дашборд</h1>
        <p>Обзор основных показателей и активности</p>
      </div>

      <div className="dashboard-stats">
        <StatCard
          title="Всего клиентов"
          value={safeStats.totalCustomers || 0}
          trend={getTrendValue(safeStats.totalCustomersTrend)}
          icon="users"
        />
        <StatCard
          title="Новые клиенты"
          value={safeStats.newCustomers || 0}
          trend={getTrendValue(safeStats.newCustomersTrend)}
          icon="user-plus"
        />
        <StatCard
          title="Повторные клиенты"
          value={safeStats.returningCustomersPercentage || "0%"}
          trend={getTrendValue(safeStats.returningCustomersTrend)}
          icon="repeat"
        />
        <StatCard
          title="Запланированные записи"
          value={safeStats.scheduledAppointments || 0}
          trend={getTrendValue(safeStats.scheduledAppointmentsTrend)}
          icon="calendar"
        />
      </div>

      <div className="dashboard-charts">
        <ChartCard
          title="Клиенты по месяцам"
          chartType="line"
          data={safeStats.customersChart || []}
        />
        <ChartCard
          title="Записи по услугам"
          chartType="pie"
          data={safeStats.servicesPieChart || []}
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
            {safeStats.upcomingAppointments && safeStats.upcomingAppointments.length > 0 ? (
              safeStats.upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-time">
                    <div className="date">
                      {appointment.date ?
                        new Date(appointment.date).toLocaleDateString('ru-RU') :
                        'Дата не указана'}
                    </div>
                    <div className="time">{appointment.time || 'Время не указано'}</div>
                  </div>
                  <div className="appointment-details">
                    <div className="customer-name">
                      {appointment.customer?.name || 'Имя не указано'}
                    </div>
                    <div className="service-type">
                      {appointment.service?.name || 'Услуга не указана'}
                    </div>
                  </div>
                  <div className={`appointment-status status-${appointment.status || 'unknown'}`}>
                    {appointment.status || 'Не определен'}
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