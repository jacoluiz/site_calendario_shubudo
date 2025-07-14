import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 ${
      event.isPast ? 'border-gray-400 opacity-75' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-xl font-semibold ${
          event.isPast ? 'text-gray-600' : 'text-gray-900'
        }`}>
          {event.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.isPast 
            ? 'bg-gray-100 text-gray-600' 
            : 'bg-green-100 text-green-800'
        }`}>
          {event.isPast ? 'Finalizado' : 'Agendado'}
        </span>
      </div>
      
      <p className={`text-gray-600 mb-4 leading-relaxed whitespace-pre-line ${
        event.isPast ? 'opacity-75' : ''
      }`}>
        {event.description}
      </p>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className={`h-4 w-4 ${
            event.isPast ? 'text-gray-400' : 'text-blue-500'
          }`} />
          <span className={event.isPast ? 'text-gray-500' : 'text-gray-700'}>
            {formatDate(event.date)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className={`h-4 w-4 ${
            event.isPast ? 'text-gray-400' : 'text-blue-500'
          }`} />
          <span className={event.isPast ? 'text-gray-500' : 'text-gray-700'}>
            {event.time}
          </span>
        </div>
        
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className={`h-4 w-4 ${
              event.isPast ? 'text-gray-400' : 'text-blue-500'
            }`} />
            <span className={event.isPast ? 'text-gray-500' : 'text-gray-700'}>
              {event.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
