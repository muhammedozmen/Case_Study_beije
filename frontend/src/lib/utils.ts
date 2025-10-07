import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₺${price.toFixed(2)}`;
}

export function formatCurrency(amount: number): string {
  // NaN or undefined validation
  if (isNaN(amount) || amount === undefined || amount === null) {
    console.warn('formatCurrency: Invalid amount:', amount);
    return '₺0,00';
  }
  
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('formatCurrency error:', error);
    return `₺${amount.toFixed(2)}`;
  }
}
