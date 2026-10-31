'use client';

import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Download, Pencil, Plus, Trash2, X } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { firebase } from '@/lib/firebase';

export type Field =
  | { key: string; label: string; type: 'text' | 'textarea' | 'number' | 'checkbox' }
  | { key: string; label: string; type: 'select'; options: string[] }
  | { key: string; label: string; type: 'list'; hint?: string };

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
}

/** Generic list + add/edit/delete editor for a Firestore collection (admin-only by rules). */
export function CrudTab({ path, fields, columns, seed, seedId, newDefaults = {}, idFrom }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const fb = firebase();
    if (!fb) return;
    const s = await getDocs(collection(fb.db, path));
    setRows(s.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, [path]);

  useEffect(() => {
    load().catch((e) => setErr(String(e)));
  }, [load]);

  const save = async () => {
    const fb = firebase()!;
    if (!edit) return;
    const { id, ...data } = edit;
    // Empty numbers would be stored as '' and break arithmetic (e.g. quiz points), so they are dropped
    for (const f of fields)
      if (f.type === 'number') {
        if (data[f.key] === undefined || data[f.key] === '' || Number.isNaN(Number(data[f.key]))) delete data[f.key];
        else data[f.key] = Number(data[f.key]);
      }
    try {
      if (id) await updateDoc(doc(fb.db, path, id), { ...data, updatedAt: serverTimestamp() });
      else if (idFrom) {
        const ref = doc(fb.db, path, idFrom(data));
        if ((await getDoc(ref)).exists()) throw new Error(`An item with ID ${ref.id} already exists.`);
        await setDoc(ref, { ...data, createdAt: serverTimestamp() });
      }
      else await addDoc(collection(fb.db, path), { ...data, createdAt: serverTimestamp() });
      setEdit(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item permanently?')) return;
    await deleteDoc(doc(firebase()!.db, path, id));
    await load();
  };

  const importSeed = async () => {
    const fb = firebase()!;
    for (const r of seed ?? []) {
      const { id: _drop, ...data } = r as Row; // eslint-disable-line @typescript-eslint/no-unused-vars
      await setDoc(doc(fb.db, path, seedId ? seedId(r) : String(r.id)), { ...data, createdAt: serverTimestamp() }, { merge: true });
    }
    await load();
  };

  const input = 'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-fg/50';
  const show = (v: unknown) => (Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v == null ? '' : typeof v === 'object' ? '…' : String(v));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setEdit({ id: '', ...newDefaults })} className={btn('ink', 'sm')}>
          <Plus size={15} /> Add
        </button>
        {seed && (
          <button onClick={importSeed} className={btn('ghost', 'sm')}>
            <Download size={15} /> Import built-in ({seed.length})
          </button>
        )}
      </div>
      {err && <p className="mb-3 rounded-xl bg-rouge/10 p-3 text-sm text-rouge">{err}</p>}
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
          Nothing here yet. The website is using its built-in content{seed ? ' — import it to start editing.' : '.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
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
                    <button onClick={() => setEdit(r)} className="rounded-lg p-2 hover:bg-fg/10" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-rouge hover:bg-rouge/10" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {edit && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-3" onClick={() => setEdit(null)}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl font-semibold">{edit.id ? 'Edit' : 'Add'}</p>
              <button onClick={() => setEdit(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {fields.map((f) => (
                <label key={f.key} className="text-xs font-bold text-muted">
                  {f.label}
                  {f.type === 'textarea' ? (
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
                      value={Array.isArray(edit[f.key]) ? (edit[f.key] as string[]).join('\n') : ''}
                      onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value.split('\n').filter(Boolean) })}
                    />
                  ) : (
                    <input type={f.type} className={`${input} mt-1`} value={String(edit[f.key] ?? '')} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} />
                  )}
                </label>
              ))}
            </div>
            <button onClick={save} className={btn('rouge', 'md', 'mt-5 w-full')}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
