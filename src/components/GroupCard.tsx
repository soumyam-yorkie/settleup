import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';
import { ChevronRight } from 'lucide-react-native';

interface GroupCardProps {
  name: string;
  category: string;
  membersCount: number;
  balance: number;
  currency: string;
  onPress: () => void;
}

export const GroupCard = ({ name, category, membersCount, balance, currency, onPress }: GroupCardProps) => {
  const isPositive = balance >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category} • {membersCount} members</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>{isPositive ? 'You are owed' : 'You owe'}</Text>
        <Text style={[styles.balanceValue, isPositive ? styles.positiveBalance : styles.negativeBalance]}>
          {currency}{Math.abs(balance).toFixed(2)}
        </Text>
      </View>

      <ChevronRight size={20} color={theme.colors.outlineVariant} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xxl,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  category: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: 'flex-end',
    marginRight: theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontFamily: 'Manrope',
    fontSize: 14,
    fontWeight: '700',
  },
  positiveBalance: {
    color: theme.colors.secondary,
  },
  negativeBalance: {
    color: theme.colors.error,
  },
  chevron: {
    marginLeft: theme.spacing.xs,
  },
});
