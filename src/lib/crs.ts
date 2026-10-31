/**
 * Simplified Canada Express Entry CRS estimate, ported unchanged from the
 * original We Learn French BD calculator. It is a marketing estimate, not the
 * official IRCC formula (no work experience, spouse or transferability factors).
 */

export type Education = 'bachelor' | 'two_degrees' | 'master' | 'phd';
export type EnglishLevel = 'ielts_6' | 'ielts_7' | 'ielts_8';

export interface CrsInput {
  age: number;
  education: Education;
  english: EnglishLevel;
  hasFrench: boolean;
}

export const FRENCH_BONUS = 62;

function agePoints(age: number) {
  if (age >= 20 && age <= 29) return 110;
  if (age === 30) return 105;
  if (age === 31) return 99;
  if (age === 32) return 94;
  if (age === 33) return 88;
  if (age === 34) return 83;
  if (age >= 35 && age <= 40) return 70;
  return 50;
}

const EDUCATION_POINTS: Record<Education, number> = {
  bachelor: 120,
  two_degrees: 128,
  master: 135,
  phd: 150,
};

const ENGLISH_POINTS: Record<EnglishLevel, number> = {
  ielts_6: 68,
  ielts_7: 88,
  ielts_8: 110,
};

export function calculateCrs(input: CrsInput) {
  const age = agePoints(input.age);
  const education = EDUCATION_POINTS[input.education];
  const english = ENGLISH_POINTS[input.english];
  const french = input.hasFrench ? FRENCH_BONUS : 0;
  const base = age + education + english;
  return { age, education, english, french, base, total: base + french };
}
