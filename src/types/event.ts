export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  isPast: boolean;
}

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  [key: string]: any; // Para campos adicionais da API
}