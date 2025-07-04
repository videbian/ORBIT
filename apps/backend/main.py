from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db, create_tables
from models import User
from auth import (
    LoginRequest, RegisterRequest, LoginResponse, UserProfile, UserCreate,
    authenticate_user, create_access_token, get_current_user, create_user,
    verify_admin, get_user_by_email
)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

