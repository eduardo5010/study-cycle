/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-uses-react */
/* eslint-disable react/react-in-jsx-scope */

// @ts-nocheck - React Native component types conflict with React types in monorepo
import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { colors } from '../tokens';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'large',
  color = colors.primary[600],
  style,
}) => {
  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Spinner;
