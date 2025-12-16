## 🎉 Automação Docker - Pronto para Usar!

### 🚀 Começar Agora

```bash
# Verificar se tudo está configurado
npm run docker:check

# Iniciar desenvolvimento (Docker + Apps em paralelo)
npm run dev
```

---

## 📋 Comandos Disponíveis

### Desenvolvimento

```bash
npm run dev              # 🎯 PRINCIPAL: Docker + turbo dev em paralelo
npm run dev:all         # Turbo dev sem Docker
npm run dev:web         # Apenas web
npm run dev:api         # Apenas API
npm run dev:mobile      # Apenas mobile
```

### Docker

```bash
npm run docker:up       # Iniciar containers
npm run docker:down     # Parar containers
npm run docker:rebuild  # Resetar banco + recriar containers
npm run docker:logs     # Ver logs do Postgres
npm run docker:status   # Status dos containers
npm run docker:watch    # Monitorar mudanças no schema
npm run docker:check    # Verificar configuração
```

### Comandos Rápidos

```bash
npm run docker:command status      # 📊 Status
npm run docker:command logs        # 📋 Logs Postgres
npm run docker:command logs-pgadmin # 📋 Logs PgAdmin
npm run docker:command psql        # 🗄️  Shell do banco
npm run docker:command shell       # 🐚 Shell do container
npm run docker:command reset       # 🔄 Resetar banco
npm run docker:command clean       # 🧹 Limpar containers
npm run docker:command help        # ℹ️  Ajuda
```

---

## 🔄 O que Acontece ao Rodar `npm run dev`

```
npm run dev
    ↓
┌────────────────────────────────────────────────┐
│  1. Docker Compose sobe automaticamente       │
│  2. Turbo dev inicia apps em paralelo         │
│  3. Scripts monitoram mudanças no schema      │
└────────────────────────────────────────────────┘
    ↓
┌──────────────────┬──────────────────────────────┐
│  Docker Monitor  │  Development Server          │
│  ✓ Postgres      │  ✓ Web                      │
│  ✓ PgAdmin       │  ✓ API                      │
│  ✓ Observa novo  │  ✓ Mobile                   │
│    schema        │  ✓ Recompila código         │
└──────────────────┴──────────────────────────────┘
    ↓
⚠️  Schema muda?        ↔️  Código muda?
    ↓                       ↓
🔄 Container recria     🔄 Reload automático
```

---

## 📁 Arquivos Criados/Modificados

### ✅ Novos Arquivos

- `scripts/watch-docker.js` - Monitor de Docker
- `scripts/docker-command.js` - Helper de comandos
- `scripts/check-docker-setup.js` - Verificador
- `DOCKER_WATCH_GUIDE.md` - Documentação
- `DOCKER_AUTOMATION_SETUP.md` - Setup
- `.env` - Configurações

### ✏️ Modificados

- `package.json` - Novos scripts
- `.gitignore` - Ignora `.database-hash`

---

## 🎯 Fluxo Recomendado

### Primeiro Uso

```bash
npm run docker:check      # Validar tudo
npm run dev              # Começar!
```

### Durante Desenvolvimento

```
Edite schema → Docker recria automaticamente → Teste
Edite código → Reload automático → Teste
```

### Debug

```bash
npm run docker:command logs       # Ver logs
npm run docker:command psql       # Conectar ao banco
npm run docker:command status     # Ver status
```

### Resetar

```bash
npm run docker:rebuild   # Remover dados e recriar
# ou
npm run docker:command reset
```

---

## 📊 Monitoramento Automático

### Arquivos Observados

Quando qualquer um desses muda → Docker recria:

- `apps/web/shared/schema.ts`
- `apps/api/src/db/schema.ts`
- `apps/web/server/db.ts`
- `init.sql`
- `apps/api/src/db/migrations/` (todos os arquivos)

---

## 🔧 Customização

### Variar Porta do Banco

```bash
# .env
DB_PORT=5433  # Ao invés de 5432
```

### Variar Credenciais

```bash
# .env
DB_USER=seu_user
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

### Adicionar mais arquivos para monitorar

Edite `scripts/watch-docker.js`:

```javascript
function getSchemaFiles() {
  return [
    path.join(rootDir, 'seu/arquivo.ts'),
    // adicione aqui
  ].filter((f) => fs.existsSync(f));
}
```

---

## ⚠️ Troubleshooting

### Docker não sobe?

```bash
# Verificar se Docker Desktop está rodando
npm run docker:check

# Ver logs
npm run docker:command logs
```

### Porta 5432 em uso?

```bash
npm run docker:command clean
npm run dev
```

### Container não recria ao mudar schema?

```bash
npm run docker:rebuild
```

### Conexão recusada ao banco?

```bash
npm run docker:command logs       # Ver erros
npm run docker:command reset      # Resetar
```

---

## 📚 Documentação Completa

Para mais detalhes, veja:

- [DOCKER_WATCH_GUIDE.md](DOCKER_WATCH_GUIDE.md)
- [DOCKER_AUTOMATION_SETUP.md](DOCKER_AUTOMATION_SETUP.md)

---

## ✨ Benefícios

✅ Sem setup manual necessário  
✅ Docker sobe automaticamente com `npm run dev`  
✅ Schema sempre sincronizado  
✅ Container recria quando detecta mudanças  
✅ Tudo em paralelo (mais rápido)  
✅ Suporte Windows + Linux/Mac  
✅ Logs estruturados com emojis  
✅ 7 comandos auxiliares para gerência  
✅ Verificador de configuração

---

**Está pronto?** 🚀

```bash
npm run dev
```

Divirta-se desenvolvendo! 🎉
