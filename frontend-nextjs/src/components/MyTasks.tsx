// A single task item
function TaskItem({ title, status, dueDate }: { title: string, status: string, dueDate: string }) {
  return (
    <div className="p-2 border-b hover:bg-gray-100 cursor-pointer">
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-gray-600">Estado: {status} | Vence: {dueDate}</p>
    </div>
  );
}

export default function MyTasks() {
  // Later, this data will come from Firestore
  const tasks = [
    { id: '1', title: 'Diseñar post para Instagram', status: 'pendiente', dueDate: '2025-09-20' },
    { id: '2', title: 'Revisar copy para campaña', status: 'aprobado-coord', dueDate: '2025-09-22' },
    { id: '3', title: 'Publicar video en TikTok', status: 'finalizado', dueDate: '2025-09-18' },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-hgio-blue mb-2 mt-4 border-b pb-2">Mis Tareas</h3>
      <div>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tienes tareas asignadas.</p>
        ) : (
          tasks.map(task => <TaskItem key={task.id} {...task} />)
        )}
      </div>
    </div>
  );
}
