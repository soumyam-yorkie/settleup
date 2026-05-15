import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Card } from './Card';
import { theme } from '../utils/theme';
import { formatCurrency, getBalanceDetails } from '../utils/formatters';
import { Avatar } from './Avatar';

interface GroupCardProps {
  name: string;
  category: string;
  membersCount: number;
  balance: number;
  currency: string;
  avatarUrl?: string;
  onPress: () => void;
}

export const GroupCard = ({ 
  name, 
  category, 
  membersCount, 
  balance, 
  currency, 
  avatarUrl,
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
        <Avatar uri={avatarUrl} style={styles.avatar} type="group" />
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
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
