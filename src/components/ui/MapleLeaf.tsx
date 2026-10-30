export const MAPLE_PATH =
  'M50 2 L58 20 L66 14 L64 38 L78 26 L82 34 L96 32 L90 46 L98 50 L74 68 L78 78 L54 74 L55 98 L45 98 L46 74 L22 78 L26 68 L2 50 L10 46 L4 32 L18 34 L22 26 L36 38 L34 14 L42 20 Z';

export function MapleLeaf({ className, size = 18 }: { className?: string; size?: number | string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden fill="currentColor">
      <path d={MAPLE_PATH} />
    </svg>
  );
}
