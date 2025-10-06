import React from 'react';
import Icon from '../../../components/AppIcon';

const UserTypeSelector = ({ selectedType, onTypeChange, error }) => {
  const userTypes = [
    {
      value: 'cidadao',
      label: 'Cidadão',
      description: 'Pessoa física que deseja participar do orçamento participativo',
      icon: 'User',
      documentType: 'CPF',
      permissions: ['Enviar propostas', 'Votar em propostas', 'Acompanhar execução']
    },
    {
      value: 'entidade',
      label: 'Entidade',
      description: 'Organização, empresa ou instituição',
      icon: 'Building2',
      documentType: 'CNPJ',
      permissions: ['Enviar propostas', 'Representar organização']
    },
    {
      value: 'gestor',
      label: 'Gestor Municipal',
      description: 'Funcionário público responsável pela análise de propostas',
      icon: 'Shield',
      documentType: 'CPF',
      permissions: ['Analisar propostas', 'Gerenciar processos', 'Relatórios'],
      requiresApproval: true
    },
    {
      value: 'admin',
      label: 'Administrador',
      description: 'Administrador do sistema com acesso completo',
      icon: 'Settings',
      documentType: 'CPF',
      permissions: ['Configurar sistema', 'Gerenciar usuários', 'Controle total'],
      requiresApproval: true
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Tipo de Usuário *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userTypes?.map((type) => (
            <div
              key={type?.value}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedType === type?.value
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
              }`}
              onClick={() => onTypeChange(type?.value)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedType === type?.value ? 'bg-primary text-white' : 'bg-muted'
                }`}>
                  <Icon name={type?.icon} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-text-primary">{type?.label}</h3>
                    {type?.requiresApproval && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        <Icon name="Clock" size={12} className="mr-1" />
                        Aprovação
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{type?.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-text-primary mb-1">
                      Documento: {type?.documentType}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {type?.permissions?.slice(0, 2)?.map((permission, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary"
                        >
                          {permission}
                        </span>
                      ))}
                      {type?.permissions?.length > 2 && (
                        <span className="text-xs text-text-secondary">
                          +{type?.permissions?.length - 2} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedType === type?.value
                    ? 'border-primary bg-primary' :'border-border'
                }`}>
                  {selectedType === type?.value && (
                    <Icon name="Check" size={12} color="white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-1" />
            {error}
          </p>
        )}
      </div>
      {selectedType && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-text-primary mb-1">
                Informações sobre {userTypes?.find(t => t?.value === selectedType)?.label}
              </p>
              {selectedType === 'cidadao' && (
                <p className="text-text-secondary">
                  Como cidadão, você poderá participar ativamente do orçamento participativo, enviando propostas e votando nas iniciativas da sua comunidade.
                </p>
              )}
              {selectedType === 'entidade' && (
                <p className="text-text-secondary">
                  Como entidade, você poderá representar sua organização enviando propostas que beneficiem a comunidade local.
                </p>
              )}
              {(selectedType === 'gestor' || selectedType === 'admin') && (
                <div className="space-y-2">
                  <p className="text-text-secondary">
                    Esta conta requer aprovação manual da administração municipal.
                  </p>
                  <div className="flex items-center space-x-2 text-warning">
                    <Icon name="Clock" size={14} />
                    <span className="text-xs font-medium">
                      Tempo de aprovação: 2-5 dias úteis
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTypeSelector;