import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  ArrowLeft, 
  MoreVertical, 
  Plus, 
  CheckCircle2,
  Utensils,
  Car,
  Coffee,
  Wallet,
  Calendar,
  Zap,
  Clock
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MOCK_EXPENSES, MOCK_USER, MOCK_FRIENDS } from '../../services/mockData';
import { theme } from '../../utils/theme';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendDetail'>;

const CATEGORY_ICONS: Record<string, any> = {
  Food: Utensils,
  Transport: Car,
  Settlement: Coffee,
  Default: Zap,
};

export const FriendDetailScreen = ({ route }: Props) => {
  const navigation = useNavigation();
  const { friendId } = route.params;

  const friendInfo = useMemo(() => 
    MOCK_FRIENDS.find(f => f.id === friendId),
  [friendId]);

  const sharedExpenses = useMemo(() => 
    MOCK_EXPENSES.filter(e => 
      e.splits.some(s => s.userId === friendId) && 
      (e.paidBy === MOCK_USER.id || e.paidBy === friendId)
    ),
  [friendId]);

  const balance = friendInfo?.balance || 0;
  const isOwed = balance > 0;

  const renderTransactionItem = ({ item }: { item: typeof MOCK_EXPENSES[0] }) => {
    const Icon = CATEGORY_ICONS[item.category || 'Default'] || CATEGORY_ICONS.Default;
    const isPaidByMe = item.paidBy === MOCK_USER.id;
    const absAmount = Math.abs(item.amount).toFixed(2);
    
    // In friend detail view, we show the split amount for the current context
    const friendSplit = item.splits.find(s => s.userId === friendId);
    const mySplit = item.splits.find(s => s.userId === MOCK_USER.id);
    const displayAmount = isPaidByMe ? friendSplit?.amount : mySplit?.amount;

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionIconContainer}>
          <Icon size={20} color={theme.colors.primary} />
        </View>
        
        <View style={styles.transactionMain}>
          <Text style={styles.transactionTitle}>{item.description}</Text>
          <Text style={styles.transactionSub}>
            {item.category === 'Settlement' ? 'Settled bill' : 'Shared bill'} • {item.date}
          </Text>
        </View>
        
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            isPaidByMe ? styles.amountGreen : styles.amountRed
          ]}>
            {isPaidByMe ? '+' : '-'} ${displayAmount?.toFixed(2)}
          </Text>
          <Text style={styles.transactionStatus}>
            {isPaidByMe ? 'PAID BY YOU' : `PAID BY ${friendInfo?.name.split(' ')[0].toUpperCase()}`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft color={theme.colors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friend Details</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreVertical color={theme.colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: friendInfo?.avatarUrl || 'https://via.placeholder.com/150' }} 
              style={styles.largeAvatar} 
            />
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={16} color={theme.colors.white} fill={theme.colors.primary} />
            </View>
          </View>
          <Text style={styles.profileName}>{friendInfo?.name}</Text>
          <Text style={styles.profileHandle}>{friendInfo?.handle || '@friend_username'}</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, isOwed ? styles.textGreen : styles.textRed]}>
            {isOwed ? 'OWED TO YOU' : 'YOU OWE'}
          </Text>
          <Text style={styles.balanceAmount}>${Math.abs(balance).toFixed(2)}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.settleButton}>
            <Wallet size={18} color={theme.colors.white} />
            <Text style={styles.settleButtonText}>Settle Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.requestButton}>
            <Clock size={18} color={theme.colors.primary} />
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {sharedExpenses.map(item => renderTransactionItem({ item }))}

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardDark]}>
            <View style={styles.statIconBox}>
              <Calendar size={16} color={theme.colors.white} />
            </View>
            <Text style={styles.statLabel}>Frequency</Text>
            <Text style={styles.statValue}>Weekly Spender</Text>
          </View>
          <View style={[styles.statCard, styles.statCardLight]}>
            <View style={styles.statIconBoxLight}>
              <Clock size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.statLabelLight}>Last settled</Text>
            <Text style={styles.statValueLight}>14 days ago</Text>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => (navigation as any).navigate('AddExpense', { friendId })}
      >
        <Plus color={theme.colors.white} size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.white,
    ...theme.shadows.medium,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  profileHandle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 28,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textGreen: { color: theme.colors.secondary },
  textRed: { color: theme.colors.error },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.xxl,
  },
  settleButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    ...theme.shadows.small,
  },
  settleButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  requestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingVertical: 16,
    borderRadius: 16,
  },
  requestButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    ...theme.shadows.small,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionMain: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  transactionSub: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  amountGreen: { color: theme.colors.secondary },
  amountRed: { color: theme.colors.error },
  transactionStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    ...theme.shadows.small,
  },
  statCardDark: {
    backgroundColor: theme.colors.primary,
  },
  statCardLight: {
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconBoxLight: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.whiteAlpha60,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.white,
  },
  statLabelLight: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  statValueLight: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.fab,
  },
});
