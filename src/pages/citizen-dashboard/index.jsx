import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import MetricsCard from './components/MetricsCard';
import ProposalCard from './components/ProposalCard';
import UserProposalCard from './components/UserProposalCard';
import VotingPeriodCard from './components/VotingPeriodCard';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../components/ui/RoleBasedNavigation';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user, userRole, isAuthenticated } = useAuth();

  // Use auth context data instead of mock data
  const currentUser = {
    name: user?.name || "Maria Silva Santos",
    email: user?.email || "maria.santos@email.com",
    cpf: user?.cpf || "123.456.789-00",
    role: userRole || "citizen",
    isAuthenticated: isAuthenticated
  };

  // Mock metrics data
  const mockMetrics = [
    {
      title: "Votos Realizados",
      value: "12",
      icon: "Vote",
      color: "primary",
      description: "Este período"
    },
    {
      title: "Propostas Enviadas",
      value: "3",
      icon: "FileText",
      color: "secondary",
      description: "Total"
    },
    {
      title: "Orçamento Participado",
      value: "R$ 450.000",
      icon: "DollarSign",
      color: "success",
      description: "Valor total votado"
    },
    {
      title: "Ranking",
      value: "#47",
      icon: "Trophy",
      color: "warning",
      description: "Entre participantes"
    }
  ];

  // Mock voting periods
  const mockVotingPeriods = [
    {
      id: 1,
      title: "Orçamento Participativo 2024 - 1º Semestre",
      description: "Período de votação para projetos do primeiro semestre de 2024",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      totalBudget: 2500000,
      proposalCount: 45,
      participantCount: 1250,
      totalVotes: 3420
    },
    {
      id: 2,
      title: "Projetos Especiais - Meio Ambiente",
      description: "Votação específica para projetos ambientais e sustentabilidade",
      status: "upcoming",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      totalBudget: 800000,
      proposalCount: 18,
      participantCount: 0,
      totalVotes: 0
    }
  ];

  // Mock current proposals for voting
  const mockCurrentProposals = [
    {
      id: 1,
      title: "Revitalização da Praça Central",
      description: "Projeto para reforma completa da praça central incluindo nova iluminação, paisagismo, playground infantil e academia ao ar livre para melhorar a qualidade de vida dos moradores.",
      budget: 150000,
      location: "Centro",
      category: "Infraestrutura",
      status: "voting",
      votes: 234,
      deadline: "2024-02-15",
      userVoted: false
    },
    {
      id: 2,
      title: "Programa de Capacitação Digital",
      description: "Implementação de cursos gratuitos de informática básica e digital para idosos e pessoas em situação de vulnerabilidade social.",
      budget: 85000,
      location: "Bairro São José",
      category: "Educação",
      status: "voting",
      votes: 189,
      deadline: "2024-02-15",
      userVoted: true
    },
    {
      id: 3,
      title: "Ciclovia da Avenida Principal",
      description: "Construção de ciclovia segura ao longo da avenida principal conectando os principais bairros da cidade.",
      budget: 320000,
      location: "Avenida Principal",
      category: "Mobilidade",
      status: "voting",
      votes: 412,
      deadline: "2024-02-15",
      userVoted: false
    }
  ];

  // Mock user proposals
  const mockUserProposals = [
    {
      id: 1,
      title: "Centro Comunitário do Bairro Esperança",
      description: "Construção de centro comunitário com biblioteca, sala de reuniões e espaço para atividades culturais.",
      budget: 200000,
      category: "Infraestrutura",
      status: "approved",
      createdAt: "2024-01-10",
      votes: 156,
      executionProgress: 25,
      feedback: "Proposta aprovada! Início da execução previsto para março de 2024."
    },
    {
      id: 2,
      title: "Horta Comunitária Sustentável",
      description: "Implementação de horta comunitária com técnicas de permacultura para produção de alimentos orgânicos.",
      budget: 45000,
      category: "Meio Ambiente",
      status: "under_review",
      createdAt: "2024-01-25",
      votes: 89,
      feedback: null
    },
    {
      id: 3,
      title: "Oficinas de Arte para Jovens",
      description: "Programa de oficinas de arte, música e teatro para jovens de 14 a 18 anos.",
      budget: 35000,
      category: "Cultura",
      status: "draft",
      createdAt: "2024-02-01",
      votes: 0,
      feedback: null
    }
  ];

  // Mock recent activities
  const mockActivities = [
    {
      type: "vote_cast",
      description: "Você votou a favor da proposta \'Revitalização da Praça Central'",
      timestamp: "2024-02-10T14:30:00",
      location: "Centro",
      status: "success"
    },
    {
      type: "proposal_submitted",
      description: "Sua proposta \'Horta Comunitária Sustentável\' foi enviada para análise",
      timestamp: "2024-01-25T09:15:00",
      status: "success"
    },
    {
      type: "proposal_approved",
      description: "Sua proposta 'Centro Comunitário do Bairro Esperança' foi aprovada",
      timestamp: "2024-01-20T16:45:00",
      status: "success"
    },
    {
      type: "period_started",
      description: "Novo período de votação iniciado: 'Orçamento Participativo 2024 - 1º Semestre'",
      timestamp: "2024-01-15T08:00:00",
      status: "success"
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVote = (proposalId, voteType) => {
    console.log(`Voting ${voteType} for proposal ${proposalId}`);
    // In real app, this would make API call to submit vote
    alert(`Voto registrado: ${voteType === 'favor' ? 'A favor' : 'Contra'} da proposta`);
  };

  const handleViewProposalDetails = (proposal) => {
    console.log('Viewing proposal details:', proposal);
    navigate('/proposal-voting', { state: { selectedProposal: proposal } });
  };

  const handleEditProposal = (proposal) => {
    console.log('Editing proposal:', proposal);
    navigate('/proposal-submission', { state: { editProposal: proposal } });
  };

  const handleViewProposals = (period) => {
    console.log('Viewing proposals for period:', period);
    navigate('/proposal-voting', { state: { selectedPeriod: period } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={currentUser?.isAuthenticated}
          userRole={currentUser?.role}
          userName={currentUser?.name}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Carregando painel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={currentUser?.isAuthenticated}
        userRole={currentUser?.role}
        userName={currentUser?.name}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbTrail userRole={currentUser?.role} />
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo, {currentUser?.name?.split(' ')?.[0]}!
              </h1>
              <p className="text-muted-foreground">
                Acompanhe suas atividades no orçamento participativo e participe das decisões da sua cidade.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
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
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Visão Geral', icon: 'LayoutDashboard' },
                { id: 'voting', label: 'Votação Ativa', icon: 'Vote' },
                { id: 'proposals', label: 'Minhas Propostas', icon: 'FileText' },
                { id: 'activity', label: 'Atividades', icon: 'Activity' }
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Voting Periods */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Períodos de Votação
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={() => setActiveTab('voting')}
                  >
                    Ver Todos
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockVotingPeriods?.slice(0, 2)?.map((period) => (
                    <VotingPeriodCard
                      key={period?.id}
                      period={period}
                      onViewProposals={handleViewProposals}
                    />
                  ))}
                </div>
              </div>

              {/* Featured Proposals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Propostas em Destaque
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    onClick={() => navigate('/proposal-voting')}
                  >
                    Ver Todas
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {mockCurrentProposals?.slice(0, 2)?.map((proposal) => (
                    <ProposalCard
                      key={proposal?.id}
                      proposal={proposal}
                      onVote={handleVote}
                      onViewDetails={handleViewProposalDetails}
                      userRole={currentUser?.role}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <QuickActions userRole={currentUser?.role} />
              <ActivityFeed activities={mockActivities?.slice(0, 4)} />
            </div>
          </div>
        )}

        {activeTab === 'voting' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Propostas Disponíveis para Votação
              </h2>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => navigate('/proposal-submission')}
              >
                Nova Proposta
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCurrentProposals?.map((proposal) => (
                <ProposalCard
                  key={proposal?.id}
                  proposal={proposal}
                  onVote={handleVote}
                  onViewDetails={handleViewProposalDetails}
                  userRole={currentUser?.role}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Minhas Propostas
              </h2>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => navigate('/proposal-submission')}
              >
                Nova Proposta
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockUserProposals?.map((proposal) => (
                <UserProposalCard
                  key={proposal?.id}
                  proposal={proposal}
                  onEdit={handleEditProposal}
                  onViewDetails={handleViewProposalDetails}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-4xl">
            <ActivityFeed activities={mockActivities} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;