'use client';

import { useCallback, useEffect, useState } from 'react';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { firebase } from '@/lib/firebase';
import { EMBED_HINT, safeEmbedUrl, safeHttpsUrl } from '@/lib/embed';
import type { RecordedCourse } from '@/types';
import { dialog } from '@/components/ui/DialogHost';

/** Edit recorded courses stored in Firestore: price, publish, and each lesson's links/preview flag. */
export function RecordedEditor() {
  const { authFetch } = useAuth();
  const [courses, setCourses] = useState<RecordedCourse[] | null>(null);
  const [links, setLinks] = useState<Record<string, { videoUrl?: string; pdfUrl?: string }>>({});
  const [sel, setSel] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  /** True once something was edited and not yet saved (guards against leaving the page and losing it). */
  const [dirty, setDirty] = useState(false);

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
    setLoadErr(null);
    setDirty(false);
  }, []);

  const retry = useCallback(() => {
    setLoadErr(null);
    setCourses(null);
    // A failed read must not look like an empty collection (that would offer "Import built-in courses")
    load().catch((e) => {
      setLoadErr(e instanceof Error ? e.message : String(e));
      setCourses([]);
    });
  }, [load]);

  useEffect(() => {
    retry();
  }, [retry]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!courses) return <Loader2 className="animate-spin" />;

  if (loadErr)
    return (
      <div className="rounded-2xl bg-rouge/10 p-5 text-sm text-rouge">
        <p>Could not load the recorded courses: {loadErr}</p>
        <button onClick={retry} className={btn('ghost', 'sm', 'mt-3')}>
          Try again
        </button>
      </div>
    );

  if (courses.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm">
        <p className="text-muted">The website is showing the built-in recorded courses. Copy them into the database to edit prices, lessons and video links.</p>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const r = await authFetch('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'seedRecordedCourses' }) });
              if (r.ok) retry();
              else await dialog.alert({ title: 'Could not import courses', message: (await r.json().catch(() => ({}))).error ?? 'The server refused the import.', tone: 'danger' });
            } catch {
              await dialog.alert({ title: 'Network error', message: 'Check your connection and try again.', tone: 'danger' });
            } finally {
              setBusy(false);
            }
          }}
          className={btn('ink', 'md', 'mt-4')}
        >
          {busy && <Loader2 size={15} className="animate-spin" />} Import built-in courses
        </button>
      </div>
    );

  const c = courses.find((x) => x.id === sel)!;
  const patch = (p: Partial<RecordedCourse>) => {
    setDirty(true);
    setMsg(null);
    setCourses(courses.map((x) => (x.id === c.id ? { ...x, ...p } : x)));
  };
  const setLink = (id: string, p: { videoUrl?: string; pdfUrl?: string }) => {
    setDirty(true);
    setMsg(null);
    setLinks({ ...links, [id]: { ...links[id], ...p } });
  };
  const input = 'w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-base sm:text-sm';

  const save = async () => {
    const fb = firebase()!;
    setBusy(true);
    setMsg(null);
    try {
      // Links are rendered inside iframes/anchors on the public site, so only allowed shapes are saved
      for (const m of c.modules ?? [])
        for (const l of m.lessons) {
          const v = links[l.id]?.videoUrl ?? (l.isPreview ? l.videoUrl : '') ?? '';
          const p = links[l.id]?.pdfUrl ?? (l.isPreview ? l.pdfUrl : '') ?? '';
          if (v && !safeEmbedUrl(v)) throw new Error(`"${l.title}": invalid video link. ${EMBED_HINT}`);
          if (p && !safeHttpsUrl(p)) throw new Error(`"${l.title}": the PDF link must start with https://`);
        }
      if (c.thumbnail && !safeHttpsUrl(c.thumbnail)) throw new Error('The thumbnail must be an https:// link.');
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
      // Clear the server's short cache so the classroom sees the new links at once
      await authFetch('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'refreshRecordedCourses' }) }).catch(() => {});
      setDirty(false);
      setMsg('Saved. The public site updates within 5 minutes.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-unsaved={dirty || undefined}>
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
          Thumbnail URL <input type="url" className={input} value={c.thumbnail} onChange={(e) => patch({ thumbnail: e.target.value })} />
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
                {(() => {
                  const v = links[l.id]?.videoUrl ?? (l.isPreview ? l.videoUrl : '') ?? '';
                  const bad = !!v && !safeEmbedUrl(v);
                  return (
                    <span>
                      <input
                        className={`${input} ${bad ? 'border-rouge' : ''}`}
                        placeholder="Video embed URL (YouTube / Vimeo)"
                        aria-invalid={bad}
                        value={v}
                        onChange={(e) => setLink(l.id, { videoUrl: e.target.value })}
                      />
                      {bad && <span className="mt-1 block text-xs text-rouge">{EMBED_HINT}</span>}
                    </span>
                  );
                })()}
                {(() => {
                  const p = links[l.id]?.pdfUrl ?? (l.isPreview ? l.pdfUrl : '') ?? '';
                  const bad = !!p && !safeHttpsUrl(p);
                  return (
                    <span>
                      <input
                        className={`${input} ${bad ? 'border-rouge' : ''}`}
                        placeholder="PDF URL"
                        aria-invalid={bad}
                        value={p}
                        onChange={(e) => setLink(l.id, { pdfUrl: e.target.value })}
                      />
                      {bad && <span className="mt-1 block text-xs text-rouge">The PDF link must start with https://</span>}
                    </span>
                  );
                })()}
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
      <div className="sticky bottom-[calc(84px+env(safe-area-inset-bottom))] z-30 mt-5 flex items-center gap-3 md:bottom-3">
        <button disabled={busy} onClick={save} className={btn('rouge', 'md')}>
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save course
        </button>
        {msg ? <span className="text-sm text-muted">{msg}</span> : dirty && <span className="text-sm text-muted">Unsaved changes</span>}
      </div>
    </div>
  );
}
