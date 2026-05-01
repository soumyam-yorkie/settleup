import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';

import { theme } from '../utils/theme';

interface SegmentedControlProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onChange: (tab: T) => void;
  style?: StyleProp<ViewStyle>;
}

export const SegmentedControl = <T extends string>({
  tabs,
  activeTab,
  onChange,
  style,
}: SegmentedControlProps<T>) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          style={({ pressed }) => [
            styles.tab, 
            activeTab === tab && styles.activeTab,
            pressed && styles.pressed
          ]}
          onPress={() => onChange(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.round,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.round,
  },
  activeTab: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  activeTabText: {
    color: theme.colors.onSurface,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
