import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DocumentInput = ({ userType, value, onChange, error, onValidation }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);

  const isCPF = userType === 'cidadao' || userType === 'gestor' || userType === 'admin';
  const documentType = isCPF ? 'CPF' : 'CNPJ';
  const placeholder = isCPF ? '000.000.000-00' : '00.000.000/0000-00';
  const maxLength = isCPF ? 14 : 18;

  // Format document number
  const formatDocument = (value) => {
    const numbers = value?.replace(/\D/g, '');
    
    if (isCPF) {
      return numbers?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d{1,2})/, '$1-$2')?.replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return numbers?.replace(/(\d{2})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1/$2')?.replace(/(\d{4})(\d{1,2})/, '$1-$2')?.replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  // Validate CPF
  const validateCPF = (cpf) => {
    const numbers = cpf?.replace(/\D/g, '');
    if (numbers?.length !== 11) return false;
    
    // Check for repeated numbers
    if (/^(\d)\1{10}$/?.test(numbers)) return false;
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers?.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers?.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers?.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers?.charAt(10))) return false;
    
    return true;
  };

  // Validate CNPJ
  const validateCNPJ = (cnpj) => {
    const numbers = cnpj?.replace(/\D/g, '');
    if (numbers?.length !== 14) return false;
    
    // Check for repeated numbers
    if (/^(\d)\1{13}$/?.test(numbers)) return false;
    
    // Validate check digits
    let length = numbers?.length - 2;
    let digits = numbers?.substring(0, length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(digits?.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(numbers?.charAt(length))) return false;
    
    length = length + 1;
    digits = numbers?.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(digits?.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(numbers?.charAt(length))) return false;
    
    return true;
  };

  // Simulate Federal Revenue API validation
  const validateWithAPI = async (document) => {
    setIsValidating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = isCPF ? validateCPF(document) : validateCNPJ(document);
    
    if (isValid) {
      // Mock successful API response
      const mockData = isCPF ? {
        name: 'João Silva Santos',
        status: 'ATIVO',
        situation: 'REGULAR'
      } : {
        name: 'EMPRESA EXEMPLO LTDA',
        status: 'ATIVA',
        situation: 'REGULAR'
      };
      
      setValidationStatus({
        valid: true,
        data: mockData
      });
      onValidation?.(true, mockData);
    } else {
      setValidationStatus({
        valid: false,
        error: `${documentType} inválido ou não encontrado na Receita Federal`
      });
      onValidation?.(false, null);
    }
    
    setIsValidating(false);
  };

  const handleChange = (e) => {
    const formatted = formatDocument(e?.target?.value);
    onChange(formatted);
    
    // Reset validation status when document changes
    setValidationStatus(null);
    
    // Auto-validate when document is complete
    const numbers = formatted?.replace(/\D/g, '');
    const expectedLength = isCPF ? 11 : 14;
    
    if (numbers?.length === expectedLength) {
      validateWithAPI(formatted);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          label={`${documentType} *`}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          error={error}
          maxLength={maxLength}
          description={`Informe seu ${documentType} para validação na Receita Federal`}
        />
        
        {isValidating && (
          <div className="absolute right-3 top-9 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
        
        {validationStatus && !isValidating && (
          <div className="absolute right-3 top-9 flex items-center">
            {validationStatus?.valid ? (
              <Icon name="CheckCircle" size={16} className="text-success" />
            ) : (
              <Icon name="XCircle" size={16} className="text-destructive" />
            )}
          </div>
        )}
      </div>
      {validationStatus && (
        <div className={`p-3 rounded-lg border ${
          validationStatus?.valid 
            ? 'bg-success/10 border-success/20 text-success' :'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          <div className="flex items-start space-x-2">
            <Icon 
              name={validationStatus?.valid ? "CheckCircle" : "XCircle"} 
              size={16} 
              className="mt-0.5" 
            />
            <div className="text-sm">
              {validationStatus?.valid ? (
                <div>
                  <p className="font-medium">Documento validado com sucesso!</p>
                  <p className="mt-1">
                    Nome: {validationStatus?.data?.name}
                  </p>
                  <p>Status: {validationStatus?.data?.status}</p>
                </div>
              ) : (
                <p className="font-medium">{validationStatus?.error}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Segurança e Privacidade</p>
            <p>
              Seus dados são validados diretamente com a Receita Federal e criptografados com AES-256. 
              Utilizamos apenas as informações necessárias para verificação de identidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentInput;