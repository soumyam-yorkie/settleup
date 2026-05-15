import React, { createContext, useContext, useState, ReactNode } from 'react';

import { MOCK_USER, MOCK_GROUPS, MOCK_EXPENSES, MOCK_FRIENDS } from '../services/mockData';
import { User, Group, Expense } from '../types/models';

interface AppState {
  currentUser: User;
  groups: Group[];
  expenses: Expense[];
  friends: User[];
}

interface AppContextType extends AppState {
  addExpense: (expense: Expense) => void;
  createGroup: (group: Group) => void;
  updateGroup: (groupId: string, patch: Partial<Group>) => void;
  addMemberToGroup: (groupId: string, userId: string) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  updateUser: (user: User) => void;
  addFriend: (friend: User) => void;
  getGroupExpenses: (groupId: string) => Expense[];
  getFriendExpenses: (friendId: string) => Expense[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [friends, setFriends] = useState<User[]>(MOCK_FRIENDS);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const createGroup = (group: Group) => {
    setGroups((prev) => [group, ...prev]);
  };

  const updateGroup = (groupId: string, patch: Partial<Group>) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...patch } : g))
    );
  };

  const addMemberToGroup = (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId && !g.members.includes(userId)
          ? { ...g, members: [...g.members, userId] }
          : g
      )
    );
  };

  const removeMemberFromGroup = (groupId: string, userId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((id) => id !== userId) }
          : g
      )
    );
  };

  const leaveGroup = (groupId: string) => {
    removeMemberFromGroup(groupId, currentUser.id);
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  const addFriend = (friend: User) => {
    setFriends((prev) => {
      if (prev.some((f) => f.id === friend.id)) return prev;
      return [...prev, friend];
    });
  };

  const getGroupExpenses = (groupId: string) => {
    return expenses.filter((e) => e.groupId === groupId);
  };

  const getFriendExpenses = (friendId: string) => {
    return expenses.filter(
      (e) => !e.groupId && (e.paidBy === friendId || e.splits.some((s) => s.userId === friendId))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        groups,
        expenses,
        friends,
        addExpense,
        createGroup,
        updateGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        leaveGroup,
        deleteGroup,
        updateUser,
        addFriend,
        getGroupExpenses,
        getFriendExpenses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
