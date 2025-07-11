import React, { useState, useMemo } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { FilterButtons } from './components/FilterButtons';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useEvents } from './hooks/useEvents';

function App() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const { events, loading, error, refetch } = useEvents();

  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return events.filter(event => !event.isPast);
      case 'past':
        return events.filter(event => event.isPast);
      default:
        return events;
    }
  }, [activeFilter, events]); // ✅ Corrigido

  const eventCounts = useMemo(() => ({
    all: events.length,
    upcoming: events.filter(event => !event.isPast).length,
    past: events.filter(event => event.isPast).length
  }), [events]); // ✅ Corrigido

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      
      if (activeFilter === 'upcoming') {
        return dateA.getTime() - dateB.getTime();
      } else if (activeFilter === 'past') {
        return dateB.getTime() - dateA.getTime();
      } else {
        if (a.isPast !== b.isPast) {
          return a.isPast ? 1 : -1;
        }
        return a.isPast 
          ? dateB.getTime() - dateA.getTime() 
          : dateA.getTime() - dateB.getTime();
      }
    });
  }, [filteredEvents, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Eventos</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubra eventos incríveis e mantenha-se atualizado com as últimas oportunidades
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700 font-medium">Filtrar por:</span>
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

export default App;
