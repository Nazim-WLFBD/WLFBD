'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ComboOffer, Course } from '@/types';

interface CoursesValue {
  courses: Course[];
  combos: ComboOffer[];
}

// Empty outside the provider: the layout always supplies the live (admin-edited) lists. Bundling the built-in data
// here would ship it to every client and let stale built-in prices show by accident.
const CoursesContext = createContext<CoursesValue>({ courses: [], combos: [] });

/** Live courses and combo offers as loaded on the server (admin-edited copy when it exists). */
export function CoursesProvider({ courses, combos, children }: CoursesValue & { children: React.ReactNode }) {
  const value = useMemo(() => ({ courses, combos }), [courses, combos]);
  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export const useCourses = () => useContext(CoursesContext);
