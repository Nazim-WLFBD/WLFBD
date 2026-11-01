'use client';

import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * In-page replacement for window.confirm / prompt / alert. Browser dialogs can be blocked
 * (then confirm() silently returns false and the action never runs) and they can't be styled.
 *
 *   if (await dialog.confirm({ title: 'Approve payment?', message: '…', confirmLabel: 'Approve' })) …
 *   const reason = await dialog.prompt({ title: 'Reject payment', label: 'Reason', required: true }); // null = cancelled
 *   await dialog.alert('Network error. Check your connection and try again.');
 */
type Tone = 'default' | 'danger' | 'success';
interface Base {
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
}
interface PromptOpts extends Base {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  multiline?: boolean;
}
type Req =
  | { kind: 'confirm'; opts: Base; resolve: (v: boolean) => void }
  | { kind: 'prompt'; opts: PromptOpts; resolve: (v: string | null) => void }
  | { kind: 'alert'; opts: Base; resolve: () => void };

let push: ((r: Req) => void) | null = null;
const queue: Req[] = [];
const enqueue = (r: Req) => (push ? push(r) : queue.push(r));
const norm = <T extends Base>(o: T | string): T => (typeof o === 'string' ? ({ message: o } as T) : o);

export const dialog = {
  confirm: (o: Base | string) => new Promise<boolean>((resolve) => enqueue({ kind: 'confirm', opts: norm(o), resolve })),
  prompt: (o: PromptOpts | string) => new Promise<string | null>((resolve) => enqueue({ kind: 'prompt', opts: norm(o), resolve })),
  alert: (o: Base | string) => new Promise<void>((resolve) => enqueue({ kind: 'alert', opts: norm(o), resolve })),
};

const ICON = { default: Info, danger: AlertTriangle, success: CheckCircle2 } as const;
const ICON_TONE = { default: 'bg-blue-soft text-bleu', danger: 'bg-red-soft text-rouge', success: 'bg-mint/15 text-mint' } as const;

/** Mounted once (in Providers). Shows one dialog at a time, in order. */
export function DialogHost() {
  const [items, setItems] = useState<Req[]>([]);
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const current = items[0];

  useEffect(() => {
    push = (r) => setItems((s) => [...s, r]);
    if (queue.length) setItems((s) => [...s, ...queue.splice(0)]);
    return () => {
      push = null;
    };
  }, []);

  useEffect(() => {
    if (current?.kind === 'prompt') setValue(current.opts.defaultValue ?? '');
    setTouched(false);
  }, [current]);

  const close = (result: 'ok' | 'cancel') => {
    if (!current) return;
    if (current.kind === 'confirm') current.resolve(result === 'ok');
    else if (current.kind === 'alert') current.resolve();
    else {
      if (result === 'ok' && current.opts.required && !value.trim()) {
        setTouched(true);
        inputRef.current?.focus();
        return;
      }
      current.resolve(result === 'ok' ? value.trim() : null);
    }
    setItems((s) => s.slice(1));
  };

  if (!current) return null;
  const o = current.opts;
  const tone: Tone = o.tone ?? (current.kind === 'alert' ? 'default' : 'default');
  const Icon = ICON[tone];
  const p = current.kind === 'prompt' ? (o as PromptOpts) : null;
  const invalid = Boolean(p?.required && touched && !value.trim());

  return (
    <Dialog.Root open onOpenChange={(open) => !open && close('cancel')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-ink/55" />
        <Dialog.Content
          data-lenis-prevent
          onOpenAutoFocus={(e) => {
            if (p) {
              e.preventDefault();
              inputRef.current?.focus();
            }
          }}
          className="accent-top fixed top-1/2 left-1/2 z-[121] max-h-[85dvh] w-[min(460px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius)] border border-line bg-surface p-6 text-fg shadow-[var(--shadow-lift)]"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              close('ok');
            }}
          >
            <div className="flex items-start gap-4">
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', ICON_TONE[tone])}>
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <Dialog.Title className="font-display text-lg leading-snug font-semibold">
                  {o.title ?? (current.kind === 'alert' ? 'Notice' : current.kind === 'prompt' ? 'Please enter a value' : 'Are you sure?')}
                </Dialog.Title>
                {o.message ? <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-muted">{o.message}</Dialog.Description> : <Dialog.Description className="sr-only">Confirmation</Dialog.Description>}
              </div>
              <Dialog.Close type="button" aria-label="Close" className="-mt-1 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2">
                <X size={18} />
              </Dialog.Close>
            </div>

            {p && (
              <label className="mt-5 block">
                {p.label && <span className="mb-1.5 block text-xs font-semibold tracking-wide text-muted uppercase">{p.label}</span>}
                {p.multiline ? (
                  <textarea
                    ref={inputRef}
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={p.placeholder}
                    aria-invalid={invalid || undefined}
                    className={cn('w-full rounded-xl border bg-surface px-4 py-3 text-base outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20 sm:text-[15px]', invalid ? 'border-rouge' : 'border-line')}
                  />
                ) : (
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={p.placeholder}
                    aria-invalid={invalid || undefined}
                    className={cn('h-12 w-full rounded-xl border bg-surface px-4 text-base outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20 sm:text-[15px]', invalid ? 'border-rouge' : 'border-line')}
                  />
                )}
                {invalid && <span className="mt-1 block text-xs font-semibold text-rouge">This is required.</span>}
              </label>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {current.kind !== 'alert' && (
                <button type="button" onClick={() => close('cancel')} className={btn('ghost', 'md', 'w-full sm:w-auto')}>
                  {o.cancelLabel ?? 'Cancel'}
                </button>
              )}
              <button type="submit" className={btn(tone === 'danger' ? 'rouge' : 'ink', 'md', cn('w-full sm:w-auto', tone === 'success' && 'bg-mint hover:bg-mint/90 dark:bg-mint dark:text-white'))}>
                {o.confirmLabel ?? (current.kind === 'alert' ? 'OK' : 'Confirm')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
