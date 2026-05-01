import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

import { theme } from '../utils/theme';

type SettingsRowVariant = 'navigate' | 'toggle' | 'action';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  variant?: SettingsRowVariant;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
  rightLabel?: string;
  isLast?: boolean;
}

export const SettingsRow = ({
  icon,
  label,
  description,
  variant = 'navigate',
  value,
  onValueChange,
  onPress,
  danger = false,
  rightLabel,
  isLast = false,
}: SettingsRowProps) => {
  const textColor = danger ? theme.colors.danger : theme.colors.onSurface;

  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={variant === 'toggle' ? 1 : 0.6}
      disabled={variant === 'toggle'}
    >
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        {icon}
      </View>

      <View style={styles.labelGroup}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <View style={styles.right}>
        {variant === 'navigate' && rightLabel ? (
          <Text style={styles.rightLabel}>{rightLabel}</Text>
        ) : null}
        {variant === 'toggle' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: theme.colors.surfaceContainerHigh,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
          />
        )}
        {variant === 'navigate' && (
          <Text style={styles.chevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    minHeight: 56,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerLow,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  iconWrapDanger: {
    backgroundColor: theme.colors.errorContainer,
  },
  labelGroup: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  description: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightLabel: {
    fontSize: 14,
    color: theme.colors.outline,
    marginRight: 2,
  },
  chevron: {
    fontSize: 22,
    color: theme.colors.outline,
    lineHeight: 24,
  },
});
