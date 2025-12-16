/**
 * Cross-Platform Component Pattern
 *
 * Este arquivo demonstra como criar componentes que funcionam em web e mobile
 * usando a extensão .native.tsx para React Native e a base .tsx para web
 */

// Para React Native: arquivo.native.tsx
// Exemplo: Button.native.tsx (criado com StyleSheet e componentes RN)
// Utiliza: View, Text, TouchableOpacity, StyleSheet

// Para Web: arquivo.tsx
// Exemplo: Button.tsx (criado com HTML e CSS/Tailwind)
// Utiliza: HTML elements com className Tailwind

// Importações automáticas:
// - Em React Native: automaticamente importa de arquivo.native.tsx
// - Em Web: automaticamente importa de arquivo.tsx
//
// import Button from '@studycycle/ui' // automaticamente seleciona a versão correta

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-uses-react */
/* eslint-disable react/react-in-jsx-scope */

// @ts-nocheck - React Native component types conflict with React types in monorepo
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  paddingHorizontal?: number;
  style?: ViewStyle;
}

/**
 * Container responsivo que funciona em web e mobile
 * Mantém máxima largura em web e usa toda a tela em mobile
 */
export const ResponsiveContainer: React.FC<ContainerProps> = ({
  children,
  maxWidth = 1200,
  paddingHorizontal = 24,
  style,
}) => {
  const { width, isMobile } = useResponsive();

  const containerWidth = isMobile ? width : Math.min(width, maxWidth);

  const styles = StyleSheet.create({
    container: {
      width: containerWidth,
      paddingHorizontal: isMobile ? 16 : paddingHorizontal,
      alignSelf: 'center',
    },
  });

  return <View style={[styles.container, style]}>{children}</View>;
};

/**
 * Grid responsivo que adapta colunas baseado no tamanho da tela
 */
interface GridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: number;
  style?: ViewStyle;
}

export const ResponsiveGrid: React.FC<GridProps> = ({
  children,
  columns = { xs: 1, sm: 1, md: 2, lg: 3 },
  gap = 16,
  style,
}) => {
  const { breakpoint } = useResponsive();

  const colCount = columns[breakpoint as keyof typeof columns] || columns.xs || 1;

  const styles = StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -gap / 2,
    },
    item: {
      width: `${100 / colCount}%`,
      paddingHorizontal: gap / 2,
      marginBottom: gap,
    },
  });

  return (
    <View style={[styles.grid, style]}>
      {React.Children.map(children, (child) => (
        <View style={styles.item}>{child}</View>
      ))}
    </View>
  );
};

/**
 * Stack (coluna/linha) responsiva
 */
interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  style?: ViewStyle;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  gap = 16,
  align = 'flex-start',
  justify = 'flex-start',
  style,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: direction,
      gap,
      alignItems: align,
      justifyContent: justify,
    },
  });

  return <View style={[styles.container, style]}>{children}</View>;
};

/**
 * Spacer responsivo
 */
interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  vertical?: boolean;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  vertical = true,
  horizontal = false,
}) => {
  const sizes = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const spaceValue = sizes[size];

  return (
    <View
      style={{
        height: vertical ? spaceValue : 0,
        width: horizontal ? spaceValue : 0,
      }}
    />
  );
};

export default {
  ResponsiveContainer,
  ResponsiveGrid,
  Stack,
  Spacer,
};
