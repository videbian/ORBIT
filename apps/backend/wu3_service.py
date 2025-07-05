"""
Serviço de integração com IA Wu3 (mockado)
Este módulo simula o processamento de documentos pela IA Wu3
"""
import random
import time
from typing import Dict, Any

def process_document_with_wu3(document_id: str, file_path: str, document_type: str) -> Dict[str, Any]:
    """
    Simula o processamento de um documento pela IA Wu3
    
    Args:
        document_id: ID único do documento
        file_path: Caminho do arquivo no sistema
        document_type: Tipo do documento (contract, invoice, etc.)
    
    Returns:
        Dict com dados extraídos e score de confiança
    """
    
    # Simular tempo de processamento
    time.sleep(random.uniform(0.5, 2.0))
    
    # Dados mockados baseados no tipo de documento
    mock_data = {
        "contract": {
            "extracted_data": {
                "cnpj": "12.345.678/0001-90",
                "razao_social": "Empresa Digital Offshore Ltda",
                "nome_fantasia": "Digital Offshore",
                "endereco": "Rua das Tecnologias, 123 - São Paulo/SP",
                "valor_contrato": "R$ 250.000,00",
                "data_inicio": "2024-01-15",
                "data_fim": "2024-12-31",
                "objeto": "Prestação de serviços de desenvolvimento de software",
                "responsavel": "João Silva Santos",
                "email": "contato@digitaloffshore.com.br",
                "telefone": "(11) 99999-9999"
            },
            "confidence_score": random.uniform(0.85, 0.98)
        },
        "invoice": {
            "extracted_data": {
                "numero_nota": "000123456",
                "cnpj_emissor": "98.765.432/0001-10",
                "razao_social_emissor": "BTS Vault Tecnologia S.A.",
                "cnpj_destinatario": "12.345.678/0001-90",
                "razao_social_destinatario": "Cliente Exemplo Ltda",
                "valor_total": "R$ 15.750,00",
                "valor_impostos": "R$ 2.362,50",
                "data_emissao": "2024-07-01",
                "data_vencimento": "2024-07-31",
                "descricao_servicos": "Consultoria em segurança digital e auditoria de sistemas",
                "codigo_servico": "01.07"
            },
            "confidence_score": random.uniform(0.88, 0.96)
        },
        "identity": {
            "extracted_data": {
                "nome_completo": "Maria Fernanda Costa Silva",
                "cpf": "123.456.789-00",
                "rg": "12.345.678-9",
                "data_nascimento": "15/03/1985",
                "naturalidade": "São Paulo/SP",
                "filiacao_mae": "Ana Costa Silva",
                "filiacao_pai": "Roberto Silva",
                "endereco": "Av. Paulista, 1000 - Bela Vista - São Paulo/SP",
                "cep": "01310-100",
                "data_emissao": "10/01/2020",
                "orgao_emissor": "SSP/SP"
            },
            "confidence_score": random.uniform(0.90, 0.99)
        },
        "financial": {
            "extracted_data": {
                "banco": "Banco do Brasil",
                "agencia": "1234-5",
                "conta": "67890-1",
                "titular": "Omega Cia Importação e Exportação Ltda",
                "cnpj": "11.222.333/0001-44",
                "saldo_atual": "R$ 125.430,75",
                "data_extrato": "2024-07-04",
                "periodo": "01/06/2024 a 30/06/2024",
                "movimentacoes": [
                    {"data": "2024-06-30", "descricao": "TED Recebida", "valor": "R$ 50.000,00"},
                    {"data": "2024-06-28", "descricao": "Pagamento Fornecedor", "valor": "-R$ 12.500,00"},
                    {"data": "2024-06-25", "descricao": "Receita Vendas", "valor": "R$ 35.000,00"}
                ]
            },
            "confidence_score": random.uniform(0.82, 0.94)
        }
    }
    
    # Selecionar dados baseados no tipo ou usar dados genéricos
    if document_type in mock_data:
        result = mock_data[document_type].copy()
    else:
        # Dados genéricos para tipos não mapeados
        result = {
            "extracted_data": {
                "tipo_documento": document_type,
                "texto_extraido": "Documento processado com sucesso pela IA Wu3",
                "entidades_encontradas": ["pessoa", "empresa", "data", "valor"],
                "idioma_detectado": "português",
                "numero_paginas": random.randint(1, 10),
                "qualidade_imagem": "alta",
                "observacoes": "Documento legível e bem estruturado"
            },
            "confidence_score": random.uniform(0.75, 0.90)
        }
    
    # Adicionar metadados do processamento
    result["extracted_data"]["metadata"] = {
        "document_id": document_id,
        "processed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "processing_time_seconds": round(random.uniform(0.5, 2.0), 2),
        "wu3_version": "2.1.0",
        "model_used": "wu3-document-analyzer-v2"
    }
    
    return result

def get_supported_document_types() -> Dict[str, str]:
    """
    Retorna os tipos de documento suportados pela IA Wu3
    
    Returns:
        Dict com tipos e descrições
    """
    return {
        "contract": "Contratos e acordos comerciais",
        "invoice": "Notas fiscais e faturas",
        "identity": "Documentos de identidade (RG, CPF, CNH)",
        "financial": "Extratos bancários e documentos financeiros",
        "legal": "Documentos jurídicos e processos",
        "medical": "Laudos e documentos médicos",
        "academic": "Diplomas e certificados acadêmicos",
        "other": "Outros tipos de documento"
    }

def validate_document_format(file_path: str) -> bool:
    """
    Valida se o formato do documento é suportado pela IA Wu3
    
    Args:
        file_path: Caminho do arquivo
    
    Returns:
        True se suportado, False caso contrário
    """
    supported_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.doc', '.tiff', '.bmp']
    file_extension = file_path.lower().split('.')[-1]
    return f'.{file_extension}' in supported_extensions

def estimate_processing_time(file_path: str, document_type: str) -> float:
    """
    Estima o tempo de processamento baseado no tipo e tamanho do documento
    
    Args:
        file_path: Caminho do arquivo
        document_type: Tipo do documento
    
    Returns:
        Tempo estimado em segundos
    """
    import os
    
    try:
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    except:
        file_size_mb = 1.0  # Default se não conseguir obter o tamanho
    
    # Tempo base por tipo de documento
    base_times = {
        "contract": 2.0,
        "invoice": 1.5,
        "identity": 1.0,
        "financial": 2.5,
        "legal": 3.0,
        "medical": 2.0,
        "academic": 1.5,
        "other": 2.0
    }
    
    base_time = base_times.get(document_type, 2.0)
    
    # Ajustar baseado no tamanho do arquivo
    size_factor = min(file_size_mb * 0.5, 5.0)  # Máximo 5 segundos extras
    
    return base_time + size_factor

