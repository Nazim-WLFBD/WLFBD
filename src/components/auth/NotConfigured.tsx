'use client';

import { Settings } from 'lucide-react';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { WA_MESSAGES, waLink } from '@/lib/brand';

/** Shown where accounts are needed but Firebase hasn't been set up yet. */
export function NotConfigured() {
  const t = useT();
  return (
    <div className="card accent-top mx-auto flex max-w-md flex-col items-center p-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-soft text-rouge">
        <Settings size={22} />
      </span>
      <p className="font-display mt-3 text-xl font-semibold">
        {t({ en: 'Student accounts are coming soon', bn: 'স্টুডেন্ট অ্যাকাউন্ট শীঘ্রই আসছে' })}
      </p>
      <p className="mt-2 text-sm text-muted">
        {t({
          en: 'Message us on WhatsApp and our team will help you right away.',
          bn: 'হোয়াটসঅ্যাপে মেসেজ দিন, আমাদের টিম সাথে সাথে সাহায্য করবে।',
        })}
      </p>
      <a href={waLink(WA_MESSAGES.question)} target="_blank" rel="noopener" className={btn('ink', 'md', 'mt-5')}>
        WhatsApp
      </a>
    </div>
  );
}
