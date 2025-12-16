# 🚀 Guia de Completar a Implementação do Design System

## 📋 O Que Ainda Falta

O design system foi criado e documentado. Agora você precisa:

### ✅ Fase 1: Validação (1-2 dias)

- [ ] Instalar dependências: `npm install`
- [ ] Testar que tudo compila: `npm run build`
- [ ] Verificar que mobile roda: `expo start`
- [ ] Confirmar que components importam sem erro

### ✅ Fase 2: Integração (3-5 dias)

- [ ] Converter os componentes web existentes para mobile
  - [ ] CourseCard → CourseCard.native.tsx
  - [ ] SubjectCard → SubjectCard.native.tsx
  - [ ] CycleCard → CycleCard.native.tsx
  - [ ] Etc (~30 componentes)
- [ ] Integrar telas móveis com navegação
- [ ] Configurar rotas dinâmicas

### ✅ Fase 3: Funcionalidades (1-2 semanas)

- [ ] Autenticação mobile
- [ ] Sincronização offline/online
- [ ] Context API para estado global
- [ ] Chamadas à API backend

### ✅ Fase 4: Polimento (1 semana)

- [ ] Tema escuro/claro
- [ ] Animações
- [ ] Otimizações
- [ ] Testes

---

## 🔄 Processo de Conversão Web → Mobile

### Para Cada Componente Web:

#### 1. Analisar componente web

```bash
# Exemplo: CourseCard
cat apps/web/client/src/components/CourseCard.tsx
```

#### 2. Criar versão mobile

```typescript
// apps/mobile/src/components/CourseCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@studycycle/ui';

export const CourseCard: React.FC<CourseCardProps> = (props) => {
  const styles = StyleSheet.create({
    // Use tokens em vez de valores hardcoded
    container: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: spacing[4],
      marginBottom: spacing[4],
    },
  });

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.neutral[900] }}>
        {props.title}
      </Text>
    </View>
  );
};
```

#### 3. Seguir checklist

```
✅ Usar StyleSheet.create()
✅ Substituir <div> → <View>
✅ Substituir <p> → <Text>
✅ Importar tokens
✅ Remover className
✅ Adicionar responsividade
✅ Testar em 2+ tamanhos
✅ Testar iOS e Android
```

#### 4. Exemplo com responsividade

```typescript
import { useResponsive } from '@studycycle/ui';

export const CourseCard: React.FC = () => {
  const { isMobile, width } = useResponsive();

  return (
    <View style={{
      padding: isMobile ? spacing[4] : spacing[6],
      backgroundColor: colors.primary[600]
    }}>
      {/* conteúdo */}
    </View>
  );
};
```

---

## 📋 Checklist de Componentes para Converter

### Core Components (~10)

- [ ] Header/Navbar
- [ ] Button (variantes)
- [ ] Card (variantes)
- [ ] Input (variantes)
- [ ] Modal
- [ ] Toast/Alert
- [ ] Spinner
- [ ] Badge
- [ ] Avatar
- [ ] Divider

### Course Components (~8)

- [ ] CourseCard
- [ ] CourseHeader
- [ ] LessonCard
- [ ] ModuleCard
- [ ] ChapterCard
- [ ] VideoPlayer wrapper
- [ ] CourseMeta
- [ ] CourseProgress

### Study Components (~7)

- [ ] CycleCard
- [ ] CycleProgress
- [ ] SubjectCard
- [ ] StudySchedule
- [ ] ProgressBars
- [ ] SkillCard
- [ ] DifficultyBadge

### User Components (~5)

- [ ] UserProfile
- [ ] UserAvatar
- [ ] SettingItem
- [ ] PreferenceToggle
- [ ] LanguageSelector

### Specialized (~10)

- [ ] FlashcardView
- [ ] MemoryAssessment
- [ ] QuizQuestion
- [ ] Leaderboard
- [ ] Calendar
- [ ] Chart (substitua por React Native Chart)
- [ ] Upload (use expo-image-picker)
- [ ] MediaGallery
- [ ] SocialShare
- [ ] Feedback

**Total: ~40 componentes**

---

## 📚 Exemplos Prontos para Copiar

### Tela Simples

```typescript
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Button from '@studycycle/ui/components/Button';
import Card from '@studycycle/ui/components/Card';
import Text from '@studycycle/ui/components/Text';
import { colors, spacing } from '@studycycle/ui';

export const MyScreen: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <ScrollView>
        <View style={{ padding: spacing[6] }}>
          <Text variant="h2">Minha Tela</Text>

          {data.length === 0 ? (
            <Card style={{ marginTop: spacing[4] }}>
              <Text align="center" color={colors.neutral[500]}>
                Nenhum item
              </Text>
            </Card>
          ) : (
            data.map((item) => (
              <Card key={item.id} style={{ marginTop: spacing[4] }}>
                <Text>{item.name}</Text>
              </Card>
            ))
          )}

          <Button
            label="Novo Item"
            onPress={() => {}}
            style={{ marginTop: spacing[4] }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
```

### Componente Reutilizável

```typescript
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Text from '@studycycle/ui/components/Text';
import { colors, spacing, borderRadius } from '@studycycle/ui';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onPress,
  leftIcon,
  rightIcon,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    icon: {
      marginRight: spacing[3],
    },
    content: {
      flex: 1,
    },
    rightIcon: {
      marginLeft: spacing[3],
    },
  });

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <View style={styles.content}>
          <Text weight="semibold">{title}</Text>
          {subtitle && <Text variant="caption" color={colors.neutral[600]}>{subtitle}</Text>}
        </View>
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </Pressable>
  );
};
```

### Com Responsividade

```typescript
import { useResponsive } from '@studycycle/ui';
import { responsive } from '@studycycle/ui';

export const ResponsiveComponent: React.FC = () => {
  const { width, breakpoint, isMobile } = useResponsive();

  // Obter valores responsivos
  const fontSize = responsive.fontSize.body[breakpoint];
  const padding = responsive.spacing.md[breakpoint];

  return (
    <View style={{ padding, fontSize }}>
      {isMobile && <Text>Versão mobile</Text>}
      {!isMobile && <Text>Versão desktop</Text>}
    </View>
  );
};
```

---

## 🔌 Integração com Backend

### Exemplo: Carregar Dados

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api'; // seu cliente HTTP

export const CoursesScreen: React.FC = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/courses');
      return response.data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <ScrollView>
      {courses?.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </ScrollView>
  );
};
```

### Context API para Estado Global

```typescript
import React, { createContext, useContext, useState } from 'react';

interface StudyCycleContextType {
  currentCycle: any;
  setCycle: (cycle: any) => void;
}

const StudyCycleContext = createContext<StudyCycleContextType | undefined>(undefined);

export const StudyCycleProvider: React.FC = ({ children }) => {
  const [currentCycle, setCurrentCycle] = useState(null);

  return (
    <StudyCycleContext.Provider value={{ currentCycle, setCycle: setCurrentCycle }}>
      {children}
    </StudyCycleContext.Provider>
  );
};

export const useStudyCycle = () => {
  const context = useContext(StudyCycleContext);
  if (!context) throw new Error('Use dentro do provider');
  return context;
};
```

---

## 🧪 Testar Componentes

### Checklist de Teste

Para cada componente, testar:

- [ ] **Renderização** - Aparece na tela?
- [ ] **Props** - Todos os props funcionam?
- [ ] **Estados** - Estados (loading, error, empty)?
- [ ] **Interações** - Cliques/pressionamentos?
- [ ] **Responsividade** - Looks ok em 320px e 1280px?
- [ ] **iOS/Android** - Funciona em ambos?
- [ ] **Acessibilidade** - Leitor de tela funciona?

### Debug no Emulador

```bash
# iOS
npm run ios
# Cmd+D → Shake Gesture → Toggle Element Inspector

# Android
npm run android
# Ctrl+M → Shake Gesture → Toggle Element Inspector
```

---

## 📊 Cronograma Sugerido

```
Semana 1:
├── Dia 1-2: Validar setup e dependências
├── Dia 3-4: Converter primeiros 5 componentes core
└── Dia 5: Testar e documentar

Semana 2:
├── Dia 1-2: Converter 10 componentes course
├── Dia 3: Converter 7 componentes study
├── Dia 4: Converter 5 componentes user
└── Dia 5: Testes e correções

Semana 3:
├── Dia 1-2: Integrar com backend
├── Dia 3: Context API e estado global
├── Dia 4: Autenticação
└── Dia 5: Testes e polimento

Semana 4:
├── Dia 1-2: Sincronização offline/online
├── Dia 3: Tema escuro/claro
├── Dia 4: Animações
└── Dia 5: Testes finais e release
```

---

## 🎯 Metas de Qualidade

- [ ] TypeScript sem `any`
- [ ] 0 console warnings
- [ ] Teste em 2+ breakpoints
- [ ] Teste iOS E Android
- [ ] Documentação em code comments
- [ ] Props bem tipadas
- [ ] Sem hardcoded values (use tokens)

---

## 🔍 Verificação Final

Antes de ir para produção:

```bash
# Build limpo
npm run build:mobile

# Sem erros TypeScript
npm run type-check

# Sem linting issues
npm run lint

# Sem console warnings
# (verificar no emulador/device)

# Responsividade ok
# (testar em 320px, 768px, 1024px, 1280px)

# Offline sync funcionando
# (desligar internet e testar)

# Performance aceitável
# (60 fps, sem lag)
```

---

## 📞 Suporte durante a Implementação

### Dúvidas sobre componentes?

→ Ver `/packages/ui/README.md`

### Como fazer algo responsivo?

→ Ver `/UNIFIED_DESIGN_SYSTEM.md` - Responsividade

### Converter um componente?

→ Ver `/apps/mobile/MIGRATION_GUIDE.md`

### Exemplo prático?

→ Ver `/apps/mobile/COMPONENT_CONVERSION_EXAMPLE.md`

---

## ✅ Sucesso!

Quando você tiver:

- [ ] ~40 componentes convertidos
- [ ] 10+ telas mobile criadas
- [ ] Integração com backend funcionando
- [ ] Offline sync em produção
- [ ] Tema dark/light implementado

Você terá um **aplicativo mobile profissional** com:

- ✅ UI consistente com web
- ✅ Sem duplicação de código
- ✅ Manutenção simplificada
- ✅ Pronto para escalar

---

**Boa sorte! 🚀**
