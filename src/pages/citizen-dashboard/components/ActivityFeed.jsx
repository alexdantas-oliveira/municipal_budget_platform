import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [] }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      'proposal_submitted': 'FileText',
      'vote_cast': 'Vote',
      'proposal_approved': 'CheckCircle',
      'proposal_rejected': 'XCircle',
      'execution_started': 'Play',
      'execution_completed': 'CheckCircle2',
      'comment_added': 'MessageCircle',
      'period_started': 'Calendar',
      'period_ended': 'CalendarX'
    };
    return icons?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colors = {
      'proposal_submitted': 'text-primary',
      'vote_cast': 'text-success',
      'proposal_approved': 'text-success',
      'proposal_rejected': 'text-destructive',
      'execution_started': 'text-warning',
      'execution_completed': 'text-success',
      'comment_added': 'text-primary',
      'period_started': 'text-primary',
      'period_ended': 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  if (activities?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Atividades Recentes
          </h2>
        </div>
        <div className="text-center py-8">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhuma atividade recente encontrada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Activity" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Atividades Recentes
        </h2>
      </div>
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground mb-1">
                {activity?.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>{formatDate(activity?.timestamp)}</span>
                {activity?.location && (
                  <>
                    <span>•</span>
                    <Icon name="MapPin" size={12} />
                    <span>{activity?.location}</span>
                  </>
                )}
              </div>
            </div>
            {activity?.status && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity?.status === 'success' ? 'bg-success/10 text-success' :
                activity?.status === 'warning' ? 'bg-warning/10 text-warning' :
                activity?.status === 'error'? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
              }`}>
                {activity?.status === 'success' ? 'Sucesso' :
                 activity?.status === 'warning' ? 'Atenção' :
                 activity?.status === 'error' ? 'Erro' : 'Pendente'}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
          Ver todas as atividades
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;