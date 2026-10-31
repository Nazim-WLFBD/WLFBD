import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Lesson videos are embedded from these players only (see src/lib/embed.ts)
const FRAME_SRC = ['https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com'];

const securityHeaders = [
  // The site is never shown inside another site's frame (clickjacking of the admin portal)
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Content-Security-Policy',
    // facebook.com entries keep the Meta Pixel working (it posts a form and opens a hidden frame)
    value: [
      `frame-ancestors 'none'`,
      `frame-src ${FRAME_SRC.join(' ')} https://*.firebaseapp.com https://www.facebook.com`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self' https://www.facebook.com`,
    ].join('; '),
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
