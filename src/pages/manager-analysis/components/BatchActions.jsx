import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BatchActions = ({ selectedCount, onBatchAction, onClearSelection }) => {
  const actions = [
    {
      id: 'assign',
      label: 'Atribuir Analista',
      icon: 'UserPlus',
      variant: 'default'
    },
    {
      id: 'approve',
      label: 'Aprovar em Lote',
      icon: 'CheckCircle',
      variant: 'default'
    },
    {
      id: 'reject',
      label: 'Rejeitar em Lote',
      icon: 'XCircle',
      variant: 'destructive'
    },
    {
      id: 'export',
      label: 'Exportar Selecionadas',
      icon: 'Download',
      variant: 'outline'
    }
  ];

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedCount} propostas selecionadas
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar seleção
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {actions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant}
              size="sm"
              iconName={action?.icon}
              iconPosition="left"
              onClick={() => onBatchAction(action?.id)}
              className="flex items-center space-x-1"
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchActions;