/**
 * Alle sichtbaren Texte der vier Sprachen als JSON-Zeilen (Sprache, Schlüssel, Text) für die
 * Rechtschreibprüfung: src/i18n/*.ts, die Sprachfelder in src/content/projekte und src/content/jobs,
 * die Pfade (Slugs).
 *   node --experimental-strip-types scripts/sprache/texte.ts > texte.jsonl
 */
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import de from '../../src/i18n/de.ts';
import fr from '../../src/i18n/fr.ts';
import en from '../../src/i18n/en.ts';
import lb from '../../src/i18n/lb.ts';
import { PAGE_SLUGS } from '../../src/i18n/config.ts';

type Deep = string | number | boolean | null | Deep[] | { [k: string]: Deep };
const SPRACHEN = ['de', 'fr', 'en', 'lb'] as const;
const aus = (lang: string, key: string, text: string) => {
  if (typeof text === 'string' && text.trim()) console.log(JSON.stringify({ lang, key, text }));
};

function blaetter(d: Deep, pfad: string, f: (k: string, v: string) => void) {
  if (typeof d === 'string') return f(pfad, d);
  if (Array.isArray(d)) return d.forEach((x, i) => blaetter(x, `${pfad}[${i}]`, f));
  if (d && typeof d === 'object') for (const [k, v] of Object.entries(d)) blaetter(v, pfad ? `${pfad}.${k}` : k, f);
}

const dicts = { de, fr, en, lb } as Record<string, Deep>;
for (const l of SPRACHEN) blaetter(dicts[l], '', (k, v) => aus(l, `i18n:${k}`, v));

// Inhalte: Felder, die ein Objekt mit allen vier Sprachen sind
function sprachfelder(d: Deep, pfad: string, datei: string) {
  if (Array.isArray(d)) return d.forEach((x, i) => sprachfelder(x, `${pfad}[${i}]`, datei));
  if (!d || typeof d !== 'object') return;
  const o = d as Record<string, Deep>;
  if (SPRACHEN.every((l) => l in o)) {
    for (const l of SPRACHEN) blaetter(o[l], '', (k, v) => aus(l, `${datei}:${pfad}${k ? '.' + k : ''}`, v));
    return;
  }
  for (const [k, v] of Object.entries(o)) sprachfelder(v, pfad ? `${pfad}.${k}` : k, datei);
}
for (const ordner of ['projekte', 'jobs']) {
  const dir = new URL(`../../src/content/${ordner}/`, import.meta.url);
  for (const f of readdirSync(dir)) if (f.endsWith('.yaml')) sprachfelder(parse(readFileSync(new URL(f, dir), 'utf8')), '', `${ordner}/${f}`);
}

// Pfade
for (const [seite, slugs] of Object.entries(PAGE_SLUGS as Record<string, Record<string, string>>))
  for (const l of SPRACHEN) if (slugs[l]) aus(l, `slug:${seite}`, slugs[l].replace(/-/g, ' '));
