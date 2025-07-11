import { useState, useEffect } from 'react';
import { Event } from '../types/event';
import { EventService } from '../services/eventService';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEvents = await EventService.fetchEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadEvents();
  };

  return {
    events,
    loading,
    error,
    refetch
  };
}