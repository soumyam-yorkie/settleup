import { User, Group, Expense } from '../types/models';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Soumya',
  handle: '@soumya_dev',
  email: 'soumya@example.com',
  defaultCurrency: 'USD',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
};

export const MOCK_FRIENDS: (User & { balance: number; lastActivityDescription?: string })[] = [
  {
    id: 'u2',
    name: 'Marcus Thorne',
    handle: '@mthorne_fin',
    email: 'marcus@example.com',
    balance: 45.00,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    defaultCurrency: 'USD',
    lastActivityDescription: 'Last split 2h ago',
  },
  {
    id: 'u3',
    name: 'Elena Rossi',
    handle: '@elena_r',
    email: 'elena@example.com',
    balance: -12.50,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    defaultCurrency: 'USD',
    lastActivityDescription: "Dinner at Luigi's",
  },
  {
    id: 'u4',
    name: 'Julian Beck',
    handle: '@jbeck_travel',
    email: 'julian@example.com',
    balance: 135.00,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    defaultCurrency: 'USD',
    lastActivityDescription: 'Ski Trip Lodging',
  },
  {
    id: 'u5',
    name: "Sarah O'Connor",
    handle: '@sarah_oc',
    email: 'sarah@example.com',
    balance: -35.00,
    defaultCurrency: 'USD',
    lastActivityDescription: 'Uber ride',
  },
];

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
    description: "L'Osteria Dinner",
    amount: 182.40,
    currency: 'USD',
    paidBy: 'u1',
    splitType: 'Equal',
    date: 'Oct 24',
    category: 'Food',
    splits: [
      { userId: 'u1', amount: 91.20 },
      { userId: 'u2', amount: 91.20 },
    ],
  },
  {
    id: 'e2',
    groupId: 'g1',
    description: 'Uber ride',
    amount: 25.00,
    currency: 'USD',
    paidBy: 'u2',
    splitType: 'Equal',
    date: 'Oct 22',
    category: 'Transport',
    splits: [
      { userId: 'u1', amount: 12.50 },
      { userId: 'u2', amount: 12.50 },
    ],
  },
  {
    id: 'e3',
    description: 'Artisan Coffee',
    amount: 11.90,
    currency: 'USD',
    paidBy: 'u1',
    splitType: 'Equal',
    date: 'Oct 20',
    category: 'Settlement',
    splits: [
      { userId: 'u1', amount: 5.95 },
      { userId: 'u2', amount: 5.95 },
    ],
  },
];
