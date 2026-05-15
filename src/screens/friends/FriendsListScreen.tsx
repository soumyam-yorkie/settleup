import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserPlus, Search, Wallet, ArrowUp, ArrowDown } from 'lucide-react-native';

import { FriendCard } from '../../components/FriendCard';
import { GradientCard } from '../../components/GradientCard';
import { useAppContext } from '../../context/AppContext';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';
import { Avatar } from '../../components/Avatar';

export const FriendsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentUser, friends, expenses } = useAppContext();

  const friendsWithBalances = useMemo(() => {
    return friends.map(friend => {
      const friendExpenses = expenses.filter(e => 
        e.paidBy === friend.id || e.splits.some(s => s.userId === friend.id)
      );
      
      let balance = 0;
      friendExpenses.forEach(expense => {
        const isPaidByMe = expense.paidBy === currentUser.id;
        const isPaidByFriend = expense.paidBy === friend.id;
        const mySplit = expense.splits.find(s => s.userId === currentUser.id)?.amount || 0;
        const friendSplit = expense.splits.find(s => s.userId === friend.id)?.amount || 0;

        if (isPaidByMe) {
          balance += friendSplit;
        } else if (isPaidByFriend) {
          balance -= mySplit;
        }
      });

      return {
        ...friend,
        balance,
        lastActivityDescription: 'Active', // Placeholder
      };
    });
  }, [friends, expenses, currentUser.id]);

  const totalOwed = friendsWithBalances.reduce((acc, f) => f.balance > 0 ? acc + f.balance : acc, 0);
  const totalIOwe = Math.abs(friendsWithBalances.reduce((acc, f) => f.balance < 0 ? acc + f.balance : acc, 0));
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
        <Avatar uri={currentUser.avatarUrl} style={styles.headerAvatar} />
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
            {formatCurrency(netBalance, currentUser.defaultCurrency)}
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Owed to You</Text>
              <View style={styles.statValueRow}>
                <ArrowUp size={14} color={theme.colors.secondaryContainer} />
                <Text style={styles.statValueGreen}>{formatCurrency(totalOwed, currentUser.defaultCurrency)}</Text>
              </View>
            </View>
            <View style={styles.statVerticalDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>You Owe</Text>
              <View style={styles.statValueRow}>
                <ArrowDown size={14} color={theme.colors.tertiaryFixedDim} />
                <Text style={styles.statValueRed}>{formatCurrency(totalIOwe, currentUser.defaultCurrency)}</Text>
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

        {friendsWithBalances.map((friend) => (
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
