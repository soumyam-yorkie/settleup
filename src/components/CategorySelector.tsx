import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Coffee, 
  Zap, 
  Film,
  Home,
  Briefcase
} from 'lucide-react-native';
import { theme } from '../utils/theme';

export const CATEGORIES = [
  { id: 'Food', label: 'Food', icon: Utensils },
  { id: 'Transport', label: 'Transport', icon: Car },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'Entertainment', label: 'Entertainment', icon: Film },
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Office', label: 'Office', icon: Briefcase },
  { id: 'Other', label: 'Other', icon: Zap },
];

interface CategorySelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CategorySelector = ({ selectedId, onSelect }: CategorySelectorProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedId === cat.id;
        
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <Icon 
              size={14} 
              color={isActive ? theme.colors.white : theme.colors.onSurfaceVariant} 
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  labelActive: {
    color: theme.colors.white,
  },
});
