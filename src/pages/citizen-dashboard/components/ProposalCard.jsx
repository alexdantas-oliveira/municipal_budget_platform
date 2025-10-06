import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProposalCard = ({ proposal, onVote, onViewDetails, userRole = 'citizen' }) => {
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
      'voting': 'bg-primary text-primary-foreground',
      'approved': 'bg-success text-success-foreground',
      'rejected': 'bg-destructive text-destructive-foreground',
      'pending': 'bg-warning text-warning-foreground',
      'in_execution': 'bg-secondary text-secondary-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status) => {
    const texts = {
      'voting': 'Em Votação',
      'approved': 'Aprovada',
      'rejected': 'Rejeitada',
      'pending': 'Pendente',
      'in_execution': 'Em Execução'
    };
    return texts?.[status] || status;
  };

  const canVote = proposal?.status === 'voting' && !proposal?.userVoted;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {proposal?.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={16} />
              <span>{proposal?.location}</span>
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
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {proposal?.description}
      </p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-xs text-muted-foreground">Orçamento</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(proposal?.budget)}
            </p>
          </div>
          {proposal?.status === 'voting' && (
            <div>
              <p className="text-xs text-muted-foreground">Votos</p>
              <p className="text-lg font-bold text-foreground">
                {proposal?.votes || 0}
              </p>
            </div>
          )}
        </div>
        {proposal?.deadline && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Prazo</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(proposal?.deadline)}
            </p>
          </div>
        )}
      </div>
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

        {canVote && userRole === 'citizen' && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ThumbsDown"
              onClick={() => onVote(proposal?.id, 'against')}
            >
              Contra
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="ThumbsUp"
              onClick={() => onVote(proposal?.id, 'favor')}
            >
              A Favor
            </Button>
          </div>
        )}

        {proposal?.userVoted && (
          <div className="flex items-center space-x-2 text-sm text-success">
            <Icon name="CheckCircle" size={16} />
            <span>Você já votou</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;