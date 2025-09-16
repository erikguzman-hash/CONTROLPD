export function initializeCalendar(dependencies) {
    const { appState, tasksModule } = dependencies;
    const calendarEl = document.getElementById('calendar');
    if (appState.calendar) appState.calendar.destroy();

    appState.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' },
        locale: 'es',
        eventClick: (info) => tasksModule.openModal(dependencies, info.event.id),
    });
    appState.calendar.render();
}

function getStatusColor(status) {
    const colors = {
        'solicitado': '#E0E7FF', 'pendiente': '#FEF3C7', 'aprobado-coord': '#D1FAE5',
        'aprobado-dir': '#C6F6D5', 'rechazado': '#FEE2E2', 'finalizado': '#E5E7EB'
    };
    return colors[status] || '#F3F4F6';
}

export function formatTaskToEvent(task, id) {
    const color = getStatusColor(task.status);
    return {
        id: id,
        title: task.title,
        start: task.dueDate,
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        textColor: '#1F2937' // Mejor contraste
    };
}