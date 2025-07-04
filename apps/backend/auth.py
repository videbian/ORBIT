"""
Módulo de autenticação para ORBIT IA
Implementa JWT, verificação de usuários e controle de acesso por perfis
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Configurações
JWT_SECRET = "orbit-ia-secret-key-2024"  # Em produção, usar variável de ambiente
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 2

# Esquema de segurança
security = HTTPBearer()

# Modelos Pydantic
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    user: Dict[str, Any]

class UserProfile(BaseModel):
    email: str
    name: str
    role: str
    created_at: str

# Base de dados mockada de usuários
# Em produção, isso seria substituído por consultas ao banco de dados
USERS_DB = {
    "admin@orbit.com": {
        "password": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "admin",
        "name": "Administrador ORBIT",
        "created_at": "2024-01-01T00:00:00Z"
    },
    "cliente@orbit.com": {
        "password": bcrypt.hashpw("cliente123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "client",
        "name": "Cliente Exemplo",
        "created_at": "2024-01-15T00:00:00Z"
    },
    "parceiro@orbit.com": {
        "password": bcrypt.hashpw("parceiro123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "partner",
        "name": "Parceiro Estratégico",
        "created_at": "2024-02-01T00:00:00Z"
    },
    "backoffice@orbit.com": {
        "password": bcrypt.hashpw("backoffice123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "backoffice",
        "name": "Equipe Backoffice",
        "created_at": "2024-01-10T00:00:00Z"
    }
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha fornecida corresponde ao hash armazenado"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Autentica um usuário com email e senha"""
    user = USERS_DB.get(email)
    if not user:
        return None
    
    if not verify_password(password, user["password"]):
        return None
    
    # Retorna dados do usuário sem a senha
    user_data = user.copy()
    del user_data["password"]
    user_data["email"] = email
    return user_data

def create_access_token(data: Dict[str, Any]) -> str:
    """Cria um token JWT com os dados fornecidos"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Verifica e decodifica um token JWT"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token_data: Dict[str, Any] = Depends(verify_token)) -> Dict[str, Any]:
    """Obtém o usuário atual baseado no token"""
    email = token_data.get("sub")
    user = USERS_DB.get(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado"
        )
    
    user_data = user.copy()
    del user_data["password"]
    user_data["email"] = email
    return user_data

def verify_role(required_role: str):
    """Decorator para verificar se o usuário tem o perfil necessário"""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso negado. Perfil '{required_role}' necessário."
            )
        return current_user
    return role_checker

def verify_roles(allowed_roles: list):
    """Decorator para verificar se o usuário tem um dos perfis permitidos"""
    def roles_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso negado. Um dos perfis necessários: {', '.join(allowed_roles)}"
            )
        return current_user
    return roles_checker

