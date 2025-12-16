# 🐳 Automação Docker - Implementação Concluída

## ✅ O que foi Implementado

### 1. **Script de Monitoramento Docker** (`scripts/watch-docker.js`)

- ✅ Monitora mudanças em arquivos de schema
- ✅ Detecta alterações em tempo real
- ✅ Recria containers automaticamente quando detecta mudanças
- ✅ Aguarda healthcheck do Postgres antes de continuar
- ✅ Suporte para Windows e Unix/Linux

### 2. **Novos Comandos NPM**

```bash
# Iniciar tudo com Docker automático
npm run dev

# Apenas monitorar Docker (sem turbo dev)
npm run docker:watch

# Comandos auxiliares rápidos
npm run docker:command status      # Ver status
npm run docker:command logs        # Ver logs
npm run docker:command psql        # Conectar ao banco
npm run docker:command reset       # Resetar banco
npm run docker:command help        # Ver todos os comandos
```

### 3. **Arquivos Criados**

- ✅ `scripts/watch-docker.js` - Monitor e controlador de Docker
- ✅ `scripts/docker-command.js` - Helper de comandos rápidos
- ✅ `DOCKER_WATCH_GUIDE.md` - Documentação completa
- ✅ `.env` - Configurações de ambiente

## 🎯 Como Usar

### Opção 1: Desenvolvimento Completo (Recomendado)

```bash
npm run dev
```

**O que acontece:**

1. Docker sobe automaticamente ✅
2. Turbo dev inicia todos os serviços 🚀
3. Mudanças no schema -> Container recria 🔄
4. Tudo rodando em paralelo 🎯

### Opção 2: Apenas Docker

```bash
npm run docker:watch
```

**O que acontece:**

1. Docker sobe automaticamente
2. Monitora mudanças no schema
3. Recria container conforme necessário

### Opção 3: Turbo Dev sem Docker

```bash
npm run dev:all
```

**Usar se Docker já está rodando manualmente**

## 📊 Arquivos Monitorados

O script observa automaticamente:

- `apps/web/shared/schema.ts`
- `apps/api/src/db/schema.ts`
- `apps/web/server/db.ts`
- `init.sql`
- `apps/api/src/db/migrations/` (diretório inteiro)

Sempre que algum desses muda → Docker recria 🔄

## 🔧 Configuração

Edite `.env` na raiz para customizar:

```env
DB_USER=studycycle
DB_PASSWORD=studycycle123
DB_NAME=studycycle
DB_PORT=5432
PGADMIN_EMAIL=admin@studycycle.local
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```

## 🚀 Fluxo de Desenvolvimento

```
npm run dev
    ↓
┌─────────────────────────────────────┐
│  Docker sobe + Turbo dev rodam      │
│  em paralelo (lado a lado)          │
└─────────────────────────────────────┘
    ↓
[Docker]                [Dev]
Monitora schema         Desenvolvimento
    ↓                       ↓
Mudança detectada       Código compilando
    ↓                       ↓
Container recria        Reload automático
    ↓                       ↓
Pronto para testes      Pronto para usar
```

## 💡 Dicas & Troubleshooting

### Docker não inicia?

```bash
# Verifique se Docker Desktop está rodando
npm run docker:command status
```

### Porta 5432 em uso?

```bash
npm run docker:command clean   # Remove antigos
npm run dev                    # Inicia novo
```

### Ver logs do Postgres?

```bash
npm run docker:command logs
```

### Conectar ao banco interativamente?

```bash
npm run docker:command psql
```

### Resetar banco completamente?

```bash
npm run docker:command reset
```

## 📝 Mudanças no package.json

```json
"scripts": {
  "dev": "concurrently \"npm run docker:watch\" \"npm run dev:all\" ...",
  "dev:all": "turbo dev",
  "docker:watch": "node scripts/watch-docker.js",
  "docker:command": "node scripts/docker-command.js",
  ...
}
```

## ✨ Benefícios

✅ Sem préconfigurações manuais  
✅ Docker sobe automaticamente  
✅ Schema sempre sincronizado  
✅ Containers recreiam quando necessário  
✅ Tudo em um comando: `npm run dev`  
✅ Suporte Windows + Linux/Mac  
✅ Logs estruturados e legíveis  
✅ Comandos auxiliares para gerência rápida

---

**Pronto para começar?** 🚀

```bash
npm run dev
```
