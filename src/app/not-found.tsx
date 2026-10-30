import Link from 'next/link';
import './globals.css';

// Fallback for addresses outside /en and /bn (the root layout has no <html> of its own)
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a1230', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
          <div>
            <p style={{ letterSpacing: '0.3em', color: '#e8b64a', fontSize: 13 }}>GATE 404</p>
            <h1 style={{ fontSize: 40, margin: '12px 0' }}>Page not found</h1>
            <Link href="/en" style={{ color: '#fff', background: '#e0243a', padding: '12px 22px', borderRadius: 999, textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
