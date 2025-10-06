import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ReviewAssignmentModal = ({ 
  isOpen, 
  onClose, 
  selectedProposals, 
  analysts, 
  onAssign 
}) => {
  const [selectedAnalyst, setSelectedAnalyst] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  if (!isOpen) return null;

  const analystOptions = analysts?.map(analyst => ({
    value: analyst?.id?.toString(),
    label: `${analyst?.name} (${analyst?.proposals} propostas)`
  }));

  const handleAssign = () => {
    if (selectedAnalyst && selectedProposals?.length > 0) {
      const proposalIds = selectedProposals?.map(p => p?.id);
      onAssign(proposalIds, parseInt(selectedAnalyst), assignmentNotes);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const totalBudget = selectedProposals?.reduce((sum, proposal) => sum + proposal?.budget, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-elevation max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Atribuir Análise Técnica
            </h2>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected Proposals Summary */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">
              Propostas Selecionadas ({selectedProposals?.length})
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {selectedProposals?.map((proposal) => (
                <div key={proposal?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {proposal?.title}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{proposal?.category}</span>
                      <span>{formatCurrency(proposal?.budget)}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    proposal?.priority === 'high' ? 'bg-red-100 text-red-800' :
                    proposal?.priority === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {proposal?.priority === 'high' ? 'Alta' : 
                     proposal?.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Orçamento total:</strong> {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>

          {/* Analyst Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Selecionar Analista *
            </label>
            <Select
              value={selectedAnalyst}
              onValueChange={setSelectedAnalyst}
              options={analystOptions}
              placeholder="Escolha um analista..."
              className="mb-3"
            />
            
            {/* Analyst workload info */}
            {selectedAnalyst && (
              <div className="p-3 bg-muted/30 rounded-lg">
                {(() => {
                  const analyst = analysts?.find(a => a?.id?.toString() === selectedAnalyst);
                  return analyst ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Carga atual:</span>
                      <span className="font-medium text-foreground">
                        {analyst?.proposals} propostas • {analyst?.avgTime} dias (tempo médio)
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Assignment Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Observações para o Analista
            </label>
            <textarea
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e?.target?.value)}
              placeholder="Adicione instruções específicas, prazos especiais ou outras observações relevantes..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              maxLength={300}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {assignmentNotes?.length}/300 caracteres
              </span>
            </div>
          </div>

          {/* Priority Guidelines */}
          <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <Icon name="Info" size={16} className="mr-2" />
              Diretrizes de Prioridade
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Alta prioridade:</strong> Análise em até 3 dias úteis</li>
              <li>• <strong>Média prioridade:</strong> Análise em até 5 dias úteis</li>
              <li>• <strong>Baixa prioridade:</strong> Análise em até 7 dias úteis</li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-6">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedAnalyst || selectedProposals?.length === 0}
            >
              Atribuir Propostas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAssignmentModal;