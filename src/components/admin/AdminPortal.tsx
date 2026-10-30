'use client';

import { useCallback, useEffect, useState } from 'react';
import { collection, getCountFromServer, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Check, Loader2, RefreshCw, X } from 'lucide-react';
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

type Row = Record<string, unknown> & { id: string };
const TABS = ['Overview', 'Payments', 'Enrollments', 'Users', 'Recorded courses', 'Batches', 'Quiz questions', 'Announcements', 'Certificates', 'Reviews', 'FAQ', 'Audit log'] as const;
type Tab = (typeof TABS)[number];

const fmtDate = (v: unknown) => {
  const s = (v as { seconds?: number })?.seconds;
  return s ? new Date(s * 1000).toLocaleString() : '';
};

export function AdminPortal() {
  const [tab, setTab] = useState<Tab>('Overview');
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('rounded-xl px-4 py-2.5 text-left text-sm font-semibold whitespace-nowrap transition', tab === t ? 'bg-ink text-white dark:bg-bleu' : 'hover:bg-fg/5')}
          >
            {t}
          </button>
        ))}
      </nav>
      <div className="min-w-0 rounded-[24px] border border-line bg-surface p-5 md:p-7">
        <h2 className="font-display mb-5 text-2xl font-semibold">{tab}</h2>
        {tab === 'Overview' && <Overview />}
        {tab === 'Payments' && <Payments />}
        {tab === 'Enrollments' && <Enrollments />}
        {tab === 'Users' && <Users />}
        {tab === 'Recorded courses' && <RecordedEditor />}
        {tab === 'Batches' && (
          <CrudTab
            path="batches"
            columns={['batchName', 'days', 'timeSlot', 'status']}
            seed={BATCH_SCHEDULES as unknown as Record<string, unknown>[]}
            fields={[
              { key: 'batchName', label: 'Name', type: 'text' },
              { key: 'banglaBatchName', label: 'Bangla name', type: 'text' },
              { key: 'days', label: 'Days', type: 'text' },
              { key: 'banglaDays', label: 'Bangla days', type: 'text' },
              { key: 'dayKeys', label: 'Day keys (fri, sat, sun, mon…)', type: 'list' },
              { key: 'timeSlot', label: 'Time slot', type: 'text' },
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
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'banglaTitle', label: 'Bangla title', type: 'text' },
              { key: 'content', label: 'Content', type: 'textarea' },
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
            fields={[
              { key: 'certificateNumber', label: 'Certificate number (e.g. WLF-BD-123456)', type: 'text' },
              { key: 'userName', label: 'Student name', type: 'text' },
              { key: 'courseTitle', label: 'Course', type: 'text' },
              { key: 'cefrLevel', label: 'Level', type: 'text' },
              { key: 'issueDate', label: 'Issue date (YYYY-MM-DD)', type: 'text' },
            ]}
            newDefaults={{ certificateNumber: `WLF-BD-${Math.floor(100000 + Math.random() * 900000)}`, issueDate: new Date().toISOString().slice(0, 10) }}
          />
        )}
        {tab === 'Reviews' && (
          <CrudTab
            path="reviews"
            columns={['name', 'targetCountry', 'rating', 'published']}
            seed={TESTIMONIALS_DATA as unknown as Record<string, unknown>[]}
            fields={[
              { key: 'name', label: 'Name', type: 'text' },
              { key: 'professionRole', label: 'Role', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'targetCountry', label: 'Pathway', type: 'select', options: ['Canada', 'France', 'General'] },
              { key: 'examPassed', label: 'Exam / course', type: 'text' },
              { key: 'score', label: 'Score', type: 'text' },
              { key: 'quote', label: 'Review (English)', type: 'textarea' },
              { key: 'banglaQuote', label: 'Review (Bangla)', type: 'textarea' },
              { key: 'photoUrl', label: 'Photo URL', type: 'text' },
              { key: 'rating', label: 'Rating (1-5)', type: 'number' },
              { key: 'displayOrder', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'checkbox' },
            ]}
            newDefaults={{ rating: 5, published: true, targetCountry: 'General' }}
          />
        )}
        {tab === 'FAQ' && (
          <CrudTab
            path="faq"
            columns={['question', 'category']}
            seed={FAQ_DATA as unknown as Record<string, unknown>[]}
            fields={[
              { key: 'category', label: 'Category', type: 'select', options: ['General', 'Classes', 'Payment', 'Exams', 'Immigration'] },
              { key: 'question', label: 'Question', type: 'text' },
              { key: 'answer', label: 'Answer', type: 'textarea' },
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

function useRows(path: string, order = 'submittedAt', max = 200) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const load = useCallback(async () => {
    const fb = firebase();
    if (!fb) return;
    const s = await getDocs(query(collection(fb.db, path), orderBy(order, 'desc'), limit(max)));
    setRows(s.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, [path, order, max]);
  useEffect(() => {
    load().catch(() => setRows([]));
  }, [load]);
  return { rows, load };
}

function useAction() {
  const { authFetch } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const run = async (key: string, body: Record<string, unknown>) => {
    setBusy(key);
    try {
      const r = await authFetch('/api/admin', { method: 'POST', body: JSON.stringify(body) });
      if (!r.ok) alert((await r.json().catch(() => ({}))).error ?? 'Action failed');
      return r.ok;
    } finally {
      setBusy(null);
    }
  };
  return { busy, run };
}

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
    Promise.all([c('users'), c('enrollments'), c('coursePayments', ['status', 'Pending']), c('certificates')])
      .then(([users, enrollments, pending, certs]) => setStats({ users, enrollments, pending, certs }))
      .catch(() => {});
  }, []);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {[
        ['Students', stats.users],
        ['Enrollments', stats.enrollments],
        ['Payments to verify', stats.pending],
        ['Certificates', stats.certs],
      ].map(([k, v]) => (
        <div key={String(k)} className={cn('rounded-2xl border border-line p-5', k === 'Payments to verify' && Number(v) > 0 && 'border-gold bg-gold/10')}>
          <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{k}</p>
          <p className="font-display mt-1 text-3xl font-semibold">{v ?? '—'}</p>
        </div>
      ))}
    </div>
  );
}

function Payments() {
  const { rows, load } = useRows('coursePayments');
  const { busy, run } = useAction();
  const [filter, setFilter] = useState('Pending');
  if (!rows) return <Loader2 className="animate-spin" />;
  const list = rows.filter((r) => filter === 'All' || r.status === filter);
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {['Pending', 'Verified', 'Rejected', 'All'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-full px-4 py-1.5 text-sm font-semibold', filter === f ? 'bg-ink text-white' : 'border border-line')}>
            {f}
          </button>
        ))}
        <button onClick={load} className="ml-auto rounded-full p-2 hover:bg-fg/10" aria-label="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>
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
            </div>
            <Pill s={p.status} />
            {p.status === 'Pending' && (
              <span className="flex gap-2">
                <button disabled={!!busy} onClick={async () => (await run(p.id, { action: 'approvePayment', paymentId: p.id })) && load()} className={btn('ink', 'sm', 'bg-mint')}>
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
  const { rows, load } = useRows('enrollments', 'enrolledAt');
  const { busy, run } = useAction();
  if (!rows) return <Loader2 className="animate-spin" />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2/60 text-[11px] tracking-wider text-muted uppercase">
          <tr>
            {['Student', 'Course', 'Batch', 'Payment', 'Status', ''].map((h) => (
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
                {e.paymentStatus !== 'Verified' && (
                  <button disabled={!!busy} onClick={async () => (await run(e.id, { action: 'setEnrollmentStatus', enrollmentId: e.id, status: 'Verified' })) && load()} className={btn('ghost', 'sm')}>
                    <Check size={14} /> Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-6 text-sm text-muted">No enrollments yet.</p>}
    </div>
  );
}

function Users() {
  const { rows, load } = useRows('users', 'createdAt', 500);
  const { profile } = useAuth();
  const { busy, run } = useAction();
  const [q, setQ] = useState('');
  if (!rows) return <Loader2 className="animate-spin" />;
  const list = rows.filter((u) => `${u.displayName} ${u.email} ${u.phoneNumber}`.toLowerCase().includes(q.toLowerCase()));
  const superAdmin = profile?.role === 'superAdmin';
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone…" className="mb-4 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm" />
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2/60 text-[11px] tracking-wider text-muted uppercase">
            <tr>
              {['Name', 'Email', 'Phone', 'Goal / level', 'Courses', 'Role'].map((h) => (
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
                  {String(u.targetGoal ?? '')} · {String(u.currentFrenchLevel ?? '')}
                </td>
                <td className="p-3 text-xs">{((u.enrolledCourses as string[]) ?? []).join(', ')}</td>
                <td className="p-3">
                  {superAdmin ? (
                    <select
                      disabled={!!busy}
                      value={String(u.role ?? 'student')}
                      onChange={async (e) => (await run(u.id, { action: 'setRole', uid: u.id, role: e.target.value })) && load()}
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
      <p className="mb-4 text-xs text-muted">Questions added here are shown to students in this quiz, after the built-in questions.</p>
      <CrudTab
        key={quiz}
        path={`quizzes/${quiz}/questions`}
        columns={['prompt', 'category', 'correctAnswer']}
        fields={[
          { key: 'prompt', label: 'Question', type: 'textarea' },
          { key: 'banglaPrompt', label: 'Bangla question (optional)', type: 'text' },
          { key: 'passage', label: 'Reading passage (optional)', type: 'textarea' },
          { key: 'options', label: 'Options', type: 'list', hint: 'One option per line' },
          { key: 'correctAnswer', label: 'Correct answer (exactly as one option)', type: 'text' },
          { key: 'explanation', label: 'Explanation', type: 'textarea' },
          { key: 'category', label: 'Category', type: 'select', options: ['Grammar', 'Vocabulary', 'Reading', 'Listening'] },
          { key: 'cefrLevel', label: 'Level', type: 'select', options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'TEF', 'TCF'] },
          { key: 'points', label: 'Points', type: 'number' },
        ]}
        newDefaults={{ type: 'multiple-choice', category: 'Grammar', cefrLevel: 'A1', points: 1, options: [] }}
      />
    </>
  );
}

function AuditLog() {
  const { rows } = useRows('auditLogs', 'timestamp', 200);
  if (!rows) return <Loader2 className="animate-spin" />;
  return (
    <ul className="divide-y divide-line text-sm">
      {rows.length === 0 && <li className="py-4 text-muted">No actions logged yet.</li>}
      {rows.map((r) => (
        <li key={r.id} className="flex flex-wrap gap-x-4 py-2.5">
          <span className="text-muted">{fmtDate(r.timestamp)}</span>
          <span className="font-semibold">{String(r.actorEmail)}</span>
          <span>{String(r.action)}</span>
          <span className="font-mono text-xs text-muted">{String(r.targetResource)}</span>
        </li>
      ))}
    </ul>
  );
}
