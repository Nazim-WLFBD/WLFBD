import type { MetadataRoute } from 'next';
import { BRAND_META } from '@/lib/brand';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/en/admin', '/bn/admin', '/en/dashboard', '/bn/dashboard'] }],
    sitemap: `${BRAND_META.canonical}/sitemap.xml`,
  };
}
