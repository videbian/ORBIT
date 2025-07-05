import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DocumentList = ({ refreshTrigger }) => {
  const { authenticatedFetch } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const documentTypeLabels = {
    contract: 'Contrato',
    invoice: 'Nota Fiscal',
    identity: 'Identidade',
    financial: 'Financeiro',
    legal: 'Jurídico',
    medical: 'Médico',
    academic: 'Acadêmico',
    other: 'Outro'
  };

  const statusLabels = {
    processing: 'Processando',
    complete: 'Concluído',
    error: 'Erro'
  };

  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-800',
    complete: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('http://localhost:8000/api/documents');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar documentos');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (documentId) => {
    try {
      const response = await authenticatedFetch(`http://localhost:8000/api/documents/${documentId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar detalhes do documento');
      }

      const document = await response.json();
      setSelectedDocument(document);
      setShowDetails(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      alert('Erro ao carregar detalhes do documento');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatConfidenceScore = (score) => {
    if (!score) return 'N/A';
    return `${(score * 100).toFixed(1)}%`;
  };

  const renderExtractedData = (data) => {
    if (!data || typeof data !== 'object') return null;

    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          if (key === 'metadata') return null; // Não mostrar metadados na visualização principal
          
          if (typeof value === 'object' && value !== null) {
            return (
              <div key={key} className="border-l-4 border-blue-200 pl-4">
                <h4 className="font-medium text-gray-900 capitalize mb-2">
                  {key.replace(/_/g, ' ')}
                </h4>
                <div className="space-y-1">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="flex justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {subKey.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {String(subValue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando documentos...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Documentos Processados</h3>
          <p className="text-sm text-gray-500">
            {documents.length} documento(s) encontrado(s)
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento</h3>
            <p className="mt-1 text-sm text-gray-500">
              Faça upload do seu primeiro documento para começar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confiança
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {document.original_filename}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {document.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {documentTypeLabels[document.document_type] || document.document_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[document.status]}`}>
                        {statusLabels[document.status] || document.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatConfidenceScore(document.confidence_score)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(document.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {showDetails && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Detalhes do Documento
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Informações básicas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Informações Básicas</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Arquivo:</span>
                    <span className="ml-2 font-medium">{selectedDocument.original_filename}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <span className="ml-2 font-medium">
                      {documentTypeLabels[selectedDocument.document_type] || selectedDocument.document_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedDocument.status]}`}>
                      {statusLabels[selectedDocument.status] || selectedDocument.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confiança:</span>
                    <span className="ml-2 font-medium">
                      {formatConfidenceScore(selectedDocument.confidence_score)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dados extraídos */}
              {selectedDocument.extracted_data && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Dados Extraídos pela IA Wu3</h4>
                  <div className="max-h-96 overflow-y-auto">
                    {renderExtractedData(selectedDocument.extracted_data)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentList;

