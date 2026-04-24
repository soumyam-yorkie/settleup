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
  const Container = onPress ? TouchableOpacity : View;
  
  const paddingValue = typeof padding === 'string' ? theme.spacing[padding] : padding;

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        variant === 'outline' && styles.outline,
        variant === 'flat' && styles.flat,
        { padding: paddingValue },
        style,
      ]}
    >
      {children}
    </Container>
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
