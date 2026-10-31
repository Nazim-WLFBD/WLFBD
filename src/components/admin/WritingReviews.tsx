'use client';

import { useCallback, useEffect, useState } from 'react';
import { collectionGroup, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Loader2, RefreshCw, Send } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { firebase } from '@/lib/firebase';
import { builtInQuestions, wordCount } from '@/lib/quizScoring';
import type { PendingReview, Question } from '@/types/quiz';

interface Attempt {
  path: string;
  userName: string;
  userEmail: string;
  quizId: string;
  quizTitle: string;
  completedAt?: { seconds?: number };
  autoScore: number;
  autoMax: number;
  pendingReview: PendingReview[];
}

type Grade = { points: string; comment: string };
/** Marking aids for one question: word limits from the question plus the staff-only model answer. */
type Notes = Partial<Question> & { modelAnswer?: string };

const fmtDate = (v?: { seconds?: number }) => (v?.seconds ? new Date(v.seconds * 1000).toLocaleString() : '');

/** Admin queue of writing answers awaiting a mark (collection-group query over users/*\/quizAttempts). */
export function WritingReviews() {
  const { authFetch } = useAuth();
  const [rows, setRows] = useState<Attempt[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, Record<string, Grade>>>({});
  /** Marking notes per question (min/max words, model answer) looked up from the question itself, not the attempt. */
  const [notes, setNotes] = useState<Record<string, Notes>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const fb = firebase();
    if (!fb) return;
    setErr(null);
    try {
      const s = await getDocs(query(collectionGroup(fb.db, 'quizAttempts'), where('reviewStatus', '==', 'pending'), orderBy('completedAt', 'desc'), limit(100)));
      const list = s.docs.map((d) => {
        const x = d.data();
        return {
          path: d.ref.path,
          userName: String(x.userName ?? ''),
          userEmail: String(x.userEmail ?? ''),
          quizId: String(x.quizId ?? ''),
          quizTitle: String(x.quizTitle ?? x.quizId ?? ''),
          completedAt: x.completedAt,
          autoScore: Number(x.autoScore ?? x.totalScore ?? 0),
          autoMax: Number(x.autoMax ?? x.maxScore ?? 0),
          pendingReview: (Array.isArray(x.pendingReview) ? x.pendingReview : []) as PendingReview[],
        };
      });
      setRows(list);
      // Model answers stay out of the attempt document (students can read their own attempts). For admin-added
      // questions they live in the staff-only quizzes/{quizId}/notes/{id}; the public questions doc gives the word limits.
      const wanted = new Map<string, { quizId: string; id: string }>();
      for (const a of list) for (const p of a.pendingReview) wanted.set(`${a.quizId}/${p.id}`, { quizId: a.quizId, id: p.id });
      const found: Record<string, Notes> = {};
      await Promise.all(
        [...wanted.entries()].map(async ([key, { quizId, id }]) => {
          const built = builtInQuestions(quizId).find((q) => q.id === id);
          if (built) return void (found[key] = built);
          const [q, n] = await Promise.all([
            getDoc(doc(fb.db, 'quizzes', quizId, 'questions', id)).catch(() => null),
            getDoc(doc(fb.db, 'quizzes', quizId, 'notes', id)).catch(() => null),
          ]);
          found[key] = { ...(q?.exists() ? (q.data() as Partial<Question>) : {}), ...(n?.exists() ? (n.data() as Notes) : {}) };
        }),
      );
      setNotes(found);
    } catch (e) {
      setRows([]);
      setErr(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grade = (path: string, id: string): Grade => grades[path]?.[id] ?? { points: '', comment: '' };
  const setGrade = (path: string, id: string, patch: Partial<Grade>) =>
    setGrades((g) => ({ ...g, [path]: { ...g[path], [id]: { ...grade(path, id), ...patch } } }));

  const submit = async (a: Attempt) => {
    const payload = a.pendingReview.map((p) => {
      const g = grade(a.path, p.id);
      return { id: p.id, points: g.points === '' ? NaN : Number(g.points), comment: g.comment.trim() || undefined };
    });
    const bad = payload.find((g, k) => !Number.isFinite(g.points) || g.points < 0 || g.points > a.pendingReview[k].points);
    if (bad) return alert('Enter points for every answer, between 0 and its maximum.');
    setBusy(a.path);
    try {
      const r = await authFetch('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'gradeWriting', attemptPath: a.path, grades: payload }) });
      if (!r.ok) alert((await r.json().catch(() => ({}))).error ?? 'Could not save the marks.');
      else {
        setRows((rs) => (rs ?? []).filter((x) => x.path !== a.path));
        setGrades((g) => {
          const { [a.path]: _drop, ...rest } = g; // eslint-disable-line @typescript-eslint/no-unused-vars
          return rest;
        });
      }
    } catch {
      alert('Network error. Check your connection and try again.');
    } finally {
      setBusy(null);
    }
  };

  const input = 'rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-fg/50';

  if (!rows) return <Loader2 className="animate-spin" />;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">Writing answers waiting for a mark. The student is emailed when you submit, and their score updates.</p>
        <button onClick={load} className={btn('ghost', 'sm')}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      {err && (
        <p className="mb-3 rounded-xl bg-rouge/10 p-3 text-sm text-rouge">
          {err}
          {/failed-precondition|index/i.test(err) && ' — this query needs the quizAttempts collection-group index (firestore.indexes.json); deploy it or open the link in the browser console.'}
        </p>
      )}
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No writing answers are waiting for review.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((a) => (
            <li key={a.path} className="rounded-2xl border border-line p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-semibold">{a.userName || a.userEmail || 'Student'}</p>
                  <p className="text-xs text-muted">{a.userEmail}</p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p className="font-semibold text-fg">{a.quizTitle}</p>
                  <p>
                    {fmtDate(a.completedAt)} · auto score {a.autoScore}/{a.autoMax}
                  </p>
                </div>
              </div>

              <ol className="mt-4 flex flex-col gap-4">
                {a.pendingReview.map((p, k) => {
                  const n = notes[`${a.quizId}/${p.id}`] ?? {};
                  const min = p.minWords ?? n.minWords;
                  const max = p.maxWords ?? n.maxWords;
                  const g = grade(a.path, p.id);
                  const words = wordCount(p.answer);
                  const outOfRange = (min != null && words < Number(min)) || (max != null && words > Number(max));
                  return (
                    <li key={p.id} className="rounded-xl bg-surface-2/60 p-4 text-sm">
                      <p className="font-semibold">
                        {k + 1}. {p.prompt}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {p.points} pts
                        {(min != null || max != null) && ` · ${min ?? '…'}–${max ?? '…'} words`}
                        <span className={outOfRange ? ' font-semibold text-rouge' : ''}>
                          {' '}
                          · student wrote {words} words{outOfRange && ' (outside the limit)'}
                        </span>
                      </p>
                      <blockquote lang="fr" className="mt-3 rounded-xl border-l-4 border-bleu bg-surface p-3 leading-relaxed whitespace-pre-line">
                        {p.answer}
                      </blockquote>
                      {n.modelAnswer && (
                        <details className="mt-3 text-xs">
                          <summary className="cursor-pointer font-semibold text-muted">Model answer / marking notes</summary>
                          <p className="mt-2 whitespace-pre-line text-muted">{n.modelAnswer}</p>
                        </details>
                      )}
                      <div className="mt-3 grid gap-2 sm:grid-cols-[140px_1fr]">
                        <label className="text-xs font-bold text-muted">
                          Points (0–{p.points})
                          <input
                            type="number"
                            min={0}
                            max={p.points}
                            step={0.5}
                            className={`${input} mt-1 w-full`}
                            value={g.points}
                            onChange={(e) => setGrade(a.path, p.id, { points: e.target.value })}
                          />
                        </label>
                        <label className="text-xs font-bold text-muted">
                          Comment for the student (optional)
                          <input className={`${input} mt-1 w-full`} value={g.comment} onChange={(e) => setGrade(a.path, p.id, { comment: e.target.value })} />
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <button onClick={() => submit(a)} disabled={busy === a.path} className={btn('rouge', 'sm', 'mt-4')}>
                {busy === a.path ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit marks & email student
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
