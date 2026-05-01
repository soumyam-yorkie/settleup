import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

import { Card } from './Card';
import { theme } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardProps {
  totalBalance: number;
  youOwe: number;
  youAreOwed: number;
  currency: string;
}

export const SummaryCard = ({ totalBalance, youOwe, youAreOwed, currency }: SummaryCardProps) => {
  return (
    <Card variant="elevated" padding="lg" style={styles.card}>
      <View style={styles.totalContainer}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={[
          styles.balance, 
          { color: totalBalance >= 0 ? theme.colors.success : theme.colors.danger }
        ]}>
          {formatCurrency(totalBalance, currency)}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={[styles.iconContainer, styles.oweIconContainer]}>
            <ArrowUpRight size={16} color={theme.colors.danger} />
          </View>
          <View>
            <Text style={styles.statLabel}>You owe</Text>
            <Text style={styles.statValue}>{formatCurrency(youOwe, currency)}</Text>
          </View>
        </View>
        
        <View style={styles.stat}>
          <View style={[styles.iconContainer, styles.owedIconContainer]}>
            <ArrowDownLeft size={16} color={theme.colors.success} />
          </View>

          <View>
            <Text style={styles.statLabel}>You are owed</Text>
            <Text style={styles.statValue}>{formatCurrency(youAreOwed, currency)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.md,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    color: theme.colors.outline,
    marginBottom: theme.spacing.xs,
  },
  balance: {
    fontSize: 32,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    marginVertical: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
  },
  oweIconContainer: {
    backgroundColor: `${theme.colors.danger}15`,
  },
  owedIconContainer: {
    backgroundColor: `${theme.colors.success}15`,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
});
