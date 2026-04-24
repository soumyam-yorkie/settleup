import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Info, DollarSign } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { theme } from '../../utils/theme';

type SplitType = 'Equally' | 'Unequally' | 'Percentages';

export const AddExpenseScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('Equally');
  const splitOptions: SplitType[] = ['Equally', 'Unequally', 'Percentages'];

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.amountSection}>
          <Text style={styles.label}>Settling with friends or group</Text>
          <View style={styles.amountInputContainer}>
            <DollarSign size={32} color={theme.colors.onSurface} />
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={theme.colors.outlineVariant}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Info size={20} color={theme.colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter a description"
              placeholderTextColor={theme.colors.outline}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.selectorRow}>
            <Users size={20} color={theme.colors.outline} style={styles.inputIcon} />
            <Text style={styles.selectorText}>Split with you and everyone</Text>
          </View>
        </View>

        <View style={styles.splitSection}>
          <Text style={styles.splitHeader}>Split Type</Text>
          <SegmentedControl
            tabs={splitOptions}
            activeTab={splitType}
            onChange={setSplitType}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add Expense"
          onPress={handleSave}
          disabled={!amount}
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  amountSection: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  label: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
  },
  amountInput: {
    fontFamily: 'Manrope',
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.onSurface,
    minWidth: 150,
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
  },
  inputSection: {
    marginTop: theme.spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingVertical: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingVertical: theme.spacing.md,
  },
  selectorText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  splitSection: {
    marginTop: theme.spacing.xxl,
  },
  splitHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
});

