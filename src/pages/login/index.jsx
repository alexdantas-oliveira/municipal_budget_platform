import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import MockCredentialsInfo from './components/MockCredentialsInfo';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  return (
    <AuthenticationGuard requireAuth={false}>
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={false} />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BreadcrumbTrail />
            
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="LogIn" size={32} color="white" />
                </div>
                <div>
                  <h1 className="text-3xl font-heading font-bold text-text-primary">
                    Acesso ao Sistema
                  </h1>
                  <p className="text-lg text-text-secondary">
                    Orçamento Participativo Municipal
                  </p>
                </div>
              </div>
              
              <p className="text-text-secondary max-w-2xl mx-auto">
                Entre com suas credenciais para acessar a plataforma de participação cidadã. 
                Utilize seu CPF ou CNPJ para autenticação segura.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Login Form */}
              <div className="space-y-8">
                <div className="bg-card border border-border rounded-xl p-8 shadow-soft">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
                      Fazer Login
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Acesse sua conta com segurança
                    </p>
                  </div>
                  
                  <LoginForm />
                </div>

                {/* Quick Access Info */}
                <div className="bg-muted/30 border border-border rounded-lg p-6">
                  <h3 className="text-sm font-medium text-text-primary mb-3">
                    Acesso Rápido por Tipo de Usuário
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} className="text-primary" />
                      <span className="text-text-secondary">Cidadão: Propostas e votação</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Building2" size={14} className="text-secondary" />
                      <span className="text-text-secondary">Entidade: Submissão de propostas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="UserCheck" size={14} className="text-success" />
                      <span className="text-text-secondary">Gestor: Análise e aprovação</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Settings" size={14} className="text-warning" />
                      <span className="text-text-secondary">Admin: Configuração completa</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Trust Signals & Info */}
              <div className="space-y-8">
                <TrustSignals />
                <MockCredentialsInfo />
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  Segurança Garantida
                </h3>
                <p className="text-sm text-text-secondary">
                  Autenticação com criptografia AES-256 e integração oficial com a Receita Federal
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={24} className="text-secondary" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  Participação Cidadã
                </h3>
                <p className="text-sm text-text-secondary">
                  Plataforma oficial para participação democrática no orçamento municipal
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="FileCheck" size={24} className="text-success" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                  Transparência Total
                </h3>
                <p className="text-sm text-text-secondary">
                  Acompanhe o processo completo desde a proposta até a execução dos projetos
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-6 text-sm">
                  <Link to="/help" className="text-text-secondary hover:text-primary transition-smooth">
                    Central de Ajuda
                  </Link>
                  <Link to="/privacy" className="text-text-secondary hover:text-primary transition-smooth">
                    Política de Privacidade
                  </Link>
                  <Link to="/terms" className="text-text-secondary hover:text-primary transition-smooth">
                    Termos de Uso
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="Phone" size={16} />
                  <span>Suporte: 0800-123-4567</span>
                </div>
              </div>
              
              <div className="text-center mt-6 pt-6 border-t border-border">
                <p className="text-xs text-text-secondary">
                  © {new Date()?.getFullYear()} Prefeitura Municipal - Orçamento Participativo. 
                  Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthenticationGuard>
  );
};

export default LoginPage;