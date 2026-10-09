/**
 * Title 50 bis 60 Zeichen, Description 150 bis 160 Zeichen, für jede Seite in jeder Sprache (H, G2),
 * auch für die Job-Seiten. Jeder Title enthält die Marke.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { DICTS } from '@/i18n';
import { LANGS } from '@/i18n/config';

const SEITEN = ['home', 'leistungen', 'installation', 'licht', 'photovoltaik', 'sicherheit', 'hausgeraete', 'projekte', 'ueberUns', 'jobs', 'kontakt', 'danke', 'impressum', 'datenschutz'] as const;

/** Sehr einfacher YAML-Leser für die seo-Blöcke der Job-Dateien */
function jobSeo(datei: string) {
  const text = readFileSync(new URL(`../src/content/jobs/${datei}`, import.meta.url), 'utf8');
  const teil = text.split('\nseo:\n')[1];
  const [titel, beschreibung] = teil.split('\n  description:\n');
  const lies = (block: string) =>
    Object.fromEntries([...block.matchAll(/^\s{4}(de|fr|lb|en): (.*)$/gm)].map((m) => [m[1], m[2]]));
  return { title: lies(titel), description: lies(beschreibung) };
}

describe('Title und Description', () => {
  for (const lang of LANGS) {
    const seo = DICTS[lang].seo;
    for (const s of SEITEN) {
      it(`${lang} ${s}`, () => {
        const { title, description } = seo[s];
        expect(title.length, `Title „${title}“`).toBeGreaterThanOrEqual(50);
        expect(title.length, `Title „${title}“`).toBeLessThanOrEqual(60);
        expect(description.length, `Description „${description}“`).toBeGreaterThanOrEqual(150);
        expect(description.length, `Description „${description}“`).toBeLessThanOrEqual(160);
        expect(title).toMatch(/Biesen/);
      });
    }
  }
  for (const datei of readdirSync(new URL('../src/content/jobs/', import.meta.url))) {
    const { title, description } = jobSeo(datei);
    for (const lang of LANGS) {
      it(`Job ${datei} ${lang}`, () => {
        expect(title[lang].length, title[lang]).toBeGreaterThanOrEqual(50);
        expect(title[lang].length, title[lang]).toBeLessThanOrEqual(60);
        expect(description[lang].length, description[lang]).toBeGreaterThanOrEqual(150);
        expect(description[lang].length, description[lang]).toBeLessThanOrEqual(160);
        expect(title[lang]).toMatch(/Nothum|Noutem/);
      });
    }
  }
});
