# Documentação Técnica - Plataforma de Orçamento Participativo Municipal

## 📋 Visão Geral do Sistema

### **Arquitetura Geral**
- **Framework**: React 18+ com JavaScript (JSX)
- **Build Tool**: Vite 5.0.0
- **Estilização**: Tailwind CSS 3.4.6 + shadcn/ui
- **Roteamento**: React Router DOM 6.0.2
- **Estado Global**: Redux Toolkit 2.6.1
- **Backend/Database**: Supabase (Auth + PostgreSQL + Real-time)
- **Autenticação**: Context API + localStorage
- **Localização**: Português Brasileiro com formatação brasileira
- **Arquitetura**: SPA (Single Page Application) com RBAC (Role-Based Access Control)

### **Sistema de Papéis (RBAC)**
1. **Cidadão** (`citizen`) - Pode votar, submeter propostas, acompanhar execução
2. **Entidade** (`entity`) - Pode submeter propostas, votar (CNPJ)
3. **Gestor** (`manager`) - Pode analisar propostas, atualizar execução, votação
4. **Administrador** (`admin`) - Acesso completo ao sistema, configurações

---

## 🏗️ Estrutura do Projeto

```
src/
├── components/                 # Componentes reutilizáveis
│   ├── ui/                    # UI Components (Button, Input, etc.)
│   │   ├── AdvancedAuthGuard.jsx      # Proteção avançada de rotas
│   │   ├── RoleBasedNavigation.jsx    # Sistema de navegação baseado em papel
│   │   ├── AuthenticationGuard.jsx    # Guard de autenticação
│   │   ├── SecurityDashboard.jsx      # Dashboard de segurança
│   │   └── ...                        # Outros componentes UI
│   ├── AppIcon.jsx            # Componente de ícones (Lucide React)
│   ├── AppImage.jsx           # Componente de imagens
│   ├── ErrorBoundary.jsx      # Captura de erros React
│   └── ScrollToTop.jsx        # Scroll automático para o topo
├── pages/                     # Páginas principais da aplicação
│   ├── login/                 # Sistema de Login
│   ├── user-registration/     # Cadastro de usuários
│   ├── citizen-dashboard/     # Dashboard do Cidadão/Entidade
│   ├── proposal-submission/   # Submissão de Propostas
│   ├── proposal-voting/       # Sistema de Votação
│   ├── manager-analysis/      # Análise Gerencial
│   ├── manager-tracking-dashboard/    # Painel de Acompanhamento (Gestor)
│   ├── proposal-tracking-citizen-view/ # Acompanhamento (Cidadão)
│   ├── admin-configuration/   # Configurações Administrativas
│   └── NotFound.jsx          # Página 404
├── lib/                      # Bibliotecas e serviços
│   └── supabase.js          # Cliente Supabase + serviços
├── styles/                   # Estilos globais
│   ├── index.css            # CSS personalizado
│   └── tailwind.css         # Configuração Tailwind
├── utils/                    # Utilitários
│   └── cn.js               # Utility para classes CSS
├── App.jsx                   # Componente raiz
├── Routes.jsx               # Configuração de rotas
└── index.jsx                # Entry point da aplicação
```

---

## 🔐 Sistema de Autenticação e Segurança

### **Fluxo de Autenticação**
1. **Login**: CPF (cidadão) ou CNPJ (entidade/gestor/admin)
2. **Validação**: Algoritmo de validação de documentos brasileiros
3. **Storage**: localStorage com timestamp para controle de sessão
4. **Proteção**: AdvancedAuthGuard com rate limiting e logs de atividade

### **Credenciais Mock para Desenvolvimento**
```javascript
{
  citizen: { document: '123.456.789-00', password: 'cidadao123' },
  entity: { document: '12.345.678/0001-90', password: 'entidade123' },
  manager: { document: '987.654.321-00', password: 'gestor123' },
  admin: { document: '111.222.333-44', password: 'admin123' }
}
```

### **Sistema de Proteção de Rotas**
- **AdvancedAuthGuard**: Proteção avançada com logs e rate limiting
- **Role-based Access**: Controle granular por papel
- **Rate Limiting**: Proteção contra abuso de recursos
- **Activity Logging**: Log de todas as ações dos usuários

---

## 📱 Telas e Funcionalidades Principais

### **1. Tela de Login (`/login`)**

**Componentes:**
- `LoginForm.jsx` - Formulário principal
- `TrustSignals.jsx` - Badges de segurança
- `MockCredentialsInfo.jsx` - Informações de teste

**Funcionalidades:**
- Seleção visual de tipo de usuário (4 botões)
- Formatação automática CPF/CNPJ conforme tipo
- Validação em tempo real de documentos
- Toggle de visibilidade de senha
- Remember me com localStorage
- Redirecionamento baseado em papel

**Fluxo de Navegação:**
- **Cidadão/Entidade** → `/citizen-dashboard`
- **Gestor** → `/manager-analysis`
- **Admin** → `/admin-configuration`

---

### **2. Cadastro de Usuários (`/user-registration`)**

**Componentes:**
- `RegistrationForm.jsx` - Formulário principal
- `UserTypeSelector.jsx` - Seleção de tipo
- `DocumentInput.jsx` - Input de CPF/CNPJ
- `PasswordStrengthIndicator.jsx` - Indicador de força da senha
- `SecurityBadges.jsx` - Badges de conformidade

**Funcionalidades:**
- Formulário adaptativo por tipo de usuário
- Validação de força de senha com score visual
- Formatação automática de documentos
- Verificação de e-mail único
- Indicadores LGPD e segurança

---

### **3. Dashboard do Cidadão (`/citizen-dashboard`)**

**Componentes:**
- `MetricsCard.jsx` - Cartões de métricas
- `VotingPeriodCard.jsx` - Períodos de votação
- `ProposalCard.jsx` - Cartões de propostas
- `UserProposalCard.jsx` - Propostas do usuário
- `ActivityFeed.jsx` - Feed de atividades
- `QuickActions.jsx` - Ações rápidas

**Funcionalidades:**
- **4 Abas principais**: Períodos, Propostas, Minhas Submissões, Atividades
- Dashboard com métricas de participação
- Feed de atividades em tempo real
- Contagem regressiva para períodos de votação
- Filtros e busca de propostas
- Histórico de participação

**Papéis com Acesso:** `citizen`, `entity`

---

### **4. Submissão de Propostas (`/proposal-submission`)**

**Componentes:**
- `ProposalFormHeader.jsx` - Cabeçalho do formulário
- `BasicInformationSection.jsx` - Informações básicas
- `LocationSection.jsx` - Localização e área de impacto
- `TimelineSection.jsx` - Cronograma de execução
- `ImpactAssessmentSection.jsx` - Avaliação de impacto
- `DocumentationSection.jsx` - Upload de documentos
- `FormActions.jsx` - Ações do formulário
- `PreviewModal.jsx` - Preview antes da submissão

**Funcionalidades:**
- **Formulário multi-seção** com accordions
- **Sistema de rascunho** com localStorage
- **Upload de documentos** com drag-and-drop
- **Validação progressiva** com indicador de progresso
- **Preview completo** antes da submissão
- **Salvamento automático** para prevenir perda de dados

**Seções do Formulário:**
1. **Informações Básicas**: Título, categoria, descrição
2. **Localização**: Bairro, região, área de impacto
3. **Orçamento**: Valor estimado, breakdown de custos
4. **Cronograma**: Timeline de execução, marcos
5. **Impacto**: População beneficiada, indicadores
6. **Documentação**: Upload de arquivos de apoio

**Papéis com Acesso:** `citizen`, `entity`

---

### **5. Sistema de Votação (`/proposal-voting`)**

**Componentes:**
- `VotingPeriodStatus.jsx` - Status do período
- `VotingFilters.jsx` - Filtros avançados
- `ProposalCard.jsx` - Cartão de proposta para votação
- `ProposalComparison.jsx` - Comparação lado a lado
- `VotingModal.jsx` - Modal de confirmação de voto

**Funcionalidades:**
- **Lista de propostas** com filtros avançados
- **Sistema de votação** com confirmação dupla
- **Comparação de propostas** (até 3 simultâneas)
- **Filtros por**: categoria, valor, localização, status
- **Busca textual** em título e descrição
- **Métricas em tempo real** de votação
- **Prevenção de voto duplicado**

**Validações de Segurança:**
- Um voto por usuário por proposta
- Verificação de CPF/CNPJ únicos
- Log de auditoria para todos os votos
- Prevenção de automação

**Papéis com Acesso:** `citizen`, `entity`, `manager`

---

### **6. Análise Gerencial (`/manager-analysis`)**

**Componentes:**
- `AnalyticsDashboard.jsx` - Dashboard de analytics
- `ProposalEvaluationCard.jsx` - Cartão de avaliação
- `ReviewAssignmentModal.jsx` - Modal de atribuição
- `FilterControls.jsx` - Controles de filtro
- `BatchActions.jsx` - Ações em lote
- `MetricsCard.jsx` - Métricas gerenciais

**Funcionalidades:**
- **Dashboard de análise** de propostas submetidas
- **Sistema de pontuação** e comentários técnicos
- **Atribuição de analistas** para distribuição de carga
- **Ações em lote** para eficiência operacional
- **Analytics de performance** da equipe
- **Tempo médio de análise** e KPIs
- **Taxa de aprovação** por categoria

**Fluxos de Análise:**
1. **Recebimento**: Lista de propostas pendentes
2. **Atribuição**: Distribuição para analistas
3. **Avaliação**: Pontuação e comentários técnicos
4. **Decisão**: Aprovação, rejeição ou solicitação de ajustes
5. **Feedback**: Comunicação com o proponente

**Papéis com Acesso:** `admin`, `manager`

---

### **7. Acompanhamento Execução - Gestor (`/manager-tracking-dashboard`)**

**Componentes:**
- `ManagerStats.jsx` - Estatísticas do gestor
- `ManagerProposalCard.jsx` - Cartão gerencial de proposta
- `BatchUpdateModal.jsx` - Modal de atualização em lote
- `ExecutionHistory.jsx` - Histórico de atualizações

**Funcionalidades:**
- **Atualização de progresso** físico e financeiro
- **Sistema de comentários** internos
- **Operações em lote** para múltiplas propostas
- **Histórico de modificações** com auditoria
- **Validações de negócio** automáticas
- **Previsão de conclusão** baseada em progresso

**Campos Editáveis:**
- Percentual físico (0-100%)
- Percentual financeiro (0-100%)
- Status de execução (em andamento, atrasada, concluída)
- Comentários internos
- Data prevista de conclusão

**Validações:**
- Percentual financeiro não pode exceder físico em +10%
- Status "Concluída" requer 100% físico e financeiro
- Comentários obrigatórios para status "Atrasada"

**Papéis com Acesso:** `admin`, `manager`

---

### **8. Acompanhamento - Vista Cidadão (`/proposal-tracking-citizen-view`)**

**Componentes:**
- `ExecutionStats.jsx` - Estatísticas de execução
- `FilterControls.jsx` - Controles de filtro público
- `ProposalExecutionCard.jsx` - Cartão de execução para cidadão

**Funcionalidades:**
- **Visualização pública** do progresso de execução
- **Barras de progresso** animadas (físico e financeiro)
- **Filtros por localidade** e status
- **Informações de transparência** pública
- **Timeline de marcos** importantes
- **Dados de responsável** pela execução

**Informações Exibidas:**
- Progresso físico e financeiro
- Status atual da obra/projeto
- Última atualização
- Órgão responsável
- Cronograma previsto vs. realizado

**Papéis com Acesso:** Todos os usuários autenticados

---

### **9. Configurações Admin (`/admin-configuration`)**

**Componentes:**
- `UserManagementTab.jsx` - Gestão de usuários
- `SystemConfigTab.jsx` - Configurações do sistema
- `RolePermissionsTab.jsx` - Permissões por papel
- `SecurityMonitoringTab.jsx` - Monitoramento de segurança
- `SystemLogsTab.jsx` - Logs do sistema

**Funcionalidades:**
- **Painel administrativo** completo
- **Gerenciamento de usuários** e permissões
- **Configuração de períodos** de votação
- **Monitoramento de segurança** em tempo real
- **Relatórios e analytics** do sistema
- **Controle de acesso** granular

**Abas do Painel:**
1. **Gestão de Usuários**: CRUD completo, ações em lote
2. **Configurações**: Períodos, categorias, limites
3. **Permissões**: Controle de acesso por papel
4. **Segurança**: Logs, sessões ativas, alertas
5. **Relatórios**: Analytics e exportação de dados

**Operações Críticas:**
- Autenticação dupla para ações sensíveis
- Backup automático antes de operações em lote
- Log detalhado de todas as ações administrativas

**Papéis com Acesso:** `admin`, `manager` (acesso limitado)

---

## 🗄️ Estrutura do Banco de Dados

### **Tabelas Principais**
Baseado no schema Supabase identificado:

```sql
-- Tabela de usuários do sistema
users (8 colunas)
├── Relacionamentos: Referenciada por user_profiles

-- Perfis de usuário
user_profiles (múltiplas colunas)
├── Referencia: users (via user_id → id)
├── Referenciada por: activity_logs, execution_status, proposals, rate_limits, user_sessions

-- Propostas do orçamento participativo
proposals (múltiplas colunas)
├── Referencia: user_profiles (approved_by, created_by)
├── Referenciada por: execution_status

-- Status de execução das propostas
execution_status (múltiplas colunas)
├── Referencia: user_profiles (atualizado_por), proposals (proposta_id)

-- Logs de atividade do sistema
activity_logs
├── Referencia: user_profiles (user_id)

-- Sessões de usuário
user_sessions
├── Referencia: user_profiles (user_id)

-- Limitação de taxa (rate limiting)
rate_limits
├── Referencia: user_profiles (user_id)

-- Políticas de segurança
security_policies
├── Sem relacionamentos diretos
```

### **Tipos Personalizados (ENUMs)**
- `execution_status_enum`: `['em_andamento', 'atrasada', 'concluida']`
- `proposal_status`: `['draft', 'submitted', 'under_review', 'approved', 'rejected', 'em_execucao']`

### **Funções do Banco**
- `has_role()`, `has_any_role()`, `has_role_from_users()` - Verificação de papéis
- `can_access_proposal()`, `can_edit_execution()` - Controle de acesso
- `log_activity()` - Log de atividades
- `check_rate_limit()` - Controle de taxa
- `sync_user_profile()` - Sincronização de perfil
- Triggers para logs automáticos

---

## 🔌 Integrações e APIs

### **Supabase Services**
```javascript
// Cliente Supabase configurado
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Serviço de acompanhamento de propostas
export const proposalTrackingService = {
  getProposalsForCitizens,      // Vista pública
  getProposalsForManagers,      // Vista gerencial
  updateExecutionStatus,        // Atualização de progresso
  getUniqueLocalities,          // Filtros de localidade
  getUniqueCategories          // Filtros de categoria
};

// Subscriptions em tempo real
setupProposalSubscription(callback);
```

### **APIs Externas Potenciais**
- **API Receita Federal**: Validação de CPF/CNPJ (futuro)
- **ViaCEP**: Validação de endereços (futuro)
- **OpenAI Integration**: Configurado via env (VITE_OPENAI_API_KEY)

---

## 🎨 Sistema de Design e UI

### **Design System**
- **shadcn/ui**: Componentes base consistentes
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Ícones consistentes
- **Paleta de Cores**: Tema brasileiro com cores governamentais
- **Tipografia**: Hierarquia clara e legível
- **Responsividade**: Mobile-first design

### **Componentes UI Reutilizáveis**
```
src/components/ui/
├── Button.jsx              # Botões com variants
├── Input.jsx               # Inputs com validação
├── Select.jsx              # Dropdowns
├── Checkbox.jsx            # Checkboxes
├── Header.jsx              # Cabeçalho do sistema
├── BreadcrumbTrail.jsx     # Navegação breadcrumb
└── SecurityDashboard.jsx   # Dashboard de segurança
```

### **Padrões de Design**
- **Cards**: Informações agrupadas visualmente
- **Modals**: Confirmações e formulários complexos
- **Tooltips**: Ajuda contextual
- **Loading States**: Feedback visual de carregamento
- **Error Boundaries**: Captura e exibição de erros

---

## 📊 Sistema de Analytics e Monitoramento

### **Métricas Principais**
- **Participação**: Taxa de engajamento por tipo de usuário
- **Propostas**: Número de submissões, aprovações, rejeições
- **Votação**: Participação, distribuição geográfica
- **Execução**: Progresso médio, atrasos, conclusões
- **Performance**: Tempo de carregamento, erros

### **Logs e Auditoria**
- **Activity Logs**: Todas as ações dos usuários
- **Security Logs**: Tentativas de acesso, falhas
- **System Logs**: Erros, performance, uso de recursos
- **Audit Trail**: Histórico completo de modificações

---

## 🛠️ Guia de Desenvolvimento

### **Pré-requisitos**
- Node.js 14+ 
- npm ou yarn
- Conta Supabase configurada
- Variáveis de ambiente configuradas

### **Instalação e Setup**
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves

# Iniciar desenvolvimento
npm start

# Build para produção
npm run build
```

### **Estrutura de Commits**
```
feat(component): adiciona novo componente X
fix(auth): corrige problema de login
docs(readme): atualiza documentação
style(ui): ajusta espaçamento dos cards
```

### **Testes e Qualidade**
- **Testing Library**: Testes de componentes React
- **Jest**: Framework de testes
- **ESLint**: Linting de código
- **Prettier**: Formatação consistente

### **Variáveis de Ambiente Necessárias**
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-key-here (opcional)
```

---

## 🚀 Deploy e Produção

### **Build de Produção**
```bash
npm run build
# Gera pasta dist/ com arquivos otimizados
```

### **Configurações de Deploy**
- **Netlify/Vercel**: Deploy automático via Git
- **Redirects**: Arquivo `public/_redirects` configurado para SPA
- **Environment Variables**: Configurar no painel do provedor
- **HTTPS**: SSL necessário para Supabase Auth

### **Checklist de Deploy**
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase RLS policies ativas
- [ ] URLs de produção configuradas no Supabase
- [ ] Redirects de SPA configurados
- [ ] Analytics configurado (se aplicável)

---

## 🔒 Segurança e Conformidade

### **Medidas de Segurança Implementadas**
- **Rate Limiting**: Proteção contra abuso de recursos
- **Authentication Guards**: Proteção de rotas sensíveis
- **Input Validation**: Sanitização de entradas
- **HTTPS Only**: Comunicação criptografada
- **Session Management**: Controle de sessões ativas
- **Activity Logging**: Auditoria completa

### **Conformidade LGPD**
- **Consentimento**: Termos de uso e privacidade
- **Minimização**: Coleta apenas de dados necessários
- **Portabilidade**: Exportação de dados do usuário
- **Exclusão**: Direito ao esquecimento implementado
- **Transparência**: Política de privacidade clara

### **Boas Práticas de Segurança**
- Não exposição de chaves de API no frontend
- Validação dupla (client-side + server-side)
- Sanitização de inputs para prevenir XSS
- Controle de acesso baseado em papéis (RBAC)
- Logs de auditoria para operações críticas

---

## 🧪 Testes e Debugging

### **Credenciais de Teste**
| Perfil | Documento | Email | Senha |
|--------|-----------|--------|-------|
| Cidadão | 123.456.789-00 | joao@email.com | cidadao123 |
| Entidade | 12.345.678/0001-90 | contato@prefeitura.gov.br | entidade123 |
| Gestor | 987.654.321-00 | maria.gestor@gov.br | gestor123 |
| Admin | 111.222.333-44 | admin@sistema.gov.br | admin123 |

### **Cenários de Teste**
1. **Fluxo Completo Cidadão**: Cadastro → Login → Submissão → Votação → Acompanhamento
2. **Fluxo Gestor**: Login → Análise → Aprovação → Atualização de Execução
3. **Fluxo Admin**: Configuração → Gerenciamento de Usuários → Relatórios
4. **Casos Edge**: Validações de formulário, limites de upload, rate limiting

### **Debug e Logs**
- Browser DevTools para erros de frontend
- Supabase Dashboard para erros de backend
- Console.log estratégico para debugging
- Network tab para análise de requests

---

## 📞 Suporte e Contribuição

### **Arquitetura de Suporte**
- **Documentação**: Este arquivo + comentários no código
- **Issues**: GitHub Issues para bugs e features
- **Code Review**: Pull requests obrigatórios
- **Versionamento**: Semantic Versioning (SemVer)

### **Contribuindo**
1. Fork do repositório
2. Criar branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### **Contatos Técnicos**
- **Documentação**: Consultar este arquivo para dúvidas técnicas
- **Issues**: Reportar bugs via GitHub Issues
- **Sugestões**: Discussions no repositório

---

## 📈 Roadmap e Melhorias Futuras

### **Próximas Features**
- [ ] **PWA**: Transformar em Progressive Web App
- [ ] **Notificações Push**: Alertas em tempo real
- [ ] **Relatórios Avançados**: Dashboard analytics completo
- [ ] **API Móvel**: Desenvolvimento de app nativo
- [ ] **Integração IA**: Assistente para redação de propostas
- [ ] **Geolocalização**: Mapeamento visual das propostas
- [ ] **Chat**: Sistema de comunicação entre usuários

### **Otimizações Técnicas**
- [ ] **Performance**: Code splitting e lazy loading
- [ ] **SEO**: Server-side rendering com Next.js
- [ ] **A11y**: Melhorias de acessibilidade
- [ ] **Testing**: Cobertura de testes automatizados
- [ ] **CI/CD**: Pipeline de deploy automatizado

### **Integrações Futuras**
- [ ] **E-mail Service**: SendGrid ou similar para notificações
- [ ] **SMS**: Verificação via SMS para maior segurança
- [ ] **Blockchain**: Registro imutável de votações
- [ ] **Gov.br**: Integração com plataforma governamental
- [ ] **Open Data**: API pública para transparência

---

## 📋 Conclusão

Esta plataforma de **Orçamento Participativo Municipal** representa uma solução completa para democratizar o processo de decisão sobre investimentos públicos. Com arquitetura moderna, segurança robusta e experiência de usuário otimizada, o sistema facilita a participação cidadã e fornece ferramentas eficientes para gestão pública.

**Principais Diferenciais:**
- ✅ **RBAC Completo**: 4 tipos de usuário com permissões granulares
- ✅ **Segurança Avançada**: Rate limiting, logs de auditoria, validações
- ✅ **UX Brasileira**: CPF/CNPJ, formatação BRL, linguagem localizada  
- ✅ **Real-time**: Atualizações instantâneas via Supabase
- ✅ **Mobile-first**: Responsivo para todos os dispositivos
- ✅ **Transparência**: Acompanhamento público da execução

**Stack Tecnológica Sólida:**
- React 18 + Vite para performance otimizada
- Supabase para backend robusto e escalável
- Tailwind CSS + shadcn/ui para design consistente
- Redux Toolkit para gerenciamento de estado
- Arquitetura modular e extensível

O sistema está pronto para produção e preparado para escalar conforme a demanda, mantendo sempre os princípios de transparência, segurança e participação cidadã que norteiam o projeto.

---

**Versão da Documentação:** 1.0.0  
**Última Atualização:** 2025-09-22  
**Compatibilidade:** React 18+, Node.js 14+, Supabase 2.57+