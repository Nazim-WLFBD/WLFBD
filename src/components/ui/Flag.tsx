import { cn } from '@/lib/utils';
import { MapleLeaf } from './MapleLeaf';

/** Small drawn flags (flag emoji don't render on Windows). */
export function Flag({ country, className }: { country: 'fr' | 'ca' | 'bd' | 'globe'; className?: string }) {
  const base = cn('inline-flex h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10 align-[-1px]', className);
  if (country === 'fr')
    return (
      <span className={base} aria-hidden>
        <i className="flex-1 bg-[#002395]" />
        <i className="flex-1 bg-white" />
        <i className="flex-1 bg-[#ED2939]" />
      </span>
    );
  if (country === 'ca')
    return (
      <span className={base} aria-hidden>
        <i className="w-1/4 bg-[#D80621]" />
        <i className="flex flex-1 items-center justify-center bg-white text-[#D80621]">
          <MapleLeaf size={8} />
        </i>
        <i className="w-1/4 bg-[#D80621]" />
      </span>
    );
  if (country === 'bd')
    return (
      <span className={cn(base, 'items-center justify-center bg-[#006A4E]')} aria-hidden>
        <i className="-ml-0.5 h-2 w-2 rounded-full bg-[#F42A41]" />
      </span>
    );
  return (
    <span className={cn(base, 'items-center justify-center bg-bleu text-[8px] text-white ring-0')} aria-hidden>
      ●
    </span>
  );
}
