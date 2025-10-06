import React, { useState } from 'react';
import { X, Save, Users } from 'lucide-react';

const BatchUpdateModal = ({ selectedCount, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    percentual_fisico: '',
    percentual_financeiro: '',
    status_execucao: '',
    comentarios_internos: ''
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Only include fields that have been filled
    const updateData = {};
    if (formData?.percentual_fisico !== '') {
      updateData.percentual_fisico = parseFloat(formData?.percentual_fisico) || 0;
    }
    if (formData?.percentual_financeiro !== '') {
      updateData.percentual_financeiro = parseFloat(formData?.percentual_financeiro) || 0;
    }
    if (formData?.status_execucao !== '') {
      updateData.status_execucao = formData?.status_execucao;
    }
    if (formData?.comentarios_internos !== '') {
      updateData.comentarios_internos = formData?.comentarios_internos;
    }

    if (Object.keys(updateData)?.length === 0) {
      alert('Por favor, preencha pelo menos um campo para atualizar.');
      return;
    }

    onUpdate(updateData);
  };

  const statusOptions = [
    { value: '', label: 'Manter atual' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'atrasada', label: 'Atrasada' },
    { value: 'concluida', label: 'Concluída' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Atualização em Lote
              </h2>
              <p className="text-sm text-gray-600">
                {selectedCount} proposta(s) selecionada(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Apenas os campos preenchidos serão atualizados. 
              Os campos vazios manterão os valores atuais de cada proposta.
            </p>
          </div>

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
              onChange={(e) => setFormData(prev => ({ ...prev, percentual_fisico: e?.target?.value }))}
              placeholder="Deixe vazio para manter atual"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              onChange={(e) => setFormData(prev => ({ ...prev, percentual_financeiro: e?.target?.value }))}
              placeholder="Deixe vazio para manter atual"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status de Execução
            </label>
            <select
              value={formData?.status_execucao}
              onChange={(e) => setFormData(prev => ({ ...prev, status_execucao: e?.target?.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentários Internos
            </label>
            <textarea
              rows={4}
              value={formData?.comentarios_internos}
              onChange={(e) => setFormData(prev => ({ ...prev, comentarios_internos: e?.target?.value }))}
              placeholder="Deixe vazio para manter comentários atuais"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Atualizar Propostas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchUpdateModal;