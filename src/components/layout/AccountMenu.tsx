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
  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/85 outline-none data-[highlighted]:bg-white/10 data-[highlighted]:text-white';

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
        className="flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-medium whitespace-nowrap text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        <UserRound size={16} />
        {t(ui.login)}
      </Link>
    );
  }

  const name = profile?.displayName || user.email?.split('@')[0] || 'Profile';
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        className="flex h-10 items-center gap-1.5 rounded-full pr-2 pl-1 text-white/80 transition outline-none hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10"
        aria-label="Account menu"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink">
          {name.charAt(0).toUpperCase()}
          {isAdmin && (
            <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink ring-2 ring-ink">
              <ShieldCheck size={10} className="text-gold" />
            </span>
          )}
        </span>
        <ChevronDown size={14} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          align="end"
          sideOffset={12}
          className="z-[60] w-64 rounded-2xl border border-white/10 bg-ink/97 p-1.5 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="px-3 pt-2 pb-3">
            <p className="truncate font-semibold">{name}</p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
          </div>
          <Menu.Separator className="my-1 h-px bg-white/10" />
          <Menu.Item asChild>
            <Link href="/dashboard" className={item}>
              <LayoutDashboard size={16} /> {t({ en: 'My dashboard', bn: 'আমার ড্যাশবোর্ড' })}
            </Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item asChild>
              <Link href="/admin" className={`${item} text-gold data-[highlighted]:text-gold`}>
                <ShieldCheck size={16} /> {t({ en: 'Admin portal', bn: 'অ্যাডমিন পোর্টাল' })}
              </Link>
            </Menu.Item>
          )}
          <Menu.Item onSelect={(e) => (e.preventDefault(), toggleTheme())} className={item}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? t({ en: 'Light mode', bn: 'লাইট মোড' }) : t({ en: 'Dark mode', bn: 'ডার্ক মোড' })}
          </Menu.Item>
          <Menu.Separator className="my-1 h-px bg-white/10" />
          <Menu.Item onSelect={() => logOut()} className={item}>
            <LogOut size={16} /> {t({ en: 'Log out', bn: 'লগআউট' })}
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
