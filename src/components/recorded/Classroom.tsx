'use client';

import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Award, CheckCircle2, ChevronLeft, ChevronRight, FileText, Loader2, Lock, PlayCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { firebase } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import type { RecordedCourse } from '@/types';

export function Classroom({ slug }: { slug: string }) {
  const t = useT();
  const { user, authFetch } = useAuth();
  const [course, setCourse] = useState<RecordedCourse | null>(null);
  const [access, setAccess] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [cert, setCert] = useState<string | null>(null);
  const [certErr, setCertErr] = useState<string | null>(null);

  useEffect(() => {
    authFetch(`/api/learn/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setCourse(d.course);
        setAccess(!!d.access);
      })
      .catch(() => {});
    // authFetch identity changes every render; the slug is what matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user?.uid]);

  const lessons = useMemo(() => course?.modules?.flatMap((m) => m.lessons) ?? [], [course]);

  useEffect(() => {
    const fb = firebase();
    if (!fb || !user || !course) return;
    getDoc(doc(fb.db, 'users', user.uid, 'courseProgress', course.id))
      .then((s) => {
        const d = s.data();
        setDone((d?.completedLessonIds as string[]) ?? []);
        setCurrent((d?.lastWatchedLessonId as string) ?? lessons[0]?.id ?? null);
      })
      .catch(() => setCurrent(lessons[0]?.id ?? null));
  }, [user, course, lessons]);

  if (!course)
    return (
      <div className="flex justify-center py-20 text-muted">
        <Loader2 className="animate-spin" />
      </div>
    );

  const lesson = lessons.find((l) => l.id === current) ?? lessons[0];
  const idx = lessons.indexOf(lesson);
  const unlocked = (l: (typeof lessons)[number]) => access || l.isPreview;
  const pct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;

  const save = async (ids: string[], last: string) => {
    const fb = firebase();
    if (!fb || !user || !access) return;
    await setDoc(
      doc(fb.db, 'users', user.uid, 'courseProgress', course.id),
      {
        userId: user.uid,
        courseId: course.id,
        completedLessonIds: ids,
        lastWatchedLessonId: last,
        progressPercentage: Math.round((ids.length / lessons.length) * 100),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const go = (id: string) => {
    setCurrent(id);
    save(done, id).catch(() => {});
  };

  const markDone = async () => {
    if (done.includes(lesson.id)) return;
    const next = [...done, lesson.id];
    setDone(next);
    await save(next, lesson.id).catch(() => {});
  };

  const getCert = async () => {
    setCertErr(null);
    const r = await authFetch('/api/certificate', { method: 'POST', body: JSON.stringify({ courseId: course.id }) });
    const d = await r.json();
    if (r.ok) setCert(d.certificateNumber);
    else setCertErr(d.error);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <Link href={`/recorded/${course.slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
          <ChevronLeft size={15} /> {course.title}
        </Link>
        <div className="overflow-hidden rounded-[24px] bg-ink">
          {unlocked(lesson) && lesson.videoUrl ? (
            <iframe key={lesson.id} src={lesson.videoUrl} title={lesson.title} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-3 text-white">
              <Lock size={32} className="text-gold" />
              <p>{t({ en: 'Enroll to unlock this lesson', bn: 'এই লেসন দেখতে ভর্তি হোন' })}</p>
              <Link href={`/recorded/${course.slug}?enroll=1`} className={btn('rouge', 'sm')}>
                {t({ en: 'Enroll', bn: 'ভর্তি হোন' })}
              </Link>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">{lesson.title}</h1>
            {lesson.banglaTitle && <p className="font-bangla text-muted">{lesson.banglaTitle}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => idx > 0 && go(lessons[idx - 1].id)} disabled={idx <= 0} className={btn('ghost', 'sm')} aria-label="Previous lesson">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => idx < lessons.length - 1 && go(lessons[idx + 1].id)} disabled={idx >= lessons.length - 1} className={btn('ghost', 'sm')} aria-label="Next lesson">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-muted">{t.locale === 'bn' ? lesson.banglaSummary : lesson.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {access && (
            <button onClick={markDone} className={btn(done.includes(lesson.id) ? 'ghost' : 'ink', 'md')}>
              <CheckCircle2 size={16} className={done.includes(lesson.id) ? 'text-mint' : ''} />
              {done.includes(lesson.id) ? t({ en: 'Completed', bn: 'সম্পন্ন' }) : t({ en: 'Mark as completed', bn: 'সম্পন্ন হিসেবে চিহ্নিত করুন' })}
            </button>
          )}
          {unlocked(lesson) && lesson.pdfUrl && (
            <a href={lesson.pdfUrl} target="_blank" rel="noopener" className={btn('ghost', 'md')}>
              <FileText size={16} /> PDF
            </a>
          )}
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        {access && (
          <div className="rounded-[22px] bg-ink p-5 text-white">
            <div className="flex justify-between text-sm">
              <span>{t({ en: 'Progress', bn: 'অগ্রগতি' })}</span>
              <span className="font-bold">{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
            </div>
            {course.hasCertificate &&
              (cert ? (
                <Link href={`/verify/${cert}`} className={btn('gold', 'sm', 'mt-4 w-full')}>
                  <Award size={15} /> {cert}
                </Link>
              ) : (
                <button onClick={getCert} disabled={pct < 100} className={btn('gold', 'sm', 'mt-4 w-full')}>
                  <Award size={15} /> {t({ en: 'Get certificate', bn: 'সার্টিফিকেট নিন' })}
                </button>
              ))}
            {certErr && <p className="mt-2 text-xs text-[#ff8a98]">{certErr}</p>}
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto rounded-[22px] border border-line bg-surface">
          {course.modules?.map((m) => (
            <div key={m.id}>
              <p className="sticky top-0 border-b border-line bg-surface-2 px-4 py-2.5 text-xs font-bold">{m.title}</p>
              {m.lessons.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={cn('flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-sm last:border-0', l.id === lesson.id && 'bg-rouge/10')}
                >
                  {done.includes(l.id) ? (
                    <CheckCircle2 size={16} className="shrink-0 text-mint" />
                  ) : unlocked(l) ? (
                    <PlayCircle size={16} className="shrink-0 text-rouge" />
                  ) : (
                    <Lock size={14} className="shrink-0 text-muted" />
                  )}
                  <span className="flex-1">{l.title}</span>
                  <span className="text-xs text-muted">{l.duration}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
