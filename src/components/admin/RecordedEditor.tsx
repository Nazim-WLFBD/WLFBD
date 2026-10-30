'use client';

import { useCallback, useEffect, useState } from 'react';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { firebase } from '@/lib/firebase';
import type { RecordedCourse } from '@/types';

/** Edit recorded courses stored in Firestore: price, publish, and each lesson's links/preview flag. */
export function RecordedEditor() {
  const { authFetch } = useAuth();
  const [courses, setCourses] = useState<RecordedCourse[] | null>(null);
  const [links, setLinks] = useState<Record<string, { videoUrl?: string; pdfUrl?: string }>>({});
  const [sel, setSel] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const fb = firebase()!;
    const s = await getDocs(collection(fb.db, 'recordedCourses'));
    const cs = s.docs.map((d) => ({ ...(d.data() as RecordedCourse), id: d.id }));
    const l: typeof links = {};
    for (const c of cs) {
      const p = await getDocs(collection(fb.db, 'recordedCourses', c.id, 'private'));
      p.docs.forEach((d) => (l[d.id] = d.data()));
    }
    setCourses(cs);
    setLinks(l);
    setSel((s) => s || cs[0]?.id || '');
  }, []);

  useEffect(() => {
    load().catch(() => setCourses([]));
  }, [load]);

  if (!courses) return <Loader2 className="animate-spin" />;

  if (courses.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm">
        <p className="text-muted">The website is showing the built-in recorded courses. Copy them into the database to edit prices, lessons and video links.</p>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const r = await authFetch('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'seedRecordedCourses' }) });
            setBusy(false);
            if (r.ok) load();
            else alert('Could not import courses.');
          }}
          className={btn('ink', 'md', 'mt-4')}
        >
          {busy && <Loader2 size={15} className="animate-spin" />} Import built-in courses
        </button>
      </div>
    );

  const c = courses.find((x) => x.id === sel)!;
  const patch = (p: Partial<RecordedCourse>) => setCourses(courses.map((x) => (x.id === c.id ? { ...x, ...p } : x)));
  const input = 'w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm';

  const save = async () => {
    const fb = firebase()!;
    setBusy(true);
    setMsg(null);
    try {
      const modules = (c.modules ?? []).map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.isPreview ? { ...l, videoUrl: links[l.id]?.videoUrl ?? l.videoUrl ?? '', pdfUrl: links[l.id]?.pdfUrl ?? l.pdfUrl ?? null } : { ...l, videoUrl: '', pdfUrl: null })),
      }));
      await updateDoc(doc(fb.db, 'recordedCourses', c.id), {
        title: c.title,
        banglaTitle: c.banglaTitle,
        offerPrice: Number(c.offerPrice),
        regularPrice: Number(c.regularPrice),
        thumbnail: c.thumbnail,
        published: c.published !== false,
        modules,
      });
      for (const m of c.modules ?? [])
        for (const l of m.lessons)
          if (!l.isPreview) await setDoc(doc(fb.db, 'recordedCourses', c.id, 'private', l.id), { videoUrl: links[l.id]?.videoUrl ?? '', pdfUrl: links[l.id]?.pdfUrl ?? null });
      setMsg('Saved. The public site updates within 5 minutes.');
    } catch (e) {
      setMsg(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {courses.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={btn(x.id === sel ? 'ink' : 'ghost', 'sm')}>
            {x.title}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs font-bold text-muted">
          Title <input className={input} value={c.title} onChange={(e) => patch({ title: e.target.value })} />
        </label>
        <label className="text-xs font-bold text-muted">
          Bangla title <input className={input} value={c.banglaTitle} onChange={(e) => patch({ banglaTitle: e.target.value })} />
        </label>
        <label className="text-xs font-bold text-muted">
          Offer price (৳) <input type="number" className={input} value={c.offerPrice} onChange={(e) => patch({ offerPrice: Number(e.target.value) })} />
        </label>
        <label className="text-xs font-bold text-muted">
          Regular price (৳) <input type="number" className={input} value={c.regularPrice} onChange={(e) => patch({ regularPrice: Number(e.target.value) })} />
        </label>
        <label className="text-xs font-bold text-muted md:col-span-2">
          Thumbnail URL <input className={input} value={c.thumbnail} onChange={(e) => patch({ thumbnail: e.target.value })} />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={c.published !== false} onChange={(e) => patch({ published: e.target.checked })} /> Published
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {(c.modules ?? []).map((m, mi) => (
          <div key={m.id} className="rounded-2xl border border-line">
            <p className="border-b border-line bg-surface-2/60 px-4 py-2 text-sm font-bold">{m.title}</p>
            {m.lessons.map((l, li) => (
              <div key={l.id} className="grid gap-2 border-b border-line p-3 text-sm last:border-0 md:grid-cols-[1.2fr_1.5fr_1fr_auto]">
                <input
                  className={input}
                  value={l.title}
                  onChange={(e) => {
                    const mods = [...(c.modules ?? [])];
                    mods[mi] = { ...m, lessons: m.lessons.map((x, k) => (k === li ? { ...x, title: e.target.value } : x)) };
                    patch({ modules: mods });
                  }}
                />
                <input
                  className={input}
                  placeholder="Video embed URL (YouTube / Vimeo)"
                  value={links[l.id]?.videoUrl ?? (l.isPreview ? l.videoUrl : '') ?? ''}
                  onChange={(e) => setLinks({ ...links, [l.id]: { ...links[l.id], videoUrl: e.target.value } })}
                />
                <input
                  className={input}
                  placeholder="PDF URL"
                  value={links[l.id]?.pdfUrl ?? (l.isPreview ? l.pdfUrl : '') ?? ''}
                  onChange={(e) => setLinks({ ...links, [l.id]: { ...links[l.id], pdfUrl: e.target.value } })}
                />
                <label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={!!l.isPreview}
                    onChange={(e) => {
                      const mods = [...(c.modules ?? [])];
                      mods[mi] = { ...m, lessons: m.lessons.map((x, k) => (k === li ? { ...x, isPreview: e.target.checked } : x)) };
                      patch({ modules: mods });
                    }}
                  />
                  Free preview
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sticky bottom-3 mt-5 flex items-center gap-3">
        <button disabled={busy} onClick={save} className={btn('rouge', 'md')}>
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save course
        </button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </div>
  );
}
