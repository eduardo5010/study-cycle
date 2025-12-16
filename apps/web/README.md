# 🎓 StudyCycle - Plataforma de Aprendizado Inteligente

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**🇧🇷 PT-BR** | [🇺🇸 English](#study-cycle---intelligent-learning-platform)

---

## 📖 Sobre o Projeto

**StudyCycle** é uma plataforma avançada de aprendizado que combina organização de estudos, algoritmos de revisão adaptativos e gerenciamento de cursos. A plataforma ajuda estudantes a organizar seus estudos, criar ciclos de aprendizado personalizados e oferece uma experiência educacional completa através de cursos, gerenciamento de conteúdo e agendamento inteligente de revisões.

### ✨ Funcionalidades Principais

- 🧠 **Avaliação de Memória Inteligente**: Questionário interativo para determinar o tipo de memória do usuário (Boa/Média/Ruim) e ajustar o parâmetro λ
- 📚 **Gerenciamento Completo de Ciclos de Estudo**: Criação, edição e acompanhamento de ciclos personalizados com matérias fixas/rotativas
- 🎯 **Algoritmo de Revisão Adaptativo**: Baseado em eventos de revisão e parâmetro λ individual, otimizando intervalos para melhor retenção
- 🤖 **Geração de Conteúdo com IA**: Criação de flashcards, questões e variações usando inteligência artificial
- 📁 **Upload de Arquivos com OCR**: Extração automática de texto de PDFs/imagens e geração de variantes de revisão
- 🔐 **Autenticação Completa**: Login tradicional e social (GitHub, Google) com vinculação de contas
- 👨‍🏫 **Área do Professor**: Upload e gerenciamento de conteúdo educacional
- 🌐 **Rede Social Educacional**: Feed social, grupos de estudo, desafios comunitários
- 🏆 **Sistema de Gamificação**: XP, conquistas, ligas competitivas e certificados
- 📊 **Analytics de Aprendizado**: Gráficos de progresso, estatísticas detalhadas
- 🗓️ **Calendário Interativo**: Agendamento e acompanhamento de sessões de estudo
- 💬 **Sistema de Chat**: Mensagens em tempo real para grupos de estudo
- 🔔 **Notificações Inteligentes**: Lembretes de estudo, conquistas e atividades sociais
- 🌍 **Suporte Multi-idioma**: Interface traduzida para múltiplos idiomas
- 📱 **Design Responsivo**: Perfeito em desktop, tablet e mobile

### 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: SQLite com Drizzle ORM
- **UI/UX**: Tailwind CSS + Radix UI + shadcn/ui
- **Estado**: TanStack Query (React Query)
- **Roteamento**: Wouter (cliente leve)
- **Formulários**: React Hook Form + Zod
- **Autenticação**: JWT + Passport.js
- **Upload**: Multer com OCR
- **IA**: Integração OpenAI (opcional)
- **Processamento**: Filas assíncronas para OCR

---

## 🚀 Começando

### 📋 Pré-requisitos

- **Node.js** (versão 18+ recomendada)
- **Git** para controle de versão
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

> 💡 **Nota**: O banco SQLite é criado automaticamente. Não há necessidade de configurar PostgreSQL ou outros bancos!

### ⚡ Instalação Rápida (3 passos)

```bash
# 1. Clone o repositório
git clone https://github.com/eduardo5010/study-cycle.git
cd study-cycle

# 2. Instale as dependências
npm install

# 3. Execute o projeto
npm run dev
```

**🎉 Pronto!** A aplicação estará rodando em:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 🔧 Configuração Detalhada

### 🔐 Segurança e Credenciais

#### **Proteção de Credenciais**
- **Nunca commite** arquivos `.env*` reais no GitHub
- **Use sempre** os arquivos `.env.example` como template
- **Configure** credenciais apenas localmente em `.env.local`

#### **Arquivos Seguros no Git:**
- ✅ `.env.example` - Template com placeholders
- ✅ `.env.local.example` - Exemplo completo
- ❌ `.env` - Suas credenciais reais
- ❌ `.env.local` - Suas configurações locais

### 📄 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

Conteúdo recomendado para desenvolvimento:

```env
# Servidor
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Banco de Dados
DATABASE_URL=./database.sqlite

# Autenticação JWT
JWT_SECRET=sua-chave-jwt-super-secreta-mude-isto-em-producao

# OAuth (Opcional - funciona sem eles)
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# IA (Opcional)
OPENAI_API_KEY=sua_chave_openai_opcional
```

### 🔑 Configuração OAuth (Opcional)

A aplicação funciona perfeitamente sem OAuth. Para habilitar login social:

#### GitHub OAuth
1. Acesse: https://github.com/settings/developers
2. Crie um "OAuth App"
3. URL de callback: `http://localhost:3000/api/auth/oauth/github/callback`

#### Google OAuth
1. Acesse: https://console.cloud.google.com/
2. Crie credenciais OAuth
3. URI de redirecionamento: `http://localhost:3000/api/auth/oauth/google/callback`

### 📊 Banco de Dados

#### **Configuração Dual Automática**
O projeto suporta **tanto SQLite quanto PostgreSQL** automaticamente:

- **SQLite** (padrão): Criado automaticamente em `./database.sqlite`
- **PostgreSQL** (Docker): Use quando precisar escalar ou desenvolvimento avançado

#### **Como Escolher o Banco:**

**Para SQLite (Recomendado para desenvolvimento rápido):**
```env
DATABASE_URL=./database.sqlite
```

**Para PostgreSQL (Docker - Execute primeiro):**
```bash
# Inicie o PostgreSQL no Docker
docker-compose up -d

# Configure a URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/study_cycle
```

#### **Adminer (Interface Web)**
Quando usar PostgreSQL, acesse: http://localhost:8080
- **Sistema**: PostgreSQL
- **Servidor**: db (nome do container)
- **Usuário**: postgres
- **Senha**: postgres
- **Banco**: study_cycle

#### **Recursos Automáticos**
- **Detecção automática** do tipo de banco pela URL
- **Migrações** executadas automaticamente na inicialização
- **Schemas compatíveis** com ambos os bancos
- **Nenhum setup adicional** necessário para SQLite!

---

## 📱 Funcionalidades em Detalhe

### 🧠 Sistema de Avaliação de Memória

**Como funciona:**
1. Questionário interativo de 4 perguntas sobre hábitos de estudo
2. Algoritmo classifica memória: Boa/Média/Ruim
3. Ajusta parâmetro λ automaticamente
4. Otimiza espaçamento de revisões

**Benefícios:**
- Aprendizado personalizado
- Melhor retenção de conhecimento
- Revisões no timing ideal

### 📚 Gerenciamento de Ciclos de Estudo

**Recursos:**
- **Criador de Ciclos**: Wizard de 4 passos com templates
- **Editor Avançado**: Matérias fixas vs rotativas
- **Dificuldade Adaptável**: Fácil/Médio/Difícil/Adaptável
- **Agendamento Semanal**: Slots de tempo detalhados
- **Acompanhamento Visual**: Progresso em tempo real

### 🤖 Geração de Conteúdo com IA

**Flashcards Inteligentes:**
- Entrada: Texto, URLs, arquivos ou tópicos
- Análise automática de conceitos-chave
- Geração personalizada por dificuldade
- Criação em lote

### 🌐 Rede Social Educacional

**Recursos Sociais:**
- **Feed de Estudos**: Posts, comentários, likes
- **Stories**: Compartilhar conquistas
- **Desafios Comunitários**: 30 dias de leitura, problemas de matemática
- **Grupos de Estudo**: Colaboração em tempo real
- **Ranking de Contribuições**: Sistema de XP

### 🏆 Gamificação Avançada

**Sistema Completo:**
- **Leaderboard Dinâmico**: Rankings competitivos/colaborativos
- **Sistema de Conquistas**: 100+ achievements
- **Ligas**: Bronze → Prata → Ouro → Diamante → Mestre
- **Desafios**: Diário/Semanal/Mensal
- **XP e Níveis**: Progressão detalhada

### 👨‍🏫 Plataforma de Ensino

**Ferramentas para Professores:**
- **Construtor de Cursos**: Drag & drop com IA
- **Suporte LaTeX**: Equações matemáticas
- **Blocos de Código**: Ambiente tipo VSCode
- **Perfis Públicos**: Portfólio de cursos
- **Geração Automática**: Lições, exercícios, quizzes

### 📊 Analytics e Dashboard

**Métricas Detalhadas:**
- **Progresso de Habilidades**: Barras XP visuais
- **Atividades Recentes**: Timeline de conquistas
- **Calendário Interativo**: Sessões agendadas
- **Estatísticas de Memória**: Acurácia e retenção

---

## 🏗️ Estrutura do Projeto

```
study-cycle/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── contexts/        # Contextos React
│   │   ├── hooks/           # Hooks customizados
│   │   └── lib/             # Utilitários
│   └── public/              # Assets estáticos
├── server/                   # Backend Node.js
│   ├── db/                  # Configuração do banco
│   ├── middleware/          # Middlewares Express
│   ├── routes.ts            # Rotas da API
│   ├── storage.ts           # Camada de dados
│   └── utils/               # Utilitários do servidor
├── shared/                  # Código compartilhado
│   ├── schema.ts            # Schemas Zod
│   └── types.ts             # Tipos TypeScript
└── docs/                    # Documentação adicional
```

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor + cliente em modo dev

# Produção
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Banco de Dados
npm run db:push      # Sincroniza schema com banco
npm run db:generate  # Gera migrações Drizzle

# Utilitários
npm run check        # Verifica tipos TypeScript
```

---

## 🔐 Autenticação e Segurança

### JWT + OAuth
- **Tokens JWT** seguros para sessões
- **Login Social** com GitHub e Google
- **Vinculação de Contas** múltiplas
- **Redirecionamentos Inteligentes** pós-login

### Upload Seguro
- **Validação de Arquivos**: Tipos e tamanhos
- **Armazenamento Privado**: Por usuário
- **OCR Automático**: Extração de texto
- **Download Seguro**: Controle de permissões

---

## 🌍 Internacionalização

### Idiomas Suportados
- 🇺🇸 **Inglês** (completo)
- 🇧🇷 **Português Brasileiro** (completo)
- 🇪🇸 **Espanhol** (parcial)
- 🇫🇷 **Francês** (parcial)
- 🇩🇪 **Alemão** (parcial)

### Como Adicionar Traduções
```typescript
// Adicionar em client/src/translations/[lang].json
{
  "nova.chave": "Texto traduzido"
}
```

---

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o projeto
2. **Clone** sua fork: `git clone https://github.com/SEU_USERNAME/study-cycle.git`
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push** para branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### Diretrizes
- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits descritivos em português ou inglês

---

## 📋 Checklist para Retomada do Desenvolvimento

### ✅ Ao Mudar de Sistema Operacional
- [ ] Clonar repositório e entrar na branch `develop`
- [ ] Instalar Node.js (v18+) e npm
- [ ] Restaurar `.env` com variáveis necessárias
- [ ] Executar `npm install`
- [ ] Copiar `server/uploads/` (se houver arquivos)
- [ ] Executar `npm run dev`
- [ ] Verificar logs do servidor

### ✅ Dependências Adicionais
- [ ] **OCR**: Instalar `tesseract` (opcional)
- [ ] **Redis**: Para filas em produção (opcional)
- [ ] **OAuth**: Credenciais GitHub/Google (opcional)

---

## 🐛 Resolução de Problemas

### Problemas Comuns

**Erro de Porta Ocupada:**
```bash
# Mude a porta no .env
PORT=3001
```

**Erro de Banco:**
```bash
# Delete o arquivo e reinicie
rm database.sqlite
npm run dev
```

**Erro de Dependências:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Status do Desenvolvimento

### ✅ Implementado
- [x] Sistema completo de avaliação de memória
- [x] Dashboard interativo com todas as funcionalidades
- [x] Gerenciamento avançado de ciclos de estudo
- [x] Geração de flashcards com IA
- [x] Upload de arquivos com OCR
- [x] Autenticação JWT + OAuth
- [x] Rede social educacional
- [x] Sistema de gamificação completo
- [x] Plataforma de ensino para professores
- [x] Analytics e métricas detalhadas
- [x] Design responsivo e acessível
- [x] Scrollbars personalizadas
- [x] Suporte multi-idioma

### 🚧 Em Desenvolvimento
- [ ] Vídeo-conferência em grupos de estudo
- [ ] Sistema avançado de certificados
- [ ] Integração com plataformas LMS
- [ ] Mobile app nativa

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/eduardo5010/study-cycle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/eduardo5010/study-cycle/discussions)
- **Email**: Para questões específicas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

Agradecemos a todas as pessoas que contribuíram para este projeto e à comunidade open source que tornou possível o desenvolvimento desta plataforma educacional.

---

---

# 🇺🇸 Study Cycle - Intelligent Learning Platform

## 📖 About the Project

**Study Cycle** is an advanced learning management platform that combines study schedule optimization with adaptive review algorithms and course management. The platform helps users organize their studies, create and track study cycles, and provides a comprehensive learning experience through courses, content management, and intelligent review scheduling.

### ✨ Key Features

- 🧠 **Intelligent Memory Assessment**: Interactive quiz to determine user's memory type (Good/Average/Poor) and adjust λ parameter
- 📚 **Complete Study Cycle Management**: Create, edit, and track personalized study cycles with fixed/rotating subjects
- 🎯 **Adaptive Review Algorithm**: Based on review events and per-user λ parameter, optimizing spacing for better retention
- 🤖 **AI Content Generation**: Create flashcards, questions, and variations using artificial intelligence
- 📁 **File Upload with OCR**: Automatic text extraction from PDFs/images and generation of review variants
- 🔐 **Complete Authentication**: Traditional and social login (GitHub, Google) with account linking
- 👨‍🏫 **Teacher Area**: Upload and management of educational content
- 🌐 **Educational Social Network**: Social feed, study groups, community challenges
- 🏆 **Advanced Gamification**: XP, achievements, competitive leagues, and certificates
- 📊 **Learning Analytics**: Progress charts, detailed statistics
- 🗓️ **Interactive Calendar**: Scheduling and tracking of study sessions
- 💬 **Chat System**: Real-time messaging for study groups
- 🔔 **Smart Notifications**: Study reminders, achievements, and social activities
- 🌍 **Multi-language Support**: Interface translated to multiple languages
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile

### 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite with Drizzle ORM
- **UI/UX**: Tailwind CSS + Radix UI + shadcn/ui
- **State**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight client-side)
- **Forms**: React Hook Form + Zod
- **Authentication**: JWT + Passport.js
- **Upload**: Multer with OCR
- **AI**: OpenAI integration (optional)
- **Processing**: Async queues for OCR

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

> 💡 **Note**: SQLite database is created automatically. No need to configure PostgreSQL or other databases!

### ⚡ Quick Installation (3 steps)

```bash
# 1. Clone the repository
git clone https://github.com/eduardo5010/study-cycle.git
cd study-cycle

# 2. Install dependencies
npm install

# 3. Run the project
npm run dev
```

**🎉 Done!** The application will be running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 🔧 Detailed Configuration

### 📄 Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Recommended content for development:

```env
# Server
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=./database.sqlite

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OAuth (Optional - works without them)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI (Optional)
OPENAI_API_KEY=your_openai_api_key_optional
```

### 🔑 OAuth Setup (Optional)

The app works perfectly without OAuth. To enable social login:

#### GitHub OAuth
1. Go to: https://github.com/settings/developers
2. Create OAuth App with callback URL: `http://localhost:3000/api/auth/oauth/github/callback`

#### Google OAuth
1. Go to: https://console.cloud.google.com/
2. Create OAuth credentials with redirect URI: `http://localhost:3000/api/auth/oauth/google/callback`

### 📊 Database

- **SQLite** is created automatically at `./database.sqlite`
- **Migrations** run automatically on startup
- **No additional setup** required!

---

## 📱 Features in Detail

### 🧠 Memory Assessment System

**How it works:**
1. Interactive 4-question quiz about study habits
2. Algorithm classifies memory: Good/Average/Poor
3. Automatically adjusts λ parameter
4. Optimizes review spacing

**Benefits:**
- Personalized learning
- Better knowledge retention
- Reviews at ideal timing

### 📚 Study Cycle Management

**Features:**
- **Cycle Creator**: 4-step wizard with templates
- **Advanced Editor**: Fixed vs rotating subjects
- **Adaptive Difficulty**: Easy, Medium, Hard, and Adaptive levels
- **Weekly Scheduling**: Detailed day-by-day time slots
- **Visual Tracking**: Real-time progress

### 🤖 AI Content Generation

**Smart Flashcards:**
- Input: Text, URLs, files, or topic descriptions
- Automatic key concept analysis
- Personalized generation by difficulty
- Batch creation

### 🌐 Educational Social Network

**Social Features:**
- **Study Feed**: Posts, comments, likes
- **Stories**: Share achievements
- **Community Challenges**: 30-day reading, math problems
- **Study Groups**: Real-time collaboration
- **Contribution Ranking**: XP system

### 🏆 Advanced Gamification

**Complete System:**
- **Dynamic Leaderboard**: Competitive/collaborative rankings
- **Achievement System**: 100+ achievements
- **League System**: Bronze→Silver→Gold→Diamond→Master progression
- **Challenge System**: Daily/Weekly/Monthly challenges
- **XP & Levels**: Comprehensive leveling

### 👨‍🏫 Teaching Platform

**Tools for Teachers:**
- **Course Builder**: Drag & drop with AI assistance
- **LaTeX Support**: Mathematical equations
- **Code Blocks**: VSCode-style environment
- **Public Profiles**: Course portfolios
- **Auto Generation**: Lessons, exercises, quizzes

### 📊 Analytics & Dashboard

**Detailed Metrics:**
- **Skills Progress Chart**: Visual XP bars
- **Recent Activity**: Achievement timeline
- **Interactive Calendar**: Scheduled sessions
- **Memory Statistics**: Accuracy and retention

---

## 🏗️ Project Structure

```
study-cycle/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/           # Application Pages
│   │   ├── contexts/        # React Contexts
│   │   ├── hooks/           # Custom Hooks
│   │   └── lib/             # Utilities
│   └── public/              # Static Assets
├── server/                   # Node.js Backend
│   ├── db/                  # Database Configuration
│   ├── middleware/          # Express Middlewares
│   ├── routes.ts            # API Routes
│   ├── storage.ts           # Data Layer
│   └── utils/               # Server Utilities
├── shared/                  # Shared Code
│   ├── schema.ts            # Zod Schemas
│   └── types.ts             # TypeScript Types
└── docs/                    # Additional Documentation
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start both server and client in dev mode

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Sync schema with database
npm run db:generate  # Generate Drizzle migrations

# Utilities
npm run check        # Check TypeScript types
```

---

## 🔐 Authentication & Security

### JWT + OAuth
- **Secure JWT tokens** for sessions
- **Social login** with GitHub and Google
- **Account linking** multiple accounts
- **Smart redirects** post-login

### Secure Upload
- **File validation**: Types and sizes
- **Private storage**: Per user
- **Automatic OCR**: Text extraction
- **Secure download**: Permission control

---

## 🌍 Internationalization

### Supported Languages
- 🇺🇸 **English** (complete)
- 🇧🇷 **Brazilian Portuguese** (complete)
- 🇪🇸 **Spanish** (partial)
- 🇫🇷 **French** (partial)
- 🇩🇪 **German** (partial)

### Adding Translations
```typescript
// Add to client/src/translations/[lang].json
{
  "new.key": "Translated text"
}
```

---

## 🤝 Contributing

### How to Contribute
1. **Fork** the project
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/study-cycle.git`
3. **Create** a branch: `git checkout -b feature/new-feature`
4. **Commit** your changes: `git commit -m 'Add new feature'`
5. **Push** to branch: `git push origin feature/new-feature`
6. **Open** a Pull Request

### Guidelines
- Follow existing code standards
- Add tests for new features
- Update documentation when necessary
- Use descriptive commits in Portuguese or English

---

## 📋 Resume Checklist (when changing OS)

### ✅ When Changing Operating System
- [ ] Clone repository and enter `develop` branch
- [ ] Install Node.js and package manager (npm)
- [ ] Restore `.env` with necessary variables
- [ ] Run `npm install`
- [ ] Copy `server/uploads/` if keeping files
- [ ] Run `npm run dev`
- [ ] Check server logs for errors

### ✅ Additional Dependencies
- [ ] **OCR**: Install `tesseract` (optional)
- [ ] **Redis**: For production queues (optional)
- [ ] **OAuth**: GitHub/Google credentials (optional)

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Change port in .env
PORT=3001
```

**Database Error:**
```bash
# Delete file and restart
rm database.sqlite
npm run dev
```

**Dependencies Error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Development Status

### ✅ Implemented
- [x] Complete memory assessment system
- [x] Interactive dashboard with all features
- [x] Advanced study cycle management
- [x] AI flashcard generation
- [x] File upload with OCR
- [x] JWT + OAuth authentication
- [x] Educational social network
- [x] Complete gamification system
- [x] Teaching platform for educators
- [x] Detailed analytics and metrics
- [x] Responsive and accessible design
- [x] Custom scrollbars
- [x] Multi-language support

### 🚧 In Development
- [ ] Video conferencing in study groups
- [ ] Advanced certification system
- [ ] LMS platform integrations
- [ ] Native mobile app

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/eduardo5010/study-cycle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/eduardo5010/study-cycle/discussions)
- **Email**: For specific questions

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

We thank all contributors to this project and the open source community that made the development of this educational platform possible.

---

## 📖 Project Overview

### English

**Study Cycle** is an advanced learning management platform that combines study schedule optimization with adaptive review algorithms and course management. The platform helps users organize their studies, create and track study cycles, and provides a comprehensive learning experience through courses, content management, and intelligent review scheduling.

#### Key Features

- **Complete Study Cycle Management**: Create, edit, and manage personalized study cycles with fixed/rotating subjects, difficulty adaptation, and progress tracking
- **Adaptive Review Algorithm**: Based on review events and per-user λ parameter, optimizing the spacing of review sessions for better retention
- **Content Generation**: Content created by teachers, community, and AI (question generation/variations)
- **File Uploads with OCR**: Automatic text extraction from uploaded files and generation of review variants
- **Authentication**: Standard email/password authentication and social login (GitHub, Google) with account linking capability
- **Teacher Area**: Upload and management of content and courses for educators
- **Social Network Features**: Complete social feed with posts, comments, likes, stories, study challenges, and community engagement
- **Gamification System**: Streak tracking, XP system, competitive leagues, achievements, and certificates
- **Multi-language Support**: Internationalization with support for multiple languages
- **Study Management**: Calendar, chat groups, comprehensive settings, notifications, and progress tracking
- **Notification System**: Push notifications for study reminders, achievements, social activity, and group invites

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

### 📱 New Features / Novas Funcionalidades

#### Social Network System / Sistema de Rede Social
- **Study Feed** (`/feed`): Complete social platform with posts, comments, likes, and bookmarks
- **Study Stories**: Instagram-like stories for sharing achievements and progress
- **Study Challenges**: Community challenges (30-day reading, math problems, etc.)
- **Top Contributors**: Leaderboard with XP system and badges
- **Interactive Posts**: Text posts, achievement posts, media sharing

#### Study Cycle Management / Gerenciamento de Ciclos de Estudo
- **Cycle Creator** (`/cycle/create`): 4-step wizard to create personalized study cycles with templates
- **Cycle Editor** (`/cycle/edit`): Comprehensive editor for subjects, schedules, and difficulty settings
- **Fixed vs Rotating Subjects**: Configure which subjects are fixed (daily) or rotating (scheduled days)
- **Adaptive Difficulty**: Easy, Medium, Hard, and Adaptive difficulty levels for each subject
- **Weekly Scheduling**: Detailed day-by-day subject scheduling with time slots

#### Advanced AI-Powered Learning / Aprendizado Avançado com IA
- **AI Flashcard Generator** (`/ai-flashcards`): Generate personalized flashcards from any content using AI
- **Multiple Input Sources**: Text, URLs, files, or topic descriptions
- **Smart Content Analysis**: AI analyzes and extracts key concepts automatically
- **Adaptive Generation**: Creates cards with appropriate difficulty levels
- **Batch Generation**: Generate multiple flashcards at once

#### Collaborative Learning / Aprendizado Colaborativo
- **Study Groups** (`/study-groups`): Join or create collaborative study sessions
- **Video Conferencing**: Integrated video calls with screen sharing
- **Group Scheduling**: Organize study sessions with calendar integration
- **Live Sessions**: Real-time collaborative learning with chat and notes
- **Recording & Playback**: Record sessions for later review

#### Spaced Repetition & Adaptive Learning / Repetição Espaçada e Aprendizado Adaptativo
- **Memory Assessment**: Interactive quiz to determine user's memory type (Good/Average/Poor) and set λ parameter
- **Adaptive λ Parameter**: Learning algorithm automatically adjusts based on user's memory assessment
- **Flashcard System**: Anki/Quizlet-style spaced repetition with multiple difficulty levels
- **Algorithm Integration**: Cards scheduled using existing ML algorithm with user-specific λ
- **Review Modes**: Learn new cards, review due cards, practice mode
- **Progress Tracking**: Detailed statistics on learning effectiveness and retention

#### Advanced Gamification System / Sistema Avançado de Gamificação
- **Leaderboard** (`/leaderboard`): Dynamic rankings activated with 2+ users, competitive vs collaborative scoring
- **Achievement System**: 100+ achievements across learning, competitive, and collaborative categories
- **League System**: Bronze→Silver→Gold→Diamond→Master progression with dynamic rewards
- **Challenge System**: Daily/Weekly/Monthly challenges with community participation
- **XP & Levels**: Comprehensive leveling system with progress tracking
- **Seasonal Events**: Time-limited events with special rewards and achievements

#### Advanced Course Creation & Teaching Platform / Plataforma Avançada de Criação de Cursos
- **Course Builder** (`/course-builder`): Drag-and-drop course creation with AI assistance, LaTeX support, code blocks, and VSCode-style IDE
- **Teacher Profiles** (`/teacher/:id`): Public teacher profiles accessible via social networks with course portfolios
- **AI Content Generation**: Generate lessons, exercises, quizzes, and theory automatically using LLM
- **Khan Academy-Style Skills**: Structured learning paths with prerequisites and progress tracking
- **Advanced Components**: Text, video, images, quizzes, exercises, code blocks with LaTeX math support

#### Dashboard & Learning Analytics / Dashboard e Analytics de Aprendizado
- **Skills Progress Chart**: Codecademy-style visual progress tracking with XP bars, icons, and completion status
- **Interactive Skill Cards**: Color-coded progress bars, category badges, and level indicators
- **Overall Learning Progress**: Combined XP tracking across all subjects and skills
- **Recent Activity Timeline**: Last activity timestamps and completion tracking

#### Study Management Pages / Páginas de Gerenciamento de Estudos
- **Profile** (`/profile`): User profile with memory assessment, achievements, and statistics
- **Flashcards** (`/flashcards`): Spaced repetition learning system with adaptive algorithms
- **Settings** (`/settings`): Comprehensive settings with tabs (Study, Notifications, Appearance, Account)
- **Calendar** (`/calendar`): Interactive study calendar with session tracking
- **Chats** (`/chats`): Study group chats with real-time messaging
- **Notifications** (`/notifications`): Complete notification system with filters and settings
- **Events** (`/events`): Community events and webinars (coming soon)
- **English** (`/english`): English learning courses (coming soon)
- **Mandarin** (`/mandarin`): Mandarin learning courses (coming soon)

#### UI/UX Improvements / Melhorias de Interface
- **Smart Logo**: Redirects to landing page for guests, dashboard for logged users
- **Unified Header**: Same header style across landing/auth pages
- **Navigation**: Added Feed link in main navigation
- **Responsive Design**: All new pages fully responsive
- **Translation System**: Complete i18n support with new keys

#### Authentication Enhancements / Melhorias de Autenticação
- **OAuth Integration**: GitHub and Google OAuth fully functional
- **Account Linking**: Connect social accounts to existing profiles
- **Smart Redirects**: Post-login redirects based on user context
- **Secure Callbacks**: Proper OAuth callback handling

#### Technical Improvements / Melhorias Técnicas
- **ESM Migration**: Converted all `require()` to ES6 imports
- **Environment Variables**: Proper SERVER_URL and FRONTEND_URL handling
- **Error Handling**: Better OAuth error management
- **Type Safety**: Full TypeScript support across all new features

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

### Quick Start / Início Rápido

1. **Clone and setup / Clone e configure**

```bash
git clone https://github.com/eduardo5010/study-cycle.git
cd study-cycle
npm install
```

2. **Configure environment / Configure o ambiente**

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your credentials (optional for basic functionality)
# OAuth credentials are optional - the app works without them
```

3. **Start development / Inicie o desenvolvimento**

```bash
npm run dev
```

That's it! The app will be running at `http://localhost:3000`

---

### Detailed Setup / Configuração Detalhada

#### Environment Configuration / Configuração do Ambiente

**Option 1: Quick setup (recommended) / Configuração rápida (recomendada)**
```bash
cp .env.local.example .env.local
# The app works out-of-the-box with default settings
```

**Option 2: Custom configuration / Configuração personalizada**
```bash
cp .env.local.example .env.local
# Edit .env.local with your OAuth credentials for social login
```

#### OAuth Setup (Optional) / Configuração OAuth (Opcional)

The app works perfectly without OAuth. To enable social login:

1. **GitHub OAuth:**
   - Go to https://github.com/settings/developers
   - Create OAuth App with callback URL: `http://localhost:3000/api/auth/oauth/github/callback`

2. **Google OAuth:**
   - Go to https://console.cloud.google.com/
   - Create OAuth credentials with redirect URI: `http://localhost:3000/api/auth/oauth/google/callback`

3. **Update `.env.local`** with your credentials

#### Database / Banco de Dados

SQLite database is created automatically at `./database.sqlite` on first run.
No additional setup required!

#### File Uploads / Uploads de Arquivos

Upload directory structure is maintained automatically. No configuration needed.

---

### Available Scripts / Scripts Disponíveis

```bash
npm run dev          # Start both server and client in development mode
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
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
- [x] Implement JWT and OAuth (GitHub, Google) — server: support and callbacks implemented; frontend: pages with links implemented / Implementar JWT e OAuth (GitHub, Google) — servidor: suporte e callbacks implementados; frontend: páginas com links implementadas
- [x] Implement social network system with feed, stories, challenges, and engagement features / Implementar sistema de rede social com feed, stories, desafios e recursos de engajamento
- [x] Create Settings page with comprehensive configuration options / Criar página de Settings com opções abrangentes de configuração
- [x] Create Calendar page with interactive study session tracking / Criar página de Calendar com acompanhamento interativo de sessões de estudo
- [x] Create Chats page with study group messaging / Criar página de Chats com mensagens de grupos de estudo
- [x] Create Feed page with social posts, comments, and likes / Criar página de Feed com posts sociais, comentários e likes
- [x] Create Profile page with memory assessment and user statistics / Criar página de Profile com avaliação de memória e estatísticas do usuário
- [x] Create Flashcards page with spaced repetition learning system / Criar página de Flashcards com sistema de repetição espaçada
- [x] Implement memory assessment quiz for algorithm optimization / Implementar questionário de avaliação de memória para otimização do algoritmo
- [x] Integrate adaptive difficulty with user memory lambda parameter / Integrar dificuldade adaptável com parâmetro lambda de memória do usuário
- [x] Implement smart logo redirects based on authentication status / Implementar redirecionamentos inteligentes do logo baseado no status de autenticação
- [x] Add translation keys for all new features / Adicionar chaves de tradução para todas as novas funcionalidades
- [x] Fix ESM imports throughout the codebase / Corrigir imports ESM em todo o código
- [x] Update documentation with new features and usage instructions / Atualizar documentação com novas funcionalidades e instruções de uso
- [ ] Privacy/Permissions: migrate auth header to JWT (partially done — server issues JWT and accepts Bearer; migrating legacy clients may be necessary) / Privacidade/Permissões: migrar auth header para JWT (parcialmente feito — servidor emite JWT e aceita Bearer; migrar clientes legacy pode ser necessário)
- [ ] Install OCR dependencies and instructions (pending: install binaries on new OS) / Instalar dependências OCR e instruções (pendente: instalar binários em novo SO)
- [ ] Persist scheduler/job queue outside process (optional, recommended: Redis/Bull) / Persistir scheduler/job queue fora do processo (opcional, recomendado: Redis/Bull)
- [ ] Polish prompts and QA of pt-br translations / Polir prompts e QA das traduções pt-br
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
