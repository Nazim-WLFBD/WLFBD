'use client';

import * as Menu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, LayoutDashboard, LogOut, Moon, ShieldCheck, Sun, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { useAuth } from '@/components/auth/AuthContext';
import { ui } from '@/content/home';
import { THEME_KEY } from './ThemeToggle';

const item =
  'flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fg outline-none data-[highlighted]:bg-surface-2 data-[highlighted]:text-fg';

/** Signed in: avatar that opens Dashboard / Admin / theme / Log out. Signed out: a Login link. */
export function AccountMenu() {
  const t = useT();
  const { user, profile, isAdmin, logOut } = useAuth();
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === 'dark'), []);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setDark(!dark);
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        <UserRound size={16} />
        {t(ui.login)}
      </Link>
    );
  }

  const name = profile?.displayName || user.email?.split('@')[0] || t(ui.profile);
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        className="flex h-10 items-center gap-1.5 rounded-lg pr-2 pl-1 text-white/80 transition outline-none hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10"
        aria-label={t(ui.accountMenu)}
      >
        <span className="font-display relative flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-semibold text-ink">
          {name.charAt(0).toUpperCase()}
          {isAdmin && (
            <span className="absolute -right-1 -bottom-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rouge ring-2 ring-ink">
              <ShieldCheck size={9} className="text-white" />
            </span>
          )}
        </span>
        <ChevronDown size={14} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          sideOffset={12}
          className="accent-top z-[60] w-64 overflow-hidden rounded-[var(--radius)] border border-line bg-surface p-1.5 text-fg shadow-[var(--shadow-lift)]"
        >
          <div className="px-3 pt-3 pb-3">
            <p className="font-display truncate text-base font-semibold">{name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <Menu.Separator className="my-1 h-px bg-line" />
          <Menu.Item asChild>
            <Link href="/dashboard" className={item}>
              <LayoutDashboard size={16} /> {t({ en: 'My dashboard', bn: 'আমার ড্যাশবোর্ড' })}
            </Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item asChild>
              <Link href="/admin" className={`${item} text-rouge data-[highlighted]:text-rouge`}>
                <ShieldCheck size={16} /> {t({ en: 'Admin portal', bn: 'অ্যাডমিন পোর্টাল' })}
              </Link>
            </Menu.Item>
          )}
          <Menu.Item onSelect={(e) => (e.preventDefault(), toggleTheme())} className={item}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? t({ en: 'Light mode', bn: 'লাইট মোড' }) : t({ en: 'Dark mode', bn: 'ডার্ক মোড' })}
          </Menu.Item>
          <Menu.Separator className="my-1 h-px bg-line" />
          <Menu.Item onSelect={() => logOut()} className={item}>
            <LogOut size={16} /> {t({ en: 'Log out', bn: 'লগআউট' })}
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
