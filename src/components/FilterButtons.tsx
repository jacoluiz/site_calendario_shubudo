import React from 'react';

interface FilterButtonsProps {
  activeFilter: 'all' | 'upcoming' | 'past';
  onFilterChange: (filter: 'all' | 'upcoming' | 'past') => void;
  eventCounts: {
    all: number;
    upcoming: number;
    past: number;
  };
}

export function FilterButtons({ activeFilter, onFilterChange, eventCounts }: FilterButtonsProps) {
  const buttons = [
    { key: 'all', label: 'Todos os Eventos', count: eventCounts.all },
    { key: 'upcoming', label: 'Próximos', count: eventCounts.upcoming },
    { key: 'past', label: 'Finalizados', count: eventCounts.past }
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {buttons.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            activeFilter === key
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {label}
          <span className={`text-xs px-2 py-1 rounded-full ${
            activeFilter === key
              ? 'bg-blue-400 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}