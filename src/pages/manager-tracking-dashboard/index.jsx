import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { proposalTrackingService, setupProposalSubscription } from '../../lib/supabase';
import { useAuth } from '../../components/ui/RoleBasedNavigation';
import Header from '../../components/ui/Header';
import ManagerProposalCard from './components/ManagerProposalCard';
import BatchUpdateModal from './components/BatchUpdateModal';
import ExecutionHistory from './components/ExecutionHistory';
import ManagerStats from './components/ManagerStats';
import Icon from '../../components/AppIcon';


const ManagerTrackingDashboard = () => {
  const { userRole } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('propostas');
  const [selectedProposals, setSelectedProposals] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load proposals for managers
  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        const data = await proposalTrackingService?.getProposalsForManagers();
        setProposals(data || []);
        setFilteredProposals(data || []);
      } catch (error) {
        console.error('Error loading proposals for managers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'admin' || userRole === 'manager' || userRole === 'gestor') {
      loadProposals();
    }
  }, [userRole]);

  // Real-time subscription for updates
  useEffect(() => {
    const channel = setupProposalSubscription((payload) => {
      console.log('Manager received real-time update:', payload);
      // Refresh data when execution status updates
      if (payload?.table === 'execution_status' || payload?.table === 'proposals') {
        proposalTrackingService?.getProposalsForManagers()?.then(data => {
          setProposals(data || []);
        });
      }
    });

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  // Apply search filter
  useEffect(() => {
    let filtered = proposals;

    if (searchTerm) {
      filtered = filtered?.filter(proposal =>
        proposal?.titulo?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        proposal?.localidade?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        proposal?.categoria?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    setFilteredProposals(filtered);
  }, [proposals, searchTerm]);

  // Check if user has manager permissions
  const hasManagerPermissions = () => {
    return userRole === 'admin' || userRole === 'manager' || userRole === 'gestor';
  };

  const handleUpdateExecutionStatus = async (proposalId, executionData) => {
    if (!hasManagerPermissions()) {
      alert('Você não tem permissão para atualizar o status de execução.');
      return;
    }

    try {
      setSaving(prev => ({ ...prev, [proposalId]: true }));
      await proposalTrackingService?.updateExecutionStatus(proposalId, executionData);
      
      // Refresh proposals data
      const updatedData = await proposalTrackingService?.getProposalsForManagers();
      setProposals(updatedData || []);
      
      setSuccessMessage('Status de execução atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating execution status:', error);
      alert('Erro ao atualizar status de execução: ' + error?.message);
    } finally {
      setSaving(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const handleSelectProposal = (proposalId, selected) => {
    if (selected) {
      setSelectedProposals(prev => [...prev, proposalId]);
    } else {
      setSelectedProposals(prev => prev?.filter(id => id !== proposalId));
    }
  };

  const handleBatchUpdate = (batchData) => {
    selectedProposals?.forEach(proposalId => {
      handleUpdateExecutionStatus(proposalId, batchData);
    });
    setSelectedProposals([]);
    setShowBatchModal(false);
  };

  const tabs = [
    { id: 'propostas', label: 'Propostas em Execução', icon: FileText },
    { id: 'estatisticas', label: 'Estatísticas', icon: TrendingUp },
    { id: 'historico', label: 'Histórico', icon: Users }
  ];

  const getStats = () => {
    if (!filteredProposals?.length) return { total: 0, em_andamento: 0, atrasada: 0, concluida: 0 };

    return filteredProposals?.reduce((stats, proposal) => {
      stats.total++;
      const status = proposal?.execution_status?.[0]?.status_execucao || 'em_andamento';
      stats[status]++;
      return stats;
    }, { total: 0, em_andamento: 0, atrasada: 0, concluida: 0 });
  };

  if (!hasManagerPermissions()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Você não tem permissão para acessar esta página. Apenas gestores e administradores podem gerenciar a execução das propostas.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel de Gestão
              </h1>
              <p className="mt-2 text-gray-600">
                Gerencie e acompanhe a execução das propostas aprovadas
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedProposals?.length > 0 && (
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Atualizar Selecionadas ({selectedProposals?.length})
                </button>
              )}
              <button
                onClick={() => window.location?.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setSelectedTab(tab?.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {selectedTab === 'propostas' && (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar propostas..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                />
              </div>
            </div>

            {/* Proposals List */}
            <div className="space-y-6">
              {filteredProposals?.map((proposal) => (
                <ManagerProposalCard
                  key={proposal?.id}
                  proposal={proposal}
                  onUpdateExecutionStatus={handleUpdateExecutionStatus}
                  saving={saving?.[proposal?.id] || false}
                  selected={selectedProposals?.includes(proposal?.id)}
                  onSelect={(selected) => handleSelectProposal(proposal?.id, selected)}
                />
              ))}
              
              {filteredProposals?.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Nenhuma proposta encontrada
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Tente ajustar o termo de busca" :"Não há propostas para gerenciar no momento"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {selectedTab === 'estatisticas' && (
          <ManagerStats stats={stats} proposals={filteredProposals} />
        )}

        {selectedTab === 'historico' && (
          <ExecutionHistory proposals={filteredProposals} />
        )}
      </main>
      {/* Batch Update Modal */}
      {showBatchModal && (
        <BatchUpdateModal
          selectedCount={selectedProposals?.length}
          onUpdate={handleBatchUpdate}
          onClose={() => setShowBatchModal(false)}
        />
      )}
    </div>
  );
};

export default ManagerTrackingDashboard;