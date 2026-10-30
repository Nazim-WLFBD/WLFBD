'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

/** Old single-page links (e.g. /#quiz, /#enroll) now live on their own pages. */
const LEGACY: Record<string, string> = {
  '#quiz': '/quiz',
  '#placement-test': '/quiz/placement-test',
  '#enroll': '/enroll',
  '#crs-calculator': '/crs-calculator',
  '#crs-calc': '/crs-calculator',
  '#admin': '/admin',
  
  '#profile': '/dashboard',
  '#student': '/dashboard',
};

export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const check = () => {
      const target = LEGACY[window.location.hash];
      if (target) router.replace(target);
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [router]);
  return null;
}
