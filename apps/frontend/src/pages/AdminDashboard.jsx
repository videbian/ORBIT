import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PrivateRoute from '../components/PrivateRoute';

const AdminDashboard = () => {
  const { authenticatedFetch } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do dashboard
        const dashboardResponse = await authenticatedFetch('http://localhost:8001/api/admin/dashboard');
        const dashboardResult = await dashboardResponse.json();
        setDashboardData(dashboardResult);

        // Buscar lista de usuários
        const usersResponse = await authenticatedFetch('http://localhost:8001/api/users/list');
        const usersResult = await usersResponse.json();
        setUsers(usersResult.users);

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
    <PrivateRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header da página */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="mt-2 text-gray-600">Gerencie usuários, monitore o sistema e configure a plataforma ORBIT IA</p>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData?.data?.total_users || 0}</dd>
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
                        <dt className="text-sm font-medium text-gray-500 truncate">Sessões Ativas</dt>
                        <dd className="text-lg font-medium text-gray-900">{dashboardData?.data?.active_sessions || 0}</dd>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Status do Sistema</dt>
                        <dd className="text-lg font-medium text-gray-900 capitalize">{dashboardData?.data?.system_status || 'N/A'}</dd>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Último Backup</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardData?.data?.last_backup ? 
                            new Date(dashboardData.data.last_backup).toLocaleDateString('pt-BR') : 'N/A'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de usuários */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Usuários do Sistema</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista de todos os usuários cadastrados na plataforma</p>
              </div>
              <ul className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <li key={index}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'client' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'partner' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' :
                             user.role === 'client' ? 'Cliente' :
                             user.role === 'partner' ? 'Parceiro' : 'Backoffice'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;

