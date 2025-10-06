import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import { proposalTrackingService, setupProposalSubscription } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import Header from '../../components/ui/Header';
import ProposalExecutionCard from './components/ProposalExecutionCard';
import FilterControls from './components/FilterControls';
import ExecutionStats from './components/ExecutionStats';

const ProposalTrackingCitizenView = () => {
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    localidade: '',
    status_execucao: '',
    categoria: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [localities, setLocalities] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load proposals and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [proposalsData, localitiesData, categoriesData] = await Promise.all([
          proposalTrackingService?.getProposalsForCitizens(),
          proposalTrackingService?.getUniqueLocalities(),
          proposalTrackingService?.getUniqueCategories()
        ]);

        setProposals(proposalsData || []);
        setFilteredProposals(proposalsData || []);
        setLocalities(localitiesData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Real-time subscription for updates
  useEffect(() => {
    const channel = setupProposalSubscription((payload) => {
      console.log('Received real-time update:', payload);
      // Refresh data when execution status updates
      if (payload?.table === 'execution_status' || payload?.table === 'proposals') {
        // Reload proposals to get updated data
        proposalTrackingService?.getProposalsForCitizens()?.then(data => {
          setProposals(data || []);
        });
      }
    });

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = proposals;

    // Apply search
    if (searchTerm) {
      filtered = filtered?.filter(proposal =>
        proposal?.titulo?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        proposal?.localidade?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        proposal?.categoria?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.localidade) {
      filtered = filtered?.filter(proposal => proposal?.localidade === filters?.localidade);
    }

    if (filters?.status_execucao && filtered?.length > 0) {
      filtered = filtered?.filter(proposal =>
        proposal?.execution_status?.[0]?.status_execucao === filters?.status_execucao
      );
    }

    if (filters?.categoria) {
      filtered = filtered?.filter(proposal => proposal?.categoria === filters?.categoria);
    }

    setFilteredProposals(filtered);
  }, [proposals, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      localidade: '',
      status_execucao: '',
      categoria: ''
    });
    setSearchTerm('');
  };

  const getExecutionStats = () => {
    if (!filteredProposals?.length) return { total: 0, em_andamento: 0, atrasada: 0, concluida: 0 };

    return filteredProposals?.reduce((stats, proposal) => {
      stats.total++;
      const status = proposal?.execution_status?.[0]?.status_execucao || 'em_andamento';
      stats[status]++;
      return stats;
    }, { total: 0, em_andamento: 0, atrasada: 0, concluida: 0 });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value || 0);
  };

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

  const stats = getExecutionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Acompanhamento de Propostas
              </h1>
              <p className="mt-2 text-gray-600">
                Acompanhe a execução das propostas aprovadas no orçamento participativo
              </p>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Atualizado em tempo real</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <ExecutionStats stats={stats} />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título, localidade ou categoria..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700" :"bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <FilterControls
              filters={filters}
              localities={localities}
              categories={categories}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProposals?.length || 0} proposta(s) em execução
          </h2>
          {(searchTerm || Object.values(filters)?.some(f => f)) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Proposals Grid */}
        {filteredProposals?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProposals?.map((proposal) => (
              <ProposalExecutionCard
                key={proposal?.id}
                proposal={proposal}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma proposta encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.values(filters)?.some(f => f)
                ? "Tente ajustar os filtros para ver mais resultados"
                : "Não há propostas em execução no momento"}
            </p>
            {(searchTerm || Object.values(filters)?.some(f => f)) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProposalTrackingCitizenView;