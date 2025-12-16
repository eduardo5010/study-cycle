/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-uses-react */
/* eslint-disable react/react-in-jsx-scope */

// @ts-nocheck - React Native component types conflict with React types in monorepo
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '../tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
  const getCardStyles = (): ViewStyle => {
    const baseCard: ViewStyle = {
      borderRadius: 8,
      padding: 24,
      backgroundColor: '#ffffff',
    };

    const variantsMap: Record<string, ViewStyle> = {
      default: {
        shadowColor: colors.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.neutral[300],
      },
      elevated: {
        shadowColor: colors.neutral[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      },
    };

    return {
      ...baseCard,
      ...variantsMap[variant],
    };
  };

  return <View style={[getCardStyles(), style]}>{children}</View>;
};

export default Card;
