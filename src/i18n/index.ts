import de, { type Dict } from './de.ts';
import fr from './fr.ts';
import lb from './lb.ts';
import en from './en.ts';
import { intlLocale, type Lang } from './config.ts';

export type { Dict };

export const DICTS: Record<Lang, Dict> = { fr, de, lb, en };

/* ------------------------------------------------------------------
   Typografie
------------------------------------------------------------------- */
const NNBSP = '\u202F';
const NBSP = '\u00A0';

/** Französisch: schmales geschütztes Leerzeichen vor ? ! ; und in « », geschütztes vor :. */
export function frenchTypo(s: string): string {
  return s
    .replace(/ ([?!;])/g, `${NNBSP}$1`)
    .replace(/ :(?=\s|$)/g, `${NBSP}:`)
    .replace(/« /g, `«${NNBSP}`)
    .replace(/ »/g, `${NNBSP}»`);
}

/** In allen Sprachen: geschützte Leerzeichen zwischen Zahl und Einheit, in Telefonnummern und Uhrzeiten. */
export function commonTypo(s: string): string {
  return s
    .replace(/(\d) (m²|m|km|MB|Mo|cm|%|€|Auer|Uhr)(?![\p{L}])/gu, `$1${NBSP}$2`)
    .replace(/\b95 80 99( 13)?\b/g, (m) => m.replace(/ /g, NBSP))
    .replace(/(\+352) 95/g, `$1${NBSP}95`);
}

type Deep = string | string[] | { [k: string]: Deep };

function mapDeep(v: Deep, f: (s: string) => string, key = ''): Deep {
  if (typeof v === 'string') return key === 'title' || key === 'description' ? v : f(v);
  if (Array.isArray(v)) return v.map(f);
  const out: Record<string, Deep> = {};
  for (const [k, x] of Object.entries(v)) out[k] = mapDeep(x, f, k);
  return out;
}

/**
 * Luxemburgisch: Browser haben kein Trennwörterbuch, `hyphens: auto` greift nicht.
 * Weiche Trennstriche an den Fugen langer Komposita, damit am Handy nichts überläuft.
 */
const SHY = '\u00AD';
const LB_SOFT_HYPHENS: [RegExp, string][] = [
  [/Elektroinstallatioun/g, `Elektro${SHY}installatioun`],
  [/Photovoltaikanlag/g, `Photovoltaik${SHY}anlag`],
  [/Haushaltsapparat/g, `Haushalts${SHY}apparat`],
  [/Luedstatioun/g, `Lued${SHY}statioun`],
  [/Brandmeldeanlag/g, `Brandmelde${SHY}anlag`],
  [/Videoiwwerwaachung/g, `Video${SHY}iwwerwaachung`],
  [/Dateschutzerklärung/g, `Dateschutz${SHY}erklärung`],
  [/Sécherheetstechnik/g, `Sécherheets${SHY}technik`],
  [/Gemeinschaftsantennen/g, `Gemeinschafts${SHY}antennen`],
  [/Sécherungskaschten/g, `Sécherungs${SHY}kaschten`],
  [/Familljebetrib/g, `Famillje${SHY}betrib`],
  [/Elektrobetrib/g, `Elektro${SHY}betrib`],
];

function lbHyphenate(s: string): string {
  return LB_SOFT_HYPHENS.reduce((acc, [re, rep]) => acc.replace(re, rep), s);
}

const cache = new Map<Lang, Dict>();

/** Übersetzungen einer Sprache, mit Typografie. Title und Description bleiben unverändert. */
export function useT(lang: Lang): Dict {
  let d = cache.get(lang);
  if (!d) {
    const typo = (s: string) => {
      let out = commonTypo(s);
      if (lang === 'fr') out = frenchTypo(out);
      if (lang === 'lb') out = lbHyphenate(out);
      return out;
    };
    d = mapDeep(DICTS[lang] as unknown as Deep, typo) as unknown as Dict;
    cache.set(lang, d);
  }
  return d;
}

/** Typografie für Inhalte aus src/content (Projekte, Jobs). */
export function typo(lang: Lang, s: string): string {
  let out = commonTypo(s);
  if (lang === 'fr') out = frenchTypo(out);
  if (lang === 'lb') out = lbHyphenate(out);
  return out;
}

/* ------------------------------------------------------------------
   Platzhalter, Interpolation, Plural
------------------------------------------------------------------- */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function plural(lang: Lang, forms: { one: string; other: string }, n: number): string {
  const rule = new Intl.PluralRules(intlLocale(lang)).select(n);
  return fmt(rule === 'one' ? forms.one : forms.other, { n });
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** [FEHLT …] und [UNBESTÄTIGT …] – interne Hinweise, sichtbar markiert */
export const OPEN_POINT_RE = /\[(FEHLT|UNBESTÄTIGT)(?:\s*[—–:-]\s*([^\]]*))?\]/g;

export function hasOpenPoint(s: string): boolean {
  OPEN_POINT_RE.lastIndex = 0;
  const hit = OPEN_POINT_RE.test(s);
  OPEN_POINT_RE.lastIndex = 0;
  return hit;
}

/** Text ohne Platzhalter (für JSON-LD, Meta-Angaben). */
export function stripOpenPoints(s: string): string {
  return s.replace(OPEN_POINT_RE, '').replace(/\s{2,}/g, ' ').trim();
}

/** Bleibt ohne Platzhalter noch Text übrig? */
export function hasContent(s: string): boolean {
  return stripOpenPoints(s).replace(/[\s.:;,–—-]/g, '').length > 0;
}

/**
 * Text → HTML für set:html: maskiert, markiert Platzhalter sichtbar (<mark class="offen">)
 * und ersetzt {name} durch vorbereitetes HTML (Links, Telefon).
 */
export function rich(s: string, html: Record<string, string> = {}): string {
  return escapeHtml(s)
    .replace(OPEN_POINT_RE, (m) => `<mark class="offen">${m}</mark>`)
    .replace(/\{(\w+)\}/g, (m, k) => (k in html ? html[k] : m));
}

/** Nur Text mit Platzhaltern, ohne Ersetzungen: für reine Textstellen (Überschriften, Labels). */
export function textOnly(s: string, vars: Record<string, string | number> = {}): string {
  return stripOpenPoints(fmt(s, vars));
}
