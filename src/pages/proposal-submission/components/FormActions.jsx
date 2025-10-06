import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormActions = ({ 
  onSaveDraft, 
  onPreview, 
  onSubmit, 
  isValid, 
  isSaving, 
  lastSaved 
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = () => {
    if (isValid) {
      setShowConfirmDialog(true);
    }
  };

  const confirmSubmit = () => {
    onSubmit();
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Save Status */}
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Save" size={16} />
            <span>
              {lastSaved 
                ? `Último salvamento: ${lastSaved?.toLocaleString('pt-BR')}`
                : 'Rascunho não salvo'
              }
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={onSaveDraft}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Salvar Rascunho
            </Button>

            <Button
              variant="secondary"
              onClick={onPreview}
              iconName="Eye"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Visualizar
            </Button>

            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!isValid}
              iconName="Send"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Enviar Proposta
            </Button>
          </div>
        </div>

        {/* Validation Summary */}
        {!isValid && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  Campos obrigatórios pendentes
                </p>
                <p className="text-sm text-text-secondary">
                  Complete todos os campos obrigatórios antes de enviar a proposta.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Send" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Confirmar Envio
                </h3>
                <p className="text-sm text-text-secondary">
                  Deseja enviar esta proposta para análise?
                </p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-text-primary mb-2">
                O que acontece após o envio:
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• A proposta será enviada para análise técnica</li>
                <li>• Você receberá um número de protocolo por email</li>
                <li>• O status pode ser acompanhado no seu painel</li>
                <li>• Não será possível editar após o envio</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={confirmSubmit}
                iconName="Send"
                iconPosition="left"
                className="flex-1"
              >
                Confirmar Envio
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormActions;