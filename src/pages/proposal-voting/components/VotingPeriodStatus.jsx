import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const VotingPeriodStatus = ({ votingPeriod, userVotingStats }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endDate = new Date(votingPeriod.endDate);
      const timeDiff = endDate?.getTime() - now?.getTime();

      if (timeDiff <= 0) {
        setTimeRemaining('Período encerrado');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days} dias, ${hours}h ${minutes}min`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}min`);
      } else {
        setTimeRemaining(`${minutes} minutos`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [votingPeriod?.endDate]);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    const now = new Date();
    const endDate = new Date(votingPeriod.endDate);
    const timeDiff = endDate?.getTime() - now?.getTime();
    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (timeDiff <= 0) return 'bg-destructive/10 border-destructive/20';
    if (daysRemaining <= 3) return 'bg-warning/10 border-warning/20';
    return 'bg-success/10 border-success/20';
  };

  const getStatusIcon = () => {
    const now = new Date();
    const endDate = new Date(votingPeriod.endDate);
    const timeDiff = endDate?.getTime() - now?.getTime();
    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (timeDiff <= 0) return { name: 'XCircle', color: 'text-destructive' };
    if (daysRemaining <= 3) return { name: 'AlertTriangle', color: 'text-warning' };
    return { name: 'CheckCircle', color: 'text-success' };
  };

  const statusIcon = getStatusIcon();
  const isActive = new Date() < new Date(votingPeriod.endDate);

  return (
    <div className={`border rounded-lg p-6 shadow-soft mb-6 ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        {/* Status Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <Icon name={statusIcon?.name} size={24} className={statusIcon?.color} />
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                {votingPeriod?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isActive ? 'Período de votação ativo' : 'Período de votação encerrado'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Period Dates */}
            <div className="space-y-2">
              <h3 className="font-medium text-card-foreground flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>Período</span>
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Início: {formatDate(votingPeriod?.startDate)}</div>
                <div>Fim: {formatDate(votingPeriod?.endDate)}</div>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="space-y-2">
              <h3 className="font-medium text-card-foreground flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Tempo Restante</span>
              </h3>
              <div className={`text-sm font-medium ${
                timeRemaining === 'Período encerrado' ? 'text-destructive' :
                timeRemaining?.includes('dias') ? 'text-success' : 'text-warning'
              }`}>
                {timeRemaining}
              </div>
            </div>

            {/* User Stats */}
            <div className="space-y-2">
              <h3 className="font-medium text-card-foreground flex items-center space-x-2">
                <Icon name="User" size={16} />
                <span>Sua Participação</span>
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Votos realizados: {userVotingStats?.votesCount}</div>
                <div>Propostas disponíveis: {userVotingStats?.availableProposals}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="ml-6 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center mb-2">
            <div className="text-lg font-bold text-primary">
              {Math.round((userVotingStats?.votesCount / userVotingStats?.availableProposals) * 100)}%
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Participação
          </div>
        </div>
      </div>
      {/* Description */}
      {votingPeriod?.description && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-card-foreground">
            {votingPeriod?.description}
          </p>
        </div>
      )}
      {/* Voting Rules */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <h4 className="font-medium text-card-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} />
          <span>Regras de Votação</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <ul className="space-y-1">
            <li>• Cada cidadão pode votar uma vez por proposta</li>
            <li>• Votos não podem ser alterados após confirmação</li>
            <li>• Votação encerra automaticamente no prazo final</li>
          </ul>
          <ul className="space-y-1">
            <li>• Propostas precisam de maioria simples para aprovação</li>
            <li>• Resultados serão divulgados após o período</li>
            <li>• Implementação seguirá cronograma municipal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VotingPeriodStatus;