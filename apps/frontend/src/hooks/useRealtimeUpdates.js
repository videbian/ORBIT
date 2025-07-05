import { useEffect, useCallback } from 'react';
import useWebSocket from './useWebSocket';
import { useNotification } from '../contexts/NotificationContext';

const useRealtimeUpdates = (onDocumentUpdate) => {
  const { lastMessage, isConnected, connectionError } = useWebSocket();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  // Processar mensagens WebSocket
  useEffect(() => {
    if (!lastMessage) return;

    console.log('Processando mensagem WebSocket:', lastMessage);

    switch (lastMessage.type) {
      case 'connection_established':
        showInfo('🔗 Conectado ao sistema de notificações', 3000);
        break;

      case 'document_processed':
        handleDocumentProcessed(lastMessage);
        break;

      case 'test_notification':
        showInfo(`🧪 ${lastMessage.message}`, 5000);
        break;

      case 'pong':
        // Resposta ao ping - não mostrar notificação
        console.log('WebSocket: Pong recebido');
        break;

      case 'connection_stats':
        console.log('WebSocket: Estatísticas de conexão:', lastMessage.data);
        break;

      default:
        console.log('WebSocket: Tipo de mensagem não reconhecido:', lastMessage.type);
    }
  }, [lastMessage, showSuccess, showError, showInfo, showWarning]);

  const handleDocumentProcessed = useCallback((message) => {
    const { data } = message;
    
    if (!data) {
      console.warn('Mensagem de documento sem dados:', message);
      return;
    }

    const { status, original_filename, confidence_score } = data;

    // Mostrar notificação baseada no status
    switch (status) {
      case 'complete':
        const confidenceText = confidence_score 
          ? ` (Confiança: ${(parseFloat(confidence_score) * 100).toFixed(1)}%)`
          : '';
        showSuccess(`✅ ${original_filename} processado com sucesso!${confidenceText}`, 6000);
        break;

      case 'failed':
        showError(`❌ Erro ao processar ${original_filename}`, 8000);
        break;

      case 'processing':
        showInfo(`🔄 Processando ${original_filename}...`, 4000);
        break;

      default:
        showInfo(`📄 Status de ${original_filename} atualizado: ${status}`, 5000);
    }

    // Chamar callback para atualizar lista de documentos
    if (onDocumentUpdate) {
      onDocumentUpdate(data);
    }
  }, [showSuccess, showError, showInfo, onDocumentUpdate]);

  // Mostrar erro de conexão
  useEffect(() => {
    if (connectionError) {
      showError(`🔌 ${connectionError}`, 10000);
    }
  }, [connectionError, showError]);

  // Mostrar status de conexão
  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket: Conectado - notificações em tempo real ativas');
    } else {
      console.log('WebSocket: Desconectado - notificações em tempo real inativas');
    }
  }, [isConnected]);

  return {
    isConnected,
    connectionError,
    lastMessage
  };
};

export default useRealtimeUpdates;

