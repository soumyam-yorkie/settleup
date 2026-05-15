import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Card } from './Card';
import { theme } from '../utils/theme';
import { formatCurrency, getBalanceDetails } from '../utils/formatters';
import { Avatar } from './Avatar';

interface FriendCardProps {
  name: string;
  balance: number;
  avatarUrl?: string;
  subtitle?: string;
  onPress: () => void;
}

export const FriendCard = ({ name, balance, avatarUrl, subtitle, onPress }: FriendCardProps) => {
  const balanceDetails = getBalanceDetails(balance);

  return (
    <Card 
      onPress={onPress} 
      padding="md"
      variant="outline"
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar uri={avatarUrl} style={styles.avatar} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        <View style={styles.rightSection}>
          <View style={styles.balanceInfo}>
            <Text style={[styles.balance, { color: theme.colors[balanceDetails.color] }]}>
              {formatCurrency(balance)}
            </Text>
            <Text style={styles.balanceLabel}>{balanceDetails.label}</Text>
          </View>
          <ChevronRight size={18} color={theme.colors.outlineVariant} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceInfo: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 15,
    fontWeight: '700',
  },
  balanceLabel: {
    fontSize: 10,
    color: theme.colors.outline,
    marginTop: 2,
  },
});
