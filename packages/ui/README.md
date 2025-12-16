# Design System Unificado - StudyCycle

## 📋 Visão Geral

Este documento descreve como o design system foi unificado entre web e mobile no projeto StudyCycle, permitindo que a mesma lógica de design seja compartilhada entre as plataformas.

## 🎨 Tokens de Design Centralizados

Todos os tokens de design (cores, tipografia, espaçamento, border-radius, etc.) estão centralizados no pacote `@studycycle/ui` em:

```
/packages/ui/src/tokens.ts
```

### Estrutura dos Tokens

```typescript
export const colors = {
  /* paleta de cores */
};
export const typography = {
  /* fontes e estilos */
};
export const spacing = {
  /* espaçamentos */
};
export const borderRadius = {
  /* bordas */
};
export const shadows = {
  /* sombras */
};
export const breakpoints = {
  /* breakpoints responsivos */
};
export const responsive = {
  /* valores escaláveis */
};
```

### Importação

```typescript
import { colors, spacing, borderRadius, responsive } from '@studycycle/ui';
```

## 📱 Padrão de Componentes Cross-Platform

### Estrutura de Arquivo

Para cada componente, criamos **dois arquivos**:

```
Button.tsx              # Versão Web (React com HTML)
Button.native.tsx       # Versão Mobile (React Native)
```

### Como o Sistema Seleciona Automaticamente

O Node.js/bundler seleciona automaticamente o arquivo correto:

- **Em React Native:** `Button.native.tsx`
- **Em Web (Vite/Next.js):** `Button.tsx`

```typescript
// Importação única que funciona em ambas as plataformas
import Button from '@studycycle/ui/components/Button';

// Será automaticamente Button.native.tsx no mobile
// Será automaticamente Button.tsx no web
```

## 🔄 Responsividade

### Hook useResponsive

Detecta o breakpoint atual e fornece informações úteis:

```typescript
import { useResponsive } from '@studycycle/ui';

function MyComponent() {
  const { width, breakpoint, isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <Text style={{ fontSize: isMobile ? 14 : 18 }}>
      {isMobile ? 'Mobile' : 'Desktop'}
    </Text>
  );
}
```

### Breakpoints Definidos

```typescript
{
  xs: 320,   // Extra small phones
  sm: 640,   // Small phones
  md: 768,   // Tablets
  lg: 1024,  // Desktops
  xl: 1280,  // Large desktops
  '2xl': 1536 // Extra large
}
```

### Valores Responsivos

Funções auxiliares para obter valores que escalam com a tela:

```typescript
import { getResponsiveFontSize, getResponsiveSpacing } from '@studycycle/ui';

const fontSize = getResponsiveFontSize('h1', screenWidth);
// xs: 24px → lg: 48px

const padding = getResponsiveSpacing('md', screenWidth);
// xs: 16px → lg: 32px
```

## 🎯 Componentes Disponíveis

### Componentes Base

#### Button

```typescript
<Button
  label="Clique aqui"
  onPress={() => {}}
  variant="primary"    // primary | secondary | outline | ghost
  size="md"            // sm | md | lg
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
/>
```

#### Card

```typescript
<Card variant="default"> {/* default | outlined | elevated */}
  <Text>Conteúdo do card</Text>
</Card>
```

#### Input

```typescript
<Input
  placeholder="Digite..."
  value={text}
  onChangeText={setText}
  label="Nome"
  error="Campo obrigatório"
  variant="outlined"   // default | outlined
  size="md"           // sm | md | lg
  multiline={false}
/>
```

#### Text

```typescript
<Text
  variant="h1"  // h1 | h2 | h3 | h4 | body | caption
  weight="bold" // light | normal | semibold | bold
  color={colors.primary[600]}
  align="center" // left | center | right
>
  Texto responsivo
</Text>
```

#### Spinner

```typescript
<Spinner size="large" color={colors.primary[600]} />
```

### Componentes de Layout

#### ResponsiveContainer

Mantém máxima largura em web, usa toda tela em mobile:

```typescript
<ResponsiveContainer maxWidth={1200}>
  {children}
</ResponsiveContainer>
```

#### ResponsiveGrid

Grid que adapta colunas conforme tamanho:

```typescript
<ResponsiveGrid columns={{ xs: 1, sm: 1, md: 2, lg: 3 }} gap={16}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

#### Stack

Flexbox wrapper para layout vertical/horizontal:

```typescript
<Stack direction="column" gap={16} align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>
```

#### Spacer

Espaço responsivo:

```typescript
<Spacer size="md" vertical />
```

## 📱 Implementação no Mobile

### Estrutura de Pastas

```
/apps/mobile/src
├── screens/
│   ├── DashboardScreen.tsx
│   ├── SubjectsScreen.tsx
│   └── SettingsScreen.tsx
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── navigation/
│   └── MainNavigator.tsx
└── App.tsx
```

### Exemplo de Tela

```typescript
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Card, Text } from '@studycycle/ui';
import { colors, spacing } from '@studycycle/ui';

export const ExampleScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: spacing[6] }}>
          <Text variant="h2">Título</Text>

          <Card style={{ marginTop: spacing[4] }}>
            <Text>Conteúdo do card</Text>
          </Card>

          <Button
            label="Ação"
            onPress={() => {}}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

## 🌐 React Native Web (Opcional)

Para executar componentes React Native também na web (usando React Native Web):

### 1. Instalação

```bash
npm install react-native-web
```

### 2. Configuração no Vite/Web

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native/': 'react-native-web/',
    },
  },
});
```

### 3. Root CSS

```css
html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#root {
  display: flex;
}
```

## 🔧 Guia de Manutenção

### Adicionando Novo Componente

1. **Criar variante web** (`components/MyComponent.tsx`):

   ```typescript
   export const MyComponent: React.FC<Props> = (props) => {
     return <div className={...}>{props.children}</div>;
   };
   ```

2. **Criar variante mobile** (`components/MyComponent.native.tsx`):

   ```typescript
   import { View } from 'react-native';
   export const MyComponent: React.FC<Props> = (props) => {
     return <View>{props.children}</View>;
   };
   ```

3. **Exportar em `index.ts`**:

   ```typescript
   export { MyComponent } from './MyComponent';
   ```

4. **Usar tokens compartilhados**:
   ```typescript
   import { colors, spacing } from '../tokens';
   // Usar nos estilos
   ```

### Atualizando Tokens

Todos os tokens estão em `/packages/ui/src/tokens.ts`. Alterar ali reflete automaticamente em web e mobile.

### Testes de Responsividade

```typescript
import { useResponsive } from '@studycycle/ui';

function TestComponent() {
  const { width, breakpoint } = useResponsive();
  console.log(`Tela: ${width}px, Breakpoint: ${breakpoint}`);
  return null;
}
```

## 📊 Aparência Visual

### Cores Consistentes

Todas as cores vêm de `colors` tokens:

- **Primary:** Azul (#3b82f6)
- **Secondary:** Cinza (#64748b)
- **Success:** Verde (#22c55e)
- **Warning:** Amarelo (#f59e0b)
- **Error:** Vermelho (#ef4444)

### Tipografia Consistente

- **H1-H4:** Escaláveis conforme breakpoint
- **Body:** Padrão 16px (escala em mobile)
- **Caption:** 12-14px

### Espaçamento Consistente

Usa escala 4px: 4, 8, 12, 16, 20, 24, 32, 48, 64...

## 🚀 Próximos Passos

1. ✅ Componentes base criados
2. ✅ Tokens centralizados
3. ✅ Responsividade implementada
4. ⏳ React Native Web (opcional, para web with RN)
5. ⏳ Temas (claro/escuro)
6. ⏳ Animações consistentes

## 📚 Referências

- [React Native Docs](https://reactnative.dev)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [Tailwind CSS (Web)](https://tailwindcss.com)
- [Design Tokens](https://www.designtokens.org/)
