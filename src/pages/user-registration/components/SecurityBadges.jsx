import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Criptografia AES-256',
      description: 'Dados protegidos com criptografia de nível militar'
    },
    {
      icon: 'Database',
      title: 'Receita Federal',
      description: 'Validação oficial de documentos brasileiros'
    },
    {
      icon: 'Lock',
      title: 'OAuth2 Seguro',
      description: 'Autenticação moderna e confiável'
    },
    {
      icon: 'Eye',
      title: 'Privacidade',
      description: 'Seus dados nunca são compartilhados'
    }
  ];

  const certifications = [
    {
      icon: 'Award',
      title: 'Certificação Gov.br',
      description: 'Plataforma certificada pelo governo brasileiro'
    },
    {
      icon: 'CheckCircle',
      title: 'SSL/TLS',
      description: 'Conexão segura e criptografada'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Features */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2 text-primary" />
          Segurança e Proteção
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-card border border-border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary text-sm">{feature?.title}</h4>
                <p className="text-xs text-text-secondary mt-1">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Government Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Award" size={20} className="mr-2 text-secondary" />
          Certificações Oficiais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications?.map((cert, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-card border border-border rounded-lg">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Icon name={cert?.icon} size={16} className="text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary text-sm">{cert?.title}</h4>
                <p className="text-xs text-text-secondary mt-1">{cert?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Privacy Notice */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-text-primary mb-2">Compromisso com a Privacidade</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Esta plataforma segue rigorosamente a Lei Geral de Proteção de Dados (LGPD) e 
              utiliza apenas as informações necessárias para verificação de identidade e 
              participação no orçamento participativo municipal. Seus dados pessoais são 
              criptografados e nunca compartilhados com terceiros.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>Última atualização: 15/09/2025</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={12} />
                <span>Conforme LGPD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;