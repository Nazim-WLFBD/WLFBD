'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { addDoc, collection, deleteDoc, deleteField, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Download, Loader2, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { firebase, getStorageLazy } from '@/lib/firebase';

type Base = { key: string; label: string; hint?: string; /** Save is refused while the field is empty. */ required?: boolean };
export type Field =
  | (Base & { type: 'text' | 'textarea' | 'number' | 'checkbox' })
  | (Base & { type: 'select'; options: string[] })
  | (Base & { type: 'list' })
  /** Uploads to Firebase Storage under `folder/` and stores the download URL (a URL can also be pasted). */
  | (Base & { type: 'file'; accept: string; folder: string });

type Row = Record<string, unknown> & { id: string };

interface Props {
  path: string;
  fields: Field[];
  columns: string[];
  /** Built-in rows that can be imported into Firestore with one click. */
  seed?: Record<string, unknown>[];
  seedId?: (r: Record<string, unknown>) => string;
  newDefaults?: Record<string, unknown>;
  idFrom?: (r: Record<string, unknown>) => string;
  /**
   * Fields kept out of the main document and stored in a side document instead (e.g. admin-only notes under a
   * stricter rule). `path(id)` is the side document's path; the form shows both halves merged.
   */
  splitFields?: { keys: string[]; path: (id: string) => string };
  /** Called after a row is saved, deleted or the seed is imported (e.g. to refresh a server cache). */
  onSaved?: () => void | Promise<void>;
  /** Fields that can be set when adding but not changed afterwards (e.g. one the document ID is made from). */
  lockedOnEdit?: string[];
  /** Extra check before saving (it may normalise fields in place); returns an error message to show, or null when the data is fine. */
  validate?: (data: Record<string, unknown>) => string | null;
}

const isBlank = (v: unknown) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

/** Readable message for a failed Firestore write. */
const saveError = (e: unknown) => {
  const s = e instanceof Error ? e.message : String(e);
  if (/permission|insufficient/i.test(s))
    return 'The database refused this change (missing permission). Check that you are still signed in as an admin and that the latest firestore.rules are deployed.';
  if (/offline|unavailable|network/i.test(s)) return 'Could not reach the database. Check your connection and try again.';
  return s;
};

/** Generic list + add/edit/delete editor for a Firestore collection (admin-only by rules). */
export function CrudTab({ path, fields, columns, seed, seedId, newDefaults = {}, idFrom, splitFields, onSaved, lockedOnEdit = [], validate }: Props) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [edit, setEdit] = useState<Row | null>(null);
  /** Multi-line `list` fields are edited as raw text and split into an array only on save. */
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const opened = useRef<string>('');

  const load = useCallback(async () => {
    const fb = firebase();
    if (!fb) return;
    const s = await getDocs(collection(fb.db, path));
    setRows(s.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, [path]);

  useEffect(() => {
    load().catch((e) => {
      setRows((r) => r ?? []);
      setErr(
        String(e).includes('permission-denied')
          ? 'The database rules for this section have not been deployed yet. Run: npx firebase deploy --only firestore:rules,firestore:indexes,storage --project we-learn-french-bd'
          : `Could not load this list: ${e instanceof Error ? e.message : String(e)}`,
      );
    });
  }, [load]);

  const listKeys = fields.filter((f) => f.type === 'list').map((f) => f.key);

  /** Opens the form for a row (or a blank one), pulling in the split side document when there is one. */
  const open = async (row: Row) => {
    let r = row;
    if (splitFields && row.id) {
      const fb = firebase();
      if (fb) {
        const side = await getDoc(doc(fb.db, splitFields.path(row.id))).catch(() => null);
        if (side?.exists()) r = { ...row, ...side.data() };
      }
    }
    const text = Object.fromEntries(listKeys.map((k) => [k, Array.isArray(r[k]) ? (r[k] as unknown[]).join('\n') : '']));
    setErr(null);
    setRaw(text);
    setEdit(r);
    opened.current = JSON.stringify({ r, text });
  };

  const dirty = () => edit != null && JSON.stringify({ r: edit, text: raw }) !== opened.current;
  const close = (force = false) => {
    if (!force && dirty() && !confirm('Discard your unsaved changes?')) return;
    setEdit(null);
    setRaw({});
  };

  const save = async () => {
    const fb = firebase()!;
    if (!edit || saving) return;
    const { id, ...data } = edit;
    // Multi-line lists: one item per line, trimmed, blank lines dropped
    for (const k of listKeys) data[k] = (raw[k] ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
    // Empty numbers would be stored as '' and break arithmetic (e.g. quiz points), so they are dropped
    for (const f of fields)
      if (f.type === 'number') {
        if (data[f.key] === undefined || data[f.key] === '' || Number.isNaN(Number(data[f.key]))) delete data[f.key];
        else data[f.key] = Number(data[f.key]);
      }
    // Text is trimmed so a field of only spaces counts as empty
    for (const f of fields) if ((f.type === 'text' || f.type === 'textarea') && typeof data[f.key] === 'string') data[f.key] = (data[f.key] as string).trim();
    const missing = fields.filter((f) => f.required && isBlank(data[f.key])).map((f) => f.label.split(' (')[0]);
    if (missing.length) return setErr(`Please fill in: ${missing.join(', ')}.`);
    const invalid = validate?.(data);
    if (invalid) return setErr(invalid);
    // Locked fields keep their saved value when editing (the input is read-only too)
    if (id) for (const k of lockedOnEdit) delete data[k];

    // Fields stored in the side document (never in the public main document)
    const side: Record<string, unknown> = {};
    let sideHasValue = false;
    for (const k of splitFields?.keys ?? []) {
      if (k in data) side[k] = isBlank(data[k]) ? deleteField() : data[k];
      if (!isBlank(data[k])) sideHasValue = true;
      delete data[k];
    }

    setSaving(true);
    setErr(null);
    let docId = id;
    try {
      if (id) await updateDoc(doc(fb.db, path, id), { ...data, updatedAt: serverTimestamp() });
      else if (idFrom) {
        const ref = doc(fb.db, path, idFrom(data));
        if ((await getDoc(ref)).exists()) throw new Error(`An item with ID ${ref.id} already exists.`);
        await setDoc(ref, { ...data, createdAt: serverTimestamp() });
        docId = ref.id;
      } else docId = (await addDoc(collection(fb.db, path), { ...data, createdAt: serverTimestamp() })).id;
    } catch (e) {
      setErr(saveError(e));
      setSaving(false);
      return;
    }
    try {
      // A new item with only empty side fields has nothing to store there
      if (splitFields && Object.keys(side).length && (id || sideHasValue)) await setDoc(doc(fb.db, splitFields.path(docId)), side, { merge: true });
      close(true);
    } catch (e) {
      // The main document is saved; keep the form open on it so a retry updates it instead of adding a duplicate
      const saved = { ...edit, id: docId };
      setEdit(saved);
      opened.current = JSON.stringify({ r: saved, text: raw });
      setErr(`Saved, except the admin-only fields (${splitFields?.keys.join(', ')}): ${saveError(e)}`);
    } finally {
      setSaving(false);
    }
    await load().catch(() => {});
    await onSaved?.();
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name || id}" permanently?`)) return;
    try {
      const fb = firebase()!;
      await deleteDoc(doc(fb.db, path, id));
      if (splitFields) await deleteDoc(doc(fb.db, splitFields.path(id))).catch(() => {});
      await load();
      await onSaved?.();
    } catch (e) {
      alert(`Could not delete: ${saveError(e)}`);
    }
  };

  /** Built-in rows whose id is not in the database yet (importing never overwrites an admin's edits). */
  const seedIdOf = (r: Record<string, unknown>) => (seedId ? seedId(r) : String(r.id));
  const missingSeed = (seed ?? []).filter((r) => !rows?.some((x) => x.id === seedIdOf(r)));

  const importSeed = async () => {
    const fb = firebase()!;
    if (!confirm(`Copy ${missingSeed.length} built-in item(s) into the database? Items already in the database are left as they are.`)) return;
    try {
      for (const r of missingSeed) {
        const { id: _drop, ...data } = r as Row; // eslint-disable-line @typescript-eslint/no-unused-vars
        const ref = doc(fb.db, path, seedIdOf(r));
        // Re-checked just before writing so an edit made meanwhile (e.g. in another tab) is never replaced
        if ((await getDoc(ref)).exists()) continue;
        await setDoc(ref, { ...data, createdAt: serverTimestamp() });
      }
      await load();
      await onSaved?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  const input = 'w-full rounded-xl border border-line bg-surface px-3 py-2 text-base outline-none focus:border-fg/50 sm:text-sm';
  const show = (v: unknown) => (Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v == null ? '' : typeof v === 'object' ? '…' : String(v));
  /** What the delete confirmation calls a row: its title-like field, else the first filled column, else its id. */
  const rowName = (r: Row) =>
    [...['title', 'name', 'question', 'prompt', 'batchName', 'certificateNumber'].filter((k) => columns.includes(k)), ...columns.filter((c) => c !== 'id')]
      .map((c) => show(r[c]))
      .find(Boolean) ?? r.id;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => open({ id: '', ...newDefaults })} className={btn('ink', 'sm')}>
          <Plus size={15} /> Add
        </button>
        {seed && rows && missingSeed.length > 0 && (
          <button onClick={importSeed} className={btn('ghost', 'sm')}>
            <Download size={15} /> {rows.length ? `Import missing built-in (${missingSeed.length})` : `Import built-in (${missingSeed.length})`}
          </button>
        )}
      </div>
      {err && !edit && <p className="mb-3 rounded-xl bg-rouge/10 p-3 text-sm text-rouge">{err}</p>}
      {!rows ? (
        <Loader2 className="animate-spin" aria-label="Loading" />
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
          Nothing here yet.{seed ? ' The website is using its built-in content — import it to start editing.' : ' Press Add to create the first one.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-2/60 text-[11px] tracking-wider text-muted uppercase">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="p-3">
                    {fields.find((f) => f.key === c)?.label ?? c}
                  </th>
                ))}
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  {columns.map((c) => (
                    <td key={c} className="max-w-[320px] truncate p-3">
                      {show(r[c])}
                    </td>
                  ))}
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => open(r)} className="rounded-lg p-2 hover:bg-fg/10" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(r.id, rowName(r))} className="rounded-lg p-2 text-rouge hover:bg-rouge/10" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog.Root open={edit != null} onOpenChange={(o) => !o && close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/60" />
          <Dialog.Content
            data-lenis-prevent
            aria-describedby={undefined}
            className="fixed top-1/2 left-1/2 z-[91] max-h-[90vh] w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-surface p-6 shadow-[var(--shadow-lift)] outline-none"
          >
            {edit && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl font-semibold">{edit.id ? 'Edit' : 'Add'}</Dialog.Title>
                  <Dialog.Close aria-label="Close" className="rounded-lg p-1 hover:bg-fg/10">
                    <X size={18} />
                  </Dialog.Close>
                </div>
                <div className="flex flex-col gap-3">
                  {fields.map((f) => (
                    <label key={f.key} className="text-xs font-bold text-muted">
                      {f.label}
                      {f.required && <span className="text-rouge"> *</span>}
                      {f.type === 'file' ? (
                        <FileField field={f} value={String(edit[f.key] ?? '')} onChange={(url) => setEdit({ ...edit, [f.key]: url })} inputClass={input} />
                      ) : f.type === 'textarea' ? (
                        <textarea rows={4} className={`${input} mt-1`} value={String(edit[f.key] ?? '')} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                      ) : f.type === 'checkbox' ? (
                        <input type="checkbox" className="ml-2" checked={!!edit[f.key]} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.checked })} />
                      ) : f.type === 'select' ? (
                        <select className={`${input} mt-1`} value={String(edit[f.key] ?? '')} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}>
                          <option value="" />
                          {f.options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : f.type === 'list' ? (
                        <textarea
                          rows={3}
                          className={`${input} mt-1`}
                          placeholder={f.hint ?? 'One per line'}
                          value={raw[f.key] ?? ''}
                          onChange={(e) => setRaw({ ...raw, [f.key]: e.target.value })}
                        />
                      ) : (
                        <input
                          type={f.type}
                          readOnly={!!edit.id && lockedOnEdit.includes(f.key)}
                          className={`${input} mt-1 read-only:opacity-60`}
                          value={String(edit[f.key] ?? '')}
                          onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}
                        />
                      )}
                      {!!edit.id && lockedOnEdit.includes(f.key) && <span className="mt-1 block font-normal">Fixed once created. Delete and add again to change it.</span>}
                      {f.type !== 'list' && f.hint && <span className="mt-1 block font-normal">{f.hint}</span>}
                    </label>
                  ))}
                </div>
                {err && <p className="mt-4 rounded-xl bg-rouge/10 p-3 text-sm text-rouge">{err}</p>}
                <button onClick={save} disabled={saving} className={btn('rouge', 'md', 'mt-5 w-full')}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

const MAX_UPLOAD_MB = 15; // mirrors storage.rules

/** File picker that uploads to Storage with progress; the stored value is the public download URL. */
function FileField({
  field,
  value,
  onChange,
  inputClass,
}: {
  field: Extract<Field, { type: 'file' }>;
  value: string;
  onChange: (url: string) => void;
  inputClass: string;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return setErr(`File is larger than ${MAX_UPLOAD_MB} MB.`);
    setErr(null);
    setProgress(0);
    try {
      // The Storage SDK is loaded only when an admin actually uploads something
      const [storage, { getDownloadURL, ref: storageRef, uploadBytesResumable }] = await Promise.all([getStorageLazy(), import('firebase/storage')]);
      if (!storage) throw new Error('Firebase is not configured.');
      const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(-80);
      const task = uploadBytesResumable(storageRef(storage, `${field.folder}/${Date.now()}-${safeName}`), file, { contentType: file.type || undefined });
      // If nothing has been sent after a while the bucket is unreachable (e.g. Storage not enabled, CORS, offline):
      // stop instead of leaving the bar at 0% while the SDK keeps retrying
      let stalled = false;
      const watchdog = setTimeout(() => {
        if (task.snapshot.bytesTransferred === 0) {
          stalled = true;
          task.cancel();
        }
      }, 20_000);
      task.on(
        'state_changed',
        (s) => setProgress(s.totalBytes ? Math.round((s.bytesTransferred / s.totalBytes) * 100) : 0),
        (e) => {
          clearTimeout(watchdog);
          setProgress(null);
          setErr(
            stalled
              ? 'The upload could not start. Firebase Storage may not be enabled for this project (or its CORS/rules are not set up), or you are offline. You can paste an audio URL above instead.'
              : e.code === 'storage/unauthorized'
                ? 'Upload refused: only admins may upload, and the file must match the allowed type/size.'
                : e.code === 'storage/retry-limit-exceeded'
                  ? 'The upload kept failing. Check your connection, or paste an audio URL above instead.'
                  : e.message,
          );
        },
        async () => {
          clearTimeout(watchdog);
          try {
            onChange(await getDownloadURL(task.snapshot.ref));
          } catch (e) {
            setErr(`Uploaded, but the file link could not be read: ${e instanceof Error ? e.message : String(e)}`);
          }
          setProgress(null);
        },
      );
    } catch (e) {
      setProgress(null);
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="mt-1 flex flex-col gap-2">
      <input type="url" className={inputClass} placeholder="https://… (upload below or paste a URL)" value={value} onChange={(e) => onChange(e.target.value)} />
      {value && field.accept.startsWith('audio') && <audio controls preload="metadata" src={value} className="w-full" />}
      <label className={btn('ghost', 'sm', 'w-fit cursor-pointer')}>
        <Upload size={14} /> {progress == null ? 'Upload file' : `Uploading… ${progress}%`}
        <input
          type="file"
          accept={field.accept}
          className="sr-only"
          disabled={progress != null}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = '';
          }}
        />
      </label>
      {progress != null && (
        <div className="h-1.5 overflow-hidden rounded-sm bg-surface-2">
          <div className="h-full bg-bleu transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {err && <span className="font-normal text-rouge">{err}</span>}
    </div>
  );
}
