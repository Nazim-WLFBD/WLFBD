'use client';

import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLDivElement> & { delay?: number; y?: number };

/**
 * Fades and lifts its children into view once, as they scroll in. CSS-driven (see `.reveal` in globals.css):
 * the server HTML is fully visible, and the hidden start state only applies once the inline head script has
 * put `js` on <html>, so content never depends on JavaScript to show. Reduced-motion users get no transition.
 */
export function Reveal({ delay = 0, y = 24, className, style, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', inView && 'is-in', className)}
      style={{ ...(delay ? { '--reveal-delay': `${delay}s` } : null), ...(y !== 24 ? { '--reveal-y': `${y}px` } : null), ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}
