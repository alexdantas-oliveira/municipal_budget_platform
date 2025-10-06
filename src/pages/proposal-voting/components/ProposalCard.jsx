import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import VotingModal from './VotingModal';

const ProposalCard = ({ proposal, onVote, userVote, isVotingEnabled }) => {
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const handleVoteClick = (voteType) => {
    if (!isVotingEnabled) return;
    setSelectedVote(voteType);
    setShowVotingModal(true);
  };

  const handleConfirmVote = () => {
    onVote(proposal?.id, selectedVote);
    setShowVotingModal(false);
    setSelectedVote(null);
  };

  const getVoteButtonVariant = (voteType) => {
    if (userVote === voteType) return 'default';
    if (userVote && userVote !== voteType) return 'outline';
    return voteType === 'favor' ? 'success' : 'destructive';
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-standard">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {proposal?.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{proposal?.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>Enviado em {formatDate(proposal?.submittedAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              proposal?.category === 'Saúde' ? 'bg-red-100 text-red-800' :
              proposal?.category === 'Educação' ? 'bg-blue-100 text-blue-800' :
              proposal?.category === 'Infraestrutura' ? 'bg-orange-100 text-orange-800' :
              proposal?.category === 'Meio Ambiente'? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {proposal?.category}
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {formatCurrency(proposal?.budget)}
              </div>
              <div className="text-xs text-muted-foreground">
                Orçamento solicitado
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-card-foreground leading-relaxed">
            {proposal?.description}
          </p>
        </div>

        {/* Implementation Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <h4 className="font-medium text-card-foreground flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span>Cronograma</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              Início: {formatDate(proposal?.timeline?.start)}<br />
              Conclusão: {formatDate(proposal?.timeline?.end)}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-card-foreground flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>Beneficiários</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              {proposal?.beneficiaries?.toLocaleString('pt-BR')} pessoas
            </p>
          </div>
        </div>

        {/* Submitter Info */}
        <div className="mb-4 p-3 bg-muted rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name={proposal?.submitter?.type === 'citizen' ? 'User' : 'Building2'} size={16} />
            <span className="text-sm font-medium text-muted-foreground">
              Proposta enviada por:
            </span>
            <span className="text-sm text-card-foreground">
              {proposal?.submitter?.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({proposal?.submitter?.type === 'citizen' ? 'Cidadão' : 'Entidade'})
            </span>
          </div>
        </div>

        {/* Supporting Documents */}
        {proposal?.documents && proposal?.documents?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-card-foreground mb-2 flex items-center space-x-2">
              <Icon name="FileText" size={16} />
              <span>Documentos de Apoio</span>
            </h4>
            <div className="space-y-1">
              {proposal?.documents?.map((doc, index) => (
                <a
                  key={index}
                  href={doc?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-smooth"
                >
                  <Icon name="Download" size={14} />
                  <span>{doc?.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Vote Counts */}
        <div className="mb-4 p-3 bg-accent rounded-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-success">
                {proposal?.votes?.favor}
              </div>
              <div className="text-xs text-muted-foreground">A Favor</div>
            </div>
            <div>
              <div className="text-lg font-bold text-destructive">
                {proposal?.votes?.against}
              </div>
              <div className="text-xs text-muted-foreground">Contra</div>
            </div>
            <div>
              <div className="text-lg font-bold text-card-foreground">
                {proposal?.votes?.favor + proposal?.votes?.against}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* Voting Buttons */}
        <div className="flex space-x-3">
          <Button
            variant={getVoteButtonVariant('favor')}
            size="default"
            iconName="ThumbsUp"
            iconPosition="left"
            onClick={() => handleVoteClick('favor')}
            disabled={!isVotingEnabled || (userVote && userVote !== 'favor')}
            className="flex-1"
          >
            {userVote === 'favor' ? 'Votou A Favor' : 'Votar A Favor'}
          </Button>
          <Button
            variant={getVoteButtonVariant('against')}
            size="default"
            iconName="ThumbsDown"
            iconPosition="left"
            onClick={() => handleVoteClick('against')}
            disabled={!isVotingEnabled || (userVote && userVote !== 'against')}
            className="flex-1"
          >
            {userVote === 'against' ? 'Votou Contra' : 'Votar Contra'}
          </Button>
        </div>

        {/* Vote Status */}
        {userVote && (
          <div className="mt-3 p-2 bg-primary/10 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-primary">
              <Icon name="CheckCircle" size={16} />
              <span>
                Você votou {userVote === 'favor' ? 'A FAVOR' : 'CONTRA'} desta proposta
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Voting Modal */}
      <VotingModal
        isOpen={showVotingModal}
        onClose={() => setShowVotingModal(false)}
        onConfirm={handleConfirmVote}
        proposal={proposal}
        voteType={selectedVote}
      />
    </>
  );
};

export default ProposalCard;