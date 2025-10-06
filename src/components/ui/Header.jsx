import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from './RoleBasedNavigation';

const Header = ({ isAuthenticated = false, userRole = null, userName = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    { 
      label: 'Meu Painel', 
      path: '/citizen-dashboard', 
      icon: 'LayoutDashboard',
      roles: ['citizen', 'entity', 'manager', 'admin']
    },
    { 
      label: 'Enviar Proposta', 
      path: '/proposal-submission', 
      icon: 'FileText',
      roles: ['citizen', 'entity']
    },
    { 
      label: 'Votação', 
      path: '/proposal-voting', 
      icon: 'Vote',
      roles: ['citizen', 'entity', 'manager']
    },
    { 
      label: 'Configurações', 
      path: '/admin-configuration', 
      icon: 'Settings',
      roles: ['admin', 'manager']
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    !userRole || item?.roles?.includes(userRole)
  );

  const visibleNavItems = filteredNavItems?.slice(0, 4);
  const overflowNavItems = filteredNavItems?.slice(4);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event?.target?.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    try {
      // Call the logout function from auth context
      logout();
      setIsUserMenuOpen(false);
      // Redirect to login page
      navigate('/login');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      citizen: 'Cidadão',
      entity: 'Entidade',
      manager: 'Gestor',
      admin: 'Administrador'
    };
    return roleNames?.[role] || role;
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/citizen-dashboard' : '/'} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-heading font-semibold text-text-primary">
                  Orçamento Participativo
                </h1>
                <p className="text-xs font-caption text-text-secondary -mt-1">
                  Plataforma Municipal
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {visibleNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-accent'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              {overflowNavItems?.length > 0 && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreHorizontal"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    Mais
                  </Button>
                </div>
              )}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/user-registration">
                  <Button variant="outline" size="sm">
                    Cadastrar
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="default" size="sm">
                    Entrar
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-smooth"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-text-primary">
                        {userName || 'Usuário'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {getRoleDisplayName(userRole)}
                      </p>
                    </div>
                    <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevated z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-popover-foreground">
                            {userName || 'Usuário'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getRoleDisplayName(userRole)}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-smooth"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon name="User" size={16} />
                          <span>Minha Conta</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-smooth"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon name="Settings" size={16} />
                          <span>Configurações</span>
                        </Link>
                        <div className="border-t border-border">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-smooth"
                          >
                            <Icon name="LogOut" size={16} />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-accent transition-smooth"
                >
                  <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <nav className="px-4 py-2 space-y-1">
              {filteredNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-accent'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;