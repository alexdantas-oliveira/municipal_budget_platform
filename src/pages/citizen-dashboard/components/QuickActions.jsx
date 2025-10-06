import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ userRole = 'citizen' }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nova Proposta',
      description: 'Envie uma nova proposta para o orçamento participativo',
      icon: 'Plus',
      variant: 'default',
      path: '/proposal-submission',
      roles: ['citizen', 'entity']
    },
    {
      title: 'Ver Todas Propostas',
      description: 'Explore todas as propostas disponíveis para votação',
      icon: 'FileText',
      variant: 'outline',
      path: '/proposal-voting',
      roles: ['citizen', 'entity', 'manager']
    },
    {
      title: 'Meu Perfil',
      description: 'Gerencie suas informações pessoais e preferências',
      icon: 'User',
      variant: 'outline',
      path: '/profile',
      roles: ['citizen', 'entity', 'manager', 'admin']
    },
    {
      title: 'Configurações',
      description: 'Acesse as configurações do sistema',
      icon: 'Settings',
      variant: 'outline',
      path: '/admin-configuration',
      roles: ['admin', 'manager']
    }
  ];

  const filteredActions = actions?.filter(action => 
    action?.roles?.includes(userRole)
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Ações Rápidas
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActions?.map((action, index) => (
          <div
            key={index}
            className="p-4 border border-border rounded-lg hover:bg-accent transition-smooth cursor-pointer"
            onClick={() => navigate(action?.path)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={action?.icon} size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {action?.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {action?.description}
                </p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Precisa de ajuda?
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.open('/help', '_blank')}
          >
            Central de Ajuda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;