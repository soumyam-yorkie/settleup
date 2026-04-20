import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../utils/theme';
import { ChevronRight } from 'lucide-react-native';

interface FriendCardProps {
  name: string;
  balance: number;
  avatarUrl?: string;
  currency: string;
  onPress: () => void;
}

export const FriendCard = ({ name, balance, avatarUrl, currency, onPress }: FriendCardProps) => {
  const isPositive = balance >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>{balance === 0 ? 'Settled' : isPositive ? 'owes you' : 'you owe'}</Text>
        {balance !== 0 && (
          <Text style={[styles.balanceValue, isPositive ? styles.positiveBalance : styles.negativeBalance]}>
            {currency}{Math.abs(balance).toFixed(2)}
          </Text>
        )}
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
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  placeholderAvatar: {
    backgroundColor: theme.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
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
