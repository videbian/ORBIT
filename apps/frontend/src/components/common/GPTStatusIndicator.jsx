import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GPTStatusIndicator = () => {
  const { authenticatedFetch } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGPTStatus();
  }, []);

  const checkGPTStatus = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/gpt/status');
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.gpt_status);
      }
    } catch (error) {
      console.error('Erro ao verificar status GPT:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>
        <span>Verificando IA...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
        <span>Status IA indisponível</span>
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (status.enabled && status.api_key_configured) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: '🤖',
        text: 'IA GPT-4 Ativa',
        description: `Modelo: ${status.model}`
      };
    } else if (status.enabled && !status.api_key_configured) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: '⚙️',
        text: 'IA em Modo Fallback',
        description: 'API key não configurada'
      };
    } else {
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: '🔒',
        text: 'IA Desabilitada',
        description: 'Insights não disponíveis'
      };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusDisplay.bgColor} ${statusDisplay.color}`}>
      <span className="mr-2">{statusDisplay.icon}</span>
      <div className="flex flex-col">
        <span className="font-medium">{statusDisplay.text}</span>
        <span className="text-xs opacity-75">{statusDisplay.description}</span>
      </div>
    </div>
  );
};

export default GPTStatusIndicator;

