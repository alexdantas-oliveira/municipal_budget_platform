import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import MetricsCard from './components/MetricsCard';
import ProposalEvaluationCard from './components/ProposalEvaluationCard';
import FilterControls from './components/FilterControls';
import BatchActions from './components/BatchActions';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ReviewAssignmentModal from './components/ReviewAssignmentModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ManagerAnalysis = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('proposals');
  const [loading, setLoading] = useState(true);
  const [selectedProposals, setSelectedProposals] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    status: 'all',
    category: 'all',
    budgetRange: 'all',
    dateRange: 'all',
    assignedAnalyst: 'all'
  });

  // Mock manager data
  const mockManager = {
    name: "Dr. Carlos Roberto Silva",
    email: "carlos.silva@municipal.gov.br",
    role: "manager",
    department: "Secretaria de Planejamento",
    isAuthenticated: true
  };

  // Mock analysis metrics
  const mockMetrics = [
    {
      title: "Propostas Pendentes",
      value: "23",
      icon: "Clock",
      color: "warning",
      description: "Aguardando análise"
    },
    {
      title: "Aprovadas Este Mês",
      value: "45",
      icon: "CheckCircle",
      color: "success",
      description: "+12% vs mês anterior"
    },
    {
      title: "Orçamento Total",
      value: "R$ 2,8M",
      icon: "DollarSign",
      color: "primary",
      description: "Período atual"
    },
    {
      title: "Média de Análise",
      value: "4.2 dias",
      icon: "TrendingDown",
      color: "secondary",
      description: "Tempo médio"
    }
  ];

  // Mock proposals for evaluation
  const mockProposals = [
    {
      id: 1,
      title: "Revitalização da Praça Central",
      description: "Projeto para reforma completa da praça central incluindo nova iluminação, paisagismo, playground infantil e academia ao ar livre.",
      submittedBy: {
        name: "Maria Silva Santos",
        type: "citizen",
        cpf: "123.456.789-00",
        contact: "maria.santos@email.com"
      },
      budget: 150000,
      location: "Centro - Praça Central",
      category: "Infraestrutura",
      submissionDate: "2024-01-15",
      status: "under_review",
      priority: "high",
      votes: 234,
      assignedAnalyst: "Ana Paula Costa",
      technicalReview: {
        feasibility: "high",
        impact: "medium",
        complexity: "low",
        resourcesAvailable: true,
        environmentalImpact: "minimal"
      },
      municipalDepartments: ["Obras", "Meio Ambiente", "Planejamento"],
      implementationTimeline: {
        estimated: "6 meses",
        phases: [
          { name: "Projeto Executivo", duration: "2 meses" },
          { name: "Licitação", duration: "1 mês" },
          { name: "Execução", duration: "3 meses" }
        ]
      },
      feedback: null
    },
    {
      id: 2,
      title: "Programa de Capacitação Digital",
      description: "Implementação de cursos gratuitos de informática básica e digital para idosos e pessoas em situação de vulnerabilidade social.",
      submittedBy: {
        name: "Instituto Vida Digital",
        type: "entity",
        cnpj: "12.345.678/0001-90",
        contact: "contato@vidadigital.org"
      },
      budget: 85000,
      location: "Centro Comunitário - Bairro São José",
      category: "Educação",
      submissionDate: "2024-01-20",
      status: "pending",
      priority: "medium",
      votes: 189,
      assignedAnalyst: null,
      technicalReview: {
        feasibility: "high",
        impact: "high",
        complexity: "medium",
        resourcesAvailable: true,
        environmentalImpact: "none"
      },
      municipalDepartments: ["Educação", "Assistência Social"],
      implementationTimeline: {
        estimated: "4 meses",
        phases: [
          { name: "Contratação de Instrutores", duration: "1 mês" },
          { name: "Preparação do Espaço", duration: "1 mês" },
          { name: "Execução do Programa", duration: "2 meses" }
        ]
      },
      feedback: null
    },
    {
      id: 3,
      title: "Ciclovia da Avenida Principal",
      description: "Construção de ciclovia segura ao longo da avenida principal conectando os principais bairros da cidade.",
      submittedBy: {
        name: "Coletivo Pedala Cidade",
        type: "entity",
        cnpj: "23.456.789/0001-12",
        contact: "coletivo@pedalacidade.org"
      },
      budget: 320000,
      location: "Avenida Principal - Extensão 5km",
      category: "Mobilidade",
      submissionDate: "2024-01-25",
      status: "approved",
      priority: "high",
      votes: 412,
      assignedAnalyst: "Roberto Santos",
      technicalReview: {
        feasibility: "medium",
        impact: "high",
        complexity: "high",
        resourcesAvailable: false,
        environmentalImpact: "positive"
      },
      municipalDepartments: ["Mobilidade", "Obras", "Trânsito"],
      implementationTimeline: {
        estimated: "8 meses",
        phases: [
          { name: "Projeto Executivo", duration: "3 meses" },
          { name: "Licenciamento", duration: "2 meses" },
          { name: "Execução", duration: "3 meses" }
        ]
      },
      feedback: "Aprovado com recomendações para revisão do orçamento e cronograma."
    },
    {
      id: 4,
      title: "Centro de Reciclagem Comunitária",
      description: "Implantação de centro de reciclagem e educação ambiental no bairro Industrial com capacidade para processar 200 toneladas/mês.",
      submittedBy: {
        name: "João Carlos Oliveira",
        type: "citizen",
        cpf: "987.654.321-00",
        contact: "joao.oliveira@email.com"
      },
      budget: 225000,
      location: "Bairro Industrial - Terreno Municipal",
      category: "Meio Ambiente",
      submissionDate: "2024-02-01",
      status: "needs_revision",
      priority: "medium",
      votes: 167,
      assignedAnalyst: "Fernanda Lima",
      technicalReview: {
        feasibility: "medium",
        impact: "high",
        complexity: "high",
        resourcesAvailable: true,
        environmentalImpact: "very_positive"
      },
      municipalDepartments: ["Meio Ambiente", "Obras", "Limpeza Urbana"],
      implementationTimeline: {
        estimated: "10 meses",
        phases: [
          { name: "Estudos Ambientais", duration: "2 meses" },
          { name: "Projeto e Licenciamento", duration: "4 meses" },
          { name: "Construção", duration: "4 meses" }
        ]
      },
      feedback: "Necessário revisão do projeto executivo e estudo de impacto ambiental mais detalhado."
    },
    {
      id: 5,
      title: "Biblioteca Digital Móvel",
      description: "Aquisição e equipamento de veículo para biblioteca móvel que atenderá comunidades rurais e periféricas.",
      submittedBy: {
        name: "Biblioteca Pública Municipal",
        type: "entity",
        cnpj: "34.567.890/0001-23",
        contact: "biblioteca@municipal.gov.br"
      },
      budget: 125000,
      location: "Zona Rural e Periferia",
      category: "Cultura",
      submissionDate: "2024-02-05",
      status: "rejected",
      priority: "low",
      votes: 98,
      assignedAnalyst: "Patricia Mendes",
      technicalReview: {
        feasibility: "low",
        impact: "medium",
        complexity: "medium",
        resourcesAvailable: false,
        environmentalImpact: "minimal"
      },
      municipalDepartments: ["Cultura", "Educação"],
      implementationTimeline: {
        estimated: "6 meses",
        phases: [
          { name: "Licitação de Veículo", duration: "2 meses" },
          { name: "Adaptação e Equipamento", duration: "2 meses" },
          { name: "Implementação", duration: "2 meses" }
        ]
      },
      feedback: "Rejeitado devido à falta de recursos para manutenção operacional continuada e baixa viabilidade técnica."
    }
  ];

  // Mock analytics data
  const mockAnalytics = {
    proposalsByStatus: {
      pending: 23,
      under_review: 18,
      approved: 45,
      rejected: 12,
      needs_revision: 8
    },
    proposalsByCategory: {
      Infraestrutura: 28,
      Educação: 22,
      Mobilidade: 18,
      "Meio Ambiente": 15,
      Cultura: 12,
      Saúde: 9
    },
    budgetAnalysis: {
      totalRequested: 2800000,
      totalApproved: 1950000,
      averageBudget: 127000,
      budgetUtilization: 69.6
    },
    reviewMetrics: {
      avgReviewTime: 4.2,
      approvalRate: 67.8,
      revisionRate: 12.5,
      rejectionRate: 19.7
    }
  };

  // Mock team analysts
  const mockAnalysts = [
    { id: 1, name: "Ana Paula Costa", proposals: 12, avgTime: 3.8 },
    { id: 2, name: "Roberto Santos", proposals: 15, avgTime: 4.1 },
    { id: 3, name: "Fernanda Lima", proposals: 9, avgTime: 5.2 },
    { id: 4, name: "Patricia Mendes", proposals: 11, avgTime: 3.9 },
    { id: 5, name: "Carlos Eduardo", proposals: 8, avgTime: 4.6 }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter proposals based on current filters
  const filteredProposals = mockProposals?.filter(proposal => {
    if (currentFilters?.status !== 'all' && proposal?.status !== currentFilters?.status) return false;
    if (currentFilters?.category !== 'all' && proposal?.category !== currentFilters?.category) return false;
    if (currentFilters?.assignedAnalyst !== 'all') {
      if (currentFilters?.assignedAnalyst === 'unassigned' && proposal?.assignedAnalyst !== null) return false;
      if (currentFilters?.assignedAnalyst !== 'unassigned' && proposal?.assignedAnalyst !== currentFilters?.assignedAnalyst) return false;
    }
    return true;
  });

  const handleFilterChange = (newFilters) => {
    setCurrentFilters(newFilters);
  };

  const handleProposalSelect = (proposalId) => {
    setSelectedProposals(prev => {
      if (prev?.includes(proposalId)) {
        return prev?.filter(id => id !== proposalId);
      } else {
        return [...prev, proposalId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProposals?.length === filteredProposals?.length) {
      setSelectedProposals([]);
    } else {
      setSelectedProposals(filteredProposals?.map(p => p?.id));
    }
  };

  const handleStatusUpdate = (proposalId, newStatus, feedback) => {
    console.log('Updating proposal status:', { proposalId, newStatus, feedback });
    // In real app, this would make API call
  };

  const handleAssignAnalyst = (proposalIds, analystId) => {
    console.log('Assigning analyst:', { proposalIds, analystId });
    // In real app, this would make API call
    setShowAssignmentModal(false);
    setSelectedProposals([]);
  };

  const handleBatchAction = (action) => {
    if (action === 'assign') {
      setShowAssignmentModal(true);
    } else {
      console.log('Batch action:', action, selectedProposals);
      // In real app, this would handle batch operations
      setSelectedProposals([]);
    }
  };

  const handleExportReport = (type) => {
    console.log('Exporting report:', type);
    // In real app, this would generate and download report
  };

  const handleViewProposalDetails = (proposal) => {
    console.log('Viewing proposal details:', proposal);
    // Navigate to detailed view
    navigate('/proposal-voting', { state: { selectedProposal: proposal, managerView: true } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={mockManager?.isAuthenticated}
          userRole={mockManager?.role}
          userName={mockManager?.name}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Carregando análises...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={mockManager?.isAuthenticated}
        userRole={mockManager?.role}
        userName={mockManager?.name}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbTrail userRole={mockManager?.role} />
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Análise Gerencial
              </h1>
              <p className="text-muted-foreground">
                Avalie propostas, coordene análises da equipe e tome decisões sobre o orçamento participativo.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => handleExportReport('summary')}
              >
                Relatório
              </Button>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Calendar" size={16} />
                <span>
                  {new Date()?.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockMetrics?.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric?.title}
              value={metric?.value}
              icon={metric?.icon}
              color={metric?.color}
              description={metric?.description}
              trend="up"
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'proposals', label: 'Avaliação de Propostas', icon: 'FileText' },
                { id: 'analytics', label: 'Análises e Métricas', icon: 'BarChart3' },
                { id: 'team', label: 'Equipe de Análise', icon: 'Users' }
              ]?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {/* Filter Controls */}
            <FilterControls
              filters={currentFilters}
              onFilterChange={handleFilterChange}
              analysts={mockAnalysts}
            />

            {/* Batch Actions */}
            {selectedProposals?.length > 0 && (
              <BatchActions
                selectedCount={selectedProposals?.length}
                onBatchAction={handleBatchAction}
                onClearSelection={() => setSelectedProposals([])}
              />
            )}

            {/* Proposals List */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedProposals?.length === filteredProposals?.length && filteredProposals?.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground">
                        Selecionar todos ({filteredProposals?.length})
                      </span>
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedProposals?.length} selecionadas
                  </div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {filteredProposals?.map((proposal) => (
                  <ProposalEvaluationCard
                    key={proposal?.id}
                    proposal={proposal}
                    isSelected={selectedProposals?.includes(proposal?.id)}
                    onSelect={() => handleProposalSelect(proposal?.id)}
                    onStatusUpdate={handleStatusUpdate}
                    onViewDetails={handleViewProposalDetails}
                    userRole={mockManager?.role}
                  />
                ))}
              </div>
            </div>

            {filteredProposals?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma proposta encontrada
                </h3>
                <p className="text-muted-foreground">
                  Ajuste os filtros ou aguarde novas submissões de propostas.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analytics={mockAnalytics}
            onExportReport={handleExportReport}
          />
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockAnalysts?.map((analyst) => (
                <div key={analyst?.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {analyst?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Analista Técnico
                      </p>
                    </div>
                    <Icon name="User" size={40} className="text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {analyst?.proposals}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Propostas em análise
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {analyst?.avgTime} dias
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tempo médio
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {/* Assignment Modal */}
      {showAssignmentModal && (
        <ReviewAssignmentModal
          isOpen={showAssignmentModal}
          onClose={() => setShowAssignmentModal(false)}
          selectedProposals={selectedProposals?.map(id => mockProposals?.find(p => p?.id === id))}
          analysts={mockAnalysts}
          onAssign={handleAssignAnalyst}
        />
      )}
    </div>
  );
};

export default ManagerAnalysis;