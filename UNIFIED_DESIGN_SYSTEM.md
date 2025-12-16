# Responsividade e Design System Unificado - Documentação Técnica

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tokens de Design](#tokens-de-design)
4. [Componentes](#componentes)
5. [Responsividade](#responsividade)
6. [Implementação](#implementação)
7. [Manutenção](#manutenção)

## 🎯 Visão Geral

O projeto StudyCycle implementa um **design system unificado** que funciona perfeitamente em web (React/Vite) e mobile (React Native/Expo). Todos os tokens de design, componentes e padrões de responsividade são compartilhados, garantindo:

- ✅ **Consistência Visual** - Mesma aparência em todas as plataformas
- ✅ **Reutilização de Código** - Escrever uma vez, usar em todos os lugares
- ✅ **Manutenção Simplificada** - Atualizar tokens uma vez
- ✅ **Desenvolvimento Rápido** - Componentes prontos para usar

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
study-cycle/
├── packages/
│   └── ui/
│       ├── src/
│       │   ├── tokens.ts              # Tokens centralizados (cores, espaçamento, etc)
│       │   ├── hooks/
│       │   │   └── useResponsive.ts  # Hook para responsividade
│       │   ├── utils/
│       │   │   └── responsive.ts      # Funções auxiliares
│       │   └── components/
│       │       ├── Button.tsx         # Versão web
│       │       ├── Button.native.tsx  # Versão React Native
│       │       ├── Card.native.tsx
│       │       ├── Input.native.tsx
│       │       ├── Text.native.tsx
│       │       ├── Spinner.native.tsx
│       │       └── Layout.native.tsx
│       └── README.md                  # Documentação do design system
├── apps/
│   ├── web/
│   │   ├── client/src/
│   │   │   └── components/           # Componentes web específicos
│   │   ├── vite.config.ts            # Config com aliases RN Web
│   │   └── tailwind.config.ts        # Cores baseadas em tokens
│   └── mobile/
│       ├── src/
│       │   ├── screens/              # Telas usando componentes @studycycle/ui
│       │   ├── components/           # Componentes mobile específicos
│       │   └── navigation/           # Navegação com tokens
│       ├── README_DESIGN_SYSTEM.md   # Guia mobile
│       ├── MIGRATION_GUIDE.md        # Como migrar web para mobile
│       └── COMPONENT_CONVERSION_EXAMPLE.md
└── REACT_NATIVE_WEB_SETUP.md        # Setup opcional para RN Web
```

## 🎨 Tokens de Design

Todos os tokens estão centralizados em `/packages/ui/src/tokens.ts`:

### Cores (218 variações)

```typescript
export const colors = {
  primary: { 50: '#eff6ff', ..., 900: '#1e3a8a' },
  secondary: { /* 10 tons */ },
  success: { /* 10 tons */ },
  warning: { /* 10 tons */ },
  error: { /* 10 tons */ },
  neutral: { /* 10 tons */ }
}
```

### Tipografia

```typescript
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    // ...
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};
```

### Espaçamento (Escala 4px)

```typescript
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};
```

### Border Radius

```typescript
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};
```

### Breakpoints (Mobile-First)

```typescript
export const responsive = {
  breakpoints: {
    xs: 320, // Celulares pequenos
    sm: 640, // Celulares normais
    md: 768, // Tablets
    lg: 1024, // Desktops
    xl: 1280, // Desktops grandes
    '2xl': 1536, // Desktops extra grandes
  },
  fontSize: {
    h1: { xs: 24, sm: 28, md: 32, lg: 48 },
    h2: { xs: 20, sm: 24, md: 28, lg: 36 },
    // ...
  },
  spacing: {
    xs: { xs: 8, sm: 8, md: 12, lg: 16 },
    sm: { xs: 12, sm: 12, md: 16, lg: 24 },
    // ...
  },
};
```

## 🎯 Componentes

### Componentes Base

#### Button

Variantes: primary, secondary, outline, ghost
Tamanhos: sm, md, lg
Props: label, onPress, variant, size, disabled, loading, leftIcon, rightIcon

#### Card

Variantes: default, outlined, elevated
Uso: Container para agrupar conteúdo relacionado

#### Input

Variantes: default, outlined
Tamanhos: sm, md, lg
Props: placeholder, value, onChangeText, label, error, multiline

#### Text

Variantes: h1, h2, h3, h4, body, caption
Props: variant, weight, color, align

#### Spinner

Props: size, color

### Componentes de Layout

#### ResponsiveContainer

- Máxima largura em desktop
- Usa toda tela em mobile
- Respeita padding conforme breakpoint

#### ResponsiveGrid

- 1 coluna em xs/sm
- 2 colunas em md
- 3 colunas em lg+
- Gap responsivo

#### Stack

- Flexbox wrapper vertical/horizontal
- Props: direction, gap, align, justify

#### Spacer

- Espaço vertical/horizontal responsivo
- Tamanhos: xs, sm, md, lg, xl

## 📐 Responsividade

### Hook useResponsive

Detecta breakpoint atual e fornece informações úteis:

```typescript
const {
  width, // largura em px
  breakpoint, // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  isMobile, // true se width < 768px
  isTablet, // true se 768px <= width < 1024px
  isDesktop, // true se width >= 1024px
  isXs,
  isSm,
  isMd,
  isLg,
  isXl,
} = useResponsive();
```

### Exemplo de Uso

```typescript
function MyComponent() {
  const { isMobile, width } = useResponsive();

  return (
    <View style={{
      paddingHorizontal: isMobile ? spacing[4] : spacing[12],
      fontSize: width >= 1024 ? 18 : 16
    }}>
      {isMobile && <Text>Versão mobile</Text>}
      {!isMobile && <Text>Versão desktop</Text>}
    </View>
  );
}
```

### Valores Responsivos

Funções auxiliares para escalar valores:

```typescript
import { getResponsiveFontSize, getResponsiveSpacing } from '@studycycle/ui';

const fontSize = getResponsiveFontSize('h1', screenWidth);
// 320px → 24px, 1024px → 48px

const padding = getResponsiveSpacing('md', screenWidth);
// 320px → 16px, 1024px → 32px
```

## 💻 Implementação

### No Mobile (React Native)

```typescript
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Card, Input, Text } from '@studycycle/ui';
import { colors, spacing } from '@studycycle/ui';
import { useResponsive } from '@studycycle/ui';

export const MyScreen: React.FC = () => {
  const { isMobile } = useResponsive();
  const [text, setText] = React.useState('');

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{
          padding: spacing[6],
          backgroundColor: colors.neutral[50]
        }}>
          <Text variant="h2">Título</Text>

          <Card style={{ marginTop: spacing[4] }}>
            <Input
              label="Seu nome"
              value={text}
              onChangeText={setText}
            />
          </Card>

          <Button
            label="Enviar"
            onPress={() => {}}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

### Na Web (React/Vite)

Usa os mesmos componentes com seleção automática:

```typescript
import { Button, Card, Input, Text } from '@studycycle/ui';
import { colors, spacing } from '@studycycle/ui';

// Automaticamente importa Button.tsx (web)
// No mobile, importa Button.native.tsx

export function MyPage() {
  return (
    <div className="p-6 bg-neutral-50">
      <h1>Título</h1>
      <Button>Clique aqui</Button>
    </div>
  );
}
```

## 🔄 Padrão de Componentes Cross-Platform

### Estrutura de Arquivo

Para cada componente compartilhado:

```
components/
  Button/
    Button.tsx          # Versão web (HTML/Tailwind)
    Button.native.tsx   # Versão React Native
    types.ts           # Tipos compartilhados
    index.ts           # Export automático
```

### Como Funciona a Seleção

1. **Em React Native (mobile):** Seleciona `Button.native.tsx`
2. **Em Web (Vite):** Seleciona `Button.tsx`
3. **Em React Native Web:** Seleciona `Button.native.tsx`

A seleção é automática via bundler/metro resolver!

### Checklist para Novo Componente

- [ ] Criar `Component.tsx` (web)
- [ ] Criar `Component.native.tsx` (React Native)
- [ ] Usar tokens compartilhados (`colors`, `spacing`)
- [ ] Exportar tipos em `types.ts`
- [ ] Testar responsividade em múltiplos tamanhos
- [ ] Documentar props no README

## 🔧 Manutenção

### Atualizando Tokens

1. Editar `/packages/ui/src/tokens.ts`
2. Atualiza automaticamente web e mobile
3. Rebuild necessário (npm install)

### Adicionando Nova Cor

```typescript
// Em tokens.ts
export const colors = {
  // ... cores existentes
  myColor: {
    50: '#f0f0f0',
    100: '#e0e0e0',
    // ... até 900
  },
};
```

### Testando Responsividade

```bash
# Mobile
npm run dev:mobile  # Expo Go

# Web
npm run dev:web

# Desktop
npm run dev:web    # Redimensione janela
```

### Debugging

**Mobile:**

- Shake device → Toggle Element Inspector
- Ou: Cmd+D (iOS), Ctrl+M (Android)

**Web:**

- F12 → Device Emulation
- Redimensione viewport

## 📊 Checklist de Implementação

- ✅ Tokens centralizados em `/packages/ui`
- ✅ Componentes base criados (Button, Card, Input, Text, Spinner)
- ✅ Hook `useResponsive` implementado
- ✅ Componentes de layout (Grid, Stack, Container, Spacer)
- ✅ 3 telas mobile exemplo (Dashboard, Subjects, Settings)
- ✅ Navegação integrada com tokens
- ✅ Documentação completa
- ✅ Guia de migração web → mobile
- ✅ Exemplo prático de conversão
- ⏳ React Native Web (opcional)

## 📚 Documentação Adicional

- **Design System Detalhado:** `/packages/ui/README.md`
- **Guia Mobile:** `/apps/mobile/README_DESIGN_SYSTEM.md`
- **Guia de Migração:** `/apps/mobile/MIGRATION_GUIDE.md`
- **Exemplo de Componente:** `/apps/mobile/COMPONENT_CONVERSION_EXAMPLE.md`
- **React Native Web:** `/REACT_NATIVE_WEB_SETUP.md`

## 🚀 Próximos Passos

1. **Adaptar Componentes Web Existentes**
   - Converter componentes de `/apps/web/client/src/components/` para mobile
   - Seguir padrão de `Component.tsx` + `Component.native.tsx`

2. **Implementar Temas**
   - Dark mode
   - Light mode
   - Tema customizável

3. **Adicionar Animações**
   - Animações compartilhadas (Reanimated para mobile, Framer para web)
   - Transições consistentes

4. **Validação e Acessibilidade**
   - WCAG 2.1 AA para web
   - VoiceOver/TalkBack para mobile
   - Testes automatizados

5. **Otimização de Performance**
   - Code splitting
   - Lazy loading de componentes
   - Memoização estratégica

## 💡 Dicas

1. **Sempre use tokens** - Não hardcode cores/espaçamentos
2. **Teste em múltiplos tamanhos** - Não assume uma resolução
3. **Pense mobile-first** - Mais fácil expandir do que remover
4. **Use SafeAreaView** - Mobile tem notchs e home indicators
5. **Otimize listas** - Use FlatList em vez de ScrollView

## 📞 Suporte

- Ver exemplos em `/apps/mobile/src/`
- Consultar `/packages/ui/README.md`
- Rodar exemplo em `/apps/mobile/src/components/ExampleAdaptiveComponent.tsx`
