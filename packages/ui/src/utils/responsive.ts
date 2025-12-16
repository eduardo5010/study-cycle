import { colors, spacing, borderRadius, responsive } from '../tokens';

/**
 * Função para obter tamanho de font responsivo
 */
export function getResponsiveFontSize(
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption',
  screenWidth: number
): number {
  const fontSizes = responsive.fontSize[level];

  if (screenWidth >= responsive.breakpoints.lg) {
    return fontSizes.lg;
  }
  if (screenWidth >= responsive.breakpoints.md) {
    return fontSizes.md;
  }
  if (screenWidth >= responsive.breakpoints.sm) {
    return fontSizes.sm;
  }
  return fontSizes.xs;
}

/**
 * Função para obter espaçamento responsivo
 */
export function getResponsiveSpacing(
  level: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  screenWidth: number
): number {
  const spacings = responsive.spacing[level];

  if (screenWidth >= responsive.breakpoints.lg) {
    return spacings.lg;
  }
  if (screenWidth >= responsive.breakpoints.md) {
    return spacings.md;
  }
  if (screenWidth >= responsive.breakpoints.sm) {
    return spacings.sm;
  }
  return spacings.xs;
}

/**
 * Obtém cor com base no estado
 */
export const getStatusColor = (status: 'success' | 'error' | 'warning' | 'info') => {
  const statusColors = {
    success: colors.success[500],
    error: colors.error[500],
    warning: colors.warning[500],
    info: colors.primary[500],
  };
  return statusColors[status];
};

/**
 * Obtém cor com base na dificuldade
 */
export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
  const difficultyColors = {
    easy: colors.success[500],
    medium: colors.warning[500],
    hard: colors.error[500],
  };
  return difficultyColors[difficulty];
};

/**
 * Estilos base reutilizáveis para componentes
 */
export const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  button: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    fontSize: 16,
    fontFamily: 'Inter',
  },
  text: {
    color: colors.neutral[900],
    fontFamily: 'Inter',
  },
} as const;
