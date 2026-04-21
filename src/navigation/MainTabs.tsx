import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, UserPlus, Settings } from 'lucide-react-native';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { GroupsListScreen } from '../screens/groups/GroupsListScreen';
import { FriendsListScreen } from '../screens/friends/FriendsListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();

const DashboardIcon = ({ color, size: _size, focused }: { color: string; size: number; focused: boolean }) => (
  focused ? (
    <View style={styles.activeIconContainer}>
      <Home color={theme.colors.white} size={22} />
    </View>
  ) : (
    <Home color={color} size={22} />
  )
);

const GroupsIcon = ({ color, size: _size, focused }: { color: string; size: number; focused: boolean }) => (
  focused ? (
    <View style={styles.activeIconContainer}>
      <Users color={theme.colors.white} size={22} />
    </View>
  ) : (
    <Users color={color} size={22} />
  )
);

const FriendsIcon = ({ color, size: _size, focused }: { color: string; size: number; focused: boolean }) => (
  focused ? (
    <View style={styles.activeIconContainer}>
      <UserPlus color={theme.colors.white} size={22} />
    </View>
  ) : (
    <UserPlus color={color} size={22} />
  )
);

const ProfileIcon = ({ color, size: _size, focused }: { color: string; size: number; focused: boolean }) => (
  focused ? (
    <View style={styles.activeIconContainer}>
      <Settings color={theme.colors.white} size={22} />
    </View>
  ) : (
    <Settings color={color} size={22} />
  )
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
          position: 'absolute',
          shadowColor: '#1F1A6F',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
          elevation: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: DashboardIcon, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsListScreen}
        options={{ tabBarIcon: GroupsIcon }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsListScreen}
        options={{ tabBarIcon: FriendsIcon, tabBarLabel: 'Activity' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ProfileIcon, tabBarLabel: 'Settings' }}
      />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
