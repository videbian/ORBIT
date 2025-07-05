"""
Serviço de webhook para receber notificações da IA Wu3
"""
import os
import hmac
import hashlib
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import HTTPException, Request

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebhookValidator:
    """Validador de webhooks da Wu3"""
    
    def __init__(self):
        self.webhook_secret = os.getenv("WU3_WEBHOOK_SECRET", "segreto123-change-in-production")
        self.allowed_ips = os.getenv("WEBHOOK_ALLOWED_IPS", "127.0.0.1,::1").split(",")
        
    def validate_signature(self, payload: bytes, signature: str) -> bool:
        """
        Valida assinatura HMAC-SHA256 do webhook
        
        Args:
            payload: Corpo da requisição em bytes
            signature: Assinatura recebida no header X-Wu3-Signature
        
        Returns:
            True se assinatura válida, False caso contrário
        """
        if not signature:
            logger.warning("Webhook recebido sem assinatura")
            return False
        
        # Remover prefixo 'sha256=' se presente
        if signature.startswith('sha256='):
            signature = signature[7:]
        
        # Calcular assinatura esperada
        expected_signature = hmac.new(
            self.webhook_secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        # Comparação segura contra timing attacks
        is_valid = hmac.compare_digest(expected_signature, signature)
        
        if not is_valid:
            logger.warning(f"Assinatura inválida. Esperada: {expected_signature[:8]}..., Recebida: {signature[:8]}...")
        
        return is_valid
    
    def validate_ip(self, client_ip: str) -> bool:
        """
        Valida se o IP está na lista de IPs permitidos
        
        Args:
            client_ip: IP do cliente
        
        Returns:
            True se IP permitido, False caso contrário
        """
        # Em desenvolvimento, permitir qualquer IP
        if os.getenv("ENVIRONMENT", "development") == "development":
            return True
        
        # Verificar se IP está na lista permitida
        is_allowed = client_ip in self.allowed_ips
        
        if not is_allowed:
            logger.warning(f"IP não permitido: {client_ip}")
        
        return is_allowed
    
    def validate_payload(self, payload: Dict[str, Any]) -> bool:
        """
        Valida estrutura do payload do webhook
        
        Args:
            payload: Dados do webhook
        
        Returns:
            True se payload válido, False caso contrário
        """
        required_fields = ['document_id', 'status']
        
        for field in required_fields:
            if field not in payload:
                logger.warning(f"Campo obrigatório ausente: {field}")
                return False
        
        # Validar status
        valid_statuses = ['complete', 'failed', 'processing']
        if payload['status'] not in valid_statuses:
            logger.warning(f"Status inválido: {payload['status']}")
            return False
        
        # Validar document_id (deve ser UUID)
        document_id = payload['document_id']
        if not isinstance(document_id, str) or len(document_id) != 36:
            logger.warning(f"Document ID inválido: {document_id}")
            return False
        
        return True

class WebhookProcessor:
    """Processador de webhooks da Wu3"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.validator = WebhookValidator()
    
    async def process_wu3_webhook(self, request: Request, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processa webhook da Wu3
        
        Args:
            request: Requisição FastAPI
            payload: Dados do webhook
        
        Returns:
            Resposta do processamento
        
        Raises:
            HTTPException: Em caso de erro de validação
        """
        # Obter IP do cliente
        client_ip = request.client.host
        
        # Validar IP
        if not self.validator.validate_ip(client_ip):
            raise HTTPException(status_code=403, detail="IP não autorizado")
        
        # Obter assinatura
        signature = request.headers.get("X-Wu3-Signature", "")
        
        # Obter corpo da requisição para validação HMAC
        body = await request.body()
        
        # Validar assinatura
        if not self.validator.validate_signature(body, signature):
            raise HTTPException(status_code=401, detail="Assinatura inválida")
        
        # Validar payload
        if not self.validator.validate_payload(payload):
            raise HTTPException(status_code=400, detail="Payload inválido")
        
        # Processar webhook
        return await self._update_document(payload)
    
    async def _update_document(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Atualiza documento no banco de dados
        
        Args:
            payload: Dados do webhook
        
        Returns:
            Resultado da atualização
        """
        from models import Document
        from sqlalchemy import func
        
        document_id = payload['document_id']
        status = payload['status']
        
        logger.info(f"Processando webhook para documento {document_id} com status {status}")
        
        # Buscar documento
        document = self.db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            logger.warning(f"Documento não encontrado: {document_id}")
            raise HTTPException(status_code=404, detail="Documento não encontrado")
        
        # Atualizar campos baseado no status
        update_data = {
            'status': status,
            'updated_at': datetime.utcnow(),
            'webhook_received': True,
            'webhook_received_at': datetime.utcnow()
        }
        
        if status == 'complete':
            # Documento processado com sucesso
            if 'extracted_data' in payload:
                update_data['extracted_data'] = json.dumps(payload['extracted_data'])
            
            if 'confidence_score' in payload:
                update_data['confidence_score'] = str(payload['confidence_score'])
            
            if 'wu3_document_id' in payload:
                update_data['wu3_document_id'] = payload['wu3_document_id']
            
            if 'processing_time' in payload:
                update_data['processing_time_seconds'] = str(payload['processing_time'])
            
            if 'wu3_version' in payload:
                update_data['wu3_version'] = payload['wu3_version']
        
        elif status == 'failed':
            # Documento falhou no processamento
            if 'error_message' in payload:
                update_data['error_message'] = payload['error_message']
        
        # Atualizar documento
        self.db.query(Document).filter(Document.id == document_id).update(update_data)
        self.db.commit()
        
        logger.info(f"Documento {document_id} atualizado com sucesso")
        
        # Preparar dados para notificação WebSocket
        notification_data = {
            'type': 'document_updated',
            'document_id': document_id,
            'status': status,
            'user_id': document.user_id,
            'original_filename': document.original_filename,
            'confidence_score': update_data.get('confidence_score'),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Enviar notificação via WebSocket (será implementado na próxima fase)
        await self._send_websocket_notification(notification_data)
        
        return {
            'success': True,
            'document_id': document_id,
            'status': status,
            'message': f'Documento {document_id} atualizado com status {status}'
        }
    
    async def _send_websocket_notification(self, notification_data: Dict[str, Any]):
        """
        Envia notificação via WebSocket
        
        Args:
            notification_data: Dados da notificação
        """
        try:
            from websocket_manager import websocket_manager
            await websocket_manager.send_document_notification(notification_data)
            logger.info(f"Notificação WebSocket enviada para usuário {notification_data['user_id']}")
        except Exception as e:
            logger.error(f"Erro ao enviar notificação WebSocket: {str(e)}")

# Instância global do validador
webhook_validator = WebhookValidator()

