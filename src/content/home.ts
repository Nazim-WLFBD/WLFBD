import type { L } from '@/i18n/t';

/* Every string below comes from the original We Learn French BD site.
   Bangla is the site's own Bangla copy where it existed; English-only
   paragraphs from the original have been given a faithful Bangla version. */

export const hero = {
  eyebrow: { en: 'DELF · TEF · TCF — Live Online', bn: 'DELF · TEF · TCF — লাইভ অনলাইন' },
  line1: { en: 'Learn French.', bn: 'ফরাসি শিখুন।' },
  line2: { en: 'Open Your World.', bn: 'বিশ্বের দ্বার উন্মোচন করুন।' },
  subtitle: {
    en: 'Build your future with French for Canada PR, higher education in France, and global opportunities.',
    bn: 'কানাডা পিআর, ফ্রান্সে উচ্চশিক্ষা ও আন্তর্জাতিক ক্যারিয়ার গড়ার লক্ষ্যে প্রফেশনাল ফরাসি ভাষা প্রশিক্ষণ।',
  },
  chips: [
    { title: { en: 'DELF A1–B2', bn: 'DELF A1–B2' }, sub: { en: 'Language Levels', bn: 'ভাষার লেভেলসমূহ' }, icon: 'book' },
    { title: { en: 'TCF Canada', bn: 'TCF Canada' }, sub: { en: 'Exam Preparation', bn: 'পরীক্ষার প্রস্তুতি' }, icon: 'clipboard' },
    { title: { en: 'TEF Canada', bn: 'TEF Canada' }, sub: { en: 'Immigration Prep', bn: 'ইমিগ্রেশন প্রস্তুতি' }, icon: 'maple' },
    { title: { en: 'Expert Guidance', bn: 'বিশেষজ্ঞ দিকনির্দেশনা' }, sub: { en: 'Structured Support', bn: 'সুসংগঠিত সাপোর্ট' }, icon: 'users' },
  ],
  ctaPrimary: { en: 'Explore Courses', bn: 'কোর্সগুলো দেখুন' },
  ctaSecondary: { en: 'Practice Free Test', bn: 'ফ্রি টেস্ট প্র্যাকটিস' },
  card: {
    title: { en: 'TCF / TEF Canada', bn: 'TCF / TEF Canada' },
    pre: { en: 'Your Pathway to', bn: 'আপনার পথ' },
    strong: { en: 'Canada Opportunities', bn: 'কানাডার সুযোগের দিকে' },
    checks: [
      { en: 'Express Entry Preparation', bn: 'Express Entry প্রস্তুতি' },
      { en: 'Francophone Immigration (+62 CRS)', bn: 'ফ্রাঙ্কোফোন ইমিগ্রেশন (+62 CRS)' },
      { en: 'Global Career & Study Opportunities', bn: 'বৈশ্বিক ক্যারিয়ার ও পড়াশোনার সুযোগ' },
    ],
    cta: { en: 'Canada CRS Points Calculator', bn: 'কানাডা CRS পয়েন্ট ক্যালকুলেটর' },
    disclaimer: {
      en: '* Official language test training courses. We do not provide immigration legal advice or visa guarantees.',
      bn: '* অফিশিয়াল ভাষা পরীক্ষার প্রশিক্ষণ কোর্স। আমরা ইমিগ্রেশন সংক্রান্ত আইনি পরামর্শ বা ভিসার নিশ্চয়তা প্রদান করি না।',
    },
  },
  features: [
    {
      icon: 'cap',
      title: { en: 'Structured Learning', bn: 'স্ট্রাকচার্ড লার্নিং' },
      sub: { en: 'From Beginner to Advanced Level', bn: 'বিগিনার থেকে অ্যাডভান্সড লেভেল' },
    },
    {
      icon: 'monitor',
      title: { en: 'Live Online Classes', bn: 'লাইভ অনলাইন ক্লাস' },
      sub: { en: 'Interactive & Flexible Learning', bn: 'ইন্টারেক্টিভ ও ফ্লেক্সিবল লার্নিং' },
    },
    {
      icon: 'trophy',
      title: { en: 'Exam Focused', bn: 'পরীক্ষাকেন্দ্রিক প্রস্তুতি' },
      sub: { en: 'DELF | TCF Canada | TEF Canada', bn: 'DELF | TCF Canada | TEF Canada' },
    },
    {
      icon: 'headphones',
      title: { en: 'Personalized Support', bn: 'ব্যক্তিগত সাপোর্ট' },
      sub: { en: 'We are with you in every step', bn: 'প্রতিটি পদক্ষেপে আমরা আছি' },
    },
  ],
};

export const marquee: L[] = [
  { en: 'DELF A1', bn: 'DELF A1' },
  { en: 'DELF A2', bn: 'DELF A2' },
  { en: 'DELF B1', bn: 'DELF B1' },
  { en: 'DELF B2', bn: 'DELF B2' },
  { en: 'TEF Canada', bn: 'TEF Canada' },
  { en: 'TCF Canada', bn: 'TCF Canada' },
  { en: 'Express Entry', bn: 'এক্সপ্রেস এন্ট্রি' },
  { en: 'Carte de Séjour', bn: 'Carte de Séjour' },
  { en: 'Alliance Française', bn: 'Alliance Française' },
  { en: 'CLB 7', bn: 'CLB 7' },
  { en: '+62 CRS', bn: '+62 CRS' },
  { en: 'Bonjour Dhaka', bn: 'বঁজুর ঢাকা' },
];

export const trust = {
  eyebrow: { en: 'Why students choose us', bn: 'কেন আমাদের বেছে নেবেন' },
  title: { en: 'Built for Bangla-speaking learners', bn: 'বাংলাভাষী শিক্ষার্থীদের জন্য তৈরি' },
  items: [
    {
      icon: 'video',
      title: { en: 'Live Zoom Classes', bn: 'লাইভ জুম ক্লাস' },
      desc: { en: 'Interactive Q&A with instructors', bn: 'সরাসরি শিক্ষককে প্রশ্ন করার সুযোগ' },
    },
    {
      icon: 'book',
      title: { en: 'Bangla Medium Focus', bn: 'বাংলা ভাষায় ব্যাখ্যা' },
      desc: { en: 'Complex rules made simple in Bangla', bn: 'সহজ বাংলায় গ্রামার ও স্পোকেন' },
    },
    {
      icon: 'award',
      title: { en: 'DELF & TEF Standard', bn: 'DELF / TEF কারিকুলাম' },
      desc: { en: 'Aligned with Alliance Française', bn: 'আন্তর্জাতিক এক্সাম ফরম্যাট' },
    },
    {
      icon: 'film',
      title: { en: 'Lifetime Recording', bn: 'লাইফটাইম রেকর্ডিং' },
      desc: { en: 'Full HD video backup archive', bn: 'ক্লাস মিস করলেও ভিডিও ব্যাকআপ' },
    },
    {
      icon: 'users',
      title: { en: 'Small Batch Size', bn: 'ছোট ব্যাচ সাইজ' },
      desc: {
        en: '8-10 students per batch for personal care',
        bn: 'সর্বোচ্চ ৮-১০ জন শিক্ষার্থী প্রতি ব্যাচে',
      },
    },
  ],
};

export const about = {
  badge: { en: 'About We Learn French BD', bn: 'আমাদের গল্প ও লক্ষ্য' },
  titleA: { en: 'Empowering Your Global Ambition with ', bn: 'সহজ, সাশ্রয়ী ও মানসম্মত ফ্রেঞ্চ শিক্ষার ' },
  titleB: { en: 'French Fluency', bn: 'বিশ্বস্ত মাধ্যম' },
  intro: {
    en: 'Making French language learning simple, affordable, and accessible for every ambitious student in Bangladesh and beyond.',
    bn: 'কানাডা পিআর, ফ্রান্স উচ্চশিক্ষা ও বিশ্বব্যাপী ক্যারিয়ারের জন্য ফ্রেঞ্চ ভাষা শেখাকে প্রতিটি শিক্ষার্থীর হাতের নাগালে নিয়ে আসাই আমাদের মূল উদ্দেশ্য।',
  },
  mission: {
    label: { en: '01. Mission', bn: '01. মিশন' },
    title: { en: 'Our Mission', bn: 'আমাদের মিশন' },
    p1: {
      en: 'At We Learn French BD, our mission is to make French language learning simple, affordable, and accessible for everyone in Bangladesh.',
      bn: 'We Learn French BD-এর মিশন হলো বাংলাদেশের প্রত্যেকের জন্য ফরাসি ভাষা শেখাকে সহজ, সাশ্রয়ী ও সহজলভ্য করা।',
    },
    p2: {
      en: 'Whether your goal is to prepare for the DELF, TCF, or TEF exams, study abroad, advance your career, or simply discover a new culture, we are committed to supporting your French-learning journey every step of the way.',
      bn: 'আপনার লক্ষ্য DELF, TCF বা TEF পরীক্ষার প্রস্তুতি, বিদেশে পড়াশোনা, ক্যারিয়ারে এগিয়ে যাওয়া কিংবা নতুন একটি সংস্কৃতি জানা — যা-ই হোক, আপনার ফরাসি শেখার যাত্রার প্রতিটি ধাপে আমরা পাশে আছি।',
    },
    goals: [
      { icon: 'award', label: { en: 'DELF / TCF / TEF Prep', bn: 'DELF / TCF / TEF প্রস্তুতি' } },
      { icon: 'cap', label: { en: 'Study in France & EU', bn: 'ফ্রান্স ও ইউরোপে পড়াশোনা' } },
      { icon: 'briefcase', label: { en: 'Canada PR & Careers', bn: 'কানাডা পিআর ও ক্যারিয়ার' } },
      { icon: 'globe', label: { en: 'Cultural Immersion', bn: 'সাংস্কৃতিক অভিজ্ঞতা' } },
    ],
    footer: { en: '100% Student-Centric Support', bn: '১০০% শিক্ষার্থী-কেন্দ্রিক সাপোর্ট' },
  },
  vision: {
    label: { en: '02. Vision', bn: '02. ভিশন' },
    title: { en: 'Our Vision', bn: 'আমাদের ভিশন' },
    quote: {
      en: '“Empowering Bangladesh to connect with the world through the French language.”',
      bn: '“ফরাসি ভাষার মাধ্যমে বাংলাদেশকে বিশ্বের সাথে যুক্ত করা।”',
    },
    p: {
      en: 'By combining effective teaching methods, modern learning resources, and continuous student support, we aim to develop confident French speakers who can succeed in:',
      bn: 'কার্যকর শিক্ষণ পদ্ধতি, আধুনিক শিক্ষা উপকরণ এবং নিরবচ্ছিন্ন সাপোর্টের সমন্বয়ে আমরা এমন আত্মবিশ্বাসী ফরাসি ভাষাভাষী তৈরি করতে চাই, যারা সফল হবেন:',
    },
    pillars: [
      {
        icon: 'cap',
        label: {
          en: 'International Education & University Admissions',
          bn: 'আন্তর্জাতিক শিক্ষা ও বিশ্ববিদ্যালয় ভর্তি',
        },
      },
      {
        icon: 'briefcase',
        label: {
          en: 'Global Professional Careers & Multinationals',
          bn: 'বৈশ্বিক পেশাগত ক্যারিয়ার ও মাল্টিন্যাশনাল প্রতিষ্ঠান',
        },
      },
      {
        icon: 'compass',
        label: {
          en: 'Immigration Opportunities (Express Entry Canada & France PR)',
          bn: 'ইমিগ্রেশন সুযোগ (কানাডা এক্সপ্রেস এন্ট্রি ও ফ্রান্স পিআর)',
        },
      },
      {
        icon: 'users',
        label: {
          en: 'Multicultural Environments & Global Networking',
          bn: 'বহুসাংস্কৃতিক পরিবেশ ও গ্লোবাল নেটওয়ার্কিং',
        },
      },
    ],
    footer: { en: 'Building Confident Global Communicators', bn: 'আত্মবিশ্বাসী বৈশ্বিক যোগাযোগকারী তৈরি' },
    place: { en: 'Dhaka & Global Online', bn: 'ঢাকা ও গ্লোবাল অনলাইন' },
  },
  founded: {
    label: { en: '03. Our Founding Purpose', bn: '03. আমাদের প্রতিষ্ঠার কারণ' },
    titleA: { en: 'Why We Founded ', bn: 'কেন আমরা প্রতিষ্ঠা করেছি ' },
    quote: {
      en: '“Everyone deserves the opportunity to learn French without financial or geographical barriers.”',
      bn: '“আর্থিক বা ভৌগোলিক বাধা ছাড়াই ফরাসি শেখার সুযোগ প্রত্যেকের প্রাপ্য।”',
    },
    challengeTitle: { en: 'The Challenge We Saw', bn: 'আমরা যে সমস্যা দেখেছি' },
    challenge1: {
      en: 'The journey of We Learn French BD began when we noticed that many aspiring Bengali-speaking learners were passionate about learning French—including people who had settled in Canada—but often struggled to find affordable, well-structured, and student-friendly French courses.',
      bn: 'We Learn French BD-এর যাত্রা শুরু হয় যখন আমরা লক্ষ্য করি, অনেক বাংলাভাষী শিক্ষার্থী — কানাডায় স্থায়ী হওয়া মানুষসহ — ফরাসি শিখতে আগ্রহী, কিন্তু সাশ্রয়ী, সুগঠিত ও শিক্ষার্থী-বান্ধব ফরাসি কোর্স খুঁজে পেতে তারা প্রায়ই সমস্যায় পড়েন।',
    },
    challenge2: {
      en: 'High tuition fees, limited access to experienced guidance, and a lack of practical learning resources often discouraged learners from pursuing their international goals.',
      bn: 'উচ্চ টিউশন ফি, অভিজ্ঞ দিকনির্দেশনার অভাব এবং ব্যবহারিক শিক্ষা উপকরণের ঘাটতি অনেক শিক্ষার্থীকে তাদের আন্তর্জাতিক লক্ষ্য থেকে পিছিয়ে দিত।',
    },
    solutionTitle: { en: 'Our Solution & Commitment', bn: 'আমাদের সমাধান ও প্রতিশ্রুতি' },
    solution1: {
      en: 'To address these challenges, we founded We Learn French BD with a clear purpose:',
      bn: 'এই সমস্যাগুলোর সমাধানে আমরা একটি স্পষ্ট লক্ষ্য নিয়ে We Learn French BD প্রতিষ্ঠা করি:',
    },
    callout: {
      en: 'Make quality French education accessible, engaging, and affordable for everyone.',
      bn: 'মানসম্মত ফরাসি শিক্ষাকে সবার জন্য সহজলভ্য, আকর্ষণীয় ও সাশ্রয়ী করা।',
    },
    solution2: {
      en: 'Our goal is not only to help students prepare for exams such as DELF, TCF, and TEF, but also to develop real communication skills, practical language ability, and the confidence to use French in everyday life.',
      bn: 'আমাদের লক্ষ্য শুধু DELF, TCF ও TEF-এর মতো পরীক্ষার প্রস্তুতি নয়, বরং বাস্তব যোগাযোগ দক্ষতা, ব্যবহারিক ভাষাজ্ঞান এবং দৈনন্দিন জীবনে ফরাসি ব্যবহারের আত্মবিশ্বাস তৈরি করা।',
    },
    journeyPill: { en: 'Our Journey Continues', bn: 'আমাদের যাত্রা চলছে' },
    journey: {
      en: 'Today, We Learn French BD is more than an educational platform. Our journey started with a vision, and that vision continues through the progress, dedication, and success of our students.',
      bn: 'আজ We Learn French BD শুধু একটি শিক্ষা প্ল্যাটফর্ম নয়। একটি স্বপ্ন নিয়ে আমাদের যাত্রা শুরু হয়েছিল, আর সেই স্বপ্ন এগিয়ে চলছে আমাদের শিক্ষার্থীদের অগ্রগতি, নিষ্ঠা ও সাফল্যের মধ্য দিয়ে।',
    },
    tagline: {
      en: 'Learn French. Build Confidence. Connect with the World.',
      bn: 'ফরাসি শিখুন। আত্মবিশ্বাস গড়ুন। বিশ্বের সাথে যুক্ত হন।',
    },
    ctaTitle: { en: 'Start Your French Journey', bn: 'আপনার ফরাসি যাত্রা শুরু করুন' },
    ctaText: {
      en: 'Join hundreds of successful students achieving their Canada PR, France university admissions, and career milestones.',
      bn: 'কানাডা পিআর, ফ্রান্সের বিশ্ববিদ্যালয়ে ভর্তি ও ক্যারিয়ারের লক্ষ্য অর্জনকারী শত শত সফল শিক্ষার্থীর সাথে যোগ দিন।',
    },
    ctaExplore: { en: 'Explore Courses', bn: 'কোর্সগুলো দেখুন' },
  },
};

export const law = {
  tag: { en: '2026 IMMIGRATION LAW MANDATE', bn: 'জরুরি ইমিগ্রেশন আইন ২০২৬' },
  title: {
    en: 'Strict French Residency Mandates (New Law Enforced in 2026)',
    bn: 'ফ্রান্সের নতুন রেসিডেন্সি আইন ২০২৬: ফ্রেঞ্চ সার্টিফিকেট ছাড়া পারমিট নবায়ন বন্ধ!',
  },
  deadlineLabel: { en: 'Next Prep Batch Closes:', bn: 'পরবর্তী বিশেষ ব্যাচ ভর্তি শেষ:' },
  deadline: { en: 'Only 4 Seats Left!', bn: 'আর মাত্র ৪টি সিট বাকি!' },
  body: {
    en: 'France has officially updated its immigration code. Automatic residence permit renewals without certified language proof are over. Starting in 2026, language proficiency is legally enforced by French prefectures nationwide.',
    bn: 'ফ্রান্সের নতুন ইমিগ্রেশন কোড (Code de l’entrée et du séjour des étrangers et du droit d’asile) অনুযায়ী, ২০২৬ সাল থেকে প্রিফেকচার (Prefecture) থেকে Carte de Séjour বা রেসিডেন্স পারমিট নবায়নের জন্য অফিশিয়াল ফ্রেঞ্চ ল্যাঙ্গুয়েজ সার্টিফিকেট (DELF) প্রদর্শন আইনত বাধ্যতামূলক করা হয়েছে। আগে যেভাবে পরীক্ষা ছাড়াই রিনিউ করা যেত, তা পুরোপুরি বন্ধ।',
  },
  cards: [
    {
      tag: 'DELF A2',
      color: 'gold',
      title: { en: 'Multi-Year Residence Permit', bn: 'বহুবর্ষী রেসিডেন্স পারমিট' },
      fr: 'Carte de Séjour Pluriannuelle',
      desc: {
        en: 'Mandatory DELF A2 certificate required for multi-year residency permit renewal.',
        bn: 'বহুবছরের রেসিডেন্স পারমিট রিনিউ করার জন্য ন্যূনতম DELF A2 সার্টিফিকেট বাধ্যতামূলক।',
      },
    },
    {
      tag: 'DELF B1',
      color: 'bleu',
      title: { en: '10-Year Resident Card', bn: '10 বছরের রেসিডেন্ট কার্ড' },
      fr: 'Carte de Résident (10 Ans)',
      desc: {
        en: 'DELF B1 certified proficiency required for the 10-year long-term resident card.',
        bn: '১০ বছরের দীর্ঘমেয়াদী রেসিডেন্স কার্ড বা স্থায়ী বসবাসের জন্য DELF B1 পরীক্ষা পাস আবশ্যক।',
      },
    },
    {
      tag: 'DELF B2',
      color: 'rouge',
      title: { en: 'French Naturalization', bn: 'ফরাসি নাগরিকত্ব (ন্যাচারালাইজেশন)' },
      fr: 'Nationalité Française (Citizenship)',
      desc: {
        en: 'DELF B2 mastery is mandatory for French naturalization and citizenship application.',
        bn: 'ফরাসি নাগরিকত্ব ও পাসপোর্ট আবেদনের জন্য DELF B2 লেভেলের দক্ষতা আইনগত শর্ত।',
      },
    },
  ],
  stripLead: { en: 'Do not delay your visa status!', bn: 'সময় নষ্ট করবেন না!' },
  strip: {
    en: 'Enroll in our 3-month DELF A2 fast-track course to secure your renewal.',
    bn: 'আমাদের বিশেষ ৩ মাসের DELF A2 ফাস্ট-ট্র্যাক কোর্সে আজই এনরোল করে রিস্ক মুক্ত থাকুন।',
  },
  cta: { en: 'Enroll in DELF A2 Residency Prep', bn: 'DELF A2 রেসিডেন্সি কোর্সে ভর্তি হোন' },
};

export const pathways = {
  tag: { en: 'IMMIGRATION & CAREER PATHWAYS', bn: 'ক্যারিয়ার ও ইমিগ্রেশন সুযোগ' },
  title: {
    en: 'Why Learning French is Your Best Life Decision',
    bn: 'কেন ফ্রেঞ্চ ভাষা শেখা আপনার জীবনের সেরা সিদ্ধান্ত?',
  },
  intro: {
    en: 'French is the single most powerful cheat-code for Canada PR and low-cost European higher education.',
    bn: 'কানাডা স্থায়ী বসবাস (PR) এবং ফ্রান্সে উচ্চশিক্ষার নিশ্চিত সুযোগ তৈরি করতে ফ্রেঞ্চ ভাষাই একমাত্র সবচেয়ে শক্তিশালী গেম-চেঞ্জার।',
  },
  canada: {
    ribbon: { en: 'CANADA PR SHORTCUT', bn: 'কানাডা পিআর শর্টকাট' },
    title: { en: 'Canada Express Entry PR', bn: 'কানাডা Express Entry পিআর' },
    sub: { en: 'Category-Based Selection Draws', bn: 'ক্যাটাগরি-ভিত্তিক সিলেকশন ড্র' },
    statLabel: { en: 'Max Bonus CRS Points:', bn: 'সর্বোচ্চ অতিরিক্ত CRS পয়েন্ট:' },
    stat: { en: '+62 CRS Points', bn: '+62 CRS পয়েন্ট' },
    calc: { en: 'Calculate Points', bn: 'পয়েন্ট হিসাব করুন' },
    bullets: [
      {
        en: 'Achieve Canada PR even with moderate English scores via CLB 7 in TEF/TCF.',
        bn: 'ইংরেজিতে স্কোর কম থাকলেও ফ্রেঞ্চ টেস্ট (CLB 7) দিয়ে পিআর পাওয়া সম্ভব।',
      },
      {
        en: 'Benefit from IRCC exclusive French Category draws with lower CRS score cutoffs.',
        bn: 'কানাডার বিশেষ "French-Language Proficiency Category" ড্র-তে কাটঅফ অনেক কম থাকে।',
      },
      {
        en: 'Qualify for high-paying bilingual job opportunities across all Canadian provinces.',
        bn: 'কোবেক (Quebec) প্রদেশ সহ সম্পূর্ণ কানাডাজুড়ে চাকরির আকর্ষণীয় সুযোগ।',
      },
    ],
    cta: { en: 'Explore TEF Canada Pathway', bn: 'TEF Canada কোর্স সিলেবাস দেখুন' },
  },
  france: {
    ribbon: { en: 'EUROPE STUDY & WORK', bn: 'ইউরোপে পড়াশোনা ও কাজ' },
    title: { en: 'France University & Work Visa', bn: 'ফ্রান্সে বিশ্ববিদ্যালয় ও ওয়ার্ক ভিসা' },
    sub: { en: 'Free Tuition & EU Post-Study Visa', bn: 'ফ্রি টিউশন ও ইইউ পোস্ট-স্টাডি ভিসা' },
    statLabel: { en: 'University Tuition Fees:', bn: 'টিউশন ফি খরচ:' },
    stat: { en: 'Low / Zero Fees', bn: 'নামমাত্র / শূন্য ফি' },
    chip: { en: 'EU Schengen Visa', bn: 'ইইউ শেনজেন ভিসা' },
    bullets: [
      {
        en: 'Study in top public French universities with nearly free tuition for international students.',
        bn: 'ফ্রান্সের সরকারি ইউনিভার্সিটিতে নামমাত্র ফি-তে ব্যাচেলর ও মাস্টার্স করার সুযোগ।',
      },
      {
        en: 'Get 2-year post-study work permit (APS) and unlimited travel across 27 Schengen countries.',
        bn: 'পড়াশোনা শেষে ২ বছরের APS পোস্ট-স্টাডি জব পারমিট এবং ইউরোপ ২৭ দেশে ভ্রমণের স্বাধীনতা।',
      },
      {
        en: '100% compliant with new 2026 French immigration prefectural residency mandates.',
        bn: '২০২৬ নতুন আইনি বিধিমালার অধীনে রেসিডেন্স পারমিট ও ভিসা প্রসেসিং পুরোপুরি ঝামেলামুক্ত।',
      },
    ],
    cta: { en: 'Explore DELF B2 Pathway', bn: 'DELF B2 কোর্স পাথওয়ে দেখুন' },
  },
};

export const recorded = {
  badge: { en: 'Self-Paced Recorded Courses', bn: 'সেলফ-পেসড ভিডিও কোর্স' },
  titleA: { en: 'Master ', bn: 'ঘরে বসেই শিখুন ' },
  titleB: { en: 'DELF A1 & A2', bn: 'DELF A1 ও A2' },
  titleC: { en: ' with Recorded Courses', bn: ' ফ্রেঞ্চ' },
  intro: {
    en: 'Structured HD video courses with downloadable PDF materials, easy bKash payment, mock exams, and lifetime access.',
    bn: 'চাকরিজীবী, শিক্ষার্থী এবং ফ্রান্সে বসবাসরত প্রবাসী ভাই-বোনদের জন্য সম্পূর্ণ বাংলায় রেকর্ডকৃত স্পেশাল মাস্টারক্লাস। যেকোনো সময়, যেকোনো ডিভাইস থেকে আজীবন অ্যাক্সেস।',
  },
  benefits: [
    { icon: 'clock', t: { en: 'Lifetime Access', bn: 'লাইফটাইম অ্যাক্সেস' }, s: { en: 'Learn at your pace', bn: 'যেকোনো সময় দেখুন' } },
    { icon: 'phone', t: { en: 'Easy bKash Payment', bn: 'সহজ বিকাশ পেমেন্ট' }, s: { en: 'Manual verification', bn: 'দ্রুত ভর্তি অনুমোদন' } },
    { icon: 'book', t: { en: 'PDF Notes & Mocks', bn: 'PDF নোট ও মক টেস্ট' }, s: { en: 'Downloadable', bn: 'ডাউনলোডযোগ্য শিট' } },
    { icon: 'award', t: { en: 'Official Certificate', bn: 'ভেরিফাইড সার্টিফিকেট' }, s: { en: 'Upon 100% completion', bn: 'কোর্স শেষে প্রদান' } },
  ],
  tagRecorded: { en: 'Recorded Video Course', bn: 'রেকর্ডেড ভিডিও কোর্স' },
  off: { en: 'OFF', bn: 'ছাড়' },
  preview: { en: 'Watch Free Preview', bn: 'ফ্রি প্রিভিউ দেখুন' },
  lessons: { en: 'Lessons', bn: 'লেসন' },
  checks: [
    { en: '36 Full HD Video Lectures in Bengali', bn: 'সম্পূর্ণ বাংলায় ৩৬টি ফুল এইচডি ভিডিও লেকচার' },
    { en: 'Downloadable PDF Notes & Mock Exams', bn: 'ডাউনলোডযোগ্য লেকচার শিট, হ্যান্ডনোট ও মক টেস্ট' },
    { en: 'Lifetime Access & Verified Certificate', bn: 'লাইফটাইম অ্যাক্সেস ও কোর্স সমাপনী সার্টিফিকেট' },
  ],
  fee: { en: 'One-time Fee', bn: 'এককালীন ফি' },
  syllabus: { en: 'Syllabus', bn: 'সিলেবাস' },
  enroll: { en: 'Enroll Now', bn: 'বিকাশে ভর্তি' },
  helpTitle: {
    en: 'Unsure which DELF level is right for you?',
    bn: 'কোন কোর্সটি আপনার জন্য উপযুক্ত বুঝতে পারছেন না?',
  },
  helpText: {
    en: 'Take our free CEFR placement quiz or speak with Instructor Engr. Al-Amin Hossain.',
    bn: 'আমাদের ফ্রি ফ্রেঞ্চ প্লেসমেন্ট টেস্ট দিন অথবা আমাদের ইন্সট্রাক্টরের সাথে সরাসরি কথা বলুন।',
  },
  helpCta: { en: 'Talk on WhatsApp', bn: 'হোয়াটসঅ্যাপে কথা বলুন' },
  quizCta: { en: 'Free Placement Test', bn: 'ফ্রি প্লেসমেন্ট টেস্ট' },
};

export const courses = {
  tag: { en: 'OFFICIAL COURSE PATHWAYS', bn: 'অফিশিয়াল কোর্স পাথওয়ে' },
  title: { en: 'Choose Your Target French Pathway', bn: 'আপনার ফরাসি ভাষা শিক্ষার লক্ষ্য নির্বাচন করুন' },
  intro: {
    en: 'Structured live online classes from beginner French to official DELF and Canada immigration test preparation.',
    bn: 'DELF A1 থেকে B2 সার্টিফিকেশন এবং কানাডা Express Entry-র TEF/TCF প্রস্তুতির নির্ভরযোগ্য অনলাইন প্ল্যাটফর্ম।',
  },
  filters: {
    all: { en: 'All Pathways', bn: 'সকল কোর্স' },
    delf: { en: 'DELF A1–B2 (French Levels)', bn: 'DELF A1–B2 (ফরাসি ভাষার লেভেল)' },
    canada: { en: 'TEF / TCF Canada (Immigration Prep)', bn: 'TEF / TCF Canada (ইমিগ্রেশন প্রস্তুতি)' },
  },
  popular: { en: 'MOST POPULAR', bn: 'সবচেয়ে জনপ্রিয়' },
  duration: { en: 'Duration', bn: 'মেয়াদ' },
  schedule: { en: 'Class Schedule', bn: 'ক্লাস সংখ্যা' },
  target: { en: 'Target Level', bn: 'টার্গেট লেভেল' },
  fee: { en: 'COURSE FEE', bn: 'কোর্স ফি (অফার)' },
  feeCustom: { en: 'Contact for Fee Details', bn: 'ফি জানতে যোগাযোগ করুন' },
  save: { en: 'SAVE', bn: 'সাশ্রয়' },
  outcome: { en: 'Outcome', bn: 'লক্ষ্য ও অর্জন' },
  enroll: { en: 'Enroll in Pathway', bn: 'ভর্তি হোন' },
  details: { en: 'View Full Details', bn: 'বিস্তারিত সিলেবাস দেখুন' },
  compare: { en: 'Compare', bn: 'তুলনা' },
  compareN: { en: 'Compare courses', bn: 'কোর্স তুলনা করুন' },
  clear: { en: 'Clear', bn: 'মুছুন' },
  comboTag: { en: 'SPECIAL COMBO PACKAGES', bn: 'স্পেশাল কম্বো অফার' },
  comboTagSub: { en: '(Official Discount Bundle)', bn: '(অফিশিয়াল ডিসকাউন্ট বান্ডেল)' },
  comboTitle: { en: 'Combined Learning Packages', bn: 'ধারাবাহিক শিক্ষার কম্বো প্যাকেজ' },
  eligibilityLabel: { en: 'Eligibility Condition:', bn: 'যোগ্যতার শর্ত:' },
  eligibility: {
    en: 'Available exclusively for existing and regular students.',
    bn: 'পূর্বের ও নিয়মিত শিক্ষার্থীদের জন্য প্রযোজ্য',
  },
  included: { en: 'Included Pathways:', bn: 'অন্তর্ভুক্ত কোর্স:' },
  combinedFee: { en: 'Combined Offer Fee:', bn: 'কম্বো অফার ফি:' },
  regularValue: { en: 'Regular Value:', bn: 'নিয়মিত মূল্য:' },
  comboCta: { en: 'Enroll in Combo', bn: 'কম্বো কোর্সে ভর্তি হোন' },
};

export const schedule = {
  tag: { en: 'CONVENIENT CLASS TIMINGS', bn: 'সুবিধাজনক ক্লাস সময়সূচী' },
  title: {
    en: 'Flexible Live Batches (BST Evening Schedule)',
    bn: 'চাকরি ও পড়াশোনার পাশাপাশি সুবিধাজনক লাইভ ক্লাস',
  },
  intro: {
    en: 'Live online classes, 2–3 classes per week depending on the course. Choose Friday & Sunday or Saturday & Monday, in the early or late evening (BST).',
    bn: 'লাইভ অনলাইন ক্লাস, কোর্সভেদে সপ্তাহে ২–৩টি ক্লাস। বাংলাদেশ সময় অনুযায়ী শুক্র ও রবিবার অথবা শনি ও সোমবার — সন্ধ্যা বা রাতের ব্যাচ বেছে নিন।',
  },
  formatTitle: { en: 'Learning Format', bn: 'শিক্ষার ধরন' },
  format: {
    en: 'Live Online Classes, 2–3 classes per week, depending on the course.',
    bn: 'লাইভ অনলাইন ক্লাস, কোর্সভেদে সপ্তাহে ২–৩টি ক্লাস।',
  },
  days: {
    fri: { en: 'Fri', bn: 'শুক্র' },
    sat: { en: 'Sat', bn: 'শনি' },
    sun: { en: 'Sun', bn: 'রবি' },
    mon: { en: 'Mon', bn: 'সোম' },
  },
  slots: [
    { id: '7pm', label: { en: '7–9 PM', bn: 'সন্ধ্যা ৭–৯টা' } },
    { id: '9pm', label: { en: '9–11 PM', bn: 'রাত ৯–১১টা' } },
  ],
  bst: { en: 'BST', bn: 'সময়' },
  perWeek: { en: '2 Classes / Week', bn: 'সপ্তাহে ২টি ক্লাস' },
  book: { en: 'Book Seat in This Batch', bn: 'এই ব্যাচে সীট বুক করুন' },
  bookAny: { en: 'Book your seat', bn: 'আপনার সীট বুক করুন' },
  seats: { en: 'Seats Remaining:', bn: 'আসন সংখ্যা বুকিং অবস্থা:' },
  skillsTitle: { en: 'What every class covers', bn: 'প্রতিটি ক্লাসে যা থাকে' },
  skills: [
    { icon: 'mic', label: { en: 'Speaking & Pronunciation', bn: 'স্পিকিং ও উচ্চারণ' } },
    { icon: 'book', label: { en: 'Grammar & Vocabulary', bn: 'গ্রামার ও ভোকাবুলারি' } },
    { icon: 'headphones', label: { en: 'Listening & Writing', bn: 'লিসেনিং ও রাইটিং' } },
    { icon: 'clipboard', label: { en: 'DELF Exam Preparation', bn: 'DELF পরীক্ষার প্রস্তুতি' } },
    { icon: 'maple', label: { en: 'TEF & TCF Preparation', bn: 'TEF ও TCF প্রস্তুতি' } },
    {
      icon: 'plane',
      label: {
        en: 'Canada, France Immigration Language Preparation',
        bn: 'কানাডা ও ফ্রান্স ইমিগ্রেশন ভাষা প্রস্তুতি',
      },
    },
  ],
  customTitle: { en: 'Need a Custom Time Slot?', bn: 'কাস্টম সময়সূচী প্রয়োজন?' },
  custom: {
    en: 'Custom one-on-one and private group schedules are available upon request. Contact us at 01758599797.',
    bn: 'চাকরিজীবী বা বিশেষ ব্যাকগ্রাউন্ডের শিক্ষার্থীদের জন্য রিকোয়েস্টে আলাদা ব্যাচ আয়োজন করা হয়। সরাসরি যোগাযোগ করুন 01758599797 নম্বরে।',
  },
};

export const roadmap = {
  tag: { en: 'STEP-BY-STEP ROADMAP', bn: 'সফলতার রোডম্যাপ' },
  title: {
    en: 'From Zero to Canada PR & France Visa in 4 Steps',
    bn: 'জিরো থেকে কানাডা পিআর ও ফ্রান্স ভিসার সহজ ৪ ধাপ',
  },
  intro: {
    en: 'Our structured curriculum guides you systematically from absolute beginner to exam success.',
    bn: 'আমাদের সুগঠিত কারিকুলাম আপনাকে একদম শুরু থেকে পরীক্ষায় সাফল্য পর্যন্ত ধাপে ধাপে নিয়ে যায়।',
  },
  steps: [
    {
      n: '01',
      badge: { en: 'Zero to A1', bn: 'শূন্য থেকে A1' },
      icon: 'target',
      color: 'bleu',
      title: { en: 'Step 1: Foundation (DELF A1)', bn: 'লেভেল ১: ফাউন্ডেশন (A1)' },
      duration: { en: '3 Months', bn: '৩ মাস' },
      desc: {
        en: 'Master basic sentence formation, phonetics, self-introduction and everyday conversation.',
        bn: 'শূন্য থেকে প্রাথমিক বাক্য গঠন, সঠিক উচ্চারণ ও সামাজিক কথা বলার আত্মবিশ্বাস।',
      },
      code: 'DAC',
    },
    {
      n: '02',
      badge: { en: '2026 Mandate', bn: '২০২৬ আইনি শর্ত' },
      icon: 'message',
      color: 'gold',
      title: { en: 'Step 2: Residency Level (DELF A2)', bn: 'লেভেল ২: এসেনশিয়ালস (A2)' },
      duration: { en: '3 Months', bn: '৩ মাস' },
      desc: {
        en: 'Compliant with strict 2026 French immigration laws for multi-year residence permits.',
        bn: '২০২৬ ফ্রেঞ্চ আইন মেনে রেসিডেন্স পারমিট (Carte de Séjour) নবায়নের প্রয়োজনীয় এ২ দক্ষতা।',
      },
      code: 'A2',
    },
    {
      n: '03',
      badge: { en: 'High Distinction', bn: 'উচ্চতর দক্ষতা' },
      icon: 'award',
      color: 'rouge',
      title: { en: 'Step 3: Exam Mastery (B1/B2/TEF)', bn: 'লেভেল ৩: এক্সাম স্পেশালাইজেশন (B1/B2/TEF)' },
      duration: { en: '6 Months', bn: '৬ মাস' },
      desc: {
        en: 'Target TEF Canada CLB 7 for +62 CRS points or DELF B1/B2 for university & citizenship.',
        bn: 'কানাডা পিআর (TEF CLB 7) অথবা ফ্রান্সের ১০ বছরের রেসিডেন্স কার্ড ও ইউনিভারসিটি অ্যাডমিশন।',
      },
      code: 'B2',
    },
    {
      n: '04',
      badge: { en: 'Goal Achieved', bn: 'লক্ষ্য অর্জিত' },
      icon: 'plane',
      color: 'mint',
      title: { en: 'Step 4: Visa & Canada PR Granted', bn: 'লেভেল ৪: ভিসা ও পিআর প্রাপ্তি' },
      duration: { en: 'Goal Achieved!', bn: 'লক্ষ্য অর্জিত!' },
      desc: {
        en: 'Pass Alliance Française exam, receive CoPR or French University visa with full support.',
        bn: 'অফিশিয়াল এক্সাম পাসের পর কানাডা এক্সপ্রেস এন্ট্রি ড্র অথবা ফ্রান্স ভিসা কমপ্লিশন।',
      },
      code: 'YYZ',
    },
  ],
  verified: { en: 'Verified Curriculum', bn: 'ভেরিফাইড কারিকুলাম' },
  cta: { en: 'Start Your Step 1 Today', bn: 'আজই আপনার ধাপ ১ শুরু করুন' },
};

export const testimonials = {
  badge: { en: "Students' Voice", bn: 'শিক্ষার্থীদের কণ্ঠ' },
  title: { en: "Students' Voice", bn: "শিক্ষার্থীদের মতামত" },
  intro: {
    en: 'Real experiences from learners who are building their French journey with We Learn French BD.',
    bn: 'We Learn French BD-এর সাথে ভাষা শেখার যাত্রা শুরু করা শিক্ষার্থীদের বাস্তব অভিজ্ঞতা।',
  },
  filters: {
    all: { en: 'All Reviews', bn: 'সকল অভিজ্ঞতা' },
    Canada: { en: 'Canada Pathway', bn: 'কানাডা পাথওয়ে' },
    France: { en: 'France Pathway', bn: 'ফ্রান্স পাথওয়ে' },
    General: { en: 'General & NGO', bn: 'সাধারণ ও এনজিও' },
  },
  empty: { en: 'No reviews found for this category.', bn: 'এই বিভাগে কোনো রিভিউ পাওয়া যায়নি।' },
  prev: { en: 'Previous Review', bn: 'আগের রিভিউ' },
  next: { en: 'Next Review', bn: 'পরের রিভিউ' },
  readFull: { en: 'Read full review', bn: 'পুরো রিভিউ পড়ুন' },
  close: { en: 'Close', bn: 'বন্ধ করুন' },
  /** Star rating label; {n} is replaced with the rating. */
  rating: { en: '{n} out of 5', bn: '৫-এর মধ্যে {n}' },
};

export const instructor = {
  tag: { en: 'CERTIFIED INSTRUCTOR', bn: 'অভিজ্ঞ মেন্টর' },
  title: {
    en: 'Learn from Alliance Française Certified Instructor',
    bn: 'আমাদের আন্তর্জাতিক ডিগ্রিধারী শিক্ষক',
  },
  intro: {
    en: 'Our Alliance Française certified instructor combines deep French expertise with clear Bangla explanations.',
    bn: 'আমাদের ট্রেইন্ড শিক্ষক প্রতিটি ক্লাস সাবলীল বাংলায় পরিচালনা করেন যাতে শেখা হয় সহজ ও দ্রুত।',
  },
  name: { en: 'Engr. Al-Amin Hossain', bn: 'ইঞ্জি. আল-আমিন হোসেন' },
  role: {
    en: 'French Instructor, Interpreter & TCF expert',
    bn: 'ফরাসি ভাষার শিক্ষক, ইন্টারপ্রেটার ও TCF বিশেষজ্ঞ',
  },
  creds: {
    en: 'DELF A1–B2 Certified | Alliance Française Trained',
    bn: 'DELF A1–B2 সার্টিফাইড | Alliance Française প্রশিক্ষিত',
  },
  experience: { en: '3+ Years Teaching Experience', bn: '3+ বছরের শিক্ষকতার অভিজ্ঞতা' },
  expert: { en: 'DELF, TCF & TEF Expert', bn: 'DELF, TCF ও TEF বিশেষজ্ঞ' },
  bio: {
    en: 'Specialist in making French simple, practical, and exam-oriented—helping learners build strong foundations to achieve their language goals with confidence. (DELF, TCF & TEF Preparation)',
    bn: 'ফরাসি ভাষাকে সহজ, ব্যবহারিক ও পরীক্ষামুখী করে শেখানোয় বিশেষজ্ঞ — যাতে শিক্ষার্থীরা মজবুত ভিত্তি গড়ে আত্মবিশ্বাসের সাথে নিজেদের ভাষার লক্ষ্যে পৌঁছাতে পারেন। (DELF, TCF ও TEF প্রস্তুতি)',
  },
  verified: { en: 'Verified', bn: 'ভেরিফাইড' },
};

export const faq = {
  tag: { en: 'FREQUENTLY ASKED QUESTIONS', bn: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' },
  title: { en: 'Got Questions? We Have Answers', bn: 'আপনার সকল প্রশ্নের সহজ উত্তর' },
  intro: {
    en: 'Find clear answers about course duration, class recordings, payment plans, and exams.',
    bn: 'কোর্স, ক্লাস সময়সূচী, ফি এবং ২০২৬ ইমিগ্রেশন আইন সম্পর্কিত যেকোনো প্রশ্নের স্পষ্ট উত্তর নিচে দেখুন।',
  },
  search: {
    en: 'Search questions... (e.g. 2026 law, installments, recordings)',
    bn: 'প্রশ্ন খুঁজুন... (যেমন: ২০২৬ আইন, কিস্তি, মিসড ক্লাস)',
  },
  categories: ['All', 'General', 'Immigration', 'Classes', 'Payment', 'Exams'] as const,
  /** Display labels for the category keys above (keys are also the FAQ data's category values). */
  categoryLabels: {
    All: { en: 'All', bn: 'সব' },
    General: { en: 'General', bn: 'সাধারণ' },
    Immigration: { en: 'Immigration', bn: 'ইমিগ্রেশন' },
    Classes: { en: 'Classes', bn: 'ক্লাস' },
    Payment: { en: 'Payment', bn: 'পেমেন্ট' },
    Exams: { en: 'Exams', bn: 'পরীক্ষা' },
  } satisfies Record<'All' | 'General' | 'Immigration' | 'Classes' | 'Payment' | 'Exams', L>,
  none: { en: 'No questions match your search.', bn: 'আপনার খোঁজার সাথে কোনো প্রশ্ন মেলেনি।' },
  customTitle: { en: 'Have a custom question not listed here?', bn: 'আপনার অন্য কোনো প্রশ্ন আছে?' },
  customCta: {
    en: 'Chat on WhatsApp (01758599797)',
    bn: 'হোয়াটসঅ্যাপে সরাসরি কথা বলুন (01758599797)',
  },
};

export const footer = {
  description: {
    en: 'We Learn French BD is an online French-learning platform offering learning resources and courses for DELF A1–B2, TEF Canada, TCF Canada, grammar, vocabulary, and French speaking practice.',
    bn: 'We Learn French BD - স্বল্প খরচে, সহজে ফরাসি শেখার প্লাটফর্ম। DELF A1–B2 এবং TEF/TCF Canada পরীক্ষার প্রস্তুতিতে বাংলাভাষী শিক্ষার্থীদের নির্ভরযোগ্য অনলাইন শিক্ষা প্লাটফর্ম।',
  },
  pathways: { en: 'Pathways', bn: 'কোর্স পাথওয়ে' },
  pathwayLinks: [
    { label: { en: 'DELF A1 Beginner', bn: 'DELF A1 বিগিনার' }, id: 'delf-a1' },
    { label: { en: 'DELF A2 Elementary', bn: 'DELF A2 এলিমেন্টারি' }, id: 'delf-a2' },
    { label: { en: 'DELF B1 Intermediate', bn: 'DELF B1 ইন্টারমিডিয়েট' }, id: 'delf-b1' },
    { label: { en: 'DELF B2 Advanced', bn: 'DELF B2 অ্যাডভান্সড' }, id: 'delf-b2' },
    { label: { en: 'TEF Canada (+62 CRS)', bn: 'TEF Canada (+62 CRS)' }, id: 'tef-canada' },
    { label: { en: 'TCF Canada Prep', bn: 'TCF Canada প্রস্তুতি' }, id: 'tcf-canada' },
  ],
  aboutTitle: { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
  contactTitle: { en: 'Contact Us', bn: 'যোগাযোগ অফিশিয়াল' },
  bkash: { en: 'bKash Personal (payments)', bn: 'বিকাশ পার্সোনাল (পেমেন্ট)' },
  rights: { en: 'We Learn French BD. All Rights Reserved.', bn: 'We Learn French BD. সর্বস্বত্ব সংরক্ষিত।' },
  ctaTitle: { en: 'Your French journey starts here.', bn: 'আপনার ফরাসি যাত্রা এখান থেকেই শুরু।' },
  ctaSub: {
    en: 'Your French Journey, Our Commitment.',
    bn: 'আপনার ফরাসি যাত্রা, আমাদের প্রতিশ্রুতি।',
  },
};

export const ui = {
  enroll: { en: 'Enroll Now', bn: 'ভর্তি হোন' } as L,
  login: { en: 'Login', bn: 'লগইন' } as L,
  free: { en: 'FREE', bn: 'ফ্রি' } as L,
  search: { en: 'Search', bn: 'খুঁজুন' } as L,
  backToTop: { en: 'Back to top', bn: 'উপরে যান' } as L,
  whatsapp: { en: 'WhatsApp', bn: 'হোয়াটসঅ্যাপ' } as L,
  freeQuiz: { en: 'Free Quiz', bn: 'ফ্রি কুইজ' } as L,
  // Chrome / accessibility labels shared by the layout components
  homepage: { en: 'We Learn French BD Homepage', bn: 'We Learn French BD হোমপেজ' } as L,
  logoAlt: { en: 'We Learn French BD official logo', bn: 'We Learn French BD অফিশিয়াল লোগো' } as L,
  mainNav: { en: 'Main', bn: 'প্রধান মেনু' } as L,
  menu: { en: 'Menu', bn: 'মেনু' } as L,
  admin: { en: 'Admin', bn: 'অ্যাডমিন' } as L,
  recorded: { en: 'Recorded', bn: 'রেকর্ডেড' } as L,
  searchSite: { en: 'Search the site', bn: 'সাইটে খুঁজুন' } as L,
  call: { en: 'Call', bn: 'কল করুন' } as L,
  chatWhatsapp: { en: 'Chat on WhatsApp', bn: 'হোয়াটসঅ্যাপে চ্যাট করুন' } as L,
  quickActions: { en: 'Quick actions', bn: 'দ্রুত অ্যাকশন' } as L,
  breadcrumb: { en: 'Breadcrumb', bn: 'ব্রেডক্রাম্ব' } as L,
  pageSections: { en: 'Page sections', bn: 'পেজের সেকশনসমূহ' } as L,
  language: { en: 'Language', bn: 'ভাষা' } as L,
  profile: { en: 'Profile', bn: 'প্রোফাইল' } as L,
  accountMenu: { en: 'Account menu', bn: 'অ্যাকাউন্ট মেনু' } as L,
  toLight: { en: 'Switch to light theme', bn: 'লাইট থিমে যান' } as L,
  toDark: { en: 'Switch to dark theme', bn: 'ডার্ক থিমে যান' } as L,
  skip: { en: 'Skip to content', bn: 'মূল কন্টেন্টে যান' } as L,
  close: { en: 'Close', bn: 'বন্ধ করুন' } as L,
};
