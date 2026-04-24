import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Receipt, Users, Plus, Filter } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { MOCK_EXPENSES, MOCK_USER } from '../../services/mockData';
import { theme } from '../../utils/theme';

export const GroupDetailScreen = ({ route }: any) => {
  const { groupId } = route.params;
  const groupExpenses = MOCK_EXPENSES.filter((e) => e.groupId === groupId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Card variant="elevated" style={styles.summaryCard} padding={theme.spacing.lg}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL EXPENSE</Text>
            <Text style={styles.summaryValue}>$240.00</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>YOUR BALANCE</Text>
            <Text style={[styles.summaryValue, styles.negativeValue]}>-$20.00</Text>
          </View>
        </Card>

        <View style={styles.actionRow}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Plus}
            title="Add Expense"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Users}
            title="Balances"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Filter}
            title="Filter"
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>
      </View>

      <FlatList
        data={groupExpenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<SectionHeader title="Expenses" style={styles.listHeader} />}
        renderItem={({ item }) => (
          <Card 
            style={styles.expenseItem} 
            padding={theme.spacing.md} 
            onPress={() => {}}
          >
            <View style={styles.expenseIcon}>
              <Receipt size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{item.description}</Text>
              <Text style={styles.expenseMeta}>
                Paid by {item.paidBy === MOCK_USER.id ? 'You' : 'Others'} • {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.expenseBalance}>
              <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
              <Text style={[styles.yourPart, item.paidBy === MOCK_USER.id ? styles.partPositive : styles.partNegative]}>
                {item.paidBy === MOCK_USER.id ? 'you lent $100' : 'you owe $30'}
              </Text>
            </View>
          </Card>
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
    marginBottom: theme.spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.whiteAlpha60,
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
    backgroundColor: theme.colors.whiteAlpha15,
    marginHorizontal: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  listHeader: {
    marginBottom: theme.spacing.md,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
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

