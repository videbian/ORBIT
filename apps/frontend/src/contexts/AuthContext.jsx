import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro no login');
      }

      const data = await response.json();
      
      // Armazenar token no localStorage
      localStorage.setItem('orbit_token', data.token);
      localStorage.setItem('orbit_user', JSON.stringify(data.user));
      
      // Atualizar estado
      setToken(data.token);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('orbit_token');
    localStorage.removeItem('orbit_user');
    setToken(null);
    setUser(null);
  };

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Função para verificar se o usuário tem um perfil específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Função para verificar se o usuário tem um dos perfis permitidos
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Função para buscar perfil do usuário
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch('http://localhost:8001/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token inválido ou expirado');
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      // Se o token for inválido, fazer logout
      logout();
      throw error;
    }
  };

  // Função para fazer requisições autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...options, ...defaultOptions });

    if (response.status === 401) {
      // Token expirado ou inválido
      logout();
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    return response;
  };

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('orbit_token');
        const storedUser = localStorage.getItem('orbit_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          
          // Verificar se o token ainda é válido
          try {
            await fetchUserProfile(storedToken);
          } catch (error) {
            // Token inválido, limpar dados
            localStorage.removeItem('orbit_token');
            localStorage.removeItem('orbit_user');
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Valor do contexto
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    fetchUserProfile,
    authenticatedFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

