import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VotingFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  proposalCount,
  isLoading 
}) => {
  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'Saúde', label: 'Saúde' },
    { value: 'Educação', label: 'Educação' },
    { value: 'Infraestrutura', label: 'Infraestrutura' },
    { value: 'Meio Ambiente', label: 'Meio Ambiente' },
    { value: 'Cultura', label: 'Cultura' },
    { value: 'Esporte', label: 'Esporte' },
    { value: 'Segurança', label: 'Segurança' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'oldest', label: 'Mais antigas' },
    { value: 'budget_high', label: 'Maior orçamento' },
    { value: 'budget_low', label: 'Menor orçamento' },
    { value: 'most_votes', label: 'Mais votadas' },
    { value: 'alphabetical', label: 'Ordem alfabética' }
  ];

  const budgetRangeOptions = [
    { value: '', label: 'Qualquer valor' },
    { value: '0-50000', label: 'Até R$ 50.000' },
    { value: '50000-100000', label: 'R$ 50.000 - R$ 100.000' },
    { value: '100000-500000', label: 'R$ 100.000 - R$ 500.000' },
    { value: '500000-1000000', label: 'R$ 500.000 - R$ 1.000.000' },
    { value: '1000000+', label: 'Acima de R$ 1.000.000' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== 'newest'
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Filtros e Ordenação
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">
            {isLoading ? 'Carregando...' : `${proposalCount} propostas encontradas`}
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>
      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Buscar por título ou descrição..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <Select
          placeholder="Categoria"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        {/* Sort */}
        <Select
          placeholder="Ordenar por"
          options={sortOptions}
          value={filters?.sort}
          onChange={(value) => handleFilterChange('sort', value)}
        />

        {/* Budget Range */}
        <Select
          placeholder="Faixa de orçamento"
          options={budgetRangeOptions}
          value={filters?.budgetRange}
          onChange={(value) => handleFilterChange('budgetRange', value)}
        />

        {/* Location */}
        <Input
          type="text"
          placeholder="Localização (bairro, região...)"
          value={filters?.location}
          onChange={(e) => handleFilterChange('location', e?.target?.value)}
        />

        {/* Vote Status Filter */}
        <Select
          placeholder="Status do meu voto"
          options={[
            { value: '', label: 'Todos' },
            { value: 'voted', label: 'Já votei' },
            { value: 'not_voted', label: 'Ainda não votei' },
            { value: 'voted_favor', label: 'Votei a favor' },
            { value: 'voted_against', label: 'Votei contra' }
          ]}
          value={filters?.voteStatus}
          onChange={(value) => handleFilterChange('voteStatus', value)}
        />

        {/* Submitter Type */}
        <Select
          placeholder="Tipo de proponente"
          options={[
            { value: '', label: 'Todos' },
            { value: 'citizen', label: 'Cidadãos' },
            { value: 'entity', label: 'Entidades' }
          ]}
          value={filters?.submitterType}
          onChange={(value) => handleFilterChange('submitterType', value)}
        />
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">
              Filtros ativos:
            </span>
            {filters?.search && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <span>Busca: "{filters?.search}"</span>
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:bg-primary/20 rounded-sm p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.category && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <span>{filters?.category}</span>
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="hover:bg-primary/20 rounded-sm p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.budgetRange && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <span>Orçamento: {budgetRangeOptions?.find(opt => opt?.value === filters?.budgetRange)?.label}</span>
                <button
                  onClick={() => handleFilterChange('budgetRange', '')}
                  className="hover:bg-primary/20 rounded-sm p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.location && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <span>Local: {filters?.location}</span>
                <button
                  onClick={() => handleFilterChange('location', '')}
                  className="hover:bg-primary/20 rounded-sm p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingFilters;