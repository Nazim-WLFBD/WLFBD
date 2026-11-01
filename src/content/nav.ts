import type { L } from '@/i18n/t';

export const NAV = {
  home: { en: 'Home', bn: 'হোম' },
  courses: { en: 'Courses', bn: 'কোর্সসমূহ' },
  practice: { en: 'Practice Test', bn: 'প্র্যাকটিস টেস্ট' },
  schedule: { en: 'Schedule', bn: 'সময়সূচী' },
  about: { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
  blog: { en: 'Blog', bn: 'ব্লগ' },
  freeClass: { en: 'Free Class', bn: 'ফ্রি ক্লাস' },
} satisfies Record<string, L>;

export const MEGA = {
  live: { en: 'Live online courses', bn: 'লাইভ অনলাইন কোর্স' },
  recorded: { en: 'Recorded masterclasses', bn: 'রেকর্ডেড মাস্টারক্লাস' },
  combos: { en: 'Combo offers', bn: 'কম্বো অফার' },
  allCourses: { en: 'Compare all courses', bn: 'সব কোর্স তুলনা করুন' },
  unsure: { en: 'Not sure where to start?', bn: 'কোথা থেকে শুরু করবেন বুঝতে পারছেন না?' },
  unsureSub: { en: 'Take the free 30-question level test.', bn: '৩০ প্রশ্নের ফ্রি লেভেল টেস্ট দিন।' },
  tools: [
    {
      href: '/quiz/placement-test',
      icon: 'compass',
      t: { en: 'Free Level Test', bn: 'ফ্রি লেভেল টেস্ট' },
      s: { en: '30 questions · find your CEFR level', bn: '৩০টি প্রশ্ন · আপনার লেভেল জানুন' },
    },
    {
      href: '/quiz',
      icon: 'clipboard',
      t: { en: 'Quiz & Mock Test Hub', bn: 'কুইজ ও মক টেস্ট' },
      s: { en: 'DELF, TCF & TEF practice', bn: 'DELF, TCF ও TEF প্র্যাকটিস' },
    },
    {
      href: '/crs-calculator',
      icon: 'maple',
      t: { en: 'Canada CRS Calculator', bn: 'কানাডা CRS ক্যালকুলেটর' },
      s: { en: 'See the +62 French bonus', bn: '+৬২ ফ্রেঞ্চ বোনাস দেখুন' },
    },
  ],
};

export const SECTIONS = [
  { id: 'hero', label: { en: 'Home', bn: 'হোম' } },
  { id: 'about', label: { en: 'About', bn: 'আমাদের কথা' } },
  { id: 'pathways', label: { en: 'Pathways', bn: 'পাথওয়ে' } },
  { id: 'recorded-courses', label: { en: 'Recorded', bn: 'রেকর্ডেড' } },
  { id: 'courses', label: { en: 'Courses', bn: 'কোর্স' } },
  { id: 'schedule', label: { en: 'Schedule', bn: 'সময়সূচী' } },
  { id: 'students-voice', label: { en: 'Reviews', bn: 'রিভিউ' } },
  { id: 'faq', label: { en: 'FAQ', bn: 'প্রশ্নোত্তর' } },
] as const;
