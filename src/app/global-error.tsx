'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Last-resort error boundary: shown when the root/locale layout itself fails, so it renders its own
 * <html> and <body> without any provider. There is no locale here, so both languages are shown.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const button = { color: '#fff', padding: '12px 22px', borderRadius: 999, border: 0, font: 'inherit', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' } as const;
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0e1a2f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
          <div>
            <p style={{ letterSpacing: '0.3em', color: '#c99a3b', fontSize: 13 }}>TURBULENCE</p>
            <h1 style={{ fontSize: 36, margin: '12px 0 4px' }}>Something went wrong</h1>
            <p lang="bn" style={{ fontSize: 22, margin: '0 0 12px', opacity: 0.8 }}>
              কিছু একটা ভুল হয়েছে
            </p>
            {error.digest && <p style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.6 }}>ref {error.digest}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 16 }}>
              <button onClick={reset} style={{ ...button, background: '#d52b1e' }}>
                Try again · আবার চেষ্টা করুন
              </button>
              <Link href="/en" style={{ ...button, background: 'rgba(255,255,255,.12)' }}>
                Home · হোম
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
