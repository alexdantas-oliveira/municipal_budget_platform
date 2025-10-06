import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import { useAuth } from '../../components/ui/RoleBasedNavigation';
import { usePermissions } from '../../components/ui/AdvancedAuthGuard';
import SecureButton from '../../components/ui/SecureButton';
import { supabase } from '../../lib/supabase';
import ProposalFormHeader from './components/ProposalFormHeader';
import BasicInformationSection from './components/BasicInformationSection';
import LocationSection from './components/LocationSection';
import DocumentationSection from './components/DocumentationSection';
import TimelineSection from './components/TimelineSection';
import ImpactAssessmentSection from './components/ImpactAssessmentSection';

import PreviewModal from './components/PreviewModal';

const ProposalSubmission = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { logSecurityEvent } = usePermissions();
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    location: false,
    documentation: false,
    timeline: false,
    impact: false
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    region: '',
    cep: '',
    address: '',
    locationJustification: '',
    documents: [],
    startDate: '',
    endDate: '',
    milestones: [],
    implementationNotes: '',
    targetDemographics: [],
    estimatedBeneficiaries: '',
    expectedOutcomes: '',
    successIndicators: '',
    longTermImpact: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(5);

  const totalSteps = 5;

  // Enhanced security: Check submission limits
  useEffect(() => {
    const checkSubmissionLimits = async () => {
      try {
        const today = new Date()?.toISOString()?.split('T')?.[0];
        const { count } = await supabase?.from('proposals')?.select('*', { count: 'exact', head: true })?.eq('created_by', user?.id)?.gte('created_at', `${today}T00:00:00.000Z`)?.lt('created_at', `${today}T23:59:59.999Z`);

        setSubmissionCount(count || 0);

        if (count >= dailyLimit) {
          await logSecurityEvent('rate_limit_reached', {
            resource: 'proposal_submission',
            daily_count: count,
            limit: dailyLimit
          });
        }
      } catch (error) {
        console.error('Error checking submission limits:', error);
      }
    };

    if (user?.id) {
      checkSubmissionLimits();
    }
  }, [user?.id, dailyLimit, logSecurityEvent]);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('proposalDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData?.formData);
        setLastSaved(new Date(draftData.timestamp));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Calculate current step based on completed sections
  useEffect(() => {
    let step = 1;
    if (formData?.title && formData?.description && formData?.category && formData?.budget) {
      step = 2;
    }
    if (step === 2 && formData?.region) {
      step = 3;
    }
    if (step === 3 && formData?.startDate && formData?.endDate) {
      step = 4;
    }
    if (step === 4 && formData?.targetDemographics?.length > 0 && formData?.expectedOutcomes) {
      step = 5;
    }
    setCurrentStep(step);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  // Enhanced validation with security checks
  const validateForm = async () => {
    const newErrors = {};

    // Basic validation
    if (!formData?.title?.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData?.title?.length < 10) {
      newErrors.title = 'Título deve ter pelo menos 10 caracteres';
    } else if (formData?.title?.length > 200) {
      newErrors.title = 'Título não pode exceder 200 caracteres';
    }

    // XSS Prevention: Check for suspicious content
    const suspiciousPatterns = [/<script|javascript:|on\w+=/i];
    if (suspiciousPatterns?.some(pattern => pattern?.test(formData?.title || ''))) {
      newErrors.title = 'Conteúdo inválido detectado no título';
      await logSecurityEvent('xss_attempt', { field: 'title', content: formData?.title });
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData?.description?.length < 100) {
      newErrors.description = 'Descrição deve ter pelo menos 100 caracteres';
    } else if (formData?.description?.length > 5000) {
      newErrors.description = 'Descrição não pode exceder 5000 caracteres';
    }

    if (!formData?.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    // Enhanced budget validation
    if (!formData?.budget) {
      newErrors.budget = 'Orçamento é obrigatório';
    } else {
      const budgetValue = parseFloat(formData?.budget?.replace(/[^\d,]/g, '')?.replace(',', '.'));
      if (isNaN(budgetValue) || budgetValue <= 0) {
        newErrors.budget = 'Orçamento deve ser um valor válido';
      } else if (budgetValue > 500000) {
        newErrors.budget = 'Orçamento não pode exceder R$ 500.000,00';
      } else if (budgetValue < 1000) {
        newErrors.budget = 'Orçamento mínimo é R$ 1.000,00';
      }
    }

    // Location validation
    if (!formData?.region) {
      newErrors.region = 'Região é obrigatória';
    }

    // Timeline validation with business rules
    if (!formData?.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    if (!formData?.endDate) {
      newErrors.endDate = 'Data de conclusão é obrigatória';
    }

    if (formData?.startDate && formData?.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      const maxDate = new Date();
      maxDate?.setFullYear(today?.getFullYear() + 2);
      
      if (startDate < today) {
        newErrors.startDate = 'Data de início deve ser futura';
      }
      
      if (endDate <= startDate) {
        newErrors.endDate = 'Data de conclusão deve ser posterior à data de início';
      }

      if (endDate > maxDate) {
        newErrors.endDate = 'Proposta não pode exceder 2 anos de duração';
      }
    }

    // Impact Assessment validation
    if (!formData?.targetDemographics?.length) {
      newErrors.targetDemographics = 'Selecione pelo menos um público-alvo';
    }

    if (!formData?.estimatedBeneficiaries) {
      newErrors.estimatedBeneficiaries = 'Número de beneficiários é obrigatório';
    } else {
      const beneficiaries = parseInt(formData?.estimatedBeneficiaries);
      if (isNaN(beneficiaries) || beneficiaries < 1) {
        newErrors.estimatedBeneficiaries = 'Número de beneficiários deve ser maior que zero';
      }
    }

    if (!formData?.expectedOutcomes?.trim()) {
      newErrors.expectedOutcomes = 'Resultados esperados são obrigatórios';
    } else if (formData?.expectedOutcomes?.length < 50) {
      newErrors.expectedOutcomes = 'Descreva os resultados com pelo menos 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Enhanced submit function with security and logging
  const handleSubmit = async () => {
    // Check daily limit
    if (submissionCount >= dailyLimit) {
      alert(`Você atingiu o limite diário de ${dailyLimit} submissões de propostas.`);
      return;
    }

    if (!(await validateForm())) {
      const firstErrorField = Object.keys(errors)?.[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setIsSaving(true);

      // Log submission attempt
      await logSecurityEvent('proposal_submission_attempt', {
        title: formData?.title,
        category: formData?.category,
        budget: formData?.budget,
        daily_count: submissionCount
      });

      // Submit to database with enhanced data
      const proposalData = {
        titulo: formData?.title,
        descricao: formData?.description,
        categoria: formData?.category,
        orcamento: parseFloat(formData?.budget?.replace(/[^\d,]/g, '')?.replace(',', '.')),
        regiao: formData?.region,
        endereco: formData?.address,
        justificativa_local: formData?.locationJustification,
        data_inicio: formData?.startDate,
        data_fim: formData?.endDate,
        publico_alvo: formData?.targetDemographics,
        beneficiarios_estimados: parseInt(formData?.estimatedBeneficiaries),
        resultados_esperados: formData?.expectedOutcomes,
        indicadores_sucesso: formData?.successIndicators || '',
        impacto_longo_prazo: formData?.longTermImpact || '',
        observacoes: formData?.implementationNotes || '',
        created_by: user?.id,
        status: 'submitted'
      };
      
      const { data, error } = await supabase?.from('proposals')?.insert([proposalData])?.select()?.single();

      if (error) throw error;

      // Log successful submission
      await logSecurityEvent('proposal_submission_success', {
        proposal_id: data?.id,
        title: data?.titulo
      });

      // Clear draft and redirect
      localStorage.removeItem('proposalDraft');
      
      navigate('/citizen-dashboard', { 
        state: { 
          message: 'Proposta enviada com sucesso!',
          protocolNumber: `PB${data?.id?.split('-')?.[0]?.toUpperCase()}`
        }
      });
      
    } catch (error) {
      console.error('Error submitting proposal:', error);
      await logSecurityEvent('proposal_submission_error', {
        error: error?.message
      });
      alert('Erro ao enviar proposta. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Enhanced save draft with version control
  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const draftData = {
        formData,
        timestamp: new Date()?.toISOString(),
        userRole,
        userId: user?.id,
        version: Date.now() // Simple versioning
      };
      
      localStorage.setItem('proposalDraft', JSON.stringify(draftData));
      setLastSaved(new Date());
      
      await logSecurityEvent('proposal_draft_saved', {
        title: formData?.title || 'Sem título'
      });
      
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const isFormValid = () => {
    return formData?.title?.trim() &&
           formData?.description?.trim() &&
           formData?.category &&
           formData?.budget &&
           formData?.region &&
           formData?.startDate &&
           formData?.endDate &&
           formData?.targetDemographics?.length > 0 &&
           formData?.estimatedBeneficiaries &&
           formData?.expectedOutcomes?.trim();
  };

  // Show limit warning
  const showLimitWarning = submissionCount >= dailyLimit - 1;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={true}
        userRole={userRole}
        userName={user?.name}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbTrail userRole={userRole} />
        
        {/* Daily limit warning */}
        {showLimitWarning && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800">⚠️ Limite de Submissões</h3>
            <p className="text-yellow-700">
              Você enviou {submissionCount} de {dailyLimit} propostas hoje. 
              {submissionCount >= dailyLimit ? ' Limite atingido.' : ' Restam ' + (dailyLimit - submissionCount) + '.'}
            </p>
          </div>
        )}
        
        <ProposalFormHeader
          currentStep={currentStep}
          totalSteps={totalSteps}
          title="Enviar Nova Proposta"
          description="Preencha o formulário abaixo para submeter sua proposta ao orçamento participativo"
        />

        <div className="space-y-6">
          <BasicInformationSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
            isExpanded={expandedSections?.basic}
            onToggle={() => toggleSection('basic')}
          />

          <LocationSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
            isExpanded={expandedSections?.location}
            onToggle={() => toggleSection('location')}
          />

          <DocumentationSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
            isExpanded={expandedSections?.documentation}
            onToggle={() => toggleSection('documentation')}
          />

          <TimelineSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
            isExpanded={expandedSections?.timeline}
            onToggle={() => toggleSection('timeline')}
          />

          <ImpactAssessmentSection
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
            isExpanded={expandedSections?.impact}
            onToggle={() => toggleSection('impact')}
          />

          {/* Enhanced Form Actions with Security */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="text-sm text-gray-600">
                {lastSaved && (
                  <p>💾 Último rascunho salvo: {lastSaved?.toLocaleTimeString('pt-BR')}</p>
                )}
                <p>📊 Progresso: {currentStep}/{totalSteps} seções concluídas</p>
                <p>📝 Submissões hoje: {submissionCount}/{dailyLimit}</p>
              </div>
              
              <div className="flex gap-3">
                <SecureButton
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  loadingText="Salvando..."
                  requiredRoles={['citizen', 'entity']}
                  logAction="save_draft"
                >
                  💾 Salvar Rascunho
                </SecureButton>

                <SecureButton
                  variant="secondary"
                  onClick={handlePreview}
                  disabled={!isFormValid()}
                  requiredRoles={['citizen', 'entity']}
                  logAction="preview_proposal"
                >
                  👁️ Visualizar
                </SecureButton>

                <SecureButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSaving || submissionCount >= dailyLimit}
                  loadingText="Enviando..."
                  requiredRoles={['citizen', 'entity']}
                  logAction="submit_proposal"
                  confirmAction={true}
                  confirmMessage={`Tem certeza que deseja enviar esta proposta? Você ainda poderá enviar ${dailyLimit - submissionCount - 1} propostas hoje.`}
                >
                  🚀 Enviar Proposta
                </SecureButton>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
      />
    </div>
  );
};

export default ProposalSubmission;