import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock user data
  const users = [
    {
      id: 1,
      name: "Maria Silva Santos",
      email: "maria.silva@email.com",
      document: "123.456.789-01",
      documentType: "CPF",
      role: "citizen",
      status: "active",
      createdAt: "15/03/2024",
      lastLogin: "16/09/2024 14:30"
    },
    {
      id: 2,
      name: "João Oliveira Ltda",
      email: "contato@joaooliveira.com.br",
      document: "12.345.678/0001-90",
      documentType: "CNPJ",
      role: "entity",
      status: "pending",
      createdAt: "10/03/2024",
      lastLogin: "Never"
    },
    {
      id: 3,
      name: "Ana Costa Pereira",
      email: "ana.costa@prefeitura.gov.br",
      document: "987.654.321-09",
      documentType: "CPF",
      role: "manager",
      status: "active",
      createdAt: "01/02/2024",
      lastLogin: "17/09/2024 09:15"
    },
    {
      id: 4,
      name: "Carlos Eduardo Admin",
      email: "carlos.admin@prefeitura.gov.br",
      document: "456.789.123-45",
      documentType: "CPF",
      role: "admin",
      status: "active",
      createdAt: "15/01/2024",
      lastLogin: "17/09/2024 08:00"
    },
    {
      id: 5,
      name: "Empresa Municipal Ltda",
      email: "admin@empresamunicipal.com.br",
      document: "98.765.432/0001-10",
      documentType: "CNPJ",
      role: "entity",
      status: "inactive",
      createdAt: "20/02/2024",
      lastLogin: "10/08/2024 16:45"
    }
  ];

  const roleOptions = [
    { value: 'all', label: 'Todos os Perfis' },
    { value: 'citizen', label: 'Cidadão' },
    { value: 'entity', label: 'Entidade' },
    { value: 'manager', label: 'Gestor' },
    { value: 'admin', label: 'Administrador' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' }
  ];

  const filteredUsers = useMemo(() => {
    return users?.filter(user => {
      const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           user?.document?.includes(searchTerm);
      const matchesRole = filterRole === 'all' || user?.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user?.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, filterRole, filterStatus]);

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers?.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    // Implementation would handle bulk operations
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const handleUserAction = (userId, action) => {
    console.log(`User action: ${action} for user:`, userId);
    // Implementation would handle individual user actions
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      citizen: 'Cidadão',
      entity: 'Entidade',
      manager: 'Gestor',
      admin: 'Administrador'
    };
    return roleLabels?.[role] || role;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-success text-success-foreground' },
      inactive: { label: 'Inativo', className: 'bg-muted text-muted-foreground' },
      pending: { label: 'Pendente', className: 'bg-warning text-warning-foreground' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.className}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Gerenciamento de Usuários</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie contas de usuários, permissões e status de ativação
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" iconName="Download" size="sm">
            Exportar
          </Button>
          <Button variant="default" iconName="UserPlus" size="sm">
            Novo Usuário
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
        <Input
          type="search"
          placeholder="Buscar por nome, email ou documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
        />
        <Select
          placeholder="Filtrar por perfil"
          options={roleOptions}
          value={filterRole}
          onChange={setFilterRole}
        />
        <Select
          placeholder="Filtrar por status"
          options={statusOptions}
          value={filterStatus}
          onChange={setFilterStatus}
        />
      </div>
      {/* Bulk Actions */}
      {selectedUsers?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedUsers?.length} usuário(s) selecionado(s)
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('activate')}
            >
              Ativar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('deactivate')}
            >
              Desativar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('changeRole')}
            >
              Alterar Perfil
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedUsers([])}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 p-4">
                  <Checkbox
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">Usuário</th>
                <th className="text-left p-4 font-medium text-foreground">Documento</th>
                <th className="text-left p-4 font-medium text-foreground">Perfil</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Último Acesso</th>
                <th className="text-center p-4 font-medium text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={(e) => handleUserSelect(user?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{user?.name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Criado em {user?.createdAt}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm">
                      <div>{user?.document}</div>
                      <div className="text-xs text-muted-foreground">{user?.documentType}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-sm">
                      {getRoleLabel(user?.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {user?.lastLogin}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => handleUserAction(user?.id, 'edit')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => handleUserAction(user?.id, 'view')}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={user?.status === 'active' ? 'UserX' : 'UserCheck'}
                        onClick={() => handleUserAction(user?.id, user?.status === 'active' ? 'deactivate' : 'activate')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">Nenhum usuário encontrado</h4>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {users?.filter(u => u?.status === 'active')?.length}
          </div>
          <div className="text-sm text-muted-foreground">Usuários Ativos</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {users?.filter(u => u?.status === 'pending')?.length}
          </div>
          <div className="text-sm text-muted-foreground">Pendentes</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {users?.filter(u => u?.role === 'citizen')?.length}
          </div>
          <div className="text-sm text-muted-foreground">Cidadãos</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {users?.filter(u => u?.role === 'entity')?.length}
          </div>
          <div className="text-sm text-muted-foreground">Entidades</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTab;