export interface ApiEvent {
  _id: string;              // <- do MongoDB
  titulo: string;           // <- título do evento
  descricao: string;        // <- descrição do evento
  dataInicio: string;       // <- início do evento
  dataFim?: string;         // <- fim (opcional)
  criadoPor?: string;       // <- quem criou (opcional)
  [key: string]: any;       // <- se vier campo a mais, não quebra
  local?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  isPast: boolean;
}
