import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../utils/theme';
import { MOCK_EXPENSES } from '../../services/mockData';
import { Receipt, Users, Plus, Filter } from 'lucide-react-native';

export const GroupDetailScreen = ({ route }: any) => {
  const { groupId } = route.params;
  const groupExpenses = MOCK_EXPENSES.filter((e) => e.groupId === groupId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL EXPENSE</Text>
            <Text style={styles.summaryValue}>$240.00</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>YOUR BALANCE</Text>
            <Text style={[styles.summaryValue, styles.negativeValue]}>-$20.00</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={18} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Users size={18} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Balances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={18} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={groupExpenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.listTitle}>Expenses</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.expenseItem}>
            <View style={styles.expenseIcon}>
              <Receipt size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{item.description}</Text>
              <Text style={styles.expenseMeta}>
                Paid by {item.paidBy === 'u1' ? 'You' : 'Others'} • {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.expenseBalance}>
              <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
              <Text style={[styles.yourPart, item.paidBy === 'u1' ? styles.partPositive : styles.partNegative]}>
                {item.paidBy === 'u1' ? 'you lent $100' : 'you owe $30'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.white,
  },
  negativeValue: {
    color: theme.colors.tertiaryFixedDim,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  listTitle: {
    fontFamily: 'Manrope',
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xxl,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  expenseMeta: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  expenseBalance: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontFamily: 'Manrope',
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  yourPart: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  partPositive: {
    color: theme.colors.secondary,
  },
  partNegative: {
    color: theme.colors.error,
  },
});
