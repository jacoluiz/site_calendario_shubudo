import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventService } from '../services/eventService';

export function CreateEventPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdEventTitle, setCreatedEventTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateEvent = async (eventData: any) => {
    try {
      setIsCreating(true);
      const createdEvent = await EventService.createEvent(eventData);
      setCreatedEventTitle(eventData.titulo);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setCreatedEventTitle('');
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

      {/* Popup de Sucesso */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Evento Criado!
                </h3>
              </div>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              O evento <strong>"{createdEventTitle}"</strong> foi criado com sucesso!
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleClosePopup}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Criar Outro Evento
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Ver Lista de Eventos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
