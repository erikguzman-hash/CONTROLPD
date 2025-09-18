'use client';

import { useState } from 'react';
import CalendarView from './CalendarView';
import DashboardView from './DashboardView';
import TaskModal from './TaskModal';
import { AppUser } from '@/context/AuthContext';

type Tab = 'calendar' | 'dashboard';

type TabsProps = {
  user: AppUser;
};

export default function Tabs({ user }: TabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // State for the task being edited

  const canCreateTask = user.papers?.includes('coordinador');

  const openModalForCreate = () => {
    setEditingTaskId(null); // Ensure we're in create mode
    setModalOpen(true);
  };

  const openModalForEdit = (taskId: string) => {
    setEditingTaskId(taskId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTaskId(null); // Reset editing state on close
  };

  const tabStyles = "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm";
  const activeTabStyles = "border-hgio-blue text-hgio-blue";
  const inactiveTabStyles = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <>
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
          {canCreateTask && (
            <button
              onClick={openModalForCreate}
              className="bg-hgio-green text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-hgio-green-light"
            >
              + Nueva Tarea
            </button>
          )}
        </div>

        <div>
          {activeTab === 'calendar' && <CalendarView onEventClick={openModalForEdit} />}
          {activeTab === 'dashboard' && <DashboardView />}
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={closeModal} taskId={editingTaskId} />
    </>
  );
}