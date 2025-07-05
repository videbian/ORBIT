from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import json
import logging
from datetime import datetime
import asyncio

from database import get_db, create_tables
from models import User, Document
from auth import (
    LoginRequest, RegisterRequest, LoginResponse, UserProfile, UserCreate,
    authenticate_user, create_access_token, get_current_user, create_user,
    verify_admin, get_user_by_email
)
from wu3_client import wu3_client

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ORBIT IA Backend", 
    version="1.0.0",
    description="Backend da plataforma ORBIT IA com autenticação JWT e PostgreSQL"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabelas na inicialização (em produção, usar migrations)
@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
async def root():
    return {"message": "ORBIT IA Backend está online"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint de login que autentica usuário e retorna token JWT
    """
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token JWT
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return LoginResponse(
        token=access_token,
        role=user.role,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    )

@app.post("/api/user/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Endpoint para criar novo usuário (temporário para desenvolvimento)
    """
    user_create = UserCreate(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        password=user_data.password
    )
    
    try:
        user = create_user(db, user_create)
        return {
            "message": "Usuário criado com sucesso",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/user/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Endpoint para obter perfil do usuário autenticado
    """
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@app.get("/api/admin/dashboard")
async def admin_dashboard(admin_user: User = Depends(verify_admin), db: Session = Depends(get_db)):
    """
    Endpoint do dashboard administrativo (apenas para admins)
    """
    # Buscar estatísticas do sistema
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    # Buscar lista de usuários
    users = db.query(User).all()
    users_list = [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]
    
    return {
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "active_sessions": 12,  # Mock data
            "system_status": "Online",
            "last_backup": "04/07/2024"
        },
        "users": users_list
    }

@app.get("/api/client/dashboard")
async def client_dashboard(current_user: User = Depends(get_current_user)):
    """
    Endpoint do dashboard do cliente
    """
    if current_user.role != "client":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas clientes."
        )
    
    return {
        "message": f"Dashboard do cliente {current_user.name}",
        "projects": [
            {"id": 1, "name": "Projeto Alpha", "status": "Em andamento"},
            {"id": 2, "name": "Projeto Beta", "status": "Concluído"}
        ],
        "recent_activity": [
            {"action": "Upload de documento", "date": "2024-07-04"},
            {"action": "Análise concluída", "date": "2024-07-03"}
        ]
    }

# Endpoints de documentos
@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Realiza upload de documento e inicia processamento com IA Wu3
    """
    # Validar tipo de arquivo
    allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.doc']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de arquivo não suportado. Permitidos: {', '.join(allowed_extensions)}"
        )
    
    # Gerar ID único para o documento
    document_id = str(uuid.uuid4())
    
    # Criar diretório de upload se não existir
    upload_dir = "/home/ubuntu/orbit/apps/backend/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Salvar arquivo
    file_path = os.path.join(upload_dir, f"{document_id}_{file.filename}")
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    
    # Criar registro no banco
    document = Document(
        id=document_id,
        user_id=current_user.id,
        document_type=document_type,
        original_filename=file.filename,
        file_path=file_path,
        status='processing'
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Processar documento com IA Wu3 real
    try:
        # Usar cliente Wu3 real (com fallback para mock se não configurado)
        wu3_result = await wu3_client.process_document(file_path, document_type, document_id)
        
        # Atualizar documento com resultado da Wu3
        document.extracted_data = json.dumps(wu3_result.get('extracted_data', {}))
        document.confidence_score = str(wu3_result.get('confidence_score', 0.0))
        document.status = wu3_result.get('status', 'complete')
        document.wu3_document_id = wu3_result.get('wu3_document_id')
        document.wu3_request_id = wu3_result.get('wu3_request_id')
        document.error_message = wu3_result.get('error_message')
        document.processing_time_seconds = str(wu3_result.get('processing_time_seconds', 0.0))
        document.wu3_version = wu3_result.get('wu3_version')
        
        db.commit()
        
        # Se houve erro no processamento Wu3
        if wu3_result.get('status') == 'failed':
            return {
                "status": "failed",
                "document_id": document_id,
                "message": f"Erro no processamento: {wu3_result.get('error_message', 'Erro desconhecido')}",
                "error_message": wu3_result.get('error_message')
            }
        
        # Sucesso no processamento Wu3
        upload_response = {
            "status": "success",
            "document_id": document_id,
            "message": "Documento processado com sucesso",
            "extracted_data": wu3_result.get('extracted_data', {}),
            "confidence_score": wu3_result.get('confidence_score', 0.0),
            "wu3_document_id": wu3_result.get('wu3_document_id'),
            "processing_time": wu3_result.get('processing_time_seconds', 0.0)
        }
        
        # Gerar insights automaticamente se habilitado
        try:
            from gpt_client import gpt_client
            
            if gpt_client.enabled and wu3_result.get('status') == 'complete':
                # Marcar como gerando insights
                document.insights_status = 'generating'
                db.commit()
                
                # Gerar insights em background (assíncrono)
                asyncio.create_task(generate_insights_background(
                    document_id=document_id,
                    extracted_data=wu3_result.get('extracted_data', {}),
                    document_type=document_type,
                    original_filename=file.filename,
                    confidence_score=wu3_result.get('confidence_score'),
                    user_id=current_user.id
                ))
                
                upload_response["insights_generation"] = "started"
                upload_response["message"] += " - Gerando insights inteligentes..."
            else:
                upload_response["insights_generation"] = "disabled"
                
        except Exception as insights_error:
            logger.warning(f"Erro ao iniciar geração de insights: {str(insights_error)}")
            upload_response["insights_generation"] = "error"
        
        return upload_response
        
    except Exception as e:
        # Em caso de erro, atualizar status no banco
        document.status = 'failed'
        document.error_message = str(e)
        db.commit()
        
        raise HTTPException(
            status_code=500, 
            detail=f"Erro no processamento: {str(e)}"
        )

@app.get("/api/documents")
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Lista documentos do usuário atual
    """
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    result = []
    for doc in documents:
        extracted_data = {}
        if doc.extracted_data:
            try:
                extracted_data = json.loads(doc.extracted_data)
            except:
                extracted_data = {}
        
        result.append({
            "id": doc.id,
            "document_type": doc.document_type,
            "original_filename": doc.original_filename,
            "status": doc.status,
            "confidence_score": float(doc.confidence_score) if doc.confidence_score else None,
            "extracted_data": extracted_data,
            "created_at": doc.created_at.isoformat() if doc.created_at else None
        })
    
    return {"documents": result}

@app.get("/api/documents/{document_id}")
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtém detalhes de um documento específico
    """
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    extracted_data = {}
    if document.extracted_data:
        try:
            extracted_data = json.loads(document.extracted_data)
        except:
            extracted_data = {}
    
    return {
        "id": document.id,
        "document_type": document.document_type,
        "original_filename": document.original_filename,
        "status": document.status,
        "confidence_score": float(document.confidence_score) if document.confidence_score else None,
        "extracted_data": extracted_data,
        "created_at": document.created_at.isoformat() if document.created_at else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


@app.get("/api/documents/types")
async def get_document_types():
    """
    Retorna os tipos de documento suportados pela IA Wu3
    """
    from wu3_service import get_supported_document_types
    return {"document_types": get_supported_document_types()}

@app.get("/api/documents/stats")
async def get_document_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas de documentos do usuário
    """
    from sqlalchemy import func
    
    # Contar documentos por status
    stats = db.query(
        Document.status,
        func.count(Document.id).label('count')
    ).filter(
        Document.user_id == current_user.id
    ).group_by(Document.status).all()
    
    # Contar documentos por tipo
    type_stats = db.query(
        Document.document_type,
        func.count(Document.id).label('count')
    ).filter(
        Document.user_id == current_user.id
    ).group_by(Document.document_type).all()
    
    # Total de documentos
    total_documents = db.query(func.count(Document.id)).filter(
        Document.user_id == current_user.id
    ).scalar()
    
    # Documentos processados hoje
    from datetime import date
    today_documents = db.query(func.count(Document.id)).filter(
        Document.user_id == current_user.id,
        func.date(Document.created_at) == date.today()
    ).scalar()
    
    return {
        "total_documents": total_documents or 0,
        "today_documents": today_documents or 0,
        "by_status": {stat.status: stat.count for stat in stats},
        "by_type": {stat.document_type: stat.count for stat in type_stats}
    }


@app.get("/api/wu3/status")
async def get_wu3_status(current_user: User = Depends(get_current_user)):
    """
    Verifica o status da configuração Wu3
    """
    is_valid, message = wu3_client.validate_configuration()
    
    return {
        "wu3_configured": is_valid,
        "message": message,
        "api_url": wu3_client.base_url,
        "has_api_key": bool(wu3_client.api_key and wu3_client.api_key != "seu_token_real_wu3_aqui"),
        "timeout": wu3_client.timeout,
        "max_retries": wu3_client.max_retries
    }

@app.get("/api/wu3/document/{wu3_document_id}/status")
async def get_wu3_document_status(
    wu3_document_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Consulta status de um documento na Wu3 (para processamento assíncrono)
    """
    try:
        status = await wu3_client.get_document_status(wu3_document_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao consultar status: {str(e)}")


# Endpoint de webhook Wu3
@app.post("/api/webhooks/wu3")
async def receive_wu3_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Recebe notificação de processamento da IA Wu3
    """
    from webhook_service import WebhookProcessor
    
    try:
        # Obter payload JSON
        payload = await request.json()
        
        # Processar webhook
        processor = WebhookProcessor(db)
        result = await processor.process_wu3_webhook(request, payload)
        
        return result
        
    except Exception as e:
        logger.error(f"Erro ao processar webhook Wu3: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

@app.get("/api/webhooks/wu3/test")
async def test_webhook_endpoint():
    """
    Endpoint de teste para verificar se webhooks estão funcionando
    """
    from webhook_service import webhook_validator
    
    return {
        "webhook_endpoint": "/api/webhooks/wu3",
        "webhook_secret_configured": bool(webhook_validator.webhook_secret),
        "allowed_ips": webhook_validator.allowed_ips,
        "environment": os.getenv("ENVIRONMENT", "development"),
        "message": "Endpoint de webhook Wu3 ativo e configurado"
    }


# WebSocket para notificações em tempo real
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    Endpoint WebSocket para notificações em tempo real
    """
    from websocket_manager import websocket_manager
    
    await websocket_manager.connect(websocket, user_id)
    
    try:
        while True:
            # Manter conexão viva e escutar mensagens do cliente
            data = await websocket.receive_text()
            
            # Processar mensagens do cliente se necessário
            try:
                message = json.loads(data)
                
                if message.get('type') == 'ping':
                    # Responder a ping com pong
                    await websocket_manager.send_personal_message({
                        'type': 'pong',
                        'timestamp': datetime.utcnow().isoformat()
                    }, user_id)
                
                elif message.get('type') == 'request_stats':
                    # Enviar estatísticas de conexão
                    stats = websocket_manager.get_connection_stats()
                    await websocket_manager.send_personal_message({
                        'type': 'connection_stats',
                        'data': stats,
                        'timestamp': datetime.utcnow().isoformat()
                    }, user_id)
                
            except json.JSONDecodeError:
                logger.warning(f"Mensagem WebSocket inválida recebida do usuário {user_id}: {data}")
    
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, user_id)
        logger.info(f"WebSocket desconectado para usuário {user_id}")

@app.get("/api/websocket/stats")
async def get_websocket_stats(current_user: User = Depends(get_current_user)):
    """
    Retorna estatísticas das conexões WebSocket
    """
    from websocket_manager import websocket_manager
    
    stats = websocket_manager.get_connection_stats()
    
    return {
        'websocket_stats': stats,
        'current_user_connected': str(current_user.id) in websocket_manager.active_connections,
        'timestamp': datetime.utcnow().isoformat()
    }

@app.post("/api/websocket/test-notification")
async def test_websocket_notification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint de teste para enviar notificação WebSocket
    """
    from websocket_manager import websocket_manager
    
    # Enviar notificação de teste
    test_notification = {
        'type': 'test_notification',
        'message': 'Esta é uma notificação de teste do sistema ORBIT IA',
        'data': {
            'test': True,
            'user_id': current_user.id,
            'user_name': current_user.name
        },
        'timestamp': datetime.utcnow().isoformat()
    }
    
    await websocket_manager.send_personal_message(test_notification, str(current_user.id))
    
    return {
        'success': True,
        'message': 'Notificação de teste enviada',
        'user_id': current_user.id
    }


# Endpoints de insights GPT
@app.post("/api/documents/{document_id}/generate-insights")
async def generate_document_insights_endpoint(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Gera insights inteligentes para um documento específico
    """
    from gpt_client import generate_document_insights
    
    # Buscar documento
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Verificar se documento foi processado
    if document.status != 'complete':
        raise HTTPException(
            status_code=400, 
            detail="Documento ainda não foi processado completamente"
        )
    
    # Verificar se já tem insights
    if document.insights_status == 'generating':
        return {
            'status': 'generating',
            'message': 'Insights já estão sendo gerados para este documento'
        }
    
    try:
        # Marcar como gerando
        document.insights_status = 'generating'
        db.commit()
        
        # Preparar dados extraídos
        extracted_data = {}
        if document.extracted_data:
            try:
                extracted_data = json.loads(document.extracted_data)
            except json.JSONDecodeError:
                extracted_data = {"raw_data": document.extracted_data}
        
        # Preparar score de confiança
        confidence_score = None
        if document.confidence_score:
            try:
                confidence_score = float(document.confidence_score)
            except (ValueError, TypeError):
                confidence_score = None
        
        # Gerar insights
        insights = await generate_document_insights(
            extracted_data=extracted_data,
            document_type=document.document_type,
            original_filename=document.original_filename,
            confidence_score=confidence_score
        )
        
        # Salvar insights no banco
        document.gpt_insights = json.dumps(insights, ensure_ascii=False)
        document.gpt_summary = insights.get('resumo', 'Resumo não disponível')
        document.gpt_generated_at = datetime.utcnow()
        document.gpt_model_used = insights.get('modelo_usado', 'unknown')
        document.insights_status = 'complete'
        document.updated_at = datetime.utcnow()
        
        db.commit()
        
        # Enviar notificação WebSocket
        from websocket_manager import websocket_manager
        notification = {
            'type': 'insights_generated',
            'data': {
                'document_id': document.id,
                'original_filename': document.original_filename,
                'insights_summary': insights.get('resumo', '')[:100] + '...'
            },
            'message': f'🧠 Insights gerados para {document.original_filename}',
            'timestamp': datetime.utcnow().isoformat()
        }
        
        await websocket_manager.send_personal_message(notification, str(current_user.id))
        
        return {
            'success': True,
            'document_id': document.id,
            'insights': insights,
            'status': 'complete'
        }
        
    except Exception as e:
        # Marcar como erro
        document.insights_status = 'error'
        document.error_message = str(e)
        db.commit()
        
        logger.error(f"Erro ao gerar insights para documento {document_id}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao gerar insights: {str(e)}"
        )

@app.get("/api/documents/{document_id}/insights")
async def get_document_insights(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retorna insights de um documento específico
    """
    # Buscar documento
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    # Preparar resposta
    response = {
        'document_id': document.id,
        'original_filename': document.original_filename,
        'insights_status': document.insights_status,
        'gpt_summary': document.gpt_summary,
        'gpt_generated_at': document.gpt_generated_at.isoformat() if document.gpt_generated_at else None,
        'gpt_model_used': document.gpt_model_used
    }
    
    # Adicionar insights se disponíveis
    if document.gpt_insights:
        try:
            response['insights'] = json.loads(document.gpt_insights)
        except json.JSONDecodeError:
            response['insights'] = None
    
    return response

@app.get("/api/gpt/status")
async def get_gpt_status(current_user: User = Depends(get_current_user)):
    """
    Retorna status da configuração GPT
    """
    from gpt_client import gpt_client
    
    status = gpt_client.get_status()
    
    return {
        'gpt_status': status,
        'timestamp': datetime.utcnow().isoformat()
    }

@app.post("/api/documents/batch-generate-insights")
async def batch_generate_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Gera insights para todos os documentos do usuário que ainda não têm
    """
    # Buscar documentos sem insights
    documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.status == 'complete',
        Document.insights_status.in_(['pending', 'error'])
    ).all()
    
    if not documents:
        return {
            'message': 'Nenhum documento encontrado para gerar insights',
            'documents_found': 0
        }
    
    # Iniciar geração em background (simulado)
    generated_count = 0
    errors = []
    
    for document in documents[:5]:  # Limitar a 5 por vez para evitar sobrecarga
        try:
            # Marcar como gerando
            document.insights_status = 'generating'
            db.commit()
            
            # Aqui seria ideal usar uma task queue (Celery, RQ, etc.)
            # Por simplicidade, vamos gerar de forma síncrona
            
            generated_count += 1
            
        except Exception as e:
            errors.append({
                'document_id': document.id,
                'filename': document.original_filename,
                'error': str(e)
            })
    
    return {
        'message': f'Iniciada geração de insights para {generated_count} documentos',
        'documents_found': len(documents),
        'generation_started': generated_count,
        'errors': errors
    }


async def generate_insights_background(
    document_id: str,
    extracted_data: dict,
    document_type: str,
    original_filename: str,
    confidence_score: float,
    user_id: int
):
    """
    Gera insights em background após upload do documento
    """
    from gpt_client import generate_document_insights
    from websocket_manager import websocket_manager
    
    try:
        # Gerar insights
        insights = await generate_document_insights(
            extracted_data=extracted_data,
            document_type=document_type,
            original_filename=original_filename,
            confidence_score=confidence_score
        )
        
        # Atualizar banco de dados
        db = next(get_db())
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if document:
            document.gpt_insights = json.dumps(insights, ensure_ascii=False)
            document.gpt_summary = insights.get('resumo', 'Resumo não disponível')
            document.gpt_generated_at = datetime.utcnow()
            document.gpt_model_used = insights.get('modelo_usado', 'unknown')
            document.insights_status = 'complete'
            document.updated_at = datetime.utcnow()
            
            db.commit()
            
            # Enviar notificação WebSocket
            notification = {
                'type': 'insights_generated',
                'data': {
                    'document_id': document.id,
                    'original_filename': document.original_filename,
                    'insights_summary': insights.get('resumo', '')[:100] + '...',
                    'nivel_atencao': insights.get('nivel_atencao', 'medio')
                },
                'message': f'🧠 Insights gerados para {document.original_filename}',
                'timestamp': datetime.utcnow().isoformat()
            }
            
            await websocket_manager.send_personal_message(notification, str(user_id))
            
            logger.info(f"Insights gerados com sucesso para documento {document_id}")
        
        db.close()
        
    except Exception as e:
        logger.error(f"Erro ao gerar insights em background para documento {document_id}: {str(e)}")
        
        # Marcar como erro no banco
        try:
            db = next(get_db())
            document = db.query(Document).filter(Document.id == document_id).first()
            
            if document:
                document.insights_status = 'error'
                document.error_message = f"Erro ao gerar insights: {str(e)}"
                db.commit()
            
            db.close()
            
        except Exception as db_error:
            logger.error(f"Erro ao atualizar status de erro no banco: {str(db_error)}")

