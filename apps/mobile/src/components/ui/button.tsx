import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors, borderRadius, spacing } from '@studycycle/ui';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 12, // 3 * 4px
          paddingVertical: 8,     // 2 * 4px
          minHeight: 32,
        };
      case 'lg':
        return {
          paddingHorizontal: 24, // 6 * 4px
          paddingVertical: 12,    // 3 * 4px
          minHeight: 48,
        };
      default:
        return {
          paddingHorizontal: 16, // 4 * 4px
          paddingVertical: 8,     // 2 * 4px
          minHeight: 40,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return { fontSize: 14 };
      case 'lg':
        return { fontSize: 16 };
      default:
        return { fontSize: 14 };
    }
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      ...getSizeStyle(),
    },
    text: {
      fontWeight: '600',
      textAlign: 'center',
      ...getTextSize(),
    },
    iconLeft: {
      marginRight: 8, // 2 * 4px
    },
    iconRight: {
      marginLeft: 8, // 2 * 4px
    },
  });

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: colors.primary[600],
      borderWidth: 0,
    };

    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary[600],
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.neutral[300],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled || isLoading) {
      return colors.neutral[400];
    }

    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.neutral[900];
      default:
        return '#ffffff';
    }
  };

  const buttonStyle = getButtonStyle();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        (disabled || isLoading) && { opacity: 0.5 },
        style,
      ]}
      disabled={disabled || isLoading}
      onPress={onPress}
      {...props}
    >
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.iconLeft}
        />
      )}
      {!isLoading && leftIcon && (
        <View style={styles.iconLeft}>{leftIcon}</View>
      )}
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {children}
      </Text>
      {!isLoading && rightIcon && (
        <View style={styles.iconRight}>{rightIcon}</View>
      )}
    </TouchableOpacity>
  );
};
