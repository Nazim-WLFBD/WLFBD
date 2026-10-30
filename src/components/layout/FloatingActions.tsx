'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Phone } from 'lucide-react';
import { useT } from '@/i18n/t';
import { BRAND_CONTACT, WA_MESSAGES, waLink } from '@/lib/brand';
import { ui } from '@/content/home';

export function WhatsAppGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.3-.7a11 11 0 0 1-4.4-3.9c-.3-.5-1.1-1.6-1.1-3s.7-2.1 1-2.4a1 1 0 0 1 .8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.5.5c-.1.2-.3.3-.1.6a8 8 0 0 0 3.8 3.3c.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3s0 .6-.1 1.1Z" />
    </svg>
  );
}

/** WhatsApp + call buttons, and a back-to-top button once the hero is passed. */
export function FloatingActions() {
  const t = useT();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-3 bottom-[84px] z-40 flex flex-col items-end gap-3 lg:right-6 lg:bottom-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-ink/90 text-white shadow-lg ring-1 ring-white/10 backdrop-blur lg:h-11 lg:w-11 lg:bg-ink"
            aria-label={t(ui.backToTop)}
            title={t(ui.backToTop)}
          >
            <span className="tricolor absolute inset-x-0 top-0 h-[3px]" />
            <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Call + WhatsApp float on desktop only; phones get them in the bottom bar */}
      <a
        href={`tel:${BRAND_CONTACT.phone}`}
        className="group hidden h-12 items-center lg:flex gap-0 overflow-hidden rounded-full bg-ink pr-0 pl-3.5 text-gold shadow-lg ring-1 ring-white/10 transition-all hover:gap-2 hover:pr-4"
        title={`Call ${BRAND_CONTACT.phone}`}
        aria-label={`Call ${BRAND_CONTACT.phone}`}
      >
        <Phone size={19} />
        <span className="max-w-0 overflow-hidden text-sm font-bold whitespace-nowrap text-white transition-all group-hover:max-w-40">
          {BRAND_CONTACT.phone}
        </span>
        <span className="w-3.5 group-hover:w-0" />
      </a>
      <a
        href={waLink(WA_MESSAGES.enroll)}
        target="_blank"
        rel="noopener"
        className="relative hidden h-14 w-14 items-center justify-center rounded-full bg-[#25d366] lg:flex text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,.8)] transition hover:scale-105"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25d366]" />
        <WhatsAppGlyph />
      </a>
    </div>
  );
}
