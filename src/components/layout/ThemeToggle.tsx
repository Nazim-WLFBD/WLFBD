'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const THEME_KEY = 'wlf-theme';

/** Inline script that applies the saved theme before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}})();`;

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
