import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ 
  children, 
  requiredRole = null, 
  requiredRoles = null,
  fallback = null 
}) => {
  const { user, loading, isAuthenticated, hasRole, hasAnyRole } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar mensagem de login
  if (!isAuthenticated()) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para acessar esta página.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se tem o perfil necessário (um perfil específico)
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-2">
              Você não tem permissão para acessar esta página.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Perfil necessário: <span className="font-semibold">{requiredRole}</span><br />
              Seu perfil: <span className="font-semibold">{user?.role}</span>
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se tem um dos perfis permitidos (múltiplos perfis)
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-2">
              Você não tem permissão para acessar esta página.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Perfis permitidos: <span className="font-semibold">{requiredRoles.join(', ')}</span><br />
              Seu perfil: <span className="font-semibold">{user?.role}</span>
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se passou por todas as verificações, renderizar o conteúdo
  return children;
};

export default PrivateRoute;

