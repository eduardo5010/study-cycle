# 📚 StudyCycle - Monorepo

Um gerenciador inteligente de ciclos de estudo com **sincronização offline/online**, compartilhamento de design system e lógica de negócio entre web e mobile.

## 🏗️ Arquitetura

```
study-cycle (root)
├── apps/
│   ├── web/              # React - Interface web
│   ├── mobile/           # React Native - App mobile
│   └── api/              # Node.js/Express - Backend
├── packages/
│   ├── core/             # Lógica de negócio compartilhada
│   ├── ui/               # Design system e componentes
│   └── db-sync/          # Módulo de sincronização offline/online
└── docker-compose.yml    # Orquestração de serviços
```

### 🔄 Fluxo de Sincronização

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDYCYCLE ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐              ┌──────────────────┐
│   WEB (React)    │              │ MOBILE (RN)      │
│   - UI React     │              │   - UI React     │
│   - API Client   │  <-------->  │   - SQLite       │
│   - Auth         │   HTTPS      │   - Offline      │
└──────────────────┘              │   - Auto-sync    │
         ▲                         └──────────────────┘
         │                                  │
         │ REST API                        │ Batch Sync
         │ (JSON)                          │ (JSON)
         │                                  │
         ├──────────────────┬───────────────┘
         │                  │
         ▼                  ▼
    ┌────────────────────────────────┐
    │    API (Node.js/Express)       │
    │  - Authentication (JWT)        │
    │  - REST Endpoints              │
    │  - Sync Management             │
    │  - Conflict Resolution         │
    └────────────────────────────────┘
         │
         │ SQL
         │
         ▼
    ┌────────────────────────────────┐
    │   PostgreSQL (Docker)          │
    │  - Study Cycles                │
    │  - Subjects                    │
    │  - Courses                     │
    │  - Sync Logs                   │
    └────────────────────────────────┘
```

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 18+ e npm 10+
- **Docker** e Docker Compose
- **Git**

### Instalação

1. **Clonar e instalar dependências:**

   ```bash
   git clone <repo>
   cd study-cycle
   npm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp .env.local .env.local
   # Editar .env.local se necessário
   ```

3. **Iniciar PostgreSQL:**

   ```bash
   npm run docker:up
   ```

4. **Executar migrações do banco:**
   ```bash
   npm run db:migrate
   ```

## 📦 Instalação Local (Desenvolvimento)

### Desenvolvimento - Todos os apps simultaneamente

```bash
npm run dev
```

Executa em paralelo:

- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **Mobile**: Configure IP primeiro (veja abaixo)

### 📱 Configuração do App Mobile

**IMPORTANTE:** O app mobile precisa acessar a API via IP da máquina (não localhost).

#### 1. Configurar IP automaticamente

```bash
cd apps/mobile
npm run setup-ip
```

#### 2. Testar conexão

```bash
npm run test-api
```

#### 3. Executar o app

```bash
npm start          # Expo Dev Server
npm run android    # Android
npm run ios        # iOS
```

#### Configurações por Plataforma

```env
# Android Emulator
API_URL=http://10.0.2.2:3001

# iOS Simulator / Dispositivo físico
API_URL=http://192.168.1.83:3001  # Substitua pelo seu IP
```

### Desenvolvimento - Apps individuais

```bash
# Apenas web
npm run dev:web

# Apenas mobile
npm run dev:mobile

# Apenas API
npm run dev:api
```

### Verificações de código

```bash
# Lint
npm run lint

# Lint com fix automático
npm run lint:fix

# Format (Prettier)
npm run format

# Verificar tipos TypeScript
npm run type-check
```

## 🗄️ Banco de Dados

### Gerenciar PostgreSQL

```bash
# Iniciar containers
npm run docker:up

# Parar containers
npm run docker:down

# Ver logs
npm run docker:logs
```

### PGAdmin (Interface Web)

- **URL:** http://localhost:5050
- **Email:** admin@studycycle.local
- **Senha:** admin123

### Drizzle Studio (ORM Studio)

```bash
npm run db:studio
```

### Executar migrações

```bash
# Criar/aplicar migrações
npm run db:migrate

# Gerar SQL a partir do schema
npm run db:schema
```

## 📁 Estrutura de Pacotes Compartilhados

### `@studycycle/core` (Lógica de Negócio)

Funções, validações e tipos compartilhados entre web e mobile.

```typescript
// Exemplo de uso
import { validateEmail } from '@studycycle/core';

const isValid = validateEmail('user@example.com');
```

**Arquivos:**

- `schemas.ts` - Validações com Zod
- `types.ts` - Tipos TypeScript
- `utils.ts` - Funções utilitárias
- `validation.ts` - Lógica de validação

### `@studycycle/ui` (Design System)

Componentes reutilizáveis e tokens de design.

```typescript
// Exemplo de uso
import { Button, Colors } from '@studycycle/ui';

<Button color={Colors.primary}>Clique aqui</Button>
```

**Arquivos:**

- `tokens.ts` - Design tokens (cores, tipografia, etc)
- `components/` - Componentes React/React Native

### `@studycycle/db-sync` (Sincronização)

Módulo de sincronização offline/online entre SQLite (mobile) e PostgreSQL (API).

```typescript
// Exemplo de uso
import { SyncQueueManager, ConflictResolver } from '@studycycle/db-sync';

const queue = new SyncQueueManager();
queue.addItem({
  entityType: 'study_cycle',
  entityId: 'uuid',
  operation: 'create',
  data: { name: 'Novo ciclo' },
});
```

**Componentes:**

- `SyncQueueManager` - Gerencia fila de sincronização
- `ConflictResolver` - Resolve conflitos (Last-Write-Wins)
- `SyncValidator` - Valida dados de sincronização
- `SyncResponseBuilder` - Constrói respostas

## 🔐 Autenticação

### Fluxo JWT

1. **Login:** POST `/api/auth/login` → recebe token JWT
2. **Autorização:** Token enviado no header `Authorization: Bearer <token>`
3. **Refresh:** POST `/api/auth/refresh` → novo token

### Variáveis de ambiente necessárias

```env
JWT_SECRET=sua-chave-super-secreta
JWT_EXPIRES_IN=7d
```

## 🔄 Sincronização Offline/Online

### Fluxo no Mobile

```
1. Usuário cria/edita ciclo de estudo no mobile
   ↓
2. Dados salvos localmente em SQLite
   ↓
3. App detecta conexão com internet
   ↓
4. Envia batch de mudanças para API
   ↓
5. API aplica mudanças no PostgreSQL
   ↓
6. API retorna dados atualizados (resolução de conflitos)
   ↓
7. Mobile sincroniza SQLite com respostas da API
```

### Endpoints de Sincronização

```
POST /api/sync
- Body: SyncBatch (array de operações)
- Response: SyncResponse (confirmação e dados atualizados)

GET /api/sync/status
- Response: Status das sincronizações pendentes
```

## 🔗 API REST Endpoints

### Autenticação

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Study Cycles

```
GET    /api/study-cycles           # Listar ciclos
POST   /api/study-cycles           # Criar ciclo
GET    /api/study-cycles/:id       # Obter ciclo
PUT    /api/study-cycles/:id       # Atualizar ciclo
DELETE /api/study-cycles/:id       # Deletar ciclo
```

### Subjects (Disciplinas)

```
GET    /api/subjects               # Listar
POST   /api/subjects               # Criar
PUT    /api/subjects/:id           # Atualizar
DELETE /api/subjects/:id           # Deletar
```

### Courses (Aulas/Disciplinas)

```
GET    /api/courses                # Listar
POST   /api/courses                # Criar
PUT    /api/courses/:id            # Atualizar
DELETE /api/courses/:id            # Deletar
```

## 🏗️ Build para Produção

### Build geral

```bash
npm run build
```

### Build por app

```bash
npm run build:web
npm run build:mobile
npm run build:api
```

## 📊 Monitoramento

### Logs da API

```bash
npm run docker:logs
```

### Métricas do PostgreSQL

Via PGAdmin em http://localhost:5050

## 🛠️ Configuração de IDE

### VS Code

Extensões recomendadas:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "firsttris.vscode-jest-runner",
    "vadimcn.vscode-lldb"
  ]
}
```

### Configuração TSConfig

Todos os apps já têm `paths` configuradas para imports compartilhados:

```typescript
// Ao invés de
import { Button } from '../../../packages/ui/src/components';

// Use
import { Button } from '@studycycle/ui';
```

## 🔍 Troubleshooting

### Porta 5432 já está em uso

```bash
# Parar containers
npm run docker:down

# Ou mudar porta em .env.local
DB_PORT=5433
```

### Node modules corrompido

```bash
npm run clean
npm install
```

### TypeScript errors nos imports

```bash
# Certifique-se que os packages estão listados em
cat package.json | grep workspaces

# Reinstale se necessário
npm install
```

## 📚 Documentação Adicional

- [API Setup](./apps/api/README.md)
- [Web App Setup](./apps/web/README.md)
- [Mobile App Setup](./apps/mobile/README.md)
- [DB-Sync Module](./packages/db-sync/README.md)
- [Core Package](./packages/core/README.md)
- [UI Package](./packages/ui/README.md)

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
2. Faça commit das mudanças: `git commit -m 'Add feature'`
3. Push para a branch: `git push origin feature/nome-da-feature`
4. Abra um Pull Request

## 📄 Licença

MIT - Ver LICENSE.md para detalhes

---

**Desenvolvido com ❤️ para melhorar a experiência de estudo**
