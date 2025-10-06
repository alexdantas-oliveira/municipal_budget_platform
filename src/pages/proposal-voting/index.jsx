import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import ProposalCard from './components/ProposalCard';

import VotingFilters from './components/VotingFilters';
import VotingPeriodStatus from './components/VotingPeriodStatus';
import ProposalComparison from './components/ProposalComparison';

const ProposalVoting = () => {
  // Mock user data - in real app would come from auth context
  const [user] = useState({
    id: 1,
    name: "Maria Silva Santos",
    email: "maria.santos@email.com",
    role: "citizen",
    cpf: "123.456.789-00"
  });

  // Mock voting period data
  const [votingPeriod] = useState({
    id: 1,
    title: "Orçamento Participativo 2024 - 2º Semestre",
    description: "Período de votação para propostas do segundo semestre de 2024. Participe e ajude a decidir como investir o orçamento municipal.",
    startDate: "2024-09-01T00:00:00",
    endDate: "2024-12-31T23:59:59",
    status: "active"
  });

  // Mock proposals data
  const [proposals] = useState([
    {
      id: 1,
      title: "Construção de Nova Unidade Básica de Saúde no Bairro Jardim das Flores",
      description: `Proposta para construção de uma nova Unidade Básica de Saúde (UBS) no Bairro Jardim das Flores, que atualmente não possui atendimento médico básico próximo.\n\nA nova unidade contará com consultórios médicos, sala de enfermagem, farmácia básica, sala de vacinas e área de espera climatizada. O projeto prevê atendimento para aproximadamente 5.000 moradores da região.\n\nA construção seguirá padrões de acessibilidade e sustentabilidade, com rampas de acesso, banheiros adaptados e sistema de captação de água da chuva.`,
      category: "Saúde",
      budget: 850000,
      location: "Jardim das Flores, CEP 12345-678",
      timeline: {
        start: "2025-02-01",
        end: "2025-08-30"
      },
      beneficiaries: 5000,
      submitter: {
        name: "João Carlos Oliveira",
        type: "citizen",
        id: "123.456.789-00"
      },
      submittedAt: "2024-08-15T10:30:00",
      votes: {
        favor: 342,
        against: 28
      },
      documents: [
        {
          name: "Projeto Arquitetônico.pdf",
          url: "#"
        },
        {
          name: "Estudo de Viabilidade.pdf",
          url: "#"
        }
      ]
    },
    {
      id: 2,
      title: "Reforma e Ampliação da Escola Municipal Professor Antônio Silva",
      description: `Reforma completa e ampliação da Escola Municipal Professor Antônio Silva, incluindo construção de 6 novas salas de aula, laboratório de informática, biblioteca e quadra poliesportiva coberta.\n\nA escola atualmente atende 480 alunos em condições precárias, com salas superlotadas e infraestrutura deficiente. A reforma contempla também a adequação de banheiros, instalação de ar-condicionado e modernização da cozinha escolar.\n\nO projeto beneficiará diretamente os estudantes e suas famílias, melhorando significativamente a qualidade do ensino oferecido.`,
      category: "Educação",
      budget: 1200000,
      location: "Centro, CEP 12300-100",
      timeline: {
        start: "2025-01-15",
        end: "2025-12-20"
      },
      beneficiaries: 480,
      submitter: {
        name: "Associação de Pais e Mestres",
        type: "entity",
        id: "12.345.678/0001-90"
      },
      submittedAt: "2024-08-20T14:15:00",
      votes: {
        favor: 289,
        against: 45
      },
      documents: [
        {
          name: "Planta da Reforma.pdf",
          url: "#"
        }
      ]
    },
    {
      id: 3,
      title: "Revitalização da Praça Central com Playground e Academia ao Ar Livre",
      description: `Projeto de revitalização completa da Praça Central, incluindo novo paisagismo, instalação de playground infantil, academia ao ar livre para terceira idade e pista de caminhada.\n\nA praça receberá nova iluminação LED, bancos ergonômicos, lixeiras seletivas e bebedouros. Será criada também uma área de eventos com palco pequeno para apresentações culturais da comunidade.\n\nO projeto visa criar um espaço de convivência familiar e promover atividades físicas e culturais para todas as idades.`,
      category: "Infraestrutura",
      budget: 320000,
      location: "Praça Central, Centro, CEP 12300-050",
      timeline: {
        start: "2025-03-01",
        end: "2025-06-30"
      },
      beneficiaries: 8000,
      submitter: {
        name: "Ana Paula Ferreira",
        type: "citizen",
        id: "987.654.321-00"
      },
      submittedAt: "2024-09-02T09:45:00",
      votes: {
        favor: 156,
        against: 12
      },
      documents: []
    },
    {
      id: 4,
      title: "Programa de Coleta Seletiva e Compostagem Comunitária",
      description: `Implementação de programa municipal de coleta seletiva porta a porta e criação de centro de compostagem comunitária no Bairro Verde.\n\nO programa incluirá distribuição de lixeiras seletivas para todas as residências, capacitação da população sobre separação de resíduos e criação de pontos de entrega voluntária.\n\nO centro de compostagem processará resíduos orgânicos da região, produzindo adubo para hortas comunitárias e distribuição gratuita para moradores.`,
      category: "Meio Ambiente",
      budget: 180000,
      location: "Bairro Verde, CEP 12350-200",
      timeline: {
        start: "2025-04-01",
        end: "2025-10-31"
      },
      beneficiaries: 3200,
      submitter: {
        name: "Instituto Ambiental Cidade Verde",
        type: "entity",
        id: "98.765.432/0001-10"
      },
      submittedAt: "2024-08-28T16:20:00",
      votes: {
        favor: 203,
        against: 31
      },
      documents: [
        {
          name: "Plano de Implementação.pdf",
          url: "#"
        },
        {
          name: "Estudo de Impacto Ambiental.pdf",
          url: "#"
        }
      ]
    },
    {
      id: 5,
      title: "Construção de Ciclovia na Avenida Principal",
      description: `Construção de ciclovia bidirecional de 3,2 km na Avenida Principal, conectando o centro da cidade ao Parque Municipal.\n\nO projeto inclui sinalização horizontal e vertical, pontos de apoio com bicicletários, bebedouros e pequenas áreas de descanso. A ciclovia terá separação física da pista de veículos por meio de canteiro central.\n\nA obra visa promover mobilidade urbana sustentável e incentivar o uso de bicicletas como meio de transporte alternativo.`,
      category: "Infraestrutura",
      budget: 450000,
      location: "Avenida Principal, Centro até Parque Municipal",
      timeline: {
        start: "2025-05-01",
        end: "2025-09-30"
      },
      beneficiaries: 12000,
      submitter: {
        name: "Carlos Eduardo Santos",
        type: "citizen",
        id: "456.789.123-00"
      },
      submittedAt: "2024-09-05T11:10:00",
      votes: {
        favor: 387,
        against: 89
      },
      documents: [
        {
          name: "Projeto Executivo.pdf",
          url: "#"
        }
      ]
    }
  ]);

  // State management
  const [userVotes, setUserVotes] = useState({
    1: 'favor',
    3: 'against'
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    budgetRange: '',
    location: '',
    sort: 'newest',
    voteStatus: '',
    submitterType: ''
  });
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // User voting statistics
  const userVotingStats = useMemo(() => {
    const votesCount = Object.keys(userVotes)?.length;
    const availableProposals = proposals?.length;
    return {
      votesCount,
      availableProposals,
      remainingVotes: availableProposals - votesCount
    };
  }, [userVotes, proposals]);

  // Filter and sort proposals
  const filteredProposals = useMemo(() => {
    let filtered = [...proposals];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(proposal =>
        proposal?.title?.toLowerCase()?.includes(searchTerm) ||
        proposal?.description?.toLowerCase()?.includes(searchTerm) ||
        proposal?.location?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Category filter
    if (filters?.category) {
      filtered = filtered?.filter(proposal => proposal?.category === filters?.category);
    }

    // Budget range filter
    if (filters?.budgetRange) {
      const [min, max] = filters?.budgetRange?.split('-')?.map(v => v === '+' ? Infinity : parseInt(v));
      filtered = filtered?.filter(proposal => {
        if (max === undefined) return proposal?.budget >= min;
        return proposal?.budget >= min && proposal?.budget <= max;
      });
    }

    // Location filter
    if (filters?.location) {
      const locationTerm = filters?.location?.toLowerCase();
      filtered = filtered?.filter(proposal =>
        proposal?.location?.toLowerCase()?.includes(locationTerm)
      );
    }

    // Vote status filter
    if (filters?.voteStatus) {
      switch (filters?.voteStatus) {
        case 'voted':
          filtered = filtered?.filter(proposal => userVotes?.[proposal?.id]);
          break;
        case 'not_voted':
          filtered = filtered?.filter(proposal => !userVotes?.[proposal?.id]);
          break;
        case 'voted_favor':
          filtered = filtered?.filter(proposal => userVotes?.[proposal?.id] === 'favor');
          break;
        case 'voted_against':
          filtered = filtered?.filter(proposal => userVotes?.[proposal?.id] === 'against');
          break;
      }
    }

    // Submitter type filter
    if (filters?.submitterType) {
      filtered = filtered?.filter(proposal => proposal?.submitter?.type === filters?.submitterType);
    }

    // Sort
    switch (filters?.sort) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        break;
      case 'oldest':
        filtered?.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
        break;
      case 'budget_high':
        filtered?.sort((a, b) => b?.budget - a?.budget);
        break;
      case 'budget_low':
        filtered?.sort((a, b) => a?.budget - b?.budget);
        break;
      case 'most_votes':
        filtered?.sort((a, b) => (b?.votes?.favor + b?.votes?.against) - (a?.votes?.favor + a?.votes?.against));
        break;
      case 'alphabetical':
        filtered?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
    }

    return filtered;
  }, [proposals, filters, userVotes]);

  // Handle voting
  const handleVote = (proposalId, voteType) => {
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: voteType
    }));
  };

  // Handle filters
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      budgetRange: '',
      location: '',
      sort: 'newest',
      voteStatus: '',
      submitterType: ''
    });
  };

  // Handle comparison
  const handleAddToComparison = (proposal) => {
    if (selectedForComparison?.length >= 3) return;
    if (selectedForComparison?.find(p => p?.id === proposal?.id)) return;
    
    setSelectedForComparison(prev => [...prev, proposal]);
  };

  const handleRemoveFromComparison = (proposalId) => {
    setSelectedForComparison(prev => prev?.filter(p => p?.id !== proposalId));
  };

  const handleClearComparison = () => {
    setSelectedForComparison([]);
  };

  // Check if voting period is active
  const isVotingActive = new Date() < new Date(votingPeriod.endDate);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true} 
        userRole={user?.role} 
        userName={user?.name}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbTrail userRole={user?.role} />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Votação de Propostas
              </h1>
              <p className="text-muted-foreground">
                Analise e vote nas propostas do orçamento participativo municipal
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/proposal-submission">
                <Button variant="outline" iconName="Plus">
                  Nova Proposta
                </Button>
              </Link>
              <Link to="/citizen-dashboard">
                <Button variant="default" iconName="LayoutDashboard">
                  Meu Painel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Voting Period Status */}
        <VotingPeriodStatus 
          votingPeriod={votingPeriod}
          userVotingStats={userVotingStats}
        />

        {/* Filters */}
        <VotingFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          proposalCount={filteredProposals?.length}
          isLoading={isLoading}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {filteredProposals?.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Propostas Disponíveis
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {userVotingStats?.votesCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Seus Votos
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {userVotingStats?.remainingVotes}
            </div>
            <div className="text-sm text-muted-foreground">
              Votos Restantes
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {selectedForComparison?.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Em Comparação
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-6 mb-20">
          {filteredProposals?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma proposta encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou limpar a busca para ver mais propostas.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            filteredProposals?.map((proposal) => (
              <div key={proposal?.id} className="relative">
                <ProposalCard
                  proposal={proposal}
                  onVote={handleVote}
                  userVote={userVotes?.[proposal?.id]}
                  isVotingEnabled={isVotingActive}
                />
                
                {/* Comparison Button */}
                <div className="absolute top-4 right-4">
                  {selectedForComparison?.find(p => p?.id === proposal?.id) ? (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="GitCompare"
                      onClick={() => handleRemoveFromComparison(proposal?.id)}
                    >
                      Comparando
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="GitCompare"
                      onClick={() => handleAddToComparison(proposal)}
                      disabled={selectedForComparison?.length >= 3}
                    >
                      Comparar
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      {/* Proposal Comparison */}
      <ProposalComparison
        selectedProposals={selectedForComparison}
        onRemoveFromComparison={handleRemoveFromComparison}
        onClearComparison={handleClearComparison}
        onVote={handleVote}
        userVotes={userVotes}
      />
    </div>
  );
};

export default ProposalVoting;