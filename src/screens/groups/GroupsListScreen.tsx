import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Menu, Search, Plus, ChevronRight, Scissors, Home, UtensilsCrossed } from 'lucide-react-native';

import { theme } from '../../utils/theme';
import { RootStackParamList } from '../../types/navigation';

const GROUP_ICONS = [Scissors, Home, UtensilsCrossed];

const MEMBER_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
];

const GROUP_ICON_COLORS = ['#5654A8', '#006C49', '#820024'];

const MOCK_GROUP_DATA = [
  {
    id: 'g1',
    name: 'Summer Trip 2024',
    balance: 120.50,
    lastActivity: 'Last activity 2h ago',
    memberCount: 5,
  },
  {
    id: 'g2',
    name: 'Apartment\nExpenses',
    balance: -42.00,
    lastActivity: 'Rent due in 3 days',
    memberCount: 2,
  },
  {
    id: 'g3',
    name: 'Weekly Dinner',
    balance: 0,
    lastActivity: 'Last dinner last Friday',
    memberCount: 8,
  },
];

export const GroupsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'Active' | 'Settled' | 'Archived'>('Active');
  const tabs: ('Active' | 'Settled' | 'Archived')[] = ['Active', 'Settled', 'Archived'];

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
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'Active' ? (
          <>
            {MOCK_GROUP_DATA.map((group, index) => {
              const IconComponent = GROUP_ICONS[index % GROUP_ICONS.length];
              const iconColor = GROUP_ICON_COLORS[index % GROUP_ICON_COLORS.length];
              const isPositive = group.balance > 0;
              const isNeutral = group.balance === 0;

              return (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
                >
                  <View style={styles.groupCardTop}>
                    <View style={[styles.groupIconCircle, { backgroundColor: iconColor + '18' }]}>
                      <IconComponent size={22} color={iconColor} />
                    </View>

                    <View style={styles.groupCardInfo}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      <View style={styles.memberAvatars}>
                        {MEMBER_AVATARS.slice(0, Math.min(3, group.memberCount)).map((uri, i) => (
                          <Image
                            key={i}
                            source={{ uri }}
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
                      {isNeutral ? (
                        <Text style={styles.statusNeutral}>n</Text>
                      ) : (
                        <Text style={[
                          styles.statusAmount,
                          isPositive ? styles.statusPositive : styles.statusNegative,
                        ]}>
                          {isPositive ? '+' : '-'}${Math.abs(group.balance).toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.groupCardBottom}>
                    <Text style={styles.lastActivity}>{group.lastActivity}</Text>
                    <TouchableOpacity style={styles.detailsButton}>
                      <Text style={styles.detailsText}>Details</Text>
                      <ChevronRight size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* New Group CTA */}
            <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Start a new chapter.</Text>
              <Text style={styles.ctaSubtitle}>
                Track expenses together{'\n'}effortlessly with a new group.
              </Text>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>New Group</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} groups found.</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Plus color={theme.colors.white} size={28} />
      </TouchableOpacity>
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
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 20,
    color: theme.colors.onSurface,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.round,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.round,
  },
  activeTab: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  activeTabText: {
    color: theme.colors.onSurface,
    fontWeight: '700',
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
  },

  // Group Cards
  groupCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.xxl,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  groupCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  groupIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 16,
  },
  statusPositive: {
    color: theme.colors.secondary,
  },
  statusNegative: {
    color: theme.colors.error,
  },
  statusNeutral: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
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
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    marginTop: 8,
  },
  ctaTitle: {
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 20,
    color: theme.colors.white,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 19,
    marginBottom: theme.spacing.md,
  },
  ctaButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.round,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
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

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.fab,
  },

  bottomPadding: {
    height: 40,
  },
});
