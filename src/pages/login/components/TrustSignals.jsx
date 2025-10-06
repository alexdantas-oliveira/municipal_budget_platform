import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'Certificação Gov.br',
      description: 'Plataforma certificada pelo governo brasileiro'
    },
    {
      id: 2,
      icon: 'Lock',
      title: 'SSL Seguro',
      description: 'Conexão criptografada AES-256'
    },
    {
      id: 3,
      icon: 'FileCheck',
      title: 'Receita Federal',
      description: 'Integração oficial com dados da RF'
    },
    {
      id: 4,
      icon: 'Users',
      title: 'LGPD Compliance',
      description: 'Proteção de dados pessoais'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Trust Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Shield" size={24} color="white" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Ambiente Seguro e Confiável
            </h3>
            <p className="text-sm text-text-secondary">
              Autenticação oficial do governo brasileiro
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-success">
          <Icon name="CheckCircle" size={16} />
          <span>Conexão segura estabelecida</span>
        </div>
      </div>
      {/* Trust Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {trustBadges?.map((badge) => (
          <div
            key={badge?.id}
            className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-soft transition-smooth"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name={badge?.icon} size={20} className="text-primary" />
            </div>
            <h4 className="text-sm font-medium text-text-primary mb-1">
              {badge?.title}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {badge?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Security Information */}
      <div className="bg-muted/50 border border-border rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-text-primary mb-2">
              Informações de Segurança
            </h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Seus dados são protegidos por criptografia AES-256</li>
              <li>• Validação em tempo real com a Receita Federal</li>
              <li>• Sessões seguras com timeout automático</li>
              <li>• Conformidade total com a LGPD</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Government Logos */}
      <div className="flex items-center justify-center space-x-8 mt-8 pt-6 border-t border-border">
        <div className="flex items-center space-x-2 text-text-secondary">
          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
            <Icon name="Building2" size={16} className="text-primary" />
          </div>
          <span className="text-xs font-medium">Gov.br</span>
        </div>
        
        <div className="flex items-center space-x-2 text-text-secondary">
          <div className="w-8 h-8 bg-secondary/10 rounded flex items-center justify-center">
            <Icon name="FileCheck" size={16} className="text-secondary" />
          </div>
          <span className="text-xs font-medium">Receita Federal</span>
        </div>
        
        <div className="flex items-center space-x-2 text-text-secondary">
          <div className="w-8 h-8 bg-success/10 rounded flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-success" />
          </div>
          <span className="text-xs font-medium">LGPD</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;