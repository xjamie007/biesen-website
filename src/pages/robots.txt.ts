import type { APIRoute } from 'astro';
import { withBase } from '@/i18n/config';
import { absolute, VORSCHAU } from '@/lib/site';

// In der Vorschau (PUBLIC_VORSCHAU=1) sperrt robots.txt alle Suchmaschinen.
export const GET: APIRoute = () =>
  new Response(['User-agent: *', VORSCHAU ? 'Disallow: /' : 'Allow: /', '', `Sitemap: ${absolute(withBase('/sitemap.xml'))}`, ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
