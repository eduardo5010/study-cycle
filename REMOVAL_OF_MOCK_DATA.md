# Remoção de Dados Fictícios e Atualização de Preços

Este documento descreve as mudanças realizadas para remover dados fictícios e atualizar mensagens sobre o início do projeto.

## Mudanças Realizadas

### 1. Remoção de Dados Mock

#### `client/src/pages/home.tsx`
- ✅ Removidos todos os dados mock de gamificação:
  - `currentCourse` (curso atual fictício)
  - `stats` (estatísticas fictícias)
  - `streak` (sequência fictícia)
  - `leagueData` (liga fictícia)
  - `xpData` (XP fictício)
  - `achievements` (conquistas fictícias)
- ✅ Adicionada mensagem explicativa quando não há dados
- ✅ Seção de gamificação removida, substituída por mensagem sobre início do projeto

#### `client/src/pages/courses.tsx`
- ✅ Removidos todos os cursos mock (`enrolledCourses` e `availableCourses`)
- ✅ Implementada busca de cursos reais da API
- ✅ Adicionadas mensagens explicativas quando não há cursos disponíveis
- ✅ Adicionadas verificações opcionais para propriedades que podem não existir

#### `client/src/pages/landing.tsx`
- ✅ Removidos todos os testimonials (depoimentos fictícios)
- ✅ Substituída seção de testimonials por seção "Estamos no Início"
- ✅ Atualizado link de navegação de `#testimonials` para `#early-stage`

#### `client/src/components/new-header.tsx`
- ✅ Removidos dados mock de streak e notificações
- ✅ Implementada busca de dados reais da API (preparado para quando disponível)

#### `client/src/components/dashboard-overview.tsx`
- ✅ Removido cálculo mock de progresso
- ✅ Progresso agora calculado a partir de dados reais (quando disponível)

#### `client/src/pages/teacher-dashboard.tsx`
- ✅ Removido `mock-teacher-id`
- ✅ Agora usa `user?.id` real

### 2. Atualização de Preços

#### Preços Atualizados
- **Antes**: R$50 / US$50 por mês
- **Agora**: R$9,90 / US$2,99 por mês
- **Justificativa**: Preço simbólico apenas para custear infraestrutura

#### Arquivos de Tradução Atualizados
Todos os arquivos de tradução foram atualizados com:
- Novo preço: `R$9,90 / US$2,99` (ou equivalente em outros idiomas)
- Nova chave `priceNote`: Explicação de que é preço simbólico apenas para custear infraestrutura

**Arquivos atualizados:**
- `pt-br.json`
- `pt.json`
- `en.json`
- `ar.json`, `cs.json`, `da.json`, `de.json`, `es.json`, `fi.json`, `fr.json`, `hi.json`, `it.json`, `ja.json`, `ko.json`, `nl.json`, `no.json`, `pl.json`, `ru.json`, `sv.json`, `tr.json`, `zh.json`

### 3. Mensagens sobre Início do Projeto

#### Novas Chaves de Tradução Adicionadas

**Português (pt-br.json e pt.json):**
```json
"landing.earlyStage": {
  "title": "Estamos no Início",
  "description": "O Study Cycle está em fase inicial de desenvolvimento. Estamos construindo uma plataforma completa de aprendizado adaptativo, mas ainda não temos prova social do nosso valor.",
  "pricing": "Por enquanto, o preço é simbólico (R$9,90 / US$2,99 por mês) apenas para custear a infraestrutura necessária para manter a plataforma funcionando.",
  "noProof": "Ainda não temos depoimentos ou métricas de sucesso para compartilhar, mas estamos trabalhando duro para construir algo valioso para você."
},
"home.earlyStage": {
  "title": "Estamos no Início",
  "description": "O Study Cycle está em fase inicial de desenvolvimento. Estamos construindo uma plataforma completa de aprendizado adaptativo, mas ainda não temos prova social do nosso valor.",
  "pricing": "Por enquanto, o preço é simbólico (R$9,90 / US$2,99 por mês) apenas para custear a infraestrutura necessária para manter a plataforma funcionando."
},
"courses.earlyStage": {
  "title": "Estamos no Início",
  "description": "O Study Cycle está em fase inicial de desenvolvimento. Ainda não temos cursos disponíveis, mas estamos trabalhando para criar conteúdo de qualidade.",
  "pricing": "Por enquanto, o preço é simbólico (R$9,90 / US$2,99 por mês) apenas para custear a infraestrutura."
}
```

**Inglês (en.json):**
```json
"landing.earlyStage": {
  "title": "We're Just Getting Started",
  "description": "Study Cycle is in early development. We're building a complete adaptive learning platform, but we don't have social proof of our value yet.",
  "pricing": "For now, the price is symbolic (R$9.90 / US$2.99 per month) only to cover the infrastructure needed to keep the platform running.",
  "noProof": "We don't have testimonials or success metrics to share yet, but we're working hard to build something valuable for you."
},
"home.earlyStage": {
  "title": "We're Just Getting Started",
  "description": "Study Cycle is in early development. We're building a complete adaptive learning platform, but we don't have social proof of our value yet.",
  "pricing": "For now, the price is symbolic (R$9.90 / US$2.99 per month) only to cover the infrastructure needed to keep the platform running."
},
"courses.earlyStage": {
  "title": "We're Just Getting Started",
  "description": "Study Cycle is in early development. We don't have courses available yet, but we're working to create quality content.",
  "pricing": "For now, the price is symbolic (R$9.90 / US$2.99 per month) only to cover infrastructure costs."
}
```

### 4. Páginas Atualizadas

#### Landing Page (`landing.tsx`)
- Seção de testimonials substituída por seção "Estamos no Início"
- Card de preço agora mostra nota sobre preço simbólico
- Link de navegação atualizado

#### Home Page (`home.tsx`)
- Seção de gamificação removida
- Mensagem explicativa adicionada quando não há dados

#### Courses Page (`courses.tsx`)
- Cursos mock removidos
- Busca de cursos reais da API implementada
- Mensagens explicativas quando não há cursos

### 5. Componentes Atualizados

- `new-header.tsx`: Removidos dados mock, preparado para dados reais
- `dashboard-overview.tsx`: Removido cálculo mock de progresso
- `teacher-dashboard.tsx`: Removido mock-teacher-id

## Resumo das Mudanças

### Dados Removidos
- ✅ Todos os cursos fictícios
- ✅ Todos os dados de gamificação (streak, XP, ligas, conquistas)
- ✅ Todos os testimonials (depoimentos)
- ✅ Todas as notificações mock
- ✅ Todos os dados de progresso mock

### Preços Atualizados
- ✅ De R$50/US$50 para R$9,90/US$2,99
- ✅ Nota explicativa adicionada em todos os idiomas
- ✅ Mensagem sobre preço simbólico apenas para infraestrutura

### Mensagens Adicionadas
- ✅ Explicação de que o projeto está no início
- ✅ Aviso de que não há prova social ainda
- ✅ Informação sobre preço simbólico
- ✅ Mensagens em todas as páginas relevantes

## Próximos Passos

1. Quando houver dados reais, as mensagens de "início" podem ser removidas ou atualizadas
2. Quando houver prova social (testimonials reais, métricas), podem ser adicionadas
3. O preço pode ser ajustado conforme necessário no futuro

