import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BasicInformationSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  isExpanded, 
  onToggle 
}) => {
  const categoryOptions = [
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'meio-ambiente', label: 'Meio Ambiente' },
    { value: 'cultura', label: 'Cultura e Lazer' },
    { value: 'seguranca', label: 'Segurança Pública' },
    { value: 'assistencia-social', label: 'Assistência Social' },
    { value: 'habitacao', label: 'Habitação' },
    { value: 'esporte', label: 'Esporte' }
  ];

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value?.replace(/\D/g, '');
    const formattedValue = (parseInt(numericValue) / 100)?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  };

  const handleBudgetChange = (e) => {
    const rawValue = e?.target?.value?.replace(/\D/g, '');
    const formattedValue = formatCurrency(rawValue);
    onInputChange('budget', formattedValue);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Info" size={16} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-semibold text-text-primary">
              Informações Básicas
            </h3>
            <p className="text-sm text-text-secondary">
              Título, descrição e categoria da proposta
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-secondary" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Input
                label="Título da Proposta"
                type="text"
                placeholder="Digite um título claro e objetivo"
                value={formData?.title}
                onChange={(e) => onInputChange('title', e?.target?.value)}
                error={errors?.title}
                required
                maxLength={100}
                description={`${formData?.title?.length || 0}/100 caracteres`}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Descrição Detalhada <span className="text-destructive">*</span>
                </label>
                <textarea
                  placeholder="Descreva sua proposta de forma detalhada, incluindo objetivos, benefícios e justificativa..."
                  value={formData?.description}
                  onChange={(e) => onInputChange('description', e?.target?.value)}
                  rows={6}
                  maxLength={2000}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-text-secondary">
                    Mínimo 100 caracteres para uma descrição adequada
                  </p>
                  <p className="text-sm text-text-secondary">
                    {formData?.description?.length || 0}/2000 caracteres
                  </p>
                </div>
                {errors?.description && (
                  <p className="text-sm text-destructive">{errors?.description}</p>
                )}
              </div>
            </div>

            <Select
              label="Categoria"
              placeholder="Selecione a categoria"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => onInputChange('category', value)}
              error={errors?.category}
              required
              description="Escolha a área municipal mais adequada"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Valor do Orçamento <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={formData?.budget}
                  onChange={handleBudgetChange}
                  className="w-full px-3 py-2 pl-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-secondary">R$</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                Limite máximo: R$ 500.000,00 por proposta
              </p>
              {errors?.budget && (
                <p className="text-sm text-destructive">{errors?.budget}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInformationSection;