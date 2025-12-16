# 🤝 Contribuindo para StudyCycle

Obrigado por querer contribuir! Este documento fornece diretrizes e instruções.

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Padrões de Código](#padrões-de-código)
4. [Processo de Pull Request](#processo-de-pull-request)
5. [Commits](#commits)

## 🤝 Código de Conduta

- Seja respeitoso
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Respeite privacidade e segurança

## 🚀 Como Contribuir

### Reportar Bugs

1. **Não duplicar:** Procure por issues existentes
2. **Ser descritivo:** Incluir steps para reproduzir
3. **Ambiente:** Versões de Node, npm, OS
4. **Logs:** Adicionar stack traces se disponível

**Template:**

```markdown
## Descrição

Descrição clara do bug

## Steps para reproduzir

1. ...
2. ...
3. ...

## Comportamento esperado

...

## Comportamento atual

...

## Ambiente

- Node version: 18.x
- npm version: 10.x
- OS: Windows/macOS/Linux
```

### Sugerir Features

1. **Verificar roadmap:** Pode já estar planejado
2. **Ser específico:** Descrever caso de uso
3. **Mockups:** Se possível, incluir designs

**Template:**

```markdown
## Descrição

Breve descrição da feature

## Motivação

Por que essa feature é necessária?

## Solução proposta

Como implementar?

## Alternativas consideradas

Outras abordagens?

## Contexto adicional

Qualquer informação extra
```

## 💻 Padrões de Código

### TypeScript

```typescript
// ✅ BOM: Tipos explícitos
function calculateTotal(items: Item[], tax: number): number {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + tax);
}

// ❌ RUIM: any implícito
function calculateTotal(items: any[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Nomenclatura

```typescript
// Variáveis e funções: camelCase
const userId = '123';
function getUserById(id: string) {}

// Classes e Interfaces: PascalCase
interface UserProps {}
class UserService {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 30000;
```

### Funções

```typescript
// ✅ Pequenas, focadas
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ Com documentação
/**
 * Valida se um email é válido
 * @param email - Email para validar
 * @returns true se válido, false caso contrário
 */
function validateEmail(email: string): boolean {}

// ❌ Muito grande, múltiplas responsabilidades
function processUser(data: any) {
  // 50 linhas...
}
```

### Comentários

```typescript
// ✅ Úteis, explicam o "por quê"
// Usar timestamp em milissegundos para compatibilidade com SQLite
const timestamp = Date.now();

// ❌ Óbvios
// Incrementar contador
count++;

// ✅ TODO com contexto
// TODO: Implementar autenticação OAuth2 (issue #42)

// ❌ TODO vago
// TODO: melhorar isso depois
```

### Imports

```typescript
// ✅ Usar path aliases
import { Button } from '@studycycle/ui';
import { validateEmail } from '@studycycle/core';

// ❌ Evitar paths relativos longos
import { Button } from '../../../components/Button';
```

### Async/Await

```typescript
// ✅ Async/await
async function fetchUser(id: string) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// ❌ Promises aninhadas (callback hell)
function fetchUser(id) {
  return api
    .get(`/users/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
```

### Tratamento de Erros

```typescript
// ✅ Específico
try {
  await database.query(sql);
} catch (error) {
  if (error instanceof DatabaseConnectionError) {
    console.error('Connection failed:', error.message);
  } else {
    throw error; // Re-throw se não esperado
  }
}

// ❌ Genérico
try {
  // ...
} catch (error) {
  console.log('error');
}
```

## 📝 Processo de Pull Request

### 1. Fork e Clone

```bash
git clone https://github.com/seu-usuario/study-cycle.git
cd study-cycle
npm install
```

### 2. Criar Branch

```bash
# Feature
git checkout -b feature/descricao-da-feature

# Bug fix
git checkout -b fix/descricao-do-bug

# Melhoria de performance
git checkout -b perf/descricao

# Documentação
git checkout -b docs/descricao
```

**Nomes bons:**

- `feature/add-offline-sync`
- `fix/auth-token-refresh`
- `docs/setup-guide`

**Nomes ruins:**

- `feature/foo`
- `fix/bug`
- `update`

### 3. Fazer Alterações

```bash
# Editar arquivos...

# Verificar código
npm run lint
npm run format
npm run type-check

# Testar
npm test
```

### 4. Commit

```bash
git add .
git commit -m "feat: add offline sync for study cycles"
```

Ver [Commits](#commits) para padrão de mensagens.

### 5. Push e PR

```bash
git push origin feature/descricao

# Abrir PR no GitHub
```

**Checklist do PR:**

```markdown
## Descrição

Breve descrição das mudanças

## Tipo

- [ ] Feature
- [ ] Bug fix
- [ ] Performance
- [ ] Documentação

## Related Issues

Fecha #123

## Alterações

- Adicionado X
- Modificado Y
- Removido Z

## Testes

- [ ] Testes adicionados/atualizados
- [ ] Todos os testes passam
- [ ] Coverage mantido ou melhorado

## Checklist

- [ ] Código segue padrões do projeto
- [ ] Documentação atualizada
- [ ] Sem console.logs de debug
- [ ] Sem alterações breaking (sem versioning major)
```

## 📝 Commits

### Padrão Conventional Commits

```
<tipo>(<escopo>): <assunto>

<corpo>

<footer>
```

### Tipos

- **feat:** Nova feature
- **fix:** Bug fix
- **docs:** Documentação
- **style:** Formatação (sem mudança de lógica)
- **refactor:** Refatoração de código
- **perf:** Melhoria de performance
- **test:** Adicionar/atualizar testes
- **chore:** Dependências, config, etc.

### Escopos

- **api:** Mudanças na API
- **mobile:** Mudanças no React Native
- **web:** Mudanças na web
- **core:** Package @studycycle/core
- **ui:** Package @studycycle/ui
- **db-sync:** Package @studycycle/db-sync
- **db:** Banco de dados, migrations

### Exemplos

```bash
# ✅ BOMs
git commit -m "feat(api): add offline sync endpoint"
git commit -m "fix(mobile): resolve SQLite connection issue"
git commit -m "docs: update setup instructions"
git commit -m "test(core): add email validation tests"
git commit -m "perf(db-sync): optimize conflict resolution"

# ❌ RUINS
git commit -m "fix things"
git commit -m "update"
git commit -m "changes"
```

### Corpo do Commit

Use quando há mudanças significativas:

```
feat(api): implement batch sync endpoint

Add new POST /api/sync endpoint that handles:
- Validating sync batches
- Resolving conflicts (Last-Write-Wins)
- Updating database
- Returning server data to client

This enables full offline/online sync workflow
for mobile and web clients.

Fixes #42
```

## 🔍 Revisão de Código

### O que esperamos

1. **Funcionalidade:** Feature implementada corretamente
2. **Testes:** Cobertura adequada
3. **Documentação:** README, JSDoc, exemplos
4. **Padrão:** Segue guidelines
5. **Performance:** Sem regressões

### Feedback

- Seja construtivo
- Aproveche para aprender
- Pergunte se não entender
- Sugira soluções

## 📚 Recursos

- [SETUP.md](./SETUP.md) - Setup local
- [README.md](./README.md) - Documentação principal
- [Turborepo Docs](https://turbo.build)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🆘 Precisa de Ajuda?

- **Issues:** Abrir issue com dúvidas
- **Discussions:** Discussões do repo
- **Slack:** [Link to Slack if available]

---

**Obrigado por contribuir! 🎉**
