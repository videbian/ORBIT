# 🚀 ORBIT IA - Monorepositório

Plataforma inteligente de análise de documentos corporativos com IA Wu3, autenticação JWT, dashboards personalizados por perfil e sistema completo de upload e processamento de documentos.

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
- **Processamento automático** pela IA Wu3 (mockada)
- **Suporte a múltiplos formatos**: PDF, JPG, PNG, DOCX, DOC
- **Validação de arquivos** (tipo e tamanho até 10MB)
- **Extração de dados estruturados** com scores de confiança
- **Visualização completa** dos resultados processados

### 🤖 **Integração com IA Wu3 (Mockada)**
- **Processamento por tipo de documento**: contratos, notas fiscais, identidades, etc.
- **Extração de dados realistas**: CNPJ, razão social, valores, datas, etc.
- **Scores de confiança** entre 75% e 99%
- **Metadados de processamento**: tempo, versão do modelo, etc.
- **Estrutura preparada** para integração real com API Wu3

## 🏗️ **Arquitetura**

```
orbit/
├── apps/
│   ├── backend/                 # FastAPI + PostgreSQL
│   │   ├── main.py             # Endpoints principais
│   │   ├── auth.py             # Autenticação JWT
│   │   ├── models.py           # Modelos SQLAlchemy
│   │   ├── database.py         # Configuração do banco
│   │   ├── wu3_service.py      # Serviço IA Wu3 (mock)
│   │   ├── migrations/         # Migrations Alembic
│   │   └── uploads/            # Arquivos enviados
│   └── frontend/               # React + Tailwind CSS
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/     # Componentes reutilizáveis
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
DATABASE_URL=postgresql://orbit:orbit@localhost:5432/orbit
JWT_SECRET=orbit-ia-secret-key-2024-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=2
WU3_API_KEY=dummy
STORAGE_PATH=./uploads
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

-- Tabela de documentos
CREATE TABLE documents (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    document_type VARCHAR NOT NULL,
    original_filename VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    extracted_data VARCHAR,
    confidence_score VARCHAR,
    status VARCHAR DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT NOW()
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

# Listar documentos
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/documents"
```

## 📈 **Próximas Funcionalidades**

### **Etapa 8 - Integração Real com IA Wu3**
- [ ] Conectar com API real da IA Wu3
- [ ] Implementar autenticação com tokens Wu3
- [ ] Processar documentos em tempo real
- [ ] Melhorar precisão da extração

### **Etapa 9 - Notificações em Tempo Real**
- [ ] WebSockets para status de processamento
- [ ] Notificações push no dashboard
- [ ] Emails de conclusão de análise

### **Etapa 10 - Relatórios Avançados**
- [ ] Gráficos de análise temporal
- [ ] Exportação em PDF/Excel
- [ ] Dashboards executivos
- [ ] Métricas de performance

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

**🚀 ORBIT IA - Transformando documentos em inteligência empresarial!**

