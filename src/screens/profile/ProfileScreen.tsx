import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../utils/theme';
import { MOCK_USER } from '../../services/mockData';
import { Settings, Bell, CreditCard, Shield, ChevronRight, LogOut } from 'lucide-react-native';

export const ProfileScreen = () => {
  const menuItems = [
    { icon: Bell, label: 'Notifications', color: theme.colors.primaryLight },
    { icon: CreditCard, label: 'Payment Methods', color: theme.colors.secondary },
    { icon: Shield, label: 'Security', color: '#F59E0B' },
    { icon: Settings, label: 'Account Settings', color: theme.colors.outline },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '18' }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={20} color={theme.colors.outlineVariant} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 0.0.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xxxl,
    ...theme.shadows.small,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  userName: {
    fontFamily: 'Manrope',
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  editButton: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  menuSection: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.sm,
    ...theme.shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.small,
  },
  logoutText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    color: theme.colors.outline,
    fontSize: 12,
  },
});
