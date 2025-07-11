import { ApiEvent, Event } from '../types/event';

const API_BASE_URL = '/api';

export class EventService {
  static async fetchEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/datas`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiEvents: ApiEvent[] = await response.json();
      
      return apiEvents.map(this.transformApiEvent);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error('Falha ao carregar eventos. Verifique sua conexão.');
    }
  }

  private static transformApiEvent(apiEvent: ApiEvent): Event {
    const eventDate = new Date(apiEvent.date);
    const now = new Date();
    
    // Remove o tempo da data atual para comparação apenas de data
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    return {
      id: apiEvent.id || Math.random().toString(36).substr(2, 9),
      title: apiEvent.title || 'Evento sem título',
      description: apiEvent.description || 'Descrição não disponível',
      date: apiEvent.date,
      time: apiEvent.time || '00:00',
      location: apiEvent.location,
      isPast: eventDateOnly < today
    };
  }
}