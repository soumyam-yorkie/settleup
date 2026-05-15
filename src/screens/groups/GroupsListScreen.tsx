import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Menu, Search, ChevronRight } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SegmentedControl } from '../../components/SegmentedControl';
import { useAppContext } from '../../context/AppContext';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';
import { formatCurrency, getBalanceDetails } from '../../utils/formatters';
import { Avatar } from '../../components/Avatar';

type GroupTab = 'Active' | 'Settled' | 'Archived';

export const GroupsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentUser, groups, expenses, friends } = useAppContext();
  const [activeTab, setActiveTab] = useState<GroupTab>('Active');
  const tabs: GroupTab[] = ['Active', 'Settled', 'Archived'];

  const handleNavigate = (route: keyof RootStackParamList) => {
    navigation.navigate(route as any);
  };

  const groupData = useMemo(() => {
    return groups.map((group) => {
      const groupExpenses = expenses.filter(e => e.groupId === group.id);
      
      // Calculate balance per currency
      const balanceByCurrency: Record<string, number> = {};
      groupExpenses.forEach((expense) => {
        const cur = expense.currency || group.currency;
        const mySplit = expense.splits.find(s => s.userId === currentUser.id);
        const myAmount = mySplit ? mySplit.amount : 0;

        if (expense.paidBy === currentUser.id) {
          balanceByCurrency[cur] = (balanceByCurrency[cur] || 0) + (expense.amount - myAmount);
        } else if (mySplit) {
          balanceByCurrency[cur] = (balanceByCurrency[cur] || 0) - myAmount;
        }
      });

      // Primary balance is in the group's current currency
      const primaryBalance = balanceByCurrency[group.currency] || 0;
      const hasMultiCurrency = Object.keys(balanceByCurrency).length > 1;
      
      return {
        ...group,
        balance: primaryBalance,
        balanceByCurrency,
        hasMultiCurrency,
        lastActivity: 'Active',
        memberCount: group.members.length,
      };
    });
  }, [groups, expenses, currentUser.id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Menu size={22} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Groups</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Search size={22} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <SegmentedControl
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        style={styles.tabContainer}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'Active' ? (
          <>
            {groupData.map((group) => {
              const balanceDetails = getBalanceDetails(group.balance);

              const groupMemberAvatars = group.members
                .map(id => friends.find(f => f.id === id)?.avatarUrl || (id === currentUser.id ? currentUser.avatarUrl : null))
                .filter(Boolean) as string[];

              return (
                <Card
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
                  padding={20}
                  activeOpacity={0.9}
                >
                  <View style={styles.groupCardTop}>
                    <Avatar uri={group.avatarUrl} style={styles.groupAvatar} type="group" />

                    <View style={styles.groupCardInfo}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <View style={styles.memberAvatars}>
                        {groupMemberAvatars.slice(0, 3).map((uri, i) => (
                          <Avatar
                            key={i}
                            uri={uri}
                            style={[styles.memberAvatar, i > 0 && styles.memberAvatarOverlap]}
                          />
                        ))}
                        {group.memberCount > 3 && (
                          <View style={[styles.memberAvatar, styles.memberCountBadge, styles.memberAvatarOverlap]}>
                            <Text style={styles.memberCountText}>+{group.memberCount - 3}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.groupCardRight}>
                      <Text style={styles.statusLabel}>STATUS</Text>
                      {group.balance === 0 && !group.hasMultiCurrency ? (
                        <Text style={[
                          styles.statusAmount,
                          { color: theme.colors[balanceDetails.color] }
                        ]}>
                          {balanceDetails.label}
                        </Text>
                      ) : (
                        <>
                          <Text style={[
                            styles.statusAmount,
                            { color: theme.colors[balanceDetails.color] }
                          ]}>
                            {formatCurrency(group.balance, group.currency)}
                          </Text>
                          {group.hasMultiCurrency && (
                            <Text style={styles.multiCurrencyHint}>+ other currencies</Text>
                          )}
                        </>
                      )}
                    </View>
                  </View>

                  <View style={styles.groupCardBottom}>
                    <Text style={styles.lastActivity}>{group.lastActivity}</Text>
                    <View style={styles.detailsButton}>
                      <Text style={styles.detailsText}>Details</Text>
                      <ChevronRight size={14} color={theme.colors.primary} />
                    </View>
                  </View>
                </Card>
              );
            })}

            {/* New Group CTA */}
            <Card variant="flat" style={styles.ctaCard} padding={theme.spacing.lg}>
              <Text style={styles.ctaTitle}>Start a new chapter.</Text>
              <Text style={styles.ctaSubtitle}>
                Track expenses together{'\n'}effortlessly with a new group.
              </Text>
              <Button 
                title="New Group" 
                variant="primary" 
                onPress={() => handleNavigate('CreateGroup')} 
                style={styles.ctaButton}
                textStyle={{ color: theme.colors.primary }}
              />
            </Card>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} groups found.</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: theme.colors.onSurface,
  },

  // Tabs
  tabContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
  },

  // Group Cards
  groupCard: {
    marginBottom: 16,
  },
  groupCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  groupCardInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 6,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  memberAvatarOverlap: {
    marginLeft: -8,
  },

  memberCountBadge: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  groupCardRight: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  statusAmount: {
    fontWeight: '700',
    fontSize: 14,
  },
  multiCurrencyHint: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.outline,
    marginTop: 2,
  },

  groupCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceContainerHigh,
  },
  lastActivity: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // CTA Card
  ctaCard: {
    backgroundColor: theme.colors.primaryContainer,
    marginTop: 8,
  },
  ctaTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: theme.colors.white,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: theme.colors.whiteAlpha70,
    lineHeight: 19,
    marginBottom: theme.spacing.md,
  },
  ctaButton: {
    backgroundColor: theme.colors.white,
    alignSelf: 'flex-start',
  },

  // Empty State
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
  },

  bottomPadding: {
    height: 40,
  },
});
