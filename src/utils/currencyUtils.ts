export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

export const getCurrencySymbol = (code: string): string => {
  return CURRENCY_SYMBOLS[code] || code || '$';
};
