"""
Gerenciador de WebSocket para notificações em tempo real
"""
import json
import logging
from typing import Dict, List, Any
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    """Gerenciador de conexões WebSocket"""
    
    def __init__(self):
        # Dicionário de conexões ativas: {user_id: [websockets]}
        self.active_connections: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        """
        Conecta um novo WebSocket para um usuário
        
        Args:
            websocket: Conexão WebSocket
            user_id: ID do usuário
        """
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        
        logger.info(f"WebSocket conectado para usuário {user_id}. Total de conexões: {len(self.active_connections[user_id])}")
        
        # Enviar mensagem de boas-vindas
        await self.send_personal_message({
            'type': 'connection_established',
            'message': 'Conectado ao sistema de notificações ORBIT IA',
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id
        }, user_id)
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        """
        Desconecta um WebSocket de um usuário
        
        Args:
            websocket: Conexão WebSocket
            user_id: ID do usuário
        """
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
                
                # Remove usuário se não há mais conexões
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
                
                logger.info(f"WebSocket desconectado para usuário {user_id}")
    
    async def send_personal_message(self, message: Dict[str, Any], user_id: str):
        """
        Envia mensagem para um usuário específico
        
        Args:
            message: Mensagem a ser enviada
            user_id: ID do usuário
        """
        if user_id not in self.active_connections:
            logger.warning(f"Usuário {user_id} não possui conexões WebSocket ativas")
            return
        
        # Enviar para todas as conexões do usuário (múltiplas abas/dispositivos)
        disconnected_websockets = []
        
        for websocket in self.active_connections[user_id]:
            try:
                await websocket.send_text(json.dumps(message))
                logger.debug(f"Mensagem enviada para usuário {user_id}: {message['type']}")
            except Exception as e:
                logger.error(f"Erro ao enviar mensagem para usuário {user_id}: {str(e)}")
                disconnected_websockets.append(websocket)
        
        # Remover conexões que falharam
        for websocket in disconnected_websockets:
            self.disconnect(websocket, user_id)
    
    async def broadcast_message(self, message: Dict[str, Any]):
        """
        Envia mensagem para todos os usuários conectados
        
        Args:
            message: Mensagem a ser enviada
        """
        logger.info(f"Broadcasting mensagem: {message['type']}")
        
        for user_id in list(self.active_connections.keys()):
            await self.send_personal_message(message, user_id)
    
    async def send_document_notification(self, document_data: Dict[str, Any]):
        """
        Envia notificação específica de documento
        
        Args:
            document_data: Dados do documento processado
        """
        user_id = str(document_data.get('user_id'))
        
        if not user_id:
            logger.warning("Notificação de documento sem user_id")
            return
        
        # Preparar mensagem de notificação
        notification = {
            'type': 'document_processed',
            'data': {
                'document_id': document_data.get('document_id'),
                'original_filename': document_data.get('original_filename'),
                'status': document_data.get('status'),
                'confidence_score': document_data.get('confidence_score'),
                'processing_time': document_data.get('processing_time'),
                'timestamp': document_data.get('timestamp', datetime.utcnow().isoformat())
            },
            'message': self._get_notification_message(document_data),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        await self.send_personal_message(notification, user_id)
    
    def _get_notification_message(self, document_data: Dict[str, Any]) -> str:
        """
        Gera mensagem de notificação baseada no status do documento
        
        Args:
            document_data: Dados do documento
        
        Returns:
            Mensagem de notificação
        """
        filename = document_data.get('original_filename', 'documento')
        status = document_data.get('status', 'unknown')
        confidence = document_data.get('confidence_score')
        
        if status == 'complete':
            if confidence:
                try:
                    confidence_pct = float(confidence) * 100
                    return f"✅ {filename} processado com sucesso! Confiança: {confidence_pct:.1f}%"
                except:
                    return f"✅ {filename} processado com sucesso!"
            else:
                return f"✅ {filename} processado com sucesso!"
        
        elif status == 'failed':
            return f"❌ Erro ao processar {filename}. Verifique os detalhes."
        
        elif status == 'processing':
            return f"🔄 {filename} está sendo processado..."
        
        else:
            return f"📄 Status do documento {filename} atualizado: {status}"
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """
        Retorna estatísticas das conexões WebSocket
        
        Returns:
            Estatísticas das conexões
        """
        total_users = len(self.active_connections)
        total_connections = sum(len(connections) for connections in self.active_connections.values())
        
        return {
            'total_users_connected': total_users,
            'total_connections': total_connections,
            'users_with_multiple_connections': sum(1 for connections in self.active_connections.values() if len(connections) > 1),
            'average_connections_per_user': total_connections / total_users if total_users > 0 else 0
        }

# Instância global do gerenciador
websocket_manager = ConnectionManager()

