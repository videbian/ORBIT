import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import StatsCard from '../components/common/StatsCard';
import ActionCard from '../components/common/ActionCard';
import { useAuth } from '../contexts/AuthContext';

const BackofficeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock data baseado nas funcionalidades de backoffice
  const mockData = {
    stats: {
      pending_approvals: 8,
      processed_today: 23,
      active_tickets: 5,
      system_health: '98.5%'
    },
    pending_items: [
      {
        id: 'REQ-001',
        type: 'Aprovação de Cliente',
        client: 'Digital Offshore',
        priority: 'Alta',
        date: '2024-07-04',
        status: 'Pendente'
      },
      {
        id: 'REQ-002',
        type: 'Validação de Documento',
        client: 'BTS Vault',
        priority: 'Média',
        date: '2024-07-04',
        status: 'Em Análise'
      },
      {
        id: 'REQ-003',
        type: 'Configuração de Sistema',
        client: 'Omega Cia',
        priority: 'Baixa',
        date: '2024-07-03',
        status: 'Pendente'
      }
    ],
    recent_activity: [
      {
        action: 'Cliente aprovado: Digital Offshore',
        user: 'Sistema',
        time: '10:30'
      },
      {
        action: 'Documento validado: Contrato BTS',
        user: 'Ana Silva',
        time: '09:45'
      },
      {
        action: 'Ticket resolvido: #TK-2024-156',
        user: 'João Santos',
        time: '09:15'
      },
      {
        action: 'Backup automático concluído',
        user: 'Sistema',
        time: '08:00'
      }
    ]
  };

  return (
    <DashboardLayout 
      title="Painel de Backoffice" 
      subtitle={`Operações e suporte - ${user?.name}`}
    >
      {/* Header com informações do backoffice */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Painel de Backoffice</h2>
            <p className="text-orange-100">
              Gerencie operações, aprovações e suporte ao sistema
            </p>
          </div>
          <div className="hidden md:block">
            <svg className="h-16 w-16 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>
      </div>

      {/* Estatísticas do Backoffice */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Aprovações Pendentes"
          value={mockData.stats.pending_approvals}
          subtitle="Aguardando ação"
          color="orange"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Processados Hoje"
          value={mockData.stats.processed_today}
          subtitle="Itens concluídos"
          color="green"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Tickets Ativos"
          value={mockData.stats.active_tickets}
          subtitle="Suporte em andamento"
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Saúde do Sistema"
          value={mockData.stats.system_health}
          subtitle="Uptime"
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            title="Aprovar Clientes"
            description="Revisar e aprovar novos cadastros de clientes"
            color="orange"
            buttonText="Revisar"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
          
          <ActionCard
            title="Validar Documentos"
            description="Verificar e validar documentos enviados"
            color="blue"
            buttonText="Validar"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
          
          <ActionCard
            title="Suporte Técnico"
            description="Gerenciar tickets de suporte dos usuários"
            color="green"
            buttonText="Ver Tickets"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
          
          <ActionCard
            title="Monitoramento"
            description="Acompanhar métricas e logs do sistema"
            color="purple"
            buttonText="Monitorar"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
        </div>
      </div>

      {/* Itens Pendentes e Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Itens Pendentes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Itens Pendentes</h2>
            <p className="text-sm text-gray-500">Requer sua atenção</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.pending_items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.type}</div>
                        <div className="text-sm text-gray-500">{item.client} • {item.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                        item.priority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Pendente' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <button className="text-sm text-orange-600 hover:text-orange-900 font-medium">
              Ver todos os itens pendentes
            </button>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
            <p className="text-sm text-gray-500">Últimas ações do sistema</p>
          </div>
          <div className="p-6 space-y-4">
            {mockData.recent_activity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <button className="text-sm text-orange-600 hover:text-orange-900 font-medium">
              Ver log completo
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BackofficeDashboard;

