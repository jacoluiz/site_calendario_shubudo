export interface ApiEvent {
  _id: string;              // <- id do MongoDB
  titulo: string;           // <- título do evento
  descricao: string;        // <- descrição do evento
  dataInicio: string;       // <- data e hora de início do evento (ISO)
  dataFim?: string;         // <- data e hora de término (opcional)
  criadoPor?: string;       // <- criador (opcional)
  local?: string;           // <- local do evento (opcional)
  [key: string]: any;       // <- permite campos extras sem erro
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;       // ISO string de data completa
  time: string;       // HH:mm formatado
  location?: string;
  isPast: boolean;
}
