import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../components/ui/RoleBasedNavigation';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    document: '',
    password: '',
    userType: 'citizen',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    citizen: {
      document: '123.456.789-00',
      password: 'cidadao123',
      userData: { name: 'João Silva', email: 'joao@email.com' }
    },
    entity: {
      document: '12.345.678/0001-90',
      password: 'entidade123',
      userData: { name: 'Prefeitura Municipal', email: 'contato@prefeitura.gov.br' }
    },
    manager: {
      document: '987.654.321-00',
      password: 'gestor123',
      userData: { name: 'Maria Santos', email: 'maria.gestor@gov.br' }
    },
    admin: {
      document: '111.222.333-44',
      password: 'admin123',
      userData: { name: 'Carlos Admin', email: 'admin@sistema.gov.br' }
    }
  };

  const formatDocument = (value, type) => {
    const numbers = value?.replace(/\D/g, '');
    
    if (type === 'entity') {
      // CNPJ format: XX.XXX.XXX/XXXX-XX
      return numbers?.replace(/(\d{2})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1/$2')?.replace(/(\d{4})(\d)/, '$1-$2')?.slice(0, 18);
    } else {
      // CPF format: XXX.XXX.XXX-XX
      return numbers?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1-$2')?.slice(0, 14);
    }
  };

  const validateDocument = (document, type) => {
    const numbers = document?.replace(/\D/g, '');
    
    if (type === 'entity') {
      return numbers?.length === 14;
    } else {
      return numbers?.length === 11;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    
    if (name === 'document') {
      const formattedValue = formatDocument(value, formData?.userType);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      userType: type,
      document: '' // Clear document when changing type
    }));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.document?.trim()) {
      newErrors.document = formData?.userType === 'entity' ? 'CNPJ é obrigatório' : 'CPF é obrigatório';
    } else if (!validateDocument(formData?.document, formData?.userType)) {
      newErrors.document = formData?.userType === 'entity' ? 'CNPJ inválido' : 'CPF inválido';
    }
    
    if (!formData?.password?.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check credentials against mock data
      const credentials = mockCredentials?.[formData?.userType];
      
      if (formData?.document === credentials?.document && formData?.password === credentials?.password) {
        // Map manager to gestor for backend consistency
        const backendRole = formData?.userType === 'manager' ? 'gestor' : formData?.userType;
        
        // Successful login
        login(credentials?.userData, backendRole);
        
        // Force navigation to the correct dashboard based on role
        const dashboardRoute = getDashboardRoute(formData?.userType);
        
        // Clear any previous routing state to ensure fresh navigation
        const from = location?.state?.from?.pathname;
        
        // If there's no specific "from" route or it's a protected route, use dashboard
        if (!from || from === '/' || ['/login', '/user-registration']?.includes(from)) {
          navigate(dashboardRoute, { replace: true });
        } else {
          // Navigate to the intended route
          navigate(from, { replace: true });
        }
        
        // Confirm redirection with console log for debugging
        console.log(`Manager login successful - Redirecting to: ${dashboardRoute}`);
        
      } else {
        // Check if credentials match other user types
        const matchingType = Object.entries(mockCredentials)?.find(([type, creds]) => 
          formData?.document === creds?.document && formData?.password === creds?.password
        );
        
        if (matchingType) {
          setErrors({ 
            general: `Credenciais encontradas para tipo de usuário: ${getUserTypeLabel(matchingType?.[0])}. Selecione o tipo correto.` 
          });
        } else {
          setErrors({ general: 'CPF/CNPJ ou senha incorretos' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Erro no sistema. Tente novamente.' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardRoute = (userType) => {
    switch (userType) {
      case 'admin':
        return '/admin-configuration';
      case 'manager':
        return '/manager-analysis';
      case 'citizen': case'entity':
      default:
        return '/citizen-dashboard';
    }
  };

  const getUserTypeLabel = (type) => {
    const labels = {
      citizen: 'Cidadão',
      entity: 'Entidade',
      manager: 'Gestor',
      admin: 'Administrador'
    };
    return labels?.[type] || type;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            Tipo de Usuário
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleUserTypeChange('citizen')}
              className={`p-3 rounded-lg border-2 transition-smooth text-sm font-medium ${
                formData?.userType === 'citizen' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="User" size={16} />
                <span>Cidadão</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange('entity')}
              className={`p-3 rounded-lg border-2 transition-smooth text-sm font-medium ${
                formData?.userType === 'entity' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Building2" size={16} />
                <span>Entidade</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange('manager')}
              className={`p-3 rounded-lg border-2 transition-smooth text-sm font-medium ${
                formData?.userType === 'manager' ? 'border-success bg-success/5 text-success' : 'border-border hover:border-success/50 text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="UserCheck" size={16} />
                <span>Gestor</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange('admin')}
              className={`p-3 rounded-lg border-2 transition-smooth text-sm font-medium ${
                formData?.userType === 'admin' ? 'border-warning bg-warning/5 text-warning' : 'border-border hover:border-warning/50 text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Settings" size={16} />
                <span>Admin</span>
              </div>
            </button>
          </div>
        </div>

        {/* Document Input */}
        <Input
          label={formData?.userType === 'entity' ? 'CNPJ' : 'CPF'}
          type="text"
          name="document"
          value={formData?.document}
          onChange={handleInputChange}
          placeholder={formData?.userType === 'entity' ? '00.000.000/0000-00' : '000.000.000-00'}
          error={errors?.document}
          required
          className="w-full"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Digite sua senha"
            error={errors?.password}
            required
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-smooth"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Lembrar de mim"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-smooth"
          >
            Esqueci minha senha
          </button>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        )}

        {/* Session Expired Message */}
        {location?.state?.message && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">{location?.state?.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          fullWidth
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        {/* Registration Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/user-registration')}
              className="text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              Criar conta
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;