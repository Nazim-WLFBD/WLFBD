"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useT } from "@/i18n/t";
import { Logo } from "@/components/ui/Logo";
import { btn } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCourses } from "@/components/CoursesProvider";
import { RECORDED_COURSES } from "@/data/recordedCourses";
import { BRAND_CONTACT } from "@/lib/brand";
import { NAV, MEGA } from "@/content/nav";
import { ui } from "@/content/home";
import { cn, taka } from "@/lib/utils";
import { LangSwitch } from "./LangSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { openPalette } from "./CommandPalette";
import { AccountMenu } from "./AccountMenu";
import { LangToggle } from "./LangToggle";
import { useAuth } from "@/components/auth/AuthContext";
import type { Course } from "@/types";

type MenuId = "courses" | "practice" | null;

/** Short course name for menus: the part before " - " in the visitor's language. */
function courseName(c: Course, locale: string) {
  return (locale === "bn" ? c.banglaTitle || c.title : c.title).split(" - ")[0];
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(null);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    // Escape closes the mega menu (resets aria-expanded on its trigger) and the drawer
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      setDrawer(false);
    };
    // Close the mega menu when tapping/clicking anywhere outside the header
    const onDown = (e: PointerEvent) =>
      !(e.target as Element).closest?.("header") && setMenu(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const open = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(id);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 220);
  };

  const { courses: live, combos } = useCourses();

  // One slim institutional bar: navy with a maple-red hairline on top. Transparent over the home hero,
  // solid once the page scrolls and always solid on inner pages (some start with a light section).
  const pill = "flex h-[64px] items-center text-white";
  const solid = scrolled || !!menu || pathname !== "/";

  return (
    <header
      className={cn(
        // Safe-area padding keeps the bar clear of notches (viewport-fit=cover). Below lg the solid bar is opaque
        // with no backdrop blur (costly on phone GPUs while scrolling); the frosted look starts at lg.
        "fixed inset-x-0 top-0 z-50 border-t-[3px] border-rouge pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,border-color] duration-500",
        solid
          ? "bg-ink shadow-[0_12px_32px_-20px_rgba(0,0,0,.7)] border-b border-b-white/10 lg:bg-ink/95 lg:backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container-x flex max-w-[1280px] items-center justify-between gap-3">
        {/* Brand */}
        <Link
          href="/"
          aria-label={t(ui.homepage)}
          className={cn(pill, "shrink-0")}
        >
          <span className="hidden xl:block">
            <Logo size={46} priority />
          </span>
          <span className="xl:hidden">
            <Logo size={40} showText={false} />
          </span>
        </Link>

        {/* Centre navigation */}
        <nav
          className={cn(pill, "hidden gap-1 lg:flex")}
          aria-label={t(ui.mainNav)}
          onMouseLeave={scheduleClose}
        >
          <MenuTrigger
            id="courses"
            label={t(NAV.courses)}
            menu={menu}
            open={open}
          />
          <MenuTrigger
            id="practice"
            label={t(NAV.practice)}
            menu={menu}
            open={open}
            badge={t(ui.free)}
          />
          <NavLink href={{ pathname: "/", hash: "schedule" }}>
            {t(NAV.schedule)}
          </NavLink>
          <NavLink href={{ pathname: "/", hash: "about" }}>
            {t(NAV.about)}
          </NavLink>
          <NavLink href="/blog">{t(NAV.blog)}</NavLink>
        </nav>

        {/* Actions */}
        <div className={cn(pill, "shrink-0 gap-0.5")}>
          <button
            onClick={openPalette}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white lg:h-10 lg:w-10"
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
          <Link
            href="/enroll"
            className={btn(
              "rouge",
              "sm",
              "ml-1 hidden h-11 whitespace-nowrap sm:inline-flex sm:h-11",
            )}
          >
            {t(ui.enroll)}
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 lg:hidden"
            onClick={() => setDrawer((d) => !d)}
            aria-label={t(ui.menu)}
            aria-expanded={drawer}
          >
            {drawer ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mega menus: anchored to the bottom of the bar, so opening never moves the page */}
      <AnimatePresence>
        {menu && (
          <motion.div
            id={`mega-${menu}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => open(menu)}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full hidden justify-center lg:flex"
          >
            {/* Hover bridge: keeps the menu open while the pointer crosses the gap under the bar */}
            <span aria-hidden className="absolute inset-x-0 -top-3 h-3" />
            <motion.div
              layout="size"
              transition={{
                layout: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              }}
              className="w-full max-w-[1040px] overflow-hidden rounded-b-[var(--radius)] border border-t-0 border-line bg-surface text-fg shadow-[var(--shadow-lift)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menu}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {menu === "courses" ? (
                    <div className="grid grid-cols-[1.55fr_1fr]">
                      <div className="p-6">
                        <p className="eyebrow mb-4 text-rouge">
                          {t(MEGA.live)}
                        </p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                          {live.map((c) => (
                            <Link
                              key={c.id}
                              href={`/courses/${c.id}`}
                              className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-surface-2"
                            >
                              <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-soft text-sm font-bold text-rouge transition group-hover:bg-rouge group-hover:text-white">
                                {c.code}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">
                                  {courseName(c, t.locale)}
                                </span>
                                <span className="block truncate text-xs text-muted">
                                  {c.isCustomPricing
                                    ? t.locale === "bn"
                                      ? (c.banglaTargetClb ?? c.targetClb)
                                      : c.targetClb
                                    : `${taka(c.offerPrice, t.locale)} · ${t.locale === "bn" ? (c.banglaDuration ?? c.duration) : c.duration.split(" (")[0]}`}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/courses"
                          className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold text-rouge hover:underline"
                        >
                          {t(MEGA.allCourses)} <ArrowUpRight size={14} />
                        </Link>
                      </div>
                      <div className="flex flex-col gap-5 border-l border-line bg-bg p-6">
                        <div>
                          <p className="eyebrow mb-3 text-rouge">
                            {t(MEGA.recorded)}
                          </p>
                          {RECORDED_COURSES.map((r) => (
                            <Link
                              key={r.id}
                              href={`/recorded/${r.slug}`}
                              className="flex items-center justify-between border-t border-line py-2.5 text-sm transition first-of-type:border-t-0 hover:text-rouge"
                            >
                              <span className="font-semibold">
                                DELF {r.level} · {t(ui.recorded)}
                              </span>
                              <span className="text-muted">
                                {taka(r.offerPrice, t.locale)}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div>
                          <p className="eyebrow mb-3 text-rouge">
                            {t(MEGA.combos)}
                          </p>
                          {combos.map((c) => (
                            <Link
                              key={c.id}
                              href={{ pathname: "/courses", hash: "combos" }}
                              className="flex items-center justify-between border-t border-line py-2.5 text-sm transition first-of-type:border-t-0 hover:text-rouge"
                            >
                              <span className="font-semibold">
                                {c.courses.join(" + ")}
                              </span>
                              <span className="text-muted">
                                {taka(c.combinedFee, t.locale)}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/quiz/placement-test"
                          className="accent-top mt-auto rounded-xl bg-ink p-4 text-white transition hover:bg-ink-3"
                        >
                          <span className="block text-sm font-bold">
                            {t(MEGA.unsure)}
                          </span>
                          <span className="text-xs text-white/70">
                            {t(MEGA.unsureSub)}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 divide-x divide-line p-2">
                      {MEGA.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="group flex flex-col gap-3 rounded-xl p-5 transition hover:bg-surface-2"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-soft text-bleu transition group-hover:bg-rouge group-hover:text-white">
                            <Icon name={tool.icon} size={20} />
                          </span>
                          <span className="text-sm font-bold">{t(tool.t)}</span>
                          <span className="text-xs leading-relaxed text-muted">
                            {t(tool.s)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
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
            className="mx-3 mt-2 mb-3 flex max-h-[calc(100dvh-96px-env(safe-area-inset-top))] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink text-white shadow-2xl lg:hidden"
          >
            {/* Scrolling middle: courses + tools. Primary actions stay pinned in the footer below. */}
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto p-4 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {live.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/5 p-3"
                >
                  <span className="font-display flex h-9 w-9 items-center justify-center rounded-lg bg-rouge text-xs font-bold">
                    {c.code}
                  </span>
                  <span className="text-[13px] leading-tight font-semibold">
                    {courseName(c, t.locale)}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-col divide-y divide-white/10 rounded-2xl bg-white/[.03] px-2">
              {MEGA.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold"
                >
                  <Icon name={tool.icon} size={18} className="text-gold" />
                  {t(tool.t)}
                </Link>
              ))}
              <Link
                href="/recorded"
                className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold"
              >
                <Icon name="video" size={18} className="text-gold" />
                {t(MEGA.recorded)}
              </Link>
              <Link
                href={{ pathname: "/", hash: "schedule" }}
                className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold"
              >
                <Icon name="calendar" size={18} className="text-gold" />
                {t(NAV.schedule)}
              </Link>
              <Link
                href={{ pathname: "/", hash: "about" }}
                className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold"
              >
                <Icon name="globe" size={18} className="text-gold" />
                {t(NAV.about)}
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 px-2 py-3.5 text-[15px] font-semibold"
              >
                <Icon name="book" size={18} className="text-gold" />
                {t(NAV.blog)}
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-white/50">
              {t(ui.whatsapp)}: {BRAND_CONTACT.whatsapp}
            </p>
            </div>

            {/* Pinned footer: account, Enroll / Free class, language + theme */}
            <div className="shrink-0 border-t border-white/10 bg-ink p-4 pt-3">
              <MobileAccount />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/enroll" className={btn("rouge", "md")}>
                  {t(ui.enroll)}
                </Link>
                <Link href="/free-class" className={btn("ghost-light", "md")}>
                  {t(NAV.freeClass)}
                </Link>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <LangSwitch />
                <ThemeToggle />
              </div>
            </div>
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
  const row =
    "flex items-center justify-center gap-2 rounded-2xl bg-white/5 py-3 text-sm font-semibold";
  if (!user)
    return (
      <Link href="/login" className={row}>
        <UserRound size={16} /> {t(ui.login)}
      </Link>
    );
  return (
    <div
      className={cn("grid gap-2", isAdmin ? "grid-cols-3" : "grid-cols-2")}
    >
      <Link href="/dashboard" className={row}>
        <LayoutDashboard size={16} /> {t({ en: "Dashboard", bn: "ড্যাশবোর্ড" })}
      </Link>
      {isAdmin && (
        <Link href="/admin" className={cn(row, "text-gold")}>
          <ShieldCheck size={16} /> {t(ui.admin)}
        </Link>
      )}
      <button onClick={logOut} className={row}>
        <LogOut size={16} /> {t({ en: "Log out", bn: "লগআউট" })}
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
      type="button"
      onMouseEnter={() => open(id)}
      onFocus={() => open(id)}
      // Click only ever opens (hover usually got there first); Escape / outside pointerdown close
      onClick={() => !active && open(id)}
      aria-expanded={active}
      aria-haspopup="true"
      aria-controls={`mega-${id}`}
      className={cn(
        "relative flex h-10 items-center gap-1.5 px-3 text-[14px] font-medium whitespace-nowrap text-white/80 transition hover:text-white after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[#ffb3ab] after:transition-transform hover:after:scale-x-100",
        active && "text-white after:scale-x-100",
      )}
    >
      {label}
      {badge && (
        <span className="rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-ink">
          {badge}
        </span>
      )}
      <ChevronDown
        size={14}
        className={cn("transition-transform", active && "rotate-180")}
      />
    </button>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-10 items-center px-3 text-[14px] font-medium whitespace-nowrap text-white/80 transition hover:text-white after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[#ffb3ab] after:transition-transform hover:after:scale-x-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}
