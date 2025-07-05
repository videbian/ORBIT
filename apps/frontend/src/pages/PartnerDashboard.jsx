import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import StatsCard from '../components/common/StatsCard';
import ActionCard from '../components/common/ActionCard';
import { useAuth } from '../contexts/AuthContext';

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock data baseado no documento telas.pdf
  const mockData = {
    stats: {
      total_clients: 4,
      active_proposals: 3,
      monthly_revenue: 'R$ 48.250',
      conversion_rate: '75%'
    },
    proposals: [
      {
        id: 'AP-2024-001',
        client: 'Digital Offshore',
        value: 'R$ 25.000',
        status: 'Em Análise',
        date: '2024-07-01'
      },
      {
        id: 'AP-2024-002',
        client: 'BTS Vault',
        value: 'R$ 60.000',
        status: 'Aprovada',
        date: '2024-06-28'
      },
      {
        id: 'AP-2024-003',
        client: 'Omega Cia',
        value: 'R$ 35.000',
        status: 'Pendente',
        date: '2024-06-25'
      }
    ],
    clients: [
      {
        name: 'Digital Offshore',
        projects: 2,
        value: 'R$ 25.000',
        status: 'Ativo'
      },
      {
        name: 'BTS Vault',
        projects: 1,
        value: 'R$ 60.000',
        status: 'Ativo'
      },
      {
        name: 'Omega Cia',
        projects: 1,
        value: 'R$ 35.000',
        status: 'Negociação'
      }
    ]
  };

  return (
    <DashboardLayout 
      title="Painel do Parceiro" 
      subtitle={`Gestão de clientes e propostas - ${user?.name}`}
    >
      {/* Header com informações do parceiro */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Painel do Parceiro</h2>
            <p className="text-green-100">
              Gerencie seus clientes, propostas e acompanhe seu desempenho
            </p>
          </div>
          <div className="hidden md:block">
            <svg className="h-16 w-16 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Estatísticas do Parceiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Clientes"
          value={mockData.stats.total_clients}
          subtitle="Clientes ativos"
          color="green"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Propostas Ativas"
          value={mockData.stats.active_proposals}
          subtitle="Em andamento"
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Receita Mensal"
          value={mockData.stats.monthly_revenue}
          subtitle="Este mês"
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />
        
        <StatsCard
          title="Taxa de Conversão"
          value={mockData.stats.conversion_rate}
          subtitle="Propostas aprovadas"
          color="orange"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Nova Proposta"
            description="Criar uma nova proposta comercial para cliente"
            color="green"
            buttonText="Criar Proposta"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
          
          <ActionCard
            title="Gerenciar Clientes"
            description="Visualizar e gerenciar sua carteira de clientes"
            color="blue"
            buttonText="Ver Clientes"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          />
          
          <ActionCard
            title="Relatórios de Vendas"
            description="Acompanhar performance e métricas de vendas"
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

      {/* Propostas e Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Propostas Recentes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Propostas Recentes</h2>
            <p className="text-sm text-gray-500">Suas propostas mais recentes</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{proposal.id}</div>
                        <div className="text-sm text-gray-500">{proposal.client}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{proposal.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        proposal.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                        proposal.status === 'Em Análise' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {proposal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Meus Clientes</h2>
            <p className="text-sm text-gray-500">Carteira de clientes ativa</p>
          </div>
          <div className="p-6 space-y-4">
            {mockData.clients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.projects} projeto(s) • {client.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    client.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {client.status}
                  </span>
                  <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PartnerDashboard;

