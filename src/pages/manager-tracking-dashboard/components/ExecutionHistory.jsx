import React from 'react';
import { Clock, MessageSquare, TrendingUp } from 'lucide-react';

const ExecutionHistory = ({ proposals }) => {
  // Get all execution updates with proposal info
  const getExecutionHistory = () => {
    const history = [];
    
    proposals?.forEach(proposal => {
      const execution = proposal?.execution_status?.[0];
      if (execution) {
        history?.push({
          id: execution?.id,
          proposalTitle: proposal?.titulo,
          proposalId: proposal?.id,
          percentualFisico: execution?.percentual_fisico,
          percentualFinanceiro: execution?.percentual_financeiro,
          statusExecucao: execution?.status_execucao,
          comentarios: execution?.comentarios_internos,
          atualizadoEm: execution?.atualizado_em,
          atualizadoPor: execution?.atualizado_por,
          localidade: proposal?.localidade,
          categoria: proposal?.categoria
        });
      }
    });

    // Sort by most recent updates
    return history?.sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm));
  };

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

  const getStatusInfo = (status) => {
    switch (status) {
      case 'concluida':
        return {
          label: 'Concluída',
          color: 'text-green-700',
          bgColor: 'bg-green-100'
        };
      case 'atrasada':
        return {
          label: 'Atrasada',
          color: 'text-red-700',
          bgColor: 'bg-red-100'
        };
      default:
        return {
          label: 'Em Andamento',
          color: 'text-blue-700',
          bgColor: 'bg-blue-100'
        };
    }
  };

  const history = getExecutionHistory();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-100 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Atualizações
        </h3>
      </div>
      {history?.length > 0 ? (
        <div className="space-y-4">
          {history?.map((item, index) => {
            const statusInfo = getStatusInfo(item?.statusExecucao);
            
            return (
              <div key={item?.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {item?.proposalTitle}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{item?.localidade}</span>
                      {item?.categoria && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {item?.categoria}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                      {statusInfo?.label}
                    </span>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item?.atualizadoEm)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Execução Física:</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {item?.percentualFisico?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(item?.percentualFisico || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Execução Financeira:</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {item?.percentualFinanceiro?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(item?.percentualFinanceiro || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {item?.comentarios && (
                  <div className="border-t pt-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Comentários:</span>
                        <p className="text-sm text-gray-600 mt-1">{item?.comentarios}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma atualização encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            O histórico de atualizações aparecerá aqui conforme as propostas forem atualizadas.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExecutionHistory;