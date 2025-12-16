# 🐳 Automação Docker para StudyCycle

Este documento explica como usar o sistema automatizado de Docker que sobe automaticamente ao rodar `npm run dev` e recria containers quando há mudanças no banco de dados.

## ✨ Funcionalidades

- ✅ **Docker sobe automaticamente** ao executar `npm run dev`
- ✅ **Detecção automática de mudanças** no schema do banco Postgres
- ✅ **Recriação automática de containers** quando o schema muda
- ✅ **Suporte para múltiplos arquivos** de schema (Web, API, init.sql)
- ✅ **Compatível com Windows, macOS e Linux**

## 🚀 Como Usar

### Opção 1: Desenvolvimento Normal (automático com Docker)

```bash
npm run dev
```

Isto irá:

1. ✅ Verificar o status do Docker
2. ✅ Iniciar os containers se não estiverem rodando
3. ✅ Detectar mudanças no schema
4. ✅ Recriar containers automaticamente se o schema mudar
5. ✅ Iniciar os serviços da aplicação (Turbo)

### Opção 2: Desenvolvimento com Monitoramento em Tempo Real

```bash
npm run dev:watch
```

Isto irá:

1. ✅ Executar o monitorador de schema em paralelo
2. ✅ Executar `npm run dev`
3. ✅ Recriar containers **automaticamente** sempre que detectar mudanças

> ⚠️ **Recomendado** para desenvolvimento quando você está frequentemente alterando o schema do banco

### Opção 3: Apenas Monitorar Schema

```bash
npm run watch:schema
```

Isto irá:

1. 👀 Monitorar mudanças nos arquivos de schema
2. 🔨 Recriar containers automaticamente quando detectar mudanças

> Útil se você quer rodar a aplicação separadamente e apenas monitorar o banco

## 📋 Scripts Disponíveis

| Script                   | Descrição                                              |
| ------------------------ | ------------------------------------------------------ |
| `npm run dev`            | Inicia desenvolvimento (sobe Docker automaticamente)   |
| `npm run dev:watch`      | Inicia desenvolvimento + monitora schema em tempo real |
| `npm run watch:schema`   | Apenas monitora mudanças no schema                     |
| `npm run docker:up`      | Sobe containers Docker manualmente                     |
| `npm run docker:down`    | Para containers Docker                                 |
| `npm run docker:rebuild` | Destrói e recria todos os containers                   |
| `npm run docker:logs`    | Mostra logs do PostgreSQL                              |
| `npm run docker:status`  | Mostra status dos containers                           |

## 🔍 Arquivos Monitorados

O sistema automaticamente detecta mudanças nos seguintes arquivos:

- `apps/web/shared/schema.ts` - Schema da Web
- `apps/api/src/db/schema.ts` - Schema da API
- `init.sql` - Script de inicialização do banco
- `docker-compose.yml` - Configuração do Docker

## 🛠️ Como Funciona

### Script de Inicialização (docker-start.js)

Localizado em: `apps/web/scripts/docker-start.js`

**Funcionalidades:**

- ✅ Verifica se Docker está em execução
- ✅ Calcula hash MD5 dos arquivos de schema
- ✅ Compara com hash anterior
- ✅ Se mudou: destrói containers e recria com `--build`
- ✅ Se não mudou: apenas inicia normalmente
- ✅ Aguarda PostgreSQL ficar pronto (até 60 segundos)

### Monitor de Schema (watch-schema.js)

Localizado em: `scripts/watch-schema.js`

**Funcionalidades:**

- 👀 Monitora mudanças a cada 2 segundos
- 📝 Salva hash anterior em `.schema-watch-hash`
- 🔔 Detecta quando schema foi alterado
- 🔨 Executa recreação automática de containers
- 🧹 Remove volumes antigos para garantir schema limpo

## 📊 Fluxo de Execução

```
npm run dev
    ↓
docker-start.js inicia
    ↓
Verifica Docker
    ↓
Calcula hash dos schemas
    ↓
[Hash mudou?]
    ├─ SIM: Destrói e recria containers
    └─ NÃO: Inicia normalmente
    ↓
Aguarda PostgreSQL
    ↓
Inicia aplicação com Turbo
```

## 🔧 Configuração

### Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto para configurar:

```env
DB_USER=studycycle
DB_PASSWORD=studycycle123
DB_NAME=studycycle
DB_PORT=5432
PGADMIN_EMAIL=admin@studycycle.local
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```

### Intervalo de Monitoramento

Para alterar o intervalo de verificação no `scripts/watch-schema.js`:

```javascript
const WATCH_INTERVAL = 2000; // Altere para o valor desejado (em ms)
```

## 📌 Arquivos Criados/Modificados

- `.schema-hash` - Armazena hash do schema (criado automaticamente)
- `.schema-watch-hash` - Armazena hash para monitoramento (criado automaticamente)
- `scripts/watch-schema.js` - Novo script de monitoramento
- `apps/web/scripts/docker-start.js` - Script melhorado
- `package.json` - Novos scripts adicionados

## ⚠️ Troubleshooting

### Docker não inicia

```bash
# Verifique se Docker está rodando
docker info

# Se não estiver, inicie o Docker Desktop/daemon
# No Windows: Abra Docker Desktop
# No macOS: Abra Docker Desktop
# No Linux: sudo systemctl start docker
```

### PostgreSQL não fica pronto

```bash
# Verifique os logs
npm run docker:logs

# Recrie containers
npm run docker:rebuild
```

### Schema não é detectado

```bash
# Verifique se os arquivos existem
ls apps/web/shared/schema.ts
ls apps/api/src/db/schema.ts
ls init.sql

# Force recreação manual
npm run docker:rebuild
```

### Containers não são recriados

```bash
# Limpe os hashes salvos
rm .schema-hash
rm .schema-watch-hash

# Recrie manualmente
npm run docker:rebuild
```

## 💡 Dicas

1. **Use `npm run dev:watch`** em desenvolvimento frequente com alterações de schema
2. **Use `npm run dev`** para desenvolvimento normal (mais rápido)
3. **Verifique logs** com `npm run docker:logs` se algo não funcionar
4. **Limpe containers antigos** com `npm run docker:rebuild` se tiver problemas

## 🐛 Relatar Problemas

Se encontrar problemas:

1. Verifique os logs: `npm run docker:logs`
2. Limpe containers: `npm run docker:rebuild`
3. Remova os hashes: `rm .schema-hash .schema-watch-hash`
4. Tente novamente: `npm run dev`

---

**Desenvolvido para melhorar a experiência de desenvolvimento do StudyCycle** 🎓
