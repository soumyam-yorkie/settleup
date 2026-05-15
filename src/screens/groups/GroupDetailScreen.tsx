import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SectionList, 
  TouchableOpacity, 
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film,
  Home,
  Briefcase,
  Zap,
  Receipt,
  ArrowLeft,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Trash2,
  LogOut,
  Edit3,
  Users,
  Plane
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SegmentedControl } from '../../components/SegmentedControl';
import { BottomPickerModal } from '../../components/BottomPickerModal';
import { GroupSettingsTab } from './GroupSettingsTab';
import { useAppContext } from '../../context/AppContext';
import { theme } from '../../utils/theme';
import { formatCurrency } from '../../utils/formatters';
import { Avatar } from '../../components/Avatar';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { simplifyDebts, SimplifiedDebt } from '../../utils/debtSimplifier';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;
type ActiveTab = 'Expenses' | 'Balances' | 'Settings';

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

export const GroupDetailScreen = ({ route }: Props) => {
  const navigation = useNavigation();
  const { groupId } = route.params;
  const [activeTab, setActiveTab] = useState<ActiveTab>('Expenses');
  const [isMoreMenuVisible, setIsMoreMenuVisible] = useState(false);
  const { currentUser, groups, expenses, friends, leaveGroup, deleteGroup } = useAppContext();

  const groupInfo = useMemo(() => 
    groups.find(g => g.id === groupId),
  [groupId, groups]);

  // Navigate back automatically when group is deleted or current user leaves
  useEffect(() => {
    if (!groupInfo) {
      navigation.goBack();
    }
  }, [groupInfo, navigation]);

  const groupExpenses = useMemo(() => 
    expenses.filter((e) => e.groupId === groupId),
  [groupId, expenses]);

  const memberBalances = useMemo(() => {
    if (!groupInfo) return [];
    
    return groupInfo.members.map(memberId => {
      const friend = friends.find(f => f.id === memberId) || (memberId === currentUser.id ? currentUser : null);
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
  }, [groupInfo, groupExpenses, friends, currentUser]);

  const { spendByCurrency, balanceByCurrency } = useMemo(() => {
    const spend: Record<string, number> = {};
    const balance: Record<string, number> = {};

    groupExpenses.forEach(expense => {
      const cur = expense.currency || groupInfo?.currency || 'USD';
      spend[cur] = (spend[cur] || 0) + expense.amount;
      
      const mySplit = expense.splits.find(s => s.userId === currentUser.id);
      if (expense.paidBy === currentUser.id) {
        balance[cur] = (balance[cur] || 0) + (expense.amount - (mySplit?.amount || 0));
      } else if (mySplit) {
        balance[cur] = (balance[cur] || 0) - mySplit.amount;
      }
    });

    return { spendByCurrency: spend, balanceByCurrency: balance };
  }, [groupExpenses, currentUser.id, groupInfo?.currency]);

  const currencyKeys = useMemo(() => {
    const allKeys = new Set([...Object.keys(spendByCurrency), ...Object.keys(balanceByCurrency)]);
    // Group's current currency first, then alphabetical
    const groupCur = groupInfo?.currency || 'USD';
    return [groupCur, ...Array.from(allKeys).filter(k => k !== groupCur).sort()];
  }, [spendByCurrency, balanceByCurrency, groupInfo?.currency]);




  const renderExpenseItem = ({ item }: { item: typeof expenses[0] }) => {
    // FIX: Using category for icon lookup instead of description
    const Icon = CATEGORY_ICONS[item.category || 'Default'] || CATEGORY_ICONS.Default;
    const mySplit = item.splits.find(s => s.userId === currentUser.id);
    const isPaidByMe = item.paidBy === currentUser.id;
    const payer = friends.find(f => f.id === item.paidBy) || (item.paidBy === currentUser.id ? currentUser : { name: 'Unknown' });
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
            Paid by {isPaidByMe ? 'You' : payer.name.split(' ')[0]} • {item.date}
          </Text>
        </View>
        
        <View style={styles.expenseAmountContainer}>
          <Text style={styles.expenseTotalAmount}>{formatCurrency(item.amount, item.currency)}</Text>
          <Text style={[
            styles.expenseYourStatus,
            isLent ? styles.statusLent : styles.statusOwe
          ]}>
            {isLent ? `You lent ${formatCurrency(amountToDisplay, item.currency)}` : `You owe ${formatCurrency(amountToDisplay, item.currency)}`}
          </Text>
        </View>
      </Card>
    );
  };

  const simplifiedDebts = useMemo(() => {
    return simplifyDebts(memberBalances);
  }, [memberBalances]);

  const renderDebtItem = ({ item }: { item: SimplifiedDebt }) => {
    const fromUser = friends.find(f => f.id === item.fromId) || (item.fromId === currentUser.id ? currentUser : { name: 'Unknown', avatarUrl: '' });
    const toUser = friends.find(f => f.id === item.toId) || (item.toId === currentUser.id ? currentUser : { name: 'Unknown', avatarUrl: '' });
    
    const isFromMe = item.fromId === currentUser.id;
    const isToMe = item.toId === currentUser.id;
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
              <Avatar uri={(otherUser as any).avatarUrl} style={styles.actionAvatar} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionStatusText}>{statusText}</Text>
                <Text style={[styles.actionAmount, { color: accentColor }]}>{formatCurrency(item.amount, groupInfo?.currency)}</Text>
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
          <Avatar uri={(fromUser as any).avatarUrl} style={styles.otherDebtAvatar} />
          <Text style={styles.otherDebtText}>
            <Text style={styles.bold}>{fromUser.name.split(' ')[0]}</Text> owes <Text style={styles.bold}>{toUser.name.split(' ')[0]}</Text>
          </Text>
          <Text style={styles.otherDebtAmount}>{formatCurrency(item.amount, groupInfo?.currency)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const debtSections = useMemo(() => {
    const personal = simplifiedDebts.filter(d => d.fromId === currentUser.id || d.toId === currentUser.id);
    const others = simplifiedDebts.filter(d => d.fromId !== currentUser.id && d.toId !== currentUser.id);
    
    const sections: { title: string; icon: string; data: SimplifiedDebt[] }[] = [];
    if (personal.length > 0) {
      sections.push({ title: 'YOUR ACTIONS', icon: 'zap', data: personal });
    }
    if (others.length > 0) {
      sections.push({ title: 'BETWEEN OTHERS', icon: 'users', data: others });
    }
    return sections;
  }, [simplifiedDebts, currentUser.id]);

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

  const renderListHeader = () => {
    const members = groupInfo?.members.map(id => friends.find(f => f.id === id) || (id === currentUser.id ? currentUser : null)).filter(Boolean) || [];
    
    return (
      <View style={styles.scrollContent}>
        {/* Top Overview Card */}
        <Card variant="elevated" style={styles.overviewCard} padding={0}>
          <View style={styles.overviewCardContent}>
            <View style={styles.overviewTopRow}>
              <View style={styles.groupIconBox}>
                <Avatar uri={groupInfo?.avatarUrl} style={styles.headerGroupAvatar} type="group" />
              </View>
              <View style={styles.memberAvatarStack}>
                {members.slice(0, 3).map((m, i) => (
                  <Avatar 
                    key={m?.id}
                    uri={m?.avatarUrl}
                    style={[styles.stackAvatar, i !== 0 && styles.stackAvatarOverlap]}
                  />
                ))}
                {members.length > 3 && (
                  <View style={[styles.stackAvatar, styles.stackMore]}>
                    <Text style={styles.stackMoreText}>+{members.length - 3}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.overviewTitleSection}>
              <Text style={styles.groupTitle}>{groupInfo?.name || 'Group Details'}</Text>
              <Text style={styles.groupSubtitle}>Active shared ledger</Text>
            </View>

            <View style={styles.overviewBalanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>TOTAL GROUP SPEND</Text>
                {currencyKeys.map(cur => {
                  const val = spendByCurrency[cur];
                  if (!val) return null;
                  return (
                    <Text key={`spend-${cur}`} style={styles.balanceValue}>
                      {formatCurrency(val, cur)}
                    </Text>
                  );
                })}
                {Object.keys(spendByCurrency).length === 0 && (
                  <Text style={styles.balanceValue}>
                    {formatCurrency(0, groupInfo?.currency)}
                  </Text>
                )}
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
                {currencyKeys.map(cur => {
                  const val = balanceByCurrency[cur];
                  if (val === undefined || val === 0) return null;
                  return (
                    <Text 
                      key={`bal-${cur}`}
                      style={[
                        styles.balanceValue, 
                        val >= 0 ? styles.balancePositive : styles.balanceNegative
                      ]}
                    >
                      {formatCurrency(val, cur)}
                    </Text>
                  );
                })}
                {Object.keys(balanceByCurrency).every(k => (balanceByCurrency[k] || 0) === 0) && (
                  <Text style={styles.balanceValue}>
                    {formatCurrency(0, groupInfo?.currency)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Card>

      {/* Tabs */}
      <View style={[
        styles.tabContainer, 
        { marginBottom: theme.spacing.lg }
      ]}>
        <SegmentedControl
          tabs={['Expenses', 'Balances', 'Settings']}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as ActiveTab)}
        />
      </View>
    </View>
    );
  };

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
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => setIsMoreMenuVisible(true)}
        >
          <MoreVertical color={theme.colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Shared Header Content */}
      {renderListHeader()}

      {/* Expenses Tab — FlatList */}
      {activeTab === 'Expenses' && (
        groupExpenses.length > 0 ? (
          <FlatList
            style={styles.flex1}
            data={groupExpenses}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={renderExpenseItem}
            ListFooterComponent={<View style={styles.bottomSpacer} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Receipt size={40} color={theme.colors.outline} />
            </View>
            <Text style={styles.emptyStateText}>No expenses yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add your first expense!
            </Text>
          </View>
        )
      )}

      {/* Balances Tab — SectionList */}
      {activeTab === 'Balances' && (
        debtSections.length > 0 ? (
          <SectionList
            style={styles.flex1}
            sections={debtSections}
            keyExtractor={(_, index) => `debt-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderSectionHeader={renderSectionHeader as any}
            renderItem={({ item }) => renderDebtItem({ item })}
            ListFooterComponent={<View style={styles.bottomSpacer} />}
            stickySectionHeadersEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Users size={40} color={theme.colors.outline} />
            </View>
            <Text style={styles.emptyStateText}>Everyone is settled up! 🎉</Text>
            <Text style={styles.emptyStateSubtext}>
              No active debts in this group at the moment.
            </Text>
          </View>
        )
      )}

      {/* Settings Tab */}
      {activeTab === 'Settings' && groupInfo && (
        <GroupSettingsTab groupInfo={groupInfo} />
      )}
      {activeTab === 'Settings' && !groupInfo && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Search size={40} color={theme.colors.outline} />
          </View>
          <Text style={styles.emptyStateText}>Group not found</Text>
          <Text style={styles.emptyStateSubtext}>
            We couldn't find the details for this group. It may have been deleted.
          </Text>
        </View>
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => (navigation as any).navigate('AddExpense', { groupId })}
        activeOpacity={0.8}
      >
        <Plus color={theme.colors.white} size={28} />
      </TouchableOpacity>

      {/* More Options Menu */}
      <BottomPickerModal
        visible={isMoreMenuVisible}
        title="Group Options"
        selectedValue=""
        onClose={() => setIsMoreMenuVisible(false)}
        onSelect={(value) => {
          setIsMoreMenuVisible(false);
          switch (value) {
            case 'settings':
              setActiveTab('Settings');
              break;
            case 'edit':
              // Navigation to edit screen would go here
              break;
            case 'leave':
              if (groupInfo) leaveGroup(groupInfo.id);
              break;
            case 'delete':
              if (groupInfo) deleteGroup(groupInfo.id);
              break;
          }
        }}
        options={[
          { label: 'View Settings', value: 'settings', icon: <Settings size={20} color={theme.colors.onSurfaceVariant} /> },
          { label: 'Edit Group', value: 'edit', icon: <Edit3 size={20} color={theme.colors.onSurfaceVariant} /> },
          { label: 'Leave Group', value: 'leave', icon: <LogOut size={20} color={theme.colors.danger} /> },
          { label: 'Delete Group', value: 'delete', icon: <Trash2 size={20} color={theme.colors.danger} /> },
        ]}
      />
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
    overflow: 'hidden',
  },
  headerGroupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  stackAvatarOverlap: {
    marginLeft: -12,
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
    color: theme.colors.whiteAlpha60,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
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
    color: theme.colors.tertiaryFixedDim,
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
    borderRadius: theme.borderRadius.xxl,
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
    borderRadius: theme.borderRadius.xl,
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
    borderRadius: theme.borderRadius.xxl,
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
    borderRadius: theme.borderRadius.xl,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 120, // Shift up to center visually in the remaining area
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: theme.colors.outline,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
  bottomSpacer: {
    height: 100,
  },
});
