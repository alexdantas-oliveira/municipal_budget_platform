import React from 'react';
import { MapPin, Calendar, Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from '../../../utils/cn';

const ProposalExecutionCard = ({ proposal, formatCurrency }) => {
  const executionData = proposal?.execution_status?.[0];
  const percentualFisico = executionData?.percentual_fisico || 0;
  const percentualFinanceiro = executionData?.percentual_financeiro || 0;
  const statusExecucao = executionData?.status_execucao || 'em_andamento';
  const ultimaAtualizacao = executionData?.atualizado_em;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'concluida':
        return {
          label: 'Concluída',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: CheckCircle
        };
      case 'atrasada':
        return {
          label: 'Atrasada',
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          icon: AlertTriangle
        };
      default:
        return {
          label: 'Em Andamento',
          color: 'text-blue-700',
          bgColor: 'bg-blue-100',
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusInfo(statusExecucao);
  const StatusIcon = statusInfo?.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(dateString));
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 mr-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {proposal?.titulo}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{proposal?.localidade}</span>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
            statusInfo?.bgColor,
            statusInfo?.color
          )}>
            <StatusIcon className="w-3 h-3" />
            {statusInfo?.label}
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>Orçamento Aprovado</span>
          </div>
          <span className="font-semibold text-gray-900">
            {formatCurrency(proposal?.orcamento_aprovado)}
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-4">
          {/* Physical Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Execução Física</span>
              <span className="text-sm font-semibold text-gray-900">
                {percentualFisico?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  getProgressColor(percentualFisico)
                )}
                style={{ width: `${Math.min(percentualFisico || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Financial Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Execução Financeira</span>
              <span className="text-sm font-semibold text-gray-900">
                {percentualFinanceiro?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  getProgressColor(percentualFinanceiro)
                )}
                style={{ width: `${Math.min(percentualFinanceiro || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category */}
        {proposal?.categoria && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {proposal?.categoria}
            </span>
          </div>
        )}

        {/* Last Update */}
        <div className="flex items-center text-xs text-gray-500 border-t pt-3">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Última atualização: {formatDate(ultimaAtualizacao)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProposalExecutionCard;