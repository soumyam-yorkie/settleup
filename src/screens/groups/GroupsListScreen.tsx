import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Menu, Search, Plus, ChevronRight, Scissors, Home, UtensilsCrossed } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SegmentedControl } from '../../components/SegmentedControl';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';
import { formatCurrency, getBalanceDetails } from '../../utils/formatters';

const GROUP_ICONS = [Scissors, Home, UtensilsCrossed];

const MEMBER_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
];

const GROUP_ICON_COLORS = [
  theme.colors.primaryLight,
  theme.colors.secondary,
  theme.colors.tertiaryContainer,
];

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

type GroupTab = 'Active' | 'Settled' | 'Archived';

export const GroupsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<GroupTab>('Active');
  const tabs: GroupTab[] = ['Active', 'Settled', 'Archived'];
  const handleNavigate = (route: keyof RootStackParamList) => {
    navigation.navigate(route as any);
  };

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
            {MOCK_GROUP_DATA.map((group, index) => {
              const IconComponent = GROUP_ICONS[index % GROUP_ICONS.length];
              const iconColor = GROUP_ICON_COLORS[index % GROUP_ICON_COLORS.length];
              const balanceDetails = getBalanceDetails(group.balance);

              return (
                <Card
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
                  padding={20}
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
                      <Text style={[
                        styles.statusAmount,
                        { color: theme.colors[balanceDetails.color] }
                      ]}>
                        {group.balance === 0 ? balanceDetails.label : formatCurrency(group.balance)}
                      </Text>
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
    fontWeight: '700',
    fontSize: 14, // Adjusted for full text labels like "Settled"
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
