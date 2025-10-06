import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import UserTypeSelector from './UserTypeSelector';
import DocumentInput from './DocumentInput';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    userType: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationDescription: '',
    acceptTerms: false,
    acceptPrivacy: false
  });

  const [errors, setErrors] = useState({});
  const [documentValidation, setDocumentValidation] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    } else if (formData?.name?.trim()?.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex?.test(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

    // User type validation
    if (!formData?.userType) {
      newErrors.userType = 'Selecione o tipo de usuário';
    }

    // Document validation
    if (!formData?.document) {
      newErrors.document = 'Documento é obrigatório';
    } else if (!documentValidation?.valid) {
      newErrors.document = 'Documento inválido ou não validado';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Organization fields for entities
    if (formData?.userType === 'entidade') {
      if (!formData?.organizationName?.trim()) {
        newErrors.organizationName = 'Nome da organização é obrigatório';
      }
      if (!formData?.organizationDescription?.trim()) {
        newErrors.organizationDescription = 'Descrição da organização é obrigatória';
      }
    }

    // Terms acceptance
    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
    }

    if (!formData?.acceptPrivacy) {
      newErrors.acceptPrivacy = 'Você deve aceitar a política de privacidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDocumentValidation = (isValid, data) => {
    setDocumentValidation({ valid: isValid, data });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="User" size={20} className="mr-2 text-primary" />
          Informações Pessoais
        </h3>
        
        <Input
          label="Nome Completo"
          type="text"
          placeholder="Digite seu nome completo"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          description="Será usado para login e notificações importantes"
          required
        />
      </div>
      {/* User Type Selection */}
      <UserTypeSelector
        selectedType={formData?.userType}
        onTypeChange={(type) => handleInputChange('userType', type)}
        error={errors?.userType}
      />
      {/* Document Validation */}
      {formData?.userType && (
        <DocumentInput
          userType={formData?.userType}
          value={formData?.document}
          onChange={(value) => handleInputChange('document', value)}
          error={errors?.document}
          onValidation={handleDocumentValidation}
        />
      )}
      {/* Organization Information (for entities) */}
      {formData?.userType === 'entidade' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Building2" size={20} className="mr-2 text-primary" />
            Informações da Organização
          </h3>
          
          <Input
            label="Nome da Organização"
            type="text"
            placeholder="Nome oficial da sua organização"
            value={formData?.organizationName}
            onChange={(e) => handleInputChange('organizationName', e?.target?.value)}
            error={errors?.organizationName}
            required
          />

          <Input
            label="Descrição da Organização"
            type="text"
            placeholder="Breve descrição das atividades da organização"
            value={formData?.organizationDescription}
            onChange={(e) => handleInputChange('organizationDescription', e?.target?.value)}
            error={errors?.organizationDescription}
            description="Descreva o propósito e atividades principais da organização"
            required
          />
        </div>
      )}
      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Lock" size={20} className="mr-2 text-primary" />
          Segurança da Conta
        </h3>
        
        <Input
          label="Senha"
          type="password"
          placeholder="Crie uma senha segura"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
        />

        <PasswordStrengthIndicator password={formData?.password} />

        <Input
          label="Confirmar Senha"
          type="password"
          placeholder="Digite a senha novamente"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Terms and Privacy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="FileText" size={20} className="mr-2 text-primary" />
          Termos e Condições
        </h3>
        
        <div className="space-y-3">
          <Checkbox
            label="Aceito os Termos de Uso da plataforma"
            checked={formData?.acceptTerms}
            onChange={(e) => handleInputChange('acceptTerms', e?.target?.checked)}
            error={errors?.acceptTerms}
            description="Leia nossos termos de uso para entender seus direitos e responsabilidades"
          />

          <Checkbox
            label="Aceito a Política de Privacidade e tratamento de dados pessoais"
            checked={formData?.acceptPrivacy}
            onChange={(e) => handleInputChange('acceptPrivacy', e?.target?.checked)}
            error={errors?.acceptPrivacy}
            description="Conforme a Lei Geral de Proteção de Dados (LGPD)"
          />
        </div>
      </div>
      {/* Approval Notice for Special Roles */}
      {(formData?.userType === 'gestor' || formData?.userType === 'admin') && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-warning mb-2">Aprovação Manual Necessária</h4>
              <p className="text-sm text-text-secondary">
                Contas de {formData?.userType === 'gestor' ? 'Gestor Municipal' : 'Administrador'} 
                requerem aprovação manual da administração municipal. Você receberá um email 
                quando sua conta for aprovada, o que pode levar de 2 a 5 dias úteis.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Submit Button */}
      <div className="space-y-4">
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="UserPlus"
          iconPosition="left"
        >
          {isLoading ? 'Criando Conta...' : 'Criar Conta'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;