/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-uses-react */
/* eslint-disable react/react-in-jsx-scope */

// @ts-nocheck - React Native component types conflict with React types in monorepo
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseButton: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      opacity: disabled ? 0.5 : 1,
    };

    const sizesMap: Record<string, ViewStyle> = {
      sm: { paddingVertical: 8, paddingHorizontal: 12 },
      md: { paddingVertical: 12, paddingHorizontal: 16 },
      lg: { paddingVertical: 16, paddingHorizontal: 24 },
    };

    const variantsMap: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary[600] },
      secondary: { backgroundColor: colors.secondary[600] },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary[600],
      },
      ghost: { backgroundColor: 'transparent' },
    };

    return {
      ...baseButton,
      ...sizesMap[size],
      ...variantsMap[variant],
    };
  };

  const getTextStyles = (): TextStyle => {
    const variantTextColors: Record<string, string> = {
      primary: '#ffffff',
      secondary: '#ffffff',
      outline: colors.primary[600],
      ghost: colors.primary[600],
    };

    return {
      color: variantTextColors[variant],
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 16 : 15,
      fontWeight: '600',
      marginLeft: leftIcon && !loading ? 8 : 0,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
    >
      {loading && (
        <ActivityIndicator size="small" color="currentColor" style={{ marginRight: 8 }} />
      )}
      {!loading && leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
      <Text style={getTextStyles()}>{label}</Text>
      {!loading && rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

export default Button;
