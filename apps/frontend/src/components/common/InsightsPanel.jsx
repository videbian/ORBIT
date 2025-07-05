import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const InsightsPanel = ({ documentId, onInsightsGenerated }) => {
  const { authenticatedFetch } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('pending');

  // Carregar insights existentes
  useEffect(() => {
    if (documentId) {
      loadInsights();
    }
  }, [documentId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch(`/api/documents/${documentId}/insights`);
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
        setStatus(data.insights_status || 'pending');
      } else {
        throw new Error('Erro ao carregar insights');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatus('generating');

      const response = await authenticatedFetch(
        `/api/documents/${documentId}/generate-insights`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
        setStatus('complete');
        
        if (onInsightsGenerated) {
          onInsightsGenerated(data.insights);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao gerar insights');
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getAttentionLevelColor = (level) => {
    switch (level) {
      case 'alto':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medio':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixo':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAttentionIcon = (level) => {
    switch (level) {
      case 'alto':
        return '🚨';
      case 'medio':
        return '⚠️';
      case 'baixo':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  if (loading && status !== 'generating') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          🧠 <span className="ml-2">Resumo Inteligente da IA</span>
        </h3>
        
        {status === 'pending' && (
          <button
            onClick={generateInsights}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando...' : 'Gerar Insights'}
          </button>
        )}
        
        {status === 'error' && (
          <button
            onClick={generateInsights}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Tentando...' : 'Tentar Novamente'}
          </button>
        )}
      </div>

      {/* Status de geração */}
      {status === 'generating' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-800">⏳ Gerando análise com IA...</span>
          </div>
          <p className="text-blue-600 text-sm mt-2">
            Nossa IA está analisando o documento e gerando insights estratégicos. Isso pode levar alguns segundos.
          </p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <span className="text-red-600">❌</span>
            <span className="ml-3 text-red-800">Não foi possível gerar o resumo</span>
          </div>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      )}

      {/* Insights gerados */}
      {insights && status === 'complete' && (
        <div className="space-y-6">
          {/* Nível de atenção */}
          {insights.nivel_atencao && (
            <div className={`rounded-lg p-4 border ${getAttentionLevelColor(insights.nivel_atencao)}`}>
              <div className="flex items-center">
                <span className="text-xl">{getAttentionIcon(insights.nivel_atencao)}</span>
                <span className="ml-2 font-medium">
                  Nível de Atenção: {insights.nivel_atencao.charAt(0).toUpperCase() + insights.nivel_atencao.slice(1)}
                </span>
              </div>
              {insights.prazo_sugerido && (
                <p className="text-sm mt-1">
                  Prazo sugerido: <strong>{insights.prazo_sugerido}</strong>
                </p>
              )}
            </div>
          )}

          {/* Resumo */}
          {insights.resumo && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📄 Resumo Executivo</h4>
              <p className="text-gray-700 leading-relaxed">{insights.resumo}</p>
            </div>
          )}

          {/* Pontos principais */}
          {insights.pontos_principais && insights.pontos_principais.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 Pontos Principais</h4>
              <ul className="space-y-2">
                {insights.pontos_principais.map((ponto, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Riscos identificados */}
          {insights.riscos_identificados && insights.riscos_identificados.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">⚠️ Riscos Identificados</h4>
              <ul className="space-y-2">
                {insights.riscos_identificados.map((risco, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span className="text-gray-700">{risco}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          {insights.recomendacoes && insights.recomendacoes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">💡 Recomendações</h4>
              <ul className="space-y-2">
                {insights.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">{recomendacao}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Próximos passos */}
          {insights.proximos_passos && insights.proximos_passos.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚀 Próximos Passos</h4>
              <ul className="space-y-2">
                {insights.proximos_passos.map((passo, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-600 mr-2">{index + 1}.</span>
                    <span className="text-gray-700">{passo}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Observações */}
          {insights.observacoes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📝 Observações</h4>
              <p className="text-gray-700 leading-relaxed">{insights.observacoes}</p>
            </div>
          )}

          {/* Metadados */}
          <div className="border-t pt-4 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>
                Gerado por: {insights.modelo_usado || 'IA ORBIT'}
              </span>
              <span>
                {insights.gerado_em && new Date(insights.gerado_em).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Estado inicial */}
      {status === 'pending' && !insights && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🧠</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Insights Inteligentes Disponíveis
          </h4>
          <p className="text-gray-600 mb-4">
            Nossa IA pode analisar este documento e gerar resumos, identificar riscos e sugerir ações estratégicas.
          </p>
          <button
            onClick={generateInsights}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🚀 Gerar Análise Inteligente
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;

