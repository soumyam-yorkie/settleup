import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';

import { theme } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outline';
  padding?: keyof typeof theme.spacing | number;
}

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
  pressed: {
    opacity: 0.85,
  },
});

const variantStyles = {
  elevated: styles.elevated,
  outline: styles.outline,
  flat: styles.flat,
};

export const Card = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
}: CardProps) => {
  const paddingValue = typeof padding === 'string' ? theme.spacing[padding] : padding;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.card,
    variantStyles[variant],
    { padding: paddingValue },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && styles.pressed
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};


