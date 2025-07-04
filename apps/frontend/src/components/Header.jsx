import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      client: 'Cliente',
      partner: 'Parceiro',
      backoffice: 'Backoffice'
    };
    return roleNames[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      client: 'bg-blue-100 text-blue-800',
      partner: 'bg-green-100 text-green-800',
      backoffice: 'bg-purple-100 text-purple-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">ORBIT IA</h1>
            </div>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Dashboard
            </a>
            {user?.role === 'admin' && (
              <a
                href="/admin"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Administração
              </a>
            )}
            {user?.role === 'client' && (
              <a
                href="/cliente"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Meus Projetos
              </a>
            )}
            {user?.role === 'partner' && (
              <a
                href="/parceiro"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Portal Parceiro
              </a>
            )}
            {user?.role === 'backoffice' && (
              <a
                href="/backoffice"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Backoffice
              </a>
            )}
          </nav>

          {/* Menu do usuário */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                    {getRoleDisplayName(user?.role)}
                  </span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Meu Perfil
                  </div>
                </a>
                
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configurações
                  </div>
                </a>
                
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fechar dropdown ao clicar fora */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;

