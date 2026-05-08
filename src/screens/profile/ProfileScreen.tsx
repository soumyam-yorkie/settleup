import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, CreditCard, Shield, ChevronRight, LogOut } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MOCK_USER } from '../../services/mockData';
import { theme } from '../../utils/theme';

export const ProfileScreen = () => {
  const menuItems = [
    { icon: Bell, label: 'Notifications', color: theme.colors.primaryLight },
    { icon: CreditCard, label: 'Payment Methods', color: theme.colors.secondary },
    { icon: Shield, label: 'Security', color: theme.colors.warning },
    { icon: Settings, label: 'Account Settings', color: theme.colors.outline },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileHeader} padding={theme.spacing.xl}>
          <Image source={{ uri: MOCK_USER.avatarUrl ?? '' }} style={styles.avatar} />
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
          <Button
            variant="outline"
            size="sm"
            title="Edit Profile"
            onPress={() => {}}
            style={styles.editButton}
          />
        </Card>

        <Card style={styles.menuSection} padding={theme.spacing.sm}>
          {menuItems.map((item, index) => (
            <Card
              key={index}
              variant="flat"
              onPress={() => {}}
              style={styles.menuItem}
              padding={theme.spacing.md}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '18' }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={20} color={theme.colors.outlineVariant} />
            </Card>
          ))}
        </Card>

        <Button
          variant="danger"
          leftIcon={LogOut}
          title="Log Out"
          onPress={() => {}}
          style={styles.logoutButton}
          fullWidth
        />

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
  },
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'transparent',
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
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  version: {
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    color: theme.colors.outline,
    fontSize: 12,
  },
});

