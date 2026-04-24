import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Users, User, Settings, ReceiptText } from 'lucide-react-native';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { GroupsListScreen } from '../screens/groups/GroupsListScreen';
import { FriendsListScreen } from '../screens/friends/FriendsListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ 
  Icon, 
  label, 
  focused 
}: { 
  Icon: any; 
  label: string; 
  focused: boolean 
}) => {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.pillContainer, focused && styles.activePill]}>
        <Icon 
          color={focused ? theme.colors.primary : theme.colors.inactive} 
          size={22} 
        />
        <Text 
          style={[styles.tabLabel, focused && styles.activeTabLabel]}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

const ActivityIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon Icon={ReceiptText} label="Activity" focused={focused} />
);

const GroupsIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon Icon={Users} label="Groups" focused={focused} />
);

const FriendsIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon Icon={User} label="Friends" focused={focused} />
);

const AccountIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon Icon={Settings} label="Account" focused={focused} />
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <Pressable 
            {...props} 
            android_ripple={null}
            style={({ pressed }) => [
              props.style,
            ]}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.white,
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 90,
          paddingBottom: 24,
          paddingTop: 18,
          shadowColor: theme.colors.black,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.08,
          shadowRadius: 15,
          elevation: 20,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: ActivityIcon }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsListScreen}
        options={{ tabBarIcon: GroupsIcon }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsListScreen}
        options={{ tabBarIcon: FriendsIcon }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: AccountIcon }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 56,
    borderRadius: 20,
  },
  activePill: {
    backgroundColor: theme.colors.activeTab,
    width: 75,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.inactive,
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: theme.colors.primary,
  },
});




