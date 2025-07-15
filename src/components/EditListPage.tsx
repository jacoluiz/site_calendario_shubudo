import React, { useMemo, useState } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from './EventCard';
import { FilterButtons } from './FilterButtons';
import { SearchBar } from './SearchBar';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useEvents } from '../hooks/useEvents';

export function EditListPage() {
  const { events, loading, error, refetch } = useEvents();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Primeiro aplica a busca, depois o filtro
  const searchedEvents = useMemo(() => {
    if (!searchTerm.trim()) {
      return events;
    }
    
    const term = searchTerm.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(term) || 
      event.description.toLowerCase().includes(term)
    );
  }, [events, searchTerm]);

  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return searchedEvents.filter(event => !event.isPast);
      case 'past':
        return searchedEvents.filter(event => event.isPast);
      default:
        return searchedEvents;
    }
  }, [activeFilter, searchedEvents]);

  const eventCounts = useMemo(() => ({
    all: searchedEvents.length,
    upcoming: searchedEvents.filter(event => !event.isPast).length,
    past: searchedEvents.filter(event => event.isPast).length,
  }), [searchedEvents]);

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
        {/* Header com botão voltar */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para eventos
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Editar Eventos
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Selecione um evento para editar ou deletar
            </p>
          </div>
        </div>

        {/* Barra de Busca */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultsCount={filteredEvents.length}
        />

        {/* Filtros */}
        <FilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          eventCounts={eventCounts}
        />

        {/* Conteúdo principal */}
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
      </div>
    </div>
  );
}