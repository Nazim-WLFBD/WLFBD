import Link from 'next/link';
import './globals.css';

// Fallback for addresses outside /en and /bn (the root layout has no <html> of its own).
// There is no locale here, so both languages are shown side by side.
export default function RootNotFound() {
  const button = { color: '#fff', padding: '12px 22px', borderRadius: 999, textDecoration: 'none', display: 'inline-block' } as const;
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a1230', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
          <div>
            <p style={{ letterSpacing: '0.3em', color: '#e8b64a', fontSize: 13 }}>GATE 404</p>
            <h1 style={{ fontSize: 40, margin: '12px 0 4px' }}>Page not found</h1>
            <p lang="bn" style={{ fontSize: 22, margin: '0 0 12px', opacity: 0.8 }}>
              পেজটি পাওয়া যায়নি
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 12 }}>
              <Link href="/en" style={{ ...button, background: '#e0243a' }}>
                Back to home
              </Link>
              <Link href="/bn" lang="bn" style={{ ...button, background: 'rgba(255,255,255,.12)' }}>
                হোমে ফিরে যান
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
