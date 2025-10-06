import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RolePermissionsTab = () => {
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [permissions, setPermissions] = useState({
    citizen: {
      proposals: {
        create: true,
        view: true,
        edit: false,
        delete: false,
        vote: true
      },
      users: {
        viewProfile: true,
        editProfile: true,
        viewOthers: false,
        manage: false
      },
      system: {
        viewConfig: false,
        editConfig: false,
        viewLogs: false,
        manageUsers: false
      },
      reports: {
        view: true,
        export: false,
        create: false
      }
    },
    entity: {
      proposals: {
        create: true,
        view: true,
        edit: true,
        delete: false,
        vote: false
      },
      users: {
        viewProfile: true,
        editProfile: true,
        viewOthers: false,
        manage: false
      },
      system: {
        viewConfig: false,
        editConfig: false,
        viewLogs: false,
        manageUsers: false
      },
      reports: {
        view: true,
        export: true,
        create: false
      }
    },
    manager: {
      proposals: {
        create: false,
        view: true,
        edit: false,
        delete: false,
        vote: true
      },
      users: {
        viewProfile: true,
        editProfile: true,
        viewOthers: true,
        manage: true
      },
      system: {
        viewConfig: true,
        editConfig: false,
        viewLogs: true,
        manageUsers: true
      },
      reports: {
        view: true,
        export: true,
        create: true
      }
    },
    admin: {
      proposals: {
        create: false,
        view: true,
        edit: true,
        delete: true,
        vote: false
      },
      users: {
        viewProfile: true,
        editProfile: true,
        viewOthers: true,
        manage: true
      },
      system: {
        viewConfig: true,
        editConfig: true,
        viewLogs: true,
        manageUsers: true
      },
      reports: {
        view: true,
        export: true,
        create: true
      }
    }
  });

  const roles = [
    { 
      id: 'citizen', 
      name: 'Cidadão', 
      description: 'Usuários comuns que podem submeter propostas e votar',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'entity', 
      name: 'Entidade', 
      description: 'Organizações que podem submeter propostas institucionais',
      color: 'bg-green-100 text-green-800'
    },
    { 
      id: 'manager', 
      name: 'Gestor', 
      description: 'Responsáveis pela análise e aprovação de propostas',
      color: 'bg-orange-100 text-orange-800'
    },
    { 
      id: 'admin', 
      name: 'Administrador', 
      description: 'Acesso completo ao sistema e configurações',
      color: 'bg-red-100 text-red-800'
    }
  ];

  const permissionCategories = [
    {
      id: 'proposals',
      name: 'Propostas',
      icon: 'FileText',
      permissions: [
        { id: 'create', name: 'Criar propostas', description: 'Permite submeter novas propostas' },
        { id: 'view', name: 'Visualizar propostas', description: 'Permite ver propostas existentes' },
        { id: 'edit', name: 'Editar propostas', description: 'Permite modificar propostas' },
        { id: 'delete', name: 'Excluir propostas', description: 'Permite remover propostas' },
        { id: 'vote', name: 'Votar em propostas', description: 'Permite participar da votação' }
      ]
    },
    {
      id: 'users',
      name: 'Usuários',
      icon: 'Users',
      permissions: [
        { id: 'viewProfile', name: 'Ver próprio perfil', description: 'Acesso ao próprio perfil' },
        { id: 'editProfile', name: 'Editar próprio perfil', description: 'Modificar dados pessoais' },
        { id: 'viewOthers', name: 'Ver outros usuários', description: 'Visualizar perfis de outros usuários' },
        { id: 'manage', name: 'Gerenciar usuários', description: 'Criar, editar e desativar usuários' }
      ]
    },
    {
      id: 'system',
      name: 'Sistema',
      icon: 'Settings',
      permissions: [
        { id: 'viewConfig', name: 'Ver configurações', description: 'Visualizar configurações do sistema' },
        { id: 'editConfig', name: 'Editar configurações', description: 'Modificar configurações do sistema' },
        { id: 'viewLogs', name: 'Ver logs', description: 'Acessar logs de auditoria' },
        { id: 'manageUsers', name: 'Gerenciar contas', description: 'Ativar/desativar contas de usuário' }
      ]
    },
    {
      id: 'reports',
      name: 'Relatórios',
      icon: 'BarChart3',
      permissions: [
        { id: 'view', name: 'Visualizar relatórios', description: 'Acessar relatórios do sistema' },
        { id: 'export', name: 'Exportar dados', description: 'Baixar relatórios e dados' },
        { id: 'create', name: 'Criar relatórios', description: 'Gerar novos relatórios personalizados' }
      ]
    }
  ];

  const handlePermissionChange = (category, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev?.[selectedRole],
        [category]: {
          ...prev?.[selectedRole]?.[category],
          [permission]: value
        }
      }
    }));
  };

  const handleSavePermissions = () => {
    console.log('Saving permissions:', permissions);
    // Implementation would save permissions to backend
  };

  const getPermissionCount = (roleId) => {
    const rolePerms = permissions?.[roleId];
    let total = 0;
    let granted = 0;
    
    Object.values(rolePerms)?.forEach(category => {
      Object.values(category)?.forEach(perm => {
        total++;
        if (perm) granted++;
      });
    });
    
    return { granted, total };
  };

  const selectedRoleData = roles?.find(role => role?.id === selectedRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Controle de Acesso Baseado em Funções</h3>
          <p className="text-sm text-muted-foreground">
            Configure permissões específicas para cada tipo de usuário
          </p>
        </div>
        <Button variant="default" iconName="Save" onClick={handleSavePermissions}>
          Salvar Permissões
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Selection */}
        <div className="lg:col-span-1">
          <h4 className="font-medium text-foreground mb-4">Selecionar Função</h4>
          <div className="space-y-2">
            {roles?.map((role) => {
              const permCount = getPermissionCount(role?.id);
              return (
                <button
                  key={role?.id}
                  onClick={() => setSelectedRole(role?.id)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedRole === role?.id
                      ? 'border-primary bg-primary/10' :'border-border bg-card hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${role?.color}`}>
                      {role?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {permCount?.granted}/{permCount?.total}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{role?.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions Configuration */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedRoleData?.color}`}>
                {selectedRoleData?.name}
              </span>
              <div>
                <h4 className="font-medium text-foreground">Configurar Permissões</h4>
                <p className="text-sm text-muted-foreground">{selectedRoleData?.description}</p>
              </div>
            </div>

            <div className="space-y-8">
              {permissionCategories?.map((category) => (
                <div key={category?.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name={category?.icon} size={20} className="text-primary" />
                    <h5 className="font-medium text-foreground">{category?.name}</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category?.permissions?.map((permission) => (
                      <div key={permission?.id} className="p-4 bg-muted/30 rounded-lg">
                        <Checkbox
                          label={permission?.name}
                          description={permission?.description}
                          checked={permissions?.[selectedRole]?.[category?.id]?.[permission?.id]}
                          onChange={(e) => handlePermissionChange(
                            category?.id, 
                            permission?.id, 
                            e?.target?.checked
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Permission Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Resumo de Permissões por Função
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Função</th>
                <th className="text-center p-4 font-medium text-foreground">Propostas</th>
                <th className="text-center p-4 font-medium text-foreground">Usuários</th>
                <th className="text-center p-4 font-medium text-foreground">Sistema</th>
                <th className="text-center p-4 font-medium text-foreground">Relatórios</th>
                <th className="text-center p-4 font-medium text-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {roles?.map((role) => {
                const rolePerms = permissions?.[role?.id];
                const proposalsCount = Object.values(rolePerms?.proposals)?.filter(Boolean)?.length;
                const usersCount = Object.values(rolePerms?.users)?.filter(Boolean)?.length;
                const systemCount = Object.values(rolePerms?.system)?.filter(Boolean)?.length;
                const reportsCount = Object.values(rolePerms?.reports)?.filter(Boolean)?.length;
                const totalCount = proposalsCount + usersCount + systemCount + reportsCount;
                
                return (
                  <tr key={role?.id} className="border-t border-border">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${role?.color}`}>
                        {role?.name}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-foreground">
                        {proposalsCount}/{Object.keys(rolePerms?.proposals)?.length}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-foreground">
                        {usersCount}/{Object.keys(rolePerms?.users)?.length}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-foreground">
                        {systemCount}/{Object.keys(rolePerms?.system)?.length}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-foreground">
                        {reportsCount}/{Object.keys(rolePerms?.reports)?.length}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-medium text-foreground">
                        {totalCount}/17
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsTab;