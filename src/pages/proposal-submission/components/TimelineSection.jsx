import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  isExpanded, 
  onToggle 
}) => {
  const addMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: '',
      description: '',
      expectedDate: '',
      estimatedCost: ''
    };
    
    const updatedMilestones = [...(formData?.milestones || []), newMilestone];
    onInputChange('milestones', updatedMilestones);
  };

  const removeMilestone = (milestoneId) => {
    const updatedMilestones = formData?.milestones?.filter(m => m?.id !== milestoneId) || [];
    onInputChange('milestones', updatedMilestones);
  };

  const updateMilestone = (milestoneId, field, value) => {
    const updatedMilestones = formData?.milestones?.map(milestone => 
      milestone?.id === milestoneId 
        ? { ...milestone, [field]: value }
        : milestone
    ) || [];
    onInputChange('milestones', updatedMilestones);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value?.replace(/\D/g, '');
    const formattedValue = (parseInt(numericValue) / 100)?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  };

  const handleCostChange = (milestoneId, value) => {
    const rawValue = value?.replace(/\D/g, '');
    const formattedValue = formatCurrency(rawValue);
    updateMilestone(milestoneId, 'estimatedCost', formattedValue);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={16} className="text-success" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-semibold text-text-primary">
              Cronograma de Implementação
            </h3>
            <p className="text-sm text-text-secondary">
              Etapas e prazos para execução da proposta
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
          {/* Project Duration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Data de Início Prevista"
              type="date"
              value={formData?.startDate}
              onChange={(e) => onInputChange('startDate', e?.target?.value)}
              error={errors?.startDate}
              required
              description="Quando a implementação deve começar"
            />

            <Input
              label="Data de Conclusão Prevista"
              type="date"
              value={formData?.endDate}
              onChange={(e) => onInputChange('endDate', e?.target?.value)}
              error={errors?.endDate}
              required
              description="Prazo final para conclusão"
            />
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">
                Etapas do Projeto
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
                iconName="Plus"
                iconPosition="left"
              >
                Adicionar Etapa
              </Button>
            </div>

            {formData?.milestones && formData?.milestones?.length > 0 ? (
              <div className="space-y-4">
                {formData?.milestones?.map((milestone, index) => (
                  <div key={milestone?.id} className="bg-muted rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-text-primary flex items-center">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                          {index + 1}
                        </div>
                        Etapa {index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeMilestone(milestone?.id)}
                        className="p-1 text-text-secondary hover:text-destructive transition-smooth"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Input
                        label="Título da Etapa"
                        type="text"
                        placeholder="Ex: Elaboração do projeto executivo"
                        value={milestone?.title}
                        onChange={(e) => updateMilestone(milestone?.id, 'title', e?.target?.value)}
                        required
                      />

                      <Input
                        label="Data Prevista"
                        type="date"
                        value={milestone?.expectedDate}
                        onChange={(e) => updateMilestone(milestone?.id, 'expectedDate', e?.target?.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-text-primary">
                        Descrição da Etapa
                      </label>
                      <textarea
                        placeholder="Descreva as atividades desta etapa..."
                        value={milestone?.description}
                        onChange={(e) => updateMilestone(milestone?.id, 'description', e?.target?.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="lg:w-1/2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-primary">
                          Custo Estimado (Opcional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="R$ 0,00"
                            value={milestone?.estimatedCost}
                            onChange={(e) => handleCostChange(milestone?.id, e?.target?.value)}
                            className="w-full px-3 py-2 pl-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-text-secondary">R$</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted rounded-lg">
                <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary mb-4">
                  Nenhuma etapa adicionada ainda
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMilestone}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Adicionar Primeira Etapa
                </Button>
              </div>
            )}
          </div>

          {/* Implementation Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Observações sobre a Implementação
            </label>
            <textarea
              placeholder="Adicione informações importantes sobre recursos necessários, parcerias, riscos ou considerações especiais..."
              value={formData?.implementationNotes}
              onChange={(e) => onInputChange('implementationNotes', e?.target?.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-sm text-text-secondary">
              {formData?.implementationNotes?.length || 0}/1000 caracteres
            </p>
          </div>

          {errors?.milestones && (
            <p className="text-sm text-destructive">{errors?.milestones}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineSection;