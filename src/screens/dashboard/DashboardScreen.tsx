import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film,
  Home,
  Briefcase,
  Zap,
  Receipt,
  Bell, 
  ArrowUp, 
  ArrowDown, 
  Plus 
} from 'lucide-react-native';

import { AddExpenseFAB } from '../../components/AddExpenseFAB';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { useAppContext } from '../../context/AppContext';
import { MainScreenNavigationProp } from '../../types/navigation';
import { theme } from '../../utils/theme';
import { calculateUserBalances } from '../../utils/balanceUtils';
import { Avatar } from '../../components/Avatar';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_ICONS: Record<string, any> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Home: Home,
  Office: Briefcase,
  Settlement: Receipt,
  Other: Zap,
  Default: Receipt,
};

export const DashboardScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { currentUser, groups, expenses } = useAppContext();

  const balances = useMemo(() => 
    calculateUserBalances(expenses, currentUser.id), 
  [expenses, currentUser.id]);

  const groupBalances = useMemo(() => {
    return groups.map((group) => {
      const groupExpenses = expenses.filter(e => e.groupId === group.id);
      const balanceByCurrency: Record<string, number> = {};
      
      groupExpenses.forEach((expense) => {
        const cur = expense.currency || group.currency || 'USD';
        const mySplit = expense.splits.find(s => s.userId === currentUser.id);
        const myAmount = mySplit ? mySplit.amount : 0;

        if (expense.paidBy === currentUser.id) {
          balanceByCurrency[cur] = (balanceByCurrency[cur] || 0) + (expense.amount - myAmount);
        } else if (mySplit) {
          balanceByCurrency[cur] = (balanceByCurrency[cur] || 0) - myAmount;
        }
      });

      const primaryBalance = balanceByCurrency[group.currency || 'USD'] || 0;
      const hasMultiCurrency = Object.keys(balanceByCurrency).length > 1;

      return {
        ...group,
        balance: primaryBalance,
        hasMultiCurrency,
      };
    });
  }, [groups, expenses, currentUser.id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.paddedSection}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Avatar uri={currentUser.avatarUrl} style={styles.avatar} />
              <Text style={styles.brandName}>SettleUp</Text>
            </View>
            <TouchableOpacity style={styles.notifButton}>
              <Bell size={22} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Hero Balance Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <View style={styles.heroContent}>
              <Text style={styles.heroLabel}>TOTAL BALANCE</Text>
              <Text style={styles.heroAmount}>${balances.totalBalance.toFixed(2)}</Text>

              <View style={styles.heroStatsRow}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>YOU ARE OWED</Text>
                  <View style={styles.heroStatValueRow}>
                    <ArrowUp size={14} color={theme.colors.secondaryContainer} />
                    <Text style={styles.heroStatValueGreen}>${balances.youAreOwed.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>YOU OWE</Text>
                  <View style={styles.heroStatValueRow}>
                    <ArrowDown size={14} color={theme.colors.tertiaryFixedDim} />
                    <Text style={styles.heroStatValueRed}>${balances.youOwe.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Active Groups Header */}
          <SectionHeader 
            title="Active Groups" 
            rightLabel="View All" 
            onRightPress={() => navigation.navigate('Groups')} 
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.groupsScroll}
          decelerationRate="fast"
          snapToInterval={180 + 16} // Card width + gap
          snapToAlignment="start"
        >
          {groupBalances.map((group) => (
            <Card
              key={group.id}
              style={styles.groupCardItem}
              onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
              variant="elevated"
              padding={16}
            >
              <View style={styles.groupCardHeader}>
                <Avatar 
                  uri={group.avatarUrl} 
                  style={styles.groupCardAvatar} 
                  type="group"
                  size={44}
                />
                <View style={styles.groupCardTitleContainer}>
                  <Text style={styles.groupCardName} numberOfLines={1}>{group.name}</Text>
                  <Text style={styles.groupCardCategory}>{group.category}</Text>
                </View>
              </View>

              <View style={styles.groupCardBalanceContainer}>
                <Text style={styles.balanceLabelSmall}>YOUR BALANCE</Text>
                <Text style={[
                  styles.groupCardAmount,
                  group.balance > 0 ? styles.amountGreen : group.balance < 0 ? styles.amountRed : styles.amountSettled
                ]}>
                  {group.balance === 0 && !group.hasMultiCurrency ? 'Settled' : formatCurrency(group.balance, group.currency)}
                </Text>
                {group.hasMultiCurrency && (
                  <Text style={styles.multiCurrencyText}>+ other currencies</Text>
                )}
              </View>
            </Card>
          ))}

          {/* Add Group */}
          <TouchableOpacity 
            style={styles.addGroupCardContainer}
            onPress={() => navigation.navigate('CreateGroup')}
            activeOpacity={0.95}
          >
            <View style={styles.addGroupIconBox}>
              <Plus size={24} color={theme.colors.outline} />
            </View>
            <Text style={styles.addGroupLabel}>New Group</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.paddedSection}>
          {/* Recent Activity */}
          <SectionHeader 
            title="Recent Activity" 
            rightLabel="See Trends" 
            onRightPress={() => {}} 
            style={{ marginTop: theme.spacing.xl }}
          />

          {expenses.map((expense) => {
            const isPaidByMe = expense.paidBy === currentUser.id;
            const IconComponent = CATEGORY_ICONS[expense.category || 'Default'] || CATEGORY_ICONS.Default;
            const groupName = groups.find(g => g.id === expense.groupId)?.name || 'Personal';
            
            return (
              <Card key={expense.id} variant="flat" style={styles.activityItem} padding={20}>
                <View style={styles.activityIcon}>
                  <IconComponent size={22} color={theme.colors.primary} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{expense.description}</Text>
                  <Text style={styles.activitySub}>
                    with <Text style={styles.activitySubBold}>{groupName}</Text>
                  </Text>
                </View>
                <View style={styles.activityRight}>
                  <Text style={[
                    styles.activityAmount,
                    isPaidByMe ? styles.amountGreen : styles.amountRed,
                  ]}>
                    ${expense.amount.toFixed(2)}
                  </Text>
                  <Text style={[
                    styles.activityStatus,
                    isPaidByMe ? styles.statusGreen : styles.statusRed,
                  ]}>
                    {isPaidByMe ? 'OWED TO YOU' : 'YOU OWE'}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      <AddExpenseFAB />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
  },
  paddedSection: {
    paddingHorizontal: theme.spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
  },
  brandName: {
    fontFamily: 'Manrope',
    fontWeight: '800',
    fontSize: 18,
    color: theme.colors.primary,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero Card
  heroCard: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.xxxl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
  heroGlow: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primaryAlpha30,
  },
  heroContent: {
    zIndex: 1,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.whiteAlpha70,
    marginBottom: 8,
  },
  heroAmount: {
    fontFamily: 'Manrope',
    fontWeight: '800',
    fontSize: 44,
    color: theme.colors.white,
    marginBottom: theme.spacing.xl,
    letterSpacing: -2,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroStat: {
    flex: 1,
    backgroundColor: theme.colors.whiteAlpha10,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
  },
  heroStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.whiteAlpha70,
    marginBottom: 6,
  },
  heroStatValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroStatValueGreen: {
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 18,
    color: theme.colors.secondaryContainer,
  },
  heroStatValueRed: {
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 18,
    color: theme.colors.tertiaryFixedDim,
  },

  // Group Cards (horizontal scroll)
  groupsScroll: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: 16,
  },
  groupCardItem: {
    width: 180,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  groupCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
  },
  groupCardTitleContainer: {
    flex: 1,
  },
  groupCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  groupCardCategory: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginTop: 1,
  },
  groupCardBalanceContainer: {
    marginTop: 'auto',
  },
  balanceLabelSmall: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  groupCardAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  amountSettled: {
    color: theme.colors.outline,
  },
  multiCurrencyText: {
    fontSize: 10,
    color: theme.colors.outline,
    marginTop: 2,
    fontWeight: '600',
  },

  addGroupCardContainer: {
    width: 100,
    height: 140,
    borderRadius: theme.borderRadius.xxl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  addGroupIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.outline,
    textAlign: 'center',
  },

  // Activity Items
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  activityInfo: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  activitySub: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  activitySubBold: {
    fontWeight: '600',
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 16,
  },
  amountGreen: {
    color: theme.colors.secondary,
  },
  amountRed: {
    color: theme.colors.error,
  },
  activityStatus: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statusGreen: {
    color: theme.colors.onSecondaryContainer,
    fontWeight: '700',
  },
  statusRed: {
    color: theme.colors.onErrorContainer,
    fontWeight: '700',
  },

  bottomPadding: {
    height: 40,
  },
});


