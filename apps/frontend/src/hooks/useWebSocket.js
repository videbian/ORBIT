import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useWebSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 segundos

  const connect = useCallback(() => {
    if (!user?.id) {
      console.log('WebSocket: Usuário não logado, não conectando');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Já conectado');
      return;
    }

    try {
      const wsUrl = `ws://localhost:8000/ws/${user.id}`;
      console.log(`WebSocket: Conectando em ${wsUrl}`);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket: Conectado com sucesso');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket: Mensagem recebida:', message);
          setLastMessage(message);
        } catch (error) {
          console.error('WebSocket: Erro ao parsear mensagem:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket: Conexão fechada', event.code, event.reason);
        setIsConnected(false);
        
        // Tentar reconectar se não foi fechamento intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`WebSocket: Tentativa de reconexão ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay * reconnectAttempts.current);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionError('Não foi possível reconectar ao servidor. Recarregue a página.');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket: Erro de conexão:', error);
        setConnectionError('Erro de conexão WebSocket');
      };

    } catch (error) {
      console.error('WebSocket: Erro ao criar conexão:', error);
      setConnectionError('Erro ao conectar WebSocket');
    }
  }, [user?.id]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log('WebSocket: Desconectando...');
      wsRef.current.close(1000, 'Desconexão intencional');
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionError(null);
    reconnectAttempts.current = 0;
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      console.log('WebSocket: Mensagem enviada:', message);
    } else {
      console.warn('WebSocket: Tentativa de enviar mensagem sem conexão ativa');
    }
  }, []);

  const sendPing = useCallback(() => {
    sendMessage({ type: 'ping', timestamp: new Date().toISOString() });
  }, [sendMessage]);

  const requestStats = useCallback(() => {
    sendMessage({ type: 'request_stats' });
  }, [sendMessage]);

  // Conectar quando usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user?.id, connect, disconnect]);

  // Ping periódico para manter conexão viva
  useEffect(() => {
    if (isConnected) {
      const pingInterval = setInterval(() => {
        sendPing();
      }, 30000); // Ping a cada 30 segundos

      return () => clearInterval(pingInterval);
    }
  }, [isConnected, sendPing]);

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    sendPing,
    requestStats,
    connect,
    disconnect
  };
};

export default useWebSocket;

