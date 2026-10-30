import { Course, ComboOffer } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'delf-a1',
    code: 'A1',
    title: 'DELF A1 - French Language Levels',
    banglaTitle: 'DELF A1 - মৌলিক ফ্রেঞ্চ কোর্স',
    duration: '3 Months (৩ মাস)',
    classCount: 24,
    classesPerWeek: '2 Classes',
    targetClb: 'CLB 1–2',
    regularPrice: 10000,
    offerPrice: 8000,
    cefrLevel: 'A1 (CLB 1–2)',
    targetAudience: 'Absolute Beginners, Students & Everyday Communication',
    outcome: 'Basic conversation, self-introduction, foundation grammar & DELF A1 Exam preparation.',
    tag: 'Beginner Choice',
    tagColor: 'bg-blue-50 text-[#0055A4] border-blue-200',
    features: [
      '24 Interactive Live Classes (2 Classes per Week)',
      'Complete Printed Study Materials & PDFs',
      'Speaking & Pronunciation Workshops',
      'Full Length Mock Tests & Evaluation',
      'Class Recordings Access',
      'Dedicated WhatsApp Support Group'
    ]
  },
  {
    id: 'delf-a2',
    code: 'A2',
    title: 'DELF A2 - Elementary Level',
    banglaTitle: 'DELF A2 - প্রাথমিক স্তরের ফ্রেঞ্চ',
    duration: '3 Months (৩ মাস)',
    classCount: 24,
    classesPerWeek: '2 Classes',
    targetClb: 'CLB 3–4',
    regularPrice: 12000,
    offerPrice: 10000,
    cefrLevel: 'A2 (CLB 3–4)',
    targetAudience: 'A1 Graduates & French Multi-Year Residence Permit Seekers',
    outcome: 'Routine social interactions, descriptive French communication & DELF A2 Exam preparation.',
    tag: 'Elementary',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    popular: true,
    features: [
      '24 Live Intensive Classes (2 Classes per Week)',
      'Speaking, Listening & Writing Exercises',
      'Grammar Drills & Vocabulary Expansion',
      'Mock Tests with Instructor Feedback',
      'Class Video Recording Access',
      'Direct Instructor Q&A Support'
    ]
  },
  {
    id: 'delf-b1',
    code: 'B1',
    title: 'DELF B1 - Intermediate Level',
    banglaTitle: 'DELF B1 - মধ্যবর্তী স্তরের ফ্রেঞ্চ',
    duration: '4 Months (৪ মাস)',
    classCount: 36,
    classesPerWeek: '2–3 Classes',
    targetClb: 'Up to CLB 5',
    regularPrice: 40000,
    offerPrice: 30000,
    cefrLevel: 'B1 (Up to CLB 5)',
    targetAudience: 'Higher Education in France, Long-Term Residency & Intermediate Learners',
    outcome: 'Express opinions, handle travel & workplace situations independently, and pass DELF B1.',
    tag: 'Intermediate Mastery',
    tagColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    features: [
      '36 Comprehensive Live Classes (2–3 Classes per Week)',
      'Debating, Essay Writing & Argumentation',
      'Audio & Video Comprehension Workshops',
      'Full DELF B1 Exam Simulations',
      'Personalized Assessment by Senior Instructors',
      'University Guidance & Academic Support'
    ]
  },
  {
    id: 'delf-b2',
    code: 'B2',
    title: 'DELF B2 - Upper Intermediate Fluency',
    banglaTitle: 'DELF B2 - উচ্চতর ফ্রেঞ্চ দক্ষতা',
    duration: '6 Months (৬ মাস)',
    classCount: 48,
    classesPerWeek: '2–3 Classes',
    targetClb: 'Up to CLB 7',
    regularPrice: 50000,
    offerPrice: 40000,
    cefrLevel: 'B2 (Up to CLB 7)',
    targetAudience: 'Global Careers, University Admissions & Naturalization Candidates',
    outcome: 'Fluent argumentation, professional fluency, technical comprehension & DELF B2 Certification.',
    tag: 'Advanced Fluency',
    tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
    features: [
      '48 Intensive Advanced Classes (2–3 Classes per Week)',
      'Complex Argumentation & Professional Vocabulary',
      'Interview Preparation & Public Speaking',
      'Full DELF B2 Exam Simulations & Analytics',
      'Academic & Technical Article Writing Skills',
      '1-on-1 Speaking Review with Experienced Instructors'
    ]
  },
  {
    id: 'tef-canada',
    code: 'TEF',
    title: 'TEF Canada - Immigration Preparation',
    banglaTitle: 'TEF Canada - কানাডা ইমিগ্রেশন প্রস্তুতি',
    duration: 'Flexible Preparation',
    classCount: 48,
    classesPerWeek: '2–3 Classes',
    targetClb: 'CLB 7+',
    regularPrice: 0,
    offerPrice: 0,
    isCustomPricing: true,
    priceNotice: 'Contact us for course fee details',
    cefrLevel: 'CLB 7+',
    targetAudience: 'Canada Express Entry PR & Francophone Immigration Candidates',
    outcome: 'Master all computer-based TEF Canada modules targeting CLB 7+ for French language points.',
    tag: 'Canada PR Pathway',
    tagColor: 'bg-rose-50 text-[#D71920] border-rose-200',
    popular: true,
    features: [
      'Intensive Preparation Dedicated to TEF Canada Format',
      'Targeted CLB 7 Level Mastery (Compréhension & Expression)',
      'Computer-Based Exam Drills & Mock Tests',
      'Express Entry French Category Draw Strategy Guidance',
      'Dedicated Speaking Partner Drills with Feedback',
      'Comprehensive Prep Materials & Audio Archive'
    ]
  },
  {
    id: 'tcf-canada',
    code: 'TCF',
    title: 'TCF Canada - Exam Preparation',
    banglaTitle: 'TCF Canada - কানাডা পরীক্ষা প্রস্তুতি',
    duration: 'Flexible Preparation',
    classCount: 48,
    classesPerWeek: '2–3 Classes',
    targetClb: 'CLB 7+',
    regularPrice: 0,
    offerPrice: 0,
    isCustomPricing: true,
    priceNotice: 'Contact us for course fee details',
    cefrLevel: 'CLB 7+',
    targetAudience: 'Canada PR Candidates preferring the TCF Exam structure',
    outcome: 'Master all 4 TCF Canada modules (Compréhension & Expression) for optimal CLB scores.',
    tag: 'Canada PR Pathway',
    tagColor: 'bg-rose-50 text-[#D71920] border-rose-200',
    features: [
      'Comprehensive Live Online Preparation Classes',
      'TCF Canada Computerized Test Strategies',
      'Rapid Response Speaking & Writing Modules',
      'Full TCF Mock Tests with Immediate Analysis',
      'Exclusive Canada PNP & Federal PR Score Guidance',
      'Class Video Recording Access'
    ]
  }
];

export const COMBO_OFFERS: ComboOffer[] = [
  {
    id: 'combo-a1-a2',
    title: 'DELF A1 + DELF A2 Combo',
    banglaTitle: 'DELF A1 + DELF A2 কম্বো অফার',
    courses: ['DELF A1', 'DELF A2'],
    combinedFee: 16000,
    regularValue: 22000,
    eligibility: 'Existing/regular students',
    eligibilityBangla: 'পূর্বের ও নিয়মিত শিক্ষার্থীদের জন্য প্রযোজ্য',
    description: 'Complete beginner-to-elementary program covering full A1 and A2 certification preparation.',
    badge: 'Special Combo'
  },
  {
    id: 'combo-b1-tef-tcf',
    title: 'DELF B1 + TCF/TEF Preparation',
    banglaTitle: 'DELF B1 + TCF/TEF Preparation কম্বো অফার',
    courses: ['DELF B1', 'TCF/TEF Canada'],
    combinedFee: 40000,
    regularValue: 50000,
    eligibility: 'Existing/regular students',
    eligibilityBangla: 'পূর্বের ও নিয়মিত শিক্ষার্থীদের জন্য প্রযোজ্য',
    description: 'Comprehensive intermediate-to-immigration pathway combining DELF B1 grounding with specialized TEF/TCF Canada exam techniques.',
    badge: 'Immigration Pathway'
  }
];
