/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-uses-react */
/* eslint-disable react/react-in-jsx-scope */

// @ts-nocheck - React Native component types conflict with React types in monorepo
import React, { useState } from 'react';
import { View, TextInput, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../tokens';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  variant?: 'default' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  style?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  variant = 'outlined',
  size = 'md',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyles = (): TextStyle => {
    const baseSizes: Record<string, TextStyle> = {
      sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
      md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
      lg: { paddingVertical: 16, paddingHorizontal: 16, fontSize: 16 },
    };

    const baseInput: TextStyle = {
      ...baseSizes[size],
      borderRadius: 6,
      fontFamily: 'System',
      color: colors.neutral[900],
    };

    const variantsMap: Record<string, TextStyle> = {
      default: {
        backgroundColor: colors.neutral[100],
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: isFocused ? colors.primary[600] : colors.neutral[300],
      },
    };

    return {
      ...baseInput,
      ...variantsMap[variant],
    };
  };

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.neutral[900],
            marginBottom: 8,
            fontFamily: 'System',
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.neutral[500]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        style={getInputStyles()}
      />
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.error[500],
            marginTop: 8,
            fontFamily: 'System',
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
