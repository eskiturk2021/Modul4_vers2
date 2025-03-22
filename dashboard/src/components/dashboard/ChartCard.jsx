// Компонент карточки с графиком
import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from 'recharts';
import './ChartCard.css';

// Цветовая палитра для графиков
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#4ECDC4', '#FF6B6B', '#FFA5A5', '#82CA9D', '#8DD1E1'
];

const ChartCard = ({ title, chartType, data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h3>{title}</h3>
        </div>
        <div className="no-data-message">
          Нет данных для отображения
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0088FE"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Количество']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="error-message">
            Неизвестный тип графика: {chartType}
          </div>
        );
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartCard;