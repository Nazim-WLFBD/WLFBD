'use client';

import { useLocale } from 'next-intl';
import type { Locale } from './routing';

/** A string in both site languages. */
export type L = { en: string; bn: string };

/** Returns a picker for bilingual strings in the current locale. */
export function useT() {
  const locale = useLocale() as Locale;
  return Object.assign((l: L) => l[locale], { locale });
}
