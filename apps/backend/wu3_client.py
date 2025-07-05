"""
Cliente real para integração com a API da IA Wu3
"""
import os
import json
import time
import asyncio
import aiohttp
import aiofiles
from typing import Dict, Any, Optional, Tuple
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Wu3ClientError(Exception):
    """Exceção personalizada para erros do cliente Wu3"""
    pass

class Wu3Client:
    """Cliente para comunicação com a API da IA Wu3"""
    
    def __init__(self):
        self.base_url = os.getenv("WU3_API_URL", "https://api.wu3.ai/process")
        self.api_key = os.getenv("WU3_API_KEY")
        self.timeout = int(os.getenv("WU3_TIMEOUT_SECONDS", "30"))
        self.max_retries = int(os.getenv("WU3_MAX_RETRIES", "3"))
        self.retry_delay = int(os.getenv("WU3_RETRY_DELAY", "2"))
        
        if not self.api_key:
            logger.warning("WU3_API_KEY não configurada. Usando modo de fallback.")
    
    async def process_document(self, file_path: str, document_type: str, document_id: str) -> Dict[str, Any]:
        """
        Processa um documento através da API Wu3
        
        Args:
            file_path: Caminho do arquivo a ser processado
            document_type: Tipo do documento (contract, invoice, etc.)
            document_id: ID único do documento
        
        Returns:
            Dict com dados extraídos e metadados
        
        Raises:
            Wu3ClientError: Em caso de erro na API
        """
        start_time = time.time()
        
        try:
            # Se não há API key, usar fallback mockado
            if not self.api_key or self.api_key == "seu_token_real_wu3_aqui":
                logger.info(f"Usando processamento mockado para documento {document_id}")
                return await self._process_document_fallback(file_path, document_type, document_id)
            
            # Processar com API real
            logger.info(f"Processando documento {document_id} via API Wu3")
            result = await self._process_document_real(file_path, document_type, document_id)
            
            processing_time = time.time() - start_time
            result["processing_time_seconds"] = round(processing_time, 2)
            
            return result
            
        except Exception as e:
            processing_time = time.time() - start_time
            logger.error(f"Erro ao processar documento {document_id}: {str(e)}")
            
            # Em caso de erro, retornar estrutura padrão
            return {
                "status": "failed",
                "error_message": str(e),
                "processing_time_seconds": round(processing_time, 2),
                "document_id": document_id,
                "wu3_version": "error",
                "extracted_data": {},
                "confidence_score": 0.0
            }
    
    async def _process_document_real(self, file_path: str, document_type: str, document_id: str) -> Dict[str, Any]:
        """Processa documento via API real da Wu3"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "ORBIT-IA/1.0"
        }
        
        # Preparar dados do formulário
        data = aiohttp.FormData()
        
        # Adicionar arquivo
        async with aiofiles.open(file_path, 'rb') as file:
            file_content = await file.read()
            data.add_field(
                'file', 
                file_content,
                filename=os.path.basename(file_path),
                content_type=self._get_content_type(file_path)
            )
        
        # Adicionar metadados
        data.add_field('document_type', document_type)
        data.add_field('document_id', document_id)
        data.add_field('client_id', 'orbit-ia')
        
        # Fazer requisição com retry
        for attempt in range(self.max_retries):
            try:
                timeout = aiohttp.ClientTimeout(total=self.timeout)
                
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    async with session.post(self.base_url, headers=headers, data=data) as response:
                        
                        if response.status == 200:
                            result = await response.json()
                            return self._normalize_wu3_response(result, document_id)
                        
                        elif response.status == 429:  # Rate limit
                            if attempt < self.max_retries - 1:
                                wait_time = self.retry_delay * (2 ** attempt)  # Backoff exponencial
                                logger.warning(f"Rate limit atingido. Aguardando {wait_time}s...")
                                await asyncio.sleep(wait_time)
                                continue
                            else:
                                raise Wu3ClientError("Rate limit excedido após múltiplas tentativas")
                        
                        elif response.status == 401:
                            raise Wu3ClientError("Token de autenticação inválido")
                        
                        elif response.status == 413:
                            raise Wu3ClientError("Arquivo muito grande para processamento")
                        
                        else:
                            error_text = await response.text()
                            raise Wu3ClientError(f"Erro HTTP {response.status}: {error_text}")
            
            except aiohttp.ClientError as e:
                if attempt < self.max_retries - 1:
                    logger.warning(f"Erro de conexão (tentativa {attempt + 1}): {str(e)}")
                    await asyncio.sleep(self.retry_delay)
                    continue
                else:
                    raise Wu3ClientError(f"Erro de conexão após {self.max_retries} tentativas: {str(e)}")
        
        raise Wu3ClientError("Número máximo de tentativas excedido")
    
    async def _process_document_fallback(self, file_path: str, document_type: str, document_id: str) -> Dict[str, Any]:
        """Processamento mockado como fallback"""
        # Importar o serviço mockado existente
        from wu3_service import process_document_with_wu3
        
        # Simular delay de rede
        await asyncio.sleep(1.0)
        
        # Usar processamento mockado
        mock_result = process_document_with_wu3(document_id, file_path, document_type)
        
        # Normalizar resposta para formato Wu3
        return {
            "status": "complete",
            "wu3_document_id": f"wu3_{document_id}",
            "wu3_request_id": f"req_{int(time.time())}",
            "extracted_data": mock_result["extracted_data"],
            "confidence_score": mock_result["confidence_score"],
            "wu3_version": "fallback-mock-2.1.0",
            "processing_time_seconds": mock_result["extracted_data"]["metadata"]["processing_time_seconds"],
            "error_message": None
        }
    
    def _normalize_wu3_response(self, wu3_response: Dict[str, Any], document_id: str) -> Dict[str, Any]:
        """Normaliza resposta da API Wu3 para formato interno"""
        
        return {
            "status": wu3_response.get("status", "complete"),
            "wu3_document_id": wu3_response.get("document_id", f"wu3_{document_id}"),
            "wu3_request_id": wu3_response.get("request_id", f"req_{int(time.time())}"),
            "extracted_data": wu3_response.get("extracted_data", {}),
            "confidence_score": wu3_response.get("confidence_score", 0.0),
            "wu3_version": wu3_response.get("model_version", "unknown"),
            "error_message": wu3_response.get("error_message"),
            "processing_time_seconds": wu3_response.get("processing_time", 0.0)
        }
    
    def _get_content_type(self, file_path: str) -> str:
        """Determina o content-type baseado na extensão do arquivo"""
        extension = os.path.splitext(file_path)[1].lower()
        
        content_types = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword'
        }
        
        return content_types.get(extension, 'application/octet-stream')
    
    async def get_document_status(self, wu3_document_id: str) -> Dict[str, Any]:
        """
        Consulta o status de um documento na Wu3 (para processamento assíncrono)
        
        Args:
            wu3_document_id: ID do documento na Wu3
        
        Returns:
            Dict com status atual do documento
        """
        if not self.api_key or self.api_key == "seu_token_real_wu3_aqui":
            return {"status": "complete", "message": "Modo fallback ativo"}
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "ORBIT-IA/1.0"
        }
        
        try:
            timeout = aiohttp.ClientTimeout(total=10)
            
            async with aiohttp.ClientSession(timeout=timeout) as session:
                url = f"{self.base_url}/status/{wu3_document_id}"
                async with session.get(url, headers=headers) as response:
                    
                    if response.status == 200:
                        return await response.json()
                    else:
                        return {"status": "error", "message": f"HTTP {response.status}"}
        
        except Exception as e:
            logger.error(f"Erro ao consultar status do documento {wu3_document_id}: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    def validate_configuration(self) -> Tuple[bool, str]:
        """
        Valida se a configuração do cliente está correta
        
        Returns:
            Tuple (is_valid, message)
        """
        if not self.base_url:
            return False, "WU3_API_URL não configurada"
        
        if not self.api_key:
            return False, "WU3_API_KEY não configurada - usando modo fallback"
        
        if self.api_key == "seu_token_real_wu3_aqui":
            return False, "WU3_API_KEY contém valor de exemplo - usando modo fallback"
        
        return True, "Configuração válida"

# Instância global do cliente
wu3_client = Wu3Client()

