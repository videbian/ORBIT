import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import StatsCard from '../components/common/StatsCard';
import ActionCard from '../components/common/ActionCard';
import DocumentUpload from '../components/common/DocumentUpload';
import DocumentList from '../components/common/DocumentList';
import { useAuth } from '../contexts/AuthContext';

const ClientDashboard = () => {
  const { user, authenticatedFetch } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [documentStats, setDocumentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do dashboard
        const dashboardResponse = await authenticatedFetch('http://localhost:8000/api/client/dashboard');
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setDashboardData(dashboardData);
        }
        
        // Buscar estatísticas de documentos
        const statsResponse = await authenticatedFetch('http://localhost:8000/api/documents/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setDocumentStats(statsData);
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshTrigger]);

  const handleUploadSuccess = (result) => {
    setShowUpload(false);
    setRefreshTrigger(prev => prev + 1);
    
    // Feedback mais detalhado
    const message = `✅ Documento processado com sucesso!\n\n` +
      `📊 Confiança: ${result.confidence_percentage}%\n` +
      `⏱️ Tempo: ${result.processing_time}s\n` +
      `🤖 Status: ${result.status === 'success' ? 'Concluído' : result.status}`;
    
    alert(message);
  };

  const handleUploadError = (error) => {
    // Feedback de erro mais amigável
    const message = `❌ Erro no processamento do documento:\n\n${error}\n\n` +
      `💡 Dicas:\n` +
      `• Verifique se o arquivo não está corrompido\n` +
      `• Certifique-se de que o tipo é suportado (PDF, JPG, PNG, DOCX)\n` +
      `• Tente novamente em alguns minutos`;
    
    alert(message);
  };

  if (loading) {
    return (
      <DashboardLayout title="Painel do Cliente" subtitle="Carregando dados...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Painel do Cliente" 
      subtitle={`Bem-vindo, ${user?.name}`}
    >
      {/* Bem-vindo e Status */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name}!</h2>
            <p className="text-blue-100">
              Acompanhe seus projetos e análises de documentos corporativos
            </p>
          </div>
          <div className="hidden md:block">
            <svg className="h-16 w-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Estatísticas do Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Documentos Processados"
          value={documentStats?.total_documents || '0'}
          subtitle="Total"
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Processados Hoje"
          value={documentStats?.today_documents || '0'}
          subtitle="Hoje"
          color="green"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Concluídos"
          value={documentStats?.by_status?.complete || '0'}
          subtitle="Processamento finalizado"
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Upload de Documentos"
            description="Enviar novos documentos para análise com IA Wu3"
            color="blue"
            buttonText="Fazer Upload"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
            onClick={() => setShowUpload(!showUpload)}
          />
          
          <ActionCard
            title="Novo Projeto"
            description="Criar um novo projeto de análise de documentos corporativos"
            color="green"
            buttonText="Criar Projeto"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
          
          <ActionCard
            title="Relatórios"
            description="Visualizar relatórios e insights dos seus documentos"
            color="purple"
            buttonText="Ver Relatórios"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
        </div>
      </div>

      {/* Upload de Documentos */}
      {showUpload && (
        <div className="mb-8">
          <DocumentUpload 
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>
      )}

      {/* Lista de Documentos */}
      <div className="mb-8">
        <DocumentList refreshTrigger={refreshTrigger} />
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;

