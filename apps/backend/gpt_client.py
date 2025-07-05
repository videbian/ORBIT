"""
Cliente GPT-4 para geração de insights e análises de documentos
"""
import os
import json
import logging
import asyncio
from typing import Dict, Optional, Any
from datetime import datetime
import aiohttp

logger = logging.getLogger(__name__)

class GPTClient:
    """Cliente para integração com OpenAI GPT-4"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("GPT_MODEL", "gpt-4")
        self.temperature = float(os.getenv("GPT_TEMPERATURE", "0.4"))
        self.max_tokens = int(os.getenv("GPT_MAX_TOKENS", "1000"))
        self.timeout = int(os.getenv("GPT_TIMEOUT_SECONDS", "30"))
        self.enabled = os.getenv("ENABLE_AI_INSIGHTS", "true").lower() == "true"
        
        if not self.api_key or self.api_key == "sk-xxxxx-your-openai-api-key-here":
            logger.warning("OpenAI API key não configurada. Usando modo de fallback.")
            self.enabled = False
    
    async def generate_document_insights(
        self, 
        extracted_data: Dict[str, Any], 
        document_type: str,
        original_filename: str,
        confidence_score: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Gera insights inteligentes baseados nos dados extraídos do documento
        """
        if not self.enabled:
            return self._generate_fallback_insights(extracted_data, document_type, original_filename)
        
        try:
            # Preparar prompt contextualizado
            prompt = self._build_analysis_prompt(
                extracted_data, document_type, original_filename, confidence_score
            )
            
            # Fazer chamada para OpenAI
            response = await self._call_openai_api(prompt)
            
            # Processar resposta
            insights = self._parse_gpt_response(response)
            
            logger.info(f"Insights gerados com sucesso para documento {original_filename}")
            return insights
            
        except Exception as e:
            logger.error(f"Erro ao gerar insights com GPT-4: {str(e)}")
            return self._generate_fallback_insights(extracted_data, document_type, original_filename)
    
    def _build_analysis_prompt(
        self, 
        extracted_data: Dict[str, Any], 
        document_type: str,
        original_filename: str,
        confidence_score: Optional[float] = None
    ) -> str:
        """Constrói prompt contextualizado para análise do documento"""
        
        confidence_text = ""
        if confidence_score:
            confidence_pct = confidence_score * 100
            if confidence_pct >= 90:
                confidence_text = f"Os dados foram extraídos com alta confiança ({confidence_pct:.1f}%)."
            elif confidence_pct >= 70:
                confidence_text = f"Os dados foram extraídos com confiança moderada ({confidence_pct:.1f}%). Recomenda-se revisão."
            else:
                confidence_text = f"Os dados foram extraídos com baixa confiança ({confidence_pct:.1f}%). Verificação manual necessária."
        
        # Dados formatados para o prompt
        data_text = json.dumps(extracted_data, indent=2, ensure_ascii=False)
        
        prompt = f"""
Você é um analista especializado em documentos corporativos. Analise os dados extraídos abaixo e forneça insights estratégicos.

DOCUMENTO: {original_filename}
TIPO: {document_type}
{confidence_text}

DADOS EXTRAÍDOS:
{data_text}

Forneça uma análise estruturada em JSON com os seguintes campos:

{{
  "resumo": "Resumo executivo do documento em 2-3 frases",
  "pontos_principais": ["Lista de 3-5 pontos mais importantes"],
  "riscos_identificados": ["Lista de riscos ou alertas identificados"],
  "recomendacoes": ["Lista de 2-4 ações recomendadas"],
  "proximos_passos": ["Lista de próximos passos sugeridos"],
  "nivel_atencao": "baixo|medio|alto",
  "prazo_sugerido": "Prazo sugerido para ação (ex: '30 dias', 'imediato', etc.)",
  "observacoes": "Observações adicionais relevantes"
}}

Seja objetivo, prático e focado em ações. Use linguagem profissional mas acessível.
"""
        return prompt
    
    async def _call_openai_api(self, prompt: str) -> str:
        """Faz chamada assíncrona para a API da OpenAI"""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "Você é um analista especializado em documentos corporativos. Sempre responda em JSON válido."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }
        
        timeout = aiohttp.ClientTimeout(total=self.timeout)
        
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error {response.status}: {error_text}")
                
                result = await response.json()
                return result["choices"][0]["message"]["content"]
    
    def _parse_gpt_response(self, response: str) -> Dict[str, Any]:
        """Processa resposta do GPT e extrai JSON"""
        try:
            # Tentar extrair JSON da resposta
            response = response.strip()
            
            # Remover markdown se presente
            if response.startswith("```json"):
                response = response[7:]
            if response.endswith("```"):
                response = response[:-3]
            
            # Parse JSON
            insights = json.loads(response)
            
            # Validar campos obrigatórios
            required_fields = ["resumo", "pontos_principais", "recomendacoes", "nivel_atencao"]
            for field in required_fields:
                if field not in insights:
                    insights[field] = "Não disponível"
            
            # Adicionar metadados
            insights["gerado_em"] = datetime.utcnow().isoformat()
            insights["modelo_usado"] = self.model
            insights["fonte"] = "openai_gpt4"
            
            return insights
            
        except json.JSONDecodeError as e:
            logger.error(f"Erro ao parsear resposta JSON do GPT: {str(e)}")
            logger.error(f"Resposta recebida: {response}")
            
            # Fallback: criar estrutura básica com o texto recebido
            return {
                "resumo": response[:200] + "..." if len(response) > 200 else response,
                "pontos_principais": ["Análise disponível no resumo"],
                "recomendacoes": ["Revisar documento manualmente"],
                "nivel_atencao": "medio",
                "observacoes": "Resposta do GPT não pôde ser processada como JSON",
                "gerado_em": datetime.utcnow().isoformat(),
                "modelo_usado": self.model,
                "fonte": "openai_gpt4_fallback"
            }
    
    def _generate_fallback_insights(
        self, 
        extracted_data: Dict[str, Any], 
        document_type: str,
        original_filename: str
    ) -> Dict[str, Any]:
        """Gera insights básicos quando GPT não está disponível"""
        
        # Análise básica baseada no tipo de documento
        insights = {
            "resumo": f"Documento {document_type} processado: {original_filename}",
            "pontos_principais": [],
            "riscos_identificados": [],
            "recomendacoes": ["Revisar dados extraídos", "Validar informações importantes"],
            "proximos_passos": ["Analisar documento manualmente"],
            "nivel_atencao": "medio",
            "prazo_sugerido": "7 dias",
            "observacoes": "Análise gerada automaticamente (GPT-4 não disponível)",
            "gerado_em": datetime.utcnow().isoformat(),
            "modelo_usado": "fallback",
            "fonte": "orbit_fallback"
        }
        
        # Análise específica por tipo de documento
        if document_type == "contract":
            insights["pontos_principais"] = [
                "Contrato identificado",
                f"Dados extraídos: {len(extracted_data)} campos"
            ]
            if "cnpj" in extracted_data:
                insights["pontos_principais"].append(f"CNPJ: {extracted_data['cnpj']}")
            if "valor" in extracted_data:
                insights["pontos_principais"].append(f"Valor: {extracted_data['valor']}")
                
        elif document_type == "invoice":
            insights["pontos_principais"] = [
                "Nota fiscal processada",
                f"Dados extraídos: {len(extracted_data)} campos"
            ]
            if "numero_nf" in extracted_data:
                insights["pontos_principais"].append(f"Número: {extracted_data['numero_nf']}")
                
        elif document_type == "identity":
            insights["pontos_principais"] = [
                "Documento de identidade processado",
                "Verificar dados pessoais extraídos"
            ]
            insights["nivel_atencao"] = "alto"
            insights["recomendacoes"].append("Proteger dados pessoais conforme LGPD")
            
        else:
            insights["pontos_principais"] = [
                f"Documento tipo '{document_type}' processado",
                f"{len(extracted_data)} campos extraídos"
            ]
        
        return insights
    
    def get_status(self) -> Dict[str, Any]:
        """Retorna status da configuração GPT"""
        return {
            "enabled": self.enabled,
            "api_key_configured": bool(self.api_key and self.api_key != "sk-xxxxx-your-openai-api-key-here"),
            "model": self.model,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "timeout": self.timeout
        }

# Instância global do cliente
gpt_client = GPTClient()

async def generate_document_insights(
    extracted_data: Dict[str, Any], 
    document_type: str,
    original_filename: str,
    confidence_score: Optional[float] = None
) -> Dict[str, Any]:
    """
    Função de conveniência para gerar insights de documentos
    """
    return await gpt_client.generate_document_insights(
        extracted_data, document_type, original_filename, confidence_score
    )

