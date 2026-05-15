import { Expense } from '../types/models';

export interface UserBalances {
  totalBalance: number;
  youAreOwed: number;
  youOwe: number;
}

export const calculateUserBalances = (expenses: Expense[], userId: string): UserBalances => {
  let youAreOwed = 0;
  let youOwe = 0;

  expenses.forEach((expense) => {
    const isPaidByMe = expense.paidBy === userId;
    
    // Find how much the user is involved in this expense
    const mySplit = expense.splits.find((s) => s.userId === userId);
    const myAmount = mySplit ? mySplit.amount : 0;

    if (isPaidByMe) {
      // If I paid, everyone else's split is what they owe me
      const othersAmount = expense.amount - myAmount;
      youAreOwed += othersAmount;
    } else {
      // If someone else paid, my split is what I owe them
      youOwe += myAmount;
    }
  });

  return {
    totalBalance: youAreOwed - youOwe,
    youAreOwed,
    youOwe,
  };
};
