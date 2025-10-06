import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VotingPeriodCard = ({ period, onViewProposals }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-success text-success-foreground',
      'upcoming': 'bg-warning text-warning-foreground',
      'closed': 'bg-muted text-muted-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status) => {
    const texts = {
      'active': 'Ativo',
      'upcoming': 'Em Breve',
      'closed': 'Encerrado'
    };
    return texts?.[status] || status;
  };

  const getDaysRemaining = () => {
    if (period?.status !== 'active') return null;
    
    const today = new Date();
    const endDate = new Date(period.endDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {period?.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {period?.description}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(period?.status)}`}>
          {getStatusText(period?.status)}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Início</p>
          <p className="text-sm font-medium text-foreground">
            {formatDate(period?.startDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Fim</p>
          <p className="text-sm font-medium text-foreground">
            {formatDate(period?.endDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Orçamento Total</p>
          <p className="text-sm font-medium text-foreground">
            {formatCurrency(period?.totalBudget)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Propostas</p>
          <p className="text-sm font-medium text-foreground">
            {period?.proposalCount || 0}
          </p>
        </div>
      </div>
      {daysRemaining !== null && daysRemaining >= 0 && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <p className="text-sm font-medium text-primary">
              {daysRemaining === 0 
                ? 'Último dia para votar!' 
                : `${daysRemaining} dias restantes para votação`
              }
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={16} />
            <span>{period?.participantCount || 0} participantes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Vote" size={16} />
            <span>{period?.totalVotes || 0} votos</span>
          </div>
        </div>

        <Button
          variant={period?.status === 'active' ? 'default' : 'outline'}
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => onViewProposals(period)}
          disabled={period?.status === 'upcoming'}
        >
          {period?.status === 'active' ? 'Votar Agora' : 'Ver Propostas'}
        </Button>
      </div>
    </div>
  );
};

export default VotingPeriodCard;