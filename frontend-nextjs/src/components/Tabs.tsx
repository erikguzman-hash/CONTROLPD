'use client';

import { useState } from 'react';
import CalendarView from './CalendarView';
import DashboardView from './DashboardView';

type Tab = 'calendar' | 'dashboard';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');

  const tabStyles = "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm";
  const activeTabStyles = "border-hgio-blue text-hgio-blue";
  const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              className={`${tabStyles} ${activeTab === 'calendar' ? activeTabStyles : inactiveTabStyles}`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendario
            </button>
            <button
              className={`${tabStyles} ${activeTab === 'dashboard' ? activeTabStyles : inactiveTabStyles}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Estadísticas
            </button>
          </nav>
        </div>
        <button className="bg-hgio-green text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-hgio-green-light">
          + Nueva Tarea
        </button>
      </div>

      <div>
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </div>
    </div>
  );
}
