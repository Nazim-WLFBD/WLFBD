'use client';

import { BookOpen, GraduationCap, PenLine, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { ui } from '@/content/home';

const item = 'flex flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[11px] font-bold';

/** Phone-only action bar: Courses, Free Quiz, Free Class (opens the registration sheet), Enroll. */
export function MobileBottomBar() {
  const t = useT();
  return (
    <nav
      aria-label={t(ui.quickActions)}
      className="glass-paper fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] lg:hidden"
    >
      <Link href="/courses" className={`${item} text-fg`}>
        <BookOpen size={19} />
        {t({ en: 'Courses', bn: 'কোর্স' })}
      </Link>
      <Link href="/quiz/placement-test" className={`${item} text-fg`}>
        <Sparkles size={19} className="text-gold" />
        {t(ui.freeQuiz)}
      </Link>
      <button type="button" onClick={() => window.dispatchEvent(new Event('wlf:free-class'))} className={`${item} bg-rouge text-white`}>
        <GraduationCap size={20} />
        {t({ en: 'Free class', bn: 'ফ্রি ক্লাস' })}
      </button>
      <Link href="/enroll" className={`${item} text-rouge`}>
        <PenLine size={19} />
        {t(ui.enroll)}
      </Link>
    </nav>
  );
}
