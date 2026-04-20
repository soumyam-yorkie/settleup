import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { theme } from '../utils/theme';

interface AddExpenseFABProps {
  onPress: () => void;
}

export const AddExpenseFAB = ({ onPress }: AddExpenseFABProps) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <Plus color={theme.colors.white} size={28} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.fab,
  },
});
