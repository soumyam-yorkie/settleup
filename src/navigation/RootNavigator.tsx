import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { AddExpenseScreen } from '../screens/expense/AddExpenseScreen';
import { AddFriendScreen } from '../screens/friends/AddFriendScreen';
import { GroupDetailScreen } from '../screens/groups/GroupDetailScreen';
import { CreateGroupScreen } from '../screens/groups/CreateGroupScreen';
import { FriendDetailScreen } from '../screens/friends/FriendDetailScreen';

import { GetStartedScreen } from '../screens/auth/GetStartedScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';

import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // Toggle this to false to see the new Auth screens
  const isAuthenticated = true;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="GroupDetail" 
            component={GroupDetailScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="CreateGroup" 
            component={CreateGroupScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="FriendDetail" 
            component={FriendDetailScreen} 
            options={{ headerShown: false }} 
          />

          <Stack.Group screenOptions={{ presentation: 'modal', headerShown: true, title: 'Add Expense' }}>
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal', headerShown: true, title: 'Add Friend' }}>
            <Stack.Screen name="AddFriend" component={AddFriendScreen} />
          </Stack.Group>
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
