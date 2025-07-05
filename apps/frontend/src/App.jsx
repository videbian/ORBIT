import React, { useEffect, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import BackofficeDashboard from './pages/BackofficeDashboard';

// Componente de roteamento simples
const Router = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ORBIT IA...</p>
        </div>
      </div>
    );
  }

  // Roteamento baseado no caminho atual
  switch (currentPath) {
    case '/login':
      return <Login />;
    
    case '/register':
      return <Register />;
    
    case '/admin':
      return <AdminDashboard />;
    
    case '/cliente':
      return <ClientDashboard />;
    
    case '/parceiro':
      return <PartnerDashboard />;
    
    case '/backoffice':
      return <BackofficeDashboard />;
    
    case '/dashboard':
      return <Dashboard />;
    
    case '/profile':
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Meu Perfil</h1>
            <p className="text-gray-600 mb-4">Página de perfil em desenvolvimento</p>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Voltar ao Dashboard</a>
          </div>
        </div>
      );
    
    case '/settings':
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Configurações</h1>
            <p className="text-gray-600 mb-4">Página de configurações em desenvolvimento</p>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Voltar ao Dashboard</a>
          </div>
        </div>
      );
    
    case '/help':
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ajuda</h1>
            <p className="text-gray-600 mb-4">Documentação e suporte em desenvolvimento</p>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Voltar ao Dashboard</a>
          </div>
        </div>
      );
    
    case '/':
    default:
      // Se não estiver autenticado, redirecionar para login
      if (!isAuthenticated()) {
        window.location.href = '/login';
        return null;
      }
      // Se estiver autenticado, redirecionar para dashboard
      window.location.href = '/dashboard';
      return null;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;

