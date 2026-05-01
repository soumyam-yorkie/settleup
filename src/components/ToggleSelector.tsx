import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../utils/theme';

interface ToggleOption<T> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface ToggleSelectorProps<T> {
  options: ToggleOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  variant?: 'pill' | 'button';
  style?: ViewStyle;
}

export function ToggleSelector<T>({ 
  options, 
  selectedValue, 
  onSelect, 
  variant = 'button',
  style 
}: ToggleSelectorProps<T>) {
  if (variant === 'pill') {
    return (
      <View style={[styles.pillContainer, style]}>
        {options.map((option) => {
          const isActive = option.value === selectedValue;
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[styles.pillItem, isActive && styles.pillItemActive]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.buttonRow, style]}>
      {options.map((option) => {
        const isActive = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={[styles.buttonItem, isActive && styles.buttonItemActive]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.8}
          >
            {option.icon && (
              <View style={styles.buttonIcon}>
                {React.cloneElement(option.icon as React.ReactElement, {
                  color: isActive ? theme.colors.white : theme.colors.onSurfaceVariant,
                  size: 18,
                })}
              </View>
            )}
            <Text style={[styles.buttonText, isActive && styles.buttonTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Pill styles
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: 4,
  },
  pillItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  pillItemActive: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  pillTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Button styles
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  buttonItemActive: {
    backgroundColor: theme.colors.primary,
  },
  buttonIcon: {
    marginRight: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  buttonTextActive: {
    color: theme.colors.white,
    fontWeight: '700',
  },
});
