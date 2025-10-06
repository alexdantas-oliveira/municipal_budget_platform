import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserProposalCard = ({ proposal, onEdit, onViewDetails }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-muted text-muted-foreground',
      'submitted': 'bg-warning text-warning-foreground',
      'under_review': 'bg-primary text-primary-foreground',
      'approved': 'bg-success text-success-foreground',
      'rejected': 'bg-destructive text-destructive-foreground',
      'in_execution': 'bg-secondary text-secondary-foreground',
      'completed': 'bg-success text-success-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status) => {
    const texts = {
      'draft': 'Rascunho',
      'submitted': 'Enviada',
      'under_review': 'Em Análise',
      'approved': 'Aprovada',
      'rejected': 'Rejeitada',
      'in_execution': 'Em Execução',
      'completed': 'Concluída'
    };
    return texts?.[status] || status;
  };

  const canEdit = ['draft', 'rejected']?.includes(proposal?.status);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {proposal?.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Criada em {formatDate(proposal?.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Tag" size={16} />
              <span>{proposal?.category}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal?.status)}`}>
          {getStatusText(proposal?.status)}
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {proposal?.description}
      </p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-xs text-muted-foreground">Orçamento Solicitado</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(proposal?.budget)}
            </p>
          </div>
          {proposal?.votes !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground">Votos Recebidos</p>
              <p className="text-lg font-bold text-foreground">
                {proposal?.votes}
              </p>
            </div>
          )}
        </div>
        {proposal?.executionProgress !== undefined && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Progresso</p>
            <p className="text-sm font-medium text-foreground">
              {proposal?.executionProgress}%
            </p>
          </div>
        )}
      </div>
      {proposal?.feedback && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Feedback da Análise:</p>
          <p className="text-sm text-foreground">{proposal?.feedback}</p>
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails(proposal)}
        >
          Ver Detalhes
        </Button>

        {canEdit && (
          <Button
            variant="default"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(proposal)}
          >
            Editar
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProposalCard;