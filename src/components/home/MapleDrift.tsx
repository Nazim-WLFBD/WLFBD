'use client';

import { useMemo } from 'react';
import { MAPLE_PATH } from '@/components/ui/MapleLeaf';

/**
 * Maple leaves drifting down the left side of the hero. Pure CSS animation (see
 * leaf-fall / leaf-sway in globals.css). Always rendered, so the server and client markup match;
 * reduced-motion users never see it thanks to `motion-reduce:hidden`.
 */
export function MapleDrift({ count = 14 }: { count?: number }) {
  // Deterministic pseudo-random layout so server and client render the same leaves
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Two decimals: the server and the browser then serialize identical style strings (no hydration diff)
        const r = (n: number) => Math.round(((((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1) * 100) / 100;
        const f = (v: number) => Math.round(v * 100) / 100;
        return {
          left: f(2 + r(1) * 40), // % of the hero width: left side only
          size: f(14 + r(2) * 22),
          dur: f(14 + r(3) * 12),
          delay: f(-r(4) * 26),
          x: f(40 + r(5) * 120),
          rot: f(200 + r(6) * 300),
          sway: f(20 + r(7) * 50),
          swayDur: f(4 + r(8) * 4),
          o: f(0.35 + r(9) * 0.5),
          tone: r(10) > 0.7 ? '#ffb3ab' : r(10) > 0.35 ? '#e8463a' : '#d52b1e',
        };
      }),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden motion-reduce:hidden">
      {leaves.map((l, i) => (
        <span
          key={i}
          className="absolute top-0 block will-change-transform"
          style={
            {
              left: `${l.left}%`,
              animation: `leaf-fall ${l.dur}s linear ${l.delay}s infinite`,
              '--leaf-x': `${l.x}px`,
              '--leaf-r': `${l.rot}deg`,
              '--leaf-o': String(l.o),
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 100 100"
            width={l.size}
            height={l.size}
            fill={l.tone}
            style={{ animation: `leaf-sway ${l.swayDur}s ease-in-out ${l.delay}s infinite`, '--leaf-sway': `${l.sway}px`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.25))' } as React.CSSProperties}
          >
            <path d={MAPLE_PATH} />
          </svg>
        </span>
      ))}
    </div>
  );
}
