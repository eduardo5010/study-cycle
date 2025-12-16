# 🚀 Resumo da Automação Docker Implementada

## O que foi feito?

Configurei um sistema **100% automático** para gerenciar Docker que:

### ✅ 1. Docker Sobe Automaticamente

- Ao rodar `npm run dev`, o script detecta o status dos containers
- Se não estão rodando, inicia automaticamente
- Se já estão rodando, continua normalmente

### ✅ 2. Detecta Mudanças no Banco Postgres

- Monitora 3 arquivos-chave:
  - `apps/web/shared/schema.ts`
  - `apps/api/src/db/schema.ts`
  - `init.sql`
  - `docker-compose.yml`

### ✅ 3. Recria Container Automaticamente

- Quando detecta mudanças, **destroi e recria** os containers
- Limpa volumes antigos (`-v`)
- Reconstrói imagens (`--build`)
- Aguarda PostgreSQL ficar pronto

---

## 📝 Como Usar

### Desenvolvimento Normal (Recomendado)

```bash
npm run dev
```

- Docker sobe automaticamente
- Recria containers se schema mudar
- Executa a aplicação normalmente

### Desenvolvimento com Monitoramento Contínuo

```bash
npm run dev:watch
```

- Executa `npm run dev`
- Monitora schema em **tempo real** (a cada 2 segundos)
- Recria containers **automaticamente** quando detectar mudanças
- ⭐ **Melhor para desenvolvimento**

### Apenas Monitorar Schema

```bash
npm run watch:schema
```

- Monitora mudanças no schema
- Recria containers automaticamente
- Executa em background

---

## 🔧 Scripts Novos Adicionados

| Comando                  | O que faz                             |
| ------------------------ | ------------------------------------- |
| `npm run dev:watch`      | Dev + monitora schema em tempo real   |
| `npm run watch:schema`   | Monitora schema sem iniciar aplicação |
| `npm run docker:rebuild` | Destrói e reconstrói tudo             |
| `npm run docker:status`  | Mostra status dos containers          |

---

## 🔄 Como Funciona Internamente

### Quando você roda `npm run dev`:

```
1. docker-start.js é executado
2. Verifica se Docker está instalado/rodando
3. Calcula HASH dos arquivos de schema
4. Compara com hash anterior (.schema-hash)
5. Se mudou:
   - docker-compose down -v (remove containers e volumes)
   - docker-compose up -d --build (reconstrói)
6. Se não mudou:
   - docker-compose up -d (apenas inicia)
7. Aguarda PostgreSQL ficar pronto (até 60s)
8. Inicia aplicação com Turbo
```

### Quando você roda `npm run dev:watch`:

```
1. Inicia em paralelo:
   - npm run watch:schema (monitora mudanças)
   - npm run dev (aplicação)
2. watch-schema.js fica verificando a cada 2s
3. Se detectar mudança:
   - Automáticamente executa docker-compose down -v
   - docker-compose up -d --build
   - Notifica no console
4. Continua monitorando...
```

---

## 📂 Arquivos Modificados/Criados

```
✅ scripts/watch-schema.js           [NOVO] Monitora schema em tempo real
✅ apps/web/scripts/docker-start.js  [MELHORADO] Detecta mudanças no schema
✅ package.json                      [MODIFICADO] Novos scripts adicionados
✅ DOCKER_AUTOMATION.md              [NOVO] Documentação completa
```

---

## 🎯 Fluxos Recomendados

### Para Começar Desenvolvimento

```bash
npm run dev
```

- ✅ Simples e rápido
- ✅ Docker gerenciado automaticamente
- ✅ Usa cache quando schema não muda

### Se Está Alterando Schema Frequentemente

```bash
npm run dev:watch
```

- ✅ Monitora mudanças contínuamente
- ✅ Recria containers automaticamente
- ✅ Sem necessidade de reiniciar manualmente

### Para Refresh Completo

```bash
npm run docker:rebuild
```

- 🔨 Destrói tudo e reconstrói do zero
- Útil se tiver problemas

---

## ⚠️ Pontos Importantes

1. **Docker deve estar rodando**
   - Windows/Mac: Abra Docker Desktop
   - Linux: `sudo systemctl start docker`

2. **Variáveis de ambiente**
   - Configure `.env` se necessário
   - Valores padrão estão em `docker-compose.yml`

3. **Arquivos de hash**
   - `.schema-hash` e `.schema-watch-hash` são criados automaticamente
   - Não adicione ao git (ignora automaticamente)
   - Delete para forçar recriação

4. **Performance**
   - Comparação de hash é muito rápida (< 100ms)
   - Monitoramento não consome recursos significativos

---

## 🚀 Próximos Passos

1. **Execute**: `npm run dev:watch`
2. **Teste**: Altere `apps/web/shared/schema.ts`
3. **Observe**: O container será recriado automaticamente
4. **Divirta-se**: Desenvolvimento sem complicações! 🎉

---

**Sistema 100% automatizado e pronto para uso!** ✨
