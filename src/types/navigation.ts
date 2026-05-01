import { NavigatorScreenParams, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  AddExpense: { groupId?: string; friendId?: string } | undefined;
  AddFriend: undefined;
  CreateGroup: undefined;
  GroupDetail: { groupId: string };
  FriendDetail: { friendId: string };
  GetStarted: undefined;
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Groups: undefined;
  Friends: undefined;
  Profile: undefined;
};

export type MainScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
