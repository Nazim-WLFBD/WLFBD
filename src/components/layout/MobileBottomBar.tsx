'use client';

import { GraduationCap, Phone, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { BRAND_CONTACT, waLink, waMessage } from '@/lib/brand';
import { ui } from '@/content/home';
import { WhatsAppGlyph } from './FloatingActions';

const item = 'flex flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[11px] font-bold';

/** Phone-only action bar: WhatsApp, Call, Free Quiz, Enroll. */
export function MobileBottomBar() {
  const t = useT();
  return (
    <nav
      aria-label={t(ui.quickActions)}
      className="glass-paper fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] lg:hidden"
    >
      <a href={waLink(waMessage('enroll', t.locale))} target="_blank" rel="noopener" className={`${item} text-[#16a34a]`}>
        <WhatsAppGlyph size={20} />
        {t(ui.whatsapp)}
      </a>
      <a href={`tel:${BRAND_CONTACT.phone}`} className={`${item} text-fg`}>
        <Phone size={19} />
        {t({ en: 'Call', bn: 'কল' })}
      </a>
      <Link href="/quiz/placement-test" className={`${item} bg-ink text-white`}>
        <Sparkles size={20} className="text-gold" />
        {t(ui.freeQuiz)}
      </Link>
      <Link href="/enroll" className={`${item} text-rouge`}>
        <GraduationCap size={20} />
        {t(ui.enroll)}
      </Link>
    </nav>
  );
}
