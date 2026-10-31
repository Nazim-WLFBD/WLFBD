/**
 * Official brand identity and contact details for We Learn French BD.
 * Official Bangla tagline: “স্বল্প খরচে, সহজে ফরাসি শেখার প্লাটফর্ম”
 */

export const BRAND_NAME = 'We Learn French BD';
export const BRAND_NAME_SHORT = 'WLF BD';
export const BRAND_NAME_BANGLA = 'উই লার্ন ফ্রেঞ্চ বিডি';

export const BRAND_TAGLINE_BANGLA = 'স্বল্প খরচে, সহজে ফরাসি শেখার প্লাটফর্ম';
export const BRAND_TAGLINE_EN = 'Affordable & Accessible French Language Learning Platform';

export const BRAND_CONTACT = {
  phone: '01758599797',
  phoneIntl: '+8801758599797',
  whatsapp: '01758599797',
  whatsappWaMe: '8801758599797',
  whatsappUrl: 'https://wa.me/8801758599797',
  email: 'welearnfrenchbd@gmail.com',
  website: 'https://welearnfrenchbd.com',
  displayWebsite: 'www.welearnfrenchbd.com',
  // Payment-only number (bKash / Nagad personal). Not used for WhatsApp support.
  bkashPersonal: '01872981277',
  address: 'Dhaka, Bangladesh',
};

export const BRAND_SOCIAL_LINKS = {
  facebook: 'https://web.facebook.com/WeLearnFrenchBD',
  youtube: 'https://www.youtube.com/@welearnfrenchbd',
  instagram: 'https://www.instagram.com/welearnfrenchbd',
  linkedin: 'https://www.linkedin.com/company/we-learn-french-bd',
  x: 'https://x.com/welearnfrenchbd',
  messenger: 'https://m.me/WeLearnFrenchBD',
};

export const BRAND_META = {
  defaultTitle: 'We Learn French BD | Online French Language Learning',
  defaultDescription:
    'We Learn French BD is an online French-learning platform offering learning resources and courses for DELF A1–B2, TEF Canada, TCF Canada, grammar, vocabulary, and French speaking practice.',
  keywords:
    'We Learn French BD, French language course Bangladesh, TEF Canada Bangladesh, TCF Canada preparation Dhaka, DELF A1 A2 B1 B2 course, Canada Express Entry French bonus, French speaking online',
  canonical: 'https://welearnfrenchbd.com',
};

/** Bangla variants of the SEO meta; `canonical` is shared. Pick with `brandMeta(locale)`. */
export const BRAND_META_BN = {
  defaultTitle: 'We Learn French BD | অনলাইনে ফরাসি ভাষা শিক্ষা',
  defaultDescription:
    'We Learn French BD একটি অনলাইন ফরাসি ভাষা শেখার প্ল্যাটফর্ম — DELF A1–B2, TEF Canada, TCF Canada, গ্রামার, ভোকাবুলারি ও ফরাসি স্পিকিং চর্চার জন্য কোর্স ও শিক্ষা উপকরণ।',
  keywords:
    'We Learn French BD, ফরাসি ভাষা কোর্স বাংলাদেশ, ফ্রেঞ্চ শেখা, TEF Canada বাংলাদেশ, TCF Canada প্রস্তুতি ঢাকা, DELF A1 A2 B1 B2 কোর্স, কানাডা Express Entry ফ্রেঞ্চ বোনাস, অনলাইন ফরাসি স্পিকিং',
  canonical: BRAND_META.canonical,
};

/** Locale-aware meta: Bangla copy for 'bn', the English default otherwise. */
export function brandMeta(locale: string): typeof BRAND_META {
  return locale === 'bn' ? BRAND_META_BN : BRAND_META;
}

export const FACEBOOK_PIXEL_ID = '1397005205522598';

export const WA_MESSAGES = {
  enroll: 'Bonjour! I want to enroll in We Learn French BD course.',
  question: 'Bonjour! I have a question about We Learn French BD.',
};

/** Bangla versions of WA_MESSAGES (same keys). */
export const WA_MESSAGES_BN: Record<keyof typeof WA_MESSAGES, string> = {
  enroll: 'Bonjour! আমি We Learn French BD-এর কোর্সে ভর্তি হতে চাই।',
  question: 'Bonjour! We Learn French BD সম্পর্কে আমার একটি প্রশ্ন আছে।',
};

/** Pre-filled WhatsApp text in the visitor's language. */
export function waMessage(key: keyof typeof WA_MESSAGES, locale: string) {
  return locale === 'bn' ? WA_MESSAGES_BN[key] : WA_MESSAGES[key];
}

export function waLink(text?: string) {
  return text
    ? `${BRAND_CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`
    : BRAND_CONTACT.whatsappUrl;
}
