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

