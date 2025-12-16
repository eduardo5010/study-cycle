import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@studycycle/ui';

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  style,
  numberOfLines,
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'xs':
        return 12;
      case 'sm':
        return 14;
      case 'lg':
        return 18;
      case 'xl':
        return 20;
      case '2xl':
        return 24;
      case '3xl':
        return 30;
      default:
        return 16;
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'light':
        return '300';
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'muted':
        return colors.neutral[600];
      case 'primary':
        return colors.primary[600];
      case 'success':
        return colors.success[600];
      case 'warning':
        return colors.warning[600];
      case 'error':
        return colors.error[600];
      default:
        return colors.neutral[900];
    }
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: getFontSize(),
      fontWeight: getFontWeight(),
      color: getColor(),
      textAlign: align,
    },
  });

  return (
    <RNText style={[styles.text, style]} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};
