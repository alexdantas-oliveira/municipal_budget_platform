import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentationSection = ({ 
  formData, 
  onInputChange, 
  errors, 
  isExpanded, 
  onToggle 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const allowedFileTypes = [
    '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx', '.xls'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const isValidType = allowedFileTypes?.some(type => 
        file?.name?.toLowerCase()?.endsWith(type?.toLowerCase())
      );
      const isValidSize = file?.size <= maxFileSize;
      return isValidType && isValidSize;
    });

    const newFiles = [...(formData?.documents || []), ...validFiles?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      uploadStatus: 'pending'
    }))];

    onInputChange('documents', newFiles);

    // Simulate upload progress
    validFiles?.forEach(file => {
      simulateUpload(file?.name);
    });
  };

  const simulateUpload = (fileName) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));
    }, 200);
  };

  const removeFile = (fileId) => {
    const updatedFiles = formData?.documents?.filter(doc => doc?.id !== fileId) || [];
    onInputChange('documents', updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'doc': case'docx':
        return 'FileText';
      case 'jpg': case'jpeg': case'png':
        return 'Image';
      case 'xlsx': case'xls':
        return 'FileSpreadsheet';
      default:
        return 'File';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Upload" size={16} className="text-warning" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-semibold text-text-primary">
              Documentação de Apoio
            </h3>
            <p className="text-sm text-text-secondary">
              Anexe documentos que comprovem a necessidade
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-secondary" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept={allowedFileTypes?.join(',')}
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Upload" size={24} className="text-primary" />
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-text-primary mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </h4>
                <p className="text-sm text-text-secondary">
                  Formatos aceitos: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX
                </p>
                <p className="text-sm text-text-secondary">
                  Tamanho máximo: 10MB por arquivo
                </p>
              </div>
              
              <Button variant="outline" size="sm">
                <Icon name="FolderOpen" size={16} className="mr-2" />
                Selecionar Arquivos
              </Button>
            </div>
          </div>

          {/* File List */}
          {formData?.documents && formData?.documents?.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">
                Arquivos Anexados ({formData?.documents?.length})
              </h4>
              
              <div className="space-y-2">
                {formData?.documents?.map((doc) => (
                  <div key={doc?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        <Icon name={getFileIcon(doc?.name)} size={16} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {doc?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatFileSize(doc?.size)}
                        </p>
                        
                        {/* Upload Progress */}
                        {uploadProgress?.[doc?.name] && uploadProgress?.[doc?.name] < 100 && (
                          <div className="mt-1">
                            <div className="w-full bg-border rounded-full h-1">
                              <div 
                                className="bg-primary h-1 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress?.[doc?.name]}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFile(doc?.id)}
                      className="p-1 text-text-secondary hover:text-destructive transition-smooth"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Guidelines */}
          <div className="bg-accent/50 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2 flex items-center">
              <Icon name="Info" size={16} className="mr-2 text-primary" />
              Documentos Recomendados
            </h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Estudos técnicos ou diagnósticos da situação atual</li>
              <li>• Orçamentos ou cotações de fornecedores</li>
              <li>• Fotografias que demonstrem a necessidade</li>
              <li>• Abaixo-assinado ou manifestações de apoio da comunidade</li>
              <li>• Plantas, projetos ou especificações técnicas</li>
            </ul>
          </div>

          {errors?.documents && (
            <p className="text-sm text-destructive">{errors?.documents}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentationSection;