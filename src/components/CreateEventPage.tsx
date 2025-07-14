import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventService } from '../services/eventService';

export function CreateEventPage() {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateEvent = async (eventData: any) => {
    try {
      setIsCreating(true);
      await EventService.createEvent(eventData);
      navigate('/'); // Volta para a lista após criar
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
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            disabled={isCreating}
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>

        {/* Formulário */}
        <div className="max-w-2xl mx-auto">
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => navigate('/')}
            loading={isCreating}
          />
        </div>
      </div>
    </div>
  );
}
