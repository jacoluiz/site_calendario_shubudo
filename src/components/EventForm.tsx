import React, { useState } from 'react';
import { Calendar, Clock, MapPin, FileText, Save, X } from 'lucide-react';

interface EventFormData {
  titulo: string;
  descricao: string;
  dataInicio: string;
  local: string;
}

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (eventData: EventFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitButtonText?: string;
}

export function EventForm({ 
  initialData,
  onSubmit, 
  onCancel, 
  loading = false,
  submitButtonText = "Salvar Evento"
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      titulo: '',
      descricao: '',
      dataInicio: '',
      local: ''
    }
  );

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  // Atualizar formData quando initialData mudar
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Limpar formulário após sucesso apenas se não houver dados iniciais (modo criação)
      if (!initialData) {
        setFormData({
          titulo: '',
          descricao: '',
          dataInicio: '',
          local: ''
        });
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Título do Evento *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.titulo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite o título do evento"
            disabled={loading}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.descricao ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descreva o evento"
            disabled={loading}
          />
          {errors.descricao && (
            <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
          )}
        </div>

        {/* Data e Hora de Início */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Data e Hora de Início *
          </label>
          <input
            type="datetime-local"
            value={formData.dataInicio}
            onChange={(e) => handleInputChange('dataInicio', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.dataInicio ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.dataInicio && (
            <p className="text-red-500 text-sm mt-1">{errors.dataInicio}</p>
          )}
        </div>


        {/* Local */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Local (opcional)
          </label>
          <input
            type="text"
            value={formData.local}
            onChange={(e) => handleInputChange('local', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Local do evento"
            disabled={loading}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}