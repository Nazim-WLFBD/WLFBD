'use client';

import { ArrowUpRight, Globe, Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { Logo } from '@/components/ui/Logo';
import { btn } from '@/components/ui/Button';
import { BRAND_CONTACT, BRAND_SOCIAL_LINKS, BRAND_TAGLINE_BANGLA, waLink, waMessage } from '@/lib/brand';
import { footer, ui } from '@/content/home';
import { WhatsAppGlyph } from './FloatingActions';
import { Flag } from '@/components/ui/Flag';

const ABOUT_LINKS = [
  { href: { pathname: '/', hash: 'about' }, l: { en: 'Our Mission & Vision', bn: 'আমাদের মিশন ও ভিশন' } },
  { href: { pathname: '/', hash: 'why-founded' }, l: { en: 'Why We Founded We Learn French BD', bn: 'প্রতিষ্ঠার গল্প' } },
  { href: { pathname: '/', hash: 'urgency-law' }, l: { en: '2026 French Residency Law', bn: '২০২৬ ফ্রেঞ্চ রেসিডেন্সি আইন' } },
  { href: '/crs-calculator', l: { en: 'Canada CRS Calculator', bn: 'কানাডা CRS ক্যালকুলেটর' } },
  { href: { pathname: '/', hash: 'schedule' }, l: { en: 'Class Schedule', bn: 'ক্লাস সময়সূচী' } },
  { href: { pathname: '/', hash: 'faq' }, l: { en: 'Exam FAQs', bn: 'পরীক্ষা সংক্রান্ত প্রশ্নোত্তর' } },
] as const;

const SOCIALS = [
  { href: BRAND_SOCIAL_LINKS.facebook, label: 'Facebook', path: 'M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z' },
  { href: BRAND_SOCIAL_LINKS.youtube, label: 'YouTube', path: 'M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12a31 31 0 0 0 .4 4.5 3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.5 31 31 0 0 0-.4-4.5ZM9.8 15V9l5.2 3-5.2 3Z' },
  { href: BRAND_SOCIAL_LINKS.instagram, label: 'Instagram', path: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2.2c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.7 1.4-4 4.1-4.1 1-.1 1.3-.1 4-.1Z' },
  { href: BRAND_SOCIAL_LINKS.linkedin, label: 'LinkedIn', path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z' },
];

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-ink pb-28 text-white lg:pb-0">
      <span className="tricolor absolute inset-x-0 top-0 h-1" />

      {/* Closing CTA */}
      <div className="container-x relative pt-20 pb-16">
        <div className="dots pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,#000,transparent_70%)]" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-bangla mb-4 text-gold">{BRAND_TAGLINE_BANGLA}</p>
            <h2 className="font-display max-w-2xl text-[clamp(2.2rem,5.5vw,4.4rem)] leading-[1] font-semibold text-balance">
              {t(footer.ctaTitle)}
            </h2>
            <p className="font-display mt-4 text-xl text-white/60 italic">{t(footer.ctaSub)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/enroll" className={btn('rouge', 'lg')}>
              {t(ui.enroll)} <ArrowUpRight size={17} />
            </Link>
            <a href={waLink(waMessage('enroll', t.locale))} target="_blank" rel="noopener" className={btn('ghost-light', 'lg')}>
              <WhatsAppGlyph size={18} /> {BRAND_CONTACT.whatsapp}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" aria-label={t(ui.homepage)}>
            <Logo size={52} light />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{t(footer.description)}</p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/7 text-white/80 transition hover:bg-gold hover:text-ink"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <FooterCol title={t(footer.pathways)}>
          {footer.pathwayLinks.map((p) => (
            <Link key={p.id} href={`/courses/${p.id}`} className="footer-link">
              {t(p.label)}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title={t(footer.aboutTitle)}>
          {ABOUT_LINKS.map((a) => (
            <Link key={a.l.en} href={a.href} className="footer-link">
              {t(a.l)}
            </Link>
          ))}
        </FooterCol>

        <FooterCol title={t(footer.contactTitle)} className="col-span-2 lg:col-span-1">
          <a href={`tel:${BRAND_CONTACT.phone}`} className="footer-link flex items-center gap-2.5">
            <Phone size={15} className="text-gold" /> {BRAND_CONTACT.phone}
          </a>
          <a href={BRAND_CONTACT.whatsappUrl} target="_blank" rel="noopener" className="footer-link flex items-center gap-2.5">
            <span className="text-[#25d366]">
              <WhatsAppGlyph size={15} />
            </span>
            {t(ui.whatsapp)}: {BRAND_CONTACT.whatsapp}
          </a>
          <a href={`tel:${BRAND_CONTACT.bkashPersonal}`} className="footer-link flex items-center gap-2.5">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-bkash text-[8px] font-black">bK</span>
            {t(footer.bkash)}: {BRAND_CONTACT.bkashPersonal}
          </a>
          <a href={`mailto:${BRAND_CONTACT.email}`} className="footer-link flex items-center gap-2.5">
            <Mail size={15} className="text-gold" /> {BRAND_CONTACT.email}
          </a>
          <a href={BRAND_CONTACT.website} className="footer-link flex items-center gap-2.5">
            <Globe size={15} className="text-gold" /> {BRAND_CONTACT.displayWebsite}
          </a>
        </FooterCol>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row">
        <p>
          © {year} {t(footer.rights)}
        </p>
        <p className="font-bangla flex items-center gap-2">
          <Flag country="fr" /> {BRAND_TAGLINE_BANGLA}
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-5 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">{title}</h3>
      <div className="flex flex-col gap-1 text-sm [&_.footer-link]:py-1.5 [&_.footer-link]:text-white/65 [&_.footer-link]:transition [&_.footer-link:hover]:text-white">
        {children}
      </div>
    </div>
  );
}
