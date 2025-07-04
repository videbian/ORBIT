import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PrivateRoute from '../components/PrivateRoute';

const ClientDashboard = () => {
  const { authenticatedFetch } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch('http://localhost:8001/api/client/dashboard');
        const result = await response.json();
        setDashboardData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authenticatedFetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <PrivateRoute requiredRole="client">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header da página */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
              <p className="mt-2 text-gray-600">Acompanhe o progresso dos seus projetos e tarefas na plataforma ORBIT IA</p>
            </div>
          </div>

          {error && (
            <div className="mx-4 mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Cards de estatísticas */}
          <div className="px-4 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Projetos Ativos</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData?.data?.active_projects || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tarefas Pendentes</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData?.data?.pending_tasks || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tarefas Concluídas</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData?.data?.completed_tasks || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Próxima Reunião</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardData?.data?.next_meeting ? 
                            new Date(dashboardData.data.next_meeting).toLocaleDateString('pt-BR') : 'N/A'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de projetos recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projetos em andamento */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Projetos em Andamento</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Seus projetos ativos na plataforma</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-4 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Análise de Dados IA</h4>
                        <p className="text-sm text-gray-600">Processamento de dados com machine learning</p>
                        <div className="mt-2">
                          <div className="bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">75% concluído</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Em progresso
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Automação de Processos</h4>
                        <p className="text-sm text-gray-600">Implementação de workflows automatizados</p>
                        <div className="mt-2">
                          <div className="bg-yellow-200 rounded-full h-2">
                            <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">45% concluído</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Planejamento
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Dashboard Analytics</h4>
                        <p className="text-sm text-gray-600">Criação de painéis de controle personalizados</p>
                        <div className="mt-2">
                          <div className="bg-green-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">90% concluído</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Finalizando
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Atividades recentes */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Atividades Recentes</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Últimas atualizações dos seus projetos</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Tarefa concluída:</span> Configuração do ambiente de desenvolvimento
                        </p>
                        <p className="text-xs text-gray-500">2 horas atrás</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Novo comentário:</span> Equipe adicionou feedback no projeto Analytics
                        </p>
                        <p className="text-xs text-gray-500">5 horas atrás</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Reunião agendada:</span> Review do projeto Automação de Processos
                        </p>
                        <p className="text-xs text-gray-500">1 dia atrás</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Documento atualizado:</span> Especificações técnicas do projeto IA
                        </p>
                        <p className="text-xs text-gray-500">2 dias atrás</p>
                      </div>
                    </div>
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

export default ClientDashboard;

