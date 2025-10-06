import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      numbers: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    
    Object.values(checks)?.forEach(check => {
      if (check) score++;
    });
    
    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Muito Fraca', color: 'text-red-600', bgColor: 'bg-red-500' },
      2: { label: 'Fraca', color: 'text-red-500', bgColor: 'bg-red-400' },
      3: { label: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
      4: { label: 'Forte', color: 'text-green-600', bgColor: 'bg-green-500' },
      5: { label: 'Muito Forte', color: 'text-green-700', bgColor: 'bg-green-600' }
    };
    
    return {
      score,
      checks,
      ...strengthLevels?.[score]
    };
  };

  const strength = calculateStrength(password);
  
  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">
            Força da Senha
          </span>
          <span className={`text-sm font-medium ${strength?.color}`}>
            {strength?.label}
          </span>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5]?.map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full transition-colors ${
                level <= strength?.score 
                  ? strength?.bgColor 
                  : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Requirements Checklist */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-primary">Requisitos:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className={`flex items-center space-x-2 text-sm ${
            strength?.checks?.length ? 'text-success' : 'text-text-secondary'
          }`}>
            <Icon 
              name={strength?.checks?.length ? "CheckCircle" : "Circle"} 
              size={14} 
            />
            <span>Mínimo 8 caracteres</span>
          </div>
          
          <div className={`flex items-center space-x-2 text-sm ${
            strength?.checks?.lowercase ? 'text-success' : 'text-text-secondary'
          }`}>
            <Icon 
              name={strength?.checks?.lowercase ? "CheckCircle" : "Circle"} 
              size={14} 
            />
            <span>Letra minúscula</span>
          </div>
          
          <div className={`flex items-center space-x-2 text-sm ${
            strength?.checks?.uppercase ? 'text-success' : 'text-text-secondary'
          }`}>
            <Icon 
              name={strength?.checks?.uppercase ? "CheckCircle" : "Circle"} 
              size={14} 
            />
            <span>Letra maiúscula</span>
          </div>
          
          <div className={`flex items-center space-x-2 text-sm ${
            strength?.checks?.numbers ? 'text-success' : 'text-text-secondary'
          }`}>
            <Icon 
              name={strength?.checks?.numbers ? "CheckCircle" : "Circle"} 
              size={14} 
            />
            <span>Número</span>
          </div>
          
          <div className={`flex items-center space-x-2 text-sm ${
            strength?.checks?.special ? 'text-success' : 'text-text-secondary'
          }`}>
            <Icon 
              name={strength?.checks?.special ? "CheckCircle" : "Circle"} 
              size={14} 
            />
            <span>Caractere especial</span>
          </div>
        </div>
      </div>
      {/* Security Tips */}
      {strength?.score < 4 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Dica de Segurança</p>
              <p className="text-text-secondary">
                Use uma combinação de letras maiúsculas e minúsculas, números e símbolos para criar uma senha mais segura.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;