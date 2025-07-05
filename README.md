# 🚀 ORBIT IA - Monorepositório

Plataforma inteligente de análise de documentos corporativos com **integração real da IA Wu3**, autenticação JWT, dashboards personalizados por perfil e sistema completo de upload e processamento de documentos.

## 📋 **Funcionalidades Implementadas**

### 🔐 **Sistema de Autenticação Completo**
- **Login/Logout** com JWT tokens
- **Registro de usuários** com validação
- **Proteção de rotas** por perfil (admin, cliente, parceiro, backoffice)
- **Persistência no PostgreSQL** com senhas criptografadas (bcrypt)
- **Middleware de autenticação** para todas as rotas protegidas

### 🎨 **Dashboards Personalizados por Perfil**
- **Dashboard Administrador** (`/admin`): Gestão de usuários e sistema
- **Dashboard Cliente** (`/cliente`): Upload de documentos e análises
- **Dashboard Parceiro** (`/parceiro`): Gestão comercial e propostas
- **Dashboard Backoffice** (`/backoffice`): Suporte e monitoramento
- **Componentes reutilizáveis**: DashboardLayout, StatsCard, ActionCard
- **Design responsivo** com Tailwind CSS e cores específicas por perfil

### 📄 **Sistema de Upload e Processamento de Documentos**
- **Upload inteligente** com drag-and-drop
- **Processamento automático** pela IA Wu3 (real + fallback)
- **Suporte a múltiplos formatos**: PDF, JPG, PNG, DOCX, DOC
- **Validação de arquivos** (tipo e tamanho até 10MB)
- **Extração de dados estruturados** com scores de confiança
- **Visualização completa** dos resultados processados

### 🤖 **Integração Real com IA Wu3**
- **Cliente Wu3 completo** com autenticação via token
- **Fallback automático** para modo mock quando API não configurada
- **Retry automático** com backoff exponencial para rate limits
- **Tratamento robusto de erros** (401, 413, 429, etc.)
- **Monitoramento de status** da configuração Wu3
- **Processamento assíncrono** preparado para webhooks

### 🎨 **Interface Visual Avançada**
- **Cores por score de confiança**: Verde (≥90%), Amarelo (70-89%), Vermelho (<70%)
- **Badges visuais** com ícones para cada nível de confiança
- **Indicador de status Wu3** em tempo real
- **Feedback detalhado** de sucesso e erro
- **Tooltips informativos** com detalhes técnicos

## 🏗️ **Arquitetura**

```
orbit/
├── apps/
│   ├── backend/                 # FastAPI + PostgreSQL + Wu3
│   │   ├── main.py             # Endpoints principais
│   │   ├── auth.py             # Autenticação JWT
│   │   ├── models.py           # Modelos SQLAlchemy + campos Wu3
│   │   ├── database.py         # Configuração do banco
│   │   ├── wu3_client.py       # Cliente real IA Wu3
│   │   ├── wu3_service.py      # Serviço mock (fallback)
│   │   ├── migrations/         # Migrations Alembic
│   │   └── uploads/            # Arquivos enviados
│   └── frontend/               # React + Tailwind CSS
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/     # Componentes reutilizáveis
│       │   │   │   ├── Wu3StatusIndicator.jsx
│       │   │   │   ├── DocumentUpload.jsx
│       │   │   │   └── DocumentList.jsx
│       │   │   ├── admin/      # Específicos do admin
│       │   │   ├── client/     # Específicos do cliente
│       │   │   ├── partner/    # Específicos do parceiro
│       │   │   └── backoffice/ # Específicos do backoffice
│       │   ├── pages/          # Dashboards principais
│       │   └── contexts/       # Gerenciamento de estado
├── packages/                   # Pacotes compartilhados (futuro)
├── .github/workflows/          # CI/CD automatizado
└── README.md                   # Esta documentação
```

## 🚀 **Como Executar**

### **Pré-requisitos**
- Python 3.11+
- Node.js 20+
- PostgreSQL 12+
- Git
- **Token da IA Wu3** (opcional - usa fallback se não configurado)

### **1. Configurar Backend**

```bash
# Navegar para o backend
cd apps/backend

# Instalar dependências
pip install -r requirements.txt

# Configurar banco PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE orbit;"
sudo -u postgres psql -c "CREATE USER orbit WITH PASSWORD 'orbit';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE orbit TO orbit;"

# Configurar variáveis de ambiente
export DATABASE_URL="postgresql://orbit:orbit@localhost:5432/orbit"
export WU3_API_URL="https://api.wu3.ai/process"
export WU3_API_KEY="seu_token_real_wu3_aqui"  # Opcional

# Executar migrations
alembic upgrade head

# Iniciar servidor
python main.py
```

### **2. Configurar Frontend**

```bash
# Navegar para o frontend
cd apps/frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### **3. Acessar a Aplicação**

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

## 👥 **Usuários de Demonstração**

```bash
# Administrador
Email: admin@orbit.com
Senha: admin123

# Cliente  
Email: cliente@orbit.com
Senha: cliente123

# Parceiro
Email: parceiro@orbit.com  
Senha: parceiro123

# Backoffice
Email: backoffice@orbit.com
Senha: backoffice123
```

## 📊 **Endpoints da API**

### **Autenticação**
- `POST /api/login` - Login com email/senha
- `POST /api/user/register` - Registro de usuário
- `GET /api/user/profile` - Perfil do usuário logado

### **Dashboards**
- `GET /api/admin/dashboard` - Dados do dashboard admin
- `GET /api/client/dashboard` - Dados do dashboard cliente
- `GET /api/partner/dashboard` - Dados do dashboard parceiro
- `GET /api/backoffice/dashboard` - Dados do dashboard backoffice

### **Documentos**
- `POST /api/documents/upload` - Upload de documento
- `GET /api/documents` - Listar documentos do usuário
- `GET /api/documents/{id}` - Detalhes de um documento
- `GET /api/documents/stats` - Estatísticas de documentos
- `GET /api/documents/types` - Tipos suportados

### **IA Wu3**
- `GET /api/wu3/status` - Status da configuração Wu3
- `GET /api/wu3/document/{wu3_document_id}/status` - Status de documento na Wu3

## 🤖 **Configuração da IA Wu3**

### **Modo Produção (API Real)**
```env
WU3_API_URL=https://api.wu3.ai/process
WU3_API_KEY=seu_token_real_wu3_aqui
WU3_TIMEOUT_SECONDS=30
WU3_MAX_RETRIES=3
WU3_RETRY_DELAY=2
```

### **Modo Desenvolvimento (Fallback)**
```env
# Deixar WU3_API_KEY vazio ou com valor de exemplo
WU3_API_KEY=seu_token_real_wu3_aqui
```

### **Funcionalidades do Cliente Wu3**
- ✅ **Autenticação** via Bearer token
- ✅ **Retry automático** com backoff exponencial
- ✅ **Rate limit handling** (HTTP 429)
- ✅ **Timeout configurável** (padrão 30s)
- ✅ **Fallback para mock** quando API não disponível
- ✅ **Validação de configuração** em tempo real
- ✅ **Logs detalhados** para debugging

## 🎯 **Tipos de Documento Suportados**

| Tipo | Descrição | Dados Extraídos |
|------|-----------|-----------------|
| `contract` | Contratos comerciais | CNPJ, razão social, valores, datas |
| `invoice` | Notas fiscais | Números, impostos, valores, datas |
| `identity` | Documentos de identidade | CPF, RG, nome, filiação |
| `financial` | Extratos bancários | Banco, conta, saldo, movimentações |
| `legal` | Documentos jurídicos | Processos, partes, decisões |
| `medical` | Laudos médicos | Paciente, diagnóstico, exames |
| `academic` | Diplomas e certificados | Instituição, curso, data |
| `other` | Outros tipos | Texto extraído, entidades |

## 🔧 **Configurações de Desenvolvimento**

### **Variáveis de Ambiente (.env)**
```env
# Database
DATABASE_URL=postgresql://orbit:orbit@localhost:5432/orbit

# Authentication
JWT_SECRET=orbit-ia-secret-key-2024-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=2

# IA Wu3
WU3_API_URL=https://api.wu3.ai/process
WU3_API_KEY=seu_token_real_wu3_aqui
WU3_TIMEOUT_SECONDS=30
WU3_MAX_RETRIES=3
WU3_RETRY_DELAY=2

# Storage
STORAGE_PATH=./uploads
MAX_FILE_SIZE_MB=10
ALLOWED_EXTENSIONS=.pdf,.jpg,.jpeg,.png,.docx,.doc
```

### **Estrutura do Banco de Dados**

```sql
-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de documentos (com campos Wu3)
CREATE TABLE documents (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    document_type VARCHAR NOT NULL,
    original_filename VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    extracted_data VARCHAR,
    confidence_score VARCHAR,
    status VARCHAR DEFAULT 'processing',
    
    -- Campos específicos Wu3
    wu3_document_id VARCHAR,
    wu3_request_id VARCHAR,
    error_message VARCHAR,
    processing_time_seconds VARCHAR,
    wu3_version VARCHAR,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 **Testes**

### **Testar Upload via cURL**
```bash
# Fazer login
TOKEN=$(curl -s -X POST "http://localhost:8000/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "cliente@orbit.com", "password": "cliente123"}' \
  | jq -r '.token')

# Upload de documento
curl -X POST "http://localhost:8000/api/documents/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@documento.pdf" \
  -F "document_type=contract"

# Verificar status Wu3
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/wu3/status"
```

### **Resposta de Upload Bem-sucedido**
```json
{
  "status": "success",
  "document_id": "uuid-do-documento",
  "message": "Documento processado com sucesso",
  "extracted_data": {
    "cnpj": "12.345.678/0001-90",
    "razao_social": "Empresa Digital Offshore Ltda",
    "valor_contrato": "R$ 250.000,00"
  },
  "confidence_score": 0.924,
  "wu3_document_id": "wu3_uuid-do-documento",
  "processing_time": 0.64
}
```

## 📈 **Próximas Funcionalidades**

### **Etapa 9 - Webhooks e Notificações em Tempo Real**
- [ ] Recebimento de webhooks da Wu3
- [ ] WebSockets para status em tempo real
- [ ] Notificações push no dashboard
- [ ] Fila de processamento com Celery

### **Etapa 10 - Relatórios Avançados**
- [ ] Gráficos de análise temporal
- [ ] Exportação em PDF/Excel
- [ ] Dashboards executivos
- [ ] Métricas de performance Wu3

### **Etapa 11 - Auditoria e Compliance**
- [ ] Log de todas as ações
- [ ] Trilha de auditoria
- [ ] Controle de versões de documentos
- [ ] Backup automático

## 🛡️ **Segurança**

- **Autenticação JWT** com expiração configurável
- **Senhas criptografadas** com bcrypt
- **Validação de tipos de arquivo** no upload
- **Proteção de rotas** por perfil de usuário
- **CORS configurado** para frontend
- **Sanitização de dados** de entrada
- **Rate limiting** na integração Wu3
- **Retry seguro** com backoff exponencial

## 🎨 **Interface Visual**

### **Cores por Score de Confiança**
- 🟢 **Verde (≥90%)**: Alta confiança - dados muito confiáveis
- 🟡 **Amarelo (70-89%)**: Média confiança - revisar dados importantes
- 🔴 **Vermelho (<70%)**: Baixa confiança - verificação manual necessária

### **Indicadores Visuais**
- ✅ **IA Wu3 Conectada**: API configurada e funcionando
- ⚠️ **Modo Fallback (Mock)**: Usando processamento simulado
- 🔄 **Processando**: Documento sendo analisado
- ❌ **Erro**: Falha no processamento

## 📝 **Licença**

Este projeto é propriedade da **ORBIT IA** e está protegido por direitos autorais.

## 🤝 **Contribuição**

Para contribuir com o projeto:

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 **Suporte**

Para suporte técnico ou dúvidas sobre o projeto, entre em contato com a equipe de desenvolvimento da ORBIT IA.

---

**🚀 ORBIT IA - Transformando documentos em inteligência empresarial com IA Wu3!**

