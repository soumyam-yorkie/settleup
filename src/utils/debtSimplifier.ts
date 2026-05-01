export interface SimplifiedDebt {
  fromId: string;
  toId: string;
  amount: number;
}

/**
 * Simplifies debts within a group to minimize the number of transactions.
 * Uses a greedy matching algorithm:
 * 1. Find all people who owe money (debtors) and who are owed money (creditors).
 * 2. Match the person who owes the most with the person who is owed the most.
 * 3. Create a transaction and update their balances.
 * 4. Repeat until all balances are settled.
 */
export const simplifyDebts = (balances: { id: string; balance: number }[]): SimplifiedDebt[] => {
  // Filter and separate into debtors and creditors
  // We use 0.01 as a threshold for floating point precision
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ id: b.id, amount: Math.abs(b.balance) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ id: b.id, amount: b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const transactions: SimplifiedDebt[] = [];
  
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    
    const settleAmount = Math.min(debtor.amount, creditor.amount);
    
    if (settleAmount > 0) {
      transactions.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: settleAmount
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return transactions;
};
