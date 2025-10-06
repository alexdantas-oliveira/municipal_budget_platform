import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Authentication Context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  userRole: null,
  login: () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
    // In real app, this would check localStorage, cookies, or make API call
    const checkAuthStatus = async () => {
      try {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          setIsAuthenticated(true);
          setUser(authData?.user);
          setUserRole(authData?.role);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData, role) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(role);
    
    // Save to localStorage
    localStorage.setItem('auth', JSON.stringify({
      user: userData,
      role: role,
      timestamp: Date.now()
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('auth');
  };

  const value = {
    isAuthenticated,
    user,
    userRole,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Route Protection Component
export const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length > 0 && !allowedRoles?.includes(userRole)) {
    return <Navigate to="/citizen-dashboard" replace />;
  }

  return children;
};

// Role-based Navigation Hook
export const useRoleBasedNavigation = () => {
  const { userRole, isAuthenticated } = useAuth();

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];

    const allNavItems = [
      {
        label: 'Meu Painel',
        path: '/citizen-dashboard',
        icon: 'LayoutDashboard',
        roles: ['citizen', 'entity'],
        description: 'Visão geral das suas atividades'
      },
      {
        label: 'Análise Gerencial',
        path: '/manager-analysis',
        icon: 'BarChart3',
        roles: ['gestor', 'admin'],
        description: 'Análise e avaliação de propostas'
      },
      {
        label: 'Enviar Proposta',
        path: '/proposal-submission',
        icon: 'FileText',
        roles: ['citizen', 'entity'],
        description: 'Submeta uma nova proposta'
      },
      {
        label: 'Votação',
        path: '/proposal-voting',
        icon: 'Vote',
        roles: ['citizen', 'entity', 'gestor'],
        description: 'Vote nas propostas disponíveis'
      },
      {
        label: 'Acompanhamento',
        path: '/manager-tracking-dashboard',
        icon: 'Activity',
        roles: ['gestor', 'admin'],
        description: 'Atualizar execução de propostas'
      },
      {
        label: 'Configurações',
        path: '/admin-configuration',
        icon: 'Settings',
        roles: ['admin'],
        description: 'Configurações do sistema'
      }
    ];

    return allNavItems?.filter(item => item?.roles?.includes(userRole));
  };

  const canAccessRoute = (routePath, requiredRoles = []) => {
    if (!isAuthenticated) return false;
    if (requiredRoles?.length === 0) return true;
    return requiredRoles?.includes(userRole);
  };

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    
    switch (userRole) {
      case 'admin': 
        return '/admin-configuration';
      case 'gestor': case'manager': // Fallback for consistency
        return '/manager-analysis';
      case 'citizen': case'entity':
      default:
        return '/citizen-dashboard';
    }
  };

  return {
    navigationItems: getNavigationItems(),
    canAccessRoute,
    getDefaultRoute,
    userRole,
    isAuthenticated
  };
};

// Navigation Permission Component
export const NavigationGuard = ({ children, requiredRoles = [], fallback = null }) => {
  const { canAccessRoute } = useRoleBasedNavigation();
  const location = useLocation();

  if (!canAccessRoute(location?.pathname, requiredRoles)) {
    return fallback || <Navigate to="/citizen-dashboard" replace />;
  }

  return children;
};

export default AuthProvider;