import type { L } from '@/i18n/t';

/** Choices for "Course or subject of interest" on the free class form (ids are stored). */
export const FREE_CLASS_INTERESTS: { id: string; label: L }[] = [
  { id: 'delf-a1', label: { en: 'DELF A1 — complete beginner', bn: 'DELF A1 — একদম শুরু থেকে' } },
  { id: 'delf-a2', label: { en: 'DELF A2', bn: 'DELF A2' } },
  { id: 'delf-b1', label: { en: 'DELF B1', bn: 'DELF B1' } },
  { id: 'delf-b2', label: { en: 'DELF B2', bn: 'DELF B2' } },
  { id: 'tef-tcf-canada', label: { en: 'TEF / TCF Canada (immigration)', bn: 'TEF / TCF Canada (ইমিগ্রেশন)' } },
  { id: 'one-to-one', label: { en: 'One-to-One Sessions', bn: 'ওয়ান-টু-ওয়ান সেশন' } },
  { id: 'not-sure', label: { en: 'Not sure yet — help me choose', bn: 'এখনো নিশ্চিত নই — বেছে নিতে সাহায্য করুন' } },
];
