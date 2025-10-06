import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProposalComparison = ({ 
  selectedProposals, 
  onRemoveFromComparison, 
  onClearComparison,
  onVote,
  userVotes 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (selectedProposals?.length === 0) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const totalBudget = selectedProposals?.reduce((sum, proposal) => sum + proposal?.budget, 0);
  const totalBeneficiaries = selectedProposals?.reduce((sum, proposal) => sum + proposal?.beneficiaries, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-40">
      {/* Collapsed Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="GitCompare" size={20} className="text-primary" />
            <div>
              <h3 className="font-semibold text-card-foreground">
                Comparando {selectedProposals?.length} propostas
              </h3>
              <p className="text-sm text-muted-foreground">
                Total: {formatCurrency(totalBudget)} • {totalBeneficiaries?.toLocaleString('pt-BR')} beneficiários
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName={isExpanded ? "ChevronDown" : "ChevronUp"}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              onClick={onClearComparison}
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border bg-background max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {selectedProposals?.map((proposal) => (
                <div key={proposal?.id} className="bg-card border border-border rounded-lg p-4 relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromComparison(proposal?.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-accent rounded-md transition-smooth"
                  >
                    <Icon name="X" size={16} />
                  </button>

                  {/* Proposal Header */}
                  <div className="mb-3">
                    <h4 className="font-medium text-card-foreground mb-1 pr-8">
                      {proposal?.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full ${
                        proposal?.category === 'Saúde' ? 'bg-red-100 text-red-800' :
                        proposal?.category === 'Educação' ? 'bg-blue-100 text-blue-800' :
                        proposal?.category === 'Infraestrutura' ? 'bg-orange-100 text-orange-800' :
                        proposal?.category === 'Meio Ambiente'? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {proposal?.category}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Orçamento:</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(proposal?.budget)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Beneficiários:</span>
                      <span className="font-medium">
                        {proposal?.beneficiaries?.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Localização:</span>
                      <span className="font-medium truncate ml-2">
                        {proposal?.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prazo:</span>
                      <span className="font-medium">
                        {formatDate(proposal?.timeline?.end)}
                      </span>
                    </div>
                  </div>

                  {/* Vote Counts */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="text-center p-2 bg-success/10 rounded">
                      <div className="font-bold text-success">{proposal?.votes?.favor}</div>
                      <div className="text-muted-foreground">A Favor</div>
                    </div>
                    <div className="text-center p-2 bg-destructive/10 rounded">
                      <div className="font-bold text-destructive">{proposal?.votes?.against}</div>
                      <div className="text-muted-foreground">Contra</div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  <div className="space-y-2">
                    {userVotes?.[proposal?.id] ? (
                      <div className="p-2 bg-primary/10 rounded-md text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-primary">
                          <Icon name="CheckCircle" size={16} />
                          <span>
                            Votou {userVotes?.[proposal?.id] === 'favor' ? 'A FAVOR' : 'CONTRA'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          iconName="ThumbsUp"
                          onClick={() => onVote(proposal?.id, 'favor')}
                          className="text-xs"
                        >
                          A Favor
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          iconName="ThumbsDown"
                          onClick={() => onVote(proposal?.id, 'against')}
                          className="text-xs"
                        >
                          Contra
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Summary */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">
                    {selectedProposals?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Propostas</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(totalBudget)}
                  </div>
                  <div className="text-sm text-muted-foreground">Orçamento Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">
                    {totalBeneficiaries?.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Beneficiários</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">
                    {Math.round(totalBudget / totalBeneficiaries)?.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-muted-foreground">R$ por Beneficiário</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalComparison;