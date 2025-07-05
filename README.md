# 🚀 ORBIT IA - Monorepositório

Plataforma inteligente de análise de documentos corporativos com **integração real da IA Wu3**, **webhooks assíncronos**, **notificações em tempo real via WebSocket**, autenticação JWT, dashboards personalizados por perfil e sistema completo de upload e processamento de documentos.

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

### 🔔 **Sistema de Webhooks e Notificações em Tempo Real**
- **Endpoint de webhook Wu3** com validação HMAC-SHA256
- **WebSocket manager** para notificações instantâneas
- **Toasts personalizados** com cores por tipo de notificação
- **Atualizações automáticas** de listas de documentos
- **Validação de IP** e assinatura para segurança
- **Reconexão automática** do WebSocket com retry

### 🎨 **Interface Visual Avançada**
- **Cores por score de confiança**: Verde (≥90%), Amarelo (70-89%), Vermelho (<70%)
- **Badges visuais** com ícones para cada nível de confiança
- **Indicador de status Wu3** em tempo real
- **Notificações toast** com animações suaves
- **Status de conexão WebSocket** no dashboard
- **Feedback detalhado** de sucesso e erro

## 🏗️ **Arquitetura**

```
orbit/
├── apps/
│   ├── backend/                 # FastAPI + PostgreSQL + Wu3 + WebSocket
│   │   ├── main.py             # Endpoints principais + WebSocket
│   │   ├── auth.py             # Autenticação JWT
│   │   ├── models.py           # Modelos SQLAlchemy + campos Wu3/webhook
│   │   ├── database.py         # Configuração do banco
│   │   ├── wu3_client.py       # Cliente real IA Wu3
│   │   ├── wu3_service.py      # Serviço mock (fallback)
│   │   ├── webhook_service.py  # Processamento de webhooks Wu3
│   │   ├── websocket_manager.py # Gerenciador de conexões WebSocket
│   │   ├── migrations/         # Migrations Alembic
│   │   └── uploads/            # Arquivos enviados
│   └── frontend/               # React + Tailwind CSS + WebSocket
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/     # Componentes reutilizáveis
│       │   │   │   ├── Wu3StatusIndicator.jsx
│       │   │   │   ├── DocumentUpload.jsx
│       │   │   │   ├── DocumentList.jsx
│       │   │   │   └── Toast.jsx
│       │   │   ├── admin/      # Específicos do admin
│       │   │   ├── client/     # Específicos do cliente
│       │   │   ├── partner/    # Específicos do parceiro
│       │   │   └── backoffice/ # Específicos do backoffice
│       │   ├── contexts/       # Gerenciamento de estado
│       │   │   ├── AuthContext.jsx
│       │   │   └── NotificationContext.jsx
│       │   ├── hooks/          # Hooks personalizados
│       │   │   ├── useWebSocket.js
│       │   │   └── useRealtimeUpdates.js
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
export WU3_WEBHOOK_SECRET="segreto123-change-in-production"

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
- **WebSocket**: ws://localhost:8000/ws/{user_id}

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

### **Webhooks e WebSocket**
- `POST /api/webhooks/wu3` - Receber webhook da Wu3
- `GET /api/webhooks/wu3/test` - Testar configuração de webhook
- `WS /ws/{user_id}` - Conexão WebSocket para notificações
- `GET /api/websocket/stats` - Estatísticas de conexões WebSocket
- `POST /api/websocket/test-notification` - Enviar notificação de teste

## 🔔 **Sistema de Webhooks Wu3**

### **Configuração do Webhook**
```env
# URL do webhook para configurar na Wu3
WEBHOOK_URL=https://orbit.yourdomain.com/api/webhooks/wu3

# Segredo compartilhado para validação HMAC
WU3_WEBHOOK_SECRET=segreto123-change-in-production

# IPs permitidos (opcional, para produção)
WEBHOOK_ALLOWED_IPS=127.0.0.1,::1,192.168.1.100
```

### **Formato do Webhook Wu3**
```json
{
  "document_id": "uuid-do-documento",
  "status": "complete|failed|processing",
  "extracted_data": {
    "cnpj": "12.345.678/0001-90",
    "razao_social": "Empresa Exemplo"
  },
  "confidence_score": 0.95,
  "processing_time": 1.2,
  "wu3_document_id": "wu3_uuid",
  "wu3_version": "2.1.0"
}
```

### **Validação de Segurança**
- ✅ **Assinatura HMAC-SHA256** no header `X-Wu3-Signature`
- ✅ **Validação de IP** (configurável)
- ✅ **Validação de payload** (campos obrigatórios)
- ✅ **Timeout configurável** para requisições
- ✅ **Logs detalhados** para auditoria

## 🔌 **Sistema WebSocket**

### **Conexão WebSocket**
```javascript
// Conectar ao WebSocket
const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

// Escutar notificações
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Notificação recebida:', notification);
};
```

### **Tipos de Notificação**
```javascript
// Conexão estabelecida
{
  "type": "connection_established",
  "message": "Conectado ao sistema de notificações",
  "timestamp": "2025-07-05T00:54:00Z"
}

// Documento processado
{
  "type": "document_processed",
  "data": {
    "document_id": "uuid",
    "status": "complete",
    "confidence_score": "0.95",
    "original_filename": "contrato.pdf"
  },
  "message": "✅ contrato.pdf processado com sucesso! (95.0%)",
  "timestamp": "2025-07-05T00:54:00Z"
}

// Notificação de teste
{
  "type": "test_notification",
  "message": "Esta é uma notificação de teste",
  "timestamp": "2025-07-05T00:54:00Z"
}
```

### **Funcionalidades WebSocket**
- ✅ **Reconexão automática** com backoff exponencial
- ✅ **Ping/Pong** para manter conexão viva
- ✅ **Múltiplas conexões** por usuário (múltiplas abas)
- ✅ **Estatísticas de conexão** em tempo real
- ✅ **Cleanup automático** de conexões mortas

## 🤖 **Configuração da IA Wu3**

### **Modo Produção (API Real)**
```env
WU3_API_URL=https://api.wu3.ai/process
WU3_API_KEY=seu_token_real_wu3_aqui
WU3_TIMEOUT_SECONDS=30
WU3_MAX_RETRIES=3
WU3_RETRY_DELAY=2
WU3_WEBHOOK_SECRET=segreto123-change-in-production
```

### **Modo Desenvolvimento (Fallback)**
```env
# Deixar WU3_API_KEY vazio ou com valor de exemplo
WU3_API_KEY=seu_token_real_wu3_aqui
WU3_WEBHOOK_SECRET=segreto123-change-in-production
```

### **Funcionalidades do Cliente Wu3**
- ✅ **Autenticação** via Bearer token
- ✅ **Retry automático** com backoff exponencial
- ✅ **Rate limit handling** (HTTP 429)
- ✅ **Timeout configurável** (padrão 30s)
- ✅ **Fallback para mock** quando API não disponível
- ✅ **Validação de configuração** em tempo real
- ✅ **Logs detalhados** para debugging
- ✅ **Webhook assíncrono** para resultados

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

# Webhook Configuration
WU3_WEBHOOK_SECRET=segreto123-change-in-production
WU3_WEBHOOK_TIMEOUT=30
WEBHOOK_ALLOWED_IPS=127.0.0.1,::1

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

-- Tabela de documentos (com campos Wu3 e webhook)
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
    
    -- Campos específicos para webhooks
    webhook_received BOOLEAN DEFAULT FALSE,
    webhook_received_at TIMESTAMP,
    
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
```

### **Testar Webhook Wu3**
```bash
# Simular webhook da Wu3
curl -X POST "http://localhost:8000/api/webhooks/wu3" \
  -H "Content-Type: application/json" \
  -H "X-Wu3-Signature: sha256=assinatura_hmac_aqui" \
  -d '{
    "document_id": "uuid-do-documento",
    "status": "complete",
    "extracted_data": {"cnpj": "12.345.678/0001-90"},
    "confidence_score": 0.95
  }'
```

### **Testar WebSocket**
```bash
# Conectar via wscat (instalar: npm install -g wscat)
wscat -c ws://localhost:8000/ws/1

# Enviar ping
{"type": "ping"}

# Solicitar estatísticas
{"type": "request_stats"}
```

### **Testar Notificação**
```bash
# Enviar notificação de teste
curl -X POST "http://localhost:8000/api/websocket/test-notification" \
  -H "Authorization: Bearer $TOKEN"
```

## 📈 **Próximas Funcionalidades**

### **Etapa 10 - Analytics e Relatórios Avançados**
- [ ] Gráficos de análise temporal
- [ ] Exportação em PDF/Excel
- [ ] Dashboards executivos
- [ ] Métricas de performance Wu3

### **Etapa 11 - Auditoria e Compliance**
- [ ] Log de todas as ações
- [ ] Trilha de auditoria
- [ ] Controle de versões de documentos
- [ ] Backup automático

### **Etapa 12 - Integrações Avançadas**
- [ ] API REST completa
- [ ] Integração com sistemas ERP
- [ ] Conectores para bancos de dados
- [ ] Webhooks bidirecionais

## 🛡️ **Segurança**

- **Autenticação JWT** com expiração configurável
- **Senhas criptografadas** com bcrypt
- **Validação de tipos de arquivo** no upload
- **Proteção de rotas** por perfil de usuário
- **CORS configurado** para frontend
- **Sanitização de dados** de entrada
- **Rate limiting** na integração Wu3
- **Retry seguro** com backoff exponencial
- **Validação HMAC** para webhooks
- **Validação de IP** para endpoints sensíveis
- **Logs de auditoria** para todas as operações

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
- 🟢 **WebSocket Conectado**: Notificações em tempo real ativas
- 🔴 **WebSocket Desconectado**: Notificações indisponíveis

### **Notificações Toast**
- ✅ **Sucesso**: Verde com ícone de check
- ❌ **Erro**: Vermelho com ícone de erro
- ⚠️ **Aviso**: Amarelo com ícone de alerta
- ℹ️ **Informação**: Azul com ícone de info

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

**🚀 ORBIT IA - Transformando documentos em inteligência empresarial com IA Wu3 e notificações em tempo real!**

