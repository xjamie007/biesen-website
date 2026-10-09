/**
 * Prüft den fertigen Build in dist/ (läuft nach `astro build`, siehe package.json):
 * - keine Testflächen (src/assets/_dev) im Build
 * - keine Google-CDN, kein Analytics, kein Tag Manager, keine externen Skripte oder Stylesheets
 * - keine verbotenen Namen und Formulierungen (B4, C8)
 * - eine h1 pro Seite, lang, Canonical, hreflang (4 + x-default) auf indexierbaren Seiten
 * - keine toten internen Links und Anker
 * Bricht mit Exit-Code 1 ab, wenn etwas nicht stimmt.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { load } from 'cheerio';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/%20/g, ' ');
const BASE = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const fehler: string[] = [];

function alle(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? alle(p) : [p];
  });
}

const dateien = alle(DIST);
const html = dateien.filter((f) => f.endsWith('.html'));

// 1. Testflächen
for (const f of dateien) if (/test-(tag|abend)/.test(f)) fehler.push(`Testfläche im Build: ${relative(DIST, f)}`);

// 2. Verbotene Einbindungen und Wörter
const VERBOTEN: [RegExp, string][] = [
  [/fonts\.googleapis|fonts\.gstatic/i, 'Google Fonts'],
  [/googletagmanager|google-analytics|gtag\(/i, 'Google Analytics/Tag Manager'],
  [/iubenda/i, 'Cookie-Banner'],
  [/Kaufmann/i, 'Kaufmann (B4)'],
  [/Rucken/i, 'Rucken (B4)'],
  [/24\s*\/\s*7|24h/i, '24/7 (C8)'],
  [/foundingDate|aggregateRating|"review"/, 'JSON-LD-Feld (G3)'],
  [/maßgeschneidert|erstklassig|innovativ|hochmodern/i, 'Werbewort (E)'],
  [/Jahre Erfahrung|years of experience|ans d’expérience|ans d'expérience/i, 'Jahre Erfahrung (B4)'],
];
for (const f of dateien.filter((x) => /\.(html|xml|txt|js|css|json)$/.test(x))) {
  const text = readFileSync(f, 'utf8');
  for (const [re, was] of VERBOTEN) if (re.test(text)) fehler.push(`${was} in ${relative(DIST, f)}`);
}

// 3. Seitenstruktur und Links
/** pfad ohne Basis-Pfad */
const vorhanden = (pfad: string) => {
  const ziel = join(DIST, decodeURIComponent(pfad));
  return existsSync(ziel) && (statSync(ziel).isFile() || existsSync(join(ziel, 'index.html')));
};
const anker = new Map<string, Set<string>>();
const links: { von: string; href: string }[] = [];

for (const f of html) {
  const $ = load(readFileSync(f, 'utf8'));
  const rel = '/' + relative(DIST, f).replace(/index\.html$/, '');
  anker.set(rel, new Set($('[id]').map((_, el) => $(el).attr('id')!).get()));
  const umleitung = $('meta[http-equiv="refresh"]').length > 0;
  const noindex = /noindex/.test($('meta[name="robots"]').attr('content') ?? '');
  if (!umleitung && !rel.startsWith('/404')) {
    if ($('h1').length !== 1) fehler.push(`${rel}: ${$('h1').length} h1`);
    if (!$('html').attr('lang')) fehler.push(`${rel}: lang fehlt`);
    if (!$('link[rel="canonical"]').attr('href')) fehler.push(`${rel}: Canonical fehlt`);
    const danke = /\/(merci|danke|thank-you)\/$/.test(rel);
    if (!danke && $('link[rel="alternate"][hreflang]').length !== 5) fehler.push(`${rel}: hreflang ≠ 4 + x-default`);
    for (const s of $('script[src], link[rel="stylesheet"]').toArray()) {
      const u = $(s).attr('src') ?? $(s).attr('href') ?? '';
      if (/^https?:/.test(u)) fehler.push(`${rel}: externe Einbindung ${u}`);
    }
  }
  $('a[href]').each((_, a) => {
    links.push({ von: rel, href: $(a).attr('href')! });
  });
}

for (const { von, href } of links) {
  if (/^(mailto|tel|https?):/.test(href)) continue;
  const [ohneHash, hash] = href.split('#');
  const pfad = ohneHash.split('?')[0];
  if (pfad !== '' && !pfad.startsWith('/')) continue;
  if (pfad !== '' && BASE && !pfad.startsWith(BASE + '/')) {
    fehler.push(`Link ohne Basis-Pfad auf ${von}: ${href}`);
    continue;
  }
  const ziel = pfad === '' ? von : pfad.slice(BASE.length);
  if (!vorhanden(ziel)) {
    fehler.push(`Toter Link auf ${von}: ${href}`);
    continue;
  }
  if (hash) {
    const ids = anker.get(decodeURIComponent(ziel));
    if (ids && !ids.has(hash)) fehler.push(`Toter Anker auf ${von}: ${href}`);
  }
}

if (fehler.length) {
  console.error(`check-dist: ${fehler.length} Problem(e)\n` + fehler.map((x) => `  - ${x}`).join('\n'));
  process.exit(1);
}
console.log(`check-dist: ${html.length} HTML-Dateien geprüft, alles in Ordnung.`);
