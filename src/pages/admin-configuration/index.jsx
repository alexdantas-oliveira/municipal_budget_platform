import React, { useState } from 'react';
import { useAuth } from '../../components/ui/RoleBasedNavigation';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserManagementTab from './components/UserManagementTab';
import SystemConfigTab from './components/SystemConfigTab';
import SecurityMonitoringTab from './components/SecurityMonitoringTab';
import RolePermissionsTab from './components/RolePermissionsTab';
import SystemLogsTab from './components/SystemLogsTab';

const AdminConfiguration = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'users',
      name: 'Usuários',
      icon: 'Users',
      description: 'Gerenciar contas e permissões de usuários'
    },
    {
      id: 'system',
      name: 'Sistema',
      icon: 'Settings',
      description: 'Configurações gerais da plataforma'
    },
    {
      id: 'security',
      name: 'Segurança',
      icon: 'Shield',
      description: 'Monitoramento e logs de segurança'
    },
    {
      id: 'permissions',
      name: 'Permissões',
      icon: 'Lock',
      description: 'Controle de acesso baseado em funções'
    },
    {
      id: 'logs',
      name: 'Auditoria',
      icon: 'FileText',
      description: 'Logs e histórico do sistema'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementTab />;
      case 'system':
        return <SystemConfigTab />;
      case 'security':
        return <SecurityMonitoringTab />;
      case 'permissions':
        return <RolePermissionsTab />;
      case 'logs':
        return <SystemLogsTab />;
      default:
        return <UserManagementTab />;
    }
  };

  const activeTabData = tabs?.find(tab => tab?.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true} 
        userRole={userRole} 
        userName={user?.name || 'Administrador'} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbTrail userRole={userRole} />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurações do Sistema</h1>
              <p className="text-muted-foreground">
                Gerencie usuários, configurações e monitore a segurança da plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:block">
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full justify-between"
            iconName="ChevronDown"
            iconPosition="right"
          >
            <div className="flex items-center gap-2">
              <Icon name={activeTabData?.icon} size={18} />
              {activeTabData?.name}
            </div>
          </Button>

          {isMobileMenuOpen && (
            <div className="mt-2 bg-card border border-border rounded-lg shadow-elevated">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => {
                    setActiveTab(tab?.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    activeTab === tab?.id
                      ? 'bg-primary/10 text-primary' :'hover:bg-muted/50 text-foreground'
                  } ${tab?.id !== tabs?.[tabs?.length - 1]?.id ? 'border-b border-border' : ''}`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <div>
                    <div className="font-medium">{tab?.name}</div>
                    <div className="text-sm text-muted-foreground">{tab?.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-lg p-6">
          {renderTabContent()}
        </div>

        {/* Emergency Actions */}
        <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
            Ações de Emergência
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Use estas ações apenas em situações críticas. Todas as ações são registradas nos logs de auditoria.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" size="sm" iconName="Power">
              Modo Manutenção
            </Button>
            <Button variant="outline" size="sm" iconName="Database">
              Backup Manual
            </Button>
            <Button variant="outline" size="sm" iconName="RotateCcw">
              Restaurar Sistema
            </Button>
            <Button variant="outline" size="sm" iconName="AlertCircle">
              Notificação Geral
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Sistema de Orçamento Participativo • Versão 1.0.0 • 
            Última atualização: 17/09/2024 • 
            © {new Date()?.getFullYear()} Prefeitura Municipal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguration;