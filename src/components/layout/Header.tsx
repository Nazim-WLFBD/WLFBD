'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, UserRound, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { Logo } from '@/components/ui/Logo';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { COURSES_DATA, COMBO_OFFERS } from '@/data/courses';
import { RECORDED_COURSES } from '@/data/recordedCourses';
import { BRAND_CONTACT } from '@/lib/brand';
import { NAV, MEGA } from '@/content/nav';
import { ui } from '@/content/home';
import { cn, taka } from '@/lib/utils';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle } from './ThemeToggle';
import { openPalette } from './CommandPalette';
import { AccountMenu } from './AccountMenu';
import { LangToggle } from './LangToggle';
import { useAuth } from '@/components/auth/AuthContext';
import type { Course } from '@/types';

type MenuId = 'courses' | 'practice' | null;

/** Short course name for menus: the part before " - " in the visitor's language. */
function courseName(c: Course, locale: string) {
  return (locale === 'bn' ? c.banglaTitle || c.title : c.title).split(' - ')[0];
}

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenu(null);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setMenu(null), setDrawer(false));
    // Close the mega menu when tapping/clicking anywhere outside the header
    const onDown = (e: PointerEvent) => !(e.target as Element).closest?.('header') && setMenu(null);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? 'hidden' : '';
  }, [drawer]);

  const open = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(id);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  const live = COURSES_DATA;

  // One slim institutional bar: navy with a maple-red hairline on top. Transparent over the hero,
  // solid once the page scrolls (and always solid on inner pages, which start with a navy band anyway).
  const pill = 'flex h-[64px] items-center text-white';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-t-[3px] border-rouge transition-[background-color,box-shadow,border-color] duration-500',
        scrolled ? 'bg-ink/95 shadow-[0_12px_32px_-20px_rgba(0,0,0,.7)] backdrop-blur-md border-b border-b-white/10' : 'bg-transparent',
      )}
    >
      <div className="container-x flex max-w-[1280px] items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" aria-label={t(ui.homepage)} className={cn(pill, 'shrink-0')}>
          <span className="hidden xl:block">
            <Logo size={44} light />
          </span>
          <span className="xl:hidden">
            <Logo size={44} light showText={false} />
          </span>
        </Link>

        {/* Centre navigation */}
        <nav className={cn(pill, 'hidden gap-1 lg:flex')} aria-label={t(ui.mainNav)} onMouseLeave={scheduleClose}>
          <MenuTrigger id="courses" label={t(NAV.courses)} menu={menu} open={open} />
          <MenuTrigger id="practice" label={t(NAV.practice)} menu={menu} open={open} badge={t(ui.free)} />
          <NavLink href={{ pathname: '/', hash: 'schedule' }}>{t(NAV.schedule)}</NavLink>
          <NavLink href={{ pathname: '/', hash: 'about' }}>{t(NAV.about)}</NavLink>
          <NavLink href="/blog">{t(NAV.blog)}</NavLink>
        </nav>

        {/* Actions */}
        <div className={cn(pill, 'shrink-0 gap-0.5')}>
          <button
            onClick={openPalette}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
            aria-label={`${t(ui.search)} (Ctrl K)`}
            title="Ctrl K"
          >
            <Search size={17} />
          </button>
          <span className="hidden sm:flex">
            <LangToggle />
          </span>
          <span className="hidden lg:flex">
            <AccountMenu />
          </span>
          <Link href="/enroll" className={btn('rouge', 'sm', 'ml-1 hidden h-11 whitespace-nowrap sm:inline-flex')}>
            {t(ui.enroll)}
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 lg:hidden"
            onClick={() => setDrawer((d) => !d)}
            aria-label={t(ui.menu)}
            aria-expanded={drawer}
          >
            {drawer ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mega menus */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key={menu}
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => open(menu)}
            onMouseLeave={scheduleClose}
            className="mx-auto hidden max-w-[1080px] overflow-hidden rounded-b-[var(--radius)] border border-t-0 border-white/10 bg-ink/97 text-white shadow-2xl backdrop-blur-xl lg:block"
          >
            {menu === 'courses' ? (
              <div className="grid grid-cols-[1.6fr_1fr]">
                <div className="p-6">
                  <p className="mb-3 text-[11px] font-bold tracking-[0.18em] text-gold uppercase">{t(MEGA.live)}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {live.map((c) => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.id}`}
                        className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-white/7"
                      >
                        <span className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/8 text-sm font-bold text-white group-hover:bg-rouge">
                          {c.code}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{courseName(c, t.locale)}</span>
                          <span className="block truncate text-xs text-white/55">
                            {c.isCustomPricing
                              ? (t.locale === 'bn' ? (c.banglaTargetClb ?? c.targetClb) : c.targetClb)
                              : `${taka(c.offerPrice, t.locale)} · ${t.locale === 'bn' ? (c.banglaDuration ?? c.duration) : c.duration.split(' (')[0]}`}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/courses" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline">
                    {t(MEGA.allCourses)} <ArrowUpRight size={14} />
                  </Link>
                </div>
                <div className="flex flex-col gap-4 border-l border-white/10 bg-white/[.03] p-6">
                  <div>
                    <p className="mb-3 text-[11px] font-bold tracking-[0.18em] text-gold uppercase">{t(MEGA.recorded)}</p>
                    {RECORDED_COURSES.map((r) => (
                      <Link
                        key={r.id}
                        href={`/recorded/${r.slug}`}
                        className="flex items-center justify-between rounded-xl p-2.5 text-sm transition hover:bg-white/7"
                      >
                        <span className="font-semibold">
                          DELF {r.level} · {t(ui.recorded)}
                        </span>
                        <span className="text-white/55">{taka(r.offerPrice, t.locale)}</span>
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="mb-3 text-[11px] font-bold tracking-[0.18em] text-gold uppercase">{t(MEGA.combos)}</p>
                    {COMBO_OFFERS.map((c) => (
                      <Link
                        key={c.id}
                        href={{ pathname: '/courses', hash: 'combos' }}
                        className="flex items-center justify-between rounded-xl p-2.5 text-sm transition hover:bg-white/7"
                      >
                        <span className="font-semibold">{c.courses.join(' + ')}</span>
                        <span className="text-white/55">{taka(c.combinedFee, t.locale)}</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/quiz/placement-test"
                    className="mt-auto rounded-2xl bg-rouge/90 p-4 transition hover:bg-rouge"
                  >
                    <span className="block text-sm font-bold">{t(MEGA.unsure)}</span>
                    <span className="text-xs text-white/80">{t(MEGA.unsureSub)}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 p-4">
                {MEGA.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex flex-col gap-3 rounded-2xl p-4 transition hover:bg-white/7"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 text-gold transition group-hover:bg-gold group-hover:text-ink">
                      <Icon name={tool.icon} size={20} />
                    </span>
                    <span className="text-sm font-bold">{t(tool.t)}</span>
                    <span className="text-xs leading-relaxed text-white/55">{t(tool.s)}</span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-h-[calc(100dvh-96px)] overflow-y-auto rounded-[28px] border border-white/10 bg-ink/97 p-4 text-white shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {live.map((c) => (
                <Link key={c.id} href={`/courses/${c.id}`} className="flex items-center gap-2.5 rounded-2xl bg-white/5 p-3">
                  <span className="font-display flex h-9 w-9 items-center justify-center rounded-lg bg-rouge text-xs font-bold">
                    {c.code}
                  </span>
                  <span className="text-[13px] leading-tight font-semibold">{courseName(c, t.locale)}</span>
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-col divide-y divide-white/10 rounded-2xl bg-white/[.03] px-2">
              {MEGA.tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold">
                  <Icon name={tool.icon} size={18} className="text-gold" />
                  {t(tool.t)}
                </Link>
              ))}
              <Link href="/recorded" className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold">
                <Icon name="video" size={18} className="text-gold" />
                {t(MEGA.recorded)}
              </Link>
              <Link href={{ pathname: '/', hash: 'schedule' }} className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold">
                <Icon name="calendar" size={18} className="text-gold" />
                {t(NAV.schedule)}
              </Link>
              <Link href={{ pathname: '/', hash: 'about' }} className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold">
                <Icon name="globe" size={18} className="text-gold" />
                {t(NAV.about)}
              </Link>
              <Link href="/blog" className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold">
                <Icon name="book" size={18} className="text-gold" />
                {t(NAV.blog)}
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <LangSwitch />
              <ThemeToggle />
            </div>
            <MobileAccount />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/enroll" className={btn('rouge', 'md')}>
                {t(ui.enroll)}
              </Link>
              <Link href="/free-class" className={btn('ghost-light', 'md')}>
                {t(NAV.freeClass)}
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-white/50">
              {t(ui.whatsapp)}: {BRAND_CONTACT.whatsapp}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Account links for the mobile drawer. */
function MobileAccount() {
  const t = useT();
  const { user, isAdmin, logOut } = useAuth();
  const row = 'flex items-center justify-center gap-2 rounded-2xl bg-white/5 py-3 text-sm font-semibold';
  if (!user)
    return (
      <Link href="/login" className={cn(row, 'mt-3')}>
        <UserRound size={16} /> {t(ui.login)}
      </Link>
    );
  return (
    <div className={cn('mt-3 grid gap-2', isAdmin ? 'grid-cols-3' : 'grid-cols-2')}>
      <Link href="/dashboard" className={row}>
        <LayoutDashboard size={16} /> {t({ en: 'Dashboard', bn: 'ড্যাশবোর্ড' })}
      </Link>
      {isAdmin && (
        <Link href="/admin" className={cn(row, 'text-gold')}>
          <ShieldCheck size={16} /> {t(ui.admin)}
        </Link>
      )}
      <button onClick={logOut} className={row}>
        <LogOut size={16} /> {t({ en: 'Log out', bn: 'লগআউট' })}
      </button>
    </div>
  );
}

function MenuTrigger({
  id,
  label,
  menu,
  open,
  badge,
}: {
  id: Exclude<MenuId, null>;
  label: string;
  menu: MenuId;
  open: (id: MenuId) => void;
  badge?: string;
}) {
  const active = menu === id;
  return (
    <button
      onMouseEnter={() => open(id)}
      onFocus={() => open(id)}
      onClick={() => open(id)}
      aria-expanded={active}
      className={cn(
        'relative flex h-10 items-center gap-1.5 px-3 text-[14px] font-medium whitespace-nowrap text-white/80 transition hover:text-white after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[#ffb3ab] after:transition-transform hover:after:scale-x-100',
        active && 'text-white after:scale-x-100',
      )}
    >
      {label}
      {badge && (
        <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-ink">{badge}</span>
      )}
      <ChevronDown size={14} className={cn('transition-transform', active && 'rotate-180')} />
    </button>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: React.ComponentProps<typeof Link>['href'];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex h-10 items-center px-3 text-[14px] font-medium whitespace-nowrap text-white/80 transition hover:text-white after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[#ffb3ab] after:transition-transform hover:after:scale-x-100',
        className,
      )}
    >
      {children}
    </Link>
  );
}
