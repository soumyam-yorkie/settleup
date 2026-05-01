import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserPlus, Search, Wallet, ArrowUp, ArrowDown } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { FriendCard } from '../../components/FriendCard';
import { GradientCard } from '../../components/GradientCard';
import { MOCK_FRIENDS, MOCK_USER } from '../../services/mockData';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';

export const FriendsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const totalOwed = MOCK_FRIENDS.reduce((acc, f) => f.balance > 0 ? acc + f.balance : acc, 0);
  const totalIOwe = Math.abs(MOCK_FRIENDS.reduce((acc, f) => f.balance < 0 ? acc + f.balance : acc, 0));
  const netBalance = totalOwed - totalIOwe;

  const handleSettleUp = () => {
    Alert.alert(
      'Settle Up',
      'Choose a friend from the list below to settle your balance.',
      [{ text: 'Got it' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.headerAvatar} />
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={22} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Balance Card */}
        <GradientCard style={styles.heroCard}>
          <Text style={styles.heroLabel}>TOTAL NET BALANCE</Text>
          <Text style={styles.heroAmount}>
            {formatCurrency(netBalance)}
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Owed to You</Text>
              <View style={styles.statValueRow}>
                <ArrowUp size={14} color={theme.colors.secondaryContainer} />
                <Text style={styles.statValueGreen}>{formatCurrency(totalOwed)}</Text>
              </View>
            </View>
            <View style={styles.statVerticalDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>You Owe</Text>
              <View style={styles.statValueRow}>
                <ArrowDown size={14} color={theme.colors.tertiaryFixedDim} />
                <Text style={styles.statValueRed}>{formatCurrency(totalIOwe)}</Text>
              </View>
            </View>
          </View>
        </GradientCard>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddFriend')}
            activeOpacity={0.7}
          >
            <UserPlus size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSettleUp}
            activeOpacity={0.7}
          >
            <Wallet size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Settle Up</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {MOCK_FRIENDS.map((friend) => (
          <FriendCard
            key={friend.id}
            name={friend.name}
            balance={friend.balance}
            avatarUrl={friend.avatarUrl}
            subtitle={friend.lastActivityDescription}
            onPress={() => navigation.navigate('FriendDetail', { friendId: friend.id })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  iconButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
  },
  heroCard: {
    marginBottom: theme.spacing.xl,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.whiteAlpha70,
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroAmount: {
    fontSize: 44,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: -1,
    marginBottom: 20,
  },
  heroDivider: {
    height: 1,
    backgroundColor: theme.colors.whiteAlpha20,
    marginBottom: 20,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: {
    flex: 1,
  },
  heroStatLabel: {
    fontSize: 10,
    color: theme.colors.whiteAlpha60,
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.secondaryContainer,
  },
  statValueRed: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.tertiaryFixedDim,
  },
  statVerticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.whiteAlpha20,
    marginHorizontal: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.white,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    ...theme.shadows.small,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
