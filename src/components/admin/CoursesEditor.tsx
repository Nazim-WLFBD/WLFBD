'use client';

import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { COMBO_OFFERS, COURSES_DATA } from '@/data/courses';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { CrudTab, type Field } from './CrudTab';

/** Badge colour presets used by the built-in courses (Tailwind classes, so they must be literal). */
const TAG_COLORS = [
  'bg-blue-50 text-[#0055A4] border-blue-200',
  'bg-emerald-50 text-emerald-800 border-emerald-200',
  'bg-indigo-50 text-indigo-800 border-indigo-200',
  'bg-purple-50 text-purple-800 border-purple-200',
  'bg-rose-50 text-[#D71920] border-rose-200',
  'bg-amber-50 text-amber-800 border-amber-200',
];

/** Document id for a new row: the English title as a URL slug (used in /courses/<id> links). */
const slugId = (prefix: string) => (r: Record<string, unknown>) => {
  const slug = String(r.title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || `${prefix}-${Date.now()}`;
};

const COURSE_FIELDS: Field[] = [
  { key: 'code', label: 'Code (short badge, e.g. A1, TEF)', type: 'text' },
  { key: 'title', label: 'Title (English; new courses get their link /courses/<id> from it)', type: 'text', required: true },
  { key: 'banglaTitle', label: 'Title (Bangla)', type: 'text' },
  { key: 'duration', label: 'Duration', type: 'text', required: true },
  { key: 'banglaDuration', label: 'Duration (Bangla)', type: 'text' },
  { key: 'classCount', label: 'Number of classes', type: 'number', required: true },
  { key: 'classesPerWeek', label: 'Classes per week', type: 'text' },
  { key: 'banglaClassesPerWeek', label: 'Classes per week (Bangla)', type: 'text' },
  { key: 'targetClb', label: 'Target CLB', type: 'text' },
  { key: 'banglaTargetClb', label: 'Target CLB (Bangla)', type: 'text' },
  { key: 'regularPrice', label: 'Regular price (৳)', type: 'number' },
  { key: 'offerPrice', label: 'Offer price (৳) — what students pay', type: 'number', required: true },
  { key: 'cefrLevel', label: 'CEFR level', type: 'text' },
  { key: 'targetAudience', label: 'Target audience', type: 'textarea' },
  { key: 'banglaTargetAudience', label: 'Target audience (Bangla)', type: 'textarea' },
  { key: 'outcome', label: 'Outcome', type: 'textarea' },
  { key: 'banglaOutcome', label: 'Outcome (Bangla)', type: 'textarea' },
  { key: 'tag', label: 'Tag', type: 'text' },
  { key: 'banglaTag', label: 'Tag (Bangla)', type: 'text' },
  { key: 'tagColor', label: 'Tag colour', type: 'select', options: TAG_COLORS },
  { key: 'features', label: 'Features', type: 'list', hint: 'One feature per line' },
  { key: 'banglaFeatures', label: 'Features (Bangla)', type: 'list', hint: 'One feature per line, same order' },
  { key: 'popular', label: 'Popular (highlighted card)', type: 'checkbox' },
  { key: 'isCustomPricing', label: 'Custom pricing (fee on request, no online payment)', type: 'checkbox' },
  { key: 'whatsappOnly', label: 'WhatsApp only (booked by inquiry, not the enrollment form)', type: 'checkbox' },
  { key: 'published', label: 'Published', type: 'checkbox' },
];

const COMBO_FIELDS: Field[] = [
  { key: 'title', label: 'Title (English)', type: 'text', required: true },
  { key: 'banglaTitle', label: 'Title (Bangla)', type: 'text' },
  { key: 'courses', label: 'Courses included', type: 'list', hint: 'One course name per line, e.g. DELF A1' },
  { key: 'combinedFee', label: 'Combined fee (৳) — what students pay', type: 'number', required: true },
  { key: 'regularValue', label: 'Regular value (৳)', type: 'number' },
  { key: 'eligibility', label: 'Eligibility', type: 'text' },
  { key: 'eligibilityBangla', label: 'Eligibility (Bangla)', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'banglaDescription', label: 'Description (Bangla)', type: 'textarea' },
  { key: 'badge', label: 'Badge', type: 'text' },
  { key: 'banglaBadge', label: 'Badge (Bangla)', type: 'text' },
  { key: 'published', label: 'Published', type: 'checkbox' },
];

// Built-in rows are published; saying so explicitly keeps the checkbox honest after "Import built-in"
const COURSE_SEED = COURSES_DATA.map((c) => ({ ...c, published: true }));
const COMBO_SEED = COMBO_OFFERS.map((c) => ({ ...c, published: true }));

/** Admin editor for the live courses and combo offers shown across the site and priced by /api/enroll. */
export function CoursesEditor() {
  const { authFetch } = useAuth();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  /** Clears the server's course cache and re-renders the pages, so a change shows up now instead of within 5 minutes. */
  const publish = async (quiet = false) => {
    setBusy(true);
    try {
      const r = await authFetch('/api/admin', { method: 'POST', body: JSON.stringify({ action: 'refreshCourses' }) });
      if (!quiet) setNote(r.ok ? 'Published: the site now shows the latest courses.' : 'Could not publish right now; changes still appear within 5 minutes.');
    } catch {
      if (!quiet) setNote('Network error; changes still appear within 5 minutes.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm text-muted">
        <p className="min-w-[240px] flex-1">
          Saved changes are published to the site automatically (otherwise within 5 minutes). Until you import the built-in courses, the website shows its
          built-in list. The <span className="font-semibold text-fg">id</span> column is used in links (/courses/&lt;id&gt;) and is fixed once a course is created.
        </p>
        <button onClick={() => publish()} disabled={busy} className={btn('ink', 'sm')}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Publish changes now
        </button>
        {note && <p className="basis-full text-xs">{note}</p>}
      </div>
      <section>
        <h3 className="font-display mb-4 text-xl font-semibold">Live courses</h3>
        <CrudTab
          path="courses"
          columns={['id', 'code', 'title', 'offerPrice', 'popular', 'whatsappOnly', 'published']}
          fields={COURSE_FIELDS}
          seed={COURSE_SEED}
          seedId={(r) => String(r.id)}
          idFrom={slugId('course')}
          newDefaults={{ published: true, tagColor: TAG_COLORS[0], features: [], banglaFeatures: [] }}
          onSaved={() => publish(true)}
        />
      </section>
      <section>
        <h3 className="font-display mb-4 text-xl font-semibold">Combo offers</h3>
        <CrudTab
          path="combos"
          columns={['id', 'title', 'courses', 'combinedFee', 'published']}
          fields={COMBO_FIELDS}
          seed={COMBO_SEED}
          seedId={(r) => String(r.id)}
          idFrom={slugId('combo')}
          newDefaults={{ published: true, courses: [] }}
          onSaved={() => publish(true)}
        />
      </section>
    </div>
  );
}
