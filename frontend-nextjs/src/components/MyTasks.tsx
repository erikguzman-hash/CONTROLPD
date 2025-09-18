'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { onTasksForUserSnapshot } from '@/lib/firestore';

// A single task item
function TaskItem({ title, status, dueDate }: { title: string, status: string, dueDate: string }) {
  return (
    <div className="p-2 border-b hover:bg-gray-100 cursor-pointer">
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-gray-600">Estado: {status || 'No definido'} | Vence: {dueDate || 'N/A'}</p>
    </div>
  );
}

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = onTasksForUserSnapshot(user.uid, (newTasks) => {
        setTasks(newTasks);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div>
      <h3 className="text-lg font-bold text-hgio-blue mb-2 mt-4 border-b pb-2">Mis Tareas</h3>
      <div>
        {loading ? (
          <p className="text-sm text-gray-500">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tienes tareas asignadas.</p>
        ) : (
          tasks.map(task => <TaskItem key={task.id} {...task} />)
        )}
      </div>
    </div>
  );
}