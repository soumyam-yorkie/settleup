import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';

import { theme } from '../utils/theme';

interface SectionHeaderProps {
  title: string;
  rightLabel?: string;
  onRightPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SectionHeader = ({
  title,
  rightLabel,
  onRightPress,
  style,
}: SectionHeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {rightLabel && (
        <TouchableOpacity 
          onPress={onRightPress}
          disabled={!onRightPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.rightLabel, !onRightPress && styles.disabledLabel]}>
            {rightLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  rightLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  disabledLabel: {
    color: theme.colors.outlineVariant,
  },
});
