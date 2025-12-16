# Docker & Database Automation

## 🚀 Como Usar

### Iniciar ambiente com Docker automático

```bash
npm run dev
```

Isso vai:

1. ✅ Iniciar o Docker Compose automaticamente
2. ✅ Monitorar mudanças no schema do banco
3. ✅ Recrear containers quando detectar mudanças
4. ✅ Iniciar todos os serviços de desenvolvimento

### Apenas Docker (sem desenvolvimento)

```bash
npm run docker:up
```

### Parar Docker

```bash
npm run docker:down
```

### Monitorar Docker e Schema

```bash
npm run docker:watch
```

### Recriar Docker (remover dados)

```bash
npm run docker:rebuild
```

## 📋 O que é Monitorado

Os seguintes arquivos/diretórios são observados automaticamente:

- `apps/web/shared/schema.ts` - Schema web
- `apps/api/src/db/schema.ts` - Schema API
- `apps/web/server/db.ts` - Configuração banco web
- `init.sql` - Script de inicialização
- `apps/api/src/db/migrations/` - Diretório de migrations

## ⚙️ Como Funciona

1. **Ao executar `npm run dev`:**
   - O script `watch-docker.js` é iniciado em paralelo
   - Verifica se Docker está rodando
   - Inicia Docker Compose se necessário
   - Começa a observar mudanças no schema

2. **Quando detecta mudanças no schema:**
   - Para os containers
   - Remove volumes de dados (para resetar banco)
   - Recria containers com novo schema
   - Aguarda o healthcheck do Postgres

3. **Enquanto está rodando:**
   - O turbo dev continua monitorando código
   - Docker aguarda por mudanças no schema
   - Ambos rodam em paralelo (mais rápido)

## 🔧 Customização

### Alterar arquivos monitorados

Edite `scripts/watch-docker.js` na função `getSchemaFiles()`:

```javascript
function getSchemaFiles() {
  return [
    path.join(rootDir, 'seu/arquivo/schema.ts'),
    // adicione mais arquivos aqui
  ].filter((f) => fs.existsSync(f));
}
```

### Não recrear container (apenas monitorar)

Se preferir apenas ser notificado sobre mudanças sem recriar:

```bash
npm run docker:watch
```

## 📊 Saída do Console

```
[10:30:45] 🐳 Iniciador e Monitor de Docker
[10:30:45] ✅ Docker está rodando
[10:30:46] 🐳 Iniciando Docker Compose...
[10:30:50] ✅ Docker iniciado com sucesso
[10:30:51] 👀 Observando arquivo: apps/web/shared/schema.ts
[10:30:51] 👀 Observando arquivo: apps/api/src/db/schema.ts
[10:30:51] 👀 Iniciando observação de mudanças...
```

## ⚠️ Requisitos

- Docker Desktop instalado e em execução
- Docker Compose (incluído no Docker Desktop)
- Node.js 18+
- npm 10+

## 🐛 Troubleshooting

### Docker não inicia

```bash
# Verifique se Docker Desktop está rodando
docker ps

# Inicie manualmente
npm run docker:up
```

### Porta 5432 já em uso

```bash
# Parar container anterior
docker stop studycycle-postgres
docker rm studycycle-postgres

# Iniciar novamente
npm run docker:up
```

### Container não recria após mudanças

```bash
# Verificar logs
docker-compose logs postgres

# Recriar manualmente
npm run docker:rebuild
```

## 📝 Variáveis de Ambiente

Configure no `.env` da raiz:

```env
DB_USER=studycycle
DB_PASSWORD=studycycle123
DB_NAME=studycycle
DB_PORT=5432
PGADMIN_EMAIL=admin@studycycle.local
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```
