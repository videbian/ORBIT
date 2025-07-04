from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from auth import (
    LoginRequest, LoginResponse, UserProfile,
    authenticate_user, create_access_token, get_current_user,
    verify_role, verify_roles
)

app = FastAPI(
    title="ORBIT IA Backend", 
    version="1.0.0",
    description="Backend da plataforma ORBIT IA com autenticação JWT e controle de acesso por perfis"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ORBIT IA Backend está online"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    Endpoint de login que autentica usuário e retorna token JWT
    """
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token JWT
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    
    return LoginResponse(
        token=access_token,
        role=user["role"],
        user={
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "created_at": user["created_at"]
        }
    )

@app.get("/api/user/profile", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Endpoint protegido que retorna o perfil do usuário autenticado
    """
    return UserProfile(
        email=current_user["email"],
        name=current_user["name"],
        role=current_user["role"],
        created_at=current_user["created_at"]
    )

@app.get("/api/admin/dashboard")
async def admin_dashboard(current_user: dict = Depends(verify_role("admin"))):
    """
    Endpoint exclusivo para administradores
    """
    return {
        "message": f"Bem-vindo ao painel administrativo, {current_user['name']}!",
        "data": {
            "total_users": 4,
            "active_sessions": 12,
            "system_status": "online",
            "last_backup": "2024-07-04T20:00:00Z"
        }
    }

@app.get("/api/client/dashboard")
async def client_dashboard(current_user: dict = Depends(verify_role("client"))):
    """
    Endpoint exclusivo para clientes
    """
    return {
        "message": f"Bem-vindo ao seu painel, {current_user['name']}!",
        "data": {
            "active_projects": 3,
            "pending_tasks": 7,
            "completed_tasks": 25,
            "next_meeting": "2024-07-05T14:00:00Z"
        }
    }

@app.get("/api/partner/dashboard")
async def partner_dashboard(current_user: dict = Depends(verify_role("partner"))):
    """
    Endpoint exclusivo para parceiros
    """
    return {
        "message": f"Bem-vindo ao portal de parceiros, {current_user['name']}!",
        "data": {
            "active_partnerships": 5,
            "revenue_share": "R$ 15.750,00",
            "pending_approvals": 2,
            "performance_score": 94.5
        }
    }

@app.get("/api/backoffice/dashboard")
async def backoffice_dashboard(current_user: dict = Depends(verify_role("backoffice"))):
    """
    Endpoint exclusivo para equipe de backoffice
    """
    return {
        "message": f"Bem-vindo ao backoffice, {current_user['name']}!",
        "data": {
            "pending_tickets": 8,
            "resolved_today": 15,
            "escalated_issues": 2,
            "team_performance": "98.2%"
        }
    }

@app.get("/api/protected/multi-role")
async def multi_role_endpoint(current_user: dict = Depends(verify_roles(["admin", "backoffice"]))):
    """
    Endpoint acessível por múltiplos perfis (admin e backoffice)
    """
    return {
        "message": f"Acesso autorizado para {current_user['name']} ({current_user['role']})",
        "data": {
            "shared_resources": ["reports", "analytics", "user_management"],
            "access_level": "elevated"
        }
    }

@app.get("/api/users/list")
async def list_users(current_user: dict = Depends(verify_roles(["admin", "backoffice"]))):
    """
    Lista usuários (apenas admin e backoffice)
    """
    from auth import USERS_DB
    
    users_list = []
    for email, user_data in USERS_DB.items():
        users_list.append({
            "email": email,
            "name": user_data["name"],
            "role": user_data["role"],
            "created_at": user_data["created_at"]
        })
    
    return {
        "users": users_list,
        "total": len(users_list),
        "requested_by": current_user["name"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

