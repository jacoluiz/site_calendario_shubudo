import { ApiEvent, Event } from '../types/event';

interface CreateEventData {
  titulo: string;
  descricao: string;
  dataInicio: string;
  local?: string;
}

const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.calendariokarate.click'
  : '/api';

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

  static async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/datas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdEvent: ApiEvent = await response.json();
      return this.transformApiEvent(createdEvent);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error('Falha ao criar evento. Verifique sua conexão.');
    }
  }

  static async updateEvent(id: string, eventData: CreateEventData): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/datas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedEvent: ApiEvent = await response.json();
      return this.transformApiEvent(updatedEvent);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw new Error('Falha ao atualizar evento. Verifique sua conexão.');
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/datas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      throw new Error('Falha ao deletar evento. Verifique sua conexão.');
    }
  }

  private static transformApiEvent(apiEvent: ApiEvent): Event {
  const rawDate = apiEvent.dataInicio;
  const startDate = rawDate ? new Date(rawDate) : new Date();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDateOnly = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  return {
    id: apiEvent._id || Math.random().toString(36).substr(2, 9),
    title: apiEvent.titulo || 'Evento sem título',
    description: apiEvent.descricao || 'Descrição não disponível',
    date: rawDate || '',

    // Só extrai a hora se rawDate existir e for válida
    time: rawDate && rawDate.length >= 16
      ? rawDate.substring(11, 16)
      : '',

    location: apiEvent.local || '',
    isPast: eventDateOnly < today
  };
}

}
