import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SecurityMonitoringTab = () => {
  const [timeFilter, setTimeFilter] = useState('24h');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock security data
  const securityEvents = [
    {
      id: 1,
      type: 'login_success',
      user: 'maria.silva@email.com',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '17/09/2024 14:30:15',
      location: 'São Paulo, SP',
      severity: 'info'
    },
    {
      id: 2,
      type: 'login_failed',
      user: 'admin@test.com',
      ip: '203.45.67.89',
      userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
      timestamp: '17/09/2024 14:25:42',
      location: 'Rio de Janeiro, RJ',
      severity: 'warning',
      attempts: 3
    },
    {
      id: 3,
      type: 'suspicious_activity',
      user: 'carlos.admin@prefeitura.gov.br',
      ip: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: '17/09/2024 13:45:20',
      location: 'Brasília, DF',
      severity: 'high',
      details: 'Múltiplas tentativas de acesso a recursos restritos'
    },
    {
      id: 4,
      type: 'password_change',
      user: 'ana.costa@prefeitura.gov.br',
      ip: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '17/09/2024 12:15:30',
      location: 'São Paulo, SP',
      severity: 'info'
    },
    {
      id: 5,
      type: 'data_export',
      user: 'carlos.admin@prefeitura.gov.br',
      ip: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '17/09/2024 11:30:45',
      location: 'Brasília, DF',
      severity: 'medium',
      details: 'Exportação de dados de usuários'
    }
  ];

  const activeSessions = [
    {
      id: 1,
      user: 'maria.silva@email.com',
      role: 'citizen',
      ip: '192.168.1.100',
      location: 'São Paulo, SP',
      device: 'Windows Desktop',
      loginTime: '17/09/2024 14:30',
      lastActivity: '17/09/2024 15:45',
      status: 'active'
    },
    {
      id: 2,
      user: 'carlos.admin@prefeitura.gov.br',
      role: 'admin',
      ip: '10.0.0.50',
      location: 'Brasília, DF',
      device: 'Windows Desktop',
      loginTime: '17/09/2024 08:00',
      lastActivity: '17/09/2024 15:50',
      status: 'active'
    },
    {
      id: 3,
      user: 'ana.costa@prefeitura.gov.br',
      role: 'manager',
      ip: '192.168.1.200',
      location: 'São Paulo, SP',
      device: 'Mobile Android',
      loginTime: '17/09/2024 09:15',
      lastActivity: '17/09/2024 15:30',
      status: 'idle'
    }
  ];

  const systemStatus = {
    encryption: {
      status: 'active',
      algorithm: 'AES-256',
      lastRotation: '15/09/2024'
    },
    authentication: {
      status: 'active',
      method: 'OAuth2 + JWT',
      tokenExpiry: '24h'
    },
    database: {
      status: 'secure',
      encryption: 'enabled',
      backupStatus: 'completed'
    },
    api: {
      status: 'protected',
      rateLimit: 'active',
      lastSecurityScan: '16/09/2024'
    }
  };

  const timeFilterOptions = [
    { value: '1h', label: 'Última hora' },
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' }
  ];

  const eventTypeOptions = [
    { value: 'all', label: 'Todos os eventos' },
    { value: 'login_success', label: 'Login bem-sucedido' },
    { value: 'login_failed', label: 'Falha no login' },
    { value: 'suspicious_activity', label: 'Atividade suspeita' },
    { value: 'password_change', label: 'Alteração de senha' },
    { value: 'data_export', label: 'Exportação de dados' }
  ];

  const filteredEvents = useMemo(() => {
    return securityEvents?.filter(event => {
      const matchesType = eventTypeFilter === 'all' || event?.type === eventTypeFilter;
      const matchesSearch = event?.user?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           event?.ip?.includes(searchTerm);
      return matchesType && matchesSearch;
    });
  }, [eventTypeFilter, searchTerm]);

  const getEventIcon = (type) => {
    const icons = {
      login_success: 'LogIn',
      login_failed: 'AlertTriangle',
      suspicious_activity: 'Shield',
      password_change: 'Key',
      data_export: 'Download'
    };
    return icons?.[type] || 'Activity';
  };

  const getEventLabel = (type) => {
    const labels = {
      login_success: 'Login Realizado',
      login_failed: 'Falha no Login',
      suspicious_activity: 'Atividade Suspeita',
      password_change: 'Senha Alterada',
      data_export: 'Dados Exportados'
    };
    return labels?.[type] || type;
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      info: { label: 'Info', className: 'bg-blue-100 text-blue-800' },
      warning: { label: 'Atenção', className: 'bg-warning text-warning-foreground' },
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-success text-success-foreground', icon: 'Circle' },
      secure: { label: 'Seguro', className: 'bg-success text-success-foreground', icon: 'Shield' },
      protected: { label: 'Protegido', className: 'bg-success text-success-foreground', icon: 'Lock' },
      idle: { label: 'Inativo', className: 'bg-warning text-warning-foreground', icon: 'Clock' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.className}`}>
        <Icon name={config?.icon} size={12} />
        {config?.label}
      </span>
    );
  };

  const handleTerminateSession = (sessionId) => {
    console.log('Terminating session:', sessionId);
    // Implementation would terminate the session
  };

  const handleBlockIP = (ip) => {
    console.log('Blocking IP:', ip);
    // Implementation would block the IP address
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monitoramento de Segurança</h3>
          <p className="text-sm text-muted-foreground">
            Monitore atividades, sessões ativas e status de segurança do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" iconName="Download" size="sm">
            Exportar Logs
          </Button>
          <Button variant="outline" iconName="RefreshCw" size="sm">
            Atualizar
          </Button>
        </div>
      </div>
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Shield" size={20} className="text-success" />
            {getStatusBadge(systemStatus?.encryption?.status)}
          </div>
          <h4 className="font-medium text-foreground">Criptografia</h4>
          <p className="text-sm text-muted-foreground">{systemStatus?.encryption?.algorithm}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Última rotação: {systemStatus?.encryption?.lastRotation}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Key" size={20} className="text-success" />
            {getStatusBadge(systemStatus?.authentication?.status)}
          </div>
          <h4 className="font-medium text-foreground">Autenticação</h4>
          <p className="text-sm text-muted-foreground">{systemStatus?.authentication?.method}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Expiração: {systemStatus?.authentication?.tokenExpiry}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Database" size={20} className="text-success" />
            {getStatusBadge(systemStatus?.database?.status)}
          </div>
          <h4 className="font-medium text-foreground">Banco de Dados</h4>
          <p className="text-sm text-muted-foreground">Criptografia ativa</p>
          <p className="text-xs text-muted-foreground mt-1">
            Backup: {systemStatus?.database?.backupStatus}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Globe" size={20} className="text-success" />
            {getStatusBadge(systemStatus?.api?.status)}
          </div>
          <h4 className="font-medium text-foreground">API</h4>
          <p className="text-sm text-muted-foreground">Rate limiting ativo</p>
          <p className="text-xs text-muted-foreground mt-1">
            Último scan: {systemStatus?.api?.lastSecurityScan}
          </p>
        </div>
      </div>
      {/* Security Events */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Eventos de Segurança
        </h4>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            type="search"
            placeholder="Buscar por usuário ou IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
          <Select
            placeholder="Filtrar por período"
            options={timeFilterOptions}
            value={timeFilter}
            onChange={setTimeFilter}
          />
          <Select
            placeholder="Filtrar por tipo"
            options={eventTypeOptions}
            value={eventTypeFilter}
            onChange={setEventTypeFilter}
          />
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {filteredEvents?.map((event) => (
            <div key={event?.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    <Icon name={getEventIcon(event?.type)} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">
                        {getEventLabel(event?.type)}
                      </span>
                      {getSeverityBadge(event?.severity)}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Usuário: {event?.user}</div>
                      <div>IP: {event?.ip} • {event?.location}</div>
                      <div>Horário: {event?.timestamp}</div>
                      {event?.details && <div>Detalhes: {event?.details}</div>}
                      {event?.attempts && <div>Tentativas: {event?.attempts}</div>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" iconName="Eye" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    iconName="Ban"
                    onClick={() => handleBlockIP(event?.ip)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} />
          Sessões Ativas
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Usuário</th>
                <th className="text-left p-4 font-medium text-foreground">Localização</th>
                <th className="text-left p-4 font-medium text-foreground">Dispositivo</th>
                <th className="text-left p-4 font-medium text-foreground">Login</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-center p-4 font-medium text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions?.map((session) => (
                <tr key={session?.id} className="border-t border-border">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{session?.user}</div>
                      <div className="text-sm text-muted-foreground capitalize">{session?.role}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm text-foreground">{session?.location}</div>
                      <div className="text-xs text-muted-foreground font-mono">{session?.ip}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{session?.device}</div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm text-foreground">{session?.loginTime}</div>
                      <div className="text-xs text-muted-foreground">
                        Última atividade: {session?.lastActivity}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(session?.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" iconName="Eye" />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="LogOut"
                        onClick={() => handleTerminateSession(session?.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoringTab;