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
};

export const BRAND_META = {
  defaultTitle: 'We Learn French BD | Online French Language Learning',
  defaultDescription:
    'We Learn French BD is an online French-learning platform offering learning resources and courses for DELF A1–B2, TEF Canada, TCF Canada, grammar, vocabulary, and French speaking practice.',
  keywords:
    'We Learn French BD, French language course Bangladesh, TEF Canada Bangladesh, TCF Canada preparation Dhaka, DELF A1 A2 B1 B2 course, Canada Express Entry French bonus, French speaking online',
  canonical: 'https://welearnfrenchbd.com',
};

export const FACEBOOK_PIXEL_ID = '1397005205522598';

export const WA_MESSAGES = {
  enroll: 'Bonjour! I want to enroll in We Learn French BD course.',
  question: 'Bonjour! I have a question about We Learn French BD.',
};

export function waLink(text?: string) {
  return text
    ? `${BRAND_CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`
    : BRAND_CONTACT.whatsappUrl;
}
