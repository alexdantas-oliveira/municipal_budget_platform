import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const ExecutionStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total em Execução',
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
  );
};

export default ExecutionStats;