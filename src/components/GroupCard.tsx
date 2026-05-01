import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Card } from './Card';
import { theme } from '../utils/theme';
import { formatCurrency, getInitials, getBalanceDetails } from '../utils/formatters';

interface GroupCardProps {
  name: string;
  category: string;
  membersCount: number;
  balance: number;
  currency: string;
  onPress: () => void;
}

export const GroupCard = ({ 
  name, 
  category, 
  membersCount, 
  balance, 
  currency, 
  onPress 
}: GroupCardProps) => {
  const balanceDetails = getBalanceDetails(balance);

  return (
    <Card 
      onPress={onPress} 
      variant="elevated" 
      padding="md"
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{getInitials(name)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category} • {membersCount} members</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>{balanceDetails.label}</Text>
        <Text style={[
          styles.balanceValue, 
          { color: theme.colors[balanceDetails.color] }
        ]}>
          {formatCurrency(balance, currency)}
        </Text>
      </View>

      <ChevronRight size={20} color={theme.colors.outlineVariant} style={styles.chevron} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
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
    fontSize: 14,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: theme.spacing.xs,
  },
});
