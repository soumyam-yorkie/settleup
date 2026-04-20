export type RootStackParamList = {
  Main: undefined;
  AddExpense: { groupId?: string; friendId?: string } | undefined;
  AddFriend: undefined;
  GroupDetail: { groupId: string };

  FriendDetail: { friendId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Groups: undefined;
  Friends: undefined;
  Profile: undefined;
};
