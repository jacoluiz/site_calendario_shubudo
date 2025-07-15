import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, X, Trash2, AlertTriangle } from 'lucide-react';
import { EventForm } from './EventForm';
import { EventService } from '../services/eventService';
import { Event } from '../types/event';

export function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updatedEventTitle, setUpdatedEventTitle] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const events = await EventService.fetchEvents();
      const foundEvent = events.find(e => e.id === id);
      
      if (!foundEvent) {
        navigate('/');
        return;
      }
      
      setEvent(foundEvent);
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!id) return;

    try {
      setIsUpdating(true);
      await EventService.updateEvent(id, eventData);
      setUpdatedEventTitle(eventData.titulo);
      setShowSuccessPopup(true);
      
      // Recarregar dados do evento
      await loadEvent();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await EventService.deleteEvent(id);
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      alert('Erro ao deletar evento. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setUpdatedEventTitle('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Evento não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            disabled={isUpdating || isDeleting}
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para eventos
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Evento
            </h1>
            <p className="text-gray-600">
              Modifique as informações do evento abaixo
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Botão deletar no topo */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isUpdating || isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Deletar Evento
              </button>
            </div>

            <EventForm
              initialData={{
                titulo: event.title,
                descricao: event.description,
                dataInicio: event.date,
                local: event.location || ''
              }}
              onSubmit={handleUpdateEvent}
              onCancel={() => navigate('/')}
              loading={isUpdating}
              submitButtonText="Atualizar Evento"
            />
          </div>
        </div>
      </div>

      {/* Popup de Sucesso */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Evento Atualizado!
                </h3>
              </div>
              <button
                onClick={handleCloseSuccessPopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              O evento <strong>"{updatedEventTitle}"</strong> foi atualizado com sucesso!
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCloseSuccessPopup}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Continuar Editando
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

      {/* Popup de Confirmação de Deleção */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">
                Confirmar Deleção
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar o evento <strong>"{event.title}"</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deletando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Deletar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}