'use client';

import { createContext, useContext, useMemo } from 'react';
import { COMBO_OFFERS, COURSES_DATA } from '@/data/courses';
import type { ComboOffer, Course } from '@/types';

interface CoursesValue {
  courses: Course[];
  combos: ComboOffer[];
}

// Built-in data by default, so a component rendered outside the provider (tests, isolated previews) still works
const CoursesContext = createContext<CoursesValue>({ courses: COURSES_DATA, combos: COMBO_OFFERS });

/** Live courses and combo offers as loaded on the server (admin-edited copy when it exists). */
export function CoursesProvider({ courses, combos, children }: CoursesValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ courses, combos }), [courses, combos]);
  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export const useCourses = () => useContext(CoursesContext);
