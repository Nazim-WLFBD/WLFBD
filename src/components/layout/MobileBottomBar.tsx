'use client';

import { BookOpen, GraduationCap, PenLine, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { ui } from '@/content/home';

const item = 'flex min-h-11 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-xs leading-tight font-bold';

/**
 * Phone-only action bar (hidden from md up): Courses, Free Quiz, Free Class (opens the registration sheet), Enroll.
 * Solid surface with a hairline + soft shadow rather than a backdrop blur, which is costly on phone GPUs.
 * `data-bottom-bar` lets globals.css hide it while a quiz is running (body.quiz-active).
 */
export function MobileBottomBar() {
  const t = useT();
  return (
    <nav
      data-bottom-bar
      aria-label={t(ui.quickActions)}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t border-line bg-surface/97 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-16px_rgba(15,23,42,.35)] md:hidden"
    >
      <Link href="/courses" className={`${item} text-fg`}>
        <BookOpen size={19} />
        {t({ en: 'Courses', bn: 'কোর্স' })}
      </Link>
      <Link href="/quiz/placement-test" className={`${item} text-fg`}>
        <Sparkles size={19} className="text-rouge" />
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
