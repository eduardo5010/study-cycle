# ✅ Checklist de Configuração do Monorepo

Use este checklist para validar se tudo está configurado corretamente.

## 🔧 Infraestrutura

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm 10+ instalado (`npm --version`)
- [ ] Docker instalado (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Git configurado (`git config --list`)

## 📦 Instalação

- [ ] Projeto clonado
- [ ] `npm install` executado com sucesso
- [ ] `.env.local` criado e configurado
- [ ] Sem erros de node_modules corrompidos

## 🗄️ Banco de Dados

- [ ] Docker containers iniciados (`npm run docker:up`)
- [ ] Postgres acessível (`docker ps | grep postgres`)
- [ ] PGAdmin acessível (http://localhost:5050)
- [ ] Migrações aplicadas (`npm run db:migrate`)
- [ ] Tabelas criadas no banco (verificar em PGAdmin)

## 📁 Estrutura de Pastas

- [ ] `/apps/web` existe e tem `package.json`
- [ ] `/apps/mobile` existe e tem `package.json`
- [ ] `/apps/api` existe e tem `package.json`
- [ ] `/packages/core` existe e tem `package.json`
- [ ] `/packages/ui` existe e tem `package.json`
- [ ] `/packages/db-sync` existe e tem `package.json`

## ⚙️ Configuração TypeScript

- [ ] Root `tsconfig.json` existe
- [ ] Cada app/package tem seu `tsconfig.json` com `extends`
- [ ] Path aliases funcionam (testar import)

```typescript
// Deve funcionar sem erros
import { SyncQueueManager } from '@studycycle/db-sync';
```

## 📜 Scripts Npm

- [ ] `npm run dev` inicia todos os apps
- [ ] `npm run dev:web` inicia apenas web
- [ ] `npm run dev:mobile` inicia apenas mobile
- [ ] `npm run dev:api` inicia apenas API
- [ ] `npm run build` faz build de tudo
- [ ] `npm run lint` executa linter
- [ ] `npm run format` formata código
- [ ] `npm run type-check` valida tipos

## 🔗 Endpoints da API

- [ ] Health check funciona: `curl http://localhost:3001/health`
- [ ] Sync endpoint responde: `POST http://localhost:3001/api/sync`
- [ ] JWT middleware está configurado
- [ ] CORS está habilitado para frontend

## 📝 Linting e Formato

- [ ] `.eslintrc.json` existe na raiz
- [ ] `.prettierrc.json` existe na raiz
- [ ] `.prettierignore` existe na raiz
- [ ] Sem erros de ESLint: `npm run lint`
- [ ] Sem erros de Prettier: `npm run format`

## 📚 Documentação

- [ ] `README.md` escrito na raiz
- [ ] `SETUP.md` com instruções de setup
- [ ] `CONTRIBUTING.md` com guidelines
- [ ] `apps/api/README.md` documentado
- [ ] `packages/db-sync/README.md` documentado

## 🔐 Segurança

- [ ] `.env.local` está em `.gitignore`
- [ ] Senhas defaults em `.env.example`
- [ ] JWT_SECRET está configurado
- [ ] CORS restringe domains corretos

## 🧪 Testes

- [ ] `npm test` funciona (ou está configurado)
- [ ] Coverage > 80% (ou alvo definido)
- [ ] CI/CD pipeline está pronto (opcional)

## 🐳 Docker

- [ ] `docker-compose.yml` existe na raiz
- [ ] Postgres roda com sucesso
- [ ] Dados persistem em volumes
- [ ] PGAdmin está acessível

## 🔄 Git

- [ ] `.gitignore` configurado
- [ ] Primeiro commit feito
- [ ] Remote repository configurado
- [ ] Branch protection habilitado (se necessário)

## 📱 Plataformas

### Web (React)

- [ ] Inicia sem erros: `npm run dev:web`
- [ ] Interface responsiva
- [ ] Conecta com API

### Mobile (React Native)

- [ ] Inicia Expo: `npm run dev:mobile`
- [ ] Pode abrir no simulador/emulador
- [ ] Conecta com API

### API (Express)

- [ ] Inicia sem erros: `npm run dev:api`
- [ ] Endpoints respondendo
- [ ] Banco conectado

## 🎯 Sincronização

- [ ] Módulo `@studycycle/db-sync` importável
- [ ] `SyncQueueManager` funcional
- [ ] `ConflictResolver` pronto
- [ ] Tipos TypeScript corretos
- [ ] Validações Zod funcionam

## 📊 Performance

- [ ] Build rápido: `npm run build` < 30s
- [ ] Dev mode responde rápido
- [ ] Sem memory leaks
- [ ] Cache Turborepo funciona

## 🚀 Deployment (Opcional)

- [ ] Dockerfile pronto para API
- [ ] Envs de produção configurados
- [ ] Secrets gerenciados
- [ ] Logs estruturados

## 🐛 Troubleshooting Verificado

- [ ] Sabe onde encontrar logs
- [ ] Sabe como resetar banco se necessário
- [ ] Sabe como limpar cache
- [ ] Contato com suporte disponível

## ✨ Próximos Passos

Após completar tudo acima:

1. **Desenvolvimento:**

   ```bash
   npm run dev
   ```

2. **Primeiro commit:**

   ```bash
   git add .
   git commit -m "chore: setup StudyCycle monorepo"
   git push -u origin main
   ```

3. **Criar primeira feature:**
   - Ver `CONTRIBUTING.md`
   - Criar branch: `git checkout -b feature/descricao`
   - Desenvolver com `npm run dev`
   - Testar com `npm run lint && npm run type-check`
   - Commit com Conventional Commits

4. **Deploy (quando pronto):**
   ```bash
   npm run build
   # Fazer deploy de cada app
   ```

## 📞 Suporte

Se algo não estiver funcionando:

1. Verificar [SETUP.md](./SETUP.md) - Troubleshooting section
2. Ler logs com atenção
3. Verificar [README.md](./README.md)
4. Abrir issue no GitHub

---

**Parabéns! Seu monorepo StudyCycle está pronto! 🎉**
