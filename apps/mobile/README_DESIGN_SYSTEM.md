# StudyCycle Mobile - Design System Unificado

## 📱 Visão Geral

O aplicativo mobile StudyCycle foi refatorado para usar um **design system centralizado** compartilhado com a versão web. Isso garante consistência visual e reutilização de código entre plataformas.

## 🏗️ Arquitetura

```
apps/mobile/
├── src/
│   ├── screens/          # Telas principais (DashboardScreen, SubjectsScreen, etc)
│   ├── components/       # Componentes reutilizáveis (Button, Card, Input)
│   ├── navigation/       # Navegação (MainNavigator)
│   ├── services/         # Lógica de negócio
│   ├── hooks/            # Custom hooks (useResponsive)
│   ├── contexts/         # Context API
│   ├── types/            # TypeScript types
│   └── utils/            # Utilitários
├── package.json          # Dependências (React Native, Expo)
└── App.tsx              # Aplicação raiz
```

## 🎨 Tokens de Design Compartilhados

Todos os tokens estão em `/packages/ui/src/tokens.ts`:

### Cores

```typescript
import { colors } from '@studycycle/ui';

colors.primary[600]; // #2563eb (azul)
colors.neutral[900]; // #171717 (preto)
colors.success[500]; // #22c55e (verde)
colors.warning[500]; // #f59e0b (amarelo)
colors.error[500]; // #ef4444 (vermelho)
```

### Espaçamento

```typescript
import { spacing } from '@studycycle/ui';

spacing[1]; // 4px
spacing[2]; // 8px
spacing[4]; // 16px
spacing[6]; // 24px
spacing[12]; // 48px
```

### Border Radius

```typescript
import { borderRadius } from '@studycycle/ui';

borderRadius.md; // 6px
borderRadius.lg; // 8px
borderRadius.full; // 9999px
```

## 🎯 Componentes Disponíveis

### Button

```typescript
import Button from '@studycycle/ui/components/Button';

<Button
  label="Clique aqui"
  onPress={() => console.log('Pressionado')}
  variant="primary"      // primary | secondary | outline | ghost
  size="md"             // sm | md | lg
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
/>
```

### Card

```typescript
import Card from '@studycycle/ui/components/Card';

<Card variant="default">  {/* default | outlined | elevated */}
  <Text>Conteúdo</Text>
</Card>
```

### Input

```typescript
import Input from '@studycycle/ui/components/Input';

<Input
  placeholder="Digite..."
  value={text}
  onChangeText={setText}
  label="Nome completo"
  error={errorMessage}
  variant="outlined"
  size="md"
  multiline={false}
/>
```

### Text

```typescript
import Text from '@studycycle/ui/components/Text';

<Text
  variant="h1"    // h1 | h2 | h3 | h4 | body | caption
  weight="bold"   // light | normal | semibold | bold
  color={colors.primary[600]}
  align="center"  // left | center | right
>
  Seu texto
</Text>
```

### Spinner

```typescript
import Spinner from '@studycycle/ui/components/Spinner';

<Spinner size="large" color={colors.primary[600]} />
```

## 📐 Responsividade

### Hook useResponsive

```typescript
import { useResponsive } from '@studycycle/ui';

function MyScreen() {
  const { width, breakpoint, isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <View>
      <Text>Breakpoint: {breakpoint}</Text>
      <Text>Largura: {width}px</Text>
      {isMobile && <Text>Você está em mobile</Text>}
      {isTablet && <Text>Você está em tablet</Text>}
      {isDesktop && <Text>Você está em desktop</Text>}
    </View>
  );
}
```

### Breakpoints

- `xs`: 320px (celulares pequenos)
- `sm`: 640px (celulares normais)
- `md`: 768px (tablets)
- `lg`: 1024px (desktops)
- `xl`: 1280px (desktops grandes)
- `2xl`: 1536px (desktops extra grandes)

### Valores Responsivos

```typescript
import { responsive } from '@studycycle/ui';

// Fontes que escalam conforme tela
responsive.fontSize.h1; // xs: 24, lg: 48
responsive.fontSize.body; // xs: 14, lg: 16

// Espaçamento que escala
responsive.spacing.md; // xs: 16, lg: 32
```

## 📱 Componentes de Layout

### ResponsiveContainer

Mantém máxima largura em web, usa toda tela em mobile:

```typescript
import { ResponsiveContainer } from '@studycycle/ui';

<ResponsiveContainer maxWidth={1200} paddingHorizontal={24}>
  {children}
</ResponsiveContainer>
```

### ResponsiveGrid

Grid adaptável que muda número de colunas:

```typescript
import { ResponsiveGrid } from '@studycycle/ui';

<ResponsiveGrid
  columns={{ xs: 1, sm: 1, md: 2, lg: 3 }}
  gap={16}
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

### Stack

Flexbox wrapper para layouts verticais/horizontais:

```typescript
import { Stack } from '@studycycle/ui';

<Stack direction="column" gap={16} align="center" justify="space-between">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>
```

### Spacer

Espaço responsivo:

```typescript
import { Spacer } from '@studycycle/ui';

<Spacer size="md" vertical />
```

## 🛠️ Exemplo de Implementação

### Tela Simples

```typescript
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Card, Input, Text } from '@studycycle/ui';
import { colors, spacing } from '@studycycle/ui';

export const MyScreen: React.FC = () => {
  const [name, setName] = useState('');

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: spacing[6] }}>
          <Text variant="h2">Bem-vindo</Text>

          <Card style={{ marginTop: spacing[4] }}>
            <Input
              label="Seu Nome"
              placeholder="Digite seu nome..."
              value={name}
              onChangeText={setName}
            />
          </Card>

          <Button
            label="Enviar"
            onPress={() => console.log(name)}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

## 🔄 Sincronização Web ↔ Mobile

O sistema garante que web e mobile tenham a mesma aparência:

### Padrão de Componentes

```
Componente Web:     components/Button.tsx
Componente Mobile:  components/Button.native.tsx
                    ↓
Importação unificada: import Button from '@studycycle/ui'
                    ↓
Automaticamente seleciona a versão correta!
```

### Tokens Compartilhados

- Ambas plataformas usam `/packages/ui/tokens.ts`
- Atualizar cores, espaçamento, fontes uma vez
- Reflete automaticamente em web e mobile

## 📝 Checklist para Novas Telas

Ao criar uma nova tela, siga este checklist:

- [ ] Usar componentes do `@studycycle/ui`
- [ ] Importar tokens (`colors`, `spacing`, `borderRadius`)
- [ ] Usar `useResponsive` se precisar de adaptação
- [ ] Testar em múltiplos tamanhos (320px até 1280px)
- [ ] Usar SafeAreaView para layout seguro
- [ ] ScrollView para conteúdo extenso
- [ ] Implementar loading e error states
- [ ] Acessibilidade (accessibilityLabel, accessibilityRole)

## 🎨 Testar Responsividade

### No Simulador iOS/Android

- Expo Go: instale no dispositivo real
- Simulator: Cmd+D → Shake Gesture → Toggle Element Inspector

### No Navegador (React Native Web - opcional)

```bash
npm run dev:mobile:web
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev:mobile

# Build para produção
npm run build:mobile

# Lint e formatação
npm run lint
npm run format

# Limpar cache
npm run clean
```

## 📚 Estrutura de Tipos

Tipos compartilhados em `/packages/core/types.ts`:

```typescript
interface StudyCycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  subjects: Subject[];
}

interface Subject {
  id: string;
  name: string;
  color: string;
  courses: Course[];
}
```

## 🔐 Acessibilidade

- Usar `accessible={true}` em elementos interativos
- Adicionar `accessibilityLabel` descritivo
- Testar com leitor de tela
- Garantir contraste de cores adequado

## 📱 Navegação

Estrutura em `/src/navigation/MainNavigator.tsx`:

```
App
└── RootNavigator (Stack)
    └── MainTabs (Tab)
        ├── Home
        ├── Cycles
        ├── Flashcards
        └── Settings
```

## 🐛 Troubleshooting

### Componente não aparece

- Verificar importação correta
- Verificar se está dentro de SafeAreaView/ScrollView
- Verificar styling (padding, margin, flex)

### Estilos não aplicados

- Usar StyleSheet.create() para melhor performance
- Verificar se cores estão corretas
- Testar em iOS e Android (layout pode variar)

### Performance lenta

- Usar FlatList para listas longas
- Memoizar componentes com React.memo()
- Otimizar renders com useCallback

## 📖 Documentação Completa

- **Design System Web:** `/packages/ui/README.md`
- **Guia de Migração:** `/apps/mobile/MIGRATION_GUIDE.md`
- **Componentes:** `@studycycle/ui` - Veja tipos no código

## 🤝 Contribuindo

Ao adicionar novos componentes:

1. Criar versão web (`Button.tsx`)
2. Criar versão mobile (`Button.native.tsx`)
3. Usar tokens centralizados
4. Testar responsividade
5. Documentar no README

## 📞 Suporte

Para dúvidas sobre o design system ou implementação:

- Ver exemplos em `/apps/mobile/src/screens/`
- Consultar `/packages/ui/README.md`
- Executar exemplo em `/apps/mobile/src/components/ExampleAdaptiveComponent.tsx`
