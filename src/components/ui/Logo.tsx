import Image from 'next/image';
import { BRAND_NAME, BRAND_TAGLINE_BANGLA } from '@/lib/brand';
import { cn } from '@/lib/utils';

export function Logo({ size = 44, showText = true, light = false }: { size?: number; showText?: boolean; light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="We Learn French BD official logo"
        width={size}
        height={size}
        priority
        className="rounded-full bg-white ring-2 ring-white/20"
      />
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className={cn('font-display text-[17px] font-semibold tracking-tight', light ? 'text-white' : 'text-fg')}>
            {BRAND_NAME}
          </span>
          <span className={cn('font-bangla text-[11px]', light ? 'text-white/60' : 'text-muted')}>
            {BRAND_TAGLINE_BANGLA}
          </span>
        </span>
      )}
    </span>
  );
}
