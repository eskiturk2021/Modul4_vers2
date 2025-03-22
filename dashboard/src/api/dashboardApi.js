// API для получения статистики дашборда
import apiClient from './apiClient';

/**
 * Получение статистики для дашборда
 * @returns {Promise<Object>} - Статистика для дашборда
 */
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');

    // Преобразуем для шаблонных данных для графиков
    const data = response.data;

    // Генерируем данные для линейного графика по месяцам
    // В реальном проекте эти данные должны приходить с сервера
    const months = [
      'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ];

    const currentMonth = new Date().getMonth();

    // Создаем данные для линейного графика (последние 6 месяцев)
    const customersChart = [];
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12; // Чтобы получить корректный индекс для предыдущих месяцев
      const randomValue = Math.floor(Math.random() * 50) + 50; // Генерируем случайные данные
      customersChart.push({
        name: months[monthIndex],
        value: randomValue
      });
    }

    // Создаем данные для круговой диаграммы услуг
    const servicesPieChart = [
      { name: 'Замена шин', value: Math.floor(Math.random() * 30) + 20 },
      { name: 'Замена масла', value: Math.floor(Math.random() * 20) + 15 },
      { name: 'Тормозная система', value: Math.floor(Math.random() * 15) + 10 },
      { name: 'Диагностика', value: Math.floor(Math.random() * 10) + 5 },
      { name: 'Другое', value: Math.floor(Math.random() * 10) + 5 }
    ];

    // Создаем данные для предстоящих записей
    // В реальном проекте эти данные должны приходить с сервера
    const upcomingAppointments = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + i);

      upcomingAppointments.push({
        id: `apt-${i + 1}`,
        date: appointmentDate.toISOString().split('T')[0],
        time: `${10 + i}:00`,
        customer: {
          id: `cust-${i + 1}`,
          name: `Клиент ${i + 1}`
        },
        service: {
          name: i % 2 === 0 ? 'Замена шин' : 'Замена масла'
        },
        status: i % 3 === 0 ? 'confirmed' : (i % 3 === 1 ? 'pending' : 'in-progress')
      });
    }

    // Объединяем данные с сервера и сгенерированные данные
    return {
      ...data,
      customersChart,
      servicesPieChart,
      upcomingAppointments
    };
  } catch (error) {
    console.error('Ошибка получения статистики дашборда:', error);
    throw error;
  }
};