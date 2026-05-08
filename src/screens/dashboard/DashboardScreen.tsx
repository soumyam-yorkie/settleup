import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, ArrowUp, ArrowDown, ShoppingBag, Fuel, Ticket } from 'lucide-react-native';

import { AddExpenseFAB } from '../../components/AddExpenseFAB';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { MOCK_GROUPS, MOCK_EXPENSES, MOCK_USER } from '../../services/mockData';
import { MainScreenNavigationProp } from '../../types/navigation';
import { theme } from '../../utils/theme';

const GROUP_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80',
];

const ACTIVITY_ICONS = [ShoppingBag, Fuel, Ticket];

export const DashboardScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: MOCK_USER.avatarUrl ?? '' }}
              style={styles.avatar}
            />
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
            <Text style={styles.heroAmount}>$2,840.00</Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>YOU ARE OWED</Text>
                <View style={styles.heroStatValueRow}>
                  <ArrowUp size={14} color={theme.colors.secondaryContainer} />
                  <Text style={styles.heroStatValueGreen}>$4,120.50</Text>
                </View>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>YOU OWE</Text>
                <View style={styles.heroStatValueRow}>
                  <ArrowDown size={14} color={theme.colors.tertiaryFixedDim} />
                  <Text style={styles.heroStatValueRed}>$1,280.50</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Active Groups */}
        <SectionHeader 
          title="Active Groups" 
          rightLabel="View All" 
          onRightPress={() => navigation.navigate('Groups')} 
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.groupsScroll}
        >
          {MOCK_GROUPS.map((group, index) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
            >
              <View style={styles.groupImageContainer}>
                <Image
                  source={{ uri: GROUP_IMAGES[index % GROUP_IMAGES.length] }}
                  style={styles.groupImage}
                />
                <View style={styles.groupImageOverlay} />
              </View>
              <Text style={styles.groupName}>{group.name}</Text>
            </TouchableOpacity>
          ))}

          {/* Add Group */}
          <TouchableOpacity style={styles.groupCard}>
            <View style={styles.addGroupCard}>
              <Text style={styles.addGroupIcon}>+</Text>
            </View>
            <Text style={styles.addGroupLabel}>New Group</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recent Activity */}
        <SectionHeader 
          title="Recent Activity" 
          rightLabel="See Trends" 
          onRightPress={() => {}} 
          style={{ marginTop: theme.spacing.xl }}
        />

        {MOCK_EXPENSES.map((expense, index) => {
          const isPaidByMe = expense.paidBy === MOCK_USER.id;
          const IconComponent = ACTIVITY_ICONS[index % ACTIVITY_ICONS.length];
          
          return (
            <Card key={expense.id} variant="flat" style={styles.activityItem} padding={20}>
              <View style={styles.activityIcon}>
                <IconComponent size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{expense.description}</Text>
                <Text style={styles.activitySub}>
                  with <Text style={styles.activitySubBold}>Roommates</Text>
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

        <View style={styles.bottomPadding} />
      </ScrollView>
      <AddExpenseFAB onPress={handleAddExpense} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 120,
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
    paddingBottom: theme.spacing.md,
    gap: 16,
  },
  groupCard: {
    width: 120,
    alignItems: 'center',
  },
  groupImageContainer: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.xxxl,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  groupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  groupImageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.primaryAlpha20,
  },
  groupName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  addGroupCard: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.xxxl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  addGroupIcon: {
    fontSize: 32,
    color: theme.colors.outline,
  },
  addGroupLabel: {
    fontSize: 13,
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
  },
  statusRed: {
    color: theme.colors.onErrorContainer,
  },

  bottomPadding: {
    height: 40,
  },
});
