import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';

import { theme } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outline';
  padding?: keyof typeof theme.spacing | number;
}

export const Card = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
}: CardProps) => {
  const paddingValue = typeof padding === 'string' ? theme.spacing[padding] : padding;

  const containerStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outline' && styles.outline,
    variant === 'flat' && styles.flat,
    { padding: paddingValue },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={containerStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.xxl,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  elevated: {
    ...theme.shadows.small,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  flat: {
    backgroundColor: theme.colors.surfaceContainerLow,
  },
});
