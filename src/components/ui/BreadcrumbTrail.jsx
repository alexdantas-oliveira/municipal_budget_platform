import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = ({ customBreadcrumbs = null, userRole = null }) => {
  const location = useLocation();
  
  const routeLabels = {
    '/': 'Início',
    '/login': 'Entrar',
    '/user-registration': 'Cadastro',
    '/citizen-dashboard': 'Meu Painel',
    '/proposal-submission': 'Enviar Proposta',
    '/proposal-voting': 'Votação',
    '/admin-configuration': 'Configurações do Sistema',
    '/profile': 'Minha Conta',
    '/settings': 'Configurações'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Início', path: '/' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on login/registration pages
  if (['/login', '/user-registration', '/']?.includes(location?.pathname)) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="mx-2 text-muted-foreground" 
              />
            )}
            {crumb?.isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="hover:text-primary transition-smooth"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;