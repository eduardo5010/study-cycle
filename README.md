# Study Cycle

Study Cycle é uma plataforma de aprendizado e revisão automática que combina elementos de redes sociais educacionais e uma marketplace de cursos comunitários e oficiais. O objetivo é ajudar estudantes a organizar seus estudos, criar e consumir conteúdo educativo (vídeo, texto, exercícios), revisá-lo com algoritmos adaptativos e permitir que professores e criadores publiquem cursos.

Principais ideias

- Algoritmo de revisão adaptativa (baseado em eventos de revisão e parâmetro por-usuário λ)
- Conteúdo gerado por professores, pela comunidade e por IA (geração de questões/variações)
- Uploads de arquivos com OCR e geração automática de variantes de revisão
- Autenticação padrão (email/senha) e login social (GitHub, Google, Facebook) com possibilidade de linkar contas
- Área de professores com upload/gerenciamento de conteúdo e cursos
- Rede social: perfis, seguimento, comentários/curtidas (planejado)

Tecnologias

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Storage: implementação híbrida (MemStorage para protótipo; Drizzle/Postgres para ML/review data)
- Queue/Worker: OCR e tarefas assíncronas (tesseract/node-tesseract-ocr integrável)

Este README serve como ponto de partida para qualquer pessoa (em outro sistema operacional) retomar o desenvolvimento.

## Começando (desenvolvimento)

Pré-requisitos

- Node.js (v18+ recomendado)
- pnpm / npm / yarn (o comando usado no projeto é `npm`, adapte se usar pnpm)
- Git
- (Opcional/produtivo) Postgres se você quiser ativar a persistência Drizzle
- Para OCR: binário `tesseract` (se usar o worker com tesseract) ou instalar as libs node correspondentes

Variáveis de ambiente importantes

- `DATABASE_URL` — string de conexão do Postgres (opcional no modo memória)
- `JWT_SECRET` — segredo JWT usado para emitir tokens (não usar o fallback em produção)
- `SERVER_URL` — URL pública do servidor (ex: `http://localhost:3000`)
- `FRONTEND_URL` — URL do frontend (ex: `http://localhost:5173`)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — credenciais GitHub OAuth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — credenciais Google OAuth
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` — credenciais Facebook OAuth
- `OPENAI_API_KEY` — (opcional) chave da OpenAI para geração de conteúdo

Instalação e execução local (exemplo)

1. Clone o repositório

```bash
git clone https://github.com/eduardo5010/study-cycle.git
cd study-cycle
```

2. Instale dependências

```bash
npm install
```

3. Crie um arquivo `.env` com as variáveis essenciais (veja a lista acima). Exemplo mínimo para desenvolvimento:

```
JWT_SECRET=dev-secret
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

4. Inicie o servidor (modo dev)

```bash
npm run dev --workspace server
# ou, se o projeto tiver scripts consolidado, use: npm run dev
```

5. Inicie o frontend

```bash
npm run dev --workspace client
# ou: cd client && npm run dev
```

6. (Opcional) Inicie o worker OCR/fila

```bash
# se houver script: npm run worker
node server/ocr/worker.js # ou rode a task/arquivo responsável
```

## Tarefas e status atuais

Esta seção lista as tarefas de desenvolvimento e o status atual — útil para continuar o trabalho em outro sistema operacional.

- [x] Verificar instalação do Postgres
- [x] Instalar Postgres local (se autorizado)
- [x] Criar banco e usuário local
- [x] Gerar migração SQL Drizzle
- [x] Instruções para executar migração
- [x] Sincronizar traduções
- [x] Implementar uploads API e armazenamento privado
- [x] Implementar OCR worker e queue
- [x] Implementar endpoint de geração AI
- [x] Implementar frontend FileUploader
- [x] Implementar secure download endpoint
- [x] Implementar helper de geração aprimorado (prompts)
- [x] Integrar agendamento com algoritmo de revisão (λ por usuário)
- [ ] Privacidade/Permissões: migrar auth header para JWT (parcialmente feito — servidor emite JWT e aceita Bearer; migrar clientes legacy pode ser necessário)
- [ ] Instalar dependências OCR e instruções (pendente: instalar binários em novo SO)
- [ ] Persistir scheduler/job queue fora do processo (opcional, recomendado: Redis/Bull)
- [ ] Polir prompts e QA das traduções pt-br
- [ ] Docs & README final
- [x] Criar páginas de Login e Cadastro (frontend)
- [x] Implementar JWT e OAuth (GitHub, Google, Facebook) — servidor: suporte e callbacks implementados; frontend: páginas com links implementadas
- [ ] Integrar UI de link/unlink no perfil (frontend) — pendente
- [ ] Documentar variáveis de ambiente OAuth e JWT (pendente)

Observações sobre continuidade

- Se trocar de sistema operacional, instale as dependências listadas acima e certifique-se de copiar o `.env` com as variáveis que você estava usando.
- Se você usava uploads locais no diretório `server/uploads/`, copie esse diretório se quiser manter os arquivos existentes.
- Para retomar o worker OCR, instale o binário `tesseract` no novo SO e as dependências node (se for o caso).

## Como retomar (checklist rápido ao mudar de SO)

1. Clonar o repositório e entrar na branch `develop`.
2. Instalar Node.js e o gerenciador de pacotes (npm/pnpm/yarn).
3. Restaurar `.env` com as variáveis necessárias (veja seção acima).
4. (Opcional) Instalar Postgres e restaurar dump/migrações se você usa o DB local.
5. Copiar `server/uploads/` se quiser manter arquivos já enviados.
6. Rodar `npm install` e `npm run dev` para server e frontend.
7. Verificar os logs do servidor para eventuais erros de tipagem/variáveis de ambiente.

## Contribuindo

- Abra uma issue descrevendo o que quer implementar ou corrija algo diretamente em uma branch e abra um PR para `develop`.

---

Se quiser que eu já implemente a UI de link/unlink no perfil ou gere um arquivo `ENV.example` com todas as variáveis, diga qual prefere que eu faça em seguida.

# study-cycle
