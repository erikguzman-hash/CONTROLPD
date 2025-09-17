'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Import FullCalendar styles
import '@fullcalendar/react/dist/vdom';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';


// Sample events data
const events = [
  { title: 'Reunión de equipo', start: new Date() },
  { title: 'Entrega de diseño', date: '2025-09-25', color: '#4c9200' },
  { title: 'Revisión de campaña', date: '2025-09-30', color: '#153054' }
];

export default function CalendarView() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Add a class to style the calendar */}
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventContent={renderEventContent} // Custom render function
          locale="es" // Set locale to Spanish
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
        />
      </div>
    </div>
  );
}

// A custom function to render events
function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
