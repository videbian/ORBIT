# 🚀 ORBIT IA - Monorepositório

Bem-vindo ao **ORBIT IA**, um monorepositório moderno e escalável para desenvolvimento de aplicações full-stack com inteligência artificial.

## 📁 Estrutura do Projeto

```
orbit/
├── apps/                    # Aplicações principais
│   ├── frontend/           # Aplicação frontend (React + Vite)
│   └── backend/            # Aplicação backend (FastAPI + PostgreSQL)
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
- **Backend**: API robusta e escalável (FastAPI + Python + PostgreSQL)
- **Autenticação**: Sistema JWT com perfis de usuário (admin, cliente, parceiro, backoffice)
- **Banco de Dados**: PostgreSQL para persistência de dados
- **Cache**: Redis para cache e sessões
- **Packages**: Bibliotecas e utilitários compartilhados

## 🛠️ Tecnologias

### Frontend
- **React 18** com Vite
- **Tailwind CSS** para estilização
- **Context API** para gerenciamento de estado
- **Lucide Icons** para ícones

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** para ORM
- **Alembic** para migrations
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Uvicorn** como servidor ASGI

### Infraestrutura
- **PostgreSQL 15** como banco de dados
- **Redis 7** para cache
- **Docker & Docker Compose** para containerização

## 📋 Pré-requisitos

- **Docker** e **Docker Compose**
- **Node.js 18+** (para desenvolvimento local)
- **Python 3.11+** (para desenvolvimento local)
- **PostgreSQL 15+** (para desenvolvimento local)

## 🚀 Início Rápido

### 1. Clonar o repositório
```bash
git clone https://github.com/videbian/ORBIT.git
cd ORBIT
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Iniciar com Docker Compose
```bash
docker-compose up --build
```

### 4. Acessar as aplicações
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔐 Sistema de Autenticação

### Perfis de Usuário
- **admin**: Administrador do sistema
- **client**: Cliente da plataforma
- **partner**: Parceiro estratégico
- **backoffice**: Operador de backoffice

### Endpoints de Autenticação
- `POST /api/login` - Login com email e senha
- `POST /api/user/register` - Registro de novo usuário
- `GET /api/user/profile` - Perfil do usuário autenticado

### Usuários de Demonstração
Para testes, você pode criar usuários com os seguintes dados:

```json
{
  "email": "admin@orbit.com",
  "password": "admin123",
  "name": "Administrador ORBIT",
  "role": "admin"
}
```

## 🗄️ Banco de Dados

### Configuração Local
```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Criar banco e usuário
sudo -u postgres psql
CREATE DATABASE orbit;
CREATE USER orbit WITH PASSWORD 'orbit';
GRANT ALL PRIVILEGES ON DATABASE orbit TO orbit;
\q
```

### Migrations
```bash
cd apps/backend

# Criar nova migration
alembic revision --autogenerate -m "descrição da mudança"

# Aplicar migrations
alembic upgrade head

# Verificar histórico
alembic history
```

## 🧪 Desenvolvimento Local

### Backend
```bash
cd apps/backend

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
export DATABASE_URL="postgresql://orbit:orbit@localhost:5432/orbit"
export JWT_SECRET="orbit-ia-secret-key-2024"

# Executar migrations
alembic upgrade head

# Iniciar servidor
python main.py
```

### Frontend
```bash
cd apps/frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🧪 Testes

### Backend
```bash
cd apps/backend
pytest
```

### Frontend
```bash
cd apps/frontend
npm test
```

## 📦 Estrutura de Dados

### Modelo User
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT com expiração de 2 horas
- CORS configurado para desenvolvimento
- Validação de dados com Pydantic
- Proteção de rotas por perfil de usuário

## 📚 Documentação da API

A documentação interativa da API está disponível em:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- **Email**: orbit@videbian.com
- **GitHub Issues**: https://github.com/videbian/ORBIT/issues

---

**ORBIT IA** - Transformando dados em inteligência 🚀

