import { getCurrencySymbol } from './currencyUtils';

/**
 * Formats a numeric amount into a currency string.
 * @param amount The amount to format
 * @param currencyCodeOrSymbol The currency code (USD, EUR) or symbol ($)
 */
export const formatCurrency = (amount: number, currencyCodeOrSymbol: string = 'USD'): string => {
  const symbol = currencyCodeOrSymbol.length > 1 && !currencyCodeOrSymbol.includes('$') 
    ? getCurrencySymbol(currencyCodeOrSymbol) 
    : currencyCodeOrSymbol;
    
  const absAmount = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : amount > 0 ? '+' : '';
  
  if (amount === 0) return `${symbol}0.00`;
  return `${sign}${symbol}${absAmount}`;
};

/**
 * Safely extracts the first letter of a name for avatars.
 * @param name The name to extract from
 */
export const getInitials = (name: string): string => {
  if (!name || name.trim().length === 0) return '?';
  return name.trim().charAt(0).toUpperCase();
};

/**
 * Helper to determine the balance label and color based on amount.
 */
export const getBalanceDetails = (amount: number) => {
  if (amount === 0) {
    return {
      label: 'Settled',
      color: 'outline' as const,
    };
  }
  
  return {
    label: amount > 0 ? 'You are owed' : 'You owe',
    color: amount > 0 ? 'success' : 'danger' as const,
  };
};
