import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface Props {
  tag: string;
  title: React.ReactNode;
  intro?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** Eyebrow stamp + display headline + intro, used at the top of each section. */
export function SectionHeading({ tag, title, intro, align = 'left', dark, className, children }: Props) {
  return (
    <Reveal
      className={cn(
        'mb-12 flex flex-col gap-5 md:mb-16',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]',
          dark ? 'border-white/15 text-gold' : 'border-line text-rouge',
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {tag}
      </span>
      <h2
        className={cn(
          'font-display max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04] font-semibold text-balance',
          dark ? 'text-white' : 'text-fg',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn('max-w-2xl text-lg leading-relaxed text-pretty', dark ? 'text-white/70' : 'text-muted')}>
          {intro}
        </p>
      )}
      {children}
    </Reveal>
  );
}
