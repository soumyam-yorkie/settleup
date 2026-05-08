import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface SummaryCardProps {
  totalBalance: number;
  youOwe: number;
  youAreOwed: number;
  currency: string;
}

export const SummaryCard = ({ totalBalance, youOwe, youAreOwed, currency }: SummaryCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.totalContainer}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={[styles.balance, { color: totalBalance >= 0 ? theme.colors.success : theme.colors.danger }]}>
          {totalBalance >= 0 ? '+' : ''}{currency}{Math.abs(totalBalance).toFixed(2)}
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
            <Text style={styles.statValue}>{currency}{youOwe.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.stat}>
          <View style={[styles.iconContainer, styles.owedIconContainer]}>
            <ArrowDownLeft size={16} color={theme.colors.success} />
          </View>

          <View>
            <Text style={styles.statLabel}>You are owed</Text>
            <Text style={styles.statValue}>{currency}{youAreOwed.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    marginVertical: theme.spacing.md,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
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
    backgroundColor: theme.colors.oweRedBg,
  },
  owedIconContainer: {
    backgroundColor: theme.colors.owedGreenBg,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
