'use client';

import { useState, useEffect } from 'react';
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
import { onAllTasksSnapshot } from '@/lib/firestore';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
  },
};

// Initial empty data
const initialDoughnutData = {
  labels: [],
  datasets: [{ data: [] }],
};

export default function DashboardView() {
  const [doughnutData, setDoughnutData] = useState(initialDoughnutData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAllTasksSnapshot((tasks) => {
      // Aggregate data for doughnut chart (tasks by status)
      const statusCounts = tasks.reduce((acc, task) => {
        const status = task.status || 'Sin Estado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);

      setDoughnutData({
        labels,
        datasets: [
          {
            label: 'Estado de Tareas',
            data,
            backgroundColor: [ // Add more colors if you have more statuses
              '#E5E7EB', '#FEF3C7', '#D1FAE5', '#C6F6D5', '#FEE2E2', '#BFDBFE',
            ],
          },
        ],
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-hgio-blue mb-4">Tareas por Mes</h3>
        {/* Bar chart data needs a similar aggregation by month, which is more complex.
            For now, we'll leave it as a placeholder. */}
        <p>Gráfico de barras por mes (próximamente).</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-hgio-blue mb-4">Distribución de Estados</h3>
        {loading ? <p>Cargando datos...</p> : <Doughnut data={doughnutData} options={chartOptions} />}
      </div>
    </div>
  );
}
