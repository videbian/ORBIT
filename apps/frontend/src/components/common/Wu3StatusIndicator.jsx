import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Wu3StatusIndicator = () => {
  const { authenticatedFetch } = useAuth();
  const [wu3Status, setWu3Status] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWu3Status();
  }, []);

  const fetchWu3Status = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:8000/api/wu3/status');
      
      if (response.ok) {
        const data = await response.json();
        setWu3Status(data);
      }
    } catch (error) {
      console.error('Erro ao verificar status Wu3:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        <span>Verificando Wu3...</span>
      </div>
    );
  }

  if (!wu3Status) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-600">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Erro ao verificar Wu3</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (wu3Status.wu3_configured) {
      return (
        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getStatusText = () => {
    if (wu3Status.wu3_configured) {
      return 'IA Wu3 Conectada';
    } else {
      return 'Modo Fallback (Mock)';
    }
  };

  const getStatusColor = () => {
    if (wu3Status.wu3_configured) {
      return 'text-green-600';
    } else {
      return 'text-yellow-600';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {getStatusIcon()}
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
      
      {/* Tooltip com detalhes */}
      <div className="relative group">
        <svg className="h-4 w-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          <div className="space-y-1">
            <div>Status: {wu3Status.message}</div>
            <div>API Key: {wu3Status.has_api_key ? 'Configurada' : 'Não configurada'}</div>
            <div>Timeout: {wu3Status.timeout}s</div>
            <div>Tentativas: {wu3Status.max_retries}</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default Wu3StatusIndicator;

