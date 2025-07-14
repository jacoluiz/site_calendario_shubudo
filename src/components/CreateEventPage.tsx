import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventService } from '../services/eventService';

interface CreateEventPageProps {
  onBack: () => void;
  onEventCreated: () => void;
}

export function CreateEventPage({ onBack, onEventCreated }: CreateEventPageProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateEvent = async (eventData: any) => {
    try {
      setIsCreating(true);
      await EventService.createEvent(eventData);
      onEventCreated();
      onBack(); // Volta para a lista após criar
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            disabled={isCreating}
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para eventos
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Criar Novo Evento
            </h1>
            <p className="text-gray-600">
              Preencha as informações abaixo para criar um novo evento
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="max-w-2xl mx-auto">
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={onBack}
            loading={isCreating}
          />
        </div>
      </div>
    </div>
  );
}