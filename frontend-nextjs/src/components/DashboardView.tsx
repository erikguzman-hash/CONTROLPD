'use client';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample data for the charts
const barData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Tareas Completadas',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: '#4c9200',
    },
    {
      label: 'Tareas Pendientes',
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: '#153054',
    },
  ],
};

const doughnutData = {
  labels: ['Finalizado', 'Pendiente', 'En Revisión', 'Aprobado'],
  datasets: [
    {
      label: 'Estado de Tareas',
      data: [300, 50, 100, 80],
      backgroundColor: [
        '#E5E7EB', // Finalizado
        '#FEF3C7', // Pendiente
        '#D1FAE5', // En Revisión (using aprobado-coord color)
        '#C6F6D5', // Aprobado (using aprobado-dir color)
      ],
      borderColor: [
        '#374151',
        '#92400E',
        '#065F46',
        '#22543D',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Resumen de Tareas',
    },
  },
};

export default function DashboardView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-hgio-blue mb-4">Tareas por Mes</h3>
        <Bar options={chartOptions} data={barData} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-hgio-blue mb-4">Distribución de Estados</h3>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}