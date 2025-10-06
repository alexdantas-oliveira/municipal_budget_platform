import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ImpactAssessmentSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  isExpanded, 
  onToggle 
}) => {
  const demographicOptions = [
    { value: 'criancas', label: 'Crianças (0-12 anos)' },
    { value: 'adolescentes', label: 'Adolescentes (13-17 anos)' },
    { value: 'jovens', label: 'Jovens (18-29 anos)' },
    { value: 'adultos', label: 'Adultos (30-59 anos)' },
    { value: 'idosos', label: 'Idosos (60+ anos)' },
    { value: 'pessoas-deficiencia', label: 'Pessoas com Deficiência' },
    { value: 'baixa-renda', label: 'Famílias de Baixa Renda' },
    { value: 'mulheres', label: 'Mulheres' },
    { value: 'comunidade-geral', label: 'Comunidade em Geral' }
  ];

  const handleDemographicChange = (value, checked) => {
    const currentDemographics = formData?.targetDemographics || [];
    let updatedDemographics;
    
    if (checked) {
      updatedDemographics = [...currentDemographics, value];
    } else {
      updatedDemographics = currentDemographics?.filter(item => item !== value);
    }
    
    onInputChange('targetDemographics', updatedDemographics);
  };

  const estimatedBeneficiariesOptions = [
    { value: '1-50', label: '1 a 50 pessoas' },
    { value: '51-200', label: '51 a 200 pessoas' },
    { value: '201-500', label: '201 a 500 pessoas' },
    { value: '501-1000', label: '501 a 1.000 pessoas' },
    { value: '1001-5000', label: '1.001 a 5.000 pessoas' },
    { value: '5000+', label: 'Mais de 5.000 pessoas' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} className="text-error" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-semibold text-text-primary">
              Avaliação de Impacto
            </h3>
            <p className="text-sm text-text-secondary">
              Beneficiários e resultados esperados
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
          {/* Target Demographics */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">
                Público-Alvo Beneficiado <span className="text-destructive">*</span>
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                Selecione os grupos demográficos que serão beneficiados pela proposta
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {demographicOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={formData?.targetDemographics?.includes(option?.value) || false}
                  onChange={(e) => handleDemographicChange(option?.value, e?.target?.checked)}
                />
              ))}
            </div>
            
            {errors?.targetDemographics && (
              <p className="text-sm text-destructive">{errors?.targetDemographics}</p>
            )}
          </div>

          {/* Estimated Beneficiaries */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">
              Número Estimado de Beneficiários <span className="text-destructive">*</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {estimatedBeneficiariesOptions?.map((option) => (
                <label
                  key={option?.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-smooth ${
                    formData?.estimatedBeneficiaries === option?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="estimatedBeneficiaries"
                    value={option?.value}
                    checked={formData?.estimatedBeneficiaries === option?.value}
                    onChange={(e) => onInputChange('estimatedBeneficiaries', e?.target?.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData?.estimatedBeneficiaries === option?.value
                      ? 'border-primary' :'border-border'
                  }`}>
                    {formData?.estimatedBeneficiaries === option?.value && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {option?.label}
                  </span>
                </label>
              ))}
            </div>
            
            {errors?.estimatedBeneficiaries && (
              <p className="text-sm text-destructive">{errors?.estimatedBeneficiaries}</p>
            )}
          </div>

          {/* Expected Outcomes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Resultados Esperados <span className="text-destructive">*</span>
            </label>
            <textarea
              placeholder="Descreva os benefícios e melhorias que a proposta trará para a comunidade. Seja específico sobre os resultados esperados..."
              value={formData?.expectedOutcomes}
              onChange={(e) => onInputChange('expectedOutcomes', e?.target?.value)}
              rows={5}
              maxLength={1500}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-text-secondary">
                Descreva impactos sociais, econômicos e ambientais
              </p>
              <p className="text-sm text-text-secondary">
                {formData?.expectedOutcomes?.length || 0}/1500 caracteres
              </p>
            </div>
            {errors?.expectedOutcomes && (
              <p className="text-sm text-destructive">{errors?.expectedOutcomes}</p>
            )}
          </div>

          {/* Success Indicators */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Indicadores de Sucesso
            </label>
            <textarea
              placeholder="Como será possível medir o sucesso da proposta? Defina métricas e indicadores quantitativos e qualitativos..."
              value={formData?.successIndicators}
              onChange={(e) => onInputChange('successIndicators', e?.target?.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-text-secondary">
                Ex: número de atendimentos, redução de tempo, melhoria na qualidade
              </p>
              <p className="text-sm text-text-secondary">
                {formData?.successIndicators?.length || 0}/1000 caracteres
              </p>
            </div>
            {errors?.successIndicators && (
              <p className="text-sm text-destructive">{errors?.successIndicators}</p>
            )}
          </div>

          {/* Long-term Impact */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Impacto a Longo Prazo
            </label>
            <textarea
              placeholder="Quais são os benefícios esperados a longo prazo? Como a proposta contribuirá para o desenvolvimento sustentável da comunidade?"
              value={formData?.longTermImpact}
              onChange={(e) => onInputChange('longTermImpact', e?.target?.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-sm text-text-secondary">
              {formData?.longTermImpact?.length || 0}/1000 caracteres
            </p>
            {errors?.longTermImpact && (
              <p className="text-sm text-destructive">{errors?.longTermImpact}</p>
            )}
          </div>

          {/* Impact Summary Card */}
          <div className="bg-accent/50 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-3 flex items-center">
              <Icon name="Target" size={16} className="mr-2 text-primary" />
              Resumo do Impacto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-text-primary">Público-Alvo:</p>
                <p className="text-text-secondary">
                  {formData?.targetDemographics?.length || 0} grupos selecionados
                </p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Beneficiários:</p>
                <p className="text-text-secondary">
                  {formData?.estimatedBeneficiaries || 'Não informado'}
                </p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Resultados:</p>
                <p className="text-text-secondary">
                  {formData?.expectedOutcomes ? 'Definidos' : 'Pendente'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactAssessmentSection;