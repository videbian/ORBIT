import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PrivateRoute from '../components/PrivateRoute';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardLink = (role) => {
    const links = {
      admin: '/admin',
      client: '/cliente',
      partner: '/parceiro',
      backoffice: '/backoffice'
    };
    return links[role] || '/dashboard';
  };

  const getRoleDisplayName = (role) => {
    const names = {
      admin: 'Administrador',
      client: 'Cliente',
      partner: 'Parceiro',
      backoffice: 'Backoffice'
    };
    return names[role] || role;
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bem-vindo ao ORBIT IA, {user?.name}!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Você está logado como <span className="font-semibold">{getRoleDisplayName(user?.role)}</span>
              </p>

              <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Acesso Rápido</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={getDashboardLink(user?.role)}
                    className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 text-left">
                        <h3 className="text-lg font-medium text-gray-900">Meu Painel</h3>
                        <p className="text-sm text-gray-600">Acesse seu dashboard personalizado</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/profile"
                    className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 text-left">
                        <h3 className="text-lg font-medium text-gray-900">Meu Perfil</h3>
                        <p className="text-sm text-gray-600">Visualizar e editar informações</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/settings"
                    className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 text-left">
                        <h3 className="text-lg font-medium text-gray-900">Configurações</h3>
                        <p className="text-sm text-gray-600">Personalizar preferências</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="/help"
                    className="block p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 text-left">
                        <h3 className="text-lg font-medium text-gray-900">Ajuda</h3>
                        <p className="text-sm text-gray-600">Documentação e suporte</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Informações do usuário */}
              <div className="mt-8 bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Conta</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Perfil:</span>
                    <span className="text-gray-900">{getRoleDisplayName(user?.role)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Membro desde:</span>
                    <span className="text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;

