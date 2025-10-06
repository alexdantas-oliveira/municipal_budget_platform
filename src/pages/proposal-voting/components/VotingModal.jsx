import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VotingModal = ({ isOpen, onClose, onConfirm, proposal, voteType }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const voteTypeText = voteType === 'favor' ? 'A FAVOR' : 'CONTRA';
  const voteIcon = voteType === 'favor' ? 'ThumbsUp' : 'ThumbsDown';
  const voteColor = voteType === 'favor' ? 'text-success' : 'text-destructive';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">
              Confirmar Voto
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-md transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Vote Type Indicator */}
          <div className={`flex items-center justify-center space-x-3 p-4 rounded-lg ${
            voteType === 'favor' ? 'bg-success/10' : 'bg-destructive/10'
          }`}>
            <Icon name={voteIcon} size={24} className={voteColor} />
            <span className={`text-lg font-semibold ${voteColor}`}>
              VOTAR {voteTypeText}
            </span>
          </div>

          {/* Proposal Summary */}
          <div className="space-y-3">
            <h3 className="font-medium text-card-foreground">
              {proposal?.title}
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} />
                <span>{proposal?.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={14} />
                <span>{formatCurrency(proposal?.budget)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={14} />
                <span>{proposal?.beneficiaries?.toLocaleString('pt-BR')} beneficiários</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-warning">
                  Atenção: Voto Permanente
                </h4>
                <p className="text-sm text-card-foreground">
                  Após confirmar seu voto, não será possível alterá-lo. Certifique-se de sua decisão antes de prosseguir.
                </p>
                <p className="text-sm text-muted-foreground">
                  Prazo para votação: até 31/12/2024 às 23:59
                </p>
              </div>
            </div>
          </div>

          {/* Vote Impact */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-card-foreground mb-2">
              Impacto do seu voto:
            </h4>
            <p className="text-sm text-muted-foreground">
              {voteType === 'favor' 
                ? `Ao votar A FAVOR, você está apoiando a implementação desta proposta e a destinação de ${formatCurrency(proposal?.budget)} do orçamento municipal para este projeto.`
                : `Ao votar CONTRA, você está indicando que não concorda com a implementação desta proposta ou com a destinação de ${formatCurrency(proposal?.budget)} para este projeto.`
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant={voteType === 'favor' ? 'success' : 'destructive'}
              onClick={onConfirm}
              iconName={voteIcon}
              iconPosition="left"
              className="flex-1"
            >
              Confirmar Voto {voteTypeText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;