import React from 'react';
import Icon from '../../../components/AppIcon';

const ProposalFormHeader = ({ currentStep, totalSteps, title, description }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {title}
            </h1>
            <p className="text-sm text-text-secondary">
              {description}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={16} />
          <span>Última atualização: {new Date()?.toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-primary">
            Progresso do Formulário
          </span>
          <span className="text-sm text-text-secondary">
            {currentStep} de {totalSteps} seções
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalFormHeader;