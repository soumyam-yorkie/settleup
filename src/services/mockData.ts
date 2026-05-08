import { User, Group, Expense } from '../types/models';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Soumya',
  email: 'soumya@example.com',
  defaultCurrency: 'USD',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
};

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Roommates',
    category: 'Home',
    currency: 'USD',
    members: ['u1', 'u2', 'u3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g2',
    name: 'Europe Trip',
    category: 'Trip',
    currency: 'EUR',
    members: ['u1', 'u4'],
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'e1',
    groupId: 'g1',
    description: 'Groceries',
    amount: 150,
    currency: 'USD',
    paidBy: 'u1',
    splitType: 'Equal',
    date: new Date().toISOString(),
    splits: [
      { userId: 'u1', amount: 50 },
      { userId: 'u2', amount: 50 },
      { userId: 'u3', amount: 50 },
    ],
  },
  {
    id: 'e2',
    groupId: 'g1',
    description: 'Electricity Bill',
    amount: 90,
    currency: 'USD',
    paidBy: 'u2',
    splitType: 'Equal',
    date: new Date().toISOString(),
    splits: [
      { userId: 'u1', amount: 30 },
      { userId: 'u2', amount: 30 },
      { userId: 'u3', amount: 30 },
    ],
  },
];

export const MOCK_FRIENDS = [
  {
    id: 'u2',
    name: 'Ankit',
    balance: -30.00,
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'u3',
    name: 'Ishita',
    balance: 50.00,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'u4',
    name: 'Rahul',
    balance: 50.00,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
];

