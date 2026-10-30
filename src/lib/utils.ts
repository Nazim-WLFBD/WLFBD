import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Formats a taka amount, e.g. 8000 → "৳8,000" (or Bangla digits for bn). */
export function taka(amount: number, locale: string = 'en') {
  const s = amount.toLocaleString('en-US');
  return '৳' + (locale === 'bn' ? toBnDigits(s) : s);
}

export function toBnDigits(input: string | number) {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

export function num(n: number | string, locale: string) {
  return locale === 'bn' ? toBnDigits(n) : String(n);
}
