'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

/** Subtle 3D tilt + glare that follows the pointer (desktop, motion-allowed only). */
export function Tilt({
  children,
  className,
  max = 5,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty('--gx', `${x * 100}%`);
    el.style.setProperty('--gy', `${y * 100}%`);
    el.style.setProperty('--go', '1');
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--go', '0');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn('relative [perspective:1200px]', className)}
    >
      <div
        className="relative h-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: 'rotateX(var(--rx,0)) rotateY(var(--ry,0))' }}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: 'var(--go, 0)',
            background: 'radial-gradient(500px circle at var(--gx) var(--gy), rgba(255,255,255,.16), transparent 45%)',
          }}
        />
      </div>
    </div>
  );
}
