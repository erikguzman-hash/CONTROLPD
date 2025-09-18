'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { onAllTasksSnapshot } from '@/lib/firestore';

// Import FullCalendar styles
import '@fullcalendar/react/dist/vdom';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';

type CalendarViewProps = {
  onEventClick: (taskId: string) => void;
};

// A custom function to render events
function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default function CalendarView({ onEventClick }: CalendarViewProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAllTasksSnapshot((tasks) => {
      const formattedEvents = tasks.map(task => ({
        id: task.id,
        title: task.title,
        date: task.dueDate, // Assuming the field is named dueDate
      }));
      setEvents(formattedEvents);
    });

    return () => unsubscribe();
  }, []);

  const handleEventClick = (clickInfo: any) => {
    onEventClick(clickInfo.event.id); // Pass the task ID up to the parent
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          locale="es"
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
