import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFilterChange, analysts }) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'under_review', label: 'Em Análise' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'needs_revision', label: 'Necessita Revisão' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Infraestrutura', label: 'Infraestrutura' },
    { value: 'Educação', label: 'Educação' },
    { value: 'Mobilidade', label: 'Mobilidade' },
    { value: 'Meio Ambiente', label: 'Meio Ambiente' },
    { value: 'Cultura', label: 'Cultura' },
    { value: 'Saúde', label: 'Saúde' }
  ];

  const budgetRangeOptions = [
    { value: 'all', label: 'Todas as Faixas' },
    { value: '0-50000', label: 'Até R$ 50.000' },
    { value: '50000-100000', label: 'R$ 50.000 - R$ 100.000' },
    { value: '100000-200000', label: 'R$ 100.000 - R$ 200.000' },
    { value: '200000+', label: 'Acima de R$ 200.000' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Todo o Período' },
    { value: 'last7days', label: 'Últimos 7 dias' },
    { value: 'last30days', label: 'Últimos 30 dias' },
    { value: 'last3months', label: 'Últimos 3 meses' },
    { value: 'thisyear', label: 'Este ano' }
  ];

  const analystOptions = [
    { value: 'all', label: 'Todos os Analistas' },
    { value: 'unassigned', label: 'Não Atribuídos' },
    ...analysts?.map(analyst => ({
      value: analyst?.name,
      label: analyst?.name
    }))
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: 'all',
      category: 'all',
      budgetRange: 'all',
      dateRange: 'all',
      assignedAnalyst: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== 'all');

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Filtros de Análise
        </h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={clearAllFilters}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <Select
            value={filters?.status}
            onValueChange={(value) => handleFilterChange('status', value)}
            options={statusOptions}
            placeholder="Selecione o status"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Categoria
          </label>
          <Select
            value={filters?.category}
            onValueChange={(value) => handleFilterChange('category', value)}
            options={categoryOptions}
            placeholder="Selecione a categoria"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Faixa de Orçamento
          </label>
          <Select
            value={filters?.budgetRange}
            onValueChange={(value) => handleFilterChange('budgetRange', value)}
            options={budgetRangeOptions}
            placeholder="Selecione a faixa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Período
          </label>
          <Select
            value={filters?.dateRange}
            onValueChange={(value) => handleFilterChange('dateRange', value)}
            options={dateRangeOptions}
            placeholder="Selecione o período"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Analista
          </label>
          <Select
            value={filters?.assignedAnalyst}
            onValueChange={(value) => handleFilterChange('assignedAnalyst', value)}
            options={analystOptions}
            placeholder="Selecione o analista"
          />
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm font-medium text-muted-foreground">
          Filtros Rápidos:
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'pending')}
          className={filters?.status === 'pending' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Icon name="Clock" size={14} className="mr-1" />
          Pendentes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('assignedAnalyst', 'unassigned')}
          className={filters?.assignedAnalyst === 'unassigned' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Icon name="UserX" size={14} className="mr-1" />
          Não Atribuídos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange('status', 'needs_revision')}
          className={filters?.status === 'needs_revision' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Icon name="AlertCircle" size={14} className="mr-1" />
          Revisão
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;