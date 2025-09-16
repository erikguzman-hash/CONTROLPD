import { elements } from './ui.js';
import { getTasksForDashboard } from './firestore.js';

export async function loadDashboard(db) {
    const snapshot = await getTasksForDashboard(db);
    const tasksByUser = {};
    snapshot.forEach(doc => {
        const task = doc.data();
        if (task.assigneeName) {
            tasksByUser[task.assigneeName] = (tasksByUser[task.assigneeName] || 0) + 1;
        }
    });
    
    elements.statsContainer.innerHTML = '';
    const chartCanvas = document.createElement('canvas');
    elements.statsContainer.appendChild(chartCanvas);

    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(tasksByUser),
            datasets: [{
                label: 'Tareas por Usuario',
                data: Object.values(tasksByUser),
                backgroundColor: 'rgba(76, 146, 0, 0.5)',
                borderColor: 'rgba(76, 146, 0, 1)',
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true, stepSize: 1 } } }
    });
}