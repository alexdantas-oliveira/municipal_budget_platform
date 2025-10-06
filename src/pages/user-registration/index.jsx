import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import SecurityBadges from './components/SecurityBadges';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const handleRegistration = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      const userData = {
        id: Date.now(),
        name: formData?.name,
        email: formData?.email,
        userType: formData?.userType,
        document: formData?.document,
        status: ['gestor', 'admin']?.includes(formData?.userType) ? 'pending_approval' : 'active',
        createdAt: new Date()?.toISOString()
      };
      
      setRegistrationData(userData);
      setRegistrationSuccess(true);
      
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (registrationData?.status === 'active') {
      navigate('/login', { 
        state: { 
          message: 'Conta criada com sucesso! Faça login para continuar.',
          email: registrationData?.email 
        } 
      });
    } else {
      navigate('/login', { 
        state: { 
          message: 'Conta criada! Aguarde aprovação da administração municipal.',
          email: registrationData?.email 
        } 
      });
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={false} />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <BreadcrumbTrail />
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              
              <h1 className="text-2xl font-bold text-text-primary mb-4">
                Conta Criada com Sucesso!
              </h1>
              
              {registrationData?.status === 'active' ? (
                <div className="space-y-4">
                  <p className="text-text-secondary">
                    Sua conta foi criada e está ativa. Você já pode fazer login e começar a 
                    participar do orçamento participativo municipal.
                  </p>
                  
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-success">
                      <Icon name="CheckCircle" size={16} />
                      <span className="font-medium">Conta Ativa</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-text-secondary">
                    Sua conta foi criada e está aguardando aprovação da administração municipal. 
                    Você receberá um email quando sua conta for aprovada.
                  </p>
                  
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-warning">
                      <Icon name="Clock" size={16} />
                      <span className="font-medium">Aguardando Aprovação</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">
                      Tempo estimado: 2-5 dias úteis
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-8 space-y-4">
                <button
                  onClick={handleContinue}
                  className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon name="ArrowRight" size={16} />
                  <span>Continuar para Login</span>
                </button>
                
                <div className="text-sm text-text-secondary">
                  <p>Email cadastrado: <strong>{registrationData?.email}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <BreadcrumbTrail />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg shadow-soft p-6 lg:p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Criar Nova Conta
                </h1>
                <p className="text-text-secondary">
                  Cadastre-se para participar do orçamento participativo municipal. 
                  Sua participação é fundamental para o desenvolvimento da nossa cidade.
                </p>
              </div>
              
              <RegistrationForm 
                onSubmit={handleRegistration}
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {/* Security Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <SecurityBadges />
              
              {/* Help Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <Icon name="HelpCircle" size={20} className="mr-2 text-primary" />
                  Precisa de Ajuda?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="Phone" size={16} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium text-text-primary text-sm">Suporte Técnico</p>
                      <p className="text-sm text-text-secondary">(11) 3000-0000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Icon name="Mail" size={16} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium text-text-primary text-sm">Email</p>
                      <p className="text-sm text-text-secondary">suporte@municipio.gov.br</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Icon name="Clock" size={16} className="text-primary mt-1" />
                    <div>
                      <p className="font-medium text-text-primary text-sm">Horário</p>
                      <p className="text-sm text-text-secondary">
                        Segunda a Sexta\n8h às 17h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
                  Participação Cidadã
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Cidadãos Cadastrados</span>
                    <span className="font-semibold text-text-primary">12.847</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Propostas Enviadas</span>
                    <span className="font-semibold text-text-primary">1.234</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Votos Realizados</span>
                    <span className="font-semibold text-text-primary">45.678</span>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center space-x-2 text-success">
                      <Icon name="TrendingUp" size={16} />
                      <span className="text-sm font-medium">+15% este mês</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-text-secondary">
            <p>
              © {new Date()?.getFullYear()} Prefeitura Municipal - Orçamento Participativo. 
              Todos os direitos reservados.
            </p>
            <p className="mt-2">
              Plataforma desenvolvida em conformidade com a LGPD e padrões de acessibilidade do governo brasileiro.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserRegistration;