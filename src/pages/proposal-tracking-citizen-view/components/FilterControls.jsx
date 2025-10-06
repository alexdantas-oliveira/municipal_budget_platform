import React from 'react';
import { X } from 'lucide-react';

const FilterControls = ({
  filters,
  localities,
  categories,
  onFilterChange,
  onClearFilters
}) => {
  const statusOptions = [
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'atrasada', label: 'Atrasada' },
    { value: 'concluida', label: 'Concluída' }
  ];

  return (
    <div className="border-t pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Localidade Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localidade
          </label>
          <select
            value={filters?.localidade || ''}
            onChange={(e) => onFilterChange('localidade', e?.target?.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as localidades</option>
            {localities?.map((locality) => (
              <option key={locality} value={locality}>
                {locality}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters?.status_execucao || ''}
            onChange={(e) => onFilterChange('status_execucao', e?.target?.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {statusOptions?.map((status) => (
              <option key={status?.value} value={status?.value}>
                {status?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={filters?.categoria || ''}
            onChange={(e) => onFilterChange('categoria', e?.target?.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;