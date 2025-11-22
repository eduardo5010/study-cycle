# Study Cycle

A learning and automatic review platform that combines elements of educational social networks and a marketplace for community and official courses. The goal is to help students organize their studies, create and consume educational content (video, text, exercises), review it with adaptive algorithms, and allow teachers and creators to publish courses.

---

## 📖 Project Overview

### English

**Study Cycle** is an advanced learning management platform that combines study schedule optimization with adaptive review algorithms and course management. The platform helps users organize their studies, create and track study cycles, and provides a comprehensive learning experience through courses, content management, and intelligent review scheduling.

#### Key Features

- **Adaptive Review Algorithm**: Based on review events and per-user λ parameter, optimizing the spacing of review sessions for better retention
- **Content Generation**: Content created by teachers, community, and AI (question generation/variations)
- **File Uploads with OCR**: Automatic text extraction from uploaded files and generation of review variants
- **Authentication**: Standard email/password authentication and social login (GitHub, Google, Facebook) with account linking capability
- **Teacher Area**: Upload and management of content and courses for educators
- **Social Network Features**: Profiles, following, comments/likes (planned)
- **Gamification System**: Streak tracking, XP system, competitive leagues, achievements, and certificates
- **Multi-language Support**: Internationalization with support for multiple languages

#### Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Storage**: Hybrid implementation (MemStorage for prototyping; Drizzle/SQLite for ML/review data)
- **Queue/Worker**: OCR and asynchronous tasks (tesseract/node-tesseract-ocr integrable)
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

---

### Português

**Study Cycle** é uma plataforma avançada de gerenciamento de aprendizado que combina otimização de cronograma de estudos com algoritmos de revisão adaptativos e gerenciamento de cursos. A plataforma ajuda os usuários a organizar seus estudos, criar e acompanhar ciclos de estudo, e fornece uma experiência de aprendizado abrangente através de cursos, gerenciamento de conteúdo e agendamento inteligente de revisões.

#### Principais Funcionalidades

- **Algoritmo de Revisão Adaptativa**: Baseado em eventos de revisão e parâmetro λ por usuário, otimizando o espaçamento das sessões de revisão para melhor retenção
- **Geração de Conteúdo**: Conteúdo criado por professores, comunidade e IA (geração de questões/variações)
- **Uploads de Arquivos com OCR**: Extração automática de texto de arquivos enviados e geração de variantes de revisão
- **Autenticação**: Autenticação padrão (email/senha) e login social (GitHub, Google, Facebook) com possibilidade de vincular contas
- **Área de Professores**: Upload e gerenciamento de conteúdo e cursos para educadores
- **Recursos de Rede Social**: Perfis, seguimento, comentários/curtidas (planejado)
- **Sistema de Gamificação**: Acompanhamento de sequências, sistema de XP, ligas competitivas, conquistas e certificados
- **Suporte Multi-idioma**: Internacionalização com suporte para vários idiomas

#### Stack Tecnológico

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Storage**: Implementação híbrida (MemStorage para protótipo; Drizzle/SQLite para dados de ML/revisão)
- **Queue/Worker**: OCR e tarefas assíncronas (tesseract/node-tesseract-ocr integrável)
- **Componentes UI**: Primitivos Radix UI com shadcn/ui
- **Gerenciamento de Estado**: TanStack Query (React Query)
- **Roteamento**: Wouter para roteamento leve no lado do cliente
- **Gerenciamento de Formulários**: React Hook Form com validação Zod

---

## 🚀 Getting Started / Começando

### Prerequisites / Pré-requisitos

- Node.js (v18+ recommended / recomendado)
- npm / pnpm / yarn (the project uses `npm` / o projeto usa `npm`)
- Git
- (Optional / Opcional) No database setup required - SQLite file is created automatically / Nenhuma configuração de banco necessária - arquivo SQLite é criado automaticamente
- For OCR: `tesseract` binary (if using the tesseract worker) or install corresponding node libraries / Para OCR: binário `tesseract` (se usar o worker com tesseract) ou instalar as libs node correspondentes

### Environment Variables / Variáveis de Ambiente

Important environment variables / Variáveis de ambiente importantes:

- `PORT` — Server port (default: 5000)
- `NODE_ENV` — Environment mode: `development`, `production`, or `test` (default: `development`)
- `DATABASE_URL` — SQLite database file path (default: `./database.sqlite` / padrão: `./database.sqlite`)
- `JWT_SECRET` — JWT secret used to issue tokens (don't use fallback in production / não usar o fallback em produção)
- `SERVER_URL` — Public server URL (e.g., `http://localhost:3000`)
- `FRONTEND_URL` — Frontend URL (e.g., `http://localhost:5173`)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth credentials (optional)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth credentials (optional)
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` — Facebook OAuth credentials (optional)
- `OPENAI_API_KEY` — (Optional / Opcional) OpenAI API key for content generation

**Example `.env` file / Exemplo de arquivo `.env`:**

```env
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
OPENAI_API_KEY=your_openai_api_key_optional
```

### Installation and Local Execution / Instalação e Execução Local

1. **Clone the repository / Clone o repositório**

```bash
git clone https://github.com/eduardo5010/study-cycle.git
cd study-cycle
```

2. **Install dependencies / Instale dependências**

```bash
npm install
```

3. **Create a `.env` file with essential variables (see list above) / Crie um arquivo `.env` com as variáveis essenciais (veja a lista acima)**

Example minimum for development / Exemplo mínimo para desenvolvimento:

```env
JWT_SECRET=dev-secret
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

4. **Start the server (dev mode) / Inicie o servidor (modo dev)**

```bash
npm run dev --workspace server
# or, if the project has consolidated scripts, use: npm run dev
# ou, se o projeto tiver scripts consolidados, use: npm run dev
```

5. **Start the frontend / Inicie o frontend**

```bash
npm run dev --workspace client
# or: cd client && npm run dev
# ou: cd client && npm run dev
```

6. **(Optional) Start the OCR worker/queue / (Opcional) Inicie o worker OCR/fila**

```bash
# if there's a script: npm run worker
# se houver script: npm run worker
node server/ocr/worker.js # or run the responsible task/file
# ou rode a task/arquivo responsável
```

---

## 📋 Tasks and Current Status / Tarefas e Status Atuais

This section lists development tasks and current status — useful for continuing work on another operating system. / Esta seção lista as tarefas de desenvolvimento e o status atual — útil para continuar o trabalho em outro sistema operacional.

- [x] Migrate to SQLite / Migrar para SQLite
- [x] Update database schemas / Atualizar schemas do banco de dados
- [x] Update database configuration / Atualizar configuração do banco de dados
- [x] Generate Drizzle SQL migration / Gerar migração SQL Drizzle
- [x] Instructions for running migration / Instruções para executar migração
- [x] Sync translations / Sincronizar traduções
- [x] Implement uploads API and private storage / Implementar uploads API e armazenamento privado
- [x] Implement OCR worker and queue / Implementar OCR worker e queue
- [x] Implement AI generation endpoint / Implementar endpoint de geração AI
- [x] Implement frontend FileUploader / Implementar frontend FileUploader
- [x] Implement secure download endpoint / Implementar secure download endpoint
- [x] Implement enhanced generation helper (prompts) / Implementar helper de geração aprimorado (prompts)
- [x] Integrate scheduling with review algorithm (λ per user) / Integrar agendamento com algoritmo de revisão (λ por usuário)
- [x] Create Login and Register pages (frontend) / Criar páginas de Login e Cadastro (frontend)
- [x] Implement JWT and OAuth (GitHub, Google, Facebook) — server: support and callbacks implemented; frontend: pages with links implemented / Implementar JWT e OAuth (GitHub, Google, Facebook) — servidor: suporte e callbacks implementados; frontend: páginas com links implementadas
- [ ] Privacy/Permissions: migrate auth header to JWT (partially done — server issues JWT and accepts Bearer; migrating legacy clients may be necessary) / Privacidade/Permissões: migrar auth header para JWT (parcialmente feito — servidor emite JWT e aceita Bearer; migrar clientes legacy pode ser necessário)
- [ ] Install OCR dependencies and instructions (pending: install binaries on new OS) / Instalar dependências OCR e instruções (pendente: instalar binários em novo SO)
- [ ] Persist scheduler/job queue outside process (optional, recommended: Redis/Bull) / Persistir scheduler/job queue fora do processo (opcional, recomendado: Redis/Bull)
- [ ] Polish prompts and QA of pt-br translations / Polir prompts e QA das traduções pt-br
- [ ] Docs & README final / Docs & README final
- [ ] Integrate UI for link/unlink in profile (frontend) — pending / Integrar UI de link/unlink no perfil (frontend) — pendente
- [ ] Document OAuth and JWT environment variables — pending / Documentar variáveis de ambiente OAuth e JWT (pendente)

---

## 🔄 Continuity Notes / Observações sobre Continuidade

- If switching operating systems, install the dependencies listed above and make sure to copy the `.env` with the variables you were using. / Se trocar de sistema operacional, instale as dependências listadas acima e certifique-se de copiar o `.env` com as variáveis que você estava usando.
- If you were using local uploads in the `server/uploads/` directory, copy that directory if you want to keep existing files. / Se você usava uploads locais no diretório `server/uploads/`, copie esse diretório se quiser manter os arquivos existentes.
- To resume the OCR worker, install the `tesseract` binary on the new OS and the node dependencies (if applicable). / Para retomar o worker OCR, instale o binário `tesseract` no novo SO e as dependências node (se for o caso).

---

## ✅ Quick Resume Checklist (when changing OS) / Checklist Rápido para Retomar (ao mudar de SO)

1. Clone the repository and enter the `develop` branch. / Clonar o repositório e entrar na branch `develop`.
2. Install Node.js and package manager (npm/pnpm/yarn). / Instalar Node.js e o gerenciador de pacotes (npm/pnpm/yarn).
3. Restore `.env` with necessary variables (see section above). / Restaurar `.env` com as variáveis necessárias (veja seção acima).
4. (Optional) The SQLite database file will be created automatically on first run. / (Opcional) O arquivo de banco SQLite será criado automaticamente na primeira execução.
5. Copy `server/uploads/` if you want to keep already uploaded files. / Copiar `server/uploads/` se quiser manter arquivos já enviados.
6. Run `npm install` and `npm run dev` for server and frontend. / Rodar `npm install` e `npm run dev` para server e frontend.
7. Check server logs for any typing/environment variable errors. / Verificar os logs do servidor para eventuais erros de tipagem/variáveis de ambiente.

---

## 🤝 Contributing / Contribuindo

- Open an issue describing what you want to implement or fix something directly in a branch and open a PR to `develop`. / Abra uma issue descrevendo o que quer implementar ou corrija algo diretamente em uma branch e abra um PR para `develop`.

---

## 📝 Additional Notes / Notas Adicionais

This README serves as a starting point for anyone (on another operating system) to resume development. / Este README serve como ponto de partida para qualquer pessoa (em outro sistema operacional) retomar o desenvolvimento.

If you want me to implement the UI for link/unlink in the profile or generate an `ENV.example` file with all variables, let me know which you prefer next. / Se quiser que eu já implemente a UI de link/unlink no perfil ou gere um arquivo `ENV.example` com todas as variáveis, diga qual prefere que eu faça em seguida.
