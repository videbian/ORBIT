# 🚀 ORBIT IA - Monorepositório

Bem-vindo ao **ORBIT IA**, um monorepositório moderno e escalável para desenvolvimento de aplicações full-stack com inteligência artificial.

## 📁 Estrutura do Projeto

```
orbit/
├── apps/                    # Aplicações principais
│   ├── frontend/           # Aplicação frontend (React + Vite)
│   └── backend/            # Aplicação backend (FastAPI)
├── packages/               # Pacotes compartilhados
├── .github/workflows/      # Workflows de CI/CD
├── docker-compose.yml      # Configuração dos serviços
├── .env.example           # Variáveis de ambiente de exemplo
├── README.md              # Este arquivo
├── .gitignore             # Arquivos ignorados pelo Git
└── .editorconfig          # Configurações do editor
```

## 🎯 Sobre o Projeto

O ORBIT IA é um sistema completo que integra:

- **Frontend**: Interface de usuário moderna e responsiva (React + Tailwind CSS)
- **Backend**: API robusta e escalável (FastAPI + Python)
- **Banco de Dados**: PostgreSQL para persistência de dados
- **Cache**: Redis para cache e sessões
- **Packages**: Bibliotecas e utilitários compartilhados

## 🛠️ Tecnologias

### Frontend
- **React 18** com Vite
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Lucide Icons** para ícones

### Backend
- **FastAPI** (Python)
- **Uvicorn** como servidor ASGI
- **Pydantic** para validação de dados

### Infraestrutura
- **PostgreSQL 15** como banco de dados
- **Redis 7** para cache
- **Docker & Docker Compose** para containerização

## 📋 Pré-requisitos

- **Docker** e **Docker Compose**
- **Git**

## 🚀 Início Rápido

### 1. Clone o repositório
```bash
git clone https://github.com/videbian/orbit.git
cd orbit
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

### 3. Inicie todos os serviços
```bash
docker-compose up --build
```

### 4. Acesse as aplicações
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔍 Endpoints Disponíveis

### Backend (FastAPI)
- `GET /` - Página inicial da API
- `GET /api/health` - Health check (retorna `{"status": "ok"}`)
- `GET /docs` - Documentação interativa da API (Swagger)

## 🐳 Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up --build

# Iniciar em background
docker-compose up -d --build

# Parar todos os serviços
docker-compose down

# Ver logs de um serviço específico
docker-compose logs frontend
docker-compose logs backend

# Reconstruir apenas um serviço
docker-compose build backend
docker-compose up backend

# Limpar volumes (cuidado: remove dados do banco)
docker-compose down -v
```

## 📦 Estrutura de Desenvolvimento

### Apps
- **frontend/**: Aplicação React com Vite
  - Porta: 3000
  - Hot reload habilitado
- **backend/**: API FastAPI
  - Porta: 8000
  - Auto-reload habilitado

### Serviços
- **PostgreSQL**: Banco de dados principal
- **Redis**: Cache e sessões

## 🔧 Scripts de Desenvolvimento

### Frontend
```bash
cd apps/frontend
pnpm install
pnpm run dev
```

### Backend
```bash
cd apps/backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ pela equipe ORBIT IA.

---

**Status**: ✅ Ambiente local configurado com Docker Compose



## 🔐 Sistema de Autenticação

O ORBIT IA implementa um sistema completo de autenticação baseado em JWT (JSON Web Tokens) com controle de acesso por perfis.

### Perfis de Usuário

O sistema suporta 4 tipos de perfis:

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| **Admin** | Administrador do sistema | Acesso total, gerenciamento de usuários |
| **Client** | Cliente da plataforma | Dashboard de projetos e tarefas |
| **Partner** | Parceiro estratégico | Portal de parcerias e métricas |
| **Backoffice** | Equipe de suporte | Ferramentas de backoffice e tickets |

### Fluxo de Autenticação

1. **Login**: Usuário fornece email e senha
2. **Validação**: Backend verifica credenciais contra base de dados
3. **Token JWT**: Sistema gera token com expiração de 2 horas
4. **Armazenamento**: Token é salvo no localStorage do navegador
5. **Autorização**: Cada requisição inclui token no header Authorization
6. **Verificação**: Backend valida token e permissões para cada endpoint

### Endpoints de Autenticação

#### POST `/api/login`
Autentica usuário e retorna token JWT.

**Request:**
```json
{
  "email": "usuario@orbit.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "user": {
    "email": "admin@orbit.com",
    "name": "Administrador ORBIT",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/user/profile`
Retorna perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "email": "admin@orbit.com",
  "name": "Administrador ORBIT",
  "role": "admin",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Usuários de Demonstração

Para testes, o sistema inclui usuários pré-configurados:

| Email | Senha | Perfil |
|-------|-------|--------|
| `admin@orbit.com` | `admin123` | Administrador |
| `cliente@orbit.com` | `cliente123` | Cliente |
| `parceiro@orbit.com` | `parceiro123` | Parceiro |
| `backoffice@orbit.com` | `backoffice123` | Backoffice |

### Proteção de Rotas

#### Frontend
- **AuthContext**: Gerencia estado global de autenticação
- **PrivateRoute**: Componente para proteger rotas por perfil
- **Redirecionamento**: Usuários não autenticados são redirecionados para `/login`

#### Backend
- **JWT Middleware**: Valida tokens em endpoints protegidos
- **Role Verification**: Verifica permissões baseadas no perfil do usuário
- **Decorators**: `@verify_role()` e `@verify_roles()` para controle de acesso

### Configuração de Segurança

As configurações de JWT estão no arquivo `.env`:

```env
JWT_SECRET=orbit-ia-secret-key-2024-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=2
```

⚠️ **Importante**: Em produção, altere o `JWT_SECRET` para uma chave segura e única.

### Rotas Protegidas por Perfil

| Rota | Perfil Necessário | Descrição |
|------|------------------|-----------|
| `/admin` | admin | Painel administrativo |
| `/cliente` | client | Dashboard do cliente |
| `/parceiro` | partner | Portal do parceiro |
| `/backoffice` | backoffice | Ferramentas de backoffice |
| `/api/admin/*` | admin | Endpoints administrativos |
| `/api/client/*` | client | Endpoints do cliente |
| `/api/partner/*` | partner | Endpoints do parceiro |
| `/api/backoffice/*` | backoffice | Endpoints do backoffice |

### Logout e Segurança

- **Logout**: Remove token do localStorage e redireciona para login
- **Expiração**: Tokens expiram automaticamente em 2 horas
- **Validação**: Tokens inválidos ou expirados resultam em logout automático
- **CORS**: Configurado para permitir requisições do frontend

