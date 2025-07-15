import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  resultsCount: number;
}

export function SearchBar({ searchTerm, onSearchChange, resultsCount }: SearchBarProps) {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="mb-6">
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar eventos por título ou descrição..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white shadow-sm"
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <p className="text-center text-sm text-gray-600 mt-2">
          {resultsCount === 0 
            ? 'Nenhum evento encontrado' 
            : `${resultsCount} evento${resultsCount !== 1 ? 's' : ''} encontrado${resultsCount !== 1 ? 's' : ''}`
          } para "{searchTerm}"
        </p>
      )}
    </div>
  );
}