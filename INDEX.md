# 📚 Índice de Documentação - StudyCycle

Bem-vindo! Use este índice para navegar pela documentação.

## 🚀 Para Começar (Comece Aqui!)

| Documento                          | Descrição                        | Tempo  |
| ---------------------------------- | -------------------------------- | ------ |
| [**SUMMARY.md**](./SUMMARY.md)     | ⭐ Resumo do que foi feito       | 5 min  |
| [**README.md**](./README.md)       | Overview do projeto              | 10 min |
| [**SETUP.md**](./SETUP.md)         | Como instalar e rodar localmente | 20 min |
| [**CHECKLIST.md**](./CHECKLIST.md) | Validar se tudo está pronto      | 10 min |

**→ Recomendado:** Ler nesta ordem para entender o projeto.

---

## 🏗️ Documentação Técnica

### Arquitetura

| Documento                                                  | Conteúdo                          |
| ---------------------------------------------------------- | --------------------------------- |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md)                   | Diagramas e fluxos da arquitetura |
| [apps/api/README.md](./apps/api/README.md)                 | Documentação da API               |
| [packages/db-sync/README.md](./packages/db-sync/README.md) | Módulo de sincronização           |

### Desenvolvimento

| Documento                                | Conteúdo                       |
| ---------------------------------------- | ------------------------------ |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Guidelines e padrões de código |
| `.eslintrc.json`                         | Configuração ESLint            |
| `.prettierrc.json`                       | Configuração Prettier          |
| `turbo.json`                             | Configuração Turborepo         |
| `tsconfig.json`                          | Configuração TypeScript        |

---

## 🎯 Guias por Tarefa

### Quero...

#### Instalar e rodar

👉 [SETUP.md](./SETUP.md)

#### Entender a arquitetura

👉 [ARCHITECTURE.md](./ARCHITECTURE.md)

#### Desenvolver um endpoint na API

👉 [apps/api/README.md](./apps/api/README.md)

#### Adicionar nova feature

👉 [CONTRIBUTING.md](./CONTRIBUTING.md)

#### Trabalhar com sincronização

👉 [packages/db-sync/README.md](./packages/db-sync/README.md)

#### Entender o modelo de dados

👉 [ARCHITECTURE.md#-model-de-dados](./ARCHITECTURE.md#-model-de-dados)

#### Usar design system no web/mobile

👉 [packages/ui](./packages/ui)

#### Compartilhar lógica entre apps

👉 [packages/core](./packages/core)

#### Acessar o banco de dados

👉 [SETUP.md#-banco-de-dados](./SETUP.md#-banco-de-dados)

#### Fazer deploy

👉 [Procure por Deployment em SETUP.md](./SETUP.md)

#### Reportar um bug

👉 [CONTRIBUTING.md#reportar-bugs](./CONTRIBUTING.md#reportar-bugs)

---

## 📦 Estrutura do Monorepo

```
📁 study-cycle (Raiz)
│
├─ 📄 Documentação
│  ├─ README.md           ← Visão geral
│  ├─ SETUP.md            ← Setup local
│  ├─ ARCHITECTURE.md     ← Diagramas
│  ├─ CONTRIBUTING.md     ← Contribuir
│  ├─ CHECKLIST.md        ← Validação
│  ├─ SUMMARY.md          ← Resumo
│  └─ INDEX.md            ← Este arquivo
│
├─ 📄 Configuração
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ turbo.json
│  ├─ docker-compose.yml
│  ├─ .eslintrc.json
│  ├─ .prettierrc.json
│  └─ .env.local
│
├─ 📁 apps/ (Aplicações)
│  ├─ web/               (React)
│  ├─ mobile/            (React Native)
│  └─ api/               (Express)
│
└─ 📁 packages/ (Compartilhados)
   ├─ core/             (Lógica)
   ├─ ui/               (Design System)
   └─ db-sync/          (Sincronização)
```

---

## 🔗 Links Rápidos

### Documentação Oficial

- [Turborepo Docs](https://turbo.build)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Express.js Guide](https://expressjs.com)
- [React Docs](https://react.dev)
- [React Native Docs](https://reactnative.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)

### Ferramentas

- [Docker Docs](https://docs.docker.com)
- [ESLint Docs](https://eslint.org)
- [Prettier Docs](https://prettier.io)

---

## 📋 Checklist de Primeira Execução

- [ ] Ler [SUMMARY.md](./SUMMARY.md)
- [ ] Ler [README.md](./README.md)
- [ ] Executar [SETUP.md](./SETUP.md)
- [ ] Verificar [CHECKLIST.md](./CHECKLIST.md)
- [ ] Rodar `npm run dev`
- [ ] Acessar http://localhost:3001/health
- [ ] Explorar [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Revisar [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🆘 Precisa de Ajuda?

### Problema | Solução

---|---
Não sei por onde começar | Leia [SUMMARY.md](./SUMMARY.md)
Erro durante instalação | Veja [SETUP.md#-troubleshooting](./SETUP.md#-troubleshooting)
Não entendo a arquitetura | Estude [ARCHITECTURE.md](./ARCHITECTURE.md)
Quero contribuir | Siga [CONTRIBUTING.md](./CONTRIBUTING.md)
Tenho dúvida sobre a API | Consulte [apps/api/README.md](./apps/api/README.md)
Preciso usar sincronização | Veja [packages/db-sync/README.md](./packages/db-sync/README.md)

---

## 🎯 Objetivos do Projeto

✅ **Compartilhar código** entre web e mobile
✅ **Sincronização offline/online** automática
✅ **Design system unificado**
✅ **Backend centralizado** com PostgreSQL
✅ **Fácil manutenção** com Turborepo
✅ **Qualidade de código** com ESLint/Prettier

---

## 📊 Estatísticas do Setup

| Item          | Valor                                             |
| ------------- | ------------------------------------------------- |
| Apps          | 3 (web, mobile, api)                              |
| Packages      | 3 (core, ui, db-sync)                             |
| Tabelas BD    | 6 (users, cycles, subjects, courses, logs, queue) |
| Endpoints API | 20+                                               |
| Documentação  | 8 arquivos                                        |
| Scripts npm   | 15+                                               |

---

## 🔄 Fluxo de Sincronização (Resumido)

1. **Offline** (mobile): Usa SQLite localmente
2. **Online** (detecta): App notifica
3. **Sync** (mobile→api): Envia batch de mudanças
4. **Processo** (api): Valida, resolve conflitos, atualiza BD
5. **Resposta** (api→mobile): Retorna resultado
6. **Update** (mobile): Sincroniza SQLite com servidor

👉 Detalhes em [ARCHITECTURE.md](./ARCHITECTURE.md#-sincronização-offlineonline)

---

## 📅 Próximas Ações

### Imediato (hoje)

- [ ] Ler documentação
- [ ] Rodar setup local
- [ ] Testar tudo funciona

### Curto prazo (esta semana)

- [ ] Explorar código base
- [ ] Entender padrões
- [ ] Preparar primeira feature

### Médio prazo (este mês)

- [ ] Desenvolver funcionalidades
- [ ] Adicionar testes
- [ ] Documentar decisões

---

## 💡 Dicas

- Use `npm run dev` para rodar tudo em paralelo
- Abra 3 terminais para rodar apps separadamente
- Use `npm run lint:fix` antes de commitar
- Consulte `turbo.json` para ver tarefas disponíveis
- Drizzle Studio é ótimo para explorar o banco

---

## 📞 Contato e Suporte

Não encontrou a resposta?

1. Procure em todos os arquivos .md
2. Verifique a seção Troubleshooting do SETUP.md
3. Abra uma issue no GitHub
4. Contacte o time de desenvolvimento

---

## 📜 Versionamento

| Versão | Data       | Mudanças                  |
| ------ | ---------- | ------------------------- |
| 1.0.0  | 2024-12-16 | Setup inicial do monorepo |

---

## 📝 Últimas Atualizações

- **2024-12-16**: Setup completo do monorepo StudyCycle
  - Turborepo configurado
  - PostgreSQL com Docker
  - API Express com autenticação
  - Módulo de sincronização
  - Documentação completa

---

## 🎉 Você está pronto!

```bash
npm install
npm run docker:up
npm run db:migrate
npm run dev
```

**Agora comece a desenvolver!** 🚀

---

**Índice versão 1.0 | Atualizado em 2024-12-16**
