import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProposalEvaluationCard = ({ 
  proposal, 
  isSelected, 
  onSelect, 
  onStatusUpdate, 
  onViewDetails,
  userRole 
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(proposal?.feedback || '');
  const [selectedStatus, setSelectedStatus] = useState(proposal?.status);

  const statusOptions = [
    { value: 'pending', label: 'Pendente', color: 'bg-slate-100 text-slate-800' },
    { value: 'under_review', label: 'Em Análise', color: 'bg-blue-100 text-blue-800' },
    { value: 'approved', label: 'Aprovado', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
    { value: 'needs_revision', label: 'Necessita Revisão', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const feasibilityColors = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    if (newStatus === 'rejected' || newStatus === 'needs_revision') {
      setShowFeedback(true);
    } else {
      onStatusUpdate(proposal?.id, newStatus, feedback);
    }
  };

  const handleFeedbackSubmit = () => {
    onStatusUpdate(proposal?.id, selectedStatus, feedback);
    setShowFeedback(false);
  };

  const currentStatus = statusOptions?.find(s => s?.value === proposal?.status);

  return (
    <div className={`p-6 transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-border"
          />
        </div>

        {/* Proposal Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {proposal?.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors?.[proposal?.priority]}`}>
                  {proposal?.priority === 'high' ? 'Alta' : proposal?.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {proposal?.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="User" size={14} />
                  <span>{proposal?.submittedBy?.name}</span>
                  <span className="text-xs">
                    ({proposal?.submittedBy?.type === 'citizen' ? 'Cidadão' : 'Entidade'})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span>{proposal?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{formatDate(proposal?.submissionDate)}</span>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${currentStatus?.color}`}>
                {currentStatus?.label}
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewDetails(proposal)}
              >
                Detalhes
              </Button>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Orçamento</p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(proposal?.budget)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Categoria</p>
              <p className="text-sm font-semibold text-foreground">
                {proposal?.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Votos</p>
              <p className="text-sm font-semibold text-foreground flex items-center space-x-1">
                <Icon name="Heart" size={12} />
                <span>{proposal?.votes}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Analista</p>
              <p className="text-sm font-semibold text-foreground">
                {proposal?.assignedAnalyst || 'Não atribuído'}
              </p>
            </div>
          </div>

          {/* Technical Review Summary */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Avaliação Técnica</h4>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Viabilidade</p>
                <p className={`text-sm font-medium ${feasibilityColors?.[proposal?.technicalReview?.feasibility]}`}>
                  {proposal?.technicalReview?.feasibility === 'high' ? 'Alta' : 
                   proposal?.technicalReview?.feasibility === 'medium' ? 'Média' : 'Baixa'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Impacto</p>
                <p className={`text-sm font-medium ${feasibilityColors?.[proposal?.technicalReview?.impact]}`}>
                  {proposal?.technicalReview?.impact === 'high' ? 'Alto' : 
                   proposal?.technicalReview?.impact === 'medium' ? 'Médio' : 'Baixo'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Complexidade</p>
                <p className={`text-sm font-medium ${
                  proposal?.technicalReview?.complexity === 'low' ? 'text-green-600' :
                  proposal?.technicalReview?.complexity === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {proposal?.technicalReview?.complexity === 'high' ? 'Alta' : 
                   proposal?.technicalReview?.complexity === 'medium' ? 'Média' : 'Baixa'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Recursos</p>
                <p className={`text-sm font-medium ${proposal?.technicalReview?.resourcesAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {proposal?.technicalReview?.resourcesAvailable ? 'Disponíveis' : 'Indisponíveis'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Cronograma</p>
                <p className="text-sm font-medium text-foreground">
                  {proposal?.implementationTimeline?.estimated}
                </p>
              </div>
            </div>
          </div>

          {/* Departments and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Secretarias Envolvidas</h4>
              <div className="flex flex-wrap gap-1">
                {proposal?.municipalDepartments?.map((dept, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Fases de Implementação</h4>
              <div className="space-y-1">
                {proposal?.implementationTimeline?.phases?.slice(0, 2)?.map((phase, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{phase?.name}</span>
                    <span className="text-foreground font-medium">{phase?.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Display */}
          {proposal?.feedback && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
              <h4 className="text-sm font-medium text-foreground mb-1">Parecer Técnico</h4>
              <p className="text-sm text-muted-foreground">{proposal?.feedback}</p>
            </div>
          )}

          {/* Manager Controls */}
          {userRole === 'manager' && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-foreground">
                  Status:
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                  options={statusOptions}
                  className="min-w-[150px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageSquare"
                  iconPosition="left"
                  onClick={() => setShowFeedback(true)}
                >
                  Feedback
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Atribuir
                </Button>
              </div>
            </div>
          )}

          {/* Feedback Modal */}
          {showFeedback && (
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Adicionar Parecer Técnico
              </h4>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e?.target?.value)}
                placeholder="Digite seu parecer sobre a proposta..."
                className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {feedback?.length}/500 caracteres
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedback(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback?.trim()}
                  >
                    Salvar Parecer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalEvaluationCard;