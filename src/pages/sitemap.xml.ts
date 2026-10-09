/**
 * sitemap.xml (H): alle Seiten in vier Sprachen mit hreflang-Alternativen und x-default (fr).
 * Die Danke-Seite (noindex) fehlt bewusst; Job-Seiten nur für offene Stellen.
 */
import type { APIRoute } from 'astro';
import { LANGS, PAGE_SLUGS, alternates, pathFor, type PageKey, type Route } from '@/i18n/config';
import { jobRoute, offeneJobs } from '@/lib/jobs';
import { absolute } from '@/lib/site';

export const GET: APIRoute = async () => {
  const routes: Route[] = [
    ...(Object.keys(PAGE_SLUGS) as PageKey[]).filter((p) => p !== 'danke').map((page) => ({ page })),
    ...(await offeneJobs()).map(jobRoute),
  ];
  const urls = routes.flatMap((route) => {
    const links = [
      ...alternates(route).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${absolute(a.href)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(pathFor('fr', route))}"/>`,
    ].join('\n');
    return LANGS.map((lang) => `  <url>\n    <loc>${absolute(pathFor(lang, route))}</loc>\n${links}\n  </url>`);
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
