import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '@studycycle/ui';
import { getInitials } from '@studycycle/core';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  fallback?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  style,
  fallback,
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'lg':
        return 64;
      case 'xl':
        return 80;
      default:
        return 48;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'lg':
        return 24;
      case 'xl':
        return 28;
      default:
        return 18;
    }
  };

  const avatarSize = getSize();
  const textSize = getTextSize();

  const styles = StyleSheet.create({
    container: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: colors.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: avatarSize / 2,
    },
    text: {
      fontSize: textSize,
      fontWeight: '600',
      color: colors.primary[700],
    },
  });

  if (src) {
    return (
      <View style={[styles.container, style]}>
        <Image source={{ uri: src }} style={styles.image} />
      </View>
    );
  }

  if (fallback) {
    return (
      <View style={[styles.container, style]}>
        {fallback}
      </View>
    );
  }

  if (name) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.text}>{getInitials(name)}</Text>
      </View>
    );
  }

  // Default fallback
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>?</Text>
    </View>
  );
};
