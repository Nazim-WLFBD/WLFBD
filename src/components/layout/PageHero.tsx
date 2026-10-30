import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
  className?: string;
}

/** Dark header band for inner pages (sits under the fixed site header). */
export function PageHero({ eyebrow, title, intro, crumbs, children, className }: Props) {
  return (
    <section className={cn('relative overflow-hidden bg-ink pt-32 pb-16 text-white md:pt-40 md:pb-20', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/3 h-[520px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(39,71,216,.35),transparent)]" />
        <div className="dots absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      </div>
      <div className="container-x relative">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={14} />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/85">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>}
        <h1 className="font-display max-w-4xl text-[clamp(2.3rem,5.6vw,4.4rem)] leading-[1.02] font-semibold text-balance">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</div>}
        {children}
      </div>
    </section>
  );
}
