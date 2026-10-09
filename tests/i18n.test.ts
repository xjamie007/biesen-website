/** Alle vier Sprachen haben dieselben Schlüssel, dieselben {Platzhalter} und keine leeren Texte (H). */
import { describe, expect, it } from 'vitest';
import { DICTS } from '@/i18n';
import { LANGS } from '@/i18n/config';

type Deep = string | string[] | { [k: string]: Deep };

function blaetter(d: Deep, pfad = ''): Map<string, string | string[]> {
  const out = new Map<string, string | string[]>();
  if (typeof d === 'string' || Array.isArray(d)) {
    out.set(pfad, d);
    return out;
  }
  for (const [k, v] of Object.entries(d)) for (const [p, x] of blaetter(v, pfad ? `${pfad}.${k}` : k)) out.set(p, x);
  return out;
}

const platzhalter = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const de = blaetter(DICTS.de as unknown as Deep);

describe('Übersetzungen', () => {
  for (const lang of LANGS) {
    const d = blaetter(DICTS[lang] as unknown as Deep);
    it(`${lang}: dieselben Schlüssel wie de`, () => {
      expect([...d.keys()].sort()).toEqual([...de.keys()].sort());
    });
    it(`${lang}: dieselben Platzhalter, gleiche Listenlängen, nichts leer`, () => {
      for (const [k, v] of de) {
        const x = d.get(k)!;
        if (Array.isArray(v)) {
          expect(Array.isArray(x), k).toBe(true);
          expect((x as string[]).length, k).toBe(v.length);
        } else {
          expect(platzhalter(x as string), k).toBe(platzhalter(v));
          expect((x as string).trim().length, k).toBeGreaterThan(0);
        }
      }
    });
    it(`${lang}: interne Hinweise [FEHLT]/[UNBESTÄTIGT] an denselben Stellen wie de`, () => {
      for (const [k, v] of de) {
        const offen = (s: string | string[]) => /\[(FEHLT|UNBESTÄTIGT)/.test(String(s));
        expect(offen(d.get(k)!), k).toBe(offen(v));
      }
    });
  }
});
