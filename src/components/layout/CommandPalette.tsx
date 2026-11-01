'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, CornerDownLeft, Search, X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useT, type L } from '@/i18n/t';
import { useCourses } from '@/components/CoursesProvider';
import { RECORDED_COURSES } from '@/data/recordedCourses';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import { SECTIONS, MEGA } from '@/content/nav';
import { ui } from '@/content/home';
import { quizHref } from '@/lib/quiz';
import { Icon } from '@/components/ui/Icon';

const EVENT = 'wlf:palette';
export const openPalette = () => window.dispatchEvent(new Event(EVENT));

const GROUPS = {
  pages: { en: 'Jump to section', bn: 'সেকশনে যান' },
  courses: { en: 'Courses', bn: 'কোর্স' },
  tools: { en: 'Tools & practice', bn: 'টুলস ও প্র্যাকটিস' },
  quizzes: { en: 'Quizzes & mock tests', bn: 'কুইজ ও মক টেস্ট' },
  placeholder: {
    en: 'Search courses, quizzes, tools…',
    bn: 'কোর্স, কুইজ, টুলস খুঁজুন…',
  },
  empty: { en: 'Nothing found. Try “A2”, “CRS” or “recording”.', bn: 'কিছু পাওয়া যায়নি। “A2”, “CRS” বা “রেকর্ডিং” লিখে দেখুন।' },
} satisfies Record<string, L>;

export function CommandPalette() {
  const t = useT();
  const { courses } = useCourses();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(EVENT, onOpen);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const item =
    'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-fg data-[selected=true]:bg-surface-2 data-[selected=true]:text-fg data-[selected=true]:shadow-[inset_2px_0_0_var(--rouge)]';

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/60" />
        <Dialog.Content
          className="fixed top-[8dvh] left-1/2 z-[91] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-[var(--shadow-lift)]"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t(ui.searchSite)}</Dialog.Title>
          <Command label={t(ui.searchSite)} className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-line pr-1.5 pl-5 sm:pr-3">
              <Search size={18} className="shrink-0 text-muted" />
              {/* text-base (16px) on phones: iOS Safari zooms the page into any field with a smaller font */}
              <Command.Input
                autoFocus
                placeholder={t(GROUPS.placeholder)}
                className="h-14 w-full min-w-0 bg-transparent text-base text-fg outline-none placeholder:text-muted sm:text-[15px]"
              />
              <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-muted sm:inline-block">ESC</kbd>
              {/* Touch users have no Esc key: a visible close button */}
              <Dialog.Close aria-label={t(ui.close)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-fg/10 hover:text-fg">
                <X size={18} />
              </Dialog.Close>
            </div>
            <Command.List data-lenis-prevent className="max-h-[min(55dvh,460px)] overflow-y-auto p-2">
              <Command.Empty className="p-6 text-center text-sm text-muted">{t(GROUPS.empty)}</Command.Empty>

              <Command.Group heading={t(GROUPS.courses)} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase [&:not(:first-child)]:mt-1 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line [&:not(:first-child)]:pt-1">
                {courses.map((c) => (
                  <Command.Item key={c.id} value={`${c.title} ${c.banglaTitle} ${c.code}`} onSelect={() => go(`/courses/${c.id}`)} className={item}>
                    <span className="font-display flex h-8 w-8 items-center justify-center rounded-md bg-ink text-[11px] font-semibold text-white">{c.code}</span>
                    <span className="flex-1">{t.locale === 'bn' ? c.banglaTitle : c.title}</span>
                    <ArrowRight size={14} className="opacity-50" />
                  </Command.Item>
                ))}
                {RECORDED_COURSES.map((r) => (
                  <Command.Item key={r.id} value={`${r.title} ${r.banglaTitle} recorded`} onSelect={() => go(`/recorded/${r.slug}`)} className={item}>
                    <Icon name="video" size={16} className="mx-2" />
                    <span className="flex-1">{t.locale === 'bn' ? r.banglaTitle : r.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={t(GROUPS.tools)} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase [&:not(:first-child)]:mt-1 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line [&:not(:first-child)]:pt-1">
                {MEGA.tools.map((tool) => (
                  <Command.Item key={tool.href} value={`${tool.t.en} ${tool.t.bn}`} onSelect={() => go(tool.href)} className={item}>
                    <Icon name={tool.icon} size={16} className="mx-2" />
                    <span className="flex-1">{t(tool.t)}</span>
                  </Command.Item>
                ))}
                <Command.Item value="enroll admission ভর্তি" onSelect={() => go('/enroll')} className={item}>
                  <Icon name="cap" size={16} className="mx-2" />
                  <span className="flex-1">{t({ en: 'Enroll / Admission', bn: 'ভর্তি' })}</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading={t(GROUPS.pages)} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase [&:not(:first-child)]:mt-1 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line [&:not(:first-child)]:pt-1">
                {SECTIONS.map((s) => (
                  <Command.Item key={s.id} value={`${s.label.en} ${s.label.bn} section`} onSelect={() => go(`/#${s.id}`)} className={item}>
                    <CornerDownLeft size={14} className="mx-2.5 opacity-60" />
                    <span className="flex-1">{t(s.label)}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={t(GROUPS.quizzes)} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase [&:not(:first-child)]:mt-1 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line [&:not(:first-child)]:pt-1">
                {QUIZ_CATEGORIES.map((q) => (
                  <Command.Item key={q.id} value={`${q.title} ${q.banglaTitle} quiz`} onSelect={() => go(quizHref(q.slug))} className={item}>
                    <Icon name="clipboard" size={16} className="mx-2" />
                    <span className="flex-1">{t.locale === 'bn' ? q.banglaTitle : q.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
              {/* No FAQ group: the FAQ is admin-editable (Firestore), so the built-in list here would drift from the site */}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
