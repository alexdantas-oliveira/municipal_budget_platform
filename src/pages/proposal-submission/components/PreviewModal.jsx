import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const getCategoryLabel = (value) => {
    const categories = {
      'saude': 'Saúde',
      'educacao': 'Educação',
      'infraestrutura': 'Infraestrutura',
      'transporte': 'Transporte',
      'meio-ambiente': 'Meio Ambiente',
      'cultura': 'Cultura e Lazer',
      'seguranca': 'Segurança Pública',
      'assistencia-social': 'Assistência Social',
      'habitacao': 'Habitação',
      'esporte': 'Esporte'
    };
    return categories?.[value] || value;
  };

  const getRegionLabel = (value) => {
    const regions = {
      'centro': 'Centro',
      'zona-norte': 'Zona Norte',
      'zona-sul': 'Zona Sul',
      'zona-leste': 'Zona Leste',
      'zona-oeste': 'Zona Oeste',
      'toda-cidade': 'Toda a Cidade'
    };
    return regions?.[value] || value;
  };

  const getDemographicLabels = (values) => {
    const demographics = {
      'criancas': 'Crianças (0-12 anos)',
      'adolescentes': 'Adolescentes (13-17 anos)',
      'jovens': 'Jovens (18-29 anos)',
      'adultos': 'Adultos (30-59 anos)',
      'idosos': 'Idosos (60+ anos)',
      'pessoas-deficiencia': 'Pessoas com Deficiência',
      'baixa-renda': 'Famílias de Baixa Renda',
      'mulheres': 'Mulheres',
      'comunidade-geral': 'Comunidade em Geral'
    };
    return values?.map(value => demographics?.[value] || value)?.join(', ') || 'Não informado';
  };

  const getBeneficiariesLabel = (value) => {
    const options = {
      '1-50': '1 a 50 pessoas',
      '51-200': '51 a 200 pessoas',
      '201-500': '201 a 500 pessoas',
      '501-1000': '501 a 1.000 pessoas',
      '1001-5000': '1.001 a 5.000 pessoas',
      '5000+': 'Mais de 5.000 pessoas'
    };
    return options?.[value] || 'Não informado';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-text-primary">
                Visualização da Proposta
              </h2>
              <p className="text-sm text-text-secondary">
                Revise todas as informações antes do envio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Basic Information */}
            <section>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="Info" size={20} className="mr-2 text-primary" />
                Informações Básicas
              </h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Título:</p>
                  <p className="text-text-secondary">{formData?.title || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Descrição:</p>
                  <p className="text-text-secondary whitespace-pre-wrap">
                    {formData?.description || 'Não informado'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Categoria:</p>
                    <p className="text-text-secondary">{getCategoryLabel(formData?.category)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Orçamento:</p>
                    <p className="text-text-secondary">{formatCurrency(formData?.budget)}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="MapPin" size={20} className="mr-2 text-secondary" />
                Localização
              </h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Região:</p>
                    <p className="text-text-secondary">{getRegionLabel(formData?.region)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">CEP:</p>
                    <p className="text-text-secondary">{formData?.cep || 'Não informado'}</p>
                  </div>
                </div>
                {formData?.address && (
                  <div>
                    <p className="text-sm font-medium text-text-primary">Endereço:</p>
                    <p className="text-text-secondary">{formData?.address}</p>
                  </div>
                )}
                {formData?.locationJustification && (
                  <div>
                    <p className="text-sm font-medium text-text-primary">Justificativa:</p>
                    <p className="text-text-secondary whitespace-pre-wrap">
                      {formData?.locationJustification}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="Calendar" size={20} className="mr-2 text-success" />
                Cronograma
              </h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Início Previsto:</p>
                    <p className="text-text-secondary">{formatDate(formData?.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Conclusão Prevista:</p>
                    <p className="text-text-secondary">{formatDate(formData?.endDate)}</p>
                  </div>
                </div>
                
                {formData?.milestones && formData?.milestones?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-text-primary mb-2">Etapas:</p>
                    <div className="space-y-2">
                      {formData?.milestones?.map((milestone, index) => (
                        <div key={milestone?.id} className="bg-card rounded p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="font-medium text-text-primary">{milestone?.title}</p>
                            <span className="text-sm text-text-secondary">
                              - {formatDate(milestone?.expectedDate)}
                            </span>
                          </div>
                          {milestone?.description && (
                            <p className="text-sm text-text-secondary ml-7">
                              {milestone?.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Impact Assessment */}
            <section>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="Users" size={20} className="mr-2 text-error" />
                Avaliação de Impacto
              </h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Público-Alvo:</p>
                  <p className="text-text-secondary">
                    {getDemographicLabels(formData?.targetDemographics)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Beneficiários Estimados:</p>
                  <p className="text-text-secondary">
                    {getBeneficiariesLabel(formData?.estimatedBeneficiaries)}
                  </p>
                </div>
                {formData?.expectedOutcomes && (
                  <div>
                    <p className="text-sm font-medium text-text-primary">Resultados Esperados:</p>
                    <p className="text-text-secondary whitespace-pre-wrap">
                      {formData?.expectedOutcomes}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Documents */}
            {formData?.documents && formData?.documents?.length > 0 && (
              <section>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
                  <Icon name="Upload" size={20} className="mr-2 text-warning" />
                  Documentos Anexados
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="space-y-2">
                    {formData?.documents?.map((doc) => (
                      <div key={doc?.id} className="flex items-center space-x-3 p-2 bg-card rounded">
                        <Icon name="File" size={16} className="text-primary" />
                        <span className="text-sm text-text-primary">{doc?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="default" iconName="Edit" iconPosition="left">
            Editar Proposta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;