import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LocationSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  isExpanded, 
  onToggle 
}) => {
  const regionOptions = [
    { value: 'centro', label: 'Centro' },
    { value: 'zona-norte', label: 'Zona Norte' },
    { value: 'zona-sul', label: 'Zona Sul' },
    { value: 'zona-leste', label: 'Zona Leste' },
    { value: 'zona-oeste', label: 'Zona Oeste' },
    { value: 'toda-cidade', label: 'Toda a Cidade' }
  ];

  const formatCEP = (value) => {
    const numericValue = value?.replace(/\D/g, '');
    if (numericValue?.length <= 5) {
      return numericValue;
    }
    return `${numericValue?.slice(0, 5)}-${numericValue?.slice(5, 8)}`;
  };

  const handleCEPChange = (e) => {
    const formattedCEP = formatCEP(e?.target?.value);
    onInputChange('cep', formattedCEP);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="MapPin" size={16} className="text-secondary" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-semibold text-text-primary">
              Localização
            </h3>
            <p className="text-sm text-text-secondary">
              Região e endereço de implementação
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
            <Select
              label="Região da Cidade"
              placeholder="Selecione a região"
              options={regionOptions}
              value={formData?.region}
              onChange={(value) => onInputChange('region', value)}
              error={errors?.region}
              required
              description="Área de implementação da proposta"
            />

            <Input
              label="CEP"
              type="text"
              placeholder="00000-000"
              value={formData?.cep}
              onChange={handleCEPChange}
              error={errors?.cep}
              maxLength={9}
              description="CEP da localização específica (opcional)"
            />

            <div className="lg:col-span-2">
              <Input
                label="Endereço Completo"
                type="text"
                placeholder="Rua, número, bairro (opcional)"
                value={formData?.address}
                onChange={(e) => onInputChange('address', e?.target?.value)}
                error={errors?.address}
                description="Endereço específico se aplicável"
              />
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Justificativa da Localização
                </label>
                <textarea
                  placeholder="Explique por que esta localização foi escolhida e como beneficiará a comunidade local..."
                  value={formData?.locationJustification}
                  onChange={(e) => onInputChange('locationJustification', e?.target?.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <p className="text-sm text-text-secondary">
                  {formData?.locationJustification?.length || 0}/500 caracteres
                </p>
                {errors?.locationJustification && (
                  <p className="text-sm text-destructive">{errors?.locationJustification}</p>
                )}
              </div>
            </div>

            {/* Map Preview */}
            <div className="lg:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Visualização da Localização
                </label>
                <div className="w-full h-64 bg-muted rounded-lg border border-border overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    title="Localização da Proposta"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=-23.5505,-46.6333&z=14&output=embed"
                    className="border-0"
                  />
                </div>
                <p className="text-sm text-text-secondary">
                  Mapa será atualizado automaticamente com base no CEP informado
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSection;