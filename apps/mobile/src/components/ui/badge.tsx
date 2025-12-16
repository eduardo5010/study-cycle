import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius } from '@studycycle/ui';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary[100],
          borderColor: colors.secondary[200],
        };
      case 'destructive':
        return {
          backgroundColor: colors.error[100],
          borderColor: colors.error[200],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.neutral[300],
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: colors.primary[100],
          borderColor: colors.primary[200],
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 6, paddingVertical: 2 };
      case 'lg':
        return { paddingHorizontal: 12, paddingVertical: 6 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 4 };
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'sm':
        return { fontSize: 10 };
      case 'lg':
        return { fontSize: 14 };
      default:
        return { fontSize: 12 };
    }
  };

  const styles = StyleSheet.create({
    badge: {
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      ...getVariantStyle(),
      ...getSizeStyle(),
    },
    text: {
      fontWeight: '600',
      color: colors.neutral[900],
      ...getTextStyle(),
    },
  });

  return (
    <Text style={[styles.badge, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Text>
  );
};
