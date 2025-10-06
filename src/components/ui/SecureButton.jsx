import React, { useState } from 'react';
import { usePermissions } from './AdvancedAuthGuard';

// ============================================
// SECURE BUTTON WITH RBAC INTEGRATION
// ============================================

const SecureButton = ({
  children,
  onClick,
  requiredRoles = [],
  requiredPermissions = [],
  logAction = null,
  confirmAction = false,
  confirmMessage = "Tem certeza que deseja continuar?",
  loadingText = "Processando...",
  deniedText = "Sem Permissão",
  className = "",
  variant = "primary",
  disabled = false,
  ...props
}) => {
  const { hasAccess, logSecurityEvent } = usePermissions();
  const [loading, setLoading] = useState(false);

  const canAccess = hasAccess(requiredRoles, requiredPermissions);

  const handleClick = async (e) => {
    e?.preventDefault();
    
    if (loading || disabled || !canAccess) return;

    // Log security event if action specified
    if (logAction) {
      await logSecurityEvent('button_action', {
        action: logAction,
        roles_required: requiredRoles,
        permissions_required: requiredPermissions
      });
    }

    // Confirm action if required
    if (confirmAction && !window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      
      if (onClick) {
        await onClick(e);
      }
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonClass = () => {
    const baseClass = "px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    let variantClass = "";
    switch (variant) {
      case 'primary':
        variantClass = canAccess 
          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" :"bg-gray-300 text-gray-500 cursor-not-allowed";
        break;
      case 'danger':
        variantClass = canAccess 
          ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500" :"bg-gray-300 text-gray-500 cursor-not-allowed";
        break;
      case 'success':
        variantClass = canAccess 
          ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500" :"bg-gray-300 text-gray-500 cursor-not-allowed";
        break;
      case 'secondary':
        variantClass = canAccess 
          ? "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500" :"bg-gray-100 text-gray-400 cursor-not-allowed";
        break;
      default:
        variantClass = canAccess 
          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500" :"bg-gray-300 text-gray-500 cursor-not-allowed";
    }

    return `${baseClass} ${variantClass} ${className}`;
  };

  const getButtonText = () => {
    if (loading) return loadingText;
    if (!canAccess) return deniedText;
    return children;
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled || !canAccess}
      className={getButtonClass()}
      title={!canAccess ? `Acesso negado. Roles necessários: ${requiredRoles?.join(', ')}` : ""}
      {...props}
    >
      {getButtonText()}
    </button>
  );
};

export default SecureButton;