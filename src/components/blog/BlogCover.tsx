import {
  Calculator,
  FileCheck,
  GraduationCap,
  Landmark,
  MonitorSmartphone,
  Route,
  Scale,
  SpellCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { Flag } from '@/components/ui/Flag';
import { MAPLE_PATH } from '@/components/ui/MapleLeaf';
import type { BlogCoverTheme, BlogIconKey } from '@/data/blog';
import { cn } from '@/lib/utils';

const ICONS: Record<BlogIconKey, LucideIcon> = {
  route: Route,
  scale: Scale,
  calculator: Calculator,
  'file-check': FileCheck,
  'trending-up': TrendingUp,
  landmark: Landmark,
  'graduation-cap': GraduationCap,
  target: Target,
  'spell-check': SpellCheck,
  'monitor-smartphone': MonitorSmartphone,
};

const THEMES: Record<BlogCoverTheme, { chip: string; glow: string; flag?: 'ca' | 'fr' }> = {
  canada: { chip: 'bg-maple text-white', glow: 'rgba(215,25,32,.20)', flag: 'ca' },
  france: { chip: 'bg-bleu text-white', glow: 'rgba(39,71,216,.22)', flag: 'fr' },
  delf: { chip: 'bg-gold text-ink', glow: 'rgba(232,182,74,.30)', flag: 'fr' },
  neutral: { chip: 'bg-mint text-white', glow: 'rgba(27,156,107,.20)' },
};

interface Props {
  theme: BlogCoverTheme;
  icon: BlogIconKey;
  /** Short, large label drawn on the cover (already localised). */
  label: string;
  /** Accessible description of the illustration (the post's coverAlt). */
  alt: string;
  size?: 'card' | 'hero';
  className?: string;
}

/** Branded cover illustration drawn entirely in code; colours come from theme tokens so it follows dark mode. */
export function BlogCover({ theme, icon, label, alt, size = 'card', className }: Props) {
  const t = THEMES[theme];
  const Icon = ICONS[icon];
  const hero = size === 'hero';
  return (
    <div
      role="img"
      aria-label={alt}
      style={{ containerType: 'inline-size' }}
      className={cn(
        'relative isolate w-full overflow-hidden border border-line bg-surface-2 text-fg',
        hero ? 'aspect-[16/9] rounded-[var(--radius)] md:aspect-[21/9]' : 'aspect-[16/9] rounded-[18px]',
        className,
      )}
    >
      {/* soft theme glow + dotted paper texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(60% 80% at 85% 20%, ${t.glow}, transparent 70%), radial-gradient(var(--line) 1px, transparent 1.5px)`,
          backgroundSize: 'auto, 16px 16px',
        }}
      />

      <Decor theme={theme} />

      {/* brand kicker */}
      <div
        aria-hidden
        className="absolute top-[7%] left-[6%] flex items-center gap-[0.6em] font-bold tracking-[0.18em] text-muted uppercase"
        style={{ fontSize: 'clamp(9px, 2.3cqw, 13px)' }}
      >
        {t.flag && <Flag country={t.flag} />}
        We Learn French BD
      </div>

      {/* icon + label */}
      <div aria-hidden className="absolute bottom-[9%] left-[6%] flex max-w-[60%] flex-col items-start gap-[0.35em]">
        <span
          className={cn('flex items-center justify-center rounded-[28%] shadow-[0_10px_24px_-12px_rgba(10,18,48,.6)]', t.chip)}
          style={{ width: 'clamp(2rem, 10cqw, 4.25rem)', height: 'clamp(2rem, 10cqw, 4.25rem)' }}
        >
          <Icon style={{ width: '52%', height: '52%' }} strokeWidth={2} />
        </span>
        <span
          className="font-display leading-[1.02] font-semibold text-balance [overflow-wrap:anywhere]"
          style={{ fontSize: 'clamp(1.35rem, 9.2cqw, 4.5rem)' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function Decor({ theme }: { theme: BlogCoverTheme }) {
  if (theme === 'canada')
    return (
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="absolute inset-y-0 left-0 w-[2.2%] bg-maple" />
        <span className="absolute inset-y-0 right-0 w-[2.2%] bg-maple" />
        <svg viewBox="0 0 100 100" className="absolute top-1/2 right-[7%] h-[78%] -translate-y-1/2 rotate-[8deg] text-maple">
          <path d={MAPLE_PATH} fill="currentColor" />
        </svg>
        <svg viewBox="0 0 100 100" className="absolute top-[10%] right-[38%] h-[18%] -rotate-12 text-maple/35">
          <path d={MAPLE_PATH} fill="currentColor" />
        </svg>
      </div>
    );

  if (theme === 'france')
    return (
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="tricolor absolute inset-x-0 bottom-0 h-[3.2%]" />
        <svg
          viewBox="0 0 100 160"
          className="absolute right-[9%] bottom-[3.2%] h-[86%] text-bleu"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Eiffel-style tower */}
          <path d="M50 2v12" />
          <path d="M46 14h8l2 40H44z" />
          <path d="M44 54h12" strokeWidth="3" />
          <path d="M44 54 34 104M56 54l10 50" />
          <path d="M30 104h40" strokeWidth="3.2" />
          <path d="M34 104 14 158M66 104l20 54" />
          <path d="M28 158q22-38 44 0" />
          <path d="M38 80h24M36 92h28M46 26h8M45 40h10" opacity=".55" />
          <path d="M36 66l20 26M64 66 44 92M22 132l14-20M78 132 64 112" opacity=".4" />
        </svg>
        <svg viewBox="0 0 40 40" className="absolute top-[14%] right-[42%] h-[12%] text-rouge/50">
          <circle cx="20" cy="20" r="6" fill="currentColor" />
        </svg>
      </div>
    );

  if (theme === 'delf')
    return (
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="tricolor absolute inset-x-0 top-0 h-[2.4%]" />
        <svg viewBox="0 0 120 140" className="absolute top-1/2 right-[8%] h-[80%] -translate-y-[46%]">
          {/* ribbon tails */}
          <path d="M42 78 30 136l16-10 10 14 8-58z" className="fill-bleu" />
          <path d="M78 78l12 58-16-10-10 14-8-58z" className="fill-rouge" />
          {/* rosette */}
          <circle cx="60" cy="56" r="46" className="fill-gold" />
          <circle cx="60" cy="56" r="38" fill="none" stroke="var(--ink)" strokeOpacity=".35" strokeWidth="1.6" strokeDasharray="3 4" />
          <circle cx="60" cy="56" r="28" className="fill-surface" />
          <path d="m47 57 9 9 18-20" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white" />
        </svg>
      </div>
    );

  // neutral: a winding learning route with milestones
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <svg viewBox="0 0 200 120" preserveAspectRatio="xMaxYMid meet" className="absolute top-[9%] right-[4%] w-[54%]">
        <path
          d="M8 110 C 60 110, 50 70, 100 70 S 140 28, 192 18"
          fill="none"
          stroke="var(--muted)"
          strokeOpacity=".55"
          strokeWidth="2.4"
          strokeDasharray="5 6"
          strokeLinecap="round"
        />
        <circle cx="8" cy="110" r="6" className="fill-mint" />
        <circle cx="100" cy="70" r="7" className="fill-gold" />
        <circle cx="150" cy="38" r="5" className="fill-bleu" />
        <circle cx="192" cy="18" r="9" className="fill-rouge" />
        <circle cx="192" cy="18" r="15" fill="none" className="stroke-rouge" strokeOpacity=".35" strokeWidth="2" />
      </svg>
    </div>
  );
}
