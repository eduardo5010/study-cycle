# 🎯 StudyCycle API

Backend Node.js/Express com PostgreSQL para sincronização online/offline da aplicação StudyCycle.

## 📦 Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **ORM:** Drizzle
- **Database:** PostgreSQL 16
- **Auth:** JWT
- **Validation:** Zod

## 🚀 Desenvolvimento

### Variáveis de Ambiente

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@localhost:5432/studycycle
PORT=3001
NODE_ENV=development
JWT_SECRET=seu-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Iniciar

```bash
# Criar/aplicar migrações
npm run db:migrate

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm run start
```

### Studio (Visualizar/editar dados)

```bash
npm run db:studio
```

Abre interface em http://localhost:3001

## 📊 Banco de Dados

### Schema

#### Users (Usuários)

```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (TEXT, hashed)
- firstName, lastName (VARCHAR)
- avatar (TEXT - URL)
- createdAt, updatedAt (TIMESTAMP)
```

#### StudyCycles (Ciclos de Estudo)

```sql
- id (UUID, PK)
- userId (UUID, FK → users)
- name, description (VARCHAR/TEXT)
- startDate, endDate (TIMESTAMP)
- isActive (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)
```

#### Subjects (Disciplinas)

```sql
- id (UUID, PK)
- studyCycleId (UUID, FK → study_cycles)
- name, code (VARCHAR)
- description (TEXT)
- credits (INTEGER)
- color (VARCHAR - hex color)
- createdAt, updatedAt (TIMESTAMP)
```

#### Courses (Aulas)

```sql
- id (UUID, PK)
- subjectId (UUID, FK → subjects)
- name, teacher (VARCHAR)
- schedule (VARCHAR - "Seg/Qua 10:00-12:00")
- room (VARCHAR)
- createdAt, updatedAt (TIMESTAMP)
```

#### SyncLogs (Histórico de Sincronizações)

```sql
- id (UUID, PK)
- userId (UUID, FK)
- entityType (VARCHAR - "study_cycle", "subject", "course")
- entityId (UUID)
- operation (VARCHAR - "create", "update", "delete")
- changes (JSONB - dados das mudanças)
- synced (BOOLEAN)
- syncedAt (TIMESTAMP)
- createdAt (TIMESTAMP)
```

#### SyncQueue (Fila de Sincronizações Pendentes)

```sql
- id (UUID, PK)
- userId (UUID, FK)
- payload (JSONB)
- retries (INTEGER)
- lastError (TEXT)
- createdAt (TIMESTAMP)
```

## 🔌 Endpoints

### Autenticação

#### POST `/api/auth/register`

Registrar novo usuário

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "João",
    "lastName": "Silva"
  }'
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### POST `/api/auth/login`

Fazer login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### POST `/api/auth/refresh`

Renovar token JWT

```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Authorization: Bearer <old_token>"
```

### Study Cycles

#### GET `/api/study-cycles`

Listar todos os ciclos do usuário

```bash
curl -X GET http://localhost:3001/api/study-cycles \
  -H "Authorization: Bearer <token>"
```

#### POST `/api/study-cycles`

Criar novo ciclo

```bash
curl -X POST http://localhost:3001/api/study-cycles \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Semestre 2024/1",
    "description": "Ciclo de primavera",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-06-30T23:59:59Z"
  }'
```

#### GET `/api/study-cycles/:id`

Obter ciclo específico

```bash
curl -X GET http://localhost:3001/api/study-cycles/uuid \
  -H "Authorization: Bearer <token>"
```

#### PUT `/api/study-cycles/:id`

Atualizar ciclo

```bash
curl -X PUT http://localhost:3001/api/study-cycles/uuid \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Semestre 2024/2",
    "isActive": true
  }'
```

#### DELETE `/api/study-cycles/:id`

Deletar ciclo

```bash
curl -X DELETE http://localhost:3001/api/study-cycles/uuid \
  -H "Authorization: Bearer <token>"
```

### Subjects (Disciplinas)

Endpoints similares:

- `GET /api/subjects`
- `POST /api/subjects`
- `GET /api/subjects/:id`
- `PUT /api/subjects/:id`
- `DELETE /api/subjects/:id`

### Courses (Aulas)

Endpoints similares:

- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/:id`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`

### Sincronização (Sync)

#### POST `/api/sync`

Sincronizar batch de mudanças do mobile

**Request:**

```json
{
  "userId": "uuid",
  "clientId": "device-id",
  "items": [
    {
      "entityType": "study_cycle",
      "entityId": "uuid",
      "operation": "create",
      "data": {
        "name": "Novo ciclo",
        "startDate": "2024-01-01T00:00:00Z"
      },
      "timestamp": 1704067200000
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "batchId": "uuid",
  "syncedItems": [
    {
      "entityId": "uuid",
      "operation": "create",
      "status": "success",
      "serverId": "uuid"
    }
  ],
  "serverData": [
    {
      "entityType": "study_cycle",
      "entityId": "uuid",
      "data": { ... }
    }
  ],
  "timestamp": 1704067200000
}
```

#### GET `/api/sync/status`

Status das sincronizações pendentes

```bash
curl -X GET http://localhost:3001/api/sync/status \
  -H "Authorization: Bearer <token>"
```

## 🔄 Estratégia de Sincronização

### Last-Write-Wins (LWW)

Quando há conflito entre mobile e servidor, a mudança mais recente vence:

1. **Mobile cria:** T=100
2. **Servidor atualiza:** T=150
3. **Resultado:** Dados do servidor (mais recente)

### Batching

O mobile agrupa múltiplas mudanças e envia uma vez online:

- Até 50 itens por batch (configurável)
- Timeout de 30 segundos
- Retry automático com backoff exponencial

### Conflict Resolution

Se uma entidade foi deletada no servidor mas editada no mobile:

```
1. Detecta conflito
2. Envia versão do mobile para servidor
3. Servidor marca como conflito em sync_logs
4. Aplicação notifica usuário
5. Usuário resolve manualmente
```

## 🔒 Segurança

### Headers

- `CORS` - Restrito aos domínios autorizados
- `Helmet` - Headers de segurança HTTP
- `Rate Limiting` - 100 req/15min por IP

### Autenticação

- JWT com expiração configurável
- Senhas com bcrypt (10+ rounds)
- Refresh tokens para renovação

### Validação

- Zod schema validation em todas as rotas
- Sanitização de inputs
- HTTPS em produção (obrigatório)

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm test:integration

# Coverage
npm test:coverage
```

## 📝 Logging

Logs estruturados com níveis:

- `error` - Erros críticos
- `warn` - Advertências
- `info` - Informações gerais
- `debug` - Debugging

Formato:

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "info",
  "message": "User logged in",
  "userId": "uuid",
  "requestId": "uuid"
}
```

## 🚢 Deployment

### Docker

```bash
docker build -t studycycle-api .
docker run -p 3001:3001 --env-file .env.production studycycle-api
```

### Environment em Produção

```bash
NODE_ENV=production
JWT_SECRET=generate-a-strong-key
DATABASE_URL=postgresql://...
```

## 🐛 Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução:** Certifique-se que PostgreSQL está rodando

```bash
npm run docker:up
```

### JWT Expired

```
Error: jwt expired
```

**Solução:** Use `/api/auth/refresh` para renovar token

### Sync Conflicts

Verifique `sync_logs` para entender o conflito:

```bash
npm run db:studio
# Navegue até a tabela sync_logs
```

---

**Construído com ExpressJS e Drizzle ORM**
