import type { L } from '@/i18n/t';

/**
 * Blog posts (bilingual). Bodies are typed blocks; inline text may contain a tiny markup:
 *   [link text](/internal/path)  → rendered as a locale-aware <Link> (internal paths only, must start with '/')
 *   **bold**                      → <strong>
 * Nothing here is rendered as raw HTML.
 */

export type BlogCategoryKey = 'guides' | 'canada' | 'delf' | 'france' | 'tips';
export type BlogCategory = L & { key: BlogCategoryKey };

export const BLOG_CATEGORIES: Record<BlogCategoryKey, BlogCategory> = {
  guides: { key: 'guides', en: 'Learning guides', bn: 'শেখার গাইড' },
  canada: { key: 'canada', en: 'Canada & TEF/TCF', bn: 'কানাডা ও TEF/TCF' },
  delf: { key: 'delf', en: 'DELF exams', bn: 'DELF পরীক্ষা' },
  france: { key: 'france', en: 'France', bn: 'ফ্রান্স' },
  tips: { key: 'tips', en: 'Tips & mistakes', bn: 'টিপস ও ভুল' },
};

/** Visual theme the BlogCover component understands. */
export type BlogCoverTheme = 'canada' | 'france' | 'delf' | 'neutral';
/** Icon key mapped to a lucide-react icon inside BlogCover. */
export type BlogIconKey =
  | 'route'
  | 'scale'
  | 'calculator'
  | 'file-check'
  | 'trending-up'
  | 'landmark'
  | 'graduation-cap'
  | 'target'
  | 'spell-check'
  | 'monitor-smartphone';

export type BlogBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; tone?: 'info' | 'tip' | 'warn'; title?: string; text: string }
  | {
      type: 'cta';
      title: string;
      text: string;
      href: string;
      label: string;
      secondaryHref?: string;
      secondaryLabel?: string;
    };

export interface BlogPost {
  /** English, keyword-based, kebab-case; used in /[locale]/blog/[slug]. */
  slug: string;
  /** ISO 8601 with Dhaka offset, e.g. 2026-09-04T10:00:00+06:00 */
  date: string;
  updated?: string;
  readMinutes: number;
  category: BlogCategory;
  tags: string[];
  cover: { theme: BlogCoverTheme; icon: BlogIconKey; label: L };
  title: L;
  /** ≤ 60 characters; used as the absolute <title>. */
  metaTitle: L;
  /** ≤ 155 characters. */
  metaDescription: L;
  excerpt: L;
  coverAlt: L;
  body: { en: BlogBlock[]; bn: BlogBlock[] };
  faq?: { q: L; a: L }[];
}

const post01: BlogPost = {
  slug: 'learn-french-in-bangladesh-roadmap',
  date: '2026-09-04T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.guides,
  tags: ['learn french', 'bangladesh', 'cefr levels', 'study plan', 'beginners'],
  cover: { theme: 'neutral', icon: 'route', label: { en: 'A0 → B2', bn: 'A0 → B2' } },
  title: {
    en: 'How to Learn French in Bangladesh: A Complete Roadmap from A0 to B2',
    bn: 'বাংলাদেশে ফরাসি ভাষা শেখার পূর্ণাঙ্গ রোডম্যাপ: A0 থেকে B2',
  },
  metaTitle: {
    en: 'How to Learn French in Bangladesh: A0 to B2 Roadmap',
    bn: 'বাংলাদেশে ফরাসি শেখার রোডম্যাপ: A0 থেকে B2',
  },
  metaDescription: {
    en: 'A step-by-step plan to learn French in Bangladesh from zero to B2: what to study at each level, realistic timelines, DELF vs TEF/TCF, and daily habits.',
    bn: 'শূন্য থেকে B2 পর্যন্ত ফরাসি শেখার ধাপে ধাপে পরিকল্পনা: প্রতিটি লেভেলে কী পড়বেন, বাস্তবসম্মত সময়, DELF নাকি TEF/TCF, আর প্রতিদিনের অভ্যাস।',
  },
  excerpt: {
    en: 'Starting French from zero in Bangladesh? Here is a clear, level-by-level plan from A0 to B2, with honest time estimates and the habits that actually move you forward.',
    bn: 'বাংলাদেশে একদম শূন্য থেকে ফরাসি শুরু করছেন? A0 থেকে B2 পর্যন্ত লেভেলভিত্তিক একটি পরিষ্কার পরিকল্পনা, বাস্তবসম্মত সময়ের হিসাব আর যে অভ্যাসগুলো সত্যিই এগিয়ে নেয়।',
  },
  coverAlt: {
    en: 'Illustrated cover: a winding route icon with the label A0 → B2',
    bn: 'ইলাস্ট্রেটেড কভার: আঁকাবাঁকা পথের আইকন, সাথে লেখা A0 → B2',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'More Bangladeshi students and professionals are learning French than ever, for very different reasons: a Canadian immigration plan, a master’s degree in France, a job with an international organisation, or simple curiosity. The good news is that the path from zero to an upper-intermediate level is well mapped. The challenge is staying consistent long enough to walk it. This roadmap breaks the process into stages so you always know what you are working on and why.',
      },
      { type: 'h2', text: 'Understand the levels first: A1 to C2' },
      {
        type: 'p',
        text: 'French proficiency is usually described with the Common European Framework of Reference (CEFR). It has six levels: A1 and A2 (basic user), B1 and B2 (independent user), and C1 and C2 (proficient user). "A0" is an informal label for a complete beginner. Exams such as DELF, TEF Canada and TCF Canada are all built around these levels, so once you understand them, every course description and exam requirement becomes easier to read.',
      },
      {
        type: 'p',
        text: 'Most goals that bring Bangladeshi learners to French sit between A2 and B2. Canadian immigration points start rewarding French seriously at around NCLC 7, which many learners treat as a B2-level target. French-taught university programmes typically ask for B2. Everyday life and work in a French-speaking environment become comfortable somewhere around B1 to B2.',
      },
      { type: 'h2', text: 'How long does it take? Honest estimates' },
      {
        type: 'p',
        text: 'Commonly cited guided-learning estimates are roughly 60–100 hours to reach A1, 160–200 hours (in total) for A2, 350–400 hours for B1 and 550–650 hours for B2. These numbers include class time and some guided practice, and they vary a lot from person to person. Your previous language experience, how often you study, and how much you actually speak all matter.',
      },
      {
        type: 'p',
        text: 'In practical terms, a learner who attends two or three classes a week and studies a little every day often needs several months per level at the beginning, and longer at B1 and B2, where the jump in difficulty is bigger. Be suspicious of any promise that you will reach B2 "in a few weeks". Steady weekly hours beat occasional marathons.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Find your real starting point',
        text: 'If you studied some French before, you may not be at A0. Take our [free French level test](/quiz/placement-test) before choosing a course so you don’t repeat what you already know or skip the foundations you still need.',
      },
      { type: 'h2', text: 'The roadmap, stage by stage' },
      { type: 'h3', text: 'Stage 1 — A0 to A1: sounds, survival and structure' },
      {
        type: 'p',
        text: 'Your first goal is to hear and say French sounds correctly and handle simple, predictable situations. Focus on:',
      },
      {
        type: 'ul',
        items: [
          'Pronunciation basics: nasal vowels (an, on, in), the French "u", silent final letters and the French "r".',
          'Greetings, introducing yourself, numbers, dates, time, family, food and directions.',
          'Core grammar: articles (le, la, un, une), noun gender, present tense of être, avoir and regular -er verbs, simple questions and negation.',
          'Short listening every day: slow French podcasts or beginner videos, even ten minutes at a time.',
        ],
      },
      {
        type: 'p',
        text: 'At the end of this stage you should be able to fill in a simple form, write a short message and hold a slow, basic conversation. Our [DELF A1 course](/courses/delf-a1) follows exactly this progression.',
      },
      { type: 'h3', text: 'Stage 2 — A1 to A2: everyday life' },
      {
        type: 'p',
        text: 'A2 is about describing your routine, your past and your plans. You will learn the passé composé and imparfait, the near future, reflexive verbs, object pronouns and more vocabulary for shopping, travel, health, work and housing. Start writing short texts of 60–80 words and recording yourself speaking for one or two minutes. Many learners stall here because grammar suddenly feels heavy; the fix is to keep using it in real sentences rather than only memorising tables.',
      },
      { type: 'h3', text: 'Stage 3 — A2 to B1: becoming independent' },
      {
        type: 'p',
        text: 'B1 is the turning point. You move from "survival French" to expressing opinions, telling stories and handling unexpected situations. Key topics include the subjunctive in common expressions, the conditional, relative pronouns (qui, que, où, dont), and connectors that link ideas (cependant, donc, par contre). Reading longer articles and watching French content with French subtitles become realistic. Speaking practice needs to increase sharply: you should be speaking in every class, not just listening.',
      },
      { type: 'h3', text: 'Stage 4 — B1 to B2: argue, explain, convince' },
      {
        type: 'p',
        text: 'B2 asks you to understand fairly complex texts and audio on current topics and to argue a point of view clearly in speech and writing. This is where exam technique matters most: structured essays, timed reading, note-taking while listening and spontaneous speaking under pressure. Expect this stage to take longer than the earlier ones. Regular feedback on your writing and speaking from a teacher is the single biggest accelerator here.',
      },
      { type: 'h2', text: 'Choose your goal: DELF or TEF/TCF?' },
      {
        type: 'p',
        text: 'Your goal decides which exam you should prepare for, and it is worth deciding early because each exam has its own task types.',
      },
      {
        type: 'ul',
        items: [
          '**DELF (A1–B2)** is a diploma from France Éducation international. It does not expire, which makes it useful for studies, CVs and, in many cases, French administrative requirements.',
          '**TEF Canada and TCF Canada** are tests accepted by IRCC for Canadian immigration. Results are generally valid for two years, so plan your test date around your application timeline.',
          'If you are unsure, build a solid general foundation to A2 first. The core French is the same; exam-specific practice can come later.',
        ],
      },
      {
        type: 'p',
        text: 'For a detailed comparison of the Canadian tests, read [TEF Canada vs TCF Canada: which test should you take?](/blog/tef-canada-vs-tcf-canada).',
      },
      { type: 'h2', text: 'Daily habits that make the difference' },
      {
        type: 'ol',
        items: [
          'Study a little every day. Twenty to thirty focused minutes daily usually beats one long session a week.',
          'Speak from the first week. Read aloud, shadow short audio clips and record yourself. Speaking is the skill most Bangladeshi learners neglect, and often the one exams punish most.',
          'Keep a vocabulary notebook or flashcard deck with whole phrases, not single words, and always note the gender of nouns.',
          'Write something short several times a week and get it corrected. Uncorrected writing tends to repeat the same mistakes.',
          'Review regularly. Spend part of each week revisiting old lessons instead of only rushing forward.',
          'Track your progress with mock tests every few weeks once you pass A2.',
        ],
      },
      { type: 'h2', text: 'Classes, recorded courses or self-study?' },
      {
        type: 'p',
        text: 'Self-study with apps and videos is a good start and a useful supplement, but most learners find it hard to reach B1 or B2 alone, mainly because speaking and writing need feedback. Live classes give you structure, deadlines and correction. Recorded courses suit people with unpredictable schedules who still want a guided path. Many learners combine them: live classes for speaking and feedback, recordings for revision.',
      },
      {
        type: 'p',
        text: 'You can browse our [live online courses](/courses) for DELF, TEF Canada and TCF Canada, or explore our [recorded courses](/recorded) if you prefer to learn at your own pace.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'A realistic mindset',
        text: 'Progress in a language is rarely a straight line. Plateaus are normal, especially around A2 and B1. If you keep showing up, speaking and getting feedback, the next jump usually comes.',
      },
      {
        type: 'cta',
        title: 'Start with your real level',
        text: 'Take our free French level test to see where you stand, then pick the course that fits your goal and schedule.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/courses',
        secondaryLabel: 'Browse courses',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'আগের যেকোনো সময়ের চেয়ে এখন বেশি বাংলাদেশি শিক্ষার্থী ও পেশাজীবী ফরাসি ভাষা শিখছেন, আর কারণগুলোও ভিন্ন ভিন্ন: কানাডায় ইমিগ্রেশনের পরিকল্পনা, ফ্রান্সে মাস্টার্স, আন্তর্জাতিক প্রতিষ্ঠানে চাকরি, কিংবা শুধুই আগ্রহ। সুখবর হলো, শূন্য থেকে আপার-ইন্টারমিডিয়েট লেভেল পর্যন্ত পথটি বেশ পরিষ্কারভাবে চিহ্নিত। আসল চ্যালেঞ্জ হলো পুরো পথটুকু ধৈর্য ধরে নিয়মিত হাঁটা। এই রোডম্যাপে পুরো প্রক্রিয়াটিকে কয়েকটি ধাপে ভাগ করা হয়েছে, যাতে আপনি সবসময় জানেন এখন কী শিখছেন এবং কেন।',
      },
      { type: 'h2', text: 'আগে লেভেলগুলো বুঝে নিন: A1 থেকে C2' },
      {
        type: 'p',
        text: 'ফরাসি ভাষার দক্ষতা সাধারণত Common European Framework of Reference (CEFR) দিয়ে মাপা হয়। এর ছয়টি লেভেল: A1 ও A2 (বেসিক ইউজার), B1 ও B2 (ইন্ডিপেন্ডেন্ট ইউজার), এবং C1 ও C2 (প্রফিশিয়েন্ট ইউজার)। "A0" হলো একদম নতুন শিক্ষার্থীর জন্য অনানুষ্ঠানিক একটি নাম। DELF, TEF Canada, TCF Canada — সব পরীক্ষাই এই লেভেলগুলোকে ঘিরে তৈরি। তাই লেভেলগুলো একবার বুঝে গেলে যেকোনো কোর্সের বিবরণ বা পরীক্ষার শর্ত পড়া অনেক সহজ হয়ে যায়।',
      },
      {
        type: 'p',
        text: 'বাংলাদেশি শিক্ষার্থীরা যেসব লক্ষ্য নিয়ে ফরাসি শিখতে আসেন, তার বেশিরভাগই A2 থেকে B2-এর মধ্যে। কানাডার ইমিগ্রেশনে ফরাসির জন্য উল্লেখযোগ্য পয়েন্ট শুরু হয় মোটামুটি NCLC 7 থেকে, যাকে অনেকেই B2 লেভেলের লক্ষ্য হিসেবে ধরেন। ফরাসি ভাষায় পড়ানো বিশ্ববিদ্যালয়ের প্রোগ্রামগুলো সাধারণত B2 চায়। আর ফরাসিভাষী পরিবেশে দৈনন্দিন জীবন ও কাজ স্বাচ্ছন্দ্যে চালাতে মোটামুটি B1 থেকে B2 দরকার হয়।',
      },
      { type: 'h2', text: 'কত সময় লাগে? সৎ একটি হিসাব' },
      {
        type: 'p',
        text: 'প্রচলিত হিসাব অনুযায়ী A1-এ পৌঁছাতে মোটামুটি ৬০–১০০ ঘণ্টা গাইডেড লার্নিং লাগে, A2-এর জন্য মোট ১৬০–২০০ ঘণ্টা, B1-এর জন্য ৩৫০–৪০০ ঘণ্টা এবং B2-এর জন্য ৫৫০–৬৫০ ঘণ্টা। এই সংখ্যাগুলোর মধ্যে ক্লাসের সময় ও কিছু গাইডেড অনুশীলন ধরা আছে, এবং মানুষভেদে এগুলো অনেক বদলায়। আগে অন্য ভাষা শেখার অভিজ্ঞতা, কত ঘন ঘন পড়ছেন, আর বাস্তবে কতটা কথা বলছেন — সবকিছুরই প্রভাব আছে।',
      },
      {
        type: 'p',
        text: 'বাস্তবে, যিনি সপ্তাহে দুই-তিনটি ক্লাস করেন এবং প্রতিদিন অল্প অল্প পড়েন, শুরুর দিকে তাঁর প্রতিটি লেভেলে সাধারণত কয়েক মাস লাগে; আর B1 ও B2-তে আরও বেশি, কারণ সেখানে কঠিনতার লাফটা বড়। কেউ যদি বলে "কয়েক সপ্তাহেই B2", সেই প্রতিশ্রুতিতে সন্দেহ রাখুন। মাঝে মাঝে একটানা লম্বা পড়ার চেয়ে প্রতি সপ্তাহের নিয়মিত সময় অনেক বেশি কার্যকর।',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'আপনার আসল শুরুর জায়গাটা জেনে নিন',
        text: 'আগে কিছুটা ফরাসি পড়ে থাকলে আপনি হয়তো A0-তে নেই। কোর্স বেছে নেওয়ার আগে আমাদের [ফ্রি ফ্রেঞ্চ লেভেল টেস্ট](/quiz/placement-test) দিয়ে নিন, যাতে জানা জিনিস আবার পড়তে না হয়, আবার দরকারি ভিত্তিও বাদ না পড়ে।',
      },
      { type: 'h2', text: 'রোডম্যাপ: ধাপে ধাপে' },
      { type: 'h3', text: 'ধাপ ১ — A0 থেকে A1: উচ্চারণ, প্রাথমিক যোগাযোগ ও কাঠামো' },
      {
        type: 'p',
        text: 'প্রথম লক্ষ্য হলো ফরাসি ধ্বনিগুলো ঠিকভাবে শোনা ও বলা, আর সহজ, পূর্বানুমেয় পরিস্থিতি সামলাতে পারা। মনোযোগ দিন:',
      },
      {
        type: 'ul',
        items: [
          'উচ্চারণের মূল বিষয়: নাসিক্য স্বরধ্বনি (an, on, in), ফরাসি "u", শব্দের শেষে না-উচ্চারিত অক্ষর এবং ফরাসি "r"।',
          'অভিবাদন, নিজের পরিচয় দেওয়া, সংখ্যা, তারিখ, সময়, পরিবার, খাবার ও পথনির্দেশ।',
          'মূল গ্রামার: আর্টিকেল (le, la, un, une), বিশেষ্যের লিঙ্গ, être, avoir ও নিয়মিত -er ক্রিয়ার বর্তমান কাল, সহজ প্রশ্ন ও নেতিবাচক বাক্য।',
          'প্রতিদিন অল্প শোনা: ধীরগতির ফরাসি পডকাস্ট বা বিগিনার ভিডিও, দিনে দশ মিনিট হলেও।',
        ],
      },
      {
        type: 'p',
        text: 'এই ধাপের শেষে আপনি একটি সহজ ফর্ম পূরণ করতে, ছোট একটি মেসেজ লিখতে এবং ধীরে ধীরে সাধারণ কথোপকথন চালাতে পারবেন। আমাদের [DELF A1 কোর্স](/courses/delf-a1) ঠিক এই ধারাবাহিকতা অনুসরণ করে।',
      },
      { type: 'h3', text: 'ধাপ ২ — A1 থেকে A2: দৈনন্দিন জীবন' },
      {
        type: 'p',
        text: 'A2 মানে নিজের দৈনন্দিন রুটিন, অতীত আর পরিকল্পনা বর্ণনা করতে পারা। এই ধাপে আপনি passé composé ও imparfait, নিকট ভবিষ্যৎ, রিফ্লেক্সিভ ক্রিয়া, অবজেক্ট প্রোনাউন শিখবেন, সাথে কেনাকাটা, ভ্রমণ, স্বাস্থ্য, কাজ ও বাসস্থান-সংক্রান্ত শব্দভান্ডার। ৬০–৮০ শব্দের ছোট লেখা লিখতে শুরু করুন এবং এক-দুই মিনিট কথা বলে নিজের রেকর্ডিং করুন। অনেকেই এখানে আটকে যান, কারণ হঠাৎ গ্রামার ভারী মনে হয়। সমাধান হলো শুধু টেবিল মুখস্থ না করে বাস্তব বাক্যে সেগুলো ব্যবহার করে যাওয়া।',
      },
      { type: 'h3', text: 'ধাপ ৩ — A2 থেকে B1: স্বাধীনভাবে ভাষা ব্যবহার' },
      {
        type: 'p',
        text: 'B1 হলো মোড় ঘোরানোর লেভেল। এখানে আপনি "টিকে থাকার ফরাসি" থেকে মতামত প্রকাশ, গল্প বলা আর অপ্রত্যাশিত পরিস্থিতি সামলানোর দিকে এগোন। গুরুত্বপূর্ণ বিষয়: পরিচিত অভিব্যক্তিতে subjonctif, conditionnel, রিলেটিভ প্রোনাউন (qui, que, où, dont), এবং ভাবনা জোড়া দেওয়ার শব্দ (cependant, donc, par contre)। লম্বা আর্টিকেল পড়া আর ফরাসি সাবটাইটেলসহ ফরাসি কনটেন্ট দেখা এখন বাস্তবসম্মত হয়ে ওঠে। কথা বলার অনুশীলন অনেক বাড়াতে হবে: প্রতিটি ক্লাসে আপনার কথা বলা উচিত, শুধু শোনা নয়।',
      },
      { type: 'h3', text: 'ধাপ ৪ — B1 থেকে B2: যুক্তি, ব্যাখ্যা ও বোঝানো' },
      {
        type: 'p',
        text: 'B2-তে আপনাকে সমসাময়িক বিষয়ে মোটামুটি জটিল লেখা ও অডিও বুঝতে হবে, এবং কথায় ও লেখায় স্পষ্টভাবে নিজের মত যুক্তি দিয়ে তুলে ধরতে হবে। পরীক্ষার কৌশল এখানেই সবচেয়ে গুরুত্বপূর্ণ: গোছানো রচনা, সময় ধরে পড়া, শুনতে শুনতে নোট নেওয়া এবং চাপের মধ্যে স্বতঃস্ফূর্তভাবে কথা বলা। এই ধাপে আগের ধাপগুলোর চেয়ে বেশি সময় লাগবে, এটা ধরে নিন। শিক্ষকের কাছ থেকে লেখা ও স্পিকিংয়ের নিয়মিত ফিডব্যাক এখানে সবচেয়ে বড় গতিবর্ধক।',
      },
      { type: 'h2', text: 'লক্ষ্য ঠিক করুন: DELF নাকি TEF/TCF?' },
      {
        type: 'p',
        text: 'আপনার লক্ষ্যই ঠিক করবে কোন পরীক্ষার প্রস্তুতি নেবেন। আগেভাগে সিদ্ধান্ত নেওয়া ভালো, কারণ প্রতিটি পরীক্ষার টাস্কের ধরন আলাদা।',
      },
      {
        type: 'ul',
        items: [
          '**DELF (A1–B2)** হলো France Éducation international-এর একটি ডিপ্লোমা। এর মেয়াদ শেষ হয় না, তাই পড়াশোনা, সিভি এবং অনেক ক্ষেত্রে ফ্রান্সের প্রশাসনিক শর্ত পূরণে এটি কাজে লাগে।',
          '**TEF Canada ও TCF Canada** হলো কানাডার ইমিগ্রেশনের জন্য IRCC-স্বীকৃত পরীক্ষা। ফলাফল সাধারণত দুই বছর বৈধ থাকে, তাই আবেদনের সময়সূচি মিলিয়ে পরীক্ষার তারিখ ঠিক করুন।',
          'নিশ্চিত না হলে আগে A2 পর্যন্ত মজবুত সাধারণ ভিত্তি গড়ুন। মূল ফরাসি একই; পরীক্ষাভিত্তিক অনুশীলন পরে শুরু করা যায়।',
        ],
      },
      {
        type: 'p',
        text: 'কানাডার দুটি পরীক্ষার বিস্তারিত তুলনা জানতে পড়ুন [TEF Canada বনাম TCF Canada: কোন পরীক্ষাটি দেবেন?](/blog/tef-canada-vs-tcf-canada)।',
      },
      { type: 'h2', text: 'যে দৈনিক অভ্যাসগুলো পার্থক্য গড়ে দেয়' },
      {
        type: 'ol',
        items: [
          'প্রতিদিন একটু করে পড়ুন। সপ্তাহে একবার লম্বা সময়ের চেয়ে প্রতিদিন বিশ-ত্রিশ মিনিট মনোযোগী পড়া সাধারণত বেশি কাজে দেয়।',
          'প্রথম সপ্তাহ থেকেই কথা বলুন। জোরে পড়ুন, ছোট অডিও শুনে সাথে সাথে বলুন (শ্যাডোয়িং) এবং নিজের রেকর্ডিং করুন। বাংলাদেশি শিক্ষার্থীরা সবচেয়ে বেশি অবহেলা করেন স্পিকিং, আর পরীক্ষায় প্রায়ই সেখানেই সবচেয়ে বেশি নম্বর কাটে।',
          'আলাদা শব্দ নয়, পুরো ফ্রেজ দিয়ে একটি ভোকাবুলারি খাতা বা ফ্ল্যাশকার্ড রাখুন, আর বিশেষ্যের লিঙ্গ সবসময় লিখে রাখুন।',
          'সপ্তাহে কয়েকবার ছোট কিছু লিখুন এবং সংশোধন করিয়ে নিন। সংশোধন ছাড়া লেখায় একই ভুল বারবার ফিরে আসে।',
          'নিয়মিত রিভিশন দিন। শুধু সামনে না ছুটে প্রতি সপ্তাহের কিছু সময় পুরোনো পাঠে ফিরে যান।',
          'A2 পার হওয়ার পর কয়েক সপ্তাহ পরপর মক টেস্ট দিয়ে নিজের অগ্রগতি যাচাই করুন।',
        ],
      },
      { type: 'h2', text: 'লাইভ ক্লাস, রেকর্ডেড কোর্স নাকি নিজে নিজে?' },
      {
        type: 'p',
        text: 'অ্যাপ ও ভিডিও দিয়ে নিজে নিজে শুরু করা ভালো, আর সহায়ক হিসেবেও কাজে লাগে। তবে বেশিরভাগ শিক্ষার্থীর পক্ষে একা B1 বা B2-তে পৌঁছানো কঠিন, মূলত কারণ স্পিকিং ও রাইটিংয়ে ফিডব্যাক লাগে। লাইভ ক্লাস দেয় কাঠামো, সময়সীমা আর সংশোধন। যাঁদের সময়সূচি অনিশ্চিত কিন্তু গাইডেড পথ চান, তাঁদের জন্য রেকর্ডেড কোর্স মানানসই। অনেকে দুটো মিলিয়ে নেন: স্পিকিং ও ফিডব্যাকের জন্য লাইভ ক্লাস, রিভিশনের জন্য রেকর্ডিং।',
      },
      {
        type: 'p',
        text: 'DELF, TEF Canada ও TCF Canada-র জন্য আমাদের [লাইভ অনলাইন কোর্সগুলো](/courses) দেখে নিতে পারেন, অথবা নিজের গতিতে শিখতে চাইলে আমাদের [রেকর্ডেড কোর্স](/recorded) ঘুরে দেখুন।',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'বাস্তবসম্মত মানসিকতা',
        text: 'ভাষা শেখার অগ্রগতি খুব কমই সরলরেখায় চলে। কিছুদিন থমকে থাকা স্বাভাবিক, বিশেষ করে A2 ও B1-এর আশেপাশে। নিয়মিত ক্লাসে থাকলে, কথা বললে আর ফিডব্যাক নিলে পরের লাফটা সাধারণত আসেই।',
      },
      {
        type: 'cta',
        title: 'আপনার আসল লেভেল দিয়ে শুরু করুন',
        text: 'ফ্রি ফ্রেঞ্চ লেভেল টেস্ট দিয়ে জেনে নিন আপনি কোথায় আছেন, তারপর লক্ষ্য ও সময়সূচি অনুযায়ী উপযুক্ত কোর্স বেছে নিন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/courses',
        secondaryLabel: 'কোর্সগুলো দেখুন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Can I learn French in Bangladesh without going to France?', bn: 'ফ্রান্সে না গিয়েও কি বাংলাদেশে ফরাসি শেখা সম্ভব?' },
      a: {
        en: 'Yes. Many learners reach B1 or B2 through structured classes, regular speaking practice and exam preparation from Bangladesh. Live online classes make good teachers accessible wherever you live.',
        bn: 'হ্যাঁ। অনেকেই বাংলাদেশে বসেই গোছানো ক্লাস, নিয়মিত কথা বলার অনুশীলন ও পরীক্ষার প্রস্তুতির মাধ্যমে B1 বা B2-তে পৌঁছান। লাইভ অনলাইন ক্লাসের কারণে যেখানেই থাকুন, ভালো শিক্ষকের কাছে পৌঁছানো এখন সহজ।',
      },
    },
    {
      q: { en: 'How long does it take to go from zero to B2 in French?', bn: 'শূন্য থেকে ফরাসি B2-তে পৌঁছাতে কত সময় লাগে?' },
      a: {
        en: 'Common estimates put B2 at roughly 550–650 guided hours in total, but it varies widely. With regular classes and daily practice, most learners should plan in terms of many months to a couple of years rather than weeks.',
        bn: 'প্রচলিত হিসাবে B2-র জন্য মোট মোটামুটি ৫৫০–৬৫০ ঘণ্টা গাইডেড লার্নিং লাগে, তবে মানুষভেদে অনেক পার্থক্য হয়। নিয়মিত ক্লাস ও প্রতিদিনের অনুশীলন থাকলেও সপ্তাহের হিসাবে নয়, বরং অনেক মাস থেকে এক-দুই বছরের পরিকল্পনা করাই বাস্তবসম্মত।',
      },
    },
    {
      q: { en: 'Should I start with DELF or TEF/TCF preparation?', bn: 'DELF দিয়ে শুরু করব, নাকি TEF/TCF-এর প্রস্তুতি দিয়ে?' },
      a: {
        en: 'Start with general French up to about A2, because the foundations are the same. Then choose based on your goal: DELF for a lifelong diploma, TEF Canada or TCF Canada for Canadian immigration.',
        bn: 'মোটামুটি A2 পর্যন্ত সাধারণ ফরাসি দিয়ে শুরু করুন, কারণ ভিত্তি একই। এরপর লক্ষ্য অনুযায়ী বেছে নিন: আজীবন বৈধ ডিপ্লোমার জন্য DELF, কানাডার ইমিগ্রেশনের জন্য TEF Canada বা TCF Canada।',
      },
    },
    {
      q: { en: 'Is French hard for Bangla speakers?', bn: 'বাংলাভাষীদের জন্য কি ফরাসি কঠিন?' },
      a: {
        en: 'Some parts take extra effort, such as noun gender, articles and nasal vowels, which Bangla doesn’t have. Other parts, like formal and informal "you", feel familiar. With consistent practice it is very learnable.',
        bn: 'কিছু বিষয়ে বাড়তি পরিশ্রম লাগে, যেমন বিশেষ্যের লিঙ্গ, আর্টিকেল ও নাসিক্য স্বরধ্বনি, যা বাংলায় এভাবে নেই। আবার কিছু বিষয়, যেমন সম্মানসূচক ও ঘনিষ্ঠ "তুমি/আপনি", বেশ পরিচিত লাগে। নিয়মিত অনুশীলন করলে ফরাসি ভালোভাবেই শেখা যায়।',
      },
    },
  ],
};
const post02: BlogPost = {
  slug: 'tef-canada-vs-tcf-canada',
  date: '2026-09-10T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.canada,
  tags: ['tef canada', 'tcf canada', 'express entry', 'nclc', 'french test'],
  cover: { theme: 'canada', icon: 'scale', label: { en: 'TEF vs TCF', bn: 'TEF vs TCF' } },
  title: {
    en: 'TEF Canada vs TCF Canada: Which French Test Should You Take?',
    bn: 'TEF Canada নাকি TCF Canada: আপনার জন্য কোন ফ্রেঞ্চ পরীক্ষা?',
  },
  metaTitle: {
    en: 'TEF Canada vs TCF Canada: Which Test to Take?',
    bn: 'TEF Canada বনাম TCF Canada: কোন পরীক্ষা দেবেন?',
  },
  metaDescription: {
    en: 'Compare TEF Canada and TCF Canada: who runs them, module formats, scoring and NCLC conversion, and how Bangladeshi candidates can choose.',
    bn: 'TEF Canada ও TCF Canada-র তুলনা: কারা পরিচালনা করে, মডিউলের ফরম্যাট, স্কোরিং ও NCLC রূপান্তর, এবং বাংলাদেশি পরীক্ষার্থীরা কীভাবে বেছে নেবেন।',
  },
  excerpt: {
    en: 'Both tests are accepted by IRCC for Express Entry, but they feel different on exam day. Here is how the modules, task styles and scoring compare, and how to pick the one that suits you.',
    bn: 'Express Entry-র জন্য IRCC দুটো পরীক্ষাই গ্রহণ করে, কিন্তু পরীক্ষার দিনে অভিজ্ঞতা আলাদা। মডিউল, টাস্কের ধরন ও স্কোরিং কীভাবে তুলনা করবেন এবং নিজের জন্য সঠিকটি কীভাবে বেছে নেবেন, তা এখানে।',
  },
  coverAlt: {
    en: 'Illustrated cover: a maple leaf beside a balance scale with the words TEF vs TCF',
    bn: 'ইলাস্ট্রেটেড কভার: ম্যাপল পাতার পাশে একটি দাঁড়িপাল্লা, লেখা TEF vs TCF',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'If you are planning to use French for Canadian immigration, sooner or later you face the same question: TEF Canada or TCF Canada? Both are recognised by Immigration, Refugees and Citizenship Canada (IRCC) as proof of French ability for Express Entry and other programs. Neither is “easier” in any official sense. They measure the same four skills and convert to the same NCLC scale. What differs is the format, the style of the tasks, and how comfortable you will feel on the day. This guide walks through those differences so you can choose with a clear head.',
      },
      { type: 'h2', text: 'Who runs each test' },
      {
        type: 'p',
        text: '**TEF Canada** (Test d’évaluation de français) is developed by the Paris Île-de-France Chamber of Commerce and Industry (CCI Paris Île-de-France). **TCF Canada** (Test de connaissance du français) is developed by France Éducation international, the same public body behind the DELF and DALF diplomas. Both organisations license approved test centres around the world, and both publish an official candidate handbook with sample tasks. Read the handbook of whichever test you are considering before you book anything.',
      },
      {
        type: 'p',
        text: 'For IRCC purposes, results from both tests are generally valid for two years from the test date. Plan your timeline so your scores are still valid when you create your Express Entry profile and, if invited, when you submit your application.',
      },
      { type: 'h2', text: 'How the modules compare' },
      {
        type: 'p',
        text: 'Both tests have four compulsory modules for Canadian immigration: listening, reading, writing and speaking. The timings below are approximate and based on the official handbooks; check the current version before your exam.',
      },
      { type: 'h3', text: 'TEF Canada at a glance' },
      {
        type: 'ul',
        items: [
          '**Listening (compréhension orale):** about 40 minutes of multiple-choice questions based on recordings such as announcements, conversations and radio extracts.',
          '**Reading (compréhension écrite):** about 60 minutes of multiple-choice questions on everyday documents, articles and longer texts.',
          '**Writing (expression écrite):** about 60 minutes for two tasks, typically continuing a short news story and writing a text that defends a point of view.',
          '**Speaking (expression orale):** about 15 minutes with an examiner, in two parts: asking questions to obtain information, and persuading someone in a more argumentative exchange.',
        ],
      },
      { type: 'h3', text: 'TCF Canada at a glance' },
      {
        type: 'ul',
        items: [
          '**Listening:** about 35 minutes, 39 multiple-choice questions that get progressively harder.',
          '**Reading:** about 60 minutes, 39 multiple-choice questions, also in increasing order of difficulty.',
          '**Writing:** about 60 minutes for three tasks, moving from a short practical message to a longer text and a task where you compare or discuss opinions.',
          '**Speaking:** about 12 minutes with an examiner, in three tasks: a guided interview, an interaction where you ask questions, and expressing and defending an opinion.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Formats do change',
        text: 'TEF Canada changed its scoring scale in December 2023, and both organisations update task details from time to time. Treat any timing or task description, including the ones here, as a guide and confirm it in the latest official handbook.',
      },
      { type: 'h2', text: 'Scoring and NCLC conversion' },
      {
        type: 'p',
        text: 'IRCC does not compare raw TEF and TCF scores directly. Instead, it converts each skill score into a level on the Niveaux de compétence linguistique canadiens (NCLC), the French counterpart of the Canadian Language Benchmarks (CLB). Your Express Entry points are based on those NCLC levels, skill by skill.',
      },
      {
        type: 'p',
        text: 'The two tests use different scales. TCF Canada, for example, scores writing and speaking on a 0–20 scale, while listening and reading use a larger numeric scale. TEF Canada uses its own numeric scale for each module. Because the conversion tables are official and can be revised, we do not reproduce them here: look up the current equivalency table on IRCC’s official website and use that as your reference.',
      },
      {
        type: 'p',
        text: 'For many candidates, the key target is NCLC 7 in all four skills, because that level unlocks significant additional CRS points. If you want to understand exactly what that level means, read our guide to [CLB 7 and NCLC 7 in French](/blog/clb-7-french-nclc-7-guide), then try different NCLC scores in our [CRS calculator](/crs-calculator) to see how much they could change your profile.',
      },
      { type: 'h2', text: 'How to choose: the practical factors' },
      { type: 'h3', text: '1. Availability of sessions' },
      {
        type: 'p',
        text: 'This often decides the matter. Test availability in Bangladesh varies over time, and session dates fill up. Check which test centres currently offer each test (Alliance Française is the first place many candidates look), how often sessions run, and how quickly results are released. Some candidates end up sitting the test in another country, which adds travel cost and planning. Always confirm dates, fees and registration rules directly with the test centre or the official site.',
      },
      { type: 'h3', text: '2. Your strengths and weaknesses' },
      {
        type: 'p',
        text: 'Look honestly at your profile. If speaking under pressure is your weak point, compare the TEF’s two longer speaking tasks with the TCF’s three shorter ones and think about which structure gives you more room to recover from a slow start. If writing is your concern, compare producing two longer texts (TEF) with three texts of increasing length (TCF). Neither structure is objectively better; one will simply suit you more.',
      },
      { type: 'h3', text: '3. Comfort with the format' },
      {
        type: 'p',
        text: 'The best way to decide is to try both. Work through official sample tasks for each test under timed conditions. Notice which reading questions feel natural to you, which listening format you can follow, and which writing prompts you can plan quickly. Many learners find a clear preference after one or two practice sessions.',
      },
      { type: 'h3', text: '4. Your overall timeline' },
      {
        type: 'p',
        text: 'Count backwards from when you want your Express Entry profile ready. Allow time for preparation, booking, the exam itself, results, and a possible retake. A test with an earlier available session may be worth more to you than a small preference in format.',
      },
      { type: 'h2', text: 'A preparation strategy that works for either test' },
      {
        type: 'ol',
        items: [
          'Find your real starting level first. A quick diagnostic such as our free [level test](/quiz/placement-test) tells you whether you need foundation work before exam practice.',
          'Build general French to a solid B1–B2 base. Exam tricks cannot replace vocabulary, grammar and listening stamina.',
          'Switch to test-specific practice about two to three months before your exam, using official sample material for the test you chose.',
          'Practise speaking with a teacher who can time you, interrupt you, and push you to justify opinions, just as an examiner would.',
          'Take full mock tests under exam timing, then focus your remaining weeks on your weakest skill, because every skill needs to reach your target NCLC level.',
        ],
      },
      {
        type: 'p',
        text: 'At We Learn French BD we run separate live online programmes for [TEF Canada](/courses/tef-canada) and [TCF Canada](/courses/tcf-canada), with mock tests and speaking practice built around each format. If you are still undecided, a teacher can look at your level and your timeline and help you choose before you commit.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Do not switch tests too late',
        text: 'Changing from one test to the other a few weeks before the exam usually costs more than it gains. Decide early, then practise only that format.',
      },
      {
        type: 'cta',
        title: 'Not sure which test fits you?',
        text: 'Take our free French level test, then talk to us about the TEF Canada or TCF Canada programme that matches your level and timeline.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/courses/tef-canada',
        secondaryLabel: 'See TEF Canada course',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'কানাডায় ইমিগ্রেশনের জন্য ফরাসি ভাষা কাজে লাগাতে চাইলে একসময় না একসময় একই প্রশ্নে এসে দাঁড়াতে হয়: TEF Canada নাকি TCF Canada? Express Entry ও অন্যান্য প্রোগ্রামে ফরাসি দক্ষতার প্রমাণ হিসেবে Immigration, Refugees and Citizenship Canada (IRCC) দুটো পরীক্ষাকেই স্বীকৃতি দেয়। অফিশিয়ালি কোনোটিই “সহজ” নয়। দুটোই একই চারটি দক্ষতা যাচাই করে এবং একই NCLC স্কেলে রূপান্তরিত হয়। পার্থক্য হলো ফরম্যাটে, টাস্কের ধরনে এবং পরীক্ষার দিনে আপনি কতটা স্বচ্ছন্দ বোধ করবেন তাতে। এই লেখায় সেই পার্থক্যগুলো ধাপে ধাপে দেখানো হলো, যাতে আপনি ঠান্ডা মাথায় সিদ্ধান্ত নিতে পারেন।',
      },
      { type: 'h2', text: 'কোন পরীক্ষা কারা পরিচালনা করে' },
      {
        type: 'p',
        text: '**TEF Canada** (Test d’évaluation de français) তৈরি করে প্যারিস ইল-দ্য-ফ্রঁস চেম্বার অব কমার্স অ্যান্ড ইন্ডাস্ট্রি (CCI Paris Île-de-France)। **TCF Canada** (Test de connaissance du français) তৈরি করে France Éducation international, যে সরকারি প্রতিষ্ঠান DELF ও DALF ডিপ্লোমাও পরিচালনা করে। দুই প্রতিষ্ঠানই বিশ্বজুড়ে অনুমোদিত টেস্ট সেন্টারের মাধ্যমে পরীক্ষা নেয় এবং নমুনা টাস্কসহ অফিশিয়াল পরীক্ষার্থী হ্যান্ডবুক প্রকাশ করে। কোনো কিছু বুক করার আগে আপনি যে পরীক্ষার কথা ভাবছেন, তার হ্যান্ডবুকটি অবশ্যই পড়ে নিন।',
      },
      {
        type: 'p',
        text: 'IRCC-র ক্ষেত্রে দুটো পরীক্ষার ফলই সাধারণত পরীক্ষার তারিখ থেকে দুই বছর বৈধ থাকে। তাই এমনভাবে সময় পরিকল্পনা করুন, যাতে Express Entry প্রোফাইল খোলার সময় এবং আমন্ত্রণ পেলে আবেদন জমা দেওয়ার সময়ও আপনার স্কোর বৈধ থাকে।',
      },
      { type: 'h2', text: 'মডিউলগুলোর তুলনা' },
      {
        type: 'p',
        text: 'কানাডার ইমিগ্রেশনের জন্য দুটো পরীক্ষাতেই চারটি বাধ্যতামূলক মডিউল আছে: লিসেনিং, রিডিং, রাইটিং ও স্পিকিং। নিচের সময়গুলো আনুমানিক এবং অফিশিয়াল হ্যান্ডবুকের ভিত্তিতে দেওয়া; পরীক্ষার আগে সর্বশেষ সংস্করণ মিলিয়ে নিন।',
      },
      { type: 'h3', text: 'এক নজরে TEF Canada' },
      {
        type: 'ul',
        items: [
          '**লিসেনিং (compréhension orale):** প্রায় ৪০ মিনিট; ঘোষণা, কথোপকথন, রেডিওর অংশ ইত্যাদি রেকর্ডিং শুনে মাল্টিপল-চয়েস প্রশ্ন।',
          '**রিডিং (compréhension écrite):** প্রায় ৬০ মিনিট; দৈনন্দিন ডকুমেন্ট, প্রবন্ধ ও দীর্ঘ লেখার ওপর মাল্টিপল-চয়েস প্রশ্ন।',
          '**রাইটিং (expression écrite):** প্রায় ৬০ মিনিটে দুটি টাস্ক; সাধারণত একটি ছোট সংবাদ-কাহিনি এগিয়ে নেওয়া এবং একটি মতামতের পক্ষে যুক্তি দিয়ে লেখা।',
          '**স্পিকিং (expression orale):** পরীক্ষকের সঙ্গে প্রায় ১৫ মিনিট, দুই অংশে: প্রশ্ন করে তথ্য সংগ্রহ করা, এবং যুক্তি দিয়ে কাউকে রাজি করানো।',
        ],
      },
      { type: 'h3', text: 'এক নজরে TCF Canada' },
      {
        type: 'ul',
        items: [
          '**লিসেনিং:** প্রায় ৩৫ মিনিট, ৩৯টি মাল্টিপল-চয়েস প্রশ্ন, যেগুলো ক্রমশ কঠিন হয়।',
          '**রিডিং:** প্রায় ৬০ মিনিট, ৩৯টি মাল্টিপল-চয়েস প্রশ্ন, এটিও সহজ থেকে কঠিনের দিকে সাজানো।',
          '**রাইটিং:** প্রায় ৬০ মিনিটে তিনটি টাস্ক; ছোট একটি ব্যবহারিক বার্তা থেকে শুরু করে দীর্ঘতর লেখা, তারপর বিভিন্ন মতামত তুলনা বা আলোচনা।',
          '**স্পিকিং:** পরীক্ষকের সঙ্গে প্রায় ১২ মিনিট, তিনটি টাস্কে: গাইডেড ইন্টারভিউ, প্রশ্ন করে কথোপকথন চালানো, এবং নিজের মত প্রকাশ ও তার পক্ষে যুক্তি দেওয়া।',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'ফরম্যাট বদলায়',
        text: '২০২৩ সালের ডিসেম্বরে TEF Canada তাদের স্কোরিং স্কেল পরিবর্তন করেছে, আর দুই প্রতিষ্ঠানই মাঝে মাঝে টাস্কের খুঁটিনাটি হালনাগাদ করে। এখানে দেওয়া সময় বা টাস্কের বর্ণনাসহ যেকোনো তথ্যকে নির্দেশিকা হিসেবে নিন এবং সর্বশেষ অফিশিয়াল হ্যান্ডবুকে মিলিয়ে দেখুন।',
      },
      { type: 'h2', text: 'স্কোরিং ও NCLC রূপান্তর' },
      {
        type: 'p',
        text: 'IRCC সরাসরি TEF আর TCF-এর কাঁচা স্কোর তুলনা করে না। বরং প্রতিটি দক্ষতার স্কোরকে Niveaux de compétence linguistique canadiens (NCLC) স্কেলের একটি লেভেলে রূপান্তর করে। NCLC হলো Canadian Language Benchmarks (CLB)-এর ফরাসি সংস্করণ। আপনার Express Entry পয়েন্ট নির্ধারিত হয় দক্ষতাভিত্তিক এই NCLC লেভেল দিয়ে।',
      },
      {
        type: 'p',
        text: 'দুটো পরীক্ষার স্কেল আলাদা। যেমন, TCF Canada রাইটিং ও স্পিকিংয়ে ০ থেকে ২০ স্কেলে নম্বর দেয়, আর লিসেনিং ও রিডিংয়ে ব্যবহার করে বড় একটি সংখ্যাভিত্তিক স্কেল। TEF Canada প্রতিটি মডিউলের জন্য নিজস্ব সংখ্যাভিত্তিক স্কেল ব্যবহার করে। রূপান্তরের টেবিলগুলো অফিশিয়াল এবং সময়ে সময়ে সংশোধিত হতে পারে, তাই আমরা এখানে সেগুলো তুলে দিচ্ছি না। IRCC-র অফিশিয়াল ওয়েবসাইটে সর্বশেষ সমতুল্যতা টেবিল দেখে নিন এবং সেটিকেই মানদণ্ড ধরুন।',
      },
      {
        type: 'p',
        text: 'অনেক পরীক্ষার্থীর মূল লক্ষ্য থাকে চারটি দক্ষতাতেই NCLC 7, কারণ এই লেভেলে পৌঁছালে উল্লেখযোগ্য অতিরিক্ত CRS পয়েন্ট পাওয়া যায়। এই লেভেলের মানে ঠিক কী, তা জানতে আমাদের [ফরাসিতে CLB 7 ও NCLC 7 গাইড](/blog/clb-7-french-nclc-7-guide) পড়ুন, তারপর আমাদের [CRS ক্যালকুলেটরে](/crs-calculator) বিভিন্ন NCLC স্কোর বসিয়ে দেখুন আপনার প্রোফাইলে কতটা পরিবর্তন আসতে পারে।',
      },
      { type: 'h2', text: 'কীভাবে বেছে নেবেন: ব্যবহারিক বিষয়গুলো' },
      { type: 'h3', text: '১. পরীক্ষার সেশন পাওয়া যায় কি না' },
      {
        type: 'p',
        text: 'প্রায়ই এটাই সিদ্ধান্ত ঠিক করে দেয়। বাংলাদেশে কোন পরীক্ষা কখন পাওয়া যায়, তা সময়ের সঙ্গে বদলায় এবং সেশনের আসন দ্রুত ভরে যায়। বর্তমানে কোন টেস্ট সেন্টার কোন পরীক্ষা নেয় (অনেকে প্রথমে Alliance Française-এ খোঁজ নেন), কত ঘন ঘন সেশন হয় এবং ফল কত দিনে আসে, তা যাচাই করুন। কিছু পরীক্ষার্থীকে অন্য দেশে গিয়ে পরীক্ষা দিতে হয়, এতে যাতায়াতের খরচ ও পরিকল্পনা যোগ হয়। তারিখ, ফি ও রেজিস্ট্রেশনের নিয়ম সবসময় সরাসরি টেস্ট সেন্টার বা অফিশিয়াল সাইট থেকে নিশ্চিত করুন।',
      },
      { type: 'h3', text: '২. আপনার শক্তি ও দুর্বলতা' },
      {
        type: 'p',
        text: 'নিজের প্রোফাইলটা সৎভাবে দেখুন। চাপের মধ্যে কথা বলা যদি আপনার দুর্বল দিক হয়, তাহলে TEF-এর দুটি দীর্ঘ স্পিকিং টাস্কের সঙ্গে TCF-এর তিনটি ছোট টাস্কের তুলনা করুন। ভাবুন, কোন কাঠামোতে ধীর শুরুর পর সামলে নেওয়ার সুযোগ বেশি। রাইটিং নিয়ে দুশ্চিন্তা থাকলে দুটি দীর্ঘ লেখা (TEF) আর ক্রমশ বড় হওয়া তিনটি লেখার (TCF) মধ্যে তুলনা করুন। কোনো কাঠামোই নিরপেক্ষভাবে ভালো নয়; একটি আপনার সঙ্গে বেশি মানাবে, এটুকুই।',
      },
      { type: 'h3', text: '৩. ফরম্যাটের সঙ্গে স্বাচ্ছন্দ্য' },
      {
        type: 'p',
        text: 'সিদ্ধান্ত নেওয়ার সবচেয়ে ভালো উপায় হলো দুটোই চেষ্টা করে দেখা। প্রতিটি পরীক্ষার অফিশিয়াল নমুনা টাস্ক সময় ধরে সমাধান করুন। লক্ষ করুন কোন রিডিং প্রশ্ন আপনার কাছে স্বাভাবিক লাগে, কোন লিসেনিং ফরম্যাট আপনি অনুসরণ করতে পারেন, আর কোন রাইটিং প্রম্পটে দ্রুত পরিকল্পনা করতে পারেন। অনেক শিক্ষার্থী এক-দুইবার অনুশীলনের পরই স্পষ্ট পছন্দ খুঁজে পান।',
      },
      { type: 'h3', text: '৪. আপনার সামগ্রিক সময়সূচি' },
      {
        type: 'p',
        text: 'কবে আপনার Express Entry প্রোফাইল প্রস্তুত চান, সেখান থেকে পেছনের দিকে হিসাব করুন। প্রস্তুতি, বুকিং, পরীক্ষা, ফলাফল এবং সম্ভাব্য পুনঃপরীক্ষার জন্য সময় রাখুন। ফরম্যাটে সামান্য পছন্দের চেয়ে আগে সেশন পাওয়া যায় এমন পরীক্ষা আপনার জন্য বেশি মূল্যবান হতে পারে।',
      },
      { type: 'h2', text: 'যেকোনো পরীক্ষার জন্য কার্যকর প্রস্তুতি কৌশল' },
      {
        type: 'ol',
        items: [
          'প্রথমে নিজের আসল লেভেল জানুন। আমাদের ফ্রি [লেভেল টেস্টের](/quiz/placement-test) মতো একটি দ্রুত মূল্যায়ন বলে দেবে, পরীক্ষার অনুশীলনের আগে ভিত্তি মজবুত করতে হবে কি না।',
          'সাধারণ ফরাসিকে একটি শক্ত B1–B2 ভিত্তিতে নিয়ে যান। শব্দভান্ডার, গ্রামার আর লম্বা সময় ধরে শোনার সক্ষমতার বিকল্প কোনো পরীক্ষার কৌশল নয়।',
          'পরীক্ষার প্রায় দুই থেকে তিন মাস আগে নির্বাচিত পরীক্ষার অফিশিয়াল নমুনা দিয়ে পরীক্ষাভিত্তিক অনুশীলনে যান।',
          'এমন একজন শিক্ষকের সঙ্গে স্পিকিং অনুশীলন করুন, যিনি সময় ধরবেন, মাঝপথে প্রশ্ন করবেন এবং মতামতের পক্ষে যুক্তি দিতে চাপ দেবেন, ঠিক যেমন পরীক্ষক করেন।',
          'পরীক্ষার সময় মেনে পূর্ণাঙ্গ মক টেস্ট দিন, তারপর বাকি সপ্তাহগুলো সবচেয়ে দুর্বল দক্ষতায় মন দিন, কারণ প্রতিটি দক্ষতাকেই লক্ষ্যমাত্রার NCLC লেভেলে পৌঁছাতে হবে।',
        ],
      },
      {
        type: 'p',
        text: 'We Learn French BD-তে [TEF Canada](/courses/tef-canada) ও [TCF Canada](/courses/tcf-canada)-র জন্য আলাদা লাইভ অনলাইন প্রোগ্রাম আছে, যেখানে প্রতিটি পরীক্ষার ফরম্যাট অনুযায়ী মক টেস্ট ও স্পিকিং অনুশীলন রাখা হয়েছে। এখনো সিদ্ধান্ত নিতে না পারলে, একজন শিক্ষক আপনার লেভেল ও সময়সূচি দেখে ভর্তি হওয়ার আগেই বেছে নিতে সাহায্য করতে পারেন।',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'শেষ মুহূর্তে পরীক্ষা বদলাবেন না',
        text: 'পরীক্ষার কয়েক সপ্তাহ আগে এক পরীক্ষা থেকে আরেকটিতে গেলে সাধারণত লাভের চেয়ে ক্ষতি বেশি হয়। আগেভাগে সিদ্ধান্ত নিন, তারপর শুধু সেই ফরম্যাটই অনুশীলন করুন।',
      },
      {
        type: 'cta',
        title: 'কোন পরীক্ষা আপনার জন্য, নিশ্চিত নন?',
        text: 'আমাদের ফ্রি ফ্রেঞ্চ লেভেল টেস্ট দিন, তারপর আপনার লেভেল ও সময়সূচির সঙ্গে মেলে এমন TEF Canada বা TCF Canada প্রোগ্রাম নিয়ে আমাদের সঙ্গে কথা বলুন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/courses/tef-canada',
        secondaryLabel: 'TEF Canada কোর্স দেখুন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Is TEF Canada easier than TCF Canada?', bn: 'TEF Canada কি TCF Canada-র চেয়ে সহজ?' },
      a: {
        en: 'Neither test is officially easier. Both measure the same four skills and IRCC converts both to NCLC levels. Some candidates simply feel more comfortable with one format, so try official sample tasks for both before deciding.',
        bn: 'অফিশিয়ালি কোনোটিই সহজ নয়। দুটোই একই চারটি দক্ষতা যাচাই করে এবং IRCC দুটোকেই NCLC লেভেলে রূপান্তর করে। কেউ কেউ কোনো একটি ফরম্যাটে বেশি স্বচ্ছন্দ বোধ করেন, তাই সিদ্ধান্তের আগে দুটোরই অফিশিয়াল নমুনা টাস্ক চেষ্টা করুন।',
      },
    },
    {
      q: { en: 'Does IRCC accept both tests for Express Entry?', bn: 'Express Entry-র জন্য IRCC কি দুটো পরীক্ষাই গ্রহণ করে?' },
      a: {
        en: 'Yes, both TEF Canada and TCF Canada are accepted by IRCC as proof of French for Express Entry. Results are generally valid for two years. Always confirm current requirements on IRCC’s official website.',
        bn: 'হ্যাঁ, Express Entry-তে ফরাসির প্রমাণ হিসেবে IRCC দুটো পরীক্ষাই গ্রহণ করে। ফল সাধারণত দুই বছর বৈধ থাকে। বর্তমান শর্তাবলি সবসময় IRCC-র অফিশিয়াল ওয়েবসাইটে যাচাই করুন।',
      },
    },
    {
      q: { en: 'Can I take TEF Canada or TCF Canada in Bangladesh?', bn: 'বাংলাদেশে কি TEF Canada বা TCF Canada দেওয়া যায়?' },
      a: {
        en: 'Availability changes over time. Check with test centres such as Alliance Française and on the official TEF and TCF websites for current sessions, fees and registration rules.',
        bn: 'কোন পরীক্ষা পাওয়া যাবে, তা সময়ের সঙ্গে বদলায়। বর্তমান সেশন, ফি ও রেজিস্ট্রেশনের নিয়ম জানতে Alliance Française-এর মতো টেস্ট সেন্টার এবং TEF ও TCF-এর অফিশিয়াল ওয়েবসাইটে খোঁজ নিন।',
      },
    },
    {
      q: { en: 'How long should I prepare?', bn: 'কত দিন প্রস্তুতি নেওয়া উচিত?' },
      a: {
        en: 'It depends on your starting level. If you are already around B1–B2, focused exam practice of two to three months is common. Beginners need to build general French first, which takes considerably longer.',
        bn: 'এটি আপনার শুরুর লেভেলের ওপর নির্ভর করে। আপনি যদি আগে থেকেই B1–B2-এর কাছাকাছি থাকেন, তাহলে দুই থেকে তিন মাসের মনোযোগী পরীক্ষা-প্রস্তুতি প্রচলিত। নতুনদের আগে সাধারণ ফরাসি গড়ে তুলতে হয়, যাতে অনেক বেশি সময় লাগে।',
      },
    },
  ],
};
const post03: BlogPost = {
  slug: 'french-crs-points-express-entry',
  date: '2026-09-17T10:00:00+06:00',
  readMinutes: 7,
  category: BLOG_CATEGORIES.canada,
  tags: ['crs', 'express entry', 'nclc 7', 'tef canada', 'tcf canada', 'canada immigration'],
  cover: { theme: 'canada', icon: 'calculator', label: { en: '+62 CRS', bn: '+62 CRS' } },
  title: {
    en: 'How French Can Add 62 (or More) CRS Points in Express Entry',
    bn: 'Express Entry-তে ফ্রেঞ্চ কীভাবে ৬২ (বা তারও বেশি) CRS পয়েন্ট যোগ করতে পারে',
  },
  metaTitle: {
    en: 'French and CRS Points: How NCLC 7 Adds 62 Points',
    bn: 'ফ্রেঞ্চ ও CRS পয়েন্ট: NCLC 7-এ কীভাবে ৬২ পয়েন্ট আসে',
  },
  metaDescription: {
    en: 'Where the 62 CRS points for French come from, how NCLC 9 can raise them to 74, and how to estimate your Express Entry score before you book TEF or TCF.',
    bn: 'ফ্রেঞ্চের ৬২ CRS পয়েন্ট কোথা থেকে আসে, NCLC 9-এ কীভাবে তা ৭৪ হতে পারে, আর TEF বা TCF বুক করার আগে নিজের Express Entry স্কোর কীভাবে হিসাব করবেন।',
  },
  excerpt: {
    en: 'The famous “62 points” is not magic: it is 50 additional points plus 12 second-language points at NCLC 7. Here is the exact breakdown, when it can be higher, and how one weak skill can wipe most of it out.',
    bn: 'বহুল আলোচিত “৬২ পয়েন্ট” কোনো জাদু নয়: এটি NCLC 7-এ ৫০ অতিরিক্ত পয়েন্ট আর ১২ সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্টের যোগফল। পুরো হিসাব, কখন এটি আরও বেশি হয়, আর একটি দুর্বল স্কিল কীভাবে প্রায় সবটাই কেড়ে নিতে পারে, জেনে নিন।',
  },
  coverAlt: {
    en: 'Illustrated cover: red maple leaf with a calculator icon and the words +62 CRS',
    bn: 'ইলাস্ট্রেটেড কভার: লাল ম্যাপল পাতা, ক্যালকুলেটর আইকন এবং +62 CRS লেখা',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'Express Entry ranks candidates using the Comprehensive Ranking System (CRS), and language ability is one of the most heavily weighted factors in it. For most Bangladeshi applicants, English is the first official language. French, taken as a second official language, can earn points in two separate places in the CRS grid. Added together, they produce the “62 points” figure you see in Facebook groups and YouTube videos. This article shows exactly where that number comes from, when it can be higher or much lower, and how to check your own estimate before you spend money on a test.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Rules can change',
        text: 'The point values below follow the CRS criteria published by IRCC at the time of writing. IRCC can update them at any time, so confirm the current figures on IRCC’s official website before you make decisions.',
      },
      { type: 'h2', text: 'Where the 62 points come from' },
      {
        type: 'p',
        text: 'The 62 points are the sum of two different components. Understanding them separately is the key to understanding why some candidates get the full benefit and others get almost nothing.',
      },
      { type: 'h3', text: '1. Additional points for French-language skills (up to 50)' },
      { type: 'p', text: 'In the “additional points” section of the CRS, IRCC awards:' },
      {
        type: 'ul',
        items: [
          '**50 points** if you score NCLC 7 or higher in all four French skills (listening, reading, writing and speaking) **and** CLB 5 or higher in all four English skills.',
          '**25 points** if you score NCLC 7 or higher in all four French skills and CLB 4 or lower in English, or you have no English test result.',
        ],
      },
      {
        type: 'p',
        text: 'The important word is “all”. If even one French skill is at NCLC 6, these additional points drop to zero, even if the other three skills are at NCLC 9.',
      },
      { type: 'h3', text: '2. Second official language points (up to 24)' },
      {
        type: 'p',
        text: 'Separately, your French results are scored as your second official language. Each of the four abilities is scored on its own:',
      },
      {
        type: 'ul',
        items: [
          'NCLC 4 or lower: 0 points',
          'NCLC 5 or 6: 1 point per ability',
          'NCLC 7 or 8: 3 points per ability',
          'NCLC 9 or higher: 6 points per ability',
        ],
      },
      {
        type: 'p',
        text: 'The maximum in this section is 24 points for a single applicant and 22 points if a spouse or common-law partner is coming with you to Canada.',
      },
      { type: 'h3', text: 'Adding them up' },
      {
        type: 'p',
        text: 'With NCLC 7 in all four French skills and CLB 5 or higher in English, you get 4 × 3 = 12 second-language points plus 50 additional points, which equals **62 points**. That is the origin of the number.',
      },
      { type: 'h2', text: 'Can French add more than 62 points?' },
      {
        type: 'p',
        text: 'Yes. If you reach NCLC 9 or higher in all four French skills, your second-language points become 4 × 6 = 24 for a single applicant. Your French-related total then becomes 24 + 50 = 74 points. With an accompanying spouse, the second-language cap is 22, so the maximum becomes 72.',
      },
      {
        type: 'p',
        text: 'Mixed results fall in between. For example, NCLC 9 in reading and listening but NCLC 7 in writing and speaking gives 6 + 6 + 3 + 3 = 18 second-language points. Add the 50 additional points (assuming CLB 5+ in English) and you reach 68.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Protect your weakest skill',
        text: 'Writing and speaking are where most learners lose points. Because the 50 additional points depend on every skill being NCLC 7 or higher, a weak productive skill can cost you far more than a few points. Train it first, not last.',
      },
      { type: 'h2', text: 'Worked examples (illustrations only)' },
      {
        type: 'p',
        text: 'These simplified examples show how the French-related points behave. They are not predictions of anyone’s total CRS score or of their chance of receiving an invitation.',
      },
      { type: 'h3', text: 'Example A: strong English, French at NCLC 7' },
      {
        type: 'p',
        text: 'A single applicant with CLB 9 in English reaches NCLC 7 in all four French skills. French adds 12 + 50 = 62 points on top of whatever the rest of the profile scores.',
      },
      { type: 'h3', text: 'Example B: NCLC 7 everywhere except speaking' },
      {
        type: 'p',
        text: 'Same applicant, but speaking comes out at NCLC 6. Second-language points: 3 + 3 + 3 + 1 = 10. Additional French points: 0, because not all four skills reached NCLC 7. French now adds 10 points instead of 62. One skill made a 52-point difference.',
      },
      { type: 'h3', text: 'Example C: married applicant, French at NCLC 9+' },
      {
        type: 'p',
        text: 'With an accompanying spouse, second-language points are capped at 22, so French adds 22 + 50 = 72 points.',
      },
      {
        type: 'p',
        text: 'Language also feeds into the “skill transferability” combinations (language with education or Canadian and foreign work experience), but those combinations are generally calculated from your first official language. For most English-first applicants, the French effect sits in the two sections above. To see your own picture, enter your details in our [CRS calculator](/crs-calculator) and compare your score with and without French.',
      },
      { type: 'h2', text: 'French-language category-based draws' },
      {
        type: 'p',
        text: 'Since 2023, IRCC has held category-based Express Entry rounds, and French-language proficiency has been one of the categories. In those rounds, only candidates who meet the French requirement (IRCC has used NCLC 7 in all four skills) are considered, so they compete within a smaller pool. Cut-off scores in French-category rounds have often been lower than in general rounds, but they change from round to round, and IRCC decides each year which categories it will use.',
      },
      {
        type: 'p',
        text: 'So French can help in two ways: it raises your CRS score, and it may make you eligible for a category with its own cut-off. Neither is a guarantee of an invitation or a visa. Check the “rounds of invitations” page on IRCC’s website for the latest results instead of relying on screenshots shared online.',
      },
      { type: 'h2', text: 'Which test, and how long are results valid?' },
      {
        type: 'p',
        text: 'IRCC accepts two French tests for Express Entry: TEF Canada and TCF Canada. Both test all four skills, and IRCC converts each skill’s score into an NCLC level using its official equivalency tables. Neither test gives “more points”; only your NCLC level counts. If you are unsure which suits you, read our comparison [TEF Canada vs TCF Canada](/blog/tef-canada-vs-tcf-canada).',
      },
      {
        type: 'p',
        text: 'For Express Entry, results are generally valid for two years from the test date, and they need to be valid when you create your profile and when you submit your application. Plan your test date with your whole timeline in mind. Also be careful with score charts shared in groups: TEF Canada changed its scoring scale in December 2023, and outdated tables still circulate. Always use IRCC’s current table.',
      },
      { type: 'h2', text: 'How long does it take to reach NCLC 7?' },
      {
        type: 'p',
        text: 'NCLC 7 is often described as being close to the CEFR B2 level, although the two scales are not identical. Starting from zero, most learners need several hundred hours of guided study plus regular practice; commonly cited estimates for B2 are around 550 to 650 hours. Learners who already have some French get there faster, and people studying around a full-time job usually need more calendar time. A realistic plan looks like this:',
      },
      {
        type: 'ol',
        items: [
          'Find your starting point with a level test, so you don’t repeat what you already know.',
          'Build a solid foundation up to B1 with structured classes: grammar, everyday vocabulary and lots of listening.',
          'Switch to exam-specific preparation for TEF Canada or TCF Canada, with timed mock tests and feedback on writing and speaking.',
          'Book the real test when your mock results are consistently at NCLC 7 or above in every skill, not just on average.',
        ],
      },
      {
        type: 'p',
        text: 'Our [TEF Canada course](/courses/tef-canada) and [TCF Canada course](/courses/tcf-canada) focus on the actual exam tasks, with regular correction of writing and speaking, which is where the 50 additional points are usually won or lost.',
      },
      { type: 'h2', text: 'A quick checklist before you book' },
      {
        type: 'ul',
        items: [
          'Estimate your CRS with and without French in the [CRS calculator](/crs-calculator).',
          'Check that your English results are CLB 5 or higher in all four skills, which you need for the full 50 points.',
          'Confirm the current rules and point values on IRCC’s website.',
          'Choose a test date that keeps your results valid through your application.',
          'Aim a little above NCLC 7 in each skill to leave yourself a safety margin on exam day.',
        ],
      },
      {
        type: 'cta',
        title: 'Prepare for NCLC 7 and above',
        text: 'Exam-focused live classes for TEF Canada and TCF Canada, with feedback on the writing and speaking tasks that decide your French points.',
        href: '/courses/tef-canada',
        label: 'See the TEF Canada course',
        secondaryHref: '/courses/tcf-canada',
        secondaryLabel: 'See the TCF Canada course',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'Express Entry-তে প্রার্থীদের র‍্যাংক করা হয় Comprehensive Ranking System (CRS) দিয়ে, আর এই সিস্টেমে ভাষার দক্ষতা সবচেয়ে বেশি গুরুত্ব পাওয়া বিষয়গুলোর একটি। বাংলাদেশের বেশিরভাগ আবেদনকারীর ক্ষেত্রে প্রথম অফিশিয়াল ভাষা হলো ইংরেজি। ফ্রেঞ্চকে দ্বিতীয় অফিশিয়াল ভাষা হিসেবে দেখালে CRS-এর দুটি আলাদা জায়গা থেকে পয়েন্ট পাওয়া যায়। এই দুটো যোগ করলেই আসে সেই “৬২ পয়েন্ট”, যা ফেসবুক গ্রুপ আর ইউটিউব ভিডিওতে প্রায়ই শোনা যায়। এই লেখায় দেখাব সংখ্যাটি ঠিক কোথা থেকে আসে, কখন এটি বেশি হয় বা অনেক কমে যায়, আর পরীক্ষার পেছনে টাকা খরচের আগে কীভাবে নিজের হিসাবটা যাচাই করবেন।',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'নিয়ম বদলাতে পারে',
        text: 'নিচের পয়েন্টগুলো লেখার সময় IRCC-এর প্রকাশিত CRS মানদণ্ড অনুযায়ী দেওয়া হয়েছে। IRCC যেকোনো সময় এগুলো পরিবর্তন করতে পারে, তাই সিদ্ধান্ত নেওয়ার আগে IRCC-এর অফিশিয়াল ওয়েবসাইটে বর্তমান তথ্য মিলিয়ে নিন।',
      },
      { type: 'h2', text: '৬২ পয়েন্ট আসলে কোথা থেকে আসে' },
      {
        type: 'p',
        text: '৬২ পয়েন্ট দুটি ভিন্ন অংশের যোগফল। কেন কেউ পুরো সুবিধা পান আর কেউ প্রায় কিছুই পান না, তা বুঝতে হলে অংশ দুটো আলাদা করে বোঝা জরুরি।',
      },
      { type: 'h3', text: '১. ফ্রেঞ্চ দক্ষতার জন্য অতিরিক্ত পয়েন্ট (সর্বোচ্চ ৫০)' },
      { type: 'p', text: 'CRS-এর “additional points” অংশে IRCC দেয়:' },
      {
        type: 'ul',
        items: [
          '**৫০ পয়েন্ট**, যদি ফ্রেঞ্চের চারটি স্কিলেই (লিসেনিং, রিডিং, রাইটিং ও স্পিকিং) NCLC 7 বা তার বেশি পান **এবং** ইংরেজির চারটি স্কিলেই CLB 5 বা তার বেশি থাকে।',
          '**২৫ পয়েন্ট**, যদি ফ্রেঞ্চের চারটি স্কিলে NCLC 7 বা তার বেশি থাকে কিন্তু ইংরেজিতে CLB 4 বা তার কম হয়, অথবা ইংরেজি টেস্টের কোনো রেজাল্টই না থাকে।',
        ],
      },
      {
        type: 'p',
        text: 'এখানে সবচেয়ে গুরুত্বপূর্ণ শব্দ হলো “চারটিতেই”। একটি স্কিলও যদি NCLC 6-এ থাকে, তাহলে বাকি তিনটি NCLC 9 হলেও এই অতিরিক্ত পয়েন্ট শূন্য হয়ে যায়।',
      },
      { type: 'h3', text: '২. দ্বিতীয় অফিশিয়াল ভাষার পয়েন্ট (সর্বোচ্চ ২৪)' },
      {
        type: 'p',
        text: 'এর পাশাপাশি আপনার ফ্রেঞ্চ রেজাল্টকে দ্বিতীয় অফিশিয়াল ভাষা হিসেবেও আলাদাভাবে স্কোর করা হয়। চারটি স্কিলের প্রতিটির জন্য আলাদা হিসাব:',
      },
      {
        type: 'ul',
        items: [
          'NCLC 4 বা তার কম: ০ পয়েন্ট',
          'NCLC 5 বা 6: প্রতি স্কিলে ১ পয়েন্ট',
          'NCLC 7 বা 8: প্রতি স্কিলে ৩ পয়েন্ট',
          'NCLC 9 বা তার বেশি: প্রতি স্কিলে ৬ পয়েন্ট',
        ],
      },
      {
        type: 'p',
        text: 'এই অংশে একক আবেদনকারীর জন্য সর্বোচ্চ ২৪ পয়েন্ট, আর স্বামী/স্ত্রী বা কমন-ল পার্টনার সঙ্গে কানাডায় গেলে সর্বোচ্চ ২২ পয়েন্ট।',
      },
      { type: 'h3', text: 'যোগফল' },
      {
        type: 'p',
        text: 'ফ্রেঞ্চের চারটি স্কিলে NCLC 7 এবং ইংরেজিতে CLB 5 বা তার বেশি থাকলে পাবেন ৪ × ৩ = ১২ সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্ট, সঙ্গে ৫০ অতিরিক্ত পয়েন্ট, মোট **৬২ পয়েন্ট**। এটাই সেই পরিচিত সংখ্যার উৎস।',
      },
      { type: 'h2', text: 'ফ্রেঞ্চ থেকে কি ৬২-এর বেশি পয়েন্ট পাওয়া যায়?' },
      {
        type: 'p',
        text: 'হ্যাঁ। চারটি স্কিলেই NCLC 9 বা তার বেশি পেলে একক আবেদনকারীর সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্ট হয় ৪ × ৬ = ২৪। তখন ফ্রেঞ্চ থেকে মোট আসে ২৪ + ৫০ = ৭৪ পয়েন্ট। স্বামী/স্ত্রী সঙ্গে গেলে সেকেন্ড-ল্যাঙ্গুয়েজের সীমা ২২, তাই সর্বোচ্চ হয় ৭২।',
      },
      {
        type: 'p',
        text: 'মিশ্র রেজাল্ট হলে পয়েন্ট মাঝামাঝি কোথাও পড়ে। ধরুন রিডিং ও লিসেনিংয়ে NCLC 9, কিন্তু রাইটিং ও স্পিকিংয়ে NCLC 7। তাহলে সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্ট ৬ + ৬ + ৩ + ৩ = ১৮। ইংরেজিতে CLB 5+ থাকলে ৫০ যোগ করে মোট ৬৮।',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'সবচেয়ে দুর্বল স্কিলটাকে আগে সামলান',
        text: 'বেশিরভাগ শিক্ষার্থী পয়েন্ট হারান রাইটিং আর স্পিকিংয়ে। ৫০ অতিরিক্ত পয়েন্ট যেহেতু চারটি স্কিলেই NCLC 7 পাওয়ার ওপর নির্ভর করে, তাই একটি দুর্বল স্কিল আপনাকে কয়েক পয়েন্ট নয়, অনেক বেশি পয়েন্ট হারাতে বাধ্য করতে পারে। এই স্কিলের চর্চা শেষে নয়, শুরুতেই করুন।',
      },
      { type: 'h2', text: 'কয়েকটি উদাহরণ (শুধু বোঝানোর জন্য)' },
      {
        type: 'p',
        text: 'নিচের সরল উদাহরণগুলো দেখায় ফ্রেঞ্চ-সংক্রান্ত পয়েন্ট কীভাবে কাজ করে। এগুলো কারও মোট CRS স্কোর বা ইনভিটেশন পাওয়ার সম্ভাবনার পূর্বাভাস নয়।',
      },
      { type: 'h3', text: 'উদাহরণ ক: ভালো ইংরেজি, ফ্রেঞ্চে NCLC 7' },
      {
        type: 'p',
        text: 'একজন একক আবেদনকারীর ইংরেজিতে CLB 9, আর ফ্রেঞ্চের চারটি স্কিলেই NCLC 7। প্রোফাইলের বাকি অংশ যা-ই হোক, ফ্রেঞ্চ তার সঙ্গে যোগ করবে ১২ + ৫০ = ৬২ পয়েন্ট।',
      },
      { type: 'h3', text: 'উদাহরণ খ: স্পিকিং বাদে সব জায়গায় NCLC 7' },
      {
        type: 'p',
        text: 'একই আবেদনকারী, কিন্তু স্পিকিংয়ে এলো NCLC 6। সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্ট: ৩ + ৩ + ৩ + ১ = ১০। অতিরিক্ত ফ্রেঞ্চ পয়েন্ট: ০, কারণ চারটি স্কিলে NCLC 7 হয়নি। ফ্রেঞ্চ থেকে এখন আসছে ৬২-এর বদলে মাত্র ১০ পয়েন্ট। একটি স্কিলের কারণে পার্থক্য ৫২ পয়েন্ট।',
      },
      { type: 'h3', text: 'উদাহরণ গ: বিবাহিত আবেদনকারী, ফ্রেঞ্চে NCLC 9+' },
      {
        type: 'p',
        text: 'স্বামী/স্ত্রী সঙ্গে গেলে সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্টের সীমা ২২, তাই ফ্রেঞ্চ থেকে আসে ২২ + ৫০ = ৭২ পয়েন্ট।',
      },
      {
        type: 'p',
        text: 'ভাষা “skill transferability” অংশেও (ভাষার সঙ্গে শিক্ষা বা কাজের অভিজ্ঞতার সমন্বয়) ভূমিকা রাখে, তবে সেই হিসাব সাধারণত প্রথম অফিশিয়াল ভাষা দিয়ে করা হয়। তাই যাঁদের প্রথম ভাষা ইংরেজি, তাঁদের ক্ষেত্রে ফ্রেঞ্চের প্রভাব মূলত ওপরের দুটি অংশেই। নিজের অবস্থা দেখতে আমাদের [CRS ক্যালকুলেটরে](/crs-calculator) তথ্য দিন এবং ফ্রেঞ্চসহ ও ফ্রেঞ্চ ছাড়া স্কোর তুলনা করুন।',
      },
      { type: 'h2', text: 'ফ্রেঞ্চ ভাষাভিত্তিক ক্যাটাগরি ড্র' },
      {
        type: 'p',
        text: '২০২৩ সাল থেকে IRCC ক্যাটাগরিভিত্তিক Express Entry ড্র নিচ্ছে, আর ফ্রেঞ্চ ভাষার দক্ষতা তার একটি ক্যাটাগরি হিসেবে ব্যবহৃত হয়েছে। এসব ড্রতে শুধু ফ্রেঞ্চের শর্ত পূরণকারী প্রার্থীরাই বিবেচিত হন (IRCC চারটি স্কিলে NCLC 7 শর্ত ব্যবহার করেছে), ফলে প্রতিযোগিতা হয় তুলনামূলক ছোট একটি গ্রুপের মধ্যে। ফ্রেঞ্চ ক্যাটাগরি ড্রর কাট-অফ স্কোর অনেক সময় সাধারণ ড্রর চেয়ে কম দেখা গেছে, তবে তা প্রতিটি ড্রতে বদলায়, এবং কোন বছর কোন ক্যাটাগরি থাকবে তা IRCC-ই ঠিক করে।',
      },
      {
        type: 'p',
        text: 'অর্থাৎ ফ্রেঞ্চ দুইভাবে সাহায্য করতে পারে: আপনার CRS স্কোর বাড়ায়, আবার নিজস্ব কাট-অফসহ একটি ক্যাটাগরিতে যোগ্যও করে তুলতে পারে। তবে কোনোটিই ইনভিটেশন বা ভিসার নিশ্চয়তা নয়। অনলাইনে ছড়ানো স্ক্রিনশটের ওপর ভরসা না করে IRCC-এর ওয়েবসাইটের “rounds of invitations” পেজে সর্বশেষ ফল দেখুন।',
      },
      { type: 'h2', text: 'কোন পরীক্ষা দেবেন, আর রেজাল্ট কতদিন বৈধ?' },
      {
        type: 'p',
        text: 'Express Entry-র জন্য IRCC দুটি ফ্রেঞ্চ পরীক্ষা গ্রহণ করে: TEF Canada এবং TCF Canada। দুটিতেই চারটি স্কিলের পরীক্ষা হয়, আর IRCC তার অফিশিয়াল সমতা টেবিল দিয়ে প্রতিটি স্কিলের স্কোরকে NCLC লেভেলে রূপান্তর করে। কোনো পরীক্ষাই “বেশি পয়েন্ট” দেয় না; গোনা হয় শুধু আপনার NCLC লেভেল। কোনটি আপনার জন্য ভালো তা নিয়ে দ্বিধা থাকলে আমাদের তুলনামূলক লেখা [TEF Canada বনাম TCF Canada](/blog/tef-canada-vs-tcf-canada) পড়ে নিন।',
      },
      {
        type: 'p',
        text: 'Express Entry-র ক্ষেত্রে রেজাল্ট সাধারণত পরীক্ষার তারিখ থেকে দুই বছর বৈধ থাকে, আর প্রোফাইল তৈরি ও আবেদন জমা দেওয়ার সময় রেজাল্ট বৈধ থাকতে হয়। তাই পুরো টাইমলাইন মাথায় রেখে পরীক্ষার তারিখ ঠিক করুন। গ্রুপে শেয়ার হওয়া স্কোর চার্ট নিয়েও সাবধান থাকুন: ২০২৩ সালের ডিসেম্বরে TEF Canada তার স্কোরিং স্কেল বদলেছে, অথচ পুরোনো টেবিল এখনো ঘুরে বেড়ায়। সবসময় IRCC-এর বর্তমান টেবিল ব্যবহার করুন।',
      },
      { type: 'h2', text: 'NCLC 7-এ পৌঁছাতে কত সময় লাগে?' },
      {
        type: 'p',
        text: 'NCLC 7-কে প্রায়ই CEFR-এর B2 লেভেলের কাছাকাছি বলা হয়, যদিও দুটি স্কেল হুবহু এক নয়। একেবারে শূন্য থেকে শুরু করলে বেশিরভাগ শিক্ষার্থীর কয়েকশো ঘণ্টা গাইডেড পড়াশোনা আর নিয়মিত চর্চা লাগে; B2-এর জন্য সাধারণত প্রায় ৫৫০ থেকে ৬৫০ ঘণ্টার কথা বলা হয়। যাঁদের আগে থেকে কিছু ফ্রেঞ্চ জানা আছে, তাঁরা দ্রুত পৌঁছান, আর ফুল-টাইম চাকরির পাশাপাশি পড়লে ক্যালেন্ডারে বেশি সময় লাগে। একটি বাস্তবসম্মত পরিকল্পনা এমন হতে পারে:',
      },
      {
        type: 'ol',
        items: [
          'লেভেল টেস্ট দিয়ে নিজের শুরুর অবস্থান জেনে নিন, যাতে যা জানেন তা আবার পড়তে না হয়।',
          'স্ট্রাকচার্ড ক্লাসের মাধ্যমে B1 পর্যন্ত শক্ত ভিত তৈরি করুন: গ্রামার, দৈনন্দিন শব্দভান্ডার আর প্রচুর লিসেনিং।',
          'এরপর TEF Canada বা TCF Canada-র নির্দিষ্ট পরীক্ষা-প্রস্তুতিতে যান, সময় ধরে মক টেস্ট দিন এবং রাইটিং ও স্পিকিংয়ে ফিডব্যাক নিন।',
          'মক টেস্টে গড়ে নয়, প্রতিটি স্কিলে ধারাবাহিকভাবে NCLC 7 বা তার বেশি এলে তবেই আসল পরীক্ষা বুক করুন।',
        ],
      },
      {
        type: 'p',
        text: 'আমাদের [TEF Canada কোর্স](/courses/tef-canada) এবং [TCF Canada কোর্স](/courses/tcf-canada) আসল পরীক্ষার টাস্কগুলোর ওপর জোর দেয়, সঙ্গে রাইটিং ও স্পিকিংয়ের নিয়মিত সংশোধন, কারণ ৫০ অতিরিক্ত পয়েন্ট সাধারণত এখানেই জেতা বা হারানো হয়।',
      },
      { type: 'h2', text: 'পরীক্ষা বুক করার আগে ছোট্ট চেকলিস্ট' },
      {
        type: 'ul',
        items: [
          '[CRS ক্যালকুলেটরে](/crs-calculator) ফ্রেঞ্চসহ ও ফ্রেঞ্চ ছাড়া আপনার স্কোর হিসাব করুন।',
          'নিশ্চিত হোন ইংরেজির চারটি স্কিলেই CLB 5 বা তার বেশি আছে, পুরো ৫০ পয়েন্টের জন্য যা লাগবে।',
          'IRCC-এর ওয়েবসাইটে বর্তমান নিয়ম ও পয়েন্ট মিলিয়ে নিন।',
          'এমন তারিখে পরীক্ষা দিন, যাতে আবেদনের পুরো সময় রেজাল্ট বৈধ থাকে।',
          'পরীক্ষার দিনের জন্য কিছুটা নিরাপত্তা রাখতে প্রতিটি স্কিলে NCLC 7-এর একটু ওপরে লক্ষ্য রাখুন।',
        ],
      },
      {
        type: 'cta',
        title: 'NCLC 7 ও তার ওপরের প্রস্তুতি নিন',
        text: 'TEF Canada ও TCF Canada-র জন্য পরীক্ষাভিত্তিক লাইভ ক্লাস, যেখানে রাইটিং ও স্পিকিং টাস্কে ফিডব্যাক পাবেন, যা আপনার ফ্রেঞ্চ পয়েন্টের ভাগ্য ঠিক করে।',
        href: '/courses/tef-canada',
        label: 'TEF Canada কোর্স দেখুন',
        secondaryHref: '/courses/tcf-canada',
        secondaryLabel: 'TCF Canada কোর্স দেখুন',
      },
    ],
  },
  faq: [
    {
      q: {
        en: 'Do I still get French points if my English score is low?',
        bn: 'ইংরেজি স্কোর কম হলেও কি ফ্রেঞ্চের পয়েন্ট পাব?',
      },
      a: {
        en: 'If you have NCLC 7 or higher in all four French skills but CLB 4 or lower in English (or no English test), the additional French points are 25 instead of 50, under the current CRS rules. Second-language points are calculated separately. If French is your stronger language, you can also declare it as your first official language, which changes how points are calculated.',
        bn: 'বর্তমান CRS নিয়ম অনুযায়ী, ফ্রেঞ্চের চারটি স্কিলে NCLC 7 বা তার বেশি থাকলেও ইংরেজিতে CLB 4 বা তার কম হলে (অথবা ইংরেজি টেস্ট না থাকলে) অতিরিক্ত ফ্রেঞ্চ পয়েন্ট ৫০-এর বদলে ২৫। সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্ট আলাদাভাবে হিসাব হয়। ফ্রেঞ্চ যদি আপনার শক্তিশালী ভাষা হয়, তাহলে সেটিকে প্রথম অফিশিয়াল ভাষা হিসেবেও দেখাতে পারেন, তখন হিসাবের ধরন বদলে যায়।',
      },
    },
    {
      q: { en: 'Is 62 the maximum French can add?', bn: 'ফ্রেঞ্চ থেকে কি সর্বোচ্চ ৬২ পয়েন্টই পাওয়া যায়?' },
      a: {
        en: 'No. With NCLC 9 or higher in all four French skills, a single applicant can get 24 second-language points plus 50 additional points, or 74 in total. With an accompanying spouse the cap is 72. These figures follow IRCC’s published criteria at the time of writing.',
        bn: 'না। ফ্রেঞ্চের চারটি স্কিলেই NCLC 9 বা তার বেশি হলে একক আবেদনকারী ২৪ সেকেন্ড-ল্যাঙ্গুয়েজ পয়েন্ট আর ৫০ অতিরিক্ত পয়েন্ট, মোট ৭৪ পয়েন্ট পেতে পারেন। স্বামী/স্ত্রী সঙ্গে গেলে সর্বোচ্চ ৭২। লেখার সময় IRCC-এর প্রকাশিত মানদণ্ড অনুযায়ী এই হিসাব।',
      },
    },
    {
      q: { en: 'Does TEF Canada or TCF Canada give more CRS points?', bn: 'TEF Canada নাকি TCF Canada, কোনটিতে বেশি CRS পয়েন্ট?' },
      a: {
        en: 'Neither. IRCC converts the scores of both tests into NCLC levels using official equivalency tables, and CRS points depend only on your NCLC level in each skill. Choose the test whose format suits you best.',
        bn: 'কোনোটিতেই না। IRCC দুটি পরীক্ষার স্কোরকেই অফিশিয়াল সমতা টেবিল দিয়ে NCLC লেভেলে রূপান্তর করে, আর CRS পয়েন্ট নির্ভর করে শুধু প্রতিটি স্কিলের NCLC লেভেলের ওপর। যে পরীক্ষার ফরম্যাট আপনার সঙ্গে বেশি মানানসই, সেটিই বেছে নিন।',
      },
    },
    {
      q: { en: 'How long are French test results valid for Express Entry?', bn: 'Express Entry-র জন্য ফ্রেঞ্চ টেস্টের রেজাল্ট কতদিন বৈধ?' },
      a: {
        en: 'Generally two years from the test date. Results must be valid when you create your profile and when you submit your permanent residence application, so plan your test date carefully and confirm the current rule on IRCC’s website.',
        bn: 'সাধারণত পরীক্ষার তারিখ থেকে দুই বছর। প্রোফাইল তৈরি এবং স্থায়ী বসবাসের আবেদন জমা দেওয়ার সময় রেজাল্ট বৈধ থাকতে হয়, তাই পরীক্ষার তারিখ ভেবেচিন্তে ঠিক করুন এবং IRCC-এর ওয়েবসাইটে বর্তমান নিয়ম মিলিয়ে নিন।',
      },
    },
  ],
};
const post04: BlogPost = {
  slug: 'delf-a1-exam-guide',
  date: '2026-09-24T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.delf,
  tags: ['delf a1', 'delf exam', 'french exam format', 'beginner french', 'exam preparation'],
  cover: { theme: 'delf', icon: 'file-check', label: { en: 'DELF A1', bn: 'DELF A1' } },
  title: {
    en: 'DELF A1 Exam Guide: Format, Scoring and a Practical Preparation Plan',
    bn: 'DELF A1 পরীক্ষা গাইড: ফরম্যাট, স্কোরিং ও কার্যকর প্রস্তুতি পরিকল্পনা',
  },
  metaTitle: {
    en: 'DELF A1 Exam Guide: Format, Scoring & Prep Plan',
    bn: 'DELF A1 পরীক্ষা গাইড: ফরম্যাট, স্কোরিং ও প্রস্তুতি',
  },
  metaDescription: {
    en: 'DELF A1 explained for Bangladeshi learners: the four sections, timings, how the 50/100 pass mark works, and a practical 10-week preparation plan.',
    bn: 'বাংলাদেশি শিক্ষার্থীদের জন্য DELF A1: চারটি অংশ, সময়, ৫০/১০০ পাস নম্বরের নিয়ম এবং ১০ সপ্তাহের একটি বাস্তব প্রস্তুতি পরিকল্পনা।',
  },
  excerpt: {
    en: 'Everything you need to know about the DELF A1 exam: what each section tests, how scoring works, what examiners look for and an example 10-week plan.',
    bn: 'DELF A1 পরীক্ষার প্রতিটি অংশে কী যাচাই করা হয়, নম্বর কীভাবে দেওয়া হয়, পরীক্ষক কী দেখেন, আর ১০ সপ্তাহের একটি নমুনা প্রস্তুতি পরিকল্পনা।',
  },
  coverAlt: {
    en: 'Illustrated cover: a checked exam sheet with the words DELF A1',
    bn: 'ইলাস্ট্রেটেড কভার: টিক দেওয়া পরীক্ষার খাতা ও DELF A1 লেখা',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'If you are starting French in Bangladesh, DELF A1 is usually the first official certificate you can aim for. It shows that you can handle simple, everyday situations in French: introducing yourself, understanding short announcements, filling in a form and asking basic questions. This guide walks through the exam format, how scoring works, what examiners actually look for, and an example preparation plan you can adapt to your own schedule.',
      },
      { type: 'h2', text: 'What DELF A1 is and who it is for' },
      {
        type: 'p',
        text: 'DELF (Diplôme d’études en langue française) is a set of official French diplomas awarded by France’s Ministry of Education and administered by France Éducation international. A1 is the first level of the Common European Framework of Reference (CEFR). Unlike TEF or TCF results, a DELF diploma does not expire, which makes it a useful long-term credential.',
      },
      {
        type: 'ul',
        items: [
          'Complete beginners who want a clear first goal and a certificate to show for their effort.',
          'Students who plan to continue in French and want to build their foundation step by step.',
          'Learners heading towards A2, B1 or TEF/TCF Canada who want real exam practice early, in a lower-pressure setting.',
        ],
      },
      {
        type: 'p',
        text: 'If you are not sure whether you are a true beginner or already close to A1, take our free [French level test](/quiz/placement-test) before choosing a course.',
      },
      { type: 'h2', text: 'The DELF A1 exam format' },
      {
        type: 'p',
        text: 'The exam tests four skills, each worth 25 points. Listening, reading and writing are taken together in a group session of about 1 hour 20 minutes. Speaking is a short individual test, held on the same day or a different day depending on the centre. The timings below are approximate, so always check the current official information.',
      },
      { type: 'h3', text: 'Listening (compréhension de l’oral): about 20 minutes' },
      {
        type: 'p',
        text: 'You hear short recordings about everyday life: announcements at a station, voicemail messages, short conversations. Each recording is played twice. You answer questions, often by ticking the right option or matching pictures. The key skill is catching specific information such as a time, a price, a place or a day of the week.',
      },
      { type: 'h3', text: 'Reading (compréhension des écrits): about 30 minutes' },
      {
        type: 'p',
        text: 'You read short practical texts such as notices, emails, advertisements, timetables or simple instructions, and answer questions about them. The texts are short, but you need to read carefully: questions often check small details like dates, numbers or who is doing what.',
      },
      { type: 'h3', text: 'Writing (production écrite): about 30 minutes' },
      {
        type: 'p',
        text: 'There are usually two tasks. First, you fill in a form with personal information (name, nationality, address, dates). Second, you write a short message of roughly 40–50 words, such as a postcard, an invitation or a reply to a friend. Examiners expect simple sentences used correctly, not complicated vocabulary.',
      },
      { type: 'h3', text: 'Speaking (production orale): about 5–7 minutes, plus around 10 minutes of preparation' },
      { type: 'p', text: 'The speaking test has three parts:' },
      {
        type: 'ol',
        items: [
          '**Guided interview (entretien dirigé):** the examiner asks simple questions about you, your family, your studies or work and what you like.',
          '**Information exchange (échange d’informations):** you receive cards with words on them and use them to ask the examiner questions.',
          '**Simulated dialogue (dialogue simulé):** a short role-play, for example buying something in a shop, where you ask about prices and quantities and then pay.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Check the latest sample papers',
        text: 'France Éducation international has been updating some task formats across DELF levels. Before your exam, download and practise with the current sample papers (sujets d’exemple) from the official France Éducation international website.',
      },
      { type: 'h2', text: 'How DELF A1 is scored' },
      { type: 'p', text: 'Each of the four skills is marked out of 25, giving a total out of 100. To pass, you need:' },
      {
        type: 'ul',
        items: ['At least 50 out of 100 overall, and', 'At least 5 out of 25 in each of the four skills.'],
      },
      {
        type: 'p',
        text: 'The second rule matters more than people think. A learner who does very well in reading and listening but very poorly in speaking can still fail. Balanced preparation is safer than trying to make up points in your favourite section.',
      },
      { type: 'h3', text: 'What examiners look for' },
      {
        type: 'ul',
        items: [
          '**Task completion:** did you do what was asked? If a message must include a date, a place and a time, leaving one out costs points.',
          '**Basic grammar control:** the present tense, articles (le, la, un, une), agreement of common adjectives and negation (ne… pas).',
          '**Everyday vocabulary:** numbers, days, months, family, food, transport and hobbies.',
          '**Pronunciation that can be understood:** a Bangladeshi accent is perfectly fine. What matters is that the examiner understands you without effort.',
          '**Politeness and interaction:** greetings, s’il vous plaît, merci, and asking someone to repeat: “Vous pouvez répéter, s’il vous plaît ?”',
        ],
      },
      { type: 'h2', text: 'An example 10-week preparation plan' },
      {
        type: 'p',
        text: 'This plan assumes you already have some beginner knowledge, or are following an A1 course at the same time, and can study about 5–7 hours a week. Starting from zero usually takes longer, so adjust the pace to your own progress.',
      },
      { type: 'h3', text: 'Weeks 1–3: foundations' },
      {
        type: 'ul',
        items: [
          'Alphabet, sounds and spelling, especially the nasal sounds (an, on, in) and the French “u”.',
          'Numbers up to 100, dates, telling the time and prices.',
          'Introducing yourself: name, age, nationality, city, job or studies, family.',
          'The present tense of être, avoir, aller, faire and regular -er verbs.',
        ],
      },
      { type: 'h3', text: 'Weeks 4–6: everyday situations' },
      {
        type: 'ul',
        items: [
          'Shopping, food, transport, directions, weather and hobbies.',
          'Asking questions with est-ce que, qu’est-ce que, où, quand and combien.',
          'Reading short notices and emails every day, and listening to slow, short audio two or three times.',
          'Writing a 40–50 word message every two days: an invitation, a reply or a postcard.',
        ],
      },
      { type: 'h3', text: 'Weeks 7–8: exam technique' },
      {
        type: 'ul',
        items: [
          'Work through official sample papers section by section, with a timer.',
          'Practise the three speaking tasks out loud, ideally with a teacher or partner who can correct you.',
          'Keep a mistake notebook: wrong genders, missing articles, wrong verb endings.',
        ],
      },
      { type: 'h3', text: 'Weeks 9–10: full mock exams' },
      {
        type: 'ul',
        items: [
          'Do at least two complete mock exams under timed conditions.',
          'Review every wrong answer until you understand why it was wrong.',
          'Rehearse your self-introduction until it sounds fluent and natural, not memorised word for word.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Speaking needs feedback',
        text: 'Recordings help, but speaking improves fastest when someone corrects you. Our live [DELF A1 course](/courses/delf-a1) includes speaking practice and mock tests. If your schedule is irregular, the [DELF A1 recorded course](/recorded/delf-a1-recorded-course) lets you learn at your own pace.',
      },
      { type: 'h2', text: 'Registering for DELF A1 in Bangladesh' },
      {
        type: 'p',
        text: 'In Bangladesh, DELF exam sessions are organised by Alliance Française. Session dates, registration deadlines and fees change from year to year, so check the Alliance Française website or contact them directly before you plan your preparation. Register early: popular sessions can fill up, and having a fixed exam date lets you plan your study backwards from it.',
      },
      {
        type: 'p',
        text: 'On the day, bring the identity document the centre asks for (usually the one you used to register) and check your convocation letter for the exact times of the group test and the speaking test.',
      },
      { type: 'h2', text: 'Exam-day tips' },
      {
        type: 'ul',
        items: [
          'Read every listening question before the audio starts, so you know what to listen for.',
          'In reading, underline the key question words: quand, où, combien, qui.',
          'In writing, roughly count your words and make sure you include every point the task asks for.',
          'In speaking, it is fine to say “Je ne comprends pas, vous pouvez répéter ?” Asking for repetition is part of real communication.',
          'Use your speaking preparation time to note key words, not full sentences.',
          'If you miss an answer in listening, stay calm and move on to the next question.',
        ],
      },
      {
        type: 'cta',
        title: 'Not sure if you are ready for A1?',
        text: 'Take our free French level test to see where you stand, then pick the right course or join a free class to try our teaching style.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/free-class',
        secondaryLabel: 'Join a free class',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'বাংলাদেশে যাঁরা ফরাসি শেখা শুরু করছেন, তাঁদের জন্য প্রথম অফিশিয়াল সার্টিফিকেট সাধারণত DELF A1। এটি প্রমাণ করে যে আপনি ফরাসিতে সহজ, দৈনন্দিন পরিস্থিতি সামলাতে পারেন: নিজের পরিচয় দেওয়া, ছোট ঘোষণা বোঝা, একটি ফর্ম পূরণ করা এবং সাধারণ প্রশ্ন করা। এই গাইডে পরীক্ষার ফরম্যাট, নম্বর দেওয়ার নিয়ম, পরীক্ষক আসলে কী দেখেন, এবং আপনার সময় অনুযায়ী সাজিয়ে নেওয়া যায় এমন একটি নমুনা প্রস্তুতি পরিকল্পনা তুলে ধরা হলো।',
      },
      { type: 'h2', text: 'DELF A1 কী এবং কাদের জন্য' },
      {
        type: 'p',
        text: 'DELF (Diplôme d’études en langue française) হলো ফ্রান্সের শিক্ষা মন্ত্রণালয়ের দেওয়া অফিশিয়াল ফরাসি ভাষার ডিপ্লোমা, যা পরিচালনা করে France Éducation international। Common European Framework of Reference (CEFR)-এর প্রথম ধাপ হলো A1। TEF বা TCF-এর ফলাফলের মতো DELF ডিপ্লোমার মেয়াদ শেষ হয় না, তাই দীর্ঘমেয়াদে এটি একটি কাজের সনদ।',
      },
      {
        type: 'ul',
        items: [
          'একদম নতুন শিক্ষার্থী, যাঁরা একটি স্পষ্ট প্রথম লক্ষ্য এবং পরিশ্রমের স্বীকৃতি হিসেবে একটি সার্টিফিকেট চান।',
          'যাঁরা ভবিষ্যতে ফরাসিতে আরও এগোতে চান এবং ধাপে ধাপে ভিত্তি মজবুত করতে চান।',
          'যাঁদের লক্ষ্য A2, B1 বা TEF/TCF Canada, এবং যাঁরা তুলনামূলক কম চাপের পরিবেশে আগেভাগে আসল পরীক্ষার অভিজ্ঞতা নিতে চান।',
        ],
      },
      {
        type: 'p',
        text: 'আপনি একদম শুরুর পর্যায়ে আছেন নাকি A1-এর কাছাকাছি পৌঁছে গেছেন, তা নিশ্চিত না হলে কোর্স বেছে নেওয়ার আগে আমাদের ফ্রি [ফ্রেঞ্চ লেভেল টেস্ট](/quiz/placement-test) দিয়ে দেখুন।',
      },
      { type: 'h2', text: 'DELF A1 পরীক্ষার ফরম্যাট' },
      {
        type: 'p',
        text: 'পরীক্ষায় চারটি দক্ষতা যাচাই করা হয়, প্রতিটিতে ২৫ নম্বর। লিসেনিং, রিডিং ও রাইটিং একসঙ্গে একটি গ্রুপ সেশনে হয়, মোট সময় প্রায় ১ ঘণ্টা ২০ মিনিট। স্পিকিং হলো আলাদা একটি ছোট মৌখিক পরীক্ষা, কেন্দ্রভেদে একই দিনে বা অন্য দিনে হতে পারে। নিচের সময়গুলো আনুমানিক, তাই সবসময় সর্বশেষ অফিশিয়াল তথ্য দেখে নিন।',
      },
      { type: 'h3', text: 'লিসেনিং (compréhension de l’oral): প্রায় ২০ মিনিট' },
      {
        type: 'p',
        text: 'দৈনন্দিন জীবনের ছোট ছোট রেকর্ডিং শুনবেন: স্টেশনের ঘোষণা, ভয়েসমেইল, ছোট কথোপকথন। প্রতিটি রেকর্ডিং দুবার বাজানো হয়। প্রশ্নের উত্তর দিতে হয়, প্রায়ই সঠিক অপশনে টিক দিয়ে বা ছবি মিলিয়ে। মূল দক্ষতা হলো নির্দিষ্ট তথ্য ধরতে পারা: সময়, দাম, জায়গা বা সপ্তাহের কোন দিন।',
      },
      { type: 'h3', text: 'রিডিং (compréhension des écrits): প্রায় ৩০ মিনিট' },
      {
        type: 'p',
        text: 'নোটিশ, ইমেইল, বিজ্ঞাপন, সময়সূচি বা সহজ নির্দেশনার মতো ছোট ব্যবহারিক লেখা পড়ে প্রশ্নের উত্তর দিতে হয়। লেখাগুলো ছোট, কিন্তু মনোযোগ দিয়ে পড়তে হয়, কারণ প্রশ্নে প্রায়ই তারিখ, সংখ্যা বা কে কী করছে, এমন ছোট খুঁটিনাটি যাচাই করা হয়।',
      },
      { type: 'h3', text: 'রাইটিং (production écrite): প্রায় ৩০ মিনিট' },
      {
        type: 'p',
        text: 'সাধারণত দুটি কাজ থাকে। প্রথমত, ব্যক্তিগত তথ্য দিয়ে একটি ফর্ম পূরণ (নাম, জাতীয়তা, ঠিকানা, তারিখ)। দ্বিতীয়ত, প্রায় ৪০–৫০ শব্দের একটি ছোট বার্তা লেখা, যেমন পোস্টকার্ড, আমন্ত্রণ বা বন্ধুকে উত্তর। পরীক্ষক কঠিন শব্দ নয়, বরং সহজ বাক্যের সঠিক ব্যবহার দেখতে চান।',
      },
      { type: 'h3', text: 'স্পিকিং (production orale): প্রায় ৫–৭ মিনিট, সঙ্গে প্রায় ১০ মিনিট প্রস্তুতি' },
      { type: 'p', text: 'স্পিকিং পরীক্ষার তিনটি অংশ:' },
      {
        type: 'ol',
        items: [
          '**গাইডেড ইন্টারভিউ (entretien dirigé):** পরীক্ষক আপনার নিজের, পরিবার, পড়াশোনা বা কাজ এবং পছন্দ-অপছন্দ নিয়ে সহজ প্রশ্ন করবেন।',
          '**তথ্য বিনিময় (échange d’informations):** কিছু শব্দ লেখা কার্ড পাবেন, সেগুলো ব্যবহার করে পরীক্ষককে প্রশ্ন করতে হবে।',
          '**সিমুলেটেড ডায়ালগ (dialogue simulé):** ছোট একটি রোল-প্লে, যেমন দোকানে কিছু কেনা, যেখানে দাম ও পরিমাণ জিজ্ঞেস করে শেষে দাম পরিশোধ করবেন।',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'সর্বশেষ নমুনা প্রশ্ন দেখে নিন',
        text: 'France Éducation international বিভিন্ন DELF লেভেলে কিছু কাজের ধরন হালনাগাদ করছে। পরীক্ষার আগে France Éducation international-এর অফিশিয়াল ওয়েবসাইট থেকে বর্তমান নমুনা প্রশ্নপত্র (sujets d’exemple) ডাউনলোড করে অনুশীলন করুন।',
      },
      { type: 'h2', text: 'DELF A1-এ নম্বর কীভাবে দেওয়া হয়' },
      { type: 'p', text: 'চারটি দক্ষতার প্রতিটি ২৫ নম্বরে মূল্যায়ন করা হয়, মোট ১০০। পাস করতে হলে লাগবে:' },
      {
        type: 'ul',
        items: ['মোট ১০০-র মধ্যে অন্তত ৫০, এবং', 'চারটি দক্ষতার প্রতিটিতে ২৫-এর মধ্যে অন্তত ৫।'],
      },
      {
        type: 'p',
        text: 'দ্বিতীয় নিয়মটি অনেকে যতটা ভাবেন, তার চেয়ে বেশি গুরুত্বপূর্ণ। রিডিং ও লিসেনিংয়ে খুব ভালো করেও কেউ স্পিকিংয়ে খুব কম পেলে ফেল করতে পারেন। পছন্দের অংশে বেশি নম্বর তুলে ঘাটতি পূরণের চেষ্টার চেয়ে চারটি দক্ষতায় সমানভাবে প্রস্তুতি নেওয়া অনেক নিরাপদ।',
      },
      { type: 'h3', text: 'পরীক্ষক কী দেখেন' },
      {
        type: 'ul',
        items: [
          '**কাজ সম্পূর্ণ করা:** যা চাওয়া হয়েছে, তা কি করেছেন? বার্তায় তারিখ, জায়গা ও সময় থাকার কথা থাকলে একটি বাদ পড়লেই নম্বর কাটা যায়।',
          '**মৌলিক গ্রামারে নিয়ন্ত্রণ:** বর্তমান কাল, আর্টিকেল (le, la, un, une), সাধারণ বিশেষণের মিল এবং না-বাচক বাক্য (ne… pas)।',
          '**দৈনন্দিন শব্দভান্ডার:** সংখ্যা, দিন, মাস, পরিবার, খাবার, যাতায়াত ও শখ।',
          '**বোধগম্য উচ্চারণ:** বাংলাদেশি টান থাকা একদম স্বাভাবিক। আসল বিষয় হলো, পরীক্ষক যেন কষ্ট ছাড়াই আপনার কথা বুঝতে পারেন।',
          '**ভদ্রতা ও কথোপকথন:** সম্ভাষণ, s’il vous plaît, merci, এবং আবার বলতে অনুরোধ করা: “Vous pouvez répéter, s’il vous plaît ?”',
        ],
      },
      { type: 'h2', text: '১০ সপ্তাহের একটি নমুনা প্রস্তুতি পরিকল্পনা' },
      {
        type: 'p',
        text: 'এই পরিকল্পনা ধরে নিচ্ছে যে আপনার কিছুটা প্রাথমিক জ্ঞান আছে, অথবা আপনি পাশাপাশি একটি A1 কোর্স করছেন, এবং সপ্তাহে প্রায় ৫–৭ ঘণ্টা পড়তে পারেন। একদম শূন্য থেকে শুরু করলে সাধারণত বেশি সময় লাগে, তাই নিজের অগ্রগতি অনুযায়ী গতি ঠিক করে নিন।',
      },
      { type: 'h3', text: 'সপ্তাহ ১–৩: ভিত্তি তৈরি' },
      {
        type: 'ul',
        items: [
          'বর্ণমালা, ধ্বনি ও বানান, বিশেষ করে নাসিক্য ধ্বনি (an, on, in) এবং ফরাসি “u”।',
          '১০০ পর্যন্ত সংখ্যা, তারিখ, সময় বলা ও দাম।',
          'নিজের পরিচয়: নাম, বয়স, জাতীয়তা, শহর, কাজ বা পড়াশোনা, পরিবার।',
          'être, avoir, aller, faire এবং নিয়মিত -er ক্রিয়ার বর্তমান কাল।',
        ],
      },
      { type: 'h3', text: 'সপ্তাহ ৪–৬: দৈনন্দিন পরিস্থিতি' },
      {
        type: 'ul',
        items: [
          'কেনাকাটা, খাবার, যাতায়াত, পথনির্দেশ, আবহাওয়া ও শখ।',
          'est-ce que, qu’est-ce que, où, quand ও combien দিয়ে প্রশ্ন করা।',
          'প্রতিদিন ছোট নোটিশ ও ইমেইল পড়া, এবং ধীর গতির ছোট অডিও দুই-তিনবার শোনা।',
          'প্রতি দুই দিনে একটি ৪০–৫০ শব্দের বার্তা লেখা: আমন্ত্রণ, উত্তর বা পোস্টকার্ড।',
        ],
      },
      { type: 'h3', text: 'সপ্তাহ ৭–৮: পরীক্ষার কৌশল' },
      {
        type: 'ul',
        items: [
          'টাইমার চালিয়ে অংশ ধরে ধরে অফিশিয়াল নমুনা প্রশ্নপত্র সমাধান করুন।',
          'স্পিকিংয়ের তিনটি কাজ জোরে জোরে অনুশীলন করুন, সম্ভব হলে এমন শিক্ষক বা সঙ্গীর সঙ্গে যিনি ভুল ধরিয়ে দিতে পারেন।',
          'একটি ভুলের খাতা রাখুন: ভুল লিঙ্গ, বাদ পড়া আর্টিকেল, ক্রিয়ার ভুল রূপ।',
        ],
      },
      { type: 'h3', text: 'সপ্তাহ ৯–১০: পূর্ণাঙ্গ মক পরীক্ষা' },
      {
        type: 'ul',
        items: [
          'সময় ধরে অন্তত দুটি পূর্ণাঙ্গ মক পরীক্ষা দিন।',
          'প্রতিটি ভুল উত্তর আবার দেখুন, কেন ভুল হলো তা না বোঝা পর্যন্ত।',
          'নিজের পরিচয় এমনভাবে অনুশীলন করুন যেন তা সাবলীল ও স্বাভাবিক শোনায়, হুবহু মুখস্থ নয়।',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'স্পিকিংয়ের জন্য দরকার ফিডব্যাক',
        text: 'রেকর্ডিং কাজে আসে, তবে কেউ ভুল ধরিয়ে দিলে স্পিকিং সবচেয়ে দ্রুত উন্নত হয়। আমাদের লাইভ [DELF A1 কোর্সে](/courses/delf-a1) স্পিকিং অনুশীলন ও মক টেস্ট রয়েছে। আপনার সময়সূচি অনিয়মিত হলে [DELF A1 রেকর্ডেড কোর্সে](/recorded/delf-a1-recorded-course) নিজের গতিতে শিখতে পারবেন।',
      },
      { type: 'h2', text: 'বাংলাদেশে DELF A1-এর রেজিস্ট্রেশন' },
      {
        type: 'p',
        text: 'বাংলাদেশে DELF পরীক্ষার সেশন আয়োজন করে Alliance Française। সেশনের তারিখ, রেজিস্ট্রেশনের শেষ সময় ও ফি বছরভেদে বদলায়, তাই প্রস্তুতির পরিকল্পনা করার আগে Alliance Française-এর ওয়েবসাইট দেখুন বা সরাসরি যোগাযোগ করুন। আগেভাগে রেজিস্ট্রেশন করুন: জনপ্রিয় সেশনগুলোর আসন পূরণ হয়ে যেতে পারে, আর পরীক্ষার তারিখ নির্দিষ্ট থাকলে সেখান থেকে পিছিয়ে গুনে পড়ার পরিকল্পনা সাজানো সহজ হয়।',
      },
      {
        type: 'p',
        text: 'পরীক্ষার দিন কেন্দ্র যে পরিচয়পত্র চায় (সাধারণত রেজিস্ট্রেশনে যেটি ব্যবহার করেছেন) সেটি সঙ্গে নিন, এবং গ্রুপ পরীক্ষা ও স্পিকিংয়ের সঠিক সময় জানতে আপনার convocation চিঠিটি ভালো করে দেখে নিন।',
      },
      { type: 'h2', text: 'পরীক্ষার দিনের টিপস' },
      {
        type: 'ul',
        items: [
          'অডিও শুরুর আগেই লিসেনিংয়ের প্রতিটি প্রশ্ন পড়ে নিন, যাতে জানেন কী শুনতে হবে।',
          'রিডিংয়ে প্রশ্নের মূল শব্দগুলো দাগিয়ে নিন: quand, où, combien, qui।',
          'রাইটিংয়ে মোটামুটি শব্দ গুনে নিন, এবং কাজে যা যা চাওয়া হয়েছে তার প্রতিটি পয়েন্ট লিখেছেন কি না মিলিয়ে নিন।',
          'স্পিকিংয়ে “Je ne comprends pas, vous pouvez répéter ?” বলা একদম ঠিক আছে। আবার বলতে অনুরোধ করা বাস্তব যোগাযোগেরই অংশ।',
          'স্পিকিংয়ের প্রস্তুতির সময়ে পুরো বাক্য নয়, মূল শব্দগুলো নোট করুন।',
          'লিসেনিংয়ে কোনো উত্তর ছুটে গেলে শান্ত থাকুন এবং পরের প্রশ্নে চলে যান।',
        ],
      },
      {
        type: 'cta',
        title: 'A1-এর জন্য প্রস্তুত কি না নিশ্চিত নন?',
        text: 'আমাদের ফ্রি ফ্রেঞ্চ লেভেল টেস্ট দিয়ে আপনার অবস্থান জেনে নিন, তারপর সঠিক কোর্স বেছে নিন অথবা আমাদের পড়ানোর ধরন দেখতে একটি ফ্রি ক্লাসে যোগ দিন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/free-class',
        secondaryLabel: 'ফ্রি ক্লাসে যোগ দিন',
      },
    ],
  },
  faq: [
    {
      q: {
        en: 'How long does it take to prepare for DELF A1 from zero?',
        bn: 'শূন্য থেকে DELF A1-এর প্রস্তুতিতে কত সময় লাগে?',
      },
      a: {
        en: 'Many complete beginners need roughly 60–100 hours of guided study, often spread over two to four months. It depends on how much time you can give each week, how much you practise and your previous experience with languages.',
        bn: 'অনেক নতুন শিক্ষার্থীর মোটামুটি ৬০–১০০ ঘণ্টা গাইডেড পড়াশোনা লাগে, যা সাধারণত দুই থেকে চার মাসে ছড়ানো থাকে। তবে এটি নির্ভর করে আপনি সপ্তাহে কতটা সময় দিতে পারেন, কতটা অনুশীলন করেন এবং আগে অন্য ভাষা শেখার অভিজ্ঞতা কেমন, তার ওপর।',
      },
    },
    {
      q: { en: 'Does the DELF A1 diploma expire?', bn: 'DELF A1 ডিপ্লোমার কি মেয়াদ শেষ হয়?' },
      a: {
        en: 'No. DELF diplomas do not expire. Some institutions may still ask for recent proof of your level, so check their requirements.',
        bn: 'না, DELF ডিপ্লোমার মেয়াদ শেষ হয় না। তবে কিছু প্রতিষ্ঠান সাম্প্রতিক ভাষা দক্ষতার প্রমাণ চাইতে পারে, তাই তাদের শর্ত দেখে নিন।',
      },
    },
    {
      q: {
        en: 'What happens if I score below 5 in one section?',
        bn: 'কোনো একটি অংশে ৫-এর কম পেলে কী হয়?',
      },
      a: {
        en: 'You do not pass, even if your total is 50 or more. You would need to register again and take the whole exam in a later session.',
        bn: 'মোট নম্বর ৫০ বা তার বেশি হলেও আপনি পাস করবেন না। পরবর্তী কোনো সেশনে আবার রেজিস্ট্রেশন করে পুরো পরীক্ষা দিতে হবে।',
      },
    },
    {
      q: { en: 'Can I skip A1 and take DELF A2 directly?', bn: 'A1 বাদ দিয়ে কি সরাসরি DELF A2 দেওয়া যায়?' },
      a: {
        en: 'Yes. Each DELF level is a separate diploma, so you can register for any level. If a level test shows you are already close to A2, aiming for A2 directly can save time.',
        bn: 'হ্যাঁ। প্রতিটি DELF লেভেল আলাদা ডিপ্লোমা, তাই যেকোনো লেভেলে রেজিস্ট্রেশন করা যায়। লেভেল টেস্টে যদি দেখা যায় আপনি A2-এর কাছাকাছি আছেন, তাহলে সরাসরি A2-কে লক্ষ্য করলে সময় বাঁচতে পারে।',
      },
    },
  ],
};
const post05: BlogPost = {
  slug: 'delf-a2-vs-b1-difference',
  date: '2026-10-01T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.delf,
  tags: ['delf a2', 'delf b1', 'cefr levels', 'french grammar', 'study plan'],
  cover: { theme: 'delf', icon: 'trending-up', label: { en: 'A2 → B1', bn: 'A2 → B1' } },
  title: {
    en: 'DELF A2 vs B1: What Changes and How Long the Jump Takes',
    bn: 'DELF A2 বনাম B1: কী কী বদলায় এবং এই ধাপে কত সময় লাগে',
  },
  metaTitle: {
    en: 'DELF A2 vs B1: Differences and Time Needed',
    bn: 'DELF A2 বনাম B1: পার্থক্য ও প্রয়োজনীয় সময়',
  },
  metaDescription: {
    en: 'What really changes from DELF A2 to B1: skills, grammar, writing and speaking tasks, typical study hours, and which level to aim for.',
    bn: 'DELF A2 থেকে B1-এ আসলে কী বদলায়: দক্ষতা, গ্রামার, রাইটিং ও স্পিকিংয়ের কাজ, সাধারণত কত ঘণ্টা লাগে এবং কোন লেভেল বেছে নেবেন।',
  },
  excerpt: {
    en: 'B1 is only one level above A2, but it asks for real independence. Here is what changes in each skill, the grammar you need and a realistic timeline.',
    bn: 'B1 মাত্র এক ধাপ ওপরে, কিন্তু এখানে সত্যিকারের স্বাধীনতা লাগে। প্রতিটি দক্ষতায় কী বদলায়, কোন গ্রামার লাগে এবং বাস্তবসম্মত সময়সীমা কত, জেনে নিন।',
  },
  coverAlt: {
    en: 'Illustrated cover: a rising arrow with the words A2 to B1',
    bn: 'ইলাস্ট্রেটেড কভার: ঊর্ধ্বমুখী তীরচিহ্ন ও A2 থেকে B1 লেখা',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'Once you have reached A2, the next goal is often B1. On paper it is just one level higher, but in practice B1 is a real change: you move from handling routine exchanges to expressing opinions, telling stories in the past and coping with situations you have not rehearsed. This post explains what changes between DELF A2 and B1, skill by skill, how long the step typically takes and how to choose the right target for your goals.',
      },
      { type: 'h2', text: 'A2 and B1 in one sentence each' },
      {
        type: 'ul',
        items: [
          '**A2 (basic user):** you can manage simple, routine tasks such as shopping, describing your family and daily routine, talking about recent events in simple terms and understanding short, clear messages.',
          '**B1 (independent user):** you can deal with most situations while travelling or living in a French-speaking place, describe experiences and plans, give reasons and opinions, and follow the main points of clear speech on familiar topics.',
        ],
      },
      {
        type: 'p',
        text: 'The word “independent” is the key. At B1 you are expected to keep a conversation going without the examiner rescuing you every few seconds.',
      },
      { type: 'h2', text: 'What changes in the DELF exam, skill by skill' },
      {
        type: 'p',
        text: 'The scoring rules are the same at both levels: four skills marked out of 25, a pass mark of 50/100 and at least 5/25 in each skill. What changes is the length and difficulty of the tasks. The timings below are approximate.',
      },
      { type: 'h3', text: 'Listening' },
      {
        type: 'p',
        text: 'At A2 (about 25 minutes) you hear short announcements, phone messages and everyday conversations. At B1 (also about 25 minutes) the recordings are longer, such as radio extracts, interviews and discussions, and you must understand not only facts but also attitudes and opinions.',
      },
      { type: 'h3', text: 'Reading' },
      {
        type: 'p',
        text: 'A2 reading (about 30 minutes) uses short practical texts like advertisements, emails and signs. B1 reading (about 35 minutes) adds longer articles where you need to identify the writer’s point of view and pick out relevant information from several documents.',
      },
      { type: 'h3', text: 'Writing' },
      {
        type: 'p',
        text: 'At A2 (about 45 minutes) you write two short texts, for example describing an event or replying to an invitation. At B1 (about 45 minutes) you write one longer text of around 160 words, often an essay, a forum post or a letter in which you give and justify your opinion. Organisation counts: an introduction, clear arguments and a conclusion.',
      },
      { type: 'h3', text: 'Speaking' },
      {
        type: 'p',
        text: 'A2 speaking (about 6–8 minutes, with around 10 minutes of preparation) includes a guided interview, a short monologue and a role-play. B1 speaking lasts about 15 minutes, with around 10 minutes of preparation for the final part: you react to a short document, present a point of view and defend it while the examiner asks follow-up questions.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Formats are being updated',
        text: 'France Éducation international has been updating some DELF task formats. Always check the current sample papers on its official website before you sit the exam.',
      },
      { type: 'h2', text: 'The grammar jump from A2 to B1' },
      {
        type: 'p',
        text: 'Most learners feel the jump in grammar first. At A2 you mainly need the present, the passé composé and the near future (aller + infinitive). At B1 you are expected to combine tenses and link ideas smoothly.',
      },
      {
        type: 'ul',
        items: [
          '**Passé composé vs imparfait:** telling a story with background (imparfait) and events (passé composé): “Il pleuvait quand je suis arrivé.”',
          '**Futur simple:** plans and predictions: “Je travaillerai au Canada.”',
          '**Conditionnel présent:** polite requests, hypotheses and advice: “Je voudrais…”, “Si j’avais le temps, je voyagerais.”',
          '**Introduction to the subjonctif:** after common expressions such as “il faut que” and “je veux que”.',
          '**Relative pronouns:** qui, que, où and dont, to build longer, connected sentences.',
          '**Connectors:** d’abord, ensuite, pourtant, par contre, donc, c’est pourquoi, à mon avis. These are what make an opinion text sound organised.',
        ],
      },
      {
        type: 'p',
        text: 'Vocabulary also widens to work, studies, health, the environment, the media and society. You do not need rare words, but you do need enough of them to explain and justify what you think.',
      },
      { type: 'h2', text: 'How long does it take to go from A2 to B1?' },
      {
        type: 'p',
        text: 'Commonly cited estimates put A2 at around 160–200 cumulative hours of guided learning and B1 at around 350–400 hours. That suggests roughly 150–200 extra hours for the A2 to B1 step. Treat these as rough guides only. Your real timeline depends on:',
      },
      {
        type: 'ul',
        items: [
          'How many hours a week you study, and how much you practise outside class.',
          'How much you actually speak and write, not just read and listen.',
          'Whether your A2 foundation is solid, especially verb forms.',
          'Your exposure to French outside lessons: podcasts, videos and conversation partners.',
        ],
      },
      {
        type: 'p',
        text: 'As an example, a learner who studies consistently for 6–8 hours a week might need around five to seven months for this step. Someone studying fewer hours, or starting with gaps, should expect it to take longer.',
      },
      { type: 'h2', text: 'Should you aim for A2 or B1?' },
      { type: 'h3', text: 'For France’s residence rules' },
      {
        type: 'p',
        text: 'France’s reform of its language requirements, applicable from 2026, links different French levels to different residence documents. According to official French government information, A2 applies to a multi-year residence permit and B1 to the 10-year resident card. If you live in France or plan to, read our explainer on [France’s 2026 language requirement](/blog/france-language-requirement-2026-residence-citizenship) and verify your own situation with official sources.',
      },
      { type: 'h3', text: 'As a step towards TEF or TCF Canada' },
      {
        type: 'p',
        text: 'For Canadian immigration, the usual target is NCLC 7 in all four skills, which requires a level above B1. B1 is a practical milestone on that path: the grammar and opinion skills you build here are exactly what TEF Canada and TCF Canada writing and speaking tasks demand.',
      },
      { type: 'h3', text: 'For general goals' },
      {
        type: 'p',
        text: 'If you need French for travel or basic everyday life, A2 may be enough. If you want to study, work or take a test later, B1 gives you far more independence.',
      },
      { type: 'h2', text: 'A study plan for moving from A2 to B1' },
      {
        type: 'ol',
        items: [
          '**Fix your A2 base (2–4 weeks):** review the present, passé composé, articles and pronouns. Our [DELF A2 course](/courses/delf-a2) or the [DELF A2 recorded course](/recorded/delf-a2-recorded-course) can help fill gaps.',
          '**Learn the new tenses through stories (6–8 weeks):** each week, write a short paragraph about your weekend or your childhood, mixing imparfait and passé composé.',
          '**Practise opinions (ongoing):** pick one topic a week, such as online learning, city life or social media, and write 160 words with an introduction, two arguments and a conclusion.',
          '**Speak about documents:** read a short article, prepare for 10 minutes and speak for 3–4 minutes, then answer questions from a teacher or partner.',
          '**Mock exams (final 3–4 weeks):** complete timed sample papers and review every mistake.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Get your opinions corrected',
        text: 'Opinion writing and speaking improve fastest with regular correction. Our live [DELF B1 course](/courses/delf-b1) includes writing feedback and speaking practice with a teacher.',
      },
      {
        type: 'cta',
        title: 'Find out where you stand between A2 and B1',
        text: 'Take the free level test, then choose the DELF A2 or B1 course that matches your result.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/courses/delf-b1',
        secondaryLabel: 'View the DELF B1 course',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'A2 অর্জনের পর অনেকের পরের লক্ষ্য হয় B1। কাগজে-কলমে এটি মাত্র এক ধাপ ওপরে, কিন্তু বাস্তবে বড় একটি পরিবর্তন: রুটিনমাফিক কথাবার্তা সামলানো থেকে আপনাকে যেতে হয় মতামত প্রকাশ, অতীতের ঘটনা বর্ণনা এবং আগে থেকে অনুশীলন না করা পরিস্থিতি সামলানোর পর্যায়ে। এই লেখায় দেখানো হলো DELF A2 ও B1-এর মধ্যে প্রতিটি দক্ষতায় কী বদলায়, এই ধাপে সাধারণত কত সময় লাগে, এবং আপনার লক্ষ্য অনুযায়ী কোন লেভেল বেছে নেবেন।',
      },
      { type: 'h2', text: 'এক বাক্যে A2 ও B1' },
      {
        type: 'ul',
        items: [
          '**A2 (বেসিক ইউজার):** কেনাকাটা, পরিবার ও দৈনন্দিন রুটিনের বর্ণনা, সাম্প্রতিক ঘটনা সহজভাবে বলা এবং ছোট, স্পষ্ট বার্তা বোঝার মতো সহজ ও নিয়মিত কাজগুলো সামলাতে পারেন।',
          '**B1 (ইন্ডিপেন্ডেন্ট ইউজার):** ফরাসিভাষী কোনো জায়গায় ভ্রমণ বা বসবাসের সময় বেশিরভাগ পরিস্থিতি সামলাতে পারেন, অভিজ্ঞতা ও পরিকল্পনা বর্ণনা করতে পারেন, কারণ ও মতামত দিতে পারেন, এবং পরিচিত বিষয়ে স্পষ্ট কথার মূল বক্তব্য বুঝতে পারেন।',
        ],
      },
      {
        type: 'p',
        text: 'মূল শব্দটি হলো “ইন্ডিপেন্ডেন্ট” বা স্বাধীন। B1-এ আশা করা হয় যে পরীক্ষক বারবার সাহায্য না করলেও আপনি নিজেই কথোপকথন চালিয়ে যেতে পারবেন।',
      },
      { type: 'h2', text: 'DELF পরীক্ষায় দক্ষতাভেদে কী বদলায়' },
      {
        type: 'p',
        text: 'দুই লেভেলেই নম্বরের নিয়ম একই: চারটি দক্ষতা, প্রতিটি ২৫ নম্বরে, পাস নম্বর ৫০/১০০ এবং প্রতিটি দক্ষতায় অন্তত ৫/২৫। বদলায় কাজের দৈর্ঘ্য ও কাঠিন্য। নিচের সময়গুলো আনুমানিক।',
      },
      { type: 'h3', text: 'লিসেনিং' },
      {
        type: 'p',
        text: 'A2-তে (প্রায় ২৫ মিনিট) ছোট ঘোষণা, ফোন মেসেজ ও দৈনন্দিন কথোপকথন শুনবেন। B1-এ (এটিও প্রায় ২৫ মিনিট) রেকর্ডিং দীর্ঘতর, যেমন রেডিওর অংশ, সাক্ষাৎকার ও আলোচনা। এখানে শুধু তথ্য নয়, বক্তার মনোভাব ও মতামতও বুঝতে হয়।',
      },
      { type: 'h3', text: 'রিডিং' },
      {
        type: 'p',
        text: 'A2 রিডিংয়ে (প্রায় ৩০ মিনিট) বিজ্ঞাপন, ইমেইল ও সাইনবোর্ডের মতো ছোট ব্যবহারিক লেখা থাকে। B1 রিডিংয়ে (প্রায় ৩৫ মিনিট) যোগ হয় দীর্ঘ প্রবন্ধ, যেখানে লেখকের দৃষ্টিভঙ্গি চিনতে হয় এবং একাধিক ডকুমেন্ট থেকে প্রাসঙ্গিক তথ্য বের করতে হয়।',
      },
      { type: 'h3', text: 'রাইটিং' },
      {
        type: 'p',
        text: 'A2-তে (প্রায় ৪৫ মিনিট) দুটি ছোট লেখা লিখতে হয়, যেমন কোনো ঘটনার বর্ণনা বা আমন্ত্রণের উত্তর। B1-এ (প্রায় ৪৫ মিনিট) লিখতে হয় প্রায় ১৬০ শব্দের একটি দীর্ঘ লেখা, প্রায়ই রচনা, ফোরাম পোস্ট বা চিঠি, যেখানে নিজের মতামত দিয়ে তার পক্ষে যুক্তি দেখাতে হয়। গোছানো কাঠামো জরুরি: ভূমিকা, স্পষ্ট যুক্তি ও উপসংহার।',
      },
      { type: 'h3', text: 'স্পিকিং' },
      {
        type: 'p',
        text: 'A2 স্পিকিং (প্রায় ৬–৮ মিনিট, সঙ্গে প্রায় ১০ মিনিট প্রস্তুতি) গাইডেড ইন্টারভিউ, ছোট একক বক্তব্য ও রোল-প্লে নিয়ে গঠিত। B1 স্পিকিং প্রায় ১৫ মিনিটের, শেষ অংশের জন্য প্রায় ১০ মিনিট প্রস্তুতি পাওয়া যায়: একটি ছোট ডকুমেন্টের ওপর প্রতিক্রিয়া জানিয়ে নিজের দৃষ্টিভঙ্গি উপস্থাপন করতে হয় এবং পরীক্ষকের পাল্টা প্রশ্নের মুখে তা সমর্থন করতে হয়।',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'ফরম্যাট হালনাগাদ হচ্ছে',
        text: 'France Éducation international কিছু DELF কাজের ধরন হালনাগাদ করছে। পরীক্ষার আগে অবশ্যই তাদের অফিশিয়াল ওয়েবসাইটে বর্তমান নমুনা প্রশ্নপত্র দেখে নিন।',
      },
      { type: 'h2', text: 'A2 থেকে B1-এ গ্রামারের লাফ' },
      {
        type: 'p',
        text: 'বেশিরভাগ শিক্ষার্থী প্রথম পার্থক্যটা টের পান গ্রামারে। A2-তে মূলত লাগে বর্তমান কাল, passé composé এবং নিকট ভবিষ্যৎ (aller + infinitive)। B1-এ আশা করা হয় আপনি বিভিন্ন কাল মিলিয়ে ব্যবহার করবেন এবং ভাবনাগুলো সাবলীলভাবে জুড়ে দেবেন।',
      },
      {
        type: 'ul',
        items: [
          '**Passé composé বনাম imparfait:** পটভূমি (imparfait) ও ঘটনা (passé composé) মিলিয়ে গল্প বলা: “Il pleuvait quand je suis arrivé.”',
          '**Futur simple:** পরিকল্পনা ও পূর্বাভাস: “Je travaillerai au Canada.”',
          '**Conditionnel présent:** ভদ্র অনুরোধ, অনুমান ও পরামর্শ: “Je voudrais…”, “Si j’avais le temps, je voyagerais.”',
          '**Subjonctif-এর সূচনা:** “il faut que” ও “je veux que”-এর মতো প্রচলিত অভিব্যক্তির পরে।',
          '**রিলেটিভ প্রোনাউন:** qui, que, où ও dont দিয়ে দীর্ঘ, সংযুক্ত বাক্য গঠন।',
          '**সংযোজক শব্দ:** d’abord, ensuite, pourtant, par contre, donc, c’est pourquoi, à mon avis। মতামতের লেখাকে গোছানো শোনায় এগুলোই।',
        ],
      },
      {
        type: 'p',
        text: 'শব্দভান্ডারও বিস্তৃত হয়: কাজ, পড়াশোনা, স্বাস্থ্য, পরিবেশ, গণমাধ্যম ও সমাজ। দুর্লভ শব্দের দরকার নেই, তবে নিজের ভাবনা ব্যাখ্যা ও যুক্তি দিয়ে বোঝানোর মতো যথেষ্ট শব্দ জানা দরকার।',
      },
      { type: 'h2', text: 'A2 থেকে B1-এ যেতে কত সময় লাগে?' },
      {
        type: 'p',
        text: 'প্রচলিত হিসাব অনুযায়ী A2-তে পৌঁছাতে মোট প্রায় ১৬০–২০০ ঘণ্টা এবং B1-এ প্রায় ৩৫০–৪০০ ঘণ্টা গাইডেড পড়াশোনা লাগে। অর্থাৎ A2 থেকে B1-এর ধাপে মোটামুটি অতিরিক্ত ১৫০–২০০ ঘণ্টা। এগুলোকে কেবল মোটা দাগের ধারণা হিসেবে নিন। আপনার আসল সময় নির্ভর করবে:',
      },
      {
        type: 'ul',
        items: [
          'সপ্তাহে কত ঘণ্টা পড়েন এবং ক্লাসের বাইরে কতটা অনুশীলন করেন।',
          'শুধু পড়া ও শোনা নয়, আসলে কতটা বলেন ও লেখেন।',
          'আপনার A2-এর ভিত্তি মজবুত কি না, বিশেষ করে ক্রিয়ার রূপগুলো।',
          'ক্লাসের বাইরে ফরাসির সংস্পর্শ: পডকাস্ট, ভিডিও ও কথোপকথনের সঙ্গী।',
        ],
      },
      {
        type: 'p',
        text: 'উদাহরণ হিসেবে, যিনি নিয়মিত সপ্তাহে ৬–৮ ঘণ্টা পড়েন, তাঁর এই ধাপে প্রায় পাঁচ থেকে সাত মাস লাগতে পারে। কম সময় দিলে বা ভিত্তিতে ঘাটতি থাকলে আরও বেশি সময় লাগবে, এটাই স্বাভাবিক।',
      },
      { type: 'h2', text: 'A2 নাকি B1, কোনটিকে লক্ষ্য করবেন?' },
      { type: 'h3', text: 'ফ্রান্সের রেসিডেন্সি নিয়মের জন্য' },
      {
        type: 'p',
        text: '২০২৬ থেকে কার্যকর ফ্রান্সের ভাষা-সংক্রান্ত সংস্কারে বিভিন্ন রেসিডেন্স ডকুমেন্টের জন্য আলাদা আলাদা ফরাসি লেভেল নির্ধারণ করা হয়েছে। ফরাসি সরকারের অফিশিয়াল তথ্য অনুযায়ী, বহুবর্ষী রেসিডেন্স পারমিটের জন্য A2 এবং ১০ বছরের রেসিডেন্ট কার্ডের জন্য B1। আপনি ফ্রান্সে থাকলে বা যাওয়ার পরিকল্পনা করলে আমাদের [ফ্রান্সের ২০২৬ সালের ভাষা-শর্ত](/blog/france-language-requirement-2026-residence-citizenship) বিষয়ক লেখাটি পড়ুন এবং নিজের পরিস্থিতি অফিশিয়াল সূত্র থেকে যাচাই করে নিন।',
      },
      { type: 'h3', text: 'TEF বা TCF Canada-র পথে একটি ধাপ হিসেবে' },
      {
        type: 'p',
        text: 'কানাডার ইমিগ্রেশনের ক্ষেত্রে সাধারণ লক্ষ্য হলো চারটি দক্ষতাতেই NCLC 7, যার জন্য B1-এর চেয়ে বেশি দক্ষতা লাগে। সেই পথে B1 একটি বাস্তব মাইলফলক: এখানে যে গ্রামার ও মতামত প্রকাশের দক্ষতা গড়ে ওঠে, TEF Canada ও TCF Canada-র রাইটিং ও স্পিকিং অংশে ঠিক সেটাই চাওয়া হয়।',
      },
      { type: 'h3', text: 'সাধারণ প্রয়োজনের জন্য' },
      {
        type: 'p',
        text: 'ভ্রমণ বা দৈনন্দিন মৌলিক প্রয়োজনের জন্য ফরাসি দরকার হলে A2 যথেষ্ট হতে পারে। পরে পড়াশোনা, কাজ বা কোনো পরীক্ষার পরিকল্পনা থাকলে B1 আপনাকে অনেক বেশি স্বাধীনতা দেবে।',
      },
      { type: 'h2', text: 'A2 থেকে B1-এ যাওয়ার একটি স্টাডি প্ল্যান' },
      {
        type: 'ol',
        items: [
          '**A2-এর ভিত্তি ঠিক করুন (২–৪ সপ্তাহ):** বর্তমান কাল, passé composé, আর্টিকেল ও প্রোনাউন আবার ঝালিয়ে নিন। ঘাটতি পূরণে আমাদের [DELF A2 কোর্স](/courses/delf-a2) অথবা [DELF A2 রেকর্ডেড কোর্স](/recorded/delf-a2-recorded-course) কাজে আসতে পারে।',
          '**গল্পের মাধ্যমে নতুন কাল শিখুন (৬–৮ সপ্তাহ):** প্রতি সপ্তাহে আপনার সপ্তাহান্ত বা ছোটবেলা নিয়ে একটি ছোট অনুচ্ছেদ লিখুন, imparfait ও passé composé মিলিয়ে।',
          '**মতামত প্রকাশ অনুশীলন করুন (চলমান):** প্রতি সপ্তাহে একটি বিষয় বেছে নিন, যেমন অনলাইন শিক্ষা, শহরের জীবন বা সোশ্যাল মিডিয়া, এবং ভূমিকা, দুটি যুক্তি ও উপসংহারসহ ১৬০ শব্দ লিখুন।',
          '**ডকুমেন্ট নিয়ে কথা বলুন:** একটি ছোট প্রবন্ধ পড়ে ১০ মিনিট প্রস্তুতি নিন, ৩–৪ মিনিট বলুন, তারপর শিক্ষক বা সঙ্গীর প্রশ্নের উত্তর দিন।',
          '**মক পরীক্ষা (শেষ ৩–৪ সপ্তাহ):** সময় ধরে নমুনা প্রশ্নপত্র সমাধান করুন এবং প্রতিটি ভুল পর্যালোচনা করুন।',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'মতামতের লেখা সংশোধন করিয়ে নিন',
        text: 'নিয়মিত সংশোধন পেলে মতামতভিত্তিক রাইটিং ও স্পিকিং সবচেয়ে দ্রুত উন্নত হয়। আমাদের লাইভ [DELF B1 কোর্সে](/courses/delf-b1) শিক্ষকের সঙ্গে রাইটিং ফিডব্যাক ও স্পিকিং অনুশীলন রয়েছে।',
      },
      {
        type: 'cta',
        title: 'A2 ও B1-এর মধ্যে আপনি কোথায় আছেন, জেনে নিন',
        text: 'ফ্রি লেভেল টেস্ট দিন, তারপর ফলাফল অনুযায়ী DELF A2 বা B1 কোর্স বেছে নিন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/courses/delf-b1',
        secondaryLabel: 'DELF B1 কোর্স দেখুন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Can I take DELF B1 without passing A2?', bn: 'A2 পাস না করে কি DELF B1 দেওয়া যায়?' },
      a: {
        en: 'Yes. Each DELF level is a separate diploma, so you can register directly for B1 if your level is ready.',
        bn: 'হ্যাঁ। প্রতিটি DELF লেভেল আলাদা ডিপ্লোমা, তাই আপনার দক্ষতা প্রস্তুত থাকলে সরাসরি B1-এ রেজিস্ট্রেশন করতে পারেন।',
      },
    },
    {
      q: { en: 'Is DELF B1 much harder than A2?', bn: 'DELF B1 কি A2-এর চেয়ে অনেক কঠিন?' },
      a: {
        en: 'It is a noticeable step. The pass rules are the same, but the tasks are longer and you must give and justify opinions, especially in writing and speaking.',
        bn: 'হ্যাঁ, ধাপটি বেশ লক্ষণীয়। পাসের নিয়ম একই, তবে কাজগুলো দীর্ঘতর এবং বিশেষ করে রাইটিং ও স্পিকিংয়ে মতামত দিয়ে তার পক্ষে যুক্তি দেখাতে হয়।',
      },
    },
    {
      q: { en: 'How many hours does it take to go from A2 to B1?', bn: 'A2 থেকে B1-এ যেতে কত ঘণ্টা লাগে?' },
      a: {
        en: 'Commonly cited estimates suggest roughly 150–200 extra hours of guided learning, but it varies a lot with your practice time and how solid your A2 base is.',
        bn: 'প্রচলিত হিসাবে মোটামুটি অতিরিক্ত ১৫০–২০০ ঘণ্টা গাইডেড পড়াশোনা লাগে, তবে আপনার অনুশীলনের সময় এবং A2-এর ভিত্তি কতটা মজবুত তার ওপর এটি অনেকটাই নির্ভর করে।',
      },
    },
    {
      q: { en: 'Is DELF B1 accepted for Canada’s Express Entry?', bn: 'কানাডার Express Entry-তে কি DELF B1 গ্রহণযোগ্য?' },
      a: {
        en: 'No. For French, IRCC accepts TEF Canada or TCF Canada results for Express Entry, not DELF. B1-level skills are a useful step, but the common target of NCLC 7 needs a higher level.',
        bn: 'না। Express Entry-তে ফরাসির জন্য IRCC গ্রহণ করে TEF Canada বা TCF Canada-র ফলাফল, DELF নয়। B1 লেভেলের দক্ষতা একটি কাজের ধাপ, তবে সাধারণ লক্ষ্য NCLC 7-এর জন্য আরও উঁচু লেভেল লাগে।',
      },
    },
  ],
};
const post06: BlogPost = {
  slug: 'france-language-requirement-2026-residence-citizenship',
  date: '2026-10-08T10:00:00+06:00',
  readMinutes: 5,
  category: BLOG_CATEGORIES.france,
  tags: ['france', 'residence permit', 'naturalisation', 'delf b1', 'delf b2', 'immigration law'],
  cover: { theme: 'france', icon: 'landmark', label: { en: '2026: A2 · B1 · B2', bn: '২০২৬: A2 · B1 · B2' } },
  title: {
    en: 'France’s 2026 French-Language Requirement for Residence Permits and Citizenship',
    bn: 'ফ্রান্সে রেসিডেন্স পারমিট ও নাগরিকত্বের জন্য ২০২৬ সালের ফরাসি ভাষার শর্ত',
  },
  metaTitle: {
    en: 'France 2026 French Level Rules: Permits & Citizenship',
    bn: 'ফ্রান্স ২০২৬: রেসিডেন্স ও নাগরিকত্বে ফরাসি ভাষার শর্ত',
  },
  metaDescription: {
    en: 'From 2026 France links residence permits and naturalisation to French levels A2, B1 and B2. What changed, what proof counts and how to verify it.',
    bn: '২০২৬ থেকে ফ্রান্সে রেসিডেন্স পারমিট ও নাগরিকত্বের সঙ্গে A2, B1 ও B2 ফরাসি লেভেলের শর্ত যুক্ত। কী বদলেছে, কোন প্রমাণ লাগে, কীভাবে যাচাই করবেন।',
  },
  excerpt: {
    en: 'Since 1 January 2026, the French level you must prove in France depends on the document you apply for: A2, B1 or B2. A careful, plain-language overview for Bangladeshi learners, with what to verify and how to prepare.',
    bn: '১ জানুয়ারি ২০২৬ থেকে ফ্রান্সে কোন ফরাসি লেভেল প্রমাণ করতে হবে, তা নির্ভর করে আপনি কোন ডকুমেন্টের জন্য আবেদন করছেন তার ওপর: A2, B1 নাকি B2। বাংলাদেশি শিক্ষার্থীদের জন্য সহজ ভাষায় সতর্ক একটি সারসংক্ষেপ, কী যাচাই করবেন আর কীভাবে প্রস্তুতি নেবেন।',
  },
  coverAlt: {
    en: 'Illustrated cover: French tricolour line with a landmark icon and the levels A2, B1 and B2 for 2026',
    bn: 'ইলাস্ট্রেটেড কভার: ফরাসি ত্রিবর্ণ রেখা, একটি ল্যান্ডমার্ক আইকন এবং ২০২৬ সালের A2, B1 ও B2 লেভেল',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'For years, many foreign residents in France could obtain or renew a residence permit mainly by showing that they had followed French classes, without proving a specific level. A reform adopted in 2024 changed that logic. According to official French government information, since 1 January 2026 the level of French you must prove depends on the document you are applying for. If you are a Bangladeshi already living in France, planning to move there, or helping family members who live there, this article explains in plain language what has been announced and how to prepare as a learner.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'This is not legal advice',
        text: 'This article is general information for language learners, written in October 2026. Immigration rules, exemptions and accepted documents can change, and they depend on your personal situation. Always verify on service-public.fr (the French administration’s official information site) and with your préfecture, or consult a qualified immigration lawyer, before you act.',
      },
      { type: 'h2', text: 'What changed and where it comes from' },
      {
        type: 'p',
        text: 'The basis is the French law on immigration and integration of 26 January 2024. An implementing decree published in 2025 set the required language levels and the date they apply: 1 January 2026. Broadly, under the earlier system a first multi-year permit mostly required attending the language training linked to the republican integration contract, the 10-year resident card required A2, and naturalisation required B1. The reform raises each step to a defined and higher level, and it expects that level to be proven, not just studied.',
      },
      { type: 'h2', text: 'The three levels at a glance' },
      {
        type: 'ul',
        items: [
          '**A2 for a first multi-year residence permit** (carte de séjour pluriannuelle).',
          '**B1 for the 10-year resident card** (carte de résident).',
          '**B2 for French nationality by naturalisation.**',
        ],
      },
      {
        type: 'p',
        text: 'These are levels of the Common European Framework of Reference for Languages (CEFR), the same scale used by DELF diplomas. How exactly they apply to renewals, changes of status or applications already in progress depends on your case, so check with the préfecture.',
      },
      { type: 'h3', text: 'What these levels mean in daily life' },
      {
        type: 'ul',
        items: [
          '**A2:** you can handle simple, routine situations: shopping, appointments, describing your family, work and surroundings in short sentences, and understanding clear, slow speech on familiar topics.',
          '**B1:** you can manage most everyday situations on your own, follow the main points of clear speech about work or daily life, write a simple connected text and give brief reasons for an opinion.',
          '**B2:** you can follow longer discussions and the news, argue a point of view with some nuance, and write clear, detailed texts. This is a significant step up from B1.',
        ],
      },
      { type: 'h2', text: 'What counts as proof?' },
      {
        type: 'p',
        text: 'The official information indicates that the level must be shown with a recognised language certificate or diploma, rather than a simple certificate of course attendance. This typically includes DELF and DALF diplomas and versions of the TCF or TEF that the French authorities recognise for these procedures (there are versions designed for integration, residence and nationality). Some French school or university diplomas may also be accepted. The exact list, any minimum scores and how recent a test result must be are set by official texts, so check service-public.fr or ask your préfecture before you book an exam.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Diploma or test result?',
        text: 'A DELF diploma does not expire, while some test results are accepted only for a limited period for administrative purposes. Before you register, ask which document your préfecture expects for your specific application.',
      },
      { type: 'h2', text: 'The civic exam' },
      {
        type: 'p',
        text: 'The reform also introduced a civic exam (examen civique) covering the values of the Republic, its institutions, rights and duties, history and everyday life in France. It is linked to certain permits and to nationality, and it is taken in French. So even where the civic exam is a separate requirement, your language level directly affects how comfortable you will be with it. The format, the pass mark and who must take it are described on official French government websites.',
      },
      { type: 'h2', text: 'Exemptions and special cases' },
      {
        type: 'p',
        text: 'Not every residence permit is affected in the same way, and exemptions exist for some people, for example where health or a disability makes the test impossible. Other situations may follow different rules depending on age, status or the type of permit. Whether you fall into an exempt category is a question for the préfecture or a lawyer, not for a blog post or a Facebook comment. Be cautious with anyone who promises a shortcut.',
      },
      { type: 'h2', text: 'What this means for Bangladeshi learners' },
      { type: 'h3', text: 'If you already live in France' },
      {
        type: 'p',
        text: 'Find out which document you will apply for next and when your current permit expires. Then work backwards: how many months do you need to reach the required level, and when are the next exam sessions near you? Exam sessions can fill up, and results take time to arrive, so leave a comfortable margin.',
      },
      { type: 'h3', text: 'If you plan to move to France' },
      {
        type: 'p',
        text: 'Your first permit (for study or work, for example) may have its own conditions, but the next steps in France are now tied to language levels. Starting French while you are still in Bangladesh means arriving with a base instead of starting from zero under time pressure.',
      },
      { type: 'h3', text: 'If you are aiming for nationality' },
      {
        type: 'p',
        text: 'B2 requires real, sustained study. As a rough estimate often cited for learners starting from zero, B2 takes around 550 to 650 hours of guided learning, plus practice. Someone who already holds B1 is much closer, but the jump to B2, especially in writing and speaking, still needs focused preparation.',
      },
      { type: 'h2', text: 'How to prepare: a practical plan' },
      {
        type: 'ol',
        items: [
          'Find your current level with our [free level test](/quiz/placement-test), so your plan starts from facts rather than guesses.',
          'Match your target to a course: A2 for a multi-year permit ([DELF A2 course](/courses/delf-a2)), B1 for the resident card ([DELF B1 course](/courses/delf-b1)), or B2 for nationality ([DELF B2 course](/courses/delf-b2)).',
          'Confirm with your préfecture or on service-public.fr which certificates they accept for your application.',
          'Register for the exam early and check the session dates and fees directly with the test centre.',
          'Keep certified copies of your diploma or results, and note any validity dates.',
        ],
      },
      {
        type: 'p',
        text: 'Practise all four skills, not only speaking. Many learners who chat comfortably in French lose points in reading or writing, and an official certificate requires the full set.',
      },
      {
        type: 'cta',
        title: 'Know your level before you plan',
        text: 'Take our free French level test, then choose the DELF course that matches the level your next application requires.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/courses/delf-b1',
        secondaryLabel: 'See the DELF B1 course',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'বহু বছর ধরে ফ্রান্সে অনেক বিদেশি বাসিন্দা নির্দিষ্ট কোনো লেভেল প্রমাণ না করেই, শুধু ফরাসি ক্লাসে অংশ নেওয়ার প্রমাণ দেখিয়ে রেসিডেন্স পারমিট পেতেন বা নবায়ন করতেন। ২০২৪ সালে গৃহীত একটি সংস্কার সেই নিয়ম বদলে দিয়েছে। ফরাসি সরকারের অফিশিয়াল তথ্য অনুযায়ী, ১ জানুয়ারি ২০২৬ থেকে কোন লেভেলের ফরাসি প্রমাণ করতে হবে, তা নির্ভর করে আপনি কোন ডকুমেন্টের জন্য আবেদন করছেন তার ওপর। আপনি যদি ফ্রান্সে বসবাসরত বাংলাদেশি হন, সেখানে যাওয়ার পরিকল্পনা করেন, কিংবা সেখানে থাকা পরিবারের সদস্যদের সাহায্য করেন, তাহলে এই লেখায় সহজ ভাষায় জানবেন কী ঘোষণা করা হয়েছে এবং একজন শিক্ষার্থী হিসেবে কীভাবে প্রস্তুতি নেবেন।',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'এটি আইনি পরামর্শ নয়',
        text: 'এই লেখাটি ভাষা শিক্ষার্থীদের জন্য সাধারণ তথ্য, লেখা হয়েছে অক্টোবর ২০২৬-এ। ইমিগ্রেশনের নিয়ম, ছাড় এবং গ্রহণযোগ্য ডকুমেন্ট বদলাতে পারে, আর তা আপনার ব্যক্তিগত পরিস্থিতির ওপরও নির্ভর করে। কোনো পদক্ষেপ নেওয়ার আগে অবশ্যই service-public.fr (ফরাসি প্রশাসনের অফিশিয়াল তথ্য সাইট) এবং আপনার préfecture-এর সঙ্গে যাচাই করুন, অথবা একজন যোগ্য ইমিগ্রেশন আইনজীবীর পরামর্শ নিন।',
      },
      { type: 'h2', text: 'কী বদলেছে এবং এর উৎস কী' },
      {
        type: 'p',
        text: 'এর ভিত্তি হলো ২৬ জানুয়ারি ২০২৪ তারিখের ইমিগ্রেশন ও ইন্টিগ্রেশন বিষয়ক ফরাসি আইন। ২০২৫ সালে প্রকাশিত একটি বাস্তবায়ন ডিক্রিতে প্রয়োজনীয় ভাষার লেভেল এবং কার্যকর হওয়ার তারিখ ঠিক করা হয়: ১ জানুয়ারি ২০২৬। মোটা দাগে, আগের ব্যবস্থায় প্রথম মাল্টি-ইয়ার পারমিটের জন্য মূলত রিপাবলিকান ইন্টিগ্রেশন চুক্তির সঙ্গে যুক্ত ভাষা প্রশিক্ষণে অংশ নিলেই চলত, ১০ বছরের রেসিডেন্ট কার্ডের জন্য লাগত A2, আর নাগরিকত্বের জন্য B1। নতুন সংস্কারে প্রতিটি ধাপের লেভেল নির্দিষ্ট করে আরও ওপরে তোলা হয়েছে, এবং শুধু পড়াশোনা নয়, সেই লেভেল প্রমাণ করাই প্রত্যাশিত।',
      },
      { type: 'h2', text: 'এক নজরে তিনটি লেভেল' },
      {
        type: 'ul',
        items: [
          '**প্রথম মাল্টি-ইয়ার রেসিডেন্স পারমিটের জন্য A2** (carte de séjour pluriannuelle)।',
          '**১০ বছরের রেসিডেন্ট কার্ডের জন্য B1** (carte de résident)।',
          '**ন্যাচারালাইজেশনের মাধ্যমে ফরাসি নাগরিকত্বের জন্য B2।**',
        ],
      },
      {
        type: 'p',
        text: 'এগুলো Common European Framework of Reference for Languages (CEFR)-এর লেভেল, DELF ডিপ্লোমাতেও একই স্কেল ব্যবহার হয়। নবায়ন, স্ট্যাটাস পরিবর্তন বা ইতিমধ্যে চলমান আবেদনের ক্ষেত্রে এগুলো ঠিক কীভাবে প্রযোজ্য হবে, তা আপনার কেসের ওপর নির্ভর করে, তাই préfecture-এ জেনে নিন।',
      },
      { type: 'h3', text: 'দৈনন্দিন জীবনে এই লেভেলগুলোর মানে' },
      {
        type: 'ul',
        items: [
          '**A2:** সহজ ও নিয়মিত পরিস্থিতি সামলাতে পারেন: কেনাকাটা, অ্যাপয়েন্টমেন্ট, ছোট ছোট বাক্যে পরিবার, কাজ ও চারপাশের বর্ণনা, এবং পরিচিত বিষয়ে ধীর ও স্পষ্ট কথা বোঝা।',
          '**B1:** বেশিরভাগ দৈনন্দিন পরিস্থিতি নিজে সামলাতে পারেন, কাজ বা দৈনন্দিন জীবন নিয়ে স্পষ্ট কথার মূল বক্তব্য ধরতে পারেন, সহজ ধারাবাহিক লেখা লিখতে পারেন এবং নিজের মতের পক্ষে সংক্ষেপে যুক্তি দিতে পারেন।',
          '**B2:** দীর্ঘ আলোচনা ও খবর বুঝতে পারেন, কিছুটা সূক্ষ্মতা রেখে নিজের মত যুক্তি দিয়ে তুলে ধরতে পারেন এবং স্পষ্ট, বিস্তারিত লেখা লিখতে পারেন। B1 থেকে এটি বেশ বড় একটি ধাপ।',
        ],
      },
      { type: 'h2', text: 'প্রমাণ হিসেবে কী গ্রহণযোগ্য?' },
      {
        type: 'p',
        text: 'অফিশিয়াল তথ্য অনুযায়ী, শুধু ক্লাসে উপস্থিতির সার্টিফিকেট নয়, স্বীকৃত কোনো ভাষা সার্টিফিকেট বা ডিপ্লোমা দিয়ে লেভেল প্রমাণ করতে হবে। এর মধ্যে সাধারণত থাকে DELF ও DALF ডিপ্লোমা এবং ফরাসি কর্তৃপক্ষের স্বীকৃত TCF বা TEF-এর সংস্করণ (ইন্টিগ্রেশন, রেসিডেন্স ও নাগরিকত্বের জন্য আলাদা সংস্করণ আছে)। ফ্রান্সের কিছু স্কুল বা বিশ্ববিদ্যালয়ের ডিপ্লোমাও গ্রহণযোগ্য হতে পারে। সঠিক তালিকা, ন্যূনতম স্কোর এবং টেস্ট রেজাল্ট কত সাম্প্রতিক হতে হবে, তা অফিশিয়াল বিধিতে নির্ধারিত, তাই পরীক্ষা বুক করার আগে service-public.fr দেখুন বা আপনার préfecture-এ জিজ্ঞেস করুন।',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'ডিপ্লোমা নাকি টেস্ট রেজাল্ট?',
        text: 'DELF ডিপ্লোমার কোনো মেয়াদ নেই, অথচ কিছু টেস্টের রেজাল্ট প্রশাসনিক কাজে নির্দিষ্ট সময় পর্যন্তই গ্রহণ করা হয়। রেজিস্ট্রেশনের আগে জেনে নিন আপনার নির্দিষ্ট আবেদনের জন্য préfecture কোন ডকুমেন্ট চায়।',
      },
      { type: 'h2', text: 'সিভিক পরীক্ষা' },
      {
        type: 'p',
        text: 'এই সংস্কারে একটি সিভিক পরীক্ষাও (examen civique) যুক্ত হয়েছে, যেখানে প্রজাতন্ত্রের মূল্যবোধ, প্রতিষ্ঠান, অধিকার ও কর্তব্য, ইতিহাস এবং ফ্রান্সের দৈনন্দিন জীবন নিয়ে প্রশ্ন থাকে। এটি নির্দিষ্ট কিছু পারমিট ও নাগরিকত্বের সঙ্গে যুক্ত, এবং পরীক্ষাটি ফরাসিতে হয়। তাই সিভিক পরীক্ষা আলাদা শর্ত হলেও আপনার ভাষার লেভেল সরাসরি প্রভাব ফেলবে আপনি সেখানে কতটা স্বচ্ছন্দ থাকবেন তার ওপর। পরীক্ষার ধরন, পাস মার্ক এবং কাদের দিতে হবে, তা ফরাসি সরকারের অফিশিয়াল ওয়েবসাইটে বর্ণনা করা আছে।',
      },
      { type: 'h2', text: 'ছাড় ও বিশেষ পরিস্থিতি' },
      {
        type: 'p',
        text: 'সব রেসিডেন্স পারমিট একইভাবে প্রভাবিত হয় না, আর কিছু মানুষের জন্য ছাড়ও আছে, যেমন স্বাস্থ্যগত কারণ বা প্রতিবন্ধিতার জন্য যাঁদের পক্ষে পরীক্ষা দেওয়া সম্ভব নয়। বয়স, স্ট্যাটাস বা পারমিটের ধরন অনুযায়ী অন্য কিছু ক্ষেত্রে ভিন্ন নিয়ম থাকতে পারে। আপনি ছাড়ের আওতায় পড়েন কি না, সেটি préfecture বা আইনজীবীর কাছে জানার প্রশ্ন, কোনো ব্লগ পোস্ট বা ফেসবুক কমেন্টের নয়। যিনি শর্টকাটের প্রতিশ্রুতি দেন, তাঁর ব্যাপারে সতর্ক থাকুন।',
      },
      { type: 'h2', text: 'বাংলাদেশি শিক্ষার্থীদের জন্য এর অর্থ কী' },
      { type: 'h3', text: 'আপনি যদি ইতিমধ্যে ফ্রান্সে থাকেন' },
      {
        type: 'p',
        text: 'জেনে নিন পরবর্তী কোন ডকুমেন্টের জন্য আবেদন করবেন এবং বর্তমান পারমিটের মেয়াদ কবে শেষ। তারপর পেছন দিক থেকে হিসাব করুন: প্রয়োজনীয় লেভেলে পৌঁছাতে কত মাস লাগবে, আর আপনার কাছাকাছি পরবর্তী পরীক্ষার সেশন কবে? সেশনের আসন দ্রুত ভরে যেতে পারে, রেজাল্ট আসতেও সময় লাগে, তাই হাতে যথেষ্ট সময় রাখুন।',
      },
      { type: 'h3', text: 'আপনি যদি ফ্রান্সে যাওয়ার পরিকল্পনা করেন' },
      {
        type: 'p',
        text: 'আপনার প্রথম পারমিটের (যেমন পড়াশোনা বা কাজের জন্য) নিজস্ব শর্ত থাকতে পারে, কিন্তু ফ্রান্সে পরবর্তী ধাপগুলো এখন ভাষার লেভেলের সঙ্গে বাঁধা। বাংলাদেশে থাকতেই ফরাসি শেখা শুরু করলে সেখানে গিয়ে সময়ের চাপে শূন্য থেকে শুরু করতে হয় না, একটি ভিত নিয়েই পৌঁছান।',
      },
      { type: 'h3', text: 'আপনার লক্ষ্য যদি নাগরিকত্ব হয়' },
      {
        type: 'p',
        text: 'B2-এর জন্য দরকার সত্যিকারের, ধারাবাহিক পড়াশোনা। শূন্য থেকে শুরু করা শিক্ষার্থীদের ক্ষেত্রে প্রায়ই যে আনুমানিক হিসাব দেওয়া হয়, তা হলো B2-এর জন্য প্রায় ৫৫০ থেকে ৬৫০ ঘণ্টা গাইডেড লার্নিং, সঙ্গে চর্চা। যাঁর ইতিমধ্যে B1 আছে, তিনি অনেকটা এগিয়ে, তবে B2-তে যাওয়ার লাফ, বিশেষ করে রাইটিং ও স্পিকিংয়ে, এখনো মনোযোগী প্রস্তুতি দাবি করে।',
      },
      { type: 'h2', text: 'কীভাবে প্রস্তুতি নেবেন: একটি বাস্তব পরিকল্পনা' },
      {
        type: 'ol',
        items: [
          'আমাদের [ফ্রি লেভেল টেস্ট](/quiz/placement-test) দিয়ে বর্তমান লেভেল জেনে নিন, যাতে পরিকল্পনা অনুমানের বদলে তথ্যের ওপর দাঁড়ায়।',
          'লক্ষ্য অনুযায়ী কোর্স বেছে নিন: মাল্টি-ইয়ার পারমিটের জন্য A2 ([DELF A2 কোর্স](/courses/delf-a2)), রেসিডেন্ট কার্ডের জন্য B1 ([DELF B1 কোর্স](/courses/delf-b1)), অথবা নাগরিকত্বের জন্য B2 ([DELF B2 কোর্স](/courses/delf-b2))।',
          'আপনার আবেদনের জন্য কোন সার্টিফিকেট গ্রহণযোগ্য, তা préfecture বা service-public.fr থেকে নিশ্চিত হোন।',
          'আগেভাগে পরীক্ষার রেজিস্ট্রেশন করুন, আর সেশনের তারিখ ও ফি সরাসরি টেস্ট সেন্টার থেকে জেনে নিন।',
          'ডিপ্লোমা বা রেজাল্টের সত্যায়িত কপি সংরক্ষণ করুন এবং কোনো মেয়াদ থাকলে তা লিখে রাখুন।',
        ],
      },
      {
        type: 'p',
        text: 'শুধু স্পিকিং নয়, চারটি স্কিলই চর্চা করুন। ফরাসিতে স্বচ্ছন্দে গল্প করতে পারেন এমন অনেকেই রিডিং বা রাইটিংয়ে নম্বর হারান, অথচ অফিশিয়াল সার্টিফিকেটে চারটি স্কিলই লাগে।',
      },
      {
        type: 'cta',
        title: 'পরিকল্পনার আগে নিজের লেভেল জানুন',
        text: 'আমাদের ফ্রি ফরাসি লেভেল টেস্ট দিন, তারপর আপনার পরবর্তী আবেদনে যে লেভেল লাগবে, সেই অনুযায়ী DELF কোর্স বেছে নিন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/courses/delf-b1',
        secondaryLabel: 'DELF B1 কোর্স দেখুন',
      },
    ],
  },
  faq: [
    {
      q: {
        en: 'Does passing DELF A2 guarantee a multi-year residence permit?',
        bn: 'DELF A2 পাস করলেই কি মাল্টি-ইয়ার রেসিডেন্স পারমিট নিশ্চিত?',
      },
      a: {
        en: 'No. The language level is one condition among several, and the préfecture assesses your whole application. A certificate at the right level helps you meet the language condition only. Check the full list of requirements on service-public.fr.',
        bn: 'না। ভাষার লেভেল অনেকগুলো শর্তের একটি মাত্র, আর préfecture আপনার পুরো আবেদন মূল্যায়ন করে। সঠিক লেভেলের সার্টিফিকেট শুধু ভাষার শর্ত পূরণে সাহায্য করে। সব শর্তের পূর্ণ তালিকা service-public.fr-এ দেখে নিন।',
      },
    },
    {
      q: { en: 'Is DELF the only accepted proof of French level?', bn: 'ফরাসি লেভেলের প্রমাণ হিসেবে কি শুধু DELF গ্রহণযোগ্য?' },
      a: {
        en: 'Not necessarily. Official information refers to recognised certificates and diplomas, which typically include DELF/DALF and recognised versions of the TCF or TEF, and possibly some French diplomas. Confirm the accepted list and any validity period for your application before booking.',
        bn: 'সবসময় নয়। অফিশিয়াল তথ্যে স্বীকৃত সার্টিফিকেট ও ডিপ্লোমার কথা বলা হয়েছে, যার মধ্যে সাধারণত DELF/DALF, TCF বা TEF-এর স্বীকৃত সংস্করণ এবং সম্ভবত ফ্রান্সের কিছু ডিপ্লোমা পড়ে। বুক করার আগে আপনার আবেদনের জন্য গ্রহণযোগ্য তালিকা ও মেয়াদ নিশ্চিত হয়ে নিন।',
      },
    },
    {
      q: {
        en: 'I applied or received my card before 2026. Does the new level apply to me?',
        bn: '২০২৬-এর আগে আবেদন করেছি বা কার্ড পেয়েছি। নতুন লেভেল কি আমার ক্ষেত্রেও প্রযোজ্য?',
      },
      a: {
        en: 'The new levels apply from 1 January 2026, but how they affect renewals, pending files or changes of status depends on your situation. Only your préfecture or a qualified lawyer can answer this for your case.',
        bn: 'নতুন লেভেল ১ জানুয়ারি ২০২৬ থেকে কার্যকর, তবে নবায়ন, চলমান ফাইল বা স্ট্যাটাস পরিবর্তনে এর প্রভাব আপনার পরিস্থিতির ওপর নির্ভর করে। আপনার কেসের জন্য এর উত্তর কেবল préfecture বা একজন যোগ্য আইনজীবীই দিতে পারবেন।',
      },
    },
    {
      q: { en: 'Can I prepare for DELF from Bangladesh?', bn: 'বাংলাদেশ থেকে কি DELF-এর প্রস্তুতি নেওয়া যায়?' },
      a: {
        en: 'Yes. You can study online from anywhere, and DELF exams are organised in Bangladesh by Alliance Française. Check their official site for session dates and fees, which can change.',
        bn: 'হ্যাঁ। যেকোনো জায়গা থেকে অনলাইনে পড়তে পারেন, আর বাংলাদেশে DELF পরীক্ষা আয়োজন করে Alliance Française। সেশনের তারিখ ও ফি বদলাতে পারে, তাই তাদের অফিশিয়াল সাইটে দেখে নিন।',
      },
    },
  ],
};
const post07: BlogPost = {
  slug: 'study-in-france-from-bangladesh-french',
  date: '2026-10-13T10:00:00+06:00',
  readMinutes: 5,
  category: BLOG_CATEGORIES.france,
  tags: ['study in france', 'campus france', 'english-taught programmes', 'delf b2', 'student life'],
  cover: { theme: 'france', icon: 'graduation-cap', label: { en: 'Study in France', bn: 'ফ্রান্সে পড়াশোনা' } },
  title: {
    en: 'Studying in France from Bangladesh: Why French Matters Even for English-Taught Programmes',
    bn: 'বাংলাদেশ থেকে ফ্রান্সে পড়াশোনা: ইংরেজি মাধ্যমের প্রোগ্রামেও কেন ফ্রেঞ্চ জরুরি',
  },
  metaTitle: {
    en: 'Study in France from Bangladesh: Why French Matters',
    bn: 'বাংলাদেশ থেকে ফ্রান্সে পড়াশোনা: ফ্রেঞ্চ কেন জরুরি',
  },
  metaDescription: {
    en: 'Going to France for an English-taught degree? Why French still matters for daily life, jobs and your career, and what level to reach before you fly.',
    bn: 'ইংরেজি মাধ্যমে ফ্রান্সে পড়তে যাচ্ছেন? দৈনন্দিন জীবন, পার্ট-টাইম কাজ ও ক্যারিয়ারে ফ্রেঞ্চ কেন লাগে এবং যাওয়ার আগে কোন লেভেলে পৌঁছানো উচিত, জেনে নিন।',
  },
  excerpt: {
    en: 'An English-taught programme can get you into a French university, but French is what helps you rent a room, find part-time work and build a career there. Here is what level to aim for and how to plan it.',
    bn: 'ইংরেজি মাধ্যমের প্রোগ্রাম দিয়ে ফ্রান্সের বিশ্ববিদ্যালয়ে ভর্তি হওয়া যায়, কিন্তু বাসা ভাড়া, পার্ট-টাইম কাজ আর ক্যারিয়ার গড়তে কাজে আসে ফ্রেঞ্চ। কোন লেভেল লক্ষ্য রাখবেন এবং কীভাবে পরিকল্পনা করবেন, তা এখানে।',
  },
  coverAlt: {
    en: 'Illustrated cover: a graduation cap beside a French tricolour stripe with the words Study in France',
    bn: 'ইলাস্ট্রেটেড কভার: ফরাসি ত্রিবর্ণ রেখার পাশে গ্র্যাজুয়েশন ক্যাপ এবং লেখা “ফ্রান্সে পড়াশোনা”',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'More Bangladeshi students are looking at France for a master’s or a bachelor’s degree, and many of them choose programmes taught entirely in English. That is a perfectly good route. Still, one question comes up again and again: if the classes are in English, do you really need French? The short answer is that you can study without it, but living, working and building a future in France is much harder without it. This guide explains why, and how much French is realistic to learn before you leave.',
      },
      { type: 'h2', text: 'English in the classroom, French everywhere else' },
      {
        type: 'p',
        text: 'English-taught programmes are common at French business schools, engineering schools and some universities, especially at master’s level. Inside the lecture hall, you may hear very little French. The moment you step outside, the situation changes. Shop staff, landlords, bank advisers, doctors’ receptionists and most of your neighbours will speak to you in French first. In big cities you can often switch to English, but you cannot count on it, and in smaller towns it is far less common.',
      },
      {
        type: 'p',
        text: 'Even basic A2-level French changes how your first months feel. You can ask for directions, understand a train announcement, explain a problem at the pharmacy and make small talk with classmates who are French. That confidence matters when you are far from home.',
      },
      { type: 'h2', text: 'Paperwork and daily life run in French' },
      { type: 'h3', text: 'Housing, banks and administration' },
      {
        type: 'p',
        text: 'Rental contracts, housing applications, bank account forms, insurance documents and messages from the administration are usually written in French. Many official websites have limited English versions. You will also deal with your student residence status, which may involve online procedures and, at some point, appointments with the authorities. Understanding what a form is asking, and being able to write a short, polite email in French, saves time and prevents expensive mistakes.',
      },
      { type: 'h3', text: 'Health, transport and everyday conversations' },
      {
        type: 'ul',
        items: [
          'Describing symptoms to a doctor or pharmacist in simple French.',
          'Reading notices about strikes, delays or changed timetables on public transport.',
          'Handling phone calls with a landlord or a delivery service.',
          'Joining student associations, sports clubs and social events, where French is the default language.',
        ],
      },
      { type: 'h2', text: 'Part-time work, internships and your career' },
      {
        type: 'p',
        text: 'Many international students hope to work part-time during their studies, within the hours their status allows. Most student jobs, such as in cafés, shops, delivery, tutoring or campus services, involve speaking with French customers or colleagues. Employers will often expect at least conversational French, and stronger French widens the range of jobs you can apply for.',
      },
      {
        type: 'p',
        text: 'Internships (stages) are often a required part of French master’s programmes. Some multinational companies work in English, but a large share of internship offers, interviews and daily team communication happen in French. The same is true if you hope to stay and work in France after graduation: a CV that shows a solid French level, ideally backed by a certificate, gives employers one less reason to hesitate. No language level guarantees a job or a permit, but weak French clearly narrows your options.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Thinking long term?',
        text: 'France now ties some residence permits and naturalisation to an official French level. If you might settle in France one day, read our guide to the [2026 language requirements](/blog/france-language-requirement-2026-residence-citizenship) and always verify the rules on official French government sources.',
      },
      { type: 'h2', text: 'If you choose a French-taught programme' },
      { type: 'h3', text: 'What level universities usually ask for' },
      {
        type: 'p',
        text: 'Programmes taught in French are usually more numerous and often more affordable than English-taught options. They typically require at least B2 in French, and some demanding courses ask for C1. Universities generally accept proof such as a DELF or DALF diploma or a TCF result. Requirements differ by institution and programme, so check each one carefully before you plan your exam.',
      },
      { type: 'h3', text: 'The DAP procedure for first-year Licence' },
      {
        type: 'p',
        text: 'If you want to enter the first year of a French bachelor’s degree (Licence 1), there is usually a specific application route called the DAP (demande d’admission préalable). Applicants in this route are generally asked for a TCF DAP result or an equivalent diploma. Deadlines for this procedure tend to come early, so if this is your plan, start your French preparation well ahead and confirm the current calendar with Campus France.',
      },
      { type: 'h2', text: 'How the Campus France Bangladesh process fits in' },
      {
        type: 'p',
        text: 'Students applying from Bangladesh usually go through the “Études en France” online procedure managed by Campus France Bangladesh. In general terms, you create a file, list your chosen programmes, upload documents and attend an interview before your visa application. Your French level, even for an English-taught programme, is something you can show as evidence of motivation and preparation. The exact steps, documents and dates change, so follow the official Campus France Bangladesh guidance rather than second-hand advice.',
      },
      { type: 'h2', text: 'What level should you reach before you fly?' },
      {
        type: 'ul',
        items: [
          '**English-taught programme:** aim for A2 at minimum, so you can manage daily life. B1 makes part-time work and social life much easier. Our [DELF A2 course](/courses/delf-a2) is a sensible target if you have a few months.',
          '**French-taught programme:** you will usually need B2, sometimes C1, with an official result. Plan for the [DELF B2 course](/courses/delf-b2) or equivalent exam preparation.',
          '**Planning to stay after your degree:** keep studying during your programme and work towards B2. It is the level many employers treat as professionally comfortable.',
        ],
      },
      {
        type: 'p',
        text: 'Not sure where you stand? A quick [free level test](/quiz/placement-test) shows your current level and helps you set a realistic goal.',
      },
      { type: 'h2', text: 'A sample 12-month timeline' },
      {
        type: 'p',
        text: 'Every learner moves at a different pace, but this example shows how a complete beginner might plan for an English-taught master’s starting in September:',
      },
      {
        type: 'ol',
        items: [
          'Months 1–3: start from zero, build A1 foundations (pronunciation, everyday phrases, basic grammar).',
          'Months 4–6: move to A2; practise listening and short conversations every week while preparing your Campus France file.',
          'Months 7–9: consolidate A2, take a DELF A2 exam if a session fits, and keep practising speaking.',
          'Months 10–12: start B1 topics focused on real situations: housing, banking, health and job interviews.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Start earlier than you think',
        text: 'Language learning competes with IELTS preparation, document collection and university applications. Starting French a year before departure, even at a few hours a week, is far less stressful than cramming in the last two months. For a full step-by-step plan, see our [roadmap from A0 to B2](/blog/learn-french-in-bangladesh-roadmap).',
      },
      {
        type: 'cta',
        title: 'Prepare your French before you leave',
        text: 'Find your current level in a few minutes, then choose a live course that fits your departure date.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/courses/delf-a2',
        secondaryLabel: 'See the DELF A2 course',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'বাংলাদেশ থেকে অনেক শিক্ষার্থী এখন ব্যাচেলর বা মাস্টার্সের জন্য ফ্রান্সের কথা ভাবছেন, আর তাঁদের অনেকেই পুরোপুরি ইংরেজি মাধ্যমের প্রোগ্রাম বেছে নিচ্ছেন। পথটা ভালো, সন্দেহ নেই। কিন্তু একটা প্রশ্ন বারবার আসে: ক্লাস যদি ইংরেজিতেই হয়, তাহলে কি সত্যিই ফ্রেঞ্চ শেখা দরকার? সংক্ষেপে উত্তর হলো, ফ্রেঞ্চ ছাড়াও পড়াশোনা করা যায়, কিন্তু ফ্রান্সে থাকা, কাজ করা আর ভবিষ্যৎ গড়া ফ্রেঞ্চ ছাড়া অনেক কঠিন। কেন, এবং যাওয়ার আগে কতটা ফ্রেঞ্চ শেখা বাস্তবসম্মত, এই লেখায় সেটাই বলছি।',
      },
      { type: 'h2', text: 'ক্লাসে ইংরেজি, বাকি সব জায়গায় ফ্রেঞ্চ' },
      {
        type: 'p',
        text: 'ফ্রান্সের বিজনেস স্কুল, ইঞ্জিনিয়ারিং স্কুল ও কিছু বিশ্ববিদ্যালয়ে, বিশেষ করে মাস্টার্স পর্যায়ে, ইংরেজি মাধ্যমের প্রোগ্রাম বেশ প্রচলিত। লেকচার হলের ভেতরে হয়তো ফ্রেঞ্চ খুব কমই শুনবেন। কিন্তু বাইরে পা রাখলেই চিত্র বদলে যায়। দোকানের কর্মী, বাড়িওয়ালা, ব্যাংকের অ্যাডভাইজার, ডাক্তারের রিসেপশন, এমনকি প্রতিবেশীরাও প্রথমে ফ্রেঞ্চেই কথা বলবেন। বড় শহরে অনেক সময় ইংরেজিতে কাজ চালানো যায়, তবে তার ওপর ভরসা করা যায় না, আর ছোট শহরে তো সেটা আরও কম।',
      },
      {
        type: 'p',
        text: 'মোটামুটি A2 লেভেলের ফ্রেঞ্চ জানলেও প্রথম কয়েক মাসের অভিজ্ঞতা অনেক সহজ হয়ে যায়। রাস্তা জিজ্ঞেস করা, ট্রেনের ঘোষণা বোঝা, ফার্মেসিতে সমস্যা বুঝিয়ে বলা কিংবা ফরাসি সহপাঠীর সঙ্গে দুটো কথা বলা, সবই তখন সম্ভব। দেশ থেকে দূরে থাকার সময় এই আত্মবিশ্বাসটুকু অনেক কাজে দেয়।',
      },
      { type: 'h2', text: 'কাগজপত্র আর দৈনন্দিন জীবন চলে ফ্রেঞ্চে' },
      { type: 'h3', text: 'বাসা, ব্যাংক ও প্রশাসনিক কাজ' },
      {
        type: 'p',
        text: 'বাসা ভাড়ার চুক্তি, হাউজিং আবেদন, ব্যাংক অ্যাকাউন্টের ফর্ম, ইনস্যুরেন্সের কাগজ, প্রশাসনের চিঠি, এসব সাধারণত ফ্রেঞ্চে লেখা থাকে। অনেক সরকারি ওয়েবসাইটের ইংরেজি সংস্করণ সীমিত। আপনার স্টুডেন্ট রেসিডেন্স স্ট্যাটাস সংক্রান্ত কাজেও অনলাইন প্রক্রিয়া এবং কখনো কখনো কর্তৃপক্ষের সঙ্গে অ্যাপয়েন্টমেন্ট লাগতে পারে। ফর্মে কী চাওয়া হচ্ছে তা বুঝতে পারা আর ফ্রেঞ্চে ছোট একটা ভদ্র ইমেইল লিখতে পারা, এই দুটো দক্ষতা অনেক সময় বাঁচায় এবং ব্যয়বহুল ভুল থেকে রক্ষা করে।',
      },
      { type: 'h3', text: 'স্বাস্থ্য, যাতায়াত ও প্রতিদিনের কথাবার্তা' },
      {
        type: 'ul',
        items: [
          'ডাক্তার বা ফার্মাসিস্টকে সহজ ফ্রেঞ্চে উপসর্গ বুঝিয়ে বলা।',
          'পাবলিক ট্রান্সপোর্টে ধর্মঘট, দেরি বা সময়সূচি বদলের নোটিশ পড়ে বোঝা।',
          'বাড়িওয়ালা বা ডেলিভারি সার্ভিসের ফোনকল সামলানো।',
          'স্টুডেন্ট অ্যাসোসিয়েশন, স্পোর্টস ক্লাব ও সামাজিক অনুষ্ঠানে যোগ দেওয়া, যেখানে স্বাভাবিকভাবেই ফ্রেঞ্চে কথা হয়।',
        ],
      },
      { type: 'h2', text: 'পার্ট-টাইম কাজ, ইন্টার্নশিপ ও ক্যারিয়ার' },
      {
        type: 'p',
        text: 'অনেক আন্তর্জাতিক শিক্ষার্থী পড়াশোনার পাশাপাশি নিজের স্ট্যাটাসে অনুমোদিত সময়ের মধ্যে পার্ট-টাইম কাজ করতে চান। ক্যাফে, দোকান, ডেলিভারি, টিউশন বা ক্যাম্পাসের কাজ, প্রায় সব স্টুডেন্ট জবেই ফরাসি গ্রাহক বা সহকর্মীর সঙ্গে কথা বলতে হয়। নিয়োগকর্তারা সাধারণত অন্তত কথোপকথন চালানোর মতো ফ্রেঞ্চ আশা করেন, আর ফ্রেঞ্চ যত ভালো, আবেদনের সুযোগ তত বেশি।',
      },
      {
        type: 'p',
        text: 'ফ্রান্সের অনেক মাস্টার্স প্রোগ্রামে ইন্টার্নশিপ (stage) বাধ্যতামূলক অংশ। কিছু বহুজাতিক প্রতিষ্ঠান ইংরেজিতে কাজ করে ঠিকই, কিন্তু ইন্টার্নশিপের বড় একটা অংশের বিজ্ঞাপন, ইন্টারভিউ আর দলের দৈনন্দিন যোগাযোগ হয় ফ্রেঞ্চে। পড়া শেষে ফ্রান্সে থেকে কাজ করতে চাইলেও একই কথা: সিভিতে ভালো ফ্রেঞ্চ লেভেল, সম্ভব হলে সার্টিফিকেটসহ, থাকলে নিয়োগকর্তার দ্বিধা একটু কমে। কোনো ভাষার লেভেলই চাকরি বা পারমিটের নিশ্চয়তা দেয় না, তবে দুর্বল ফ্রেঞ্চ যে সুযোগ সংকুচিত করে, তা স্পষ্ট।',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'দীর্ঘমেয়াদি পরিকল্পনা আছে?',
        text: 'ফ্রান্সে এখন কিছু রেসিডেন্স পারমিট ও নাগরিকত্বের সঙ্গে নির্দিষ্ট ফ্রেঞ্চ লেভেলের শর্ত যুক্ত। ভবিষ্যতে ফ্রান্সে স্থায়ী হওয়ার চিন্তা থাকলে আমাদের [২০২৬ সালের ভাষা-শর্ত বিষয়ক গাইড](/blog/france-language-requirement-2026-residence-citizenship) পড়ুন, এবং নিয়মগুলো অবশ্যই ফরাসি সরকারের অফিশিয়াল সূত্রে যাচাই করুন।',
      },
      { type: 'h2', text: 'যদি ফ্রেঞ্চ মাধ্যমের প্রোগ্রাম বেছে নেন' },
      { type: 'h3', text: 'বিশ্ববিদ্যালয়গুলো সাধারণত কোন লেভেল চায়' },
      {
        type: 'p',
        text: 'ফ্রেঞ্চ মাধ্যমের প্রোগ্রামের সংখ্যা সাধারণত বেশি, এবং অনেক ক্ষেত্রে খরচও ইংরেজি মাধ্যমের চেয়ে কম। এসব প্রোগ্রামে সাধারণত অন্তত B2 লেভেলের ফ্রেঞ্চ লাগে, কিছু কঠিন কোর্সে C1 চাওয়া হয়। প্রমাণ হিসেবে সাধারণত DELF বা DALF ডিপ্লোমা কিংবা TCF-এর ফল গ্রহণ করা হয়। তবে শর্ত প্রতিষ্ঠান ও প্রোগ্রামভেদে আলাদা, তাই পরীক্ষার পরিকল্পনা করার আগে প্রতিটি প্রোগ্রামের শর্ত ভালো করে দেখে নিন।',
      },
      { type: 'h3', text: 'Licence প্রথম বর্ষের জন্য DAP প্রক্রিয়া' },
      {
        type: 'p',
        text: 'ফরাসি ব্যাচেলর ডিগ্রির প্রথম বর্ষে (Licence 1) ভর্তি হতে চাইলে সাধারণত DAP (demande d’admission préalable) নামে একটি আলাদা আবেদন প্রক্রিয়া থাকে। এই পথে আবেদনকারীদের কাছে সাধারণত TCF DAP-এর ফল বা সমমানের ডিপ্লোমা চাওয়া হয়। এই প্রক্রিয়ার ডেডলাইন বেশ আগেভাগে পড়ে, তাই এটাই যদি আপনার পরিকল্পনা হয়, অনেক আগে থেকে ফ্রেঞ্চ প্রস্তুতি শুরু করুন এবং হালনাগাদ সময়সূচি Campus France থেকে নিশ্চিত হয়ে নিন।',
      },
      { type: 'h2', text: 'Campus France Bangladesh প্রক্রিয়ায় ফ্রেঞ্চের ভূমিকা' },
      {
        type: 'p',
        text: 'বাংলাদেশ থেকে আবেদনকারীরা সাধারণত Campus France Bangladesh পরিচালিত “Études en France” অনলাইন প্রক্রিয়ার মধ্য দিয়ে যান। মোটা দাগে, আপনি একটি ফাইল তৈরি করেন, পছন্দের প্রোগ্রামগুলো যুক্ত করেন, কাগজপত্র আপলোড করেন এবং ভিসা আবেদনের আগে একটি ইন্টারভিউ দেন। ইংরেজি মাধ্যমের প্রোগ্রামে আবেদন করলেও আপনার ফ্রেঞ্চ শেখার প্রমাণ আগ্রহ ও প্রস্তুতির নিদর্শন হিসেবে দেখাতে পারেন। ধাপ, কাগজপত্র ও তারিখ সময়ের সঙ্গে বদলায়, তাই শোনা কথার বদলে Campus France Bangladesh-এর অফিশিয়াল নির্দেশনা অনুসরণ করুন।',
      },
      { type: 'h2', text: 'যাওয়ার আগে কোন লেভেলে পৌঁছানো উচিত?' },
      {
        type: 'ul',
        items: [
          '**ইংরেজি মাধ্যমের প্রোগ্রাম:** দৈনন্দিন জীবন সামলাতে অন্তত A2 লক্ষ্য রাখুন। B1 হলে পার্ট-টাইম কাজ আর সামাজিক জীবন অনেক সহজ হয়। হাতে কয়েক মাস থাকলে আমাদের [DELF A2 কোর্স](/courses/delf-a2) একটি বাস্তবসম্মত লক্ষ্য।',
          '**ফ্রেঞ্চ মাধ্যমের প্রোগ্রাম:** সাধারণত অফিশিয়াল ফলসহ B2, কখনো C1 লাগবে। এর জন্য [DELF B2 কোর্স](/courses/delf-b2) বা সমমানের পরীক্ষা-প্রস্তুতির পরিকল্পনা করুন।',
          '**ডিগ্রির পর থেকে যাওয়ার পরিকল্পনা:** প্রোগ্রাম চলাকালীনও শেখা চালিয়ে যান এবং B2-এর দিকে এগোন। অনেক নিয়োগকর্তা এই লেভেলকে পেশাগত কাজের জন্য স্বস্তিদায়ক মনে করেন।',
        ],
      },
      {
        type: 'p',
        text: 'আপনার বর্তমান লেভেল নিয়ে নিশ্চিত নন? কয়েক মিনিটের একটি [ফ্রি লেভেল টেস্ট](/quiz/placement-test) দিলেই বর্তমান অবস্থান বুঝতে পারবেন এবং বাস্তবসম্মত লক্ষ্য ঠিক করতে পারবেন।',
      },
      { type: 'h2', text: '১২ মাসের একটি নমুনা সময়রেখা' },
      {
        type: 'p',
        text: 'প্রত্যেকের শেখার গতি আলাদা, তবে সেপ্টেম্বরে শুরু হওয়া ইংরেজি মাধ্যমের মাস্টার্সের জন্য একজন একেবারে নতুন শিক্ষার্থী এভাবে পরিকল্পনা করতে পারেন:',
      },
      {
        type: 'ol',
        items: [
          '১–৩ মাস: শূন্য থেকে শুরু করে A1-এর ভিত্তি তৈরি করুন (উচ্চারণ, প্রতিদিনের বাক্য, মৌলিক গ্রামার)।',
          '৪–৬ মাস: A2-তে উঠুন; Campus France ফাইল প্রস্তুতের পাশাপাশি প্রতি সপ্তাহে লিসেনিং ও ছোট কথোপকথন চর্চা করুন।',
          '৭–৯ মাস: A2 পোক্ত করুন, সুবিধাজনক সেশন পেলে DELF A2 পরীক্ষা দিন এবং স্পিকিং চর্চা চালিয়ে যান।',
          '১০–১২ মাস: বাস্তব পরিস্থিতিভিত্তিক B1 বিষয় শুরু করুন: বাসা খোঁজা, ব্যাংকিং, স্বাস্থ্যসেবা ও চাকরির ইন্টারভিউ।',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'যতটা ভাবছেন, তার চেয়ে আগে শুরু করুন',
        text: 'IELTS প্রস্তুতি, কাগজপত্র জোগাড় আর বিশ্ববিদ্যালয়ে আবেদনের ভিড়ে ভাষা শেখা পিছিয়ে পড়ে। যাওয়ার এক বছর আগে, সপ্তাহে কয়েক ঘণ্টা করে হলেও ফ্রেঞ্চ শুরু করা শেষ দুই মাসে তাড়াহুড়োর চেয়ে অনেক কম চাপের। ধাপে ধাপে পুরো পরিকল্পনার জন্য আমাদের [A0 থেকে B2 রোডম্যাপ](/blog/learn-french-in-bangladesh-roadmap) দেখুন।',
      },
      {
        type: 'cta',
        title: 'যাওয়ার আগেই ফ্রেঞ্চ প্রস্তুতি সেরে নিন',
        text: 'কয়েক মিনিটে আপনার বর্তমান লেভেল জেনে নিন, তারপর যাত্রার তারিখ অনুযায়ী উপযুক্ত লাইভ কোর্স বেছে নিন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/courses/delf-a2',
        secondaryLabel: 'DELF A2 কোর্স দেখুন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Can I study in France without speaking French?', bn: 'ফ্রেঞ্চ না জেনে কি ফ্রান্সে পড়াশোনা করা যায়?' },
      a: {
        en: 'Yes, many programmes are taught fully in English. However, daily life, paperwork, part-time jobs and internships are much easier with at least A2–B1 French, so most students benefit from learning before and during their studies.',
        bn: 'হ্যাঁ, অনেক প্রোগ্রাম পুরোপুরি ইংরেজিতে পড়ানো হয়। তবে দৈনন্দিন জীবন, কাগজপত্র, পার্ট-টাইম কাজ ও ইন্টার্নশিপে অন্তত A2–B1 লেভেলের ফ্রেঞ্চ থাকলে অনেক সুবিধা হয়, তাই পড়াশোনার আগে ও চলাকালীন ফ্রেঞ্চ শেখা বেশিরভাগ শিক্ষার্থীর জন্য লাভজনক।',
      },
    },
    {
      q: { en: 'What French level do French-taught programmes require?', bn: 'ফ্রেঞ্চ মাধ্যমের প্রোগ্রামে কোন লেভেল লাগে?' },
      a: {
        en: 'Typically B2, and sometimes C1 for demanding courses, proven with a DELF/DALF diploma or a TCF result. Requirements vary, so check each programme’s admission page.',
        bn: 'সাধারণত B2, আর কিছু কঠিন কোর্সে C1, যা DELF/DALF ডিপ্লোমা বা TCF-এর ফল দিয়ে প্রমাণ করতে হয়। শর্ত প্রোগ্রামভেদে আলাদা, তাই প্রতিটি প্রোগ্রামের ভর্তি-তথ্য দেখে নিন।',
      },
    },
    {
      q: { en: 'How long does it take to reach A2 from zero?', bn: 'শূন্য থেকে A2-তে পৌঁছাতে কত সময় লাগে?' },
      a: {
        en: 'It depends on your schedule and practice. Commonly cited estimates put A2 at roughly 160–200 guided hours in total, which many learners spread over six to nine months.',
        bn: 'এটা আপনার সময়সূচি ও চর্চার ওপর নির্ভর করে। প্রচলিত হিসাবে A2 পর্যন্ত মোট প্রায় ১৬০–২০০ ঘণ্টা নির্দেশিত শেখার কথা বলা হয়, যা অনেকে ছয় থেকে নয় মাসে ভাগ করে নেন।',
      },
    },
    {
      q: { en: 'Does a French certificate help my Campus France application?', bn: 'ফ্রেঞ্চ সার্টিফিকেট কি Campus France আবেদনে সাহায্য করে?' },
      a: {
        en: 'For French-taught programmes it is usually required. For English-taught programmes it is not normally mandatory, but it can show motivation and preparation. It does not guarantee admission or a visa.',
        bn: 'ফ্রেঞ্চ মাধ্যমের প্রোগ্রামে এটি সাধারণত বাধ্যতামূলক। ইংরেজি মাধ্যমের প্রোগ্রামে সাধারণত বাধ্যতামূলক নয়, তবে আগ্রহ ও প্রস্তুতির প্রমাণ হিসেবে কাজে আসতে পারে। এটি ভর্তি বা ভিসার নিশ্চয়তা দেয় না।',
      },
    },
  ],
};
const post08: BlogPost = {
  slug: 'clb-7-french-nclc-7-guide',
  date: '2026-10-17T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.canada,
  tags: ['clb 7', 'nclc 7', 'express entry', 'tef canada', 'tcf canada'],
  cover: { theme: 'canada', icon: 'target', label: { en: 'CLB 7', bn: 'CLB 7' } },
  title: {
    en: 'CLB 7 in French (NCLC 7): What It Means and How to Reach It',
    bn: 'ফরাসিতে CLB 7 (NCLC 7): এর মানে কী এবং কীভাবে পৌঁছাবেন',
  },
  metaTitle: {
    en: 'CLB 7 in French (NCLC 7): Meaning and How to Reach It',
    bn: 'ফরাসিতে CLB 7 (NCLC 7): মানে ও পৌঁছানোর উপায়',
  },
  metaDescription: {
    en: 'What NCLC 7 in French means for Express Entry, why all four skills count, how it compares to CEFR levels, and a practical plan to reach it.',
    bn: 'Express Entry-তে ফরাসি NCLC 7-এর অর্থ, কেন চারটি দক্ষতাই গুরুত্বপূর্ণ, CEFR লেভেলের সঙ্গে তুলনা এবং সেখানে পৌঁছানোর বাস্তবসম্মত পরিকল্পনা।',
  },
  excerpt: {
    en: 'NCLC 7 is the French level that matters most for many Express Entry candidates. Here is what it actually means, why every skill has to get there, and how to plan your preparation.',
    bn: 'অনেক Express Entry প্রার্থীর জন্য সবচেয়ে গুরুত্বপূর্ণ ফরাসি লেভেল হলো NCLC 7। এর আসল মানে কী, কেন প্রতিটি দক্ষতাকে সেখানে পৌঁছাতে হয় এবং কীভাবে প্রস্তুতি পরিকল্পনা করবেন, তা এখানে।',
  },
  coverAlt: {
    en: 'Illustrated cover: a maple leaf and a target icon with the words CLB 7',
    bn: 'ইলাস্ট্রেটেড কভার: ম্যাপল পাতা ও একটি লক্ষ্যভেদী চিহ্ন, লেখা CLB 7',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'If you have read anything about French and Canadian immigration, you have probably seen “CLB 7” or “NCLC 7” mentioned again and again. It is often described as the level that changes an Express Entry profile. That is broadly true, but the details matter: which test, which skills, and what the number actually says about your French. This guide explains the level in plain terms and then lays out how to plan your way there.',
      },
      { type: 'h2', text: 'CLB and NCLC: two names, one scale' },
      {
        type: 'p',
        text: 'Canada describes adult language ability with a 12-level framework. For English it is called the Canadian Language Benchmarks (CLB). For French it is called the Niveaux de compétence linguistique canadiens (NCLC). The two are parallel scales, so people often say “CLB 7 in French” when they mean NCLC 7. Officially, NCLC is the correct term for French, and that is what you will see on IRCC’s pages.',
      },
      {
        type: 'p',
        text: 'You do not sit an “NCLC exam”. You sit an approved test, TEF Canada or TCF Canada, and IRCC converts your score in each skill to an NCLC level using its official equivalency table. Because both tests use their own scoring scales, and TEF Canada changed its scale in December 2023, always check the current table on IRCC’s official website rather than relying on numbers shared on social media.',
      },
      { type: 'h2', text: 'Why level 7 matters' },
      {
        type: 'p',
        text: 'Level 7 is a threshold in several parts of the Express Entry system. The best known is the additional CRS points for French: under current rules, candidates with NCLC 7 or higher in all four French skills can receive extra points, and the amount is higher when they also have at least CLB 5 in English. On top of that, French counts as a second official language, which adds further points that grow at higher NCLC levels. We break down the arithmetic in our article on [how French adds CRS points](/blog/french-crs-points-express-entry).',
      },
      {
        type: 'p',
        text: 'Level 7 also appears as a minimum language requirement in some programmes, and IRCC runs category-based draws for candidates with strong French. Rules and draw patterns change, so treat this as background and confirm the details for your situation on IRCC’s website. To see how different NCLC levels could affect your own score, try our [CRS calculator](/crs-calculator).',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'All four skills, not an average',
        text: 'The French bonus is based on each skill separately. If you reach NCLC 8 in reading but NCLC 6 in writing, you do not meet an “NCLC 7 in all skills” condition. Your weakest skill decides the outcome.',
      },
      { type: 'h2', text: 'What NCLC 7 looks like in real French' },
      {
        type: 'p',
        text: 'There is no official one-to-one mapping between NCLC and the European CEFR scale (A1–C2) used by DELF. As a rough guide, many teachers place NCLC 7 somewhere around the upper B1 to B2 range. Because the boundary is fuzzy, a lot of learners aim for solid B2-level skills to give themselves a safety margin on exam day.',
      },
      {
        type: 'p',
        text: 'In practical terms, someone at this level can usually:',
      },
      {
        type: 'ul',
        items: [
          'Follow the main points of radio reports, announcements and conversations at natural speed on familiar topics.',
          'Read articles and workplace-style documents and pick out opinions, details and implied meaning.',
          'Write a structured text that gives and defends a point of view with clear connectors.',
          'Speak for a few minutes on a topic, ask relevant questions and argue a position without long pauses.',
        ],
      },
      { type: 'h2', text: 'A study plan based on your starting level' },
      {
        type: 'p',
        text: 'The right plan depends almost entirely on where you start. Before anything else, take a diagnostic such as our free [French level test](/quiz/placement-test) and be honest about the result.',
      },
      { type: 'h3', text: 'Starting from zero or A1' },
      {
        type: 'p',
        text: 'Your first goal is not the exam; it is general French. Work through A1, A2 and B1 with a structured course, building grammar, core vocabulary and daily listening. Commonly cited estimates suggest several hundred guided hours to move from beginner to B2, and the real figure varies widely by person and by how much you practise outside class. Plan in terms of months and years, not weeks.',
      },
      { type: 'h3', text: 'Starting from A2 or B1' },
      {
        type: 'p',
        text: 'You have a foundation, but test tasks will still feel demanding. Strengthen B1 grammar (past tenses, the subjunctive in common phrases, relative pronouns), expand topic vocabulary such as work, health, housing and the environment, and start short timed exercises in each skill.',
      },
      { type: 'h3', text: 'Starting from a solid B1 or B2' },
      {
        type: 'p',
        text: 'Now exam-specific work pays off. Choose your test (our [TEF Canada vs TCF Canada comparison](/blog/tef-canada-vs-tcf-canada) can help), study the official handbook, and practise with the real task types under real timing for roughly two to three months before your test date.',
      },
      { type: 'h2', text: 'Skill-by-skill tactics' },
      {
        type: 'ul',
        items: [
          '**Listening:** listen daily to French radio and news at natural speed. Practise with question sets where you must decide quickly and move on; dwelling on one item costs you the next.',
          '**Reading:** train speed as well as accuracy. Read the questions first, then scan for evidence. Watch for distractors that repeat words from the text but change the meaning.',
          '**Writing:** learn a reliable structure for opinion texts: introduction, two or three argued points with examples, a short conclusion. Build a personal bank of connectors and check agreement and verb endings in your final minutes.',
          '**Speaking:** record yourself, time yourself, and practise with a teacher who asks follow-up questions. Fluency and the ability to justify your view matter as much as perfect grammar.',
        ],
      },
      { type: 'h2', text: 'Mock tests and retake strategy' },
      {
        type: 'p',
        text: 'Take at least two or three full mock tests under exam conditions before the real thing. Score each skill separately and map it against the IRCC table. If one skill is consistently below 7, spend most of your remaining time there rather than polishing skills that are already safe.',
      },
      {
        type: 'p',
        text: 'If your first result falls short in one skill, do not panic. Look at the gap, rebuild that skill for a few weeks, and book again once your mock results are steadily above the target. Check the retake rules and waiting periods for your chosen test on its official site, and remember that results are generally valid for two years for IRCC purposes.',
      },
      {
        type: 'p',
        text: 'At We Learn French BD, our live online [TEF Canada](/courses/tef-canada) and [TCF Canada](/courses/tcf-canada) programmes are built around these exact tasks, with mock tests and speaking practice. No course can promise a score, but structured practice with feedback makes your progress measurable.',
      },
      {
        type: 'cta',
        title: 'Find out how far you are from NCLC 7',
        text: 'Take our free French level test to see your current level, then choose the TEF Canada or TCF Canada path that fits your timeline.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/crs-calculator',
        secondaryLabel: 'Try the CRS calculator',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'ফরাসি ভাষা আর কানাডার ইমিগ্রেশন নিয়ে কিছু পড়ে থাকলে আপনি নিশ্চয়ই বারবার “CLB 7” বা “NCLC 7” কথাটি দেখেছেন। প্রায়ই বলা হয়, এই লেভেলটাই একটি Express Entry প্রোফাইলকে বদলে দেয়। কথাটা মোটামুটি সত্যি, তবে খুঁটিনাটি গুরুত্বপূর্ণ: কোন পরীক্ষা, কোন দক্ষতা, আর সংখ্যাটি আসলে আপনার ফরাসি সম্পর্কে কী বলে। এই লেখায় সহজ ভাষায় লেভেলটি ব্যাখ্যা করা হয়েছে, তারপর সেখানে পৌঁছানোর পরিকল্পনা সাজানো হয়েছে।',
      },
      { type: 'h2', text: 'CLB ও NCLC: দুই নাম, একই স্কেল' },
      {
        type: 'p',
        text: 'কানাডা প্রাপ্তবয়স্কদের ভাষাদক্ষতা বোঝাতে ১২ লেভেলের একটি কাঠামো ব্যবহার করে। ইংরেজির জন্য একে বলা হয় Canadian Language Benchmarks (CLB), আর ফরাসির জন্য Niveaux de compétence linguistique canadiens (NCLC)। দুটো সমান্তরাল স্কেল, তাই অনেকে NCLC 7 বোঝাতে “ফরাসিতে CLB 7” বলেন। অফিশিয়ালি ফরাসির জন্য সঠিক শব্দ NCLC, এবং IRCC-র পেজে আপনি সেটাই দেখবেন।',
      },
      {
        type: 'p',
        text: '“NCLC পরীক্ষা” বলে আলাদা কিছু নেই। আপনি একটি অনুমোদিত পরীক্ষা দেন, TEF Canada বা TCF Canada, আর IRCC তাদের অফিশিয়াল সমতুল্যতা টেবিল দিয়ে প্রতিটি দক্ষতার স্কোরকে একটি NCLC লেভেলে রূপান্তর করে। দুটো পরীক্ষারই নিজস্ব স্কোরিং স্কেল আছে, আর ২০২৩ সালের ডিসেম্বরে TEF Canada তাদের স্কেল বদলেছে। তাই সোশ্যাল মিডিয়ায় ঘোরা সংখ্যার ওপর ভরসা না করে সবসময় IRCC-র অফিশিয়াল ওয়েবসাইটে সর্বশেষ টেবিল দেখুন।',
      },
      { type: 'h2', text: 'লেভেল ৭ কেন গুরুত্বপূর্ণ' },
      {
        type: 'p',
        text: 'Express Entry ব্যবস্থার বেশ কয়েকটি জায়গায় লেভেল ৭ একটি সীমারেখা। সবচেয়ে পরিচিত হলো ফরাসির জন্য অতিরিক্ত CRS পয়েন্ট: বর্তমান নিয়মে চারটি ফরাসি দক্ষতাতেই NCLC 7 বা তার বেশি থাকলে অতিরিক্ত পয়েন্ট পাওয়া যায়, আর ইংরেজিতে অন্তত CLB 5 থাকলে সেই পয়েন্টের পরিমাণ বেশি হয়। এর ওপর ফরাসি দ্বিতীয় অফিশিয়াল ভাষা হিসেবেও গণ্য হয়, যা আরও পয়েন্ট যোগ করে এবং NCLC লেভেল বাড়লে সেটিও বাড়ে। পুরো হিসাবটি আমরা ভেঙে দেখিয়েছি [ফরাসি কীভাবে CRS পয়েন্ট বাড়ায়](/blog/french-crs-points-express-entry) লেখায়।',
      },
      {
        type: 'p',
        text: 'কিছু প্রোগ্রামে ন্যূনতম ভাষা-শর্ত হিসেবেও লেভেল ৭ আসে, আর ভালো ফরাসি জানা প্রার্থীদের জন্য IRCC ক্যাটাগরিভিত্তিক ড্র-ও করে। নিয়ম ও ড্রয়ের ধরন বদলায়, তাই এটিকে পটভূমি হিসেবে নিন এবং আপনার ক্ষেত্রে খুঁটিনাটি IRCC-র ওয়েবসাইটে নিশ্চিত করুন। বিভিন্ন NCLC লেভেলে আপনার নিজের স্কোর কেমন হতে পারে, দেখতে আমাদের [CRS ক্যালকুলেটর](/crs-calculator) ব্যবহার করুন।',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'চারটি দক্ষতাই, গড় নয়',
        text: 'ফরাসি বোনাস প্রতিটি দক্ষতার ওপর আলাদাভাবে নির্ভর করে। রিডিংয়ে NCLC 8 আর রাইটিংয়ে NCLC 6 পেলে “সব দক্ষতায় NCLC 7” শর্ত পূরণ হয় না। আপনার সবচেয়ে দুর্বল দক্ষতাই ফল নির্ধারণ করে।',
      },
      { type: 'h2', text: 'বাস্তবে NCLC 7-এর ফরাসি কেমন' },
      {
        type: 'p',
        text: 'NCLC আর DELF-এ ব্যবহৃত ইউরোপীয় CEFR স্কেলের (A1–C2) মধ্যে কোনো অফিশিয়াল এক-এক মিল নেই। মোটামুটি ধারণা হিসেবে অনেক শিক্ষক NCLC 7-কে B1-এর উপরের দিক থেকে B2-এর মধ্যে কোথাও রাখেন। সীমারেখাটা অস্পষ্ট বলে অনেক শিক্ষার্থী পরীক্ষার দিনে নিরাপদ ব্যবধান রাখতে শক্ত B2 মানের দক্ষতা লক্ষ্য করেন।',
      },
      {
        type: 'p',
        text: 'ব্যবহারিক দিক থেকে এই লেভেলের একজন সাধারণত পারেন:',
      },
      {
        type: 'ul',
        items: [
          'পরিচিত বিষয়ে স্বাভাবিক গতির রেডিও রিপোর্ট, ঘোষণা ও কথোপকথনের মূল কথাগুলো অনুসরণ করতে।',
          'প্রবন্ধ ও কর্মক্ষেত্রধর্মী ডকুমেন্ট পড়ে মতামত, খুঁটিনাটি ও অন্তর্নিহিত অর্থ বুঝতে।',
          'স্পষ্ট সংযোজক শব্দ ব্যবহার করে একটি গোছানো লেখায় মত দিতে এবং তার পক্ষে যুক্তি দেখাতে।',
          'কোনো বিষয়ে কয়েক মিনিট কথা বলতে, প্রাসঙ্গিক প্রশ্ন করতে এবং দীর্ঘ বিরতি ছাড়াই নিজের অবস্থানের পক্ষে যুক্তি দিতে।',
        ],
      },
      { type: 'h2', text: 'শুরুর লেভেল অনুযায়ী পড়াশোনার পরিকল্পনা' },
      {
        type: 'p',
        text: 'সঠিক পরিকল্পনা প্রায় পুরোপুরি নির্ভর করে আপনি কোথা থেকে শুরু করছেন তার ওপর। সবকিছুর আগে আমাদের ফ্রি [ফ্রেঞ্চ লেভেল টেস্টের](/quiz/placement-test) মতো একটি মূল্যায়ন দিন এবং ফলাফলটি সৎভাবে মেনে নিন।',
      },
      { type: 'h3', text: 'শূন্য বা A1 থেকে শুরু' },
      {
        type: 'p',
        text: 'আপনার প্রথম লক্ষ্য পরীক্ষা নয়, সাধারণ ফরাসি। একটি গোছানো কোর্সের মাধ্যমে A1, A2 ও B1 পার করুন; গ্রামার, মূল শব্দভান্ডার আর প্রতিদিনের শোনার অভ্যাস গড়ে তুলুন। প্রচলিত হিসাব অনুযায়ী নতুন শিক্ষার্থী থেকে B2-তে যেতে কয়েকশো গাইডেড ঘণ্টা লাগে, আর বাস্তবে তা ব্যক্তিভেদে এবং ক্লাসের বাইরে কতটা অনুশীলন করছেন তার ওপর অনেক বদলায়। সপ্তাহ নয়, মাস ও বছরের হিসাবে পরিকল্পনা করুন।',
      },
      { type: 'h3', text: 'A2 বা B1 থেকে শুরু' },
      {
        type: 'p',
        text: 'আপনার ভিত্তি আছে, তবে পরীক্ষার টাস্ক এখনো কঠিন লাগবে। B1 গ্রামার মজবুত করুন (অতীত কালগুলো, প্রচলিত বাক্যাংশে subjonctif, relative pronoun), কাজ, স্বাস্থ্য, বাসস্থান ও পরিবেশের মতো বিষয়ে শব্দভান্ডার বাড়ান, এবং প্রতিটি দক্ষতায় সময় ধরে ছোট ছোট অনুশীলন শুরু করুন।',
      },
      { type: 'h3', text: 'শক্ত B1 বা B2 থেকে শুরু' },
      {
        type: 'p',
        text: 'এখন পরীক্ষাভিত্তিক প্রস্তুতি সবচেয়ে কাজে দেবে। আপনার পরীক্ষা বেছে নিন (আমাদের [TEF Canada বনাম TCF Canada তুলনা](/blog/tef-canada-vs-tcf-canada) সাহায্য করতে পারে), অফিশিয়াল হ্যান্ডবুক পড়ুন, এবং পরীক্ষার তারিখের আনুমানিক দুই থেকে তিন মাস আগে থেকে আসল সময় মেনে আসল টাস্কের ধরন অনুশীলন করুন।',
      },
      { type: 'h2', text: 'দক্ষতাভিত্তিক কৌশল' },
      {
        type: 'ul',
        items: [
          '**লিসেনিং:** প্রতিদিন স্বাভাবিক গতির ফরাসি রেডিও ও সংবাদ শুনুন। এমন প্রশ্নসেট অনুশীলন করুন যেখানে দ্রুত সিদ্ধান্ত নিয়ে এগিয়ে যেতে হয়; একটি প্রশ্নে আটকে থাকলে পরেরটি হাতছাড়া হয়।',
          '**রিডিং:** নির্ভুলতার পাশাপাশি গতিও বাড়ান। আগে প্রশ্ন পড়ুন, তারপর টেক্সটে প্রমাণ খুঁজুন। এমন ভুল বিকল্প থেকে সাবধান থাকুন, যেগুলো টেক্সটের শব্দ হুবহু রাখে কিন্তু অর্থ বদলে দেয়।',
          '**রাইটিং:** মতামতধর্মী লেখার একটি নির্ভরযোগ্য কাঠামো শিখুন: ভূমিকা, উদাহরণসহ দুই-তিনটি যুক্তি, ছোট উপসংহার। নিজের জন্য সংযোজক শব্দের একটি তালিকা তৈরি করুন এবং শেষ কয়েক মিনিটে লিঙ্গ-বচনের মিল ও ক্রিয়ার রূপ যাচাই করুন।',
          '**স্পিকিং:** নিজের কথা রেকর্ড করুন, সময় ধরুন, আর এমন শিক্ষকের সঙ্গে অনুশীলন করুন যিনি পাল্টা প্রশ্ন করেন। নিখুঁত গ্রামারের মতোই সাবলীলতা ও মতের পক্ষে যুক্তি দেওয়ার ক্ষমতা গুরুত্বপূর্ণ।',
        ],
      },
      { type: 'h2', text: 'মক টেস্ট ও পুনঃপরীক্ষার কৌশল' },
      {
        type: 'p',
        text: 'আসল পরীক্ষার আগে পরীক্ষার পরিবেশে অন্তত দুই-তিনটি পূর্ণাঙ্গ মক টেস্ট দিন। প্রতিটি দক্ষতার স্কোর আলাদা করে হিসাব করুন এবং IRCC-র টেবিলের সঙ্গে মিলিয়ে দেখুন। কোনো একটি দক্ষতা যদি বারবার ৭-এর নিচে থাকে, তাহলে যে দক্ষতাগুলো ইতিমধ্যে নিরাপদ, সেগুলো ঘষামাজা না করে বাকি সময়ের বেশিরভাগ সেই দুর্বল দক্ষতায় দিন।',
      },
      {
        type: 'p',
        text: 'প্রথম ফলাফলে কোনো একটি দক্ষতায় ঘাটতি থাকলে ঘাবড়াবেন না। ঘাটতিটা কতখানি দেখুন, কয়েক সপ্তাহ সেই দক্ষতা নতুন করে গড়ে তুলুন, আর মক টেস্টের ফল ধারাবাহিকভাবে লক্ষ্যের ওপরে থাকলে আবার বুক করুন। আপনার নির্বাচিত পরীক্ষার পুনঃপরীক্ষার নিয়ম ও অপেক্ষার সময় তাদের অফিশিয়াল সাইটে দেখে নিন, আর মনে রাখুন IRCC-র ক্ষেত্রে ফল সাধারণত দুই বছর বৈধ থাকে।',
      },
      {
        type: 'p',
        text: 'We Learn French BD-র লাইভ অনলাইন [TEF Canada](/courses/tef-canada) ও [TCF Canada](/courses/tcf-canada) প্রোগ্রাম ঠিক এই টাস্কগুলোকে ঘিরেই সাজানো, সঙ্গে আছে মক টেস্ট ও স্পিকিং অনুশীলন। কোনো কোর্সই নির্দিষ্ট স্কোরের নিশ্চয়তা দিতে পারে না, তবে ফিডব্যাকসহ গোছানো অনুশীলনে আপনার অগ্রগতি মাপা সহজ হয়।',
      },
      {
        type: 'cta',
        title: 'NCLC 7 থেকে আপনি কত দূরে, জেনে নিন',
        text: 'আমাদের ফ্রি ফ্রেঞ্চ লেভেল টেস্ট দিয়ে বর্তমান লেভেল জানুন, তারপর আপনার সময়সূচির সঙ্গে মানানসই TEF Canada বা TCF Canada পথ বেছে নিন।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/crs-calculator',
        secondaryLabel: 'CRS ক্যালকুলেটর দেখুন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Is CLB 7 the same as NCLC 7?', bn: 'CLB 7 আর NCLC 7 কি একই?' },
      a: {
        en: 'They are parallel levels on Canada’s two language scales: CLB for English and NCLC for French. When people say “CLB 7 in French”, they usually mean NCLC 7.',
        bn: 'এগুলো কানাডার দুটি ভাষা-স্কেলের সমান্তরাল লেভেল: ইংরেজির জন্য CLB আর ফরাসির জন্য NCLC। কেউ “ফরাসিতে CLB 7” বললে সাধারণত NCLC 7 বোঝান।',
      },
    },
    {
      q: { en: 'Is NCLC 7 equal to B2?', bn: 'NCLC 7 কি B2-এর সমান?' },
      a: {
        en: 'There is no official one-to-one equivalence. Many teachers place NCLC 7 around upper B1 to B2, and many learners aim for solid B2 skills to have a safety margin.',
        bn: 'অফিশিয়াল কোনো এক-এক সমতুল্যতা নেই। অনেক শিক্ষক NCLC 7-কে B1-এর উপরের দিক থেকে B2-এর মধ্যে রাখেন, আর নিরাপদ ব্যবধানের জন্য অনেক শিক্ষার্থী শক্ত B2 দক্ষতা লক্ষ্য করেন।',
      },
    },
    {
      q: { en: 'Do I need NCLC 7 in every skill?', bn: 'প্রতিটি দক্ষতাতেই কি NCLC 7 লাগবে?' },
      a: {
        en: 'For the additional French points in Express Entry, the condition is NCLC 7 or higher in all four skills. One weaker skill is enough to miss it, so check each skill separately against IRCC’s table.',
        bn: 'Express Entry-তে ফরাসির অতিরিক্ত পয়েন্টের শর্ত হলো চারটি দক্ষতাতেই NCLC 7 বা তার বেশি। একটি দুর্বল দক্ষতাই যথেষ্ট সেটি হাতছাড়া করতে, তাই প্রতিটি দক্ষতা আলাদাভাবে IRCC-র টেবিলের সঙ্গে মিলিয়ে দেখুন।',
      },
    },
    {
      q: { en: 'How long does it take to reach NCLC 7?', bn: 'NCLC 7-এ পৌঁছাতে কত সময় লাগে?' },
      a: {
        en: 'It depends on your starting level and weekly practice. From a solid B1–B2, a few months of focused exam preparation is common. From zero, expect a much longer path through A1 to B2 first.',
        bn: 'এটি নির্ভর করে আপনার শুরুর লেভেল আর সাপ্তাহিক অনুশীলনের ওপর। শক্ত B1–B2 থেকে কয়েক মাসের মনোযোগী পরীক্ষা-প্রস্তুতি প্রচলিত। শূন্য থেকে শুরু করলে আগে A1 থেকে B2 পর্যন্ত অনেক দীর্ঘ পথ পাড়ি দিতে হবে।',
      },
    },
  ],
};
const post09: BlogPost = {
  slug: 'common-french-mistakes-bangla-speakers',
  date: '2026-10-22T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.tips,
  tags: ['french pronunciation', 'french grammar', 'common mistakes', 'bangla speakers', 'beginner tips'],
  cover: { theme: 'neutral', icon: 'spell-check', label: { en: '10 Mistakes', bn: '১০টি ভুল' } },
  title: {
    en: '10 Common French Mistakes Bangla Speakers Make (and How to Fix Them)',
    bn: 'বাংলাভাষীদের ফ্রেঞ্চ শেখায় ১০টি সাধারণ ভুল (এবং সমাধান)',
  },
  metaTitle: {
    en: '10 French Mistakes Bangla Speakers Make, and Fixes',
    bn: 'বাংলাভাষীদের ১০টি সাধারণ ফ্রেঞ্চ ভুল ও সমাধান',
  },
  metaDescription: {
    en: 'From saying “jéro” for zéro to “je suis 20 ans”: the pronunciation and grammar mistakes Bangla speakers make in French, with examples and quick fixes.',
    bn: '“জেরো” বলা থেকে “je suis 20 ans” পর্যন্ত: বাংলাভাষীরা ফ্রেঞ্চ উচ্চারণ ও গ্রামারে যে ভুলগুলো বেশি করেন, উদাহরণ ও সহজ সমাধানসহ।',
  },
  excerpt: {
    en: 'Bangla speakers have real advantages in French, but a few sounds and grammar habits trip almost everyone up. Here are ten common mistakes, with wrong and right examples and a practical fix for each.',
    bn: 'ফ্রেঞ্চ শেখায় বাংলাভাষীদের কিছু সত্যিকারের সুবিধা আছে, কিন্তু কয়েকটি উচ্চারণ আর গ্রামারের অভ্যাসে প্রায় সবাই হোঁচট খান। ভুল ও সঠিক উদাহরণ এবং ব্যবহারিক সমাধানসহ এমন ১০টি সাধারণ ভুল এখানে।',
  },
  coverAlt: {
    en: 'Illustrated cover: a spell-check icon with the words 10 Mistakes',
    bn: 'ইলাস্ট্রেটেড কভার: স্পেল-চেক আইকন এবং লেখা “১০টি ভুল”',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'Bangla speakers often learn French faster than they expect. Bangla already has a formal and informal “you”, many vowel sounds, and a habit of putting pronouns before the verb, all of which help. But some French sounds simply do not exist in Bangla, and a few grammar ideas, like gender, feel completely new. The good news is that the same mistakes show up again and again, so once you know them, you can fix them deliberately. Here are ten we hear most often from beginners, with examples you can practise today.',
      },
      { type: 'h2', text: 'Pronunciation mistakes' },
      { type: 'h3', text: '1. Saying “j” instead of “z”' },
      {
        type: 'p',
        text: 'Many Bangla speakers turn the French z sound into j, because ‘জ’ is the closest familiar sound. So **zéro** becomes “jéro” and **zoo** becomes “joo”. Remember that a single s between two vowels also sounds like z: **maison** (house) is “mè-zon”, not “mè-jon”, and **les amis** links as “lé-za-mi”.',
      },
      {
        type: 'p',
        text: 'Fix: hold a long “zzz”, like a buzzing bee, with your teeth almost closed and your tongue behind your lower teeth. Then add a vowel: zzz-éro. Compare **zone** and **jaune** until you can hear and feel the difference.',
      },
      { type: 'h3', text: '2. Mixing up v and b' },
      {
        type: 'p',
        text: 'Bangla has no true v sound, so learners often say ‘ভ’ or ‘ব’ instead. That turns **vin** (wine) into something close to **bain** (bath), and **vous** into “bous”. In words like **avec**, **voiture** and **vingt**, the sound matters for being understood.',
      },
      {
        type: 'p',
        text: 'Fix: touch your upper teeth lightly to your lower lip and push air through while using your voice. It should vibrate. Practise pairs: vin / bain, vous / bout, vent / banc.',
      },
      { type: 'h3', text: '3. Confusing “u” and “ou”' },
      {
        type: 'p',
        text: 'French has two different “u” sounds. **ou** is like the Bangla ‘উ’: **tout**, **vous**, **roue**. But the letter **u** alone is a sound Bangla does not have: **tu**, **rue**, **du**. Saying both the same way changes meaning: **tu** (you) vs **tout** (all), **dessus** (on top) vs **dessous** (underneath).',
      },
      {
        type: 'p',
        text: 'Fix: say “ee” as in ‘ই’, keep your tongue exactly there, then round your lips tightly as if to whistle. That is the French u. Practise rue / roue and du / doux slowly.',
      },
      { type: 'h3', text: '4. Pronouncing the “n” in nasal vowels' },
      {
        type: 'p',
        text: 'In **vent**, **vont** and **vin**, the n is not pronounced as a separate consonant. Air goes through the nose while you say the vowel. Bangla speakers often add a clear n or an “ng” at the end, so **bon** sounds like “bonn” or “bong”. Bangla’s chandrabindu (ঁ) is actually a helpful starting point, because it already nasalises vowels.',
      },
      {
        type: 'p',
        text: 'Fix: practise the three main nasal vowels as a set: **an/en** (vent), **on** (vont), **in** (vin). Record yourself and stop before your tongue touches the roof of your mouth.',
      },
      { type: 'h3', text: '5. Reading every letter out loud' },
      {
        type: 'p',
        text: 'Bangla is mostly read as written, so it is natural to pronounce every letter. In French, many final consonants are silent: **Paris** is “pa-ri”, **petit** is “pe-ti”, **beaucoup** is “bo-koo”. The verb ending **-ent** in **ils parlent** is completely silent, so it sounds just like **il parle**.',
      },
      {
        type: 'p',
        text: 'Fix: a useful rule of thumb is that final c, r, f and l are often pronounced (think of the English word “careful”), while most other final consonants are silent. Learn the exceptions as you meet them, and always listen to new words before saying them.',
      },
      { type: 'h2', text: 'Grammar mistakes' },
      { type: 'h3', text: '6. Forgetting articles and gender' },
      {
        type: 'p',
        text: 'Bangla nouns have no grammatical gender and no words like “a” or “the”. In French, nearly every noun needs an article, and every noun is masculine or feminine. Learners say “J’ai voiture” instead of **J’ai une voiture** (I have a car), or “le table” instead of **la table**.',
      },
      {
        type: 'p',
        text: 'Fix: never learn a noun alone. Write and say it with its article every time: **le livre**, **la maison**, **un ami**, **une amie**. Colour-coding masculine and feminine words in your notes also helps your memory.',
      },
      { type: 'h3', text: '7. Not making adjectives agree' },
      {
        type: 'p',
        text: 'Because adjectives change with gender and number, “une petit maison” should be **une petite maison**, and “elles sont content” should be **elles sont contentes**. This is one of the most common errors in DELF A1 and A2 writing, and it costs easy marks.',
      },
      {
        type: 'p',
        text: 'Fix: after writing any sentence, check each adjective against its noun. Feminine usually adds -e, plural usually adds -s. Make this a habit before you hand in any written task.',
      },
      { type: 'h3', text: '8. Using “être” for age, hunger and cold' },
      {
        type: 'p',
        text: 'Learners translate from English or Bangla and say “Je suis 20 ans”. In French, you have your age: **J’ai 20 ans**. The same goes for **j’ai faim** (I am hungry), **j’ai soif** (thirsty), **j’ai froid** (cold) and **j’ai peur** (afraid). This appears in almost every A1 speaking test, so it is worth getting right early.',
      },
      {
        type: 'p',
        text: 'Fix: learn these as fixed expressions with avoir and practise them in a short self-introduction until they are automatic.',
      },
      { type: 'h3', text: '9. Putting object pronouns after the verb' },
      {
        type: 'p',
        text: 'Influenced by English, learners say “Je vois le” for “I see it”. In French, the pronoun comes before the verb: **Je le vois**. In the negative it stays there too: **Je ne le vois pas**. Here Bangla actually helps you: in ‘আমি তাকে দেখি’, the pronoun ‘তাকে’ also comes before the verb.',
      },
      {
        type: 'p',
        text: 'Fix: think in Bangla word order for pronouns. Practise short chains: je le prends, je la connais, je les aime, je lui parle.',
      },
      { type: 'h3', text: '10. Using “tu” with the wrong people' },
      {
        type: 'p',
        text: 'French **tu** and **vous** work much like Bangla ‘তুমি’ and ‘আপনি’. Yet many learners use tu with everyone because it is the form textbooks introduce first. Saying “Tu peux m’aider ?” to a stranger, a teacher or a DELF examiner sounds too familiar. Say **Vous pouvez m’aider ?** instead.',
      },
      {
        type: 'p',
        text: 'Fix: use the same instinct you have in Bangla. If you would say ‘আপনি’, use vous. In exam role-plays, read the instructions carefully to see whether you are speaking to a friend or an official.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Bonus: watch out for false friends',
        text: 'If you learned English first, some French words will mislead you. **Actuellement** means “currently”, not “actually”. A **librairie** is a bookshop, while a library is a **bibliothèque**. **Assister à** means “to attend”, not “to assist”.',
      },
      { type: 'h2', text: 'How to fix these mistakes faster' },
      {
        type: 'ul',
        items: [
          '**Record yourself.** Read a short paragraph aloud once a week and compare it with a native recording. You will notice z/j and u/ou problems quickly.',
          '**Focus on one or two mistakes at a time.** Trying to fix everything at once usually fixes nothing.',
          '**Get feedback on speaking.** Pronunciation errors are hard to hear in your own voice. A teacher who knows Bangla can spot the exact cause, which is why [one-to-one sessions](/courses/one-to-one) can speed up this stage.',
          '**Build strong foundations.** Many of these habits form in the first months. A structured beginner course such as [DELF A1](/courses/delf-a1), or our [recorded courses](/recorded) if you prefer to study at your own pace, prevents them from becoming fixed.',
        ],
      },
      {
        type: 'p',
        text: 'Not sure which of these mistakes you are making? Start with our [free level test](/quiz/placement-test) to see your current level, then focus your practice where it matters most.',
      },
      {
        type: 'cta',
        title: 'Find out where you stand',
        text: 'Take the free level test in a few minutes and get a clear starting point for your French.',
        href: '/quiz/placement-test',
        label: 'Take the free level test',
        secondaryHref: '/courses/delf-a1',
        secondaryLabel: 'See the DELF A1 course',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'বাংলাভাষীরা প্রায়ই নিজেদের প্রত্যাশার চেয়ে দ্রুত ফ্রেঞ্চ শেখেন। বাংলায় আগে থেকেই ‘তুমি’ ও ‘আপনি’র মতো আনুষ্ঠানিক-অনানুষ্ঠানিক সম্বোধন আছে, অনেক রকম স্বরধ্বনি আছে, আর সর্বনাম ক্রিয়ার আগে বসানোর অভ্যাস আছে, যা সবই কাজে লাগে। কিন্তু ফ্রেঞ্চের কিছু ধ্বনি বাংলায় একেবারেই নেই, আর লিঙ্গের (gender) মতো কিছু গ্রামারের ধারণা সম্পূর্ণ নতুন। ভালো খবর হলো, একই ভুলগুলো বারবার ঘুরে আসে, তাই একবার চিনে ফেললে সচেতনভাবে শুধরে নেওয়া যায়। নতুন শিক্ষার্থীদের কাছ থেকে আমরা যে ১০টি ভুল সবচেয়ে বেশি শুনি, আজই চর্চা করার মতো উদাহরণসহ সেগুলো নিচে দিলাম।',
      },
      { type: 'h2', text: 'উচ্চারণের ভুল' },
      { type: 'h3', text: '১. “z”-এর জায়গায় “জ” বলা' },
      {
        type: 'p',
        text: 'বাংলায় সবচেয়ে কাছের পরিচিত ধ্বনি ‘জ’ বলে অনেকে ফ্রেঞ্চ z-কে জ বানিয়ে ফেলেন। ফলে **zéro** হয়ে যায় “জেরো”, **zoo** হয়ে যায় “জু”। মনে রাখবেন, দুই স্বরবর্ণের মাঝখানে একটি s থাকলে সেটাও z-এর মতো শোনায়: **maison** (বাড়ি) হলো “মে-জ়োঁ”, “মে-জোঁ” নয়; আর **les amis** যুক্ত হয়ে উচ্চারিত হয় “লে-জ়া-মি”।',
      },
      {
        type: 'p',
        text: 'সমাধান: দাঁত প্রায় বন্ধ রেখে, জিভ নিচের দাঁতের পেছনে রেখে মৌমাছির গুঞ্জনের মতো লম্বা “জ়্‌-জ়্‌-জ়্‌” আওয়াজ ধরে রাখুন। তারপর স্বর যোগ করুন: জ়্‌-éro। **zone** আর **jaune** পাশাপাশি বলুন, যতক্ষণ না পার্থক্যটা কানে ও মুখে টের পান।',
      },
      { type: 'h3', text: '২. v আর b গুলিয়ে ফেলা' },
      {
        type: 'p',
        text: 'বাংলায় খাঁটি v ধ্বনি নেই, তাই শিক্ষার্থীরা প্রায়ই ‘ভ’ বা ‘ব’ বলে ফেলেন। এতে **vin** (ওয়াইন) শোনায় প্রায় **bain** (গোসল)-এর মতো, আর **vous** হয়ে যায় “বু”। **avec**, **voiture**, **vingt**-এর মতো শব্দে এই ধ্বনি ঠিক না হলে অন্যরা বুঝতেই পারেন না।',
      },
      {
        type: 'p',
        text: 'সমাধান: ওপরের দাঁত হালকা করে নিচের ঠোঁটে ছোঁয়ান, তারপর গলার স্বর দিয়ে বাতাস বের করুন। ঠোঁটে কম্পন টের পাওয়ার কথা। জোড়ায় জোড়ায় চর্চা করুন: vin / bain, vous / bout, vent / banc।',
      },
      { type: 'h3', text: '৩. “u” আর “ou” এক করে ফেলা' },
      {
        type: 'p',
        text: 'ফ্রেঞ্চে দুটি আলাদা “উ”-জাতীয় ধ্বনি আছে। **ou** অনেকটা বাংলা ‘উ’-এর মতো: **tout**, **vous**, **roue**। কিন্তু শুধু **u** অক্ষরের ধ্বনিটি বাংলায় নেই: **tu**, **rue**, **du**। দুটো একইভাবে বললে অর্থ বদলে যায়: **tu** (তুমি) আর **tout** (সব), **dessus** (ওপরে) আর **dessous** (নিচে)।',
      },
      {
        type: 'p',
        text: 'সমাধান: ‘ই’ বলুন, জিভ ঠিক সেখানেই রাখুন, তারপর শিস দেওয়ার মতো ঠোঁট শক্ত করে গোল করুন। এটাই ফ্রেঞ্চ u। ধীরে ধীরে rue / roue আর du / doux চর্চা করুন।',
      },
      { type: 'h3', text: '৪. নাসিক্য স্বরে “ন” উচ্চারণ করা' },
      {
        type: 'p',
        text: '**vent**, **vont** ও **vin**-এ n আলাদা ব্যঞ্জন হিসেবে উচ্চারিত হয় না; স্বরটি বলার সময় বাতাস নাক দিয়ে যায়। বাংলাভাষীরা প্রায়ই শেষে স্পষ্ট ‘ন’ বা ‘ং’ যোগ করেন, ফলে **bon** শোনায় “বন” বা “বং”-এর মতো। মজার ব্যাপার, বাংলার চন্দ্রবিন্দু (ঁ) এখানে ভালো সূচনাবিন্দু, কারণ এটি আগে থেকেই স্বরকে নাসিক্য করে।',
      },
      {
        type: 'p',
        text: 'সমাধান: তিনটি প্রধান নাসিক্য স্বর একসঙ্গে চর্চা করুন: **an/en** (vent), **on** (vont), **in** (vin)। নিজের কণ্ঠ রেকর্ড করুন, আর জিভ তালুতে লাগার আগেই থেমে যান।',
      },
      { type: 'h3', text: '৫. প্রতিটি অক্ষর উচ্চারণ করা' },
      {
        type: 'p',
        text: 'বাংলা মোটামুটি যেভাবে লেখা হয় সেভাবেই পড়া হয়, তাই প্রতিটি অক্ষর উচ্চারণ করাটা স্বাভাবিক অভ্যাস। কিন্তু ফ্রেঞ্চে অনেক শব্দের শেষ ব্যঞ্জন নীরব: **Paris** হলো “পারি”, **petit** হলো “পতি”, **beaucoup** হলো “বোকু”। **ils parlent**-এর ক্রিয়ার শেষাংশ **-ent** পুরোপুরি নীরব, তাই এটি শুনতে হুবহু **il parle**-এর মতো।',
      },
      {
        type: 'p',
        text: 'সমাধান: একটি কাজের নিয়ম হলো, শেষে থাকা c, r, f ও l প্রায়ই উচ্চারিত হয় (ইংরেজি “careful” শব্দটা মনে রাখুন), আর বেশিরভাগ অন্য শেষ ব্যঞ্জন নীরব থাকে। ব্যতিক্রমগুলো পেলে আলাদা করে শিখে নিন, আর নতুন শব্দ বলার আগে সবসময় একবার শুনে নিন।',
      },
      { type: 'h2', text: 'গ্রামারের ভুল' },
      { type: 'h3', text: '৬. আর্টিকেল ও লিঙ্গ ভুলে যাওয়া' },
      {
        type: 'p',
        text: 'বাংলা বিশেষ্যের কোনো ব্যাকরণগত লিঙ্গ নেই, ইংরেজির “a” বা “the”-এর মতো শব্দও নেই। ফ্রেঞ্চে প্রায় প্রতিটি বিশেষ্যের আগে আর্টিকেল লাগে, আর প্রতিটি বিশেষ্য হয় পুংলিঙ্গ নয়তো স্ত্রীলিঙ্গ। তাই শিক্ষার্থীরা **J’ai une voiture** (আমার একটি গাড়ি আছে)-এর বদলে বলেন “J’ai voiture”, কিংবা **la table**-এর বদলে “le table”।',
      },
      {
        type: 'p',
        text: 'সমাধান: কোনো বিশেষ্য কখনো একা শিখবেন না। প্রতিবার আর্টিকেলসহ লিখুন ও বলুন: **le livre**, **la maison**, **un ami**, **une amie**। নোটে পুংলিঙ্গ ও স্ত্রীলিঙ্গ শব্দ আলাদা রঙে লিখলে মনে রাখাও সহজ হয়।',
      },
      { type: 'h3', text: '৭. বিশেষণের মিল না করা' },
      {
        type: 'p',
        text: 'বিশেষণ লিঙ্গ ও বচন অনুযায়ী বদলায়, তাই “une petit maison” হবে **une petite maison**, আর “elles sont content” হবে **elles sont contentes**। DELF A1 ও A2-এর রাইটিংয়ে এটি সবচেয়ে সাধারণ ভুলগুলোর একটি, এবং এতে সহজ নম্বর হাতছাড়া হয়।',
      },
      {
        type: 'p',
        text: 'সমাধান: প্রতিটি বাক্য লেখার পর প্রতিটি বিশেষণ তার বিশেষ্যের সঙ্গে মিলিয়ে দেখুন। স্ত্রীলিঙ্গে সাধারণত -e যোগ হয়, বহুবচনে সাধারণত -s। যেকোনো লিখিত কাজ জমা দেওয়ার আগে এটি অভ্যাসে পরিণত করুন।',
      },
      { type: 'h3', text: '৮. বয়স, ক্ষুধা ও ঠান্ডার জন্য “être” ব্যবহার' },
      {
        type: 'p',
        text: 'ইংরেজি বা বাংলা থেকে অনুবাদ করে শিক্ষার্থীরা বলেন “Je suis 20 ans”। ফ্রেঞ্চে বয়স “থাকে”, অর্থাৎ avoir দিয়ে বলতে হয়: **J’ai 20 ans**। একইভাবে **j’ai faim** (আমার ক্ষুধা পেয়েছে), **j’ai soif** (তৃষ্ণা), **j’ai froid** (শীত লাগছে), **j’ai peur** (ভয় পাচ্ছি)। প্রায় প্রতিটি A1 স্পিকিং টেস্টে এটি আসে, তাই শুরুতেই ঠিক করে নেওয়া ভালো।',
      },
      {
        type: 'p',
        text: 'সমাধান: এগুলো avoir-সহ নির্দিষ্ট বাক্যাংশ হিসেবে মুখস্থ করুন, আর ছোট একটি আত্মপরিচয়ে বারবার ব্যবহার করুন, যতক্ষণ না স্বয়ংক্রিয়ভাবে মুখে চলে আসে।',
      },
      { type: 'h3', text: '৯. অবজেক্ট সর্বনাম ক্রিয়ার পরে বসানো' },
      {
        type: 'p',
        text: 'ইংরেজির প্রভাবে শিক্ষার্থীরা “আমি এটা দেখি” বোঝাতে বলেন “Je vois le”। ফ্রেঞ্চে সর্বনাম বসে ক্রিয়ার আগে: **Je le vois**। না-বাচক বাক্যেও সেখানেই থাকে: **Je ne le vois pas**। এখানে বাংলা আসলে আপনাকে সাহায্য করে: ‘আমি তাকে দেখি’ বাক্যেও ‘তাকে’ ক্রিয়ার আগে বসে।',
      },
      {
        type: 'p',
        text: 'সমাধান: সর্বনামের ক্ষেত্রে বাংলা শব্দক্রম মাথায় রাখুন। ছোট ছোট বাক্য পরপর চর্চা করুন: je le prends, je la connais, je les aime, je lui parle।',
      },
      { type: 'h3', text: '১০. ভুল মানুষের সঙ্গে “tu” ব্যবহার' },
      {
        type: 'p',
        text: 'ফ্রেঞ্চ **tu** আর **vous** অনেকটা বাংলার ‘তুমি’ আর ‘আপনি’র মতো কাজ করে। তবু অনেকে সবার সঙ্গে tu ব্যবহার করেন, কারণ বইয়ে প্রথমে সেটাই শেখানো হয়। অপরিচিত কেউ, শিক্ষক বা DELF পরীক্ষককে “Tu peux m’aider ?” বললে বেশি ঘনিষ্ঠ শোনায়। বলুন **Vous pouvez m’aider ?**',
      },
      {
        type: 'p',
        text: 'সমাধান: বাংলায় যে বোধ কাজ করে, সেটাই ব্যবহার করুন। যেখানে ‘আপনি’ বলতেন, সেখানে vous। পরীক্ষার রোল-প্লেতে নির্দেশনা ভালো করে পড়ুন: আপনি বন্ধুর সঙ্গে কথা বলছেন, নাকি কোনো কর্মকর্তার সঙ্গে।',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'বোনাস: বিভ্রান্তিকর “false friends” থেকে সাবধান',
        text: 'আগে ইংরেজি শিখে থাকলে কিছু ফ্রেঞ্চ শব্দ আপনাকে ভুল পথে নেবে। **Actuellement** মানে “বর্তমানে”, “actually” নয়। **Librairie** মানে বইয়ের দোকান, আর লাইব্রেরি হলো **bibliothèque**। **Assister à** মানে “উপস্থিত থাকা”, “সাহায্য করা” নয়।',
      },
      { type: 'h2', text: 'এই ভুলগুলো দ্রুত শোধরানোর উপায়' },
      {
        type: 'ul',
        items: [
          '**নিজের কণ্ঠ রেকর্ড করুন।** সপ্তাহে একবার একটি ছোট অনুচ্ছেদ জোরে পড়ে রেকর্ড করুন এবং নেটিভ রেকর্ডিংয়ের সঙ্গে মিলিয়ে নিন। z/জ আর u/ou-এর সমস্যা দ্রুতই ধরা পড়বে।',
          '**একবারে এক-দুটি ভুলে মনোযোগ দিন।** সব একসঙ্গে ঠিক করতে গেলে সাধারণত কোনোটাই ঠিক হয় না।',
          '**স্পিকিংয়ে ফিডব্যাক নিন।** নিজের কণ্ঠে উচ্চারণের ভুল ধরা কঠিন। বাংলা জানেন এমন একজন শিক্ষক ভুলের আসল কারণটা ধরতে পারেন, তাই এই পর্যায়ে [ওয়ান-টু-ওয়ান সেশন](/courses/one-to-one) অগ্রগতি দ্রুত করতে পারে।',
          '**শক্ত ভিত্তি তৈরি করুন।** এসব অভ্যাসের বেশিরভাগ প্রথম কয়েক মাসেই তৈরি হয়। [DELF A1](/courses/delf-a1)-এর মতো একটি গোছানো বিগিনার কোর্স, অথবা নিজের গতিতে পড়তে চাইলে আমাদের [রেকর্ডেড কোর্স](/recorded), এগুলোকে স্থায়ী হতে দেয় না।',
        ],
      },
      {
        type: 'p',
        text: 'কোন ভুলগুলো আপনি করছেন বুঝতে পারছেন না? আমাদের [ফ্রি লেভেল টেস্ট](/quiz/placement-test) দিয়ে শুরু করুন, বর্তমান লেভেল জেনে নিন, তারপর যেখানে সবচেয়ে বেশি দরকার সেখানে চর্চায় মন দিন।',
      },
      {
        type: 'cta',
        title: 'জেনে নিন আপনি কোথায় আছেন',
        text: 'কয়েক মিনিটে ফ্রি লেভেল টেস্ট দিন এবং আপনার ফ্রেঞ্চ শেখার একটি পরিষ্কার সূচনাবিন্দু পান।',
        href: '/quiz/placement-test',
        label: 'ফ্রি লেভেল টেস্ট দিন',
        secondaryHref: '/courses/delf-a1',
        secondaryLabel: 'DELF A1 কোর্স দেখুন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Is French pronunciation hard for Bangla speakers?', bn: 'বাংলাভাষীদের জন্য কি ফ্রেঞ্চ উচ্চারণ কঠিন?' },
      a: {
        en: 'A few sounds are new, mainly z, v, the French u and the nasal vowels. Most other sounds are manageable, and with regular listening and feedback these specific sounds improve within a few months.',
        bn: 'কয়েকটি ধ্বনি নতুন, মূলত z, v, ফ্রেঞ্চ u এবং নাসিক্য স্বর। বাকি বেশিরভাগ ধ্বনি আয়ত্তে আনা সহজ, আর নিয়মিত শোনা ও ফিডব্যাকের মাধ্যমে এই নির্দিষ্ট ধ্বনিগুলোও কয়েক মাসে উন্নত হয়।',
      },
    },
    {
      q: { en: 'How do I remember whether a French noun is masculine or feminine?', bn: 'ফ্রেঞ্চ বিশেষ্য পুংলিঙ্গ না স্ত্রীলিঙ্গ, তা কীভাবে মনে রাখব?' },
      a: {
        en: 'Always learn nouns together with their article (le, la, un, une). Some endings give clues, for example many words ending in -tion are feminine, but the article habit works best.',
        bn: 'সবসময় বিশেষ্য আর্টিকেলসহ (le, la, un, une) শিখুন। কিছু শব্দের শেষাংশ ইঙ্গিত দেয়, যেমন -tion দিয়ে শেষ হওয়া অনেক শব্দ স্ত্রীলিঙ্গ, তবে আর্টিকেলসহ শেখার অভ্যাসটাই সবচেয়ে কার্যকর।',
      },
    },
    {
      q: { en: 'Do these mistakes affect my DELF score?', bn: 'এই ভুলগুলো কি DELF-এর নম্বরে প্রভাব ফেলে?' },
      a: {
        en: 'Yes. Grammar accuracy, vocabulary and pronunciation are part of the writing and speaking assessment. Small errors that do not block understanding cost less, but repeated agreement and article errors add up.',
        bn: 'হ্যাঁ। রাইটিং ও স্পিকিং মূল্যায়নে গ্রামারের নির্ভুলতা, শব্দভান্ডার ও উচ্চারণ বিবেচনা করা হয়। যে ছোট ভুলে অর্থ বুঝতে সমস্যা হয় না, তাতে ক্ষতি কম, কিন্তু বারবার মিল ও আর্টিকেলের ভুল হলে নম্বর কমতে থাকে।',
      },
    },
  ],
};
const post10: BlogPost = {
  slug: 'online-vs-offline-french-classes-dhaka',
  date: '2026-10-28T10:00:00+06:00',
  readMinutes: 6,
  category: BLOG_CATEGORIES.guides,
  tags: ['french classes dhaka', 'online classes', 'offline classes', 'one-to-one', 'choosing a course'],
  cover: { theme: 'neutral', icon: 'monitor-smartphone', label: { en: 'Online vs Offline', bn: 'অনলাইন বনাম অফলাইন' } },
  title: {
    en: 'Online vs Offline French Classes in Dhaka: How to Choose the Right One',
    bn: 'ঢাকায় অনলাইন নাকি অফলাইন ফরাসি ক্লাস: কীভাবে সঠিকটি বেছে নেবেন',
  },
  metaTitle: {
    en: 'Online vs Offline French Classes in Dhaka: How to Choose',
    bn: 'ঢাকায় অনলাইন নাকি অফলাইন ফরাসি ক্লাস: কীভাবে বাছবেন',
  },
  metaDescription: {
    en: 'Comparing online and offline French classes in Dhaka: commute, batch size, recordings, speaking practice and the questions to ask before you enroll.',
    bn: 'ঢাকায় অনলাইন ও অফলাইন ফরাসি ক্লাসের তুলনা: যাতায়াত, ব্যাচের আকার, রেকর্ডিং, স্পিকিং অনুশীলন এবং ভর্তির আগে যে প্রশ্নগুলো করবেন।',
  },
  excerpt: {
    en: 'Both formats can work well. What matters is how much you speak, how much feedback you get and whether you can attend consistently. Here is how to decide.',
    bn: 'দুই ধরনের ক্লাসই ভালো কাজ করতে পারে। আসল বিষয় হলো আপনি কতটা কথা বলছেন, কতটা ফিডব্যাক পাচ্ছেন, আর নিয়মিত ক্লাসে থাকতে পারছেন কি না। কীভাবে সিদ্ধান্ত নেবেন, দেখে নিন।',
  },
  coverAlt: {
    en: 'Illustrated cover: a laptop and phone icon with the words Online vs Offline',
    bn: 'ইলাস্ট্রেটেড কভার: ল্যাপটপ ও ফোনের আইকন, সাথে লেখা অনলাইন বনাম অফলাইন',
  },
  body: {
    en: [
      {
        type: 'p',
        text: 'If you live in Dhaka and want to learn French, one of the first decisions is whether to join a classroom course or study online. People have strong opinions both ways, but the honest answer is that the format matters less than a few specific things: how often you speak, how quickly your mistakes are corrected, and whether you can keep attending for the months it takes to move up a level. This guide walks through the real trade-offs so you can choose with a clear head.',
      },
      { type: 'h2', text: 'What actually makes a French class work' },
      {
        type: 'p',
        text: 'Before comparing formats, it helps to agree on what you are paying for. A good French class, online or offline, should give you:',
      },
      {
        type: 'ul',
        items: [
          'A clear syllabus mapped to a level (A1, A2, B1, B2) or an exam such as DELF, TEF Canada or TCF Canada.',
          'Regular speaking time for every student, not just the most confident ones.',
          'Correction of your writing and pronunciation, with specific feedback.',
          'Practice in exam-style tasks and mock tests once you reach the intermediate levels.',
          'A teacher who explains clearly and can answer questions in a way you understand, including in Bangla when needed.',
        ],
      },
      {
        type: 'p',
        text: 'Keep this list in mind. Every point below is really about which format delivers these things better for your life.',
      },
      { type: 'h2', text: 'The case for offline classes' },
      {
        type: 'p',
        text: 'Classroom learning still has real strengths. Some learners focus better in a physical room, away from phone notifications and household noise. Face-to-face interaction can feel more natural, especially for shy beginners who find speaking on camera awkward. A fixed place and time can also create discipline: once you have made the trip, you are fully there.',
      },
      {
        type: 'p',
        text: 'The main cost in Dhaka is time. Depending on where you live and when classes run, a short distance can take a long time in traffic, and a two-hour class can easily become a four-hour commitment. Over a course of several months, that adds up. Missed classes due to traffic, weather or work are also harder to make up if there is no recording.',
      },
      { type: 'h2', text: 'The case for online classes' },
      {
        type: 'p',
        text: 'Live online classes remove the commute entirely. That single change often decides whether a working professional or university student can attend consistently. You also get access to teachers who are not in your neighbourhood, which widens your choice considerably.',
      },
      {
        type: 'ul',
        items: [
          '**Recordings:** many online courses record sessions, so you can revise a difficult grammar point or catch up after missing a class.',
          '**Screen sharing and digital materials:** exercises, audio and corrections can be shared instantly and saved for later.',
          '**Flexibility:** evening batches and weekend options are easier to offer when nobody has to travel.',
          '**Comfort for some learners:** people who feel nervous in a room sometimes speak more freely from home.',
        ],
      },
      {
        type: 'p',
        text: 'The weaknesses are real too. A poor internet connection or a noisy home can interrupt lessons. It is easier to hide with your camera off and drift into passive listening. Online classes work best when the teacher actively calls on students and you treat the session as seriously as a classroom.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'A simple setup helps a lot',
        text: 'A pair of earphones with a microphone, a quiet corner and a stable connection make online speaking practice far more effective. Join a few minutes early to test your audio.',
      },
      { type: 'h2', text: 'Batch size and speaking time' },
      {
        type: 'p',
        text: 'Whatever the format, ask how many students are in a batch. In a large group, your personal speaking time shrinks quickly. If a class has many learners and only one teacher, you might speak for just a few minutes per session. Smaller batches, breakout activities or separate speaking sessions make a noticeable difference, especially at B1 and B2 where exams test spontaneous speech.',
      },
      {
        type: 'p',
        text: 'If you need maximum speaking time, a specific exam target or a schedule that doesn’t fit any batch, one-to-one lessons are worth considering. Our [one-to-one sessions](/courses/one-to-one) are designed for exactly these situations, whether you want to fix pronunciation, prepare for a speaking test or work through a particular weak skill.',
      },
      { type: 'h2', text: 'How to check teaching quality before you pay' },
      {
        type: 'p',
        text: 'Marketing claims are easy to make. Here is what you can actually verify:',
      },
      {
        type: 'ol',
        items: [
          'Attend a trial or demo class and notice how much the students speak compared with the teacher.',
          'Ask for the syllabus and see whether it matches the official level descriptions or exam format.',
          'Ask how writing is corrected and how quickly you receive feedback.',
          'Ask whether mock tests are included and how results are explained to you.',
          'Check whether classes are recorded and how long you can access the recordings.',
          'Ask what happens if you miss classes or need to pause, and what support is available between classes.',
          'Be careful with guarantees. No honest school can guarantee an exam score, a visa or a fixed timeline, because these depend on your effort and on external authorities.',
        ],
      },
      { type: 'h2', text: 'Where recorded courses fit in' },
      {
        type: 'p',
        text: 'Recorded courses are a third option that suits people with unpredictable schedules, such as shift workers or students in exam season. They give you a structured path you can follow at any hour. Their limitation is feedback: a video cannot correct your pronunciation. Many learners combine recordings with live practice. You can explore our [recorded French courses](/recorded) to see how a self-paced structure works.',
      },
      { type: 'h2', text: 'A quick way to decide' },
      {
        type: 'ul',
        items: [
          'Choose **offline** if you live close to a good centre, have a predictable schedule and learn best in a physical room.',
          'Choose **live online** if commuting would eat into your study time, you want access to a wider choice of teachers, or you value recordings for revision.',
          'Choose **one-to-one** if you need focused speaking practice, a tight exam timeline or a fully personal schedule.',
          'Choose **recorded** if your schedule changes constantly, and add live speaking practice when you can.',
        ],
      },
      {
        type: 'p',
        text: 'Whichever you choose, start by knowing your current level. Our [free French level test](/quiz/placement-test) takes a few minutes and helps you avoid joining a batch that is too easy or too hard.',
      },
      {
        type: 'cta',
        title: 'Try a class before you decide',
        text: 'Join a free class to experience how our live online lessons work, or take the free level test to find the right starting point.',
        href: '/free-class',
        label: 'Book a free class',
        secondaryHref: '/quiz/placement-test',
        secondaryLabel: 'Take the free level test',
      },
    ],
    bn: [
      {
        type: 'p',
        text: 'ঢাকায় থেকে ফরাসি শিখতে চাইলে প্রথম যে সিদ্ধান্তগুলো নিতে হয়, তার একটি হলো ক্লাসরুমে পড়বেন নাকি অনলাইনে। দুই পক্ষেই মানুষের জোরালো মত আছে, তবে সৎ উত্তর হলো: ক্লাসের ধরনের চেয়ে কয়েকটি নির্দিষ্ট বিষয় বেশি গুরুত্বপূর্ণ — আপনি কত ঘন ঘন কথা বলছেন, ভুলগুলো কত দ্রুত সংশোধন হচ্ছে, আর একটি লেভেল পার হতে যে কয়েক মাস লাগে, সেই পুরো সময় নিয়মিত ক্লাস করতে পারছেন কি না। এই গাইডে বাস্তব সুবিধা-অসুবিধাগুলো তুলে ধরা হলো, যাতে আপনি ঠান্ডা মাথায় বেছে নিতে পারেন।',
      },
      { type: 'h2', text: 'একটি ফরাসি ক্লাস আসলে কী কারণে কাজ করে' },
      {
        type: 'p',
        text: 'ধরন তুলনার আগে ঠিক করে নেওয়া ভালো, আপনি আসলে কীসের জন্য টাকা দিচ্ছেন। অনলাইন হোক বা অফলাইন, একটি ভালো ফরাসি ক্লাসে থাকা উচিত:',
      },
      {
        type: 'ul',
        items: [
          'একটি নির্দিষ্ট লেভেল (A1, A2, B1, B2) বা DELF, TEF Canada, TCF Canada-র মতো পরীক্ষার সাথে মেলানো পরিষ্কার সিলেবাস।',
          'প্রত্যেক শিক্ষার্থীর জন্য নিয়মিত কথা বলার সুযোগ, শুধু সবচেয়ে আত্মবিশ্বাসীদের জন্য নয়।',
          'লেখা ও উচ্চারণের সংশোধন, নির্দিষ্ট ও কাজে লাগার মতো ফিডব্যাকসহ।',
          'ইন্টারমিডিয়েট লেভেলে পৌঁছানোর পর পরীক্ষার ধাঁচের টাস্ক ও মক টেস্টের অনুশীলন।',
          'এমন একজন শিক্ষক, যিনি পরিষ্কারভাবে বোঝান এবং দরকার হলে বাংলাতেও আপনার বোধগম্য উপায়ে প্রশ্নের উত্তর দেন।',
        ],
      },
      {
        type: 'p',
        text: 'এই তালিকাটি মাথায় রাখুন। নিচের প্রতিটি আলোচনা আসলে এটাই: আপনার জীবনযাত্রায় কোন ধরনটি এই জিনিসগুলো ভালোভাবে দিতে পারে।',
      },
      { type: 'h2', text: 'অফলাইন ক্লাসের পক্ষে যুক্তি' },
      {
        type: 'p',
        text: 'ক্লাসরুমে শেখার এখনো বাস্তব কিছু শক্তি আছে। ফোনের নোটিফিকেশন আর বাড়ির শব্দ থেকে দূরে, একটি আলাদা কক্ষে অনেকে বেশি মনোযোগ দিতে পারেন। মুখোমুখি কথোপকথন অনেক সময় বেশি স্বাভাবিক লাগে, বিশেষ করে সেই লাজুক নতুন শিক্ষার্থীদের কাছে, যাঁরা ক্যামেরার সামনে কথা বলতে অস্বস্তি বোধ করেন। নির্দিষ্ট জায়গা ও সময় শৃঙ্খলাও তৈরি করে: একবার কষ্ট করে পৌঁছে গেলে আপনি পুরোপুরি সেখানেই থাকেন।',
      },
      {
        type: 'p',
        text: 'ঢাকায় এর প্রধান খরচ হলো সময়। কোথায় থাকেন আর ক্লাস কখন হয় তার ওপর নির্ভর করে, অল্প দূরত্বও যানজটে অনেক সময় নিয়ে নিতে পারে, আর দুই ঘণ্টার ক্লাস সহজেই চার ঘণ্টার ব্যাপার হয়ে দাঁড়ায়। কয়েক মাসের কোর্সে এই সময়টা অনেক বড় অঙ্ক। রেকর্ডিং না থাকলে যানজট, আবহাওয়া বা অফিসের কারণে মিস হওয়া ক্লাস পুষিয়ে নেওয়াও কঠিন।',
      },
      { type: 'h2', text: 'অনলাইন ক্লাসের পক্ষে যুক্তি' },
      {
        type: 'p',
        text: 'লাইভ অনলাইন ক্লাসে যাতায়াতের ঝামেলা পুরোপুরি থাকে না। শুধু এই একটি পরিবর্তনই অনেক সময় ঠিক করে দেয়, একজন চাকরিজীবী বা বিশ্ববিদ্যালয়ের শিক্ষার্থী নিয়মিত ক্লাস করতে পারবেন কি না। তাছাড়া আপনার এলাকার বাইরের শিক্ষকদের কাছেও পৌঁছানো যায়, ফলে বেছে নেওয়ার সুযোগ অনেক বেড়ে যায়।',
      },
      {
        type: 'ul',
        items: [
          '**রেকর্ডিং:** অনেক অনলাইন কোর্সে ক্লাস রেকর্ড করা হয়, তাই কঠিন কোনো গ্রামার পয়েন্ট আবার দেখতে বা মিস হওয়া ক্লাস পুষিয়ে নিতে পারেন।',
          '**স্ক্রিন শেয়ার ও ডিজিটাল ম্যাটেরিয়াল:** অনুশীলনী, অডিও ও সংশোধন মুহূর্তেই শেয়ার করা যায় এবং পরে কাজে লাগানোর জন্য সংরক্ষণ করা যায়।',
          '**নমনীয়তা:** কাউকে যাতায়াত করতে না হলে সন্ধ্যার ব্যাচ বা সাপ্তাহিক ছুটির দিনের ব্যাচ রাখা সহজ হয়।',
          '**কারও কারও জন্য স্বস্তি:** যাঁরা কক্ষভর্তি মানুষের সামনে নার্ভাস হন, তাঁরা অনেক সময় বাসা থেকে বেশি সাবলীলভাবে কথা বলেন।',
        ],
      },
      {
        type: 'p',
        text: 'দুর্বলতাগুলোও বাস্তব। দুর্বল ইন্টারনেট সংযোগ বা কোলাহলপূর্ণ বাসা ক্লাসে বিঘ্ন ঘটাতে পারে। ক্যামেরা বন্ধ রেখে লুকিয়ে থাকা এবং শুধু নিষ্ক্রিয়ভাবে শোনার দিকে চলে যাওয়াও সহজ। অনলাইন ক্লাস সবচেয়ে ভালো কাজ করে যখন শিক্ষক সক্রিয়ভাবে শিক্ষার্থীদের কথা বলান, আর আপনি সেশনটিকে ক্লাসরুমের মতোই গুরুত্ব দেন।',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'সহজ একটি সেটআপ অনেক কাজে দেয়',
        text: 'মাইক্রোফোনসহ একজোড়া ইয়ারফোন, একটি নিরিবিলি কোণ আর স্থিতিশীল ইন্টারনেট থাকলে অনলাইনে স্পিকিং অনুশীলন অনেক বেশি কার্যকর হয়। অডিও পরীক্ষা করতে কয়েক মিনিট আগে জয়েন করুন।',
      },
      { type: 'h2', text: 'ব্যাচের আকার ও কথা বলার সময়' },
      {
        type: 'p',
        text: 'যে ধরনই বেছে নিন, জিজ্ঞেস করুন একটি ব্যাচে কতজন শিক্ষার্থী থাকে। বড় দলে আপনার নিজের কথা বলার সময় দ্রুত কমে যায়। অনেক শিক্ষার্থী আর একজন শিক্ষক থাকলে প্রতি সেশনে হয়তো মাত্র কয়েক মিনিট কথা বলার সুযোগ পাবেন। ছোট ব্যাচ, ব্রেকআউট অ্যাক্টিভিটি বা আলাদা স্পিকিং সেশন উল্লেখযোগ্য পার্থক্য গড়ে দেয়, বিশেষ করে B1 ও B2-তে, যেখানে পরীক্ষায় স্বতঃস্ফূর্ত কথা বলার দক্ষতা যাচাই করা হয়।',
      },
      {
        type: 'p',
        text: 'আপনার যদি সর্বোচ্চ কথা বলার সময়, নির্দিষ্ট পরীক্ষার লক্ষ্য বা কোনো ব্যাচের সাথে না মেলা সময়সূচি থাকে, তাহলে ওয়ান-টু-ওয়ান ক্লাস বিবেচনা করার মতো। আমাদের [ওয়ান-টু-ওয়ান সেশন](/courses/one-to-one) ঠিক এমন পরিস্থিতির জন্যই সাজানো — উচ্চারণ ঠিক করা, স্পিকিং টেস্টের প্রস্তুতি, কিংবা নির্দিষ্ট কোনো দুর্বল দক্ষতা নিয়ে কাজ করা।',
      },
      { type: 'h2', text: 'টাকা দেওয়ার আগে পড়ানোর মান কীভাবে যাচাই করবেন' },
      {
        type: 'p',
        text: 'বিজ্ঞাপনে দাবি করা সহজ। যা আপনি বাস্তবে যাচাই করতে পারেন:',
      },
      {
        type: 'ol',
        items: [
          'একটি ট্রায়াল বা ডেমো ক্লাসে অংশ নিন এবং লক্ষ করুন শিক্ষকের তুলনায় শিক্ষার্থীরা কতটা কথা বলছেন।',
          'সিলেবাস চেয়ে নিন এবং দেখুন সেটি অফিশিয়াল লেভেলের বিবরণ বা পরীক্ষার কাঠামোর সাথে মেলে কি না।',
          'লেখা কীভাবে সংশোধন করা হয় এবং কত দিনের মধ্যে ফিডব্যাক পাওয়া যায়, জিজ্ঞেস করুন।',
          'মক টেস্ট অন্তর্ভুক্ত কি না এবং ফলাফল আপনাকে কীভাবে ব্যাখ্যা করা হয়, জেনে নিন।',
          'ক্লাস রেকর্ড হয় কি না এবং কত দিন রেকর্ডিং দেখা যাবে, নিশ্চিত হোন।',
          'ক্লাস মিস হলে বা বিরতি নিতে হলে কী হবে, এবং দুই ক্লাসের মাঝে কী ধরনের সাপোর্ট পাওয়া যায়, জিজ্ঞেস করুন।',
          'গ্যারান্টির ব্যাপারে সতর্ক থাকুন। কোনো সৎ প্রতিষ্ঠান পরীক্ষার স্কোর, ভিসা বা নির্দিষ্ট সময়সীমার নিশ্চয়তা দিতে পারে না, কারণ এগুলো আপনার পরিশ্রম ও বাইরের কর্তৃপক্ষের ওপর নির্ভর করে।',
        ],
      },
      { type: 'h2', text: 'রেকর্ডেড কোর্স কোথায় মানানসই' },
      {
        type: 'p',
        text: 'রেকর্ডেড কোর্স তৃতীয় একটি বিকল্প, যা অনিশ্চিত সময়সূচির মানুষের জন্য উপযোগী — যেমন শিফটে কাজ করা মানুষ বা পরীক্ষার মৌসুমে থাকা শিক্ষার্থী। এতে দিনের যেকোনো সময় অনুসরণ করার মতো একটি গোছানো পথ পাওয়া যায়। এর সীমাবদ্ধতা হলো ফিডব্যাক: একটি ভিডিও আপনার উচ্চারণ সংশোধন করতে পারে না। তাই অনেকে রেকর্ডিংয়ের সাথে লাইভ অনুশীলন মিলিয়ে নেন। নিজের গতিতে শেখার কাঠামো কেমন, তা বুঝতে আমাদের [রেকর্ডেড ফ্রেঞ্চ কোর্সগুলো](/recorded) দেখে নিতে পারেন।',
      },
      { type: 'h2', text: 'দ্রুত সিদ্ধান্ত নেওয়ার একটি উপায়' },
      {
        type: 'ul',
        items: [
          '**অফলাইন** বেছে নিন, যদি ভালো কোনো সেন্টারের কাছাকাছি থাকেন, সময়সূচি নির্দিষ্ট থাকে এবং আলাদা কক্ষে বসে সবচেয়ে ভালো শিখতে পারেন।',
          '**লাইভ অনলাইন** বেছে নিন, যদি যাতায়াতে পড়ার সময় নষ্ট হয়, বেশি শিক্ষকের মধ্য থেকে বাছতে চান, বা রিভিশনের জন্য রেকর্ডিং আপনার কাছে গুরুত্বপূর্ণ হয়।',
          '**ওয়ান-টু-ওয়ান** বেছে নিন, যদি কেন্দ্রীভূত স্পিকিং অনুশীলন, পরীক্ষার আগে কম সময় বা পুরোপুরি ব্যক্তিগত সময়সূচি দরকার হয়।',
          '**রেকর্ডেড** বেছে নিন, যদি সময়সূচি সারাক্ষণ বদলায়, আর সুযোগ পেলে সাথে লাইভ স্পিকিং অনুশীলন যোগ করুন।',
        ],
      },
      {
        type: 'p',
        text: 'যেটাই বেছে নিন, শুরু করুন নিজের বর্তমান লেভেল জেনে। আমাদের [ফ্রি ফ্রেঞ্চ লেভেল টেস্ট](/quiz/placement-test) মাত্র কয়েক মিনিটের, আর এটি আপনাকে খুব সহজ বা খুব কঠিন ব্যাচে ভর্তি হওয়া থেকে বাঁচাবে।',
      },
      {
        type: 'cta',
        title: 'সিদ্ধান্তের আগে একটি ক্লাস করে দেখুন',
        text: 'আমাদের লাইভ অনলাইন ক্লাস কেমন, তা নিজে দেখতে একটি ফ্রি ক্লাসে যোগ দিন, অথবা সঠিক শুরুর জায়গা খুঁজতে ফ্রি লেভেল টেস্ট দিন।',
        href: '/free-class',
        label: 'ফ্রি ক্লাস বুক করুন',
        secondaryHref: '/quiz/placement-test',
        secondaryLabel: 'ফ্রি লেভেল টেস্ট দিন',
      },
    ],
  },
  faq: [
    {
      q: { en: 'Are online French classes as effective as offline classes?', bn: 'অনলাইন ফরাসি ক্লাস কি অফলাইন ক্লাসের মতোই কার্যকর?' },
      a: {
        en: 'They can be, if the class is interactive, gives every student speaking time and provides regular feedback. The format matters less than consistent attendance and active practice.',
        bn: 'হতে পারে, যদি ক্লাসটি ইন্টারঅ্যাকটিভ হয়, প্রত্যেক শিক্ষার্থীকে কথা বলার সুযোগ দেয় এবং নিয়মিত ফিডব্যাক দেয়। ক্লাসের ধরনের চেয়ে নিয়মিত উপস্থিতি ও সক্রিয় অনুশীলন বেশি গুরুত্বপূর্ণ।',
      },
    },
    {
      q: { en: 'How many students should be in a French batch?', bn: 'একটি ফরাসি ব্যাচে কতজন শিক্ষার্থী থাকা উচিত?' },
      a: {
        en: 'There is no single right number, but smaller groups usually mean more speaking time per person. Ask the school about batch size and how speaking practice is organised.',
        bn: 'নির্দিষ্ট কোনো সঠিক সংখ্যা নেই, তবে ছোট দলে সাধারণত প্রত্যেকে বেশি কথা বলার সুযোগ পান। প্রতিষ্ঠানের কাছে ব্যাচের আকার এবং স্পিকিং অনুশীলন কীভাবে সাজানো হয়, জিজ্ঞেস করুন।',
      },
    },
    {
      q: { en: 'When are one-to-one French lessons worth it?', bn: 'ওয়ান-টু-ওয়ান ফরাসি ক্লাস কখন নেওয়া উচিত?' },
      a: {
        en: 'They are most useful when you need intensive speaking practice, have a close exam date, want to fix specific weaknesses or cannot fit any group schedule.',
        bn: 'যখন নিবিড় স্পিকিং অনুশীলন দরকার, পরীক্ষার তারিখ কাছে, নির্দিষ্ট দুর্বলতা ঠিক করতে চান, বা কোনো গ্রুপ ব্যাচের সময়ের সাথে মেলাতে পারছেন না — তখন এটি সবচেয়ে কাজে দেয়।',
      },
    },
    {
      q: { en: 'Can I try a class before enrolling?', bn: 'ভর্তির আগে কি একটি ক্লাস করে দেখা যায়?' },
      a: {
        en: 'Yes. You can register for a free class with We Learn French BD and take the free level test to see which course matches your current level.',
        bn: 'হ্যাঁ। We Learn French BD-তে একটি ফ্রি ক্লাসের জন্য রেজিস্টার করতে পারেন, আর কোন কোর্স আপনার বর্তমান লেভেলের সাথে মেলে তা জানতে ফ্রি লেভেল টেস্ট দিতে পারেন।',
      },
    },
  ],
};

/** All posts, newest first. */
export const BLOG_POSTS: BlogPost[] = [post01, post02, post03, post04, post05, post06, post07, post08, post09, post10].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date),
);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Up to `n` other posts: same category first, then shared tags, then newest. */
export function relatedPosts(slug: string, n = 3): BlogPost[] {
  const post = getPost(slug);
  if (!post) return BLOG_POSTS.slice(0, n);
  const score = (p: BlogPost) =>
    (p.category.key === post.category.key ? 10 : 0) + p.tags.filter((t) => post.tags.includes(t)).length;
  return BLOG_POSTS.filter((p) => p.slug !== slug)
    .map((p, i) => ({ p, s: score(p), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map((x) => x.p);
}

/** Anchor id for the nth (0-based) H2 of a body; identical across languages so TOC links stay stable. */
export const headingId = (index: number) => `section-${index + 1}`;

/** H2 headings of a body, with their anchor ids (for a table of contents). */
export function postHeadings(blocks: BlogBlock[]): { id: string; text: string }[] {
  return blocks
    .filter((b): b is Extract<BlogBlock, { type: 'h2' }> => b.type === 'h2')
    .map((b, i) => ({ id: headingId(i), text: stripInline(b.text) }));
}

/** Removes the inline markup ([text](/path), **bold**) leaving plain text (for JSON-LD, meta, TOC). */
export function stripInline(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
}

/** Paths used for every post, e.g. for the sitemap: ['/blog', '/blog/<slug>', ...]. */
export const BLOG_PATHS: string[] = ['/blog', ...BLOG_POSTS.map((p) => `/blog/${p.slug}`)];
