import { getTasksForUser } from './firestore.js';

function renderTaskItem(task, dependencies) {
    const { tasksModule } = dependencies;
    const taskItem = document.createElement('div');
    taskItem.className = 'p-2 border-b hover:bg-gray-100 cursor-pointer';
    taskItem.innerHTML = `
        <h4 class="font-semibold text-sm">${task.title}</h4>
        <p class="text-xs text-gray-600">Estado: ${task.status} | Vence: ${task.dueDate}</p>
    `;
    taskItem.addEventListener('click', () => {
        tasksModule.openModal(dependencies, task.id);
    } );
    return taskItem;
}

export async function renderMyTasks(dependencies) {
    const { db, appState } = dependencies;
    const panelSection = document.getElementById('my-tasks-section');
    if (!panelSection) return;

    panelSection.innerHTML = `<h3 class="text-lg font-bold text-hgio-blue mb-2 mt-4 border-b pb-2">Mis Tareas</h3>`;
    
    const tasksList = document.createElement('div');
    tasksList.id = 'my-tasks-list';
    panelSection.appendChild(tasksList);

    const tasks = await getTasksForUser(db, appState.currentUser.uid);
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="text-sm text-gray-500">No tienes tareas asignadas.</p>';
        return;
    }

    tasks.forEach(taskData => {
        tasksList.appendChild(renderTaskItem(taskData, dependencies));
    });
}