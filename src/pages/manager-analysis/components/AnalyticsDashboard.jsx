import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AnalyticsDashboard = ({ analytics, onExportReport }) => {
  const COLORS = {
    pending: '#f59e0b',
    under_review: '#3b82f6',
    approved: '#10b981',
    rejected: '#ef4444',
    needs_revision: '#f97316'
  };

  const statusData = Object.entries(analytics?.proposalsByStatus || {})?.map(([key, value]) => ({
    name: key === 'pending' ? 'Pendente' :
          key === 'under_review' ? 'Em Análise' :
          key === 'approved' ? 'Aprovado' :
          key === 'rejected' ? 'Rejeitado' :
          'Necessita Revisão',
    value,
    color: COLORS?.[key]
  }));

  const categoryData = Object.entries(analytics?.proposalsByCategory || {})?.map(([key, value]) => ({
    name: key,
    proposals: value
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Orçamento Solicitado</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analytics?.budgetAnalysis?.totalRequested)}
              </p>
            </div>
            <Icon name="DollarSign" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Orçamento Aprovado</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(analytics?.budgetAnalysis?.totalApproved)}
              </p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa de Aprovação</p>
              <p className="text-2xl font-bold text-foreground">
                {formatPercentage(analytics?.reviewMetrics?.approvalRate)}
              </p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tempo Médio de Análise</p>
              <p className="text-2xl font-bold text-foreground">
                {analytics?.reviewMetrics?.avgReviewTime} dias
              </p>
            </div>
            <Icon name="Clock" size={24} className="text-warning" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Distribuição por Status
            </h3>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExportReport('status')}
            >
              Exportar
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Propostas']}
                labelStyle={{ color: '#374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {statusData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                ></div>
                <span className="text-sm text-muted-foreground">
                  {item?.name}: {item?.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Analysis */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Propostas por Categoria
            </h3>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExportReport('category')}
            >
              Exportar
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [value, 'Propostas']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="proposals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Métricas Detalhadas de Revisão
          </h3>
          <Button
            variant="default"
            iconName="FileText"
            iconPosition="left"
            onClick={() => onExportReport('detailed')}
          >
            Relatório Completo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatPercentage(analytics?.reviewMetrics?.approvalRate)}
            </p>
            <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatPercentage(analytics?.reviewMetrics?.revisionRate)}
            </p>
            <p className="text-sm text-muted-foreground">Taxa de Revisão</p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatPercentage(analytics?.reviewMetrics?.rejectionRate)}
            </p>
            <p className="text-sm text-muted-foreground">Taxa de Rejeição</p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatPercentage(analytics?.budgetAnalysis?.budgetUtilization)}
            </p>
            <p className="text-sm text-muted-foreground">Utilização do Orçamento</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="TrendingUp" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Insights da Análise</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orçamento médio por proposta: {formatCurrency(analytics?.budgetAnalysis?.averageBudget)}</li>
                <li>• {formatPercentage(analytics?.budgetAnalysis?.budgetUtilization)} do orçamento total foi alocado</li>
                <li>• Tempo médio de análise está dentro do target de 5 dias</li>
                <li>• Categoria com mais propostas: Infraestrutura ({categoryData?.[0]?.proposals} propostas)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;