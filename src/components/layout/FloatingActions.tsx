'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUp, GraduationCap, Headset, Phone, X } from 'lucide-react';
import { useT } from '@/i18n/t';
import { BRAND_CONTACT, BRAND_SOCIAL_LINKS, waLink, waMessage } from '@/lib/brand';
import { ui } from '@/content/home';
import { FreeClassForm } from '@/components/freeclass/FreeClassForm';
import { cn } from '@/lib/utils';

export function WhatsAppGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.3-.7a11 11 0 0 1-4.4-3.9c-.3-.5-1.1-1.6-1.1-3s.7-2.1 1-2.4a1 1 0 0 1 .8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.5.5c-.1.2-.3.3-.1.6a8 8 0 0 0 3.8 3.3c.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3s0 .6-.1 1.1Z" />
    </svg>
  );
}

export function MessengerGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.4 3.1 7.2.2.1.3.4.3.6l.1 1.8c0 .6.6 1 1.2.7l2-.9c.2-.1.4-.1.6 0 .9.3 1.8.4 2.7.4 5.6 0 10-4.1 10-9.7S17.6 2 12 2Zm6 7.5-2.9 4.6c-.5.7-1.5.9-2.2.4l-2.3-1.7a.6.6 0 0 0-.7 0l-3.1 2.4c-.4.3-1-.2-.7-.6L9 10c.5-.7 1.5-.9 2.2-.4l2.3 1.7c.2.2.5.2.7 0l3.1-2.4c.4-.3 1 .2.7.6Z" />
    </svg>
  );
}

const COPY = {
  support: { en: 'Contact support', bn: 'সাপোর্টে যোগাযোগ' },
  title: { en: 'How can we help?', bn: 'কীভাবে সাহায্য করতে পারি?' },
  call: { en: 'Call us', bn: 'কল করুন' },
  whatsapp: { en: 'Chat on WhatsApp', bn: 'WhatsApp-এ চ্যাট করুন' },
  close: { en: 'Close', bn: 'বন্ধ করুন' },
  freeClass: { en: 'Book a free class', bn: 'ফ্রি ক্লাস বুক করুন' },
  freeClassSub: { en: 'Register in under a minute — we’ll send the class link on WhatsApp.', bn: 'এক মিনিটেই রেজিস্টার করুন — ক্লাসের লিংক WhatsApp-এ পাঠাব।' },
  messenger: { en: 'Message us on Messenger', bn: 'Messenger-এ মেসেজ দিন' },
};

/**
 * One floating support button. Desktop: opens Call / WhatsApp options.
 * Phones: opens a sheet with the free class registration form (plus Messenger).
 */
export function FloatingActions() {
  const t = useT();
  const [showTop, setShowTop] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Other parts of the page (e.g. the phone bottom bar) can open the free class sheet
  useEffect(() => {
    const open = () => setSheet(true);
    window.addEventListener('wlf:free-class', open);
    return () => window.removeEventListener('wlf:free-class', open);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !wrap.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [menu]);

  const onSupport = () => (window.matchMedia('(min-width: 1024px)').matches ? setMenu((m) => !m) : setSheet(true));

  return (
    <>
      <div ref={wrap} className="fixed right-3 bottom-[84px] z-40 flex flex-col items-end gap-3 lg:right-6 lg:bottom-6">
        <AnimatePresence>
          {showTop && !menu && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-md lg:h-11 lg:w-11"
              aria-label={t(ui.backToTop)}
              title={t(ui.backToTop)}
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Desktop menu: Call + WhatsApp */}
        <AnimatePresence>
          {menu && (
            <motion.div
              id="support-menu"
              role="menu"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="w-72 overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--shadow-lift)]"
            >
              <p className="border-b border-line px-5 py-3.5 text-sm font-semibold">{t(COPY.title)}</p>
              <a role="menuitem" href={`tel:${BRAND_CONTACT.phone}`} className="flex items-center gap-3.5 px-5 py-3.5 transition hover:bg-surface-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t(COPY.call)}</span>
                  <span className="block text-xs text-muted">{BRAND_CONTACT.phone}</span>
                </span>
              </a>
              <a
                role="menuitem"
                href={waLink(waMessage('enroll', t.locale))}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3.5 border-t border-line px-5 py-3.5 transition hover:bg-surface-2"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366] text-white">
                  <WhatsAppGlyph size={20} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t(COPY.whatsapp)}</span>
                  <span className="block text-xs text-muted">{BRAND_CONTACT.whatsapp}</span>
                </span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onSupport}
          aria-label={t(COPY.support)}
          aria-expanded={menu}
          aria-haspopup="menu"
          title={t(COPY.support)}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-10px_rgba(13,27,51,.7)] transition hover:scale-105 lg:h-11 lg:w-11',
            menu ? 'bg-ink' : 'bg-rouge',
          )}
        >
          {!menu && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-rouge" />}
          <span className="lg:hidden">
            <GraduationCap size={19} />
          </span>
          <span className="hidden lg:block">{menu ? <X size={18} /> : <Headset size={19} />}</span>
        </button>
      </div>

      {/* Phone sheet: free class registration (+ Messenger) */}
      <Dialog.Root open={sheet} onOpenChange={setSheet}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-sm" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 bottom-0 z-[91] max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-bg px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl sm:inset-x-auto sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:w-[min(520px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:p-7"
          >
            <span className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-line sm:hidden" aria-hidden />
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="font-display text-2xl font-semibold">{t(COPY.freeClass)}</Dialog.Title>
                <p className="mt-1 text-sm text-muted">{t(COPY.freeClassSub)}</p>
              </div>
              <Dialog.Close aria-label={t(COPY.close)} className="rounded-full p-2 hover:bg-surface-2">
                <X size={20} />
              </Dialog.Close>
            </div>
            <FreeClassForm source="mobile-sheet" compact />
            <a
              href={BRAND_SOCIAL_LINKS.messenger}
              target="_blank"
              rel="noopener"
              className="mt-4 flex items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface py-3 text-sm font-semibold text-[#0866ff]"
            >
              <MessengerGlyph /> {t(COPY.messenger)}
            </a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
