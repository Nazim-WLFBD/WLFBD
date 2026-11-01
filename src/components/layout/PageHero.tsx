import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { ui } from '@/content/home';
import { cn } from '@/lib/utils';

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
  className?: string;
}

/** Navy header band for inner pages (sits under the fixed site header). */
export function PageHero({ eyebrow, title, intro, crumbs, children, className }: Props) {
  // useLocale works in both server and client components, which this band is used from
  const locale = useLocale() as Locale;
  return (
    <section className={cn('relative bg-ink pt-32 pb-14 text-white md:pt-40 md:pb-20', className)}>
      <div className="container-x relative">
        {crumbs && (
          <nav aria-label={ui.breadcrumb[locale]} className="mb-6 flex flex-wrap items-center gap-x-3 border-t border-white/15 pt-2 text-[13px] text-white/60">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-px w-4 bg-white/25" />}
                {c.href ? (
                  // Tap target ≥44px tall without widening the row's visual rhythm
                  <Link href={c.href} className="-mx-1 inline-flex min-h-11 min-w-11 items-center px-1.5 py-2.5 transition hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 items-center py-2.5 text-white/85" aria-current="page">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-5 text-[#ffb3ab]">{eyebrow}</p>}
        <h1 className="font-display max-w-4xl text-[clamp(2.3rem,5.6vw,4.4rem)] leading-[1.02] font-semibold text-balance">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</div>}
        {children}
      </div>
      {/* Maple red rule along the band's bottom edge */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-rouge" />
    </section>
  );
}
