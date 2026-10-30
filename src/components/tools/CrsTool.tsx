'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { CrsCalculator } from './CrsCalculator';

/** CRS calculator page wrapper: signed-in students can save their score to their profile. */
export function CrsTool() {
  const { user, updateMyProfile } = useAuth();
  return <CrsCalculator onSave={user ? (score) => updateMyProfile({ crsScore: score }) : undefined} />;
}
