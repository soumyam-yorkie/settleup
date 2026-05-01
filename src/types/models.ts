export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  handle?: string;
  defaultCurrency: string;
}

export interface Group {
  id: string;
  name: string;
  category: 'Trip' | 'Home' | 'Office' | 'Party' | 'Others';
  currency: string;
  members: string[]; // User IDs
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId?: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string; // User ID
  splitType: 'Equal' | 'Custom';
  date: string;
  lastActivity?: string;
  category?: 'Food' | 'Transport' | 'Shopping' | 'Settlement';
  splits: Split[];
}

export interface Split {
  userId: string;
  amount: number;
}

export interface Transaction {
  id: string;
  from: string; // User ID
  to: string; // User ID
  amount: number;
  currency: string;
  date: string;
  status: 'Pending' | 'Completed';
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}
