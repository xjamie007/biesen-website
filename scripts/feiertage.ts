/**
 * Schreibt die luxemburgischen Feiertage der Jahre VON..BIS in src/content/oeffnungszeiten.json.
 * Reguläre Zeiten und Ausnahmen (Betriebsferien) bleiben unverändert.
 *
 *   npm run feiertage            # 2026 bis 2028
 *   npm run feiertage -- 2027 2030
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FEIERTAG_NAMEN, feiertage } from '../src/lib/feiertage.ts';

const datei = fileURLToPath(new URL('../src/content/oeffnungszeiten.json', import.meta.url));
const [von = 2026, bis = 2028] = process.argv.slice(2).map(Number);
const json = JSON.parse(readFileSync(datei, 'utf8'));

json.feiertage = [];
for (let jahr = von; jahr <= bis; jahr++) {
  for (const f of feiertage(jahr)) json.feiertage.push({ datum: f.datum, name: FEIERTAG_NAMEN[f.key] });
}
writeFileSync(datei, JSON.stringify(json, null, 2) + '\n');
console.log(`${json.feiertage.length} Feiertage ${von}–${bis} in oeffnungszeiten.json geschrieben.`);
