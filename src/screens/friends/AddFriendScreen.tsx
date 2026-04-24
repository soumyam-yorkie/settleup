import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Search } from 'lucide-react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddFriend'>;

export const AddFriendScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add a Friend</Text>
          <Text style={styles.subtitle}>Enter your friend's details to start splitting expenses.</Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <User size={20} color={theme.colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              placeholderTextColor={theme.colors.outline}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputRow}>
            <Mail size={20} color={theme.colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Email address (optional)"
              placeholderTextColor={theme.colors.outline}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.searchSection}>
          <Search size={20} color={theme.colors.primary} />
          <Text style={styles.searchText}>Find from contacts</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, !name && styles.disabledButton]}
          onPress={handleAdd}
          disabled={!name}
        >
          <Text style={styles.addButtonText}>Add Friend</Text>
        </TouchableOpacity>
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
  header: {
    marginVertical: theme.spacing.xl,
  },
  title: {
    fontFamily: 'Manrope',
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  inputSection: {
    marginTop: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  inputIcon: {
    marginRight: theme.spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
  },
  searchText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xxl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  disabledButton: {
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
