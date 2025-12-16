/\*\*

- GUIA: Como Adaptar Componentes Web para Mobile
-
- Este arquivo mostra o passo a passo para converter um componente web
- para funcionar também em React Native
  \*/

// ============================================================================
// PASSO 1: Componente Web Original
// ============================================================================
// Arquivo: /apps/web/client/src/components/CourseCard.tsx

/\*
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
title: string;
description: string;
difficulty: 'easy' | 'medium' | 'hard';
lessons: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
title,
description,
difficulty,
lessons,
}) => {
const getDifficultyColor = {
easy: 'bg-green-100 text-green-800',
medium: 'bg-yellow-100 text-yellow-800',
hard: 'bg-red-100 text-red-800',
};

return (
<Card className="hover:shadow-lg transition-shadow">
<CardHeader>
<div className="flex justify-between items-start">
<div>
<CardTitle>{title}</CardTitle>
<CardDescription>{description}</CardDescription>
</div>
<Badge className={getDifficultyColor[difficulty]}>
{difficulty}
</Badge>
</div>
</CardHeader>
<CardContent>
<p className="text-sm text-gray-600">{lessons} lições</p>
</CardContent>
</Card>
);
};
\*/

// ============================================================================
// PASSO 2: Versão Mobile (React Native)
// ============================================================================
// Arquivo: /apps/mobile/src/components/CourseCard.tsx

import React from 'react';
import {
View,
Text,
StyleSheet,
Pressable,
ViewStyle,
TextStyle,
} from 'react-native';
import {
colors,
spacing,
borderRadius,
getDifficultyColor,
} from '@studycycle/ui';

interface CourseCardProps {
title: string;
description: string;
difficulty: 'easy' | 'medium' | 'hard';
lessons: number;
onPress?: () => void;
style?: ViewStyle;
}

export const CourseCard: React.FC<CourseCardProps> = ({
title,
description,
difficulty,
lessons,
onPress,
style,
}) => {
const styles = StyleSheet.create({
card: {
backgroundColor: '#ffffff',
borderRadius: borderRadius.lg,
padding: spacing[4],
marginBottom: spacing[4],
shadowColor: colors.neutral[900],
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,
},
cardPressed: {
shadowOpacity: 0.2,
shadowRadius: 8,
elevation: 5,
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'flex-start',
marginBottom: spacing[3],
},
titleSection: {
flex: 1,
marginRight: spacing[3],
},
title: {
fontSize: 16,
fontWeight: '700',
color: colors.neutral[900],
marginBottom: spacing[1],
},
description: {
fontSize: 14,
color: colors.neutral[600],
},
badge: {
paddingVertical: spacing[1],
paddingHorizontal: spacing[2],
borderRadius: borderRadius.md,
justifyContent: 'center',
alignItems: 'center',
},
badgeText: {
fontSize: 12,
fontWeight: '600',
},
footer: {
fontSize: 12,
color: colors.neutral[600],
},
});

const difficultyBgColor = getDifficultyColor(difficulty);
// Ajustar cor para background do badge
const badgeBgColor =
difficulty === 'easy'
? colors.success[100]
: difficulty === 'medium'
? colors.warning[100]
: colors.error[100];

const badgeTextColor = difficultyBgColor;

return (
<Pressable
onPress={onPress}
style={({ pressed }) => [
styles.card,
pressed && styles.cardPressed,
style,
]} >
<View style={styles.header}>
<View style={styles.titleSection}>
<Text style={styles.title}>{title}</Text>
<Text style={styles.description}>{description}</Text>
</View>
<View
style={[
styles.badge,
{ backgroundColor: badgeBgColor },
]} >
<Text style={[styles.badgeText, { color: badgeTextColor }]}>
{difficulty}
</Text>
</View>
</View>
<Text style={styles.footer}>{lessons} lições</Text>
</Pressable>
);
};

// ============================================================================
// PASSO 3: Padrão de Conversão - Checklist
// ============================================================================

/\*
Ao converter um componente Web → Mobile, siga este checklist:

✅ ESTRUTURA E LAYOUT

- [ ] Substituir <div> por <View>
- [ ] Substituir <p>, <span> por <Text>
- [ ] Substituir <button> por <Pressable> ou <TouchableOpacity>
- [ ] Substituir <input> por <TextInput>
- [ ] Substituir <img> por <Image>

✅ ESTILOS

- [ ] Usar StyleSheet em vez de className
- [ ] Importar tokens de cores, spacing, etc.
- [ ] Usar Props de View (flex, flexDirection, padding, etc.)
- [ ] Remover media queries (usar useResponsive hook)

✅ RESPONSIVIDADE

- [ ] Usar hook useResponsive para détecção de tela
- [ ] Ajustar font-size, padding conforme breakpoint
- [ ] Testar em múltiplos tamanhos (320px até 1536px)

✅ INTERAÇÕES

- [ ] Substituir onClick por onPress
- [ ] Adicionar feedback visual (Pressable estados)
- [ ] Testar acessibilidade (accessible, accessibilityLabel)

✅ TIPOGRAFIA

- [ ] Usar fontFamily: 'Inter'
- [ ] Ajustar fontWeight adequadamente
- [ ] Validar lineHeight se necessário

✅ CORES

- [ ] Usar colors de tokens centralizados
- [ ] Manter consistência com paleta do design system
- [ ] Testar tema claro e escuro (se aplicável)

✅ SOMBRAS

- [ ] Usar shadowColor, shadowOffset, shadowOpacity, shadowRadius (iOS)
- [ ] Usar elevation para Android
- [ ] Manter sombras consistentes com web
      \*/

// ============================================================================
// PASSO 4: Exemplo de Mapeamento - HTML ↔ React Native
// ============================================================================

/\*
WEB (HTML) → MOBILE (React Native)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<div>                         →  <View>
<p>, <span>                   →  <Text>
<button>                      →  <Pressable> ou <TouchableOpacity>
<input type="text">           →  <TextInput>
<img>                         →  <Image>
<a>                           →  <Pressable>
display: flex                 →  display: 'flex'
justify-content: center       →  justifyContent: 'center'
padding: 16px                 →  padding: spacing[4]
gap: 12px                     →  gap: spacing[3]
color: #000                   →  color: colors.neutral[900]
background: white             →  backgroundColor: '#ffffff'
border-radius: 8px            →  borderRadius: borderRadius.md
box-shadow: 0 2px 4px         →  elevation: 3 + shadow properties
cursor: pointer               →  (Pressable já indica)
transition: all 0.2s          →  (sem animações CSS por padrão)
@media (max-width: 768px)     →  { isMobile && ... }
className="text-lg font-bold" →  style={{ fontSize: 18, fontWeight: '700' }}
*/

// ============================================================================
// PASSO 5: Componentes Reutilizáveis Web + Mobile
// ============================================================================

/\*
Para máxima reutilização, crie componentes unificados:

Estrutura:
components/
CourseCard/
CourseCard.tsx (Web - HTML)
CourseCard.native.tsx (Mobile - React Native)
index.ts (exporta ambos)
types.ts (tipos compartilhados)

Exemplo de types.ts:
export interface CourseCardProps {
title: string;
description: string;
difficulty: 'easy' | 'medium' | 'hard';
lessons: number;
onPress?: () => void;
}

Importação unificada:
import { CourseCard } from '@/components/CourseCard';

Em web: automaticamente usa CourseCard.tsx
Em mobile: automaticamente usa CourseCard.native.tsx
\*/

export default {};
