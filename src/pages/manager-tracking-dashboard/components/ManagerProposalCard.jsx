import React, { useState } from 'react';
import { Save, MapPin, Calendar, DollarSign, User, MessageSquare } from 'lucide-react';
import { cn } from '../../../utils/cn';

const ManagerProposalCard = ({ proposal, onUpdateExecutionStatus, saving, selected, onSelect }) => {
  const executionData = proposal?.execution_status?.[0];
  const [formData, setFormData] = useState({
    percentual_fisico: executionData?.percentual_fisico || 0,
    percentual_financeiro: executionData?.percentual_financeiro || 0,
    status_execucao: executionData?.status_execucao || 'em_andamento',
    comentarios_internos: executionData?.comentarios_internos || ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Check if there are changes
      const originalData = {
        percentual_fisico: executionData?.percentual_fisico || 0,
        percentual_financeiro: executionData?.percentual_financeiro || 0,
        status_execucao: executionData?.status_execucao || 'em_andamento',
        comentarios_internos: executionData?.comentarios_internos || ''
      };

      const hasDataChanges = Object.keys(newData)?.some(key => 
        newData?.[key] !== originalData?.[key]
      );
      
      setHasChanges(hasDataChanges);
      return newData;
    });
  };

  const handleSave = () => {
    onUpdateExecutionStatus(proposal?.id, formData);
    setHasChanges(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })?.format(new Date(dateString));
  };

  const statusOptions = [
    { value: 'em_andamento', label: 'Em Andamento', color: 'text-blue-700 bg-blue-100' },
    { value: 'atrasada', label: 'Atrasada', color: 'text-red-700 bg-red-100' },
    { value: 'concluida', label: 'Concluída', color: 'text-green-700 bg-green-100' }
  ];

  const currentStatus = statusOptions?.find(s => s?.value === formData?.status_execucao);

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border transition-all",
      selected && "ring-2 ring-blue-500 border-blue-200"
    )}>
      <div className="p-6">
        {/* Header with Selection */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(e?.target?.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {proposal?.titulo}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {proposal?.localidade}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Aprovada em {formatDate(proposal?.approved_at)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {proposal?.created_by_profile?.nome || 'Nome não informado'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                Alterações não salvas
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                hasChanges && !saving
                  ? "bg-blue-600 text-white hover:bg-blue-700" :"bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Progresso'}
            </button>
          </div>
        </div>

        {/* Budget Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Orçamento Aprovado
            </span>
            <span className="font-semibold text-lg text-gray-900">
              {formatCurrency(proposal?.orcamento_aprovado)}
            </span>
          </div>
          {proposal?.categoria && (
            <div className="mt-2">
              <span className="inline-block text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {proposal?.categoria}
              </span>
            </div>
          )}
        </div>

        {/* Execution Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Physical Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentual Físico (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData?.percentual_fisico}
              onChange={(e) => handleInputChange('percentual_fisico', parseFloat(e?.target?.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(formData?.percentual_fisico || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Financial Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentual Financeiro (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData?.percentual_financeiro}
              onChange={(e) => handleInputChange('percentual_financeiro', parseFloat(e?.target?.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(formData?.percentual_financeiro || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status de Execução
            </label>
            <select
              value={formData?.status_execucao}
              onChange={(e) => handleInputChange('status_execucao', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                currentStatus?.color
              )}>
                {currentStatus?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            Comentários Internos
          </label>
          <textarea
            rows={3}
            value={formData?.comentarios_internos}
            onChange={(e) => handleInputChange('comentarios_internos', e?.target?.value)}
            placeholder="Adicione comentários sobre o progresso da execução..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Last Update Info */}
        {executionData?.atualizado_em && (
          <div className="text-xs text-gray-500 border-t pt-3">
            Última atualização: {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })?.format(new Date(executionData.atualizado_em))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerProposalCard;