'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from './routing';

/** A string in both site languages. */
export type L = { en: string; bn: string };

/** Returns a picker for bilingual strings in the current locale. Stable per locale, so it is safe in dependency arrays. */
export function useT() {
  const locale = useLocale() as Locale;
  return useMemo(() => Object.assign((l: L) => l[locale], { locale }), [locale]);
}
