import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './RoleBasedNavigation';
import { supabase } from '../../lib/supabase';

// ============================================
// FASE 2-6: ADVANCED RBAC COMPONENT
// ============================================

const AdvancedAuthGuard = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  requiredPermissions = [],
  redirectTo = '/login',
  fallbackComponent = null,
  logActivity = true,
  checkRateLimit = false,
  rateLimitAction = null,
  showAccessDenied = true
}) => {
  const { isAuthenticated, userRole, user, loading, logout } = useAuth();
  const location = useLocation();
  const [sessionValid, setSessionValid] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activityLogged, setActivityLogged] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  // Enhanced session validation
  const validateSession = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      // Check if session is still valid in database
      const { data: session } = await supabase?.from('user_sessions')?.select('expires_at, last_activity')?.eq('user_id', user?.id)?.single();

      if (!session || new Date(session.expires_at) < new Date()) {
        setSessionValid(false);
        logout();
        return;
      }

      // Update last activity
      await supabase?.from('user_sessions')?.update({ last_activity: new Date()?.toISOString() })?.eq('user_id', user?.id);

    } catch (error) {
      console.error('Session validation error:', error);
      setSessionValid(false);
    }
  }, [isAuthenticated, user?.id, logout]);

  // Rate limiting check
  const checkRateLimiting = useCallback(async () => {
    if (!checkRateLimit || !rateLimitAction || !user?.id) return true;

    try {
      const { data, error } = await supabase?.rpc('check_rate_limit', { 
          p_action_type: rateLimitAction,
          p_max_attempts: 10,
          p_window_minutes: 60
        });

      if (error) throw error;
      
      if (!data) {
        setRateLimitExceeded(true);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow on error
    }
  }, [checkRateLimit, rateLimitAction, user?.id]);

  // Activity logging
  const logUserActivity = useCallback(async () => {
    if (!logActivity || activityLogged || !user?.id) return;

    try {
      await supabase?.rpc('log_activity', {
          p_action: 'page_visit',
          p_resource_type: 'page',
          p_details: { 
            path: location?.pathname,
            timestamp: new Date()?.toISOString()
          }
        });
      
      setActivityLogged(true);
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }, [logActivity, activityLogged, user?.id, location?.pathname]);

  // Permission checking
  const hasRequiredPermissions = useCallback(() => {
    if (!requiredPermissions?.length) return true;
    if (!user?.permissions) return false;

    return requiredPermissions?.every(permission => 
      user?.permissions?.[permission] === true
    );
  }, [requiredPermissions, user?.permissions]);

  // Role-based access checking
  const hasAllowedRole = useCallback(() => {
    if (!allowedRoles?.length) return true;
    return allowedRoles?.includes(userRole);
  }, [allowedRoles, userRole]);

  // Security monitoring
  const reportSecurityViolation = useCallback(async (violationType) => {
    try {
      await supabase?.rpc('log_activity', {
          p_action: 'security_violation',
          p_resource_type: 'access_control',
          p_details: {
            violation_type: violationType,
            attempted_path: location?.pathname,
            user_role: userRole,
            allowed_roles: allowedRoles,
            required_permissions: requiredPermissions,
            timestamp: new Date()?.toISOString()
          }
        });
    } catch (error) {
      console.error('Security violation reporting error:', error);
    }
  }, [location?.pathname, userRole, allowedRoles, requiredPermissions]);

  // Main security checks
  useEffect(() => {
    if (!loading) {
      validateSession();
      logUserActivity();
      
      if (isAuthenticated) {
        checkRateLimiting();
      }
    }
  }, [loading, validateSession, logUserActivity, checkRateLimiting, isAuthenticated]);

  // Access control logic
  useEffect(() => {
    if (loading || !requireAuth) return;

    if (!isAuthenticated) {
      reportSecurityViolation('unauthenticated_access');
      return;
    }

    if (!hasAllowedRole()) {
      setAccessDenied(true);
      reportSecurityViolation('insufficient_role');
      return;
    }

    if (!hasRequiredPermissions()) {
      setAccessDenied(true);
      reportSecurityViolation('insufficient_permissions');
      return;
    }

    setAccessDenied(false);
  }, [
    loading, requireAuth, isAuthenticated, 
    hasAllowedRole, hasRequiredPermissions, reportSecurityViolation
  ]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Session invalid
  if (!sessionValid) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location, 
          message: 'Sua sessão expirou. Por favor, faça login novamente.' 
        }} 
        replace 
      />
    );
  }

  // Rate limit exceeded
  if (rateLimitExceeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Limite de Tentativas Excedido
            </h2>
            <p className="text-red-600 mb-4">
              Você excedeu o limite de tentativas para esta ação. 
              Tente novamente em alguns minutos.
            </p>
            <button
              onClick={() => window.history?.back()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication required but user not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Access denied
  if (accessDenied && showAccessDenied) {
    return fallbackComponent || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Acesso Negado
            </h2>
            <p className="text-yellow-600 mb-4">
              Você não tem permissão para acessar esta área do sistema.
            </p>
            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Seu papel:</strong> {userRole || 'Não definido'}</p>
              {allowedRoles?.length > 0 && (
                <p><strong>Papéis necessários:</strong> {allowedRoles?.join(', ')}</p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => window.history?.back()}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  const dashboardRoute = getDashboardForRole(userRole);
                  window.location.href = dashboardRoute;
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ir para Meu Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to appropriate dashboard if accessing auth pages while authenticated
  if (!requireAuth && isAuthenticated && ['/login', '/user-registration']?.includes(location?.pathname)) {
    const dashboardRoute = getDashboardForRole(userRole);
    return <Navigate to={dashboardRoute} replace />;
  }

  // Access granted
  return children;
};

// Helper function to get dashboard route for role
const getDashboardForRole = (role) => {
  switch (role) {
    case 'admin': 
      return '/admin-configuration';
    case 'gestor': 
    case 'manager': // Fallback for consistency
      return '/manager-analysis';
    case 'citizen': 
    case 'entity':
    default:
      return '/citizen-dashboard';
  }
};

// Higher-Order Component for advanced route protection
export const withAdvancedAuthGuard = (Component, options = {}) => {
  return function AdvancedAuthGuardedComponent(props) {
    return (
      <AdvancedAuthGuard {...options}>
        <Component {...props} />
      </AdvancedAuthGuard>
    );
  };
};

// Hook for component-level permission checking
export const usePermissions = () => {
  const { user, userRole, isAuthenticated } = useAuth();
  
  const checkPermission = useCallback((permission) => {
    if (!isAuthenticated || !user?.permissions) return false;
    return user?.permissions?.[permission] === true;
  }, [isAuthenticated, user?.permissions]);

  const checkRole = useCallback((role) => {
    return userRole === role;
  }, [userRole]);

  const checkAnyRole = useCallback((roles) => {
    return roles?.includes(userRole);
  }, [userRole]);

  const hasAccess = useCallback((requiredRoles = [], requiredPermissions = []) => {
    const hasRole = requiredRoles?.length === 0 || requiredRoles?.includes(userRole);
    const hasPermission = requiredPermissions?.length === 0 || 
      requiredPermissions?.every(permission => checkPermission(permission));
    
    return hasRole && hasPermission;
  }, [userRole, checkPermission]);

  const logSecurityEvent = useCallback(async (eventType, details = {}) => {
    try {
      await supabase?.rpc('log_activity', {
        p_action: eventType,
        p_resource_type: 'security',
        p_details: {
          ...details,
          timestamp: new Date()?.toISOString(),
          user_role: userRole
        }
      });
    } catch (error) {
      console.error('Security event logging failed:', error);
    }
  }, [userRole]);

  return {
    checkPermission,
    checkRole,
    checkAnyRole,
    hasAccess,
    logSecurityEvent,
    userRole,
    isAuthenticated
  };
};

export default AdvancedAuthGuard;