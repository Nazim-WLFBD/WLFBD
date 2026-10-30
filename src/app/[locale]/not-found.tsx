import { Link } from '@/i18n/navigation';
import { btn } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink pt-24 text-white">
      <div className="dots pointer-events-none absolute inset-0 opacity-25" />
      <div className="container-x relative">
        <p className="font-mono text-sm tracking-[0.3em] text-gold">GATE 404 · VOL ANNULÉ</p>
        <h1 className="font-display mt-4 text-[clamp(3rem,9vw,7rem)] leading-none font-semibold">
          Oups! <span className="text-rouge italic">Page not found.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-white/65">This flight doesn’t exist. Let’s get you back on route.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={btn('rouge', 'lg')}>
            Back to home
          </Link>
          <Link href="/courses" className={btn('ghost-light', 'lg')}>
            Browse courses
          </Link>
        </div>
      </div>
    </section>
  );
}
