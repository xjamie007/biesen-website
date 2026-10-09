/**
 * Inhaltsregeln (B4, B5, C8, E): keine Vorgängerfirmen, keine Gründungsjahre, kein 24/7,
 * keine Werbewörter, keine Bewertungen. Gilt für Übersetzungen und Inhaltsdateien.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Texte und Inhalte, keine Code-Kommentare (den fertigen Build prüft scripts/check-dist.ts)
const ROOT = fileURLToPath(new URL('../src/', import.meta.url));
const ORDNER = ['i18n', 'content'].map((o) => join(ROOT, o));
function dateien(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === '_dev' ? [] : dateien(p);
    return /\.(ts|astro|yaml|json|css)$/.test(n) ? [p] : [];
  });
}

const REGELN: [RegExp, string][] = [
  [/Kaufmann/i, 'Kaufmann & Biesen nie erwähnen'],
  [/Rucken/i, 'Rucken nie erwähnen'],
  [/\b(1965|1976)\b/, 'keine Gründungsjahre'],
  [/seit \d{4}|since \d{4}|depuis \d{4}|zënter \d{4}/i, 'kein „seit X“'],
  [/Jahre Erfahrung|years of experience|ans d.expérience|Joer Erfarung/i, 'keine Jahre Erfahrung'],
  [/24\s*\/\s*7|24h|24 h\b/i, 'kein 24/7'],
  [/Notdienst|service d.urgence|emergency service|Noutdéngscht/i, 'kein Notdienst'],
  [/maßgeschneidert|erstklassig|innovativ|hochmodern|sur mesure|haut de gamme|state-of-the-art|cutting-edge/i, 'keine Werbewörter'],
  [/97\s*%/, 'keine Prozent-Erfolge'],
  [/Karin|Thilmany|★/i, 'keine Bewertungen ohne Erlaubnis'],
  [/foundingDate|aggregateRating/, 'kein foundingDate/aggregateRating'],
  [/fonts\.googleapis|fonts\.gstatic|googletagmanager|gtag\(/i, 'keine Google-Einbindungen'],
  [/\bStreif\b/i, 'Herstellername nur nach Freigabe'],
];

describe('Inhaltsregeln', () => {
  for (const f of ORDNER.flatMap(dateien)) {
    it(f.slice(ROOT.length), () => {
      const text = readFileSync(f, 'utf8');
      for (const [re, regel] of REGELN) expect(re.test(text), `${regel} (${re})`).toBe(false);
    });
  }
});
