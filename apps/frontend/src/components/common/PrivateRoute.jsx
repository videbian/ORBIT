import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    return null;
  }

  // Se há roles específicos permitidos, verificar se o usuário tem permissão
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Seu perfil: <span className="font-medium">{user?.role}</span>
          </p>
          <button
            onClick={() => {
              // Redirecionar para o dashboard apropriado baseado no role
              const dashboardRoutes = {
                admin: '/admin',
                client: '/cliente',
                partner: '/parceiro',
                backoffice: '/backoffice'
              };
              window.location.href = dashboardRoutes[user?.role] || '/dashboard';
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ir para meu dashboard
          </button>
        </div>
      </div>
    );
  }

  // Se passou por todas as verificações, renderizar o componente
  return children;
};

export default PrivateRoute;

