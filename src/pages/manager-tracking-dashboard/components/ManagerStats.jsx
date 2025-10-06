import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, DollarSign, BarChart3 } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const ManagerStats = ({ stats, proposals }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value || 0);
  };

  const getTotalBudget = () => {
    return proposals?.reduce((total, proposal) => {
      return total + (proposal?.orcamento_aprovado || 0);
    }, 0) || 0;
  };

  const getAverageProgress = () => {
    if (!proposals?.length) return { fisica: 0, financeira: 0 };
    
    const totals = proposals?.reduce((acc, proposal) => {
      const execution = proposal?.execution_status?.[0];
      acc.fisica += execution?.percentual_fisico || 0;
      acc.financeira += execution?.percentual_financeiro || 0;
      return acc;
    }, { fisica: 0, financeira: 0 });

    return {
      fisica: totals?.fisica / proposals?.length,
      financeira: totals?.financeira / proposals?.length
    };
  };

  const statCards = [
    {
      label: 'Total de Propostas',
      value: stats?.total || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Em Andamento',
      value: stats?.em_andamento || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Concluídas',
      value: stats?.concluida || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Atrasadas',
      value: stats?.atrasada || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const totalBudget = getTotalBudget();
  const averageProgress = getAverageProgress();

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards?.map((stat, index) => {
          const Icon = stat?.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat?.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat?.value}</p>
                </div>
                <div className={`${stat?.bgColor} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat?.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Budget and Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Orçamento Total</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Valor Total Aprovado:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBudget)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Média por Proposta:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(proposals?.length > 0 ? totalBudget / proposals?.length : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Progresso Médio</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Execução Física:</span>
                <span className="font-medium text-gray-900">
                  {averageProgress?.fisica?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(averageProgress?.fisica, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Execução Financeira:</span>
                <span className="font-medium text-gray-900">
                  {averageProgress?.financeira?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min(averageProgress?.financeira, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Proposals by Category */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Propostas por Categoria</h3>
        <div className="space-y-3">
          {(() => {
            const categoryCounts = proposals?.reduce((acc, proposal) => {
              const category = proposal?.categoria || 'Sem Categoria';
              acc[category] = (acc?.[category] || 0) + 1;
              return acc;
            }, {});

            return Object.entries(categoryCounts || {})?.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((count / (proposals?.length || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 min-w-[2rem]">{count}</span>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default ManagerStats;