import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SystemLogsTab = () => {
  const [dateFilter, setDateFilter] = useState('today');
  const [actionFilter, setActionFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock system logs data
  const systemLogs = [
    {
      id: 1,
      timestamp: '17/09/2024 15:45:32',
      user: 'carlos.admin@prefeitura.gov.br',
      userType: 'admin',
      action: 'user_created',
      target: 'maria.silva@email.com',
      details: 'Criou nova conta de cidadão',
      ip: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'info'
    },
    {
      id: 2,
      timestamp: '17/09/2024 15:30:15',
      user: 'ana.costa@prefeitura.gov.br',
      userType: 'manager',
      action: 'proposal_approved',
      target: 'Proposta #1234',
      details: 'Aprovou proposta de reforma da praça central',
      ip: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'info'
    },
    {
      id: 3,
      timestamp: '17/09/2024 14:20:45',
      user: 'carlos.admin@prefeitura.gov.br',
      userType: 'admin',
      action: 'config_changed',
      target: 'Sistema',
      details: 'Alterou período de votação para 01/10/2024 - 31/10/2024',
      ip: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'medium'
    },
    {
      id: 4,
      timestamp: '17/09/2024 13:15:20',
      user: 'maria.silva@email.com',
      userType: 'citizen',
      action: 'proposal_submitted',
      target: 'Proposta #1235',
      details: 'Submeteu proposta para melhoria do transporte público',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      severity: 'info'
    },
    {
      id: 5,
      timestamp: '17/09/2024 12:45:10',
      user: 'sistema',
      userType: 'system',
      action: 'backup_completed',
      target: 'Banco de dados',
      details: 'Backup automático concluído com sucesso',
      ip: 'localhost',
      userAgent: 'System Process',
      severity: 'info'
    },
    {
      id: 6,
      timestamp: '17/09/2024 11:30:55',
      user: 'carlos.admin@prefeitura.gov.br',
      userType: 'admin',
      action: 'user_deactivated',
      target: 'usuario.suspeito@email.com',
      details: 'Desativou conta por atividade suspeita',
      ip: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'high'
    },
    {
      id: 7,
      timestamp: '17/09/2024 10:15:30',
      user: 'ana.costa@prefeitura.gov.br',
      userType: 'manager',
      action: 'data_exported',
      target: 'Relatório de propostas',
      details: 'Exportou dados de propostas do período 01/09 - 15/09',
      ip: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'medium'
    },
    {
      id: 8,
      timestamp: '17/09/2024 09:45:12',
      user: 'joao.entidade@empresa.com.br',
      userType: 'entity',
      action: 'proposal_submitted',
      target: 'Proposta #1236',
      details: 'Submeteu proposta institucional para revitalização urbana',
      ip: '203.45.67.89',
      userAgent: 'Mozilla/5.0 (Linux; Android 10)',
      severity: 'info'
    }
  ];

  const dateFilterOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const actionFilterOptions = [
    { value: 'all', label: 'Todas as ações' },
    { value: 'user_created', label: 'Usuário criado' },
    { value: 'user_deactivated', label: 'Usuário desativado' },
    { value: 'proposal_submitted', label: 'Proposta submetida' },
    { value: 'proposal_approved', label: 'Proposta aprovada' },
    { value: 'config_changed', label: 'Configuração alterada' },
    { value: 'data_exported', label: 'Dados exportados' },
    { value: 'backup_completed', label: 'Backup concluído' }
  ];

  const userTypeFilterOptions = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'citizen', label: 'Cidadão' },
    { value: 'entity', label: 'Entidade' },
    { value: 'manager', label: 'Gestor' },
    { value: 'admin', label: 'Administrador' },
    { value: 'system', label: 'Sistema' }
  ];

  const filteredLogs = useMemo(() => {
    return systemLogs?.filter(log => {
      const matchesAction = actionFilter === 'all' || log?.action === actionFilter;
      const matchesUserType = userTypeFilter === 'all' || log?.userType === userTypeFilter;
      const matchesSearch = log?.user?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           log?.details?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           log?.target?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      return matchesAction && matchesUserType && matchesSearch;
    });
  }, [actionFilter, userTypeFilter, searchTerm]);

  const getActionIcon = (action) => {
    const icons = {
      user_created: 'UserPlus',
      user_deactivated: 'UserX',
      proposal_submitted: 'FileText',
      proposal_approved: 'CheckCircle',
      config_changed: 'Settings',
      data_exported: 'Download',
      backup_completed: 'Database'
    };
    return icons?.[action] || 'Activity';
  };

  const getActionLabel = (action) => {
    const labels = {
      user_created: 'Usuário Criado',
      user_deactivated: 'Usuário Desativado',
      proposal_submitted: 'Proposta Submetida',
      proposal_approved: 'Proposta Aprovada',
      config_changed: 'Configuração Alterada',
      data_exported: 'Dados Exportados',
      backup_completed: 'Backup Concluído'
    };
    return labels?.[action] || action;
  };

  const getUserTypeLabel = (userType) => {
    const labels = {
      citizen: 'Cidadão',
      entity: 'Entidade',
      manager: 'Gestor',
      admin: 'Administrador',
      system: 'Sistema'
    };
    return labels?.[userType] || userType;
  };

  const getUserTypeBadge = (userType) => {
    const badgeConfig = {
      citizen: 'bg-blue-100 text-blue-800',
      entity: 'bg-green-100 text-green-800',
      manager: 'bg-orange-100 text-orange-800',
      admin: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800'
    };
    
    const className = badgeConfig?.[userType] || badgeConfig?.system;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {getUserTypeLabel(userType)}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      info: { label: 'Info', className: 'bg-blue-100 text-blue-800' },
      medium: { label: 'Médio', className: 'bg-orange-100 text-orange-800' },
      high: { label: 'Alto', className: 'bg-destructive text-destructive-foreground' }
    };
    
    const config = severityConfig?.[severity] || severityConfig?.info;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.className}`}>
        {config?.label}
      </span>
    );
  };

  const handleExportLogs = () => {
    console.log('Exporting logs:', filteredLogs);
    // Implementation would export logs
  };

  const handleClearLogs = () => {
    console.log('Clearing old logs');
    // Implementation would clear old logs
  };

  // Statistics
  const logStats = {
    total: systemLogs?.length,
    today: systemLogs?.filter(log => log?.timestamp?.includes('17/09/2024'))?.length,
    critical: systemLogs?.filter(log => log?.severity === 'high')?.length,
    users: new Set(systemLogs.map(log => log.user))?.size
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Logs do Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Auditoria completa de atividades e eventos do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" iconName="Download" size="sm" onClick={handleExportLogs}>
            Exportar
          </Button>
          <Button variant="outline" iconName="Trash2" size="sm" onClick={handleClearLogs}>
            Limpar Antigos
          </Button>
          <Button variant="outline" iconName="RefreshCw" size="sm">
            Atualizar
          </Button>
        </div>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">{logStats?.total}</div>
          <div className="text-sm text-muted-foreground">Total de Logs</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">{logStats?.today}</div>
          <div className="text-sm text-muted-foreground">Hoje</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">{logStats?.critical}</div>
          <div className="text-sm text-muted-foreground">Críticos</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">{logStats?.users}</div>
          <div className="text-sm text-muted-foreground">Usuários Ativos</div>
        </div>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <Input
          type="search"
          placeholder="Buscar em logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
        />
        <Select
          placeholder="Filtrar por período"
          options={dateFilterOptions}
          value={dateFilter}
          onChange={setDateFilter}
        />
        <Select
          placeholder="Filtrar por ação"
          options={actionFilterOptions}
          value={actionFilter}
          onChange={setActionFilter}
        />
        <Select
          placeholder="Filtrar por tipo de usuário"
          options={userTypeFilterOptions}
          value={userTypeFilter}
          onChange={setUserTypeFilter}
        />
      </div>
      {/* Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Horário</th>
                <th className="text-left p-4 font-medium text-foreground">Usuário</th>
                <th className="text-left p-4 font-medium text-foreground">Ação</th>
                <th className="text-left p-4 font-medium text-foreground">Alvo</th>
                <th className="text-left p-4 font-medium text-foreground">Detalhes</th>
                <th className="text-left p-4 font-medium text-foreground">Severidade</th>
                <th className="text-center p-4 font-medium text-foreground">IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs?.map((log) => (
                <tr key={log?.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4">
                    <div className="text-sm text-foreground font-mono">
                      {log?.timestamp}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm text-foreground">{log?.user}</div>
                      <div className="mt-1">
                        {getUserTypeBadge(log?.userType)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon name={getActionIcon(log?.action)} size={16} className="text-primary" />
                      <span className="text-sm text-foreground">
                        {getActionLabel(log?.action)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{log?.target}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {log?.details}
                    </div>
                  </td>
                  <td className="p-4">
                    {getSeverityBadge(log?.severity)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-xs text-muted-foreground font-mono">
                      {log?.ip}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Nenhum log encontrado</h4>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </div>
      {/* Log Details Modal would be implemented here */}
      {/* Real-time log streaming would be implemented here */}
    </div>
  );
};

export default SystemLogsTab;