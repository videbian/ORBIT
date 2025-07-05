import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirecionar automaticamente para o dashboard específico do usuário
      const dashboardRoutes = {
        admin: '/admin',
        client: '/cliente',
        partner: '/parceiro',
        backoffice: '/backoffice'
      };
      
      const targetRoute = dashboardRoutes[user.role];
      if (targetRoute) {
        window.location.href = targetRoute;
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Dashboard;

