/**
 * Lightweight public index of recorded courses, safe for the browser bundle
 * (no lesson video/PDF links). Full data lives in recordedCourses.server.ts.
 */
export const RECORDED_COURSES = [
  { id: 'recorded-delf-a1', slug: 'delf-a1-recorded-course', title: 'DELF A1 Recorded Complete Masterclass', banglaTitle: 'DELF A1 সম্পূর্ণ রেকর্ডকৃত ফ্রেঞ্চ কোর্স (শূন্য থেকে A1)', level: 'A1', regularPrice: 6500, offerPrice: 4200 },
  { id: 'recorded-delf-a2', slug: 'delf-a2-recorded-course', title: 'DELF A2 Recorded Complete Masterclass', banglaTitle: 'DELF A2 সম্পূর্ণ রেকর্ডকৃত ফ্রেঞ্চ কোর্স', level: 'A2', regularPrice: 8500, offerPrice: 5500 },
] as const;
