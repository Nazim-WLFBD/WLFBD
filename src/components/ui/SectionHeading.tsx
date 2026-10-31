import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface Props {
  tag: string;
  title: React.ReactNode;
  intro?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  /** Editorial section number, e.g. "02" */
  num?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Editorial section opener: hairline, small-caps eyebrow, serif headline, intro. */
export function SectionHeading({ tag, title, intro, align = 'left', dark, num, className, children }: Props) {
  return (
    <Reveal className={cn('mb-12 md:mb-16', className)}>
      <div className={cn('flex items-center gap-4 border-t pt-5', dark ? 'border-white/15' : 'border-line', align === 'center' && 'justify-center')}>
        <span className={cn('eyebrow', dark ? 'text-gold' : 'text-rouge')}>{tag}</span>
        {num && <span className={cn('section-num ml-auto', dark && 'text-white/50', align === 'center' && 'hidden')}>{num}</span>}
      </div>
      <div className={cn('mt-6 flex flex-col gap-5', align === 'center' && 'items-center text-center')}>
        <h2 className={cn('font-display max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] font-semibold text-balance', dark ? 'text-white' : 'text-fg')}>
          {title}
        </h2>
        {intro && <p className={cn('max-w-2xl text-lg leading-relaxed text-pretty', dark ? 'text-white/70' : 'text-muted')}>{intro}</p>}
        {children}
      </div>
    </Reveal>
  );
}
