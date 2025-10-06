import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './RoleBasedNavigation';

const AuthenticationGuard = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  redirectTo = '/login',
  fallbackComponent = null 
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Check for session expiration
    const checkSession = () => {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const { timestamp } = JSON.parse(authData);
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
          const isExpired = Date.now() - timestamp > sessionDuration;
          
          if (isExpired) {
            setSessionExpired(true);
            localStorage.removeItem('auth');
          }
        } catch (error) {
          console.error('Error checking session:', error);
          localStorage.removeItem('auth');
        }
      }
    };

    if (isAuthenticated) {
      checkSession();
      // Check session every 5 minutes
      const interval = setInterval(checkSession, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Handle session expiration
  if (sessionExpired) {
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

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (isAuthenticated && allowedRoles?.length > 0 && !allowedRoles?.includes(userRole)) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    // Redirect to appropriate dashboard based on role
    const getDefaultDashboard = (role) => {
      switch (role) {
        case 'admin': 
        case 'manager':
          return '/admin-configuration';
        case 'citizen': 
        case 'entity':
        default:
          return '/citizen-dashboard';
      }
    };

    return <Navigate to={getDefaultDashboard(userRole)} replace />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && isAuthenticated && ['/login', '/user-registration']?.includes(location?.pathname)) {
    const getDefaultDashboard = (role) => {
      switch (role) {
        case 'admin': 
        case 'manager':
          return '/admin-configuration';
        case 'citizen': 
        case 'entity':
        default:
          return '/citizen-dashboard';
      }
    };

    return <Navigate to={getDefaultDashboard(userRole)} replace />;
  }

  return children;
};

// Higher-Order Component for route protection
export const withAuthGuard = (Component, options = {}) => {
  return function AuthGuardedComponent(props) {
    return (
      <AuthenticationGuard {...options}>
        <Component {...props} />
      </AuthenticationGuard>
    );
  };
};

// Hook for checking authentication status in components
export const useAuthGuard = () => {
  const { isAuthenticated, userRole, user, logout } = useAuth();
  
  const checkPermission = (requiredRoles = []) => {
    if (!isAuthenticated) return false;
    if (requiredRoles?.length === 0) return true;
    return requiredRoles?.includes(userRole);
  };

  const requireAuth = (callback, requiredRoles = []) => {
    if (!isAuthenticated) {
      // Could trigger a login modal or redirect
      return false;
    }
    
    if (requiredRoles?.length > 0 && !requiredRoles?.includes(userRole)) {
      // Could show unauthorized message
      return false;
    }
    
    callback();
    return true;
  };

  const handleSessionExpiry = () => {
    logout();
    window.location.href = '/login?expired=true';
  };

  return {
    isAuthenticated,
    userRole,
    user,
    checkPermission,
    requireAuth,
    handleSessionExpiry
  };
};

export default AuthenticationGuard;