import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MockCredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState('');

  const mockCredentials = [
    {
      type: 'citizen',
      label: 'Cidadão',
      icon: 'User',
      document: '123.456.789-00',
      password: 'cidadao123',
      description: 'Acesso para cidadãos comuns'
    },
    {
      type: 'entity',
      label: 'Entidade',
      icon: 'Building2',
      document: '12.345.678/0001-90',
      password: 'entidade123',
      description: 'Acesso para organizações municipais'
    },
    {
      type: 'manager',
      label: 'Gestor',
      icon: 'UserCheck',
      document: '987.654.321-00',
      password: 'gestor123',
      description: 'Acesso para gestores municipais'
    },
    {
      type: 'admin',
      label: 'Administrador',
      icon: 'Settings',
      document: '111.222.333-44',
      password: 'admin123',
      description: 'Acesso administrativo completo'
    }
  ];

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedCredential(`${type}-${text}`);
      setTimeout(() => setCopiedCredential(''), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Toggle Button */}
      <div className="text-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          {isExpanded ? 'Ocultar' : 'Ver'} Credenciais de Teste
        </Button>
      </div>
      {/* Credentials Panel */}
      {isExpanded && (
        <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="TestTube" size={20} className="text-warning" />
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Credenciais para Demonstração
            </h3>
          </div>
          
          <p className="text-sm text-text-secondary mb-6">
            Use as credenciais abaixo para testar diferentes tipos de usuário na plataforma:
          </p>

          <div className="grid gap-4">
            {mockCredentials?.map((credential) => (
              <div
                key={credential?.type}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={credential?.icon} size={18} className="text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-text-primary">
                          {credential?.label}
                        </h4>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {credential?.type}
                        </span>
                      </div>
                      
                      <p className="text-xs text-text-secondary mb-3">
                        {credential?.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-text-secondary">
                              {credential?.type === 'entity' ? 'CNPJ:' : 'CPF:'}
                            </span>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {credential?.document}
                            </code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(credential?.document, credential?.type)}
                            className="text-primary hover:text-primary/80 transition-smooth"
                          >
                            <Icon 
                              name={copiedCredential === `${credential?.type}-${credential?.document}` ? 'Check' : 'Copy'} 
                              size={14} 
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-text-secondary">Senha:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {credential?.password}
                            </code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(credential?.password, credential?.type)}
                            className="text-primary hover:text-primary/80 transition-smooth"
                          >
                            <Icon 
                              name={copiedCredential === `${credential?.type}-${credential?.password}` ? 'Check' : 'Copy'} 
                              size={14} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warning Notice */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={18} className="text-warning mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-warning mb-1">
                  Apenas para Demonstração
                </h4>
                <p className="text-xs text-text-secondary">
                  Estas credenciais são fictícias e destinadas apenas para teste da plataforma. 
                  Em um ambiente de produção, seria necessário cadastro oficial com documentos válidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockCredentialsInfo;