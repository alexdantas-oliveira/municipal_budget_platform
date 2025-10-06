import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';

const SystemConfigTab = () => {
  const [config, setConfig] = useState({
    votingPeriodStart: '01/10/2024',
    votingPeriodEnd: '31/10/2024',
    proposalSubmissionStart: '01/09/2024',
    proposalSubmissionEnd: '30/09/2024',
    totalBudget: '5000000',
    minProposalValue: '10000',
    maxProposalValue: '500000',
    maxProposalsPerUser: '3',
    requireDocumentValidation: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    autoApproveEntities: false,
    requireManagerApproval: true
  });

  const [categories, setCategories] = useState([
    { id: 1, name: 'Infraestrutura', budget: 2000000, active: true },
    { id: 2, name: 'Educação', budget: 1500000, active: true },
    { id: 3, name: 'Saúde', budget: 1000000, active: true },
    { id: 4, name: 'Meio Ambiente', budget: 500000, active: true }
  ]);

  const [newCategory, setNewCategory] = useState({ name: '', budget: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfig = () => {
    console.log('Saving configuration:', config);
    // Implementation would save to backend
  };

  const handleAddCategory = () => {
    if (newCategory?.name && newCategory?.budget) {
      const category = {
        id: Date.now(),
        name: newCategory?.name,
        budget: parseInt(newCategory?.budget),
        active: true
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', budget: '' });
      setShowAddCategory(false);
    }
  };

  const handleToggleCategory = (categoryId) => {
    setCategories(categories?.map(cat => 
      cat?.id === categoryId ? { ...cat, active: !cat?.active } : cat
    ));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories?.filter(cat => cat?.id !== categoryId));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const totalCategoryBudget = categories?.reduce((sum, cat) => sum + cat?.budget, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Configurações do Sistema</h3>
          <p className="text-sm text-muted-foreground">
            Configure períodos, orçamentos e regras da plataforma
          </p>
        </div>
        <Button variant="default" iconName="Save" onClick={handleSaveConfig}>
          Salvar Configurações
        </Button>
      </div>
      {/* Voting Periods */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} />
          Períodos de Participação
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="font-medium text-foreground">Submissão de Propostas</h5>
            <Input
              label="Data de Início"
              type="date"
              value={config?.proposalSubmissionStart?.split('/')?.reverse()?.join('-')}
              onChange={(e) => handleConfigChange('proposalSubmissionStart', 
                e?.target?.value?.split('-')?.reverse()?.join('/'))}
            />
            <Input
              label="Data de Fim"
              type="date"
              value={config?.proposalSubmissionEnd?.split('/')?.reverse()?.join('-')}
              onChange={(e) => handleConfigChange('proposalSubmissionEnd', 
                e?.target?.value?.split('-')?.reverse()?.join('/'))}
            />
          </div>
          
          <div className="space-y-4">
            <h5 className="font-medium text-foreground">Período de Votação</h5>
            <Input
              label="Data de Início"
              type="date"
              value={config?.votingPeriodStart?.split('/')?.reverse()?.join('-')}
              onChange={(e) => handleConfigChange('votingPeriodStart', 
                e?.target?.value?.split('-')?.reverse()?.join('/'))}
            />
            <Input
              label="Data de Fim"
              type="date"
              value={config?.votingPeriodEnd?.split('/')?.reverse()?.join('-')}
              onChange={(e) => handleConfigChange('votingPeriodEnd', 
                e?.target?.value?.split('-')?.reverse()?.join('/'))}
            />
          </div>
        </div>
      </div>
      {/* Budget Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} />
          Configuração Orçamentária
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Orçamento Total (R$)"
            type="number"
            value={config?.totalBudget}
            onChange={(e) => handleConfigChange('totalBudget', e?.target?.value)}
            description={`Total: ${formatCurrency(parseInt(config?.totalBudget || 0))}`}
          />
          <Input
            label="Máximo de Propostas por Usuário"
            type="number"
            value={config?.maxProposalsPerUser}
            onChange={(e) => handleConfigChange('maxProposalsPerUser', e?.target?.value)}
          />
          <Input
            label="Valor Mínimo por Proposta (R$)"
            type="number"
            value={config?.minProposalValue}
            onChange={(e) => handleConfigChange('minProposalValue', e?.target?.value)}
            description={`Mínimo: ${formatCurrency(parseInt(config?.minProposalValue || 0))}`}
          />
          <Input
            label="Valor Máximo por Proposta (R$)"
            type="number"
            value={config?.maxProposalValue}
            onChange={(e) => handleConfigChange('maxProposalValue', e?.target?.value)}
            description={`Máximo: ${formatCurrency(parseInt(config?.maxProposalValue || 0))}`}
          />
        </div>
      </div>
      {/* Categories Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-foreground flex items-center gap-2">
            <Icon name="Tag" size={20} />
            Categorias de Propostas
          </h4>
          <Button 
            variant="outline" 
            iconName="Plus" 
            size="sm"
            onClick={() => setShowAddCategory(true)}
          >
            Nova Categoria
          </Button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome da Categoria"
                value={newCategory?.name}
                onChange={(e) => setNewCategory({...newCategory, name: e?.target?.value})}
                placeholder="Ex: Infraestrutura"
              />
              <Input
                label="Orçamento (R$)"
                type="number"
                value={newCategory?.budget}
                onChange={(e) => setNewCategory({...newCategory, budget: e?.target?.value})}
                placeholder="Ex: 1000000"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="default" size="sm" onClick={handleAddCategory}>
                Adicionar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddCategory(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-3">
          {categories?.map((category) => (
            <div key={category?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={category?.active}
                  onChange={() => handleToggleCategory(category?.id)}
                />
                <div>
                  <div className="font-medium text-foreground">{category?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Orçamento: {formatCurrency(category?.budget)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" iconName="Edit" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="Trash2"
                  onClick={() => handleDeleteCategory(category?.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
          <div className="text-sm text-foreground">
            <strong>Total Alocado:</strong> {formatCurrency(totalCategoryBudget)} de {formatCurrency(parseInt(config?.totalBudget || 0))}
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min((totalCategoryBudget / parseInt(config?.totalBudget || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
      {/* System Rules */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Regras do Sistema
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Validação obrigatória de documentos (CPF/CNPJ)"
            description="Requer validação via API da Receita Federal"
            checked={config?.requireDocumentValidation}
            onChange={(e) => handleConfigChange('requireDocumentValidation', e?.target?.checked)}
          />
          <Checkbox
            label="Aprovação automática de entidades"
            description="Entidades são aprovadas automaticamente após cadastro"
            checked={config?.autoApproveEntities}
            onChange={(e) => handleConfigChange('autoApproveEntities', e?.target?.checked)}
          />
          <Checkbox
            label="Aprovação obrigatória de gestores"
            description="Contas de gestor requerem aprovação manual"
            checked={config?.requireManagerApproval}
            onChange={(e) => handleConfigChange('requireManagerApproval', e?.target?.checked)}
          />
          <Checkbox
            label="Notificações por email"
            description="Enviar notificações por email aos usuários"
            checked={config?.enableEmailNotifications}
            onChange={(e) => handleConfigChange('enableEmailNotifications', e?.target?.checked)}
          />
          <Checkbox
            label="Notificações por SMS"
            description="Enviar notificações por SMS aos usuários"
            checked={config?.enableSMSNotifications}
            onChange={(e) => handleConfigChange('enableSMSNotifications', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemConfigTab;