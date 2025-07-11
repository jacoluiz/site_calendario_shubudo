import { Event } from '../types/event';

export class EventService {
  static async fetchEvents(): Promise<Event[]> {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Workshop de React Avançado',
        description: 'Aprenda técnicas avançadas de React, incluindo hooks customizados, context API e otimização de performance.',
        date: '2025-02-15',
        time: '14:00',
        location: 'Centro de Convenções - Sala A1',
        isPast: false
      },
      {
        id: '2',
        title: 'Conferência de Tecnologia 2025',
        description: 'O maior evento de tecnologia do ano com palestrantes renomados e networking.',
        date: '2025-03-20',
        time: '09:00',
        location: 'Expo Center São Paulo',
        isPast: false
      },
      {
        id: '3',
        title: 'Meetup de JavaScript',
        description: 'Encontro mensal da comunidade JavaScript para compartilhar conhecimentos e experiências.',
        date: '2025-01-25',
        time: '19:00',
        location: 'Hub de Inovação - Auditório Principal',
        isPast: false
      },
      {
        id: '4',
        title: 'Hackathon de IA',
        description: 'Competição de 48 horas para desenvolver soluções inovadoras usando inteligência artificial.',
        date: '2024-12-10',
        time: '08:00',
        location: 'Universidade Tecnológica - Campus Central',
        isPast: true
      },
      {
        id: '5',
        title: 'Palestra sobre UX/UI Design',
        description: 'Tendências e melhores práticas em design de interfaces e experiência do usuário.',
        date: '2024-11-28',
        time: '16:30',
        location: 'Coworking Design Hub - Sala de Eventos',
        isPast: true
      },
      {
        id: '6',
        title: 'Workshop de DevOps',
        description: 'Práticas essenciais de DevOps, CI/CD e automação de infraestrutura.',
        date: '2025-02-08',
        time: '10:00',
        location: 'Centro de Treinamento Tech - Lab 3',
        isPast: false
      },
      {
        id: '7',
        title: 'Seminário de Cibersegurança',
        description: 'Discussão sobre as últimas ameaças digitais e estratégias de proteção.',
        date: '2024-12-05',
        time: '13:00',
        location: 'Auditório da Empresa de Segurança Digital',
        isPast: true
      },
      {
        id: '8',
        title: 'Curso de Python para Iniciantes',
        description: 'Introdução completa à linguagem Python com exercícios práticos.',
        date: '2025-01-30',
        time: '18:00',
        location: 'Escola de Programação - Sala 205',
        isPast: false
      }
    ];

    return mockEvents;
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
      date: startDate.toISOString(), // Data completa em ISO
      time: startDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
      }),
      location: apiEvent.local || '',
      isPast: eventDateOnly < today,
    };
  }
}
