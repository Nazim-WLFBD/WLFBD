'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { Check, Loader2, RefreshCw, Trash2, X } from 'lucide-react';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { firebase } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { FAQ_DATA } from '@/data/faq';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { BATCH_SCHEDULES } from '@/data/schedules';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import { CrudTab } from './CrudTab';
import { RecordedEditor } from './RecordedEditor';
import { CoursesEditor } from './CoursesEditor';
import { WritingReviews } from './WritingReviews';

type Row = Record<string, unknown> & { id: string };
const TABS = ['Overview', 'Payments', 'Enrollments', 'Users', 'Free class', 'Courses', 'Recorded courses', 'Batches', 'Quiz questions', 'Writing reviews', 'Announcements', 'Certificates', 'Reviews', 'FAQ', 'Audit log'] as const;
type Tab = (typeof TABS)[number];

const fmtDate = (v: unknown) => {
  const s = (v as { seconds?: number })?.seconds;
  return s ? new Date(s * 1000).toLocaleString() : '';
};

export function AdminPortal() {
  const [tab, setTab] = useState<Tab>('Overview');
  const panel = useRef<HTMLDivElement>(null);
  const go = (t: Tab) => {
    // Editors with unsaved work mark themselves with data-unsaved; switching tabs would unmount and lose it
    if (t !== tab && document.querySelector('[data-unsaved]') && !confirm('You have unsaved changes in this section. Leave without saving?')) return;
    setTab(t);
    // After switching from far down a long list, bring the new section's heading back into view
    requestAnimationFrame(() => {
      const top = panel.current?.getBoundingClientRect().top;
      if (top != null && top < 0) panel.current?.scrollIntoView({ block: 'start' });
    });
  };
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Phones: 15 sections don't fit in a strip, so they get a picker */}
      <label className="lg:hidden">
        <span className="sr-only">Admin section</span>
        <select value={tab} onChange={(e) => go(e.target.value as Tab)} className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base font-semibold">
          {TABS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <nav className="hidden gap-1 lg:flex lg:flex-col" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => go(t)}
            aria-current={tab === t ? 'page' : undefined}
            className={cn('rounded-xl px-4 py-2.5 text-left text-sm font-semibold whitespace-nowrap transition', tab === t ? 'bg-ink text-white dark:bg-bleu' : 'hover:bg-fg/5')}
          >
            {t}
          </button>
        ))}
      </nav>
      <div ref={panel} className="min-w-0 scroll-mt-24 rounded-[24px] border border-line bg-surface p-5 md:p-7">
        <h2 className="font-display mb-5 text-2xl font-semibold">{tab}</h2>
        {tab === 'Overview' && <Overview />}
        {tab === 'Payments' && <Payments />}
        {tab === 'Enrollments' && <Enrollments />}
        {tab === 'Users' && <Users />}
        {tab === 'Free class' && <FreeClass />}
        {tab === 'Courses' && <CoursesEditor />}
        {tab === 'Recorded courses' && <RecordedEditor />}
        {tab === 'Writing reviews' && <WritingReviews />}
        {tab === 'Batches' && (
          <CrudTab
            path="batches"
            columns={['batchName', 'days', 'timeSlot', 'status']}
            seed={BATCH_SCHEDULES as unknown as Record<string, unknown>[]}
            fields={[
              { key: 'batchName', label: 'Name', type: 'text', required: true },
              { key: 'banglaBatchName', label: 'Bangla name', type: 'text' },
              { key: 'days', label: 'Days', type: 'text', required: true },
              { key: 'banglaDays', label: 'Bangla days', type: 'text' },
              { key: 'dayKeys', label: 'Day keys (fri, sat, sun, mon…)', type: 'list' },
              { key: 'timeSlot', label: 'Time slot', type: 'text', required: true },
              { key: 'type', label: 'Type', type: 'select', options: ['Morning', 'Evening', 'Night'] },
              { key: 'courseId', label: 'Course id (or any)', type: 'text' },
              { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Filling Fast', 'Almost Full', 'Closed'] },
              { key: 'seatsTotal', label: 'Seats total (optional)', type: 'number' },
              { key: 'seatsTaken', label: 'Seats taken (optional)', type: 'number' },
              { key: 'startDate', label: 'Start date (optional)', type: 'text' },
            ]}
            newDefaults={{ courseId: 'any', status: 'Open', type: 'Evening', dayKeys: [] }}
          />
        )}
        {tab === 'Quiz questions' && <QuestionsTab />}
        {tab === 'Announcements' && (
          <CrudTab
            path="announcements"
            columns={['title', 'category']}
            fields={[
              { key: 'title', label: 'Title', type: 'text', required: true },
              { key: 'banglaTitle', label: 'Bangla title', type: 'text' },
              { key: 'content', label: 'Content', type: 'textarea', required: true },
              { key: 'category', label: 'Category', type: 'select', options: ['General', 'Class Update', 'Exam Notice', 'System'] },
            ]}
            newDefaults={{ category: 'General' }}
          />
        )}
        {tab === 'Certificates' && (
          <CrudTab
            path="certificates"
            columns={['certificateNumber', 'userName', 'courseTitle', 'issueDate']}
            idFrom={(r) => String(r.certificateNumber)}
            // The number is the document ID that /verify/<number> looks up, so it must match that page's format and never change
            lockedOnEdit={['certificateNumber']}
            validate={(d) => {
              d.certificateNumber = String(d.certificateNumber ?? '').toUpperCase();
              if (!/^WLF-BD-\d{6}$/.test(String(d.certificateNumber))) return 'The certificate number must look like WLF-BD-123456 (6 digits).';
              if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.issueDate ?? '')) || Number.isNaN(Date.parse(String(d.issueDate)))) return 'The issue date must be a real date written as YYYY-MM-DD.';
              return null;
            }}
            fields={[
              { key: 'certificateNumber', label: 'Certificate number (e.g. WLF-BD-123456)', type: 'text', required: true },
              { key: 'userName', label: 'Student name', type: 'text', required: true },
              { key: 'courseTitle', label: 'Course', type: 'text', required: true },
              { key: 'cefrLevel', label: 'Level', type: 'text' },
              { key: 'issueDate', label: 'Issue date (YYYY-MM-DD)', type: 'text', required: true },
            ]}
            newDefaults={{ certificateNumber: `WLF-BD-${Math.floor(100000 + Math.random() * 900000)}`, issueDate: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date()) }}
          />
        )}
        {tab === 'Reviews' && (
          <CrudTab
            path="reviews"
            columns={['name', 'targetCountry', 'rating', 'published']}
            seed={TESTIMONIALS_DATA as unknown as Record<string, unknown>[]}
            fields={[
              { key: 'name', label: 'Name', type: 'text', required: true },
              { key: 'professionRole', label: 'Role', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'targetCountry', label: 'Pathway', type: 'select', options: ['Canada', 'France', 'General'] },
              { key: 'examPassed', label: 'Exam / course', type: 'text' },
              { key: 'score', label: 'Score', type: 'text' },
              { key: 'quote', label: 'Review (English)', type: 'textarea', required: true },
              { key: 'banglaQuote', label: 'Review (Bangla)', type: 'textarea' },
              { key: 'photoUrl', label: 'Photo URL', type: 'text' },
              { key: 'rating', label: 'Rating (1-5)', type: 'number' },
              { key: 'displayOrder', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'checkbox' },
            ]}
            newDefaults={{ rating: 5, published: true, targetCountry: 'General' }}
            validate={(d) => {
              if (d.rating != null && !(Number.isInteger(d.rating) && Number(d.rating) >= 1 && Number(d.rating) <= 5)) return 'The rating must be a whole number from 1 to 5.';
              if (d.photoUrl && !/^https:\/\//i.test(String(d.photoUrl))) return 'The photo URL must start with https://';
              return null;
            }}
          />
        )}
        {tab === 'FAQ' && (
          <CrudTab
            path="faq"
            columns={['question', 'category']}
            seed={FAQ_DATA as unknown as Record<string, unknown>[]}
            fields={[
              { key: 'category', label: 'Category', type: 'select', options: ['General', 'Classes', 'Payment', 'Exams', 'Immigration'] },
              { key: 'question', label: 'Question', type: 'text', required: true },
              { key: 'answer', label: 'Answer', type: 'textarea', required: true },
              { key: 'banglaQuestion', label: 'Bangla question', type: 'text' },
              { key: 'banglaAnswer', label: 'Bangla answer', type: 'textarea' },
            ]}
            newDefaults={{ category: 'General' }}
          />
        )}
        {tab === 'Audit log' && <AuditLog />}
      </div>
    </div>
  );
}

/** Epoch ms of a Firestore Timestamp, ISO string or number (0 when missing), for client-side sorting. */
const epoch = (v: unknown) => {
  if (!v) return 0;
  const s = (v as { seconds?: number }).seconds;
  if (typeof s === 'number') return s * 1000;
  const n = typeof v === 'number' ? v : Date.parse(String(v));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Rows of a collection, newest first. With `order` the query sorts on the server (documents missing that field
 * are not returned); with `order: null` everything is fetched and sorted here by `createdAt`.
 */
function useRows(path: string, order: string | null = 'submittedAt', max = 200) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => {
    const fb = firebase();
    if (!fb) {
      setErr('Firebase is not configured.');
      setRows([]);
      return;
    }
    try {
      const s = await getDocs(order ? query(collection(fb.db, path), orderBy(order, 'desc'), limit(max)) : query(collection(fb.db, path), limit(max)));
      const list: Row[] = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows(order ? list : list.sort((a, b) => epoch(b.createdAt) - epoch(a.createdAt)));
      setErr(null);
    } catch (e) {
      // Keep what was already shown (e.g. after a failed refresh) and say why the list could not load
      setRows((r) => r ?? []);
      setErr(loadError(e));
    }
  }, [path, order, max]);
  useEffect(() => {
    load();
  }, [load]);
  return { rows, load, err };
}

/** Readable message for a failed Firestore read. */
const loadError = (e: unknown) => {
  const s = e instanceof Error ? e.message : String(e);
  if (/permission/i.test(s)) return 'You do not have permission to read this list (or the database rules are not deployed).';
  if (/offline|unavailable|network/i.test(s)) return 'Could not reach the database. Check your connection and press refresh.';
  return `Could not load this list: ${s}`;
};

const LoadErr = ({ err }: { err: string | null }) => (err ? <p className="mb-3 rounded-xl bg-rouge/10 p-3 text-sm text-rouge">{err}</p> : null);

function useAction() {
  const { authFetch } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const run = async (key: string, body: Record<string, unknown>) => {
    setBusy(key);
    try {
      const r = await authFetch('/api/admin', { method: 'POST', body: JSON.stringify(body) });
      if (!r.ok) alert((await r.json().catch(() => ({}))).error ?? 'Action failed');
      return r.ok;
    } catch {
      alert('Network error. Check your connection and try again.');
      return false;
    } finally {
      setBusy(null);
    }
  };
  return { busy, run };
}

const APPROVAL: Record<string, string> = {
  approved: 'bg-mint/15 text-mint',
  pending: 'bg-gold/20',
  rejected: 'bg-rouge/15 text-rouge',
};

const STATUS: Record<string, string> = {
  Verified: 'bg-mint/15 text-mint',
  Pending: 'bg-gold/20',
  Rejected: 'bg-rouge/15 text-rouge',
  Failed: 'bg-rouge/15 text-rouge',
  Consultation: 'bg-bleu/15 text-bleu',
};
const Pill = ({ s }: { s: unknown }) => <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', STATUS[String(s)] ?? 'bg-fg/10')}>{String(s)}</span>;

function Overview() {
  const [stats, setStats] = useState<Record<string, number>>({});
  useEffect(() => {
    const fb = firebase();
    if (!fb) return;
    const c = (p: string, w?: [string, string]) =>
      getCountFromServer(w ? query(collection(fb.db, p), where(w[0], '==', w[1])) : collection(fb.db, p)).then((r) => r.data().count);
    Promise.all([c('users'), c('enrollments'), c('coursePayments', ['status', 'Pending']), c('certificates'), c('users', ['approval', 'pending']), c('freeClassRegistrations', ['status', 'New'])])
      .then(([users, enrollments, pending, certs, approvals, freeClass]) => setStats({ users, enrollments, pending, certs, approvals, freeClass }))
      .catch(() => {});
  }, []);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {[
        ['Students', stats.users],
        ['Enrollments', stats.enrollments],
        ['Payments to verify', stats.pending],
        ['Certificates', stats.certs],
        ['Accounts to approve', stats.approvals],
        ['New free-class sign-ups', stats.freeClass],
      ].map(([k, v]) => (
        <div key={String(k)} className={cn('rounded-2xl border border-line p-5', ['Payments to verify', 'Accounts to approve', 'New free-class sign-ups'].includes(String(k)) && Number(v) > 0 && 'border-gold bg-gold/10')}>
          <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{k}</p>
          <p className="font-display mt-1 text-3xl font-semibold">{v ?? '—'}</p>
        </div>
      ))}
    </div>
  );
}

function Payments() {
  const { rows, load, err } = useRows('coursePayments');
  const { busy, run } = useAction();
  const [filter, setFilter] = useState('Pending');
  if (!rows) return <Loader2 className="animate-spin" />;
  const list = rows.filter((r) => filter === 'All' || r.status === filter);
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {['Pending', 'Verified', 'Rejected', 'All'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-full px-4 py-1.5 text-sm font-semibold', filter === f ? 'bg-ink text-white' : 'border border-line')}>
            {f} ({f === 'All' ? rows.length : rows.filter((r) => r.status === f).length})
          </button>
        ))}
        <button onClick={load} className="ml-auto rounded-full p-2 hover:bg-fg/10" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>
      <LoadErr err={err} />
      <p className="mb-3 text-xs text-muted">Check each TrxID and amount in the bKash/Nagad app before approving. Approving unlocks the course and emails the student.</p>
      <div className="flex flex-col gap-3">
        {list.length === 0 && <p className="text-sm text-muted">No payments.</p>}
        {list.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line p-4 text-sm">
            <div className="min-w-[220px] flex-1">
              <p className="font-bold">{String(p.courseTitle)}</p>
              <p className="text-muted">
                {String(p.userName)} · {String(p.userEmail)} · {String(p.userPhone ?? '')}
              </p>
              <p className="text-muted">
                ৳{String(p.amount)} via {String(p.paymentMethod)} · sender {String(p.senderPhone || '—')} · <span className="font-mono font-bold text-fg">{String(p.trxId || '—')}</span> · {fmtDate(p.submittedAt)}
              </p>
              {p.status === 'Rejected' && p.rejectionReason ? <p className="text-xs text-rouge">Reason: {String(p.rejectionReason)}</p> : null}
              {p.status === 'Rejected' ? (
                <button
                  disabled={!!busy}
                  onClick={async () =>
                    confirm(`Delete this rejected payment from ${String(p.userName)} (TrxID ${String(p.trxId || '—')}) and its enrollment permanently?`) &&
                    (await run(p.id, { action: 'deletePayment', paymentId: p.id })) &&
                    load()
                  }
                  className="mt-1 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-rouge hover:underline"
                >
                  <Trash2 size={13} /> Delete
                </button>
              ) : null}
              {p.verifiedBy && p.status !== 'Pending' ? (
                <p className="text-xs text-muted">
                  {String(p.status)} by {String(p.verifiedBy)} {fmtDate(p.verifiedAt)}
                </p>
              ) : null}
            </div>
            <Pill s={p.status} />
            {p.status === 'Pending' && (
              <span className="flex gap-2">
                <button
                  disabled={!!busy}
                  onClick={async () =>
                    confirm(`Approve ৳${String(p.amount)} from ${String(p.userName)} (TrxID ${String(p.trxId || '—')})? This unlocks the course and emails the student.`) &&
                    (await run(p.id, { action: 'approvePayment', paymentId: p.id })) &&
                    load()
                  }
                  className={btn('ink', 'sm', 'bg-mint')}
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  disabled={!!busy}
                  onClick={async () => {
                    const reason = prompt('Reason for rejecting?');
                    if (reason != null && (await run(p.id, { action: 'rejectPayment', paymentId: p.id, reason }))) load();
                  }}
                  className={btn('ghost', 'sm', 'text-rouge')}
                >
                  <X size={14} /> Reject
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Enrollments() {
  const { rows, load, err } = useRows('enrollments', 'enrolledAt');
  const { busy, run } = useAction();
  if (!rows) return <Loader2 className="animate-spin" />;
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">Changing a status keeps the linked payment in step. Verified unlocks the course and emails the student.</p>
        <button onClick={load} className="rounded-full p-2 hover:bg-fg/10" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>
      <LoadErr err={err} />
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-2/60 text-[11px] tracking-wider text-muted uppercase">
            <tr>
              {['Student', 'Course', 'Batch', 'Payment', 'Status', 'Change'].map((h) => (
                <th key={h} className="p-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-line align-top">
                <td className="p-3">
                  <p className="font-semibold">{String(e.userName)}</p>
                  <p className="text-xs text-muted">
                    {String(e.userEmail)} · {String(e.userPhone ?? '')}
                  </p>
                </td>
                <td className="p-3">{String(e.courseTitle)}</td>
                <td className="p-3 text-xs">{String(e.batchSchedule ?? '')}</td>
                <td className="p-3 text-xs">
                  {String(e.paymentMethod)} · ৳{String(e.amountPaid ?? 0)}
                  <br />
                  <span className="font-mono">{String(e.transactionId || '')}</span>
                </td>
                <td className="p-3">
                  <Pill s={e.paymentStatus} />
                </td>
                <td className="p-3 whitespace-nowrap">
                  {e.paymentStatus !== 'Consultation' && (
                    <select
                      disabled={!!busy}
                      aria-label="Change enrollment status"
                      value={['Pending', 'Verified', 'Failed'].includes(String(e.paymentStatus)) ? String(e.paymentStatus) : ''}
                      onChange={async (ev) => {
                        const status = ev.target.value;
                        const msg: Record<string, string> = {
                          Verified: `Confirm ${String(e.userName)}'s enrollment? This unlocks the course, marks the payment verified and emails the student.`,
                          Failed: `Mark ${String(e.userName)}'s enrollment as failed? The linked payment is rejected and its TrxID freed.`,
                          Pending: `Move ${String(e.userName)}'s enrollment back to pending?`,
                        };
                        if (!msg[status] || !confirm(msg[status])) return;
                        if (await run(e.id, { action: 'setEnrollmentStatus', enrollmentId: e.id, status })) load();
                      }}
                      className="rounded-lg border border-line bg-surface px-2 py-1 text-xs"
                    >
                      {!['Pending', 'Verified', 'Failed'].includes(String(e.paymentStatus)) && <option value="">{String(e.paymentStatus ?? '—')}</option>}
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Failed">Failed</option>
                    </select>
                  )}
                  {e.paymentStatus === 'Failed' && (
                    <button
                      disabled={!!busy}
                      onClick={async () =>
                        confirm(`Delete ${String(e.userName)}'s failed enrollment (and its rejected payment) permanently?`) &&
                        (await run(e.id, { action: 'deleteEnrollment', enrollmentId: e.id })) &&
                        load()
                      }
                      aria-label={`Delete ${String(e.userName)}'s failed enrollment`}
                      className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-rouge hover:bg-rouge/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-sm text-muted">No enrollments yet.</p>}
      </div>
    </>
  );
}

function Users() {
  // Sorted client-side so profiles that have never logged in (no lastLoginAt) still appear
  const { rows, load, err } = useRows('users', null, 500);
  const { profile } = useAuth();
  const { busy, run } = useAction();
  const [q, setQ] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  if (!rows) return <Loader2 className="animate-spin" />;
  const approvalOf = (u: Row) => String(u.approval ?? 'approved');
  const pendingCount = rows.filter((u) => approvalOf(u) === 'pending').length;
  const list = rows
    .filter((u) => approvalFilter === 'all' || approvalOf(u) === approvalFilter)
    .filter((u) => `${u.displayName ?? ''} ${u.email ?? ''} ${u.phoneNumber ?? ''}`.toLowerCase().includes(q.trim().toLowerCase()));
  const superAdmin = profile?.role === 'superAdmin';
  const countOf = (f: string) => (f === 'all' ? rows.length : rows.filter((u) => approvalOf(u) === f).length);
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button key={f} onClick={() => setApprovalFilter(f)} className={cn('rounded-full px-4 py-1.5 text-sm font-semibold capitalize', approvalFilter === f ? 'bg-ink text-white' : 'border border-line')}>
            {f === 'pending' ? `Pending approval (${pendingCount})` : `${f} (${countOf(f)})`}
          </button>
        ))}
        <button onClick={load} className="ml-auto rounded-full p-2 hover:bg-fg/10" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>
      <LoadErr err={err} />
      <input value={q} onChange={(e) => setQ(e.target.value)} type="search" enterKeyHint="search" placeholder="Search name, email, phone…" className="mb-4 w-full text-base sm:text-sm rounded-xl border border-line bg-surface px-4 py-2.5 text-sm" />
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-2/60 text-[11px] tracking-wider text-muted uppercase">
            <tr>
              {['Name', 'Email', 'Phone', 'Goal / level', 'Courses', 'Approval', 'Role'].map((h) => (
                <th key={h} className="p-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="p-3 font-semibold">{String(u.displayName ?? '')}</td>
                <td className="p-3">{String(u.email ?? '')}</td>
                <td className="p-3">{String(u.phoneNumber ?? '')}</td>
                <td className="p-3 text-xs">
                  {[u.targetGoal, u.currentFrenchLevel].filter(Boolean).map(String).join(' · ')}
                </td>
                <td className="p-3 text-xs">{((u.enrolledCourses as string[]) ?? []).join(', ')}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold capitalize', APPROVAL[approvalOf(u)])}>{approvalOf(u)}</span>
                    {approvalOf(u) !== 'approved' && (
                      <button disabled={!!busy} title="Approve" aria-label="Approve" onClick={async () => (await run(u.id, { action: 'setApproval', uid: u.id, approval: 'approved' })) && load()} className="rounded-lg bg-mint/15 p-1.5 text-mint">
                        <Check size={14} />
                      </button>
                    )}
                    {approvalOf(u) !== 'rejected' && u.role !== 'admin' && u.role !== 'superAdmin' && (
                      <button disabled={!!busy} title="Reject" aria-label="Reject" onClick={async () => confirm('Reject this account? The student will not be able to log in to the dashboard.') && (await run(u.id, { action: 'setApproval', uid: u.id, approval: 'rejected' })) && load()} className="rounded-lg bg-rouge/15 p-1.5 text-rouge">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  {superAdmin ? (
                    <select
                      // The server refuses to remove your own super admin role, so it is not offered here
                      disabled={!!busy || u.id === profile?.uid}
                      title={u.id === profile?.uid ? 'You cannot change your own role' : undefined}
                      aria-label={`Role of ${String(u.displayName || u.email || 'user')}`}
                      value={String(u.role ?? 'student')}
                      onChange={async (e) => {
                        const role = e.target.value;
                        if (!confirm(`Change ${String(u.displayName || u.email || 'this user')}'s role to ${role}? They will be signed out and get the new access on next login.`)) return;
                        if (await run(u.id, { action: 'setRole', uid: u.id, role })) load();
                      }}
                      className="rounded-lg border border-line bg-surface px-2 py-1"
                    >
                      {['student', 'instructor', 'admin', 'superAdmin'].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    String(u.role ?? 'student')
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-sm text-muted">No users match.</p>}
      </div>
    </>
  );
}

function QuestionsTab() {
  const [quiz, setQuiz] = useState(QUIZ_CATEGORIES[0].id);
  return (
    <>
      <select value={quiz} onChange={(e) => setQuiz(e.target.value)} className="mb-4 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm">
        {QUIZ_CATEGORIES.map((q) => (
          <option key={q.id} value={q.id}>
            {q.title}
          </option>
        ))}
      </select>
      <p className="mb-4 text-xs text-muted">Questions added here are shown to students in this quiz, after the built-in questions (the site picks them up within 5 minutes).</p>
      <CrudTab
        key={quiz}
        path={`quizzes/${quiz}/questions`}
        columns={['prompt', 'type', 'category', 'correctAnswer']}
        // The model answer lives in quizzes/{quiz}/notes/{id}, which only staff may read; the questions doc is public
        splitFields={{ keys: ['modelAnswer'], path: (id) => `quizzes/${quiz}/notes/${id}` }}
        fields={[
          { key: 'type', label: 'Question type', type: 'select', options: ['multiple-choice', 'true-false', 'fill-blank', 'audio-listening', 'writing-task'], required: true },
          { key: 'prompt', label: 'Question', type: 'textarea', required: true },
          { key: 'banglaPrompt', label: 'Bangla question (optional)', type: 'text' },
          { key: 'passage', label: 'Reading passage (optional)', type: 'textarea' },
          { key: 'audioUrl', label: 'Audio file', type: 'file', accept: 'audio/*', folder: 'quiz-audio', hint: 'For listening questions: upload an MP3/M4A (max 15 MB) or paste a URL. Students may play it twice.' },
          { key: 'audioText', label: 'Audio transcript (optional)', type: 'textarea', hint: 'French transcript; read aloud by the browser if no audio file is set.' },
          { key: 'options', label: 'Options', type: 'list', hint: 'One option per line (multiple-choice / true-false / listening)' },
          { key: 'correctAnswer', label: 'Correct answer (exactly as one option)', type: 'text', hint: 'Leave empty for writing tasks: they are marked by an instructor.' },
          { key: 'explanation', label: 'Explanation', type: 'textarea' },
          { key: 'minWords', label: 'Min words (writing)', type: 'number' },
          { key: 'maxWords', label: 'Max words (writing)', type: 'number' },
          { key: 'modelAnswer', label: 'Model answer / marking notes (writing, admin-only)', type: 'textarea', hint: 'Shown only in the Writing reviews tab, never to students.' },
          { key: 'category', label: 'Category', type: 'select', options: ['Grammar', 'Vocabulary', 'Reading', 'Listening', 'Writing'] },
          { key: 'cefrLevel', label: 'Level', type: 'select', options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'TEF', 'TCF'] },
          { key: 'points', label: 'Points', type: 'number' },
        ]}
        newDefaults={{ type: 'multiple-choice', category: 'Grammar', cefrLevel: 'A1', points: 1, options: [] }}
        validate={(d) => {
          const options = (d.options as string[] | undefined) ?? [];
          const correct = String(d.correctAnswer ?? '').trim().toLowerCase();
          if (d.points != null && !(Number(d.points) > 0)) return 'Points must be more than 0.';
          if (d.type === 'writing-task') {
            if (d.minWords != null && d.maxWords != null && Number(d.minWords) > Number(d.maxWords)) return 'Min words cannot be more than max words.';
            return null;
          }
          if (d.type === 'audio-listening' && !d.audioUrl && !d.audioText) return 'A listening question needs an audio file or a transcript.';
          if (!correct) return 'Enter the correct answer (only writing tasks are marked by an instructor).';
          // Choice questions are scored by comparing the answer with the chosen option, so it must be one of them
          if (d.type !== 'fill-blank') {
            if (options.length < 2) return 'Add at least two options, one per line.';
            if (!options.some((o) => o.trim().toLowerCase() === correct)) return 'The correct answer must match one of the options exactly.';
          }
          return null;
        }}
      />
    </>
  );
}

function AuditLog() {
  const { rows, load, err } = useRows('auditLogs', 'timestamp', 200);
  if (!rows) return <Loader2 className="animate-spin" />;
  const meta = (m: unknown) =>
    m && typeof m === 'object'
      ? Object.entries(m as Record<string, unknown>)
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join(' · ')
      : '';
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">Server-side admin actions (payments, enrollments, roles, approvals, writing marks). Content edits are not logged here.</p>
        <button onClick={load} className="rounded-full p-2 hover:bg-fg/10" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>
      <LoadErr err={err} />
      <ul className="divide-y divide-line text-sm">
        {rows.length === 0 && <li className="py-4 text-muted">No actions logged yet.</li>}
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap gap-x-4 py-2.5">
            <span className="text-muted">{fmtDate(r.timestamp)}</span>
            <span className="font-semibold break-all">{String(r.actorEmail)}</span>
            <span>{String(r.action)}</span>
            <span className="font-mono text-xs break-all text-muted">{String(r.targetResource)}</span>
            {meta(r.metadata) && <span className="text-xs text-muted">{meta(r.metadata)}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}

function FreeClass() {
  const { rows, load, err } = useRows('freeClassRegistrations', 'submittedAt', 500);
  const [filter, setFilter] = useState('New');
  const [busy, setBusy] = useState<string | null>(null);
  if (!rows) return <Loader2 className="animate-spin" />;
  // Registrations without a status yet count as New, as the status dropdown shows them
  const statusOf = (r: Row) => String(r.status ?? 'New');
  const list = rows.filter((r) => filter === 'All' || statusOf(r) === filter);
  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      await updateDoc(doc(firebase()!.db, 'freeClassRegistrations', id), { status });
      await load();
    } catch {
      alert('Could not update. Check your connection and try again.');
    } finally {
      setBusy(null);
    }
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete the registration of ${String(r.name ?? 'this person')} permanently?`)) return;
    setBusy(r.id);
    try {
      await deleteDoc(doc(firebase()!.db, 'freeClassRegistrations', r.id));
      await load();
    } catch {
      alert('Could not delete. Check your connection and try again.');
    } finally {
      setBusy(null);
    }
  };
  const exportCsv = () => {
    const cols = ['name', 'phone', 'whatsapp', 'email', 'interestLabel', 'status', 'locale'];
    // A leading = + - @ or tab/CR would be run as a formula by Excel/Sheets, so such cells are prefixed with an apostrophe
    const cell = (v: unknown) => {
      const s = String(v ?? '');
      return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
    };
    const csv = [['date', ...cols].join(','), ...list.map((r) => [cell(fmtDate(r.submittedAt)), ...cols.map((c) => cell(r[c]))].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' }));
    a.download = `free-class-${filter.toLowerCase()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {['New', 'Contacted', 'Joined', 'Not interested', 'All'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-full px-4 py-1.5 text-sm font-semibold', filter === f ? 'bg-ink text-white' : 'border border-line')}>
            {f} ({f === 'All' ? rows.length : rows.filter((r) => statusOf(r) === f).length})
          </button>
        ))}
        <button onClick={exportCsv} disabled={list.length === 0} className={btn('ghost', 'sm', 'ml-auto')}>
          Export CSV
        </button>
        <button onClick={load} className="rounded-full p-2 hover:bg-fg/10" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>
      <LoadErr err={err} />
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-2/60 text-[11px] tracking-wider text-muted uppercase">
            <tr>
              {['Date', 'Name', 'Phone / WhatsApp', 'Email', 'Interested in', 'Status', ''].map((h) => (
                <th key={h} className="p-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 text-xs whitespace-nowrap text-muted">{fmtDate(r.submittedAt)}</td>
                <td className="p-3 font-semibold">{String(r.name ?? '')}</td>
                <td className="p-3 text-xs">
                  <a href={`tel:${String(r.phone ?? '')}`} className="hover:underline">
                    {String(r.phone ?? '')}
                  </a>
                  {r.whatsapp && r.whatsapp !== r.phone ? <span className="block text-muted">WA {String(r.whatsapp)}</span> : null}
                </td>
                <td className="p-3 text-xs">{String(r.email ?? '')}</td>
                <td className="p-3 text-xs">{String(r.interestLabel ?? r.interest ?? '')}</td>
                <td className="p-3">
                  <select disabled={busy === r.id} value={String(r.status ?? 'New')} onChange={(e) => setStatus(r.id, e.target.value)} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                    {['New', 'Contacted', 'Joined', 'Not interested'].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button disabled={busy === r.id} onClick={() => remove(r)} className="rounded-lg p-2 text-rouge hover:bg-rouge/10" aria-label="Delete" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-sm text-muted">No registrations here yet.</p>}
      </div>
    </>
  );
}
