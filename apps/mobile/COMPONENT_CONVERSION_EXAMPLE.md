/\*\*

- EXEMPLO PRÁTICO: Convertendo ComponenteWeb → Mobile
-
- Este arquivo demonstra a conversão passo a passo de um componente real
- de estudo para funcionar em ambas as plataformas
  \*/

// ============================================================================
// ANTES: Componente Web (apps/web/client/src/components/course-card.tsx)
// ============================================================================

/\*
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseCardProps {
courseId: string;
title: string;
description: string;
lessons: number;
completedLessons: number;
difficulty: "easy" | "medium" | "hard";
imageUrl?: string;
onPress?: () => void;
}

export function CourseCard({
courseId,
title,
description,
lessons,
completedLessons,
difficulty,
imageUrl,
onPress,
}: CourseCardProps) {
const progressPercent = (completedLessons / lessons) \* 100;

return (
<Card 
      className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105" 
      onClick={onPress}
    >
{imageUrl && (
<img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
)}
<CardHeader>
<div className="flex justify-between items-start mb-2">
<CardTitle className="text-lg">{title}</CardTitle>
<Badge
className={cn({
"bg-green-100 text-green-800": difficulty === "easy",
"bg-yellow-100 text-yellow-800": difficulty === "medium",
"bg-red-100 text-red-800": difficulty === "hard",
})} >
{difficulty}
</Badge>
</div>
<p className="text-sm text-gray-600">{description}</p>
</CardHeader>
<CardContent>
<div className="space-y-2">
<div className="flex justify-between text-sm">
<span className="text-gray-600">Progresso</span>
<span className="font-semibold">
{completedLessons}/{lessons}
</span>
</div>
<Progress 
            value={progressPercent} 
            className="h-2"
          />
</div>
</CardContent>
</Card>
);
}
\*/

// ============================================================================
// DEPOIS: Componente Mobile (apps/mobile/src/components/CourseCard.tsx)
// ============================================================================

import React from 'react';
import {
View,
Text,
Image,
StyleSheet,
Pressable,
ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, responsive } from '@studycycle/ui';
import Card from '@studycycle/ui/components/Card';
import { useResponsive } from '@studycycle/ui';

interface CourseCardProps {
courseId: string;
title: string;
description: string;
lessons: number;
completedLessons: number;
difficulty: 'easy' | 'medium' | 'hard';
imageUrl?: string;
onPress?: () => void;
style?: ViewStyle;
}

export const CourseCard: React.FC<CourseCardProps> = ({
courseId,
title,
description,
lessons,
completedLessons,
difficulty,
imageUrl,
onPress,
style,
}) => {
const { width, isMobile } = useResponsive();
const progressPercent = (completedLessons / lessons) \* 100;

// Estilos responsivos
const dynamicImageHeight = isMobile ? 120 : 180;
const dynamicTitleSize = isMobile ? 16 : 18;

const styles = StyleSheet.create({
container: {
marginBottom: spacing[4],
},
pressable: {
borderRadius: borderRadius.lg,
overflow: 'hidden',
},
pressableActive: {
opacity: 0.8,
},
image: {
width: '100%',
height: dynamicImageHeight,
backgroundColor: colors.neutral[200],
},
content: {
padding: spacing[4],
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'flex-start',
marginBottom: spacing[2],
},
title: {
fontSize: dynamicTitleSize,
fontWeight: '700',
color: colors.neutral[900],
flex: 1,
marginRight: spacing[2],
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
textTransform: 'capitalize',
},
description: {
fontSize: 14,
color: colors.neutral[600],
marginBottom: spacing[3],
},
progressSection: {
marginTop: spacing[4],
},
progressLabel: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: spacing[2],
},
labelText: {
fontSize: 12,
color: colors.neutral[600],
},
progressCount: {
fontSize: 12,
fontWeight: '600',
color: colors.neutral[900],
},
progressBar: {
height: 6,
backgroundColor: colors.neutral[200],
borderRadius: 3,
overflow: 'hidden',
},
progressFill: {
height: '100%',
backgroundColor: colors.primary[600],
},
});

// Selecionar cor do badge baseado na dificuldade
const difficultyColors = {
easy: {
bg: colors.success[100],
text: colors.success[700],
},
medium: {
bg: colors.warning[100],
text: colors.warning[700],
},
hard: {
bg: colors.error[100],
text: colors.error[700],
},
};

const badgeColor = difficultyColors[difficulty];

return (
<View style={[styles.container, style]}>
<Pressable
onPress={onPress}
style={({ pressed }) => [
styles.pressable,
pressed && styles.pressableActive,
]} >
<Card variant="default" style={{ margin: 0 }}>
{/_ Imagem _/}
{imageUrl && (
<Image
source={{ uri: imageUrl }}
style={styles.image}
resizeMode="cover"
/>
)}

          {/* Conteúdo */}
          <View style={styles.content}>
            {/* Header com Título e Badge */}
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              <View style={[styles.badge, { backgroundColor: badgeColor.bg }]}>
                <Text style={[styles.badgeText, { color: badgeColor.text }]}>
                  {difficulty}
                </Text>
              </View>
            </View>

            {/* Descrição */}
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>

            {/* Seção de Progresso */}
            <View style={styles.progressSection}>
              <View style={styles.progressLabel}>
                <Text style={styles.labelText}>Progresso</Text>
                <Text style={styles.progressCount}>
                  {completedLessons}/{lessons}
                </Text>
              </View>

              {/* Barra de Progresso */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </Card>
      </Pressable>
    </View>

);
};

// ============================================================================
// ANTES vs DEPOIS: Resumo das Mudanças
// ============================================================================

/\*
MUDANÇA 1: Estrutura HTML → React Native
<Card> → <Card variant="default">
<img> → <Image source={{ uri }} />

  <div>                  → <View>
  <span>, <p>            → <Text>
  onClick                → onPress (em Pressable)

MUDANÇA 2: CSS → StyleSheet
className="w-full" → width: '100%' em style
hover:shadow-lg → Pressable com pressed state
text-gray-600 → color: colors.neutral[600]
space-y-2 → marginVertical em View
rounded-lg → borderRadius: borderRadius.lg

MUDANÇA 3: Tokens Compartilhados
#16a34a (verde) → colors.success[700]
padding: 16px → padding: spacing[4]
8px border-radius → borderRadius.md

MUDANÇA 4: Responsividade
@media (max-width) → useResponsive hook
text-lg → dynamicTitleSize (14 mobile, 18 desktop)
h-48 (web) → 180px, h-32 (mobile) → 120px

MUDANÇA 5: Acessibilidade
Mantém numberOfLines para truncar texto
Adiciona accessibilityLabel (próximo passo)
Pressable com feedback visual (opacity)
\*/

// ============================================================================
// USO DO COMPONENTE
// ============================================================================

/\*
import { CourseCard } from '@/components/CourseCard';

export const CoursesScreen = () => {
return (
<FlatList
data={courses}
renderItem={({ item }) => (
<CourseCard
courseId={item.id}
title={item.name}
description={item.description}
lessons={item.totalLessons}
completedLessons={item.completedLessons}
difficulty={item.difficulty}
imageUrl={item.thumbnailUrl}
onPress={() => navigateToCourseDetail(item.id)}
style={{ marginHorizontal: spacing[4] }}
/>
)}
contentContainerStyle={{ paddingVertical: spacing[4] }}
/>
);
};
\*/

export default CourseCard;
