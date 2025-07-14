import React, { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { EventCard } from './components/EventCard';
import { CreateEventPage } from './components/CreateEventPage';
import { FilterButtons } from './components/FilterButtons';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useEvents } from './hooks/useEvents';

function EventListPage() {
  const { events, loading, error, refetch } = useEvents();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return events.filter(event => !event.isPast);
      case 'past':
        return events.filter(event => event.isPast);
      default:
        return events;
    }
  }, [activeFilter, events]);

  const eventCounts = useMemo(() => ({
    all: events.length,
    upcoming: events.filter(event => !event.isPast).length,
    past: events.filter(event => event.isPast).length,
  }), [events]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (activeFilter === 'past') {
        return dateB - dateA;
      }
      if (activeFilter === 'upcoming') {
        return dateA - dateB;
      }
      if (a.isPast !== b.isPast) {
        return a.isPast ? 1 : -1;
      }

      return dateA - dateB;
    });
  }, [filteredEvents, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Imagem esquerda */}
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/7045732/pexels-photo-7045732.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                alt="Logo esquerda" 
                className="w-24 h-24 object-cover rounded-full shadow-lg"
              />
            </div>
            
            {/* Título central */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">Eventos</h1>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">
                CDL TEAM - Karatê Shubu-Dô Agenda online
              </p>
            </div>
            
            {/* Imagem direita */}
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/7045836/pexels-photo-7045836.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                alt="Logo direita" 
                className="w-24 h-24 object-cover rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
        </div>

        <FilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          eventCounts={eventCounts}
        />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-500">
              Não há eventos para o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {sortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Mantenha-se conectado para não perder nenhum evento!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { refetch } = useEvents(); // useEvents precisa estar aqui ou movido para contexto

  return (
    <Routes>
      <Route path="/" element={<EventListPage />} />
      <Route
        path="/criar"
        element={
          <CreateEventPage
            onBack={() => window.history.back()}
            onEventCreated={refetch}
          />
        }
      />
    </Routes>
  );
}
