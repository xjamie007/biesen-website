/**
 * Liste aller luxemburgischen Texte zur Prüfung durch einen Muttersprachler (review: "lb-native").
 * Quellen: src/i18n/lb.ts, die lb-Felder in src/content/projekte und src/content/jobs, die Slugs.
 * Geprüfte Schlüssel stehen in src/i18n/lb-geprueft.json und fallen aus der Liste.
 *   npm run lb-review   → schreibt LB-REVIEW.md
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';
import de from '../src/i18n/de.ts';
import lb, { REVIEW } from '../src/i18n/lb.ts';
import { PAGE_SLUGS } from '../src/i18n/config.ts';

type Deep = string | string[] | { [k: string]: Deep };
const geprueft = new Set<string>(JSON.parse(readFileSync(new URL('../src/i18n/lb-geprueft.json', import.meta.url), 'utf8')).geprueft);

function blaetter(d: Deep, pfad = ''): [string, string][] {
  if (typeof d === 'string') return [[pfad, d]];
  if (Array.isArray(d)) return d.map((x, i) => [`${pfad}[${i}]`, x]);
  return Object.entries(d).flatMap(([k, v]) => blaetter(v, pfad ? `${pfad}.${k}` : k));
}

const zeilen: { gruppe: string; key: string; de: string; lb: string }[] = [];
const deMap = new Map(blaetter(de as unknown as Deep));
for (const [key, text] of blaetter(lb as unknown as Deep)) {
  // Interne Hinweise [FEHLT]/[UNBESTÄTIGT] sind deutsch und keine Übersetzung
  if (/^\[(FEHLT|UNBESTÄTIGT)[^\]]*\]$/.test(text)) continue;
  zeilen.push({ gruppe: 'Übersetzungsdatei src/i18n/lb.ts', key, de: deMap.get(key) ?? '', lb: text });
}

for (const [page, s] of Object.entries(PAGE_SLUGS)) {
  if (s.lb) zeilen.push({ gruppe: 'URL (D1, „LB: Wörter prüfen“)', key: `slug.${page}`, de: `/de/${s.de}/`, lb: `/lb/${s.lb}/` });
}

function inhalt(ordner: 'projekte' | 'jobs') {
  const dir = new URL(`../src/content/${ordner}/`, import.meta.url);
  for (const datei of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
    const d = parse(readFileSync(new URL(datei, dir), 'utf8'));
    const id = datei.replace(/\.yaml$/, '');
    const walk = (v: unknown, pfad: string) => {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const o = v as Record<string, unknown>;
        if ('lb' in o && 'de' in o) {
          const lbWert = o.lb;
          const deWert = o.de;
          const liste = Array.isArray(lbWert) ? (lbWert as string[]) : [lbWert as string];
          const deListe = Array.isArray(deWert) ? (deWert as string[]) : [deWert as string];
          liste.forEach((x, i) => {
            if (x) zeilen.push({ gruppe: `src/content/${ordner}/${datei}`, key: `${ordner}/${id}.${pfad}${liste.length > 1 ? `[${i}]` : ''}`, de: deListe[i] ?? '', lb: x });
          });
          return;
        }
        for (const [k, x] of Object.entries(o)) walk(x, pfad ? `${pfad}.${k}` : k);
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${pfad}[${i}]`));
    };
    walk(d, '');
  }
}
inhalt('projekte');
inhalt('jobs');

const offen = zeilen.filter((z) => !geprueft.has(z.key));
const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const gruppen = [...new Set(offen.map((z) => z.gruppe))];
const md = [
  '# Luxemburgisch: zur Prüfung durch einen Muttersprachler',
  '',
  `Jeder luxemburgische Text ist ein Entwurf und trägt das Flag \`review: "${REVIEW}"\`, bis er in \`src/i18n/lb-geprueft.json\` eingetragen ist.`,
  'Diese Datei schreibt `npm run lb-review`; bitte nicht von Hand ändern. Korrekturen direkt in `src/i18n/lb.ts` bzw. in den YAML-Dateien, danach den Schlüssel in `lb-geprueft.json` eintragen.',
  '',
  `Stand: ${offen.length} Texte offen, ${zeilen.length - offen.length} geprüft.`,
  '',
  ...gruppen.flatMap((g) => [
    `## ${g}`,
    '',
    '| Schlüssel | Deutsch (Ausgangstext) | Luxemburgisch (Entwurf) |',
    '|---|---|---|',
    ...offen.filter((z) => z.gruppe === g).map((z) => `| \`${z.key}\` | ${esc(z.de)} | ${esc(z.lb)} |`),
    '',
  ]),
].join('\n');
writeFileSync(new URL('../LB-REVIEW.md', import.meta.url), md);
console.log(`LB-REVIEW.md: ${offen.length} Texte zur Prüfung`);
