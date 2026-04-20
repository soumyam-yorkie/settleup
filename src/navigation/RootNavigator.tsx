import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { AddExpenseScreen } from '../screens/expense/AddExpenseScreen';
import { AddFriendScreen } from '../screens/friends/AddFriendScreen';
import { GroupDetailScreen } from '../screens/groups/GroupDetailScreen';

import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  // For now, we assume the user is authenticated.
  const isAuthenticated = true;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="GroupDetail" 
            component={GroupDetailScreen} 
            options={{ headerShown: true, title: 'Group Details' }} 
          />

          <Stack.Group screenOptions={{ presentation: 'modal', headerShown: true, title: 'Add Expense' }}>
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal', headerShown: true, title: 'Add Friend' }}>
            <Stack.Screen name="AddFriend" component={AddFriendScreen} />
          </Stack.Group>

        </Stack.Group>
      ) : (
        <Stack.Screen name="Auth" component={() => null} />
      )}
    </Stack.Navigator>
  );
};

