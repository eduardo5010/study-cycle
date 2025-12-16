# 🔧 Setup Completo - StudyCycle Monorepo

Guia passo a passo para configurar o monorepo StudyCycle localmente.

## ✅ Pré-requisitos

Antes de começar, tenha instalado:

### Windows

```powershell
# Verificar versões
node --version    # v18+
npm --version     # v10+
docker --version  # 20.10+
git --version     # 2.30+
```

### macOS

```bash
# Instalar com Homebrew
brew install node docker-desktop git

# Verificar
node --version
npm --version
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm git docker-compose

# Verificar
node --version
npm --version
```

## 📥 Instalação

### 1. Clonar o Repositório

```bash
git clone <seu-repo>
cd study-cycle
```

### 2. Instalar Dependências

```bash
# Instala dependências raiz + todos os workspaces
npm install

# Instalar um workspace específico
npm install -w apps/api
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.local .env.local

# Editar conforme necessário (ou deixar defaults)
# - Defaults funcionam para desenvolvimento local
# - Em produção, mude JWT_SECRET e DATABASE_URL
```

**Arquivo `.env.local` padrão:**

```env
DB_USER=studycycle
DB_PASSWORD=studycycle123
DB_NAME=studycycle
DB_PORT=5432
DATABASE_URL=postgresql://studycycle:studycycle123@localhost:5432/studycycle

PGADMIN_EMAIL=admin@studycycle.local
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050

PORT=3001
NODE_ENV=development
JWT_SECRET=seu-super-secret-jwt-key-mude-em-producao
JWT_EXPIRES_IN=7d
```

### 4. Iniciar Banco de Dados

```bash
# Subir containers PostgreSQL + PGAdmin
npm run docker:up

# Aguarde ~30 segundos pelo container estar pronto
```

**Verificar status:**

```bash
docker ps
# Deve listar: studycycle-postgres e studycycle-pgadmin
```

**PGAdmin Interface:**

- URL: http://localhost:5050
- Email: admin@studycycle.local
- Senha: admin123

### 5. Criar/Aplicar Migrações

```bash
# Gera migrações baseado no schema do Drizzle
npm run db:migrate

# Saída esperada:
# ✅ Migrations applied successfully
```

### 6. Verificar Estrutura

```bash
# Verificar builds dos packages
npm run type-check

# Saída esperada:
# ✅ All packages compiled successfully
```

## 🚀 Executar em Desenvolvimento

### Opção A: Todos os Apps Simultaneamente

```bash
npm run dev
```

Isso iniciará:

- **Web**: http://localhost:3000 (React)
- **Mobile**: http://localhost:8081 (Expo)
- **API**: http://localhost:3001 (Express)

Você verá logs de cada aplicação no mesmo terminal.

### Opção B: Apps Individuais (em terminais diferentes)

**Terminal 1 - Web:**

```bash
npm run dev:web
# http://localhost:3000
```

**Terminal 2 - Mobile:**

```bash
npm run dev:mobile
# http://localhost:8081
```

**Terminal 3 - API:**

```bash
npm run dev:api
# http://localhost:3001 (API pronta)
# http://localhost:3001/health (Health check)
```

## 🧪 Testar a Configuração

### 1. Testar API

```bash
# Health check
curl http://localhost:3001/health

# Saída esperada:
# {"status":"OK","timestamp":"2024-01-01T12:00:00.000Z"}
```

### 2. Testar Banco de Dados

```bash
# Abrir Drizzle Studio
npm run db:studio

# Ou acessar PGAdmin:
# http://localhost:5050
# Email: admin@studycycle.local
# Senha: admin123

# Conectar ao servidor:
# Host: postgres
# Port: 5432
# Username: studycycle
# Password: studycycle123
# Database: studycycle
```

### 3. Testar Sincronização

```bash
# Testar endpoint de sincronização
curl -X POST http://localhost:3001/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "clientId": "test-device",
    "items": []
  }'

# Saída esperada:
# {"success":true,"batchId":"...","syncedItems":[],...}
```

## 📝 Estrutura de Pastas Depois de Instalação

```
study-cycle/
├── .env.local                    # Variáveis locais (não commitar)
├── .eslintrc.json               # Config ESLint global
├── .prettierrc.json             # Config Prettier global
├── package.json                 # Scripts root
├── tsconfig.json                # TypeScript base
├── turbo.json                   # Config Turborepo
├── docker-compose.yml           # Orquestração Docker
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mobile/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/
│       ├── src/
│       │   ├── db/
│       │   │   ├── schema.ts
│       │   │   └── connection.ts
│       │   ├── routes/
│       │   └── index.ts
│       ├── drizzle.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── core/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── db-sync/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
└── node_modules/
```

## 🔄 Fluxo de Trabalho Comum

### Adicionar nova dependência

```bash
# Na raiz
npm install zod

# Em um workspace específico
npm install -w apps/api zod

# Em um package
npm install -w packages/core uuid
```

### Usar pacotes compartilhados

```typescript
// apps/web/src/components/MyComponent.tsx
import { Button } from '@studycycle/ui';
import { validateEmail } from '@studycycle/core';
import { SyncQueueManager } from '@studycycle/db-sync';
```

### Adicionar migrações ao banco

1. Editar `apps/api/src/db/schema.ts`
2. Executar:
   ```bash
   npm run db:migrate
   ```
3. Drizzle automaticamente:
   - Detecta mudanças
   - Gera SQL migrations
   - Aplica ao banco

### Build para produção

```bash
# Build geral
npm run build

# Build específico
npm run build:api
npm run build:web
npm run build:mobile

# Verificar compilação
npm run type-check
```

## 🐛 Troubleshooting

### Erro: "Port 5432 already in use"

```bash
# Opção 1: Parar container existente
npm run docker:down

# Opção 2: Usar porta diferente em .env.local
DB_PORT=5433
DATABASE_URL=postgresql://studycycle:studycycle123@localhost:5433/studycycle

# Editar docker-compose.yml:
# ports:
#   - "5433:5432"
```

### Erro: "Module not found '@studycycle/core'"

```bash
# Reinstalar dependências
npm install

# Se ainda não funcionar:
npm run clean
npm install
npm run type-check
```

### Erro: "PostgreSQL connection refused"

```bash
# Verificar se container está rodando
docker ps | grep postgres

# Se não estiver:
npm run docker:up

# Aguarde 30 segundos pela inicialização
npm run docker:logs
```

### Erro: "typescript error in imports"

```bash
# Rebuild TypeScript
npm run type-check

# Se erro persistir:
npm run clean
npm install
npm run build
```

### App web/mobile não atualiza

```bash
# Limpar cache
npm run clean

# Reinstalar
npm install

# Rodar novamente
npm run dev:web  # ou dev:mobile
```

## 📚 Próximos Passos

1. **Ler documentação:**
   - [README principal](./README.md)
   - [API docs](./apps/api/README.md)
   - [DB-Sync module](./packages/db-sync/README.md)

2. **Familiarizar-se com:**
   - Estrutura do Turborepo
   - Path aliases em TypeScript
   - Schema Drizzle

3. **Configurar IDE:**
   - Extensões VS Code recomendadas
   - ESLint + Prettier
   - Debugger do Node.js

4. **Primeiro commit:**
   ```bash
   git add .
   git commit -m "chore: initial monorepo setup"
   git push
   ```

## 🎉 Sucesso!

Se chegou aqui, seu monorepo está pronto para desenvolvimento!

**Próximo:**

```bash
npm run dev
# Tudo rodando em paralelo
```

---

**Suporte:** Veja [README.md](./README.md) para mais informações.
