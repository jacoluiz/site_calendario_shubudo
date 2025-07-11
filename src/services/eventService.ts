import { ApiEvent, Event } from '../types/event';

// Usa o backend externo em produção, proxy local em dev
const API_BASE_URL = import.meta.env.PROD
  ? 'https://3.17.71.237:3000' // ✅ Use https para evitar bloqueios em produção
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

  private static transformApiEvent(apiEvent: ApiEvent): Event {
    const startDate = new Date(apiEvent.dataInicio);
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
      date: apiEvent.dataInicio,
      time: startDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
      }),
      location: apiEvent.local || '',
      isPast: eventDateOnly < today
    };
  }
}
