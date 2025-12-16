/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-uses-react */
/* eslint-disable react/react-in-jsx-scope */

// @ts-nocheck - React Native component types conflict with React types in monorepo
import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '../tokens';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  color?: string;
  weight?: 'light' | 'normal' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

const TextComponent: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = colors.neutral[900],
  weight = 'normal',
  align = 'left',
  style,
}) => {
  const getTextStyles = (): TextStyle => {
    const variantSizes: Record<string, number> = {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      body: 16,
      caption: 14,
    };

    const weights: Record<string, TextStyle['fontWeight']> = {
      light: '300',
      normal: '400',
      semibold: '600',
      bold: '700',
    };

    return {
      fontSize: variantSizes[variant],
      fontWeight: weights[weight],
      color,
      textAlign: align,
      fontFamily: 'System',
      marginVertical: variant.startsWith('h') ? 12 : 0,
    };
  };

  return <Text style={[getTextStyles(), style]}>{children}</Text>;
};

export default TextComponent;
