import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SectionList, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  ArrowLeft, 
  MoreVertical, 
  Receipt, 
  Plus, 
  Wallet,
  Plane,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Users
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SegmentedControl } from '../../components/SegmentedControl';
import { GroupSettingsTab } from './GroupSettingsTab';
import { MOCK_EXPENSES, MOCK_USER, MOCK_FRIENDS, MOCK_GROUPS } from '../../services/mockData';
import { theme } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { simplifyDebts, SimplifiedDebt } from '../../utils/debtSimplifier';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;
type ActiveTab = 'Expenses' | 'Balances' | 'Settings';

const CATEGORY_ICONS: Record<string, any> = {
  Groceries: ShoppingBag,
  Dinner: Utensils,
  Gas: Car,
  Trip: Plane,
  Default: Receipt,
};

export const GroupDetailScreen = ({ route }: Props) => {
  const navigation = useNavigation();
  const { groupId } = route.params;
  const [activeTab, setActiveTab] = useState<ActiveTab>('Expenses');

  const groupExpenses = useMemo(() => 
    MOCK_EXPENSES.filter((e) => e.groupId === groupId),
  [groupId]);

  const groupInfo = useMemo(() => 
    MOCK_GROUPS.find(g => g.id === groupId),
  [groupId]);

  const memberBalances = useMemo(() => {
    if (!groupInfo) return [];
    
    return groupInfo.members.map(memberId => {
      const friend = MOCK_FRIENDS.find(f => f.id === memberId) || (memberId === MOCK_USER.id ? MOCK_USER : null);
      if (!friend) return null;
      
      let balance = 0;
      groupExpenses.forEach(expense => {
        const split = expense.splits.find(s => s.userId === memberId);
        if (expense.paidBy === memberId) {
          balance += (expense.amount - (split?.amount || 0));
        } else if (split) {
          balance -= split.amount;
        }
      });
      
      return {
        id: memberId,
        name: friend.name,
        avatarUrl: friend.avatarUrl,
        balance
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [groupInfo, groupExpenses]);

  const { totalSpend, yourBalance } = useMemo(() => {
    let spend = 0;
    let balance = 0;

    groupExpenses.forEach(expense => {
      spend += expense.amount;
      
      const mySplit = expense.splits.find(s => s.userId === MOCK_USER.id);
      if (expense.paidBy === MOCK_USER.id) {
        // I paid, others owe me (total - my share)
        balance += (expense.amount - (mySplit?.amount || 0));
      } else if (mySplit) {
        // Someone else paid, I owe my share
        balance -= mySplit.amount;
      }
    });

    return { totalSpend: spend, yourBalance: balance };
  }, [groupExpenses]);

  // Mock settlement progress for UI demonstration
  const settlementProgress = 65; 

  const renderExpenseItem = ({ item }: { item: typeof MOCK_EXPENSES[0] }) => {
    // FIX: Using category for icon lookup instead of description
    const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Default;
    const mySplit = item.splits.find(s => s.userId === MOCK_USER.id);
    const isPaidByMe = item.paidBy === MOCK_USER.id;
    const isLent = isPaidByMe;
    const amountToDisplay = isPaidByMe 
      ? (item.amount - (mySplit?.amount || 0)) 
      : (mySplit?.amount || 0);

    return (
      <Card 
        style={styles.expenseCard} 
        padding={theme.spacing.md}
        onPress={() => {}}
      >
        <View style={styles.expenseIconContainer}>
          <Icon size={22} color={theme.colors.onSurfaceVariant} />
        </View>
        
        <View style={styles.expenseMainInfo}>
          <Text style={styles.expenseTitle}>{item.description}</Text>
          <Text style={styles.expenseSubtitle}>
            Paid by {isPaidByMe ? 'You' : 'Alex'} • Yesterday
          </Text>
        </View>
        
        <View style={styles.expenseAmountContainer}>
          <Text style={styles.expenseTotalAmount}>{formatCurrency(item.amount)}</Text>
          <Text style={[
            styles.expenseYourStatus,
            isLent ? styles.statusLent : styles.statusOwe
          ]}>
            {isLent ? `You lent ${formatCurrency(amountToDisplay)}` : `You owe ${formatCurrency(amountToDisplay)}`}
          </Text>
        </View>
      </Card>
    );
  };

  const simplifiedDebts = useMemo(() => {
    return simplifyDebts(memberBalances);
  }, [memberBalances]);

  const renderDebtItem = ({ item }: { item: SimplifiedDebt }) => {
    const fromUser = MOCK_FRIENDS.find(f => f.id === item.fromId) || (item.fromId === MOCK_USER.id ? MOCK_USER : { name: 'Unknown', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' });
    const toUser = MOCK_FRIENDS.find(f => f.id === item.toId) || (item.toId === MOCK_USER.id ? MOCK_USER : { name: 'Unknown', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' });
    
    const isFromMe = item.fromId === MOCK_USER.id;
    const isToMe = item.toId === MOCK_USER.id;
    const isPersonal = isFromMe || isToMe;

    if (isPersonal) {
      const otherUser = isFromMe ? toUser : fromUser;
      const statusText = isFromMe ? `You owe ${otherUser.name.split(' ')[0]}` : `${otherUser.name.split(' ')[0]} owes you`;
      const accentColor = isFromMe ? theme.colors.danger : theme.colors.secondary;

      return (
        <View style={styles.actionCardWrapper} key={`debt-${item.fromId}-${item.toId}`}>
          {/* Gradient Accent Bar */}
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <View style={styles.actionCardInner}>
            <TouchableOpacity 
              style={styles.actionHeader}
              onPress={() => navigation.navigate('FriendDetail' as never, { friendId: otherUser.id } as never)}
            >
              <Image source={{ uri: (otherUser as any).avatarUrl }} style={styles.actionAvatar} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionStatusText}>{statusText}</Text>
                <Text style={[styles.actionAmount, { color: accentColor }]}>{formatCurrency(item.amount)}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.actionButtonsRow}>
              {isFromMe ? (
                <Button 
                  title="Settle Up" 
                  variant="primary" 
                  size="sm" 
                  onPress={() => {}} 
                  style={styles.flex1}
                />
              ) : (
                <>
                  <Button 
                    title="Remind" 
                    variant="outline" 
                    size="sm" 
                    onPress={() => {}} 
                    style={styles.flex1}
                  />
                  <View style={{ width: theme.spacing.md }} />
                  <Button 
                    title="Settle" 
                    variant="secondary" 
                    size="sm" 
                    onPress={() => {}} 
                    style={styles.flex1}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      );
    }

    // Row for others — with subtle accent bar
    return (
      <TouchableOpacity 
        key={`debt-${item.fromId}-${item.toId}`}
        style={styles.otherDebtCardWrapper}
        onPress={() => navigation.navigate('FriendDetail' as never, { friendId: fromUser.id } as never)}
      >
        <View style={[styles.accentBarSmall, { backgroundColor: theme.colors.outline }]} />
        <View style={styles.otherDebtInner}>
          <Image source={{ uri: (fromUser as any).avatarUrl }} style={styles.otherDebtAvatar} />
          <Text style={styles.otherDebtText}>
            <Text style={styles.bold}>{fromUser.name.split(' ')[0]}</Text> owes <Text style={styles.bold}>{toUser.name.split(' ')[0]}</Text>
          </Text>
          <Text style={styles.otherDebtAmount}>{formatCurrency(item.amount)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const debtSections = useMemo(() => {
    const personal = simplifiedDebts.filter(d => d.fromId === MOCK_USER.id || d.toId === MOCK_USER.id);
    const others = simplifiedDebts.filter(d => d.fromId !== MOCK_USER.id && d.toId !== MOCK_USER.id);
    
    const sections: { title: string; icon: string; data: SimplifiedDebt[] }[] = [];
    if (personal.length > 0) {
      sections.push({ title: 'YOUR ACTIONS', icon: 'zap', data: personal });
    }
    if (others.length > 0) {
      sections.push({ title: 'BETWEEN OTHERS', icon: 'users', data: others });
    }
    return sections;
  }, [simplifiedDebts]);

  const renderSectionHeader = ({ section }: { section: { title: string; icon: string } }) => (
    <View style={styles.sectionHeaderRow}>
      {section.icon === 'zap' ? (
        <Zap size={14} color={theme.colors.primary} />
      ) : (
        <Users size={14} color={theme.colors.outline} />
      )}
      <Text style={[
        styles.sectionHeaderText,
        section.icon === 'zap' && styles.sectionHeaderPrimary
      ]}>
        {section.title}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.scrollContent}>
      {/* Top Overview Card */}
      <Card variant="elevated" style={styles.overviewCard} padding={0}>
        <View style={styles.overviewCardContent}>
          <View style={styles.overviewTopRow}>
            <View style={styles.groupIconBox}>
              <Plane color={theme.colors.white} size={24} />
            </View>
            <View style={styles.memberAvatarStack}>
              {MOCK_FRIENDS.slice(0, 3).map((friend, i) => (
                <Image 
                  key={friend.id}
                  source={{ uri: friend.avatarUrl }}
                  style={[styles.stackAvatar, { marginLeft: i === 0 ? 0 : -12 }]}
                />
              ))}
              <View style={[styles.stackAvatar, styles.stackMore]}>
                <Text style={styles.stackMoreText}>+5</Text>
              </View>
            </View>
          </View>

          <View style={styles.overviewTitleSection}>
            <Text style={styles.groupTitle}>{groupInfo?.name || 'Group Details'}</Text>
            <Text style={styles.groupSubtitle}>Active shared ledger</Text>
          </View>

          <View style={styles.overviewBalanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>TOTAL GROUP SPEND</Text>
              <Text style={styles.balanceValue}>
                {formatCurrency(totalSpend)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
              <Text style={[
                styles.balanceValue, 
                yourBalance >= 0 ? styles.balancePositive : styles.balanceNegative
              ]}>
                {formatCurrency(yourBalance)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Tabs */}
      <View style={{...styles.tabContainer, marginBottom: activeTab === 'Balances' ? theme.spacing.lg : theme.spacing.xl}}>
        <SegmentedControl
          tabs={['Expenses', 'Balances', 'Settings']}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as ActiveTab)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color={theme.colors.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{groupInfo?.name || 'Group Details'}</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MoreVertical color={theme.colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Shared Header Content */}
      {renderListHeader()}

      {/* Expenses Tab — FlatList */}
      {activeTab === 'Expenses' && (
        <FlatList
          data={groupExpenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={renderExpenseItem}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      {/* Balances Tab — SectionList */}
      {activeTab === 'Balances' && (
        debtSections.length > 0 ? (
          <SectionList
            sections={debtSections}
            keyExtractor={(_, index) => `debt-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderSectionHeader={renderSectionHeader as any}
            renderItem={({ item }) => renderDebtItem({ item })}
            ListFooterComponent={<View style={{ height: 100 }} />}
            stickySectionHeadersEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Everyone is settled up! 🎉</Text>
          </View>
        )
      )}

      {/* Settings Tab */}
      {activeTab === 'Settings' && groupInfo && (
        <GroupSettingsTab groupInfo={groupInfo} />
      )}
      {activeTab === 'Settings' && !groupInfo && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Group not found.</Text>
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => (navigation as any).navigate('AddExpense')}
        activeOpacity={0.8}
      >
        <Plus color={theme.colors.white} size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },

  // Overview Card
  overviewCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 32,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  overviewCardContent: {
    padding: 24,
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  groupIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  stackMore: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  stackMoreText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  overviewTitleSection: {
    marginBottom: 28,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: 4,
  },
  groupSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  overviewBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.white,
  },
  balancePositive: {
    color: theme.colors.secondaryContainer,
  },
  balanceNegative: {
    color: '#FFB2B7',
  },

  // Progress Section
  progressSection: {
    marginBottom: theme.spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 1,
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },

  // Tabs
  tabContainer: {
    marginBottom: theme.spacing.xl,
  },

  // Expense Card
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  expenseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  expenseMainInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  expenseSubtitle: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  expenseYourStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusLent: {
    color: theme.colors.secondary,
  },
  statusOwe: {
    color: theme.colors.danger,
  },

  // Balances Tab Specific Styles
  balancesSummary: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  balanceSummaryText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  bold: {
    fontWeight: '700',
  },

  // Actionable Debt Card with Accent Bar
  actionCardWrapper: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.small,
  },
  accentBar: {
    width: 5,
  },
  actionCardInner: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  actionAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionStatusText: {
    fontSize: 13,
    color: theme.colors.outline,
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionAmount: {
    fontSize: 24,
    fontWeight: '800',
  },
  actionButtonsRow: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },

  // Other Debt Rows with Accent Bar
  otherDebtCardWrapper: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  accentBarSmall: {
    width: 3,
  },
  otherDebtInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  otherDebtAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  otherDebtText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  otherDebtAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 1.2,
  },
  sectionHeaderPrimary: {
    color: theme.colors.primary,
  },

  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    color: theme.colors.outline,
    fontSize: 16,
  },

  // FAB
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
    ...theme.shadows.medium,
  },
});
