/**
 * Schreibt OFFENE-PUNKTE.md: alle Stellen mit [FEHLT …] und [UNBESTÄTIGT …] (Seite, Schlüssel,
 * was fehlt), dazu fehlende Fotos, unvollständige Inhaltsdaten und die Fragen an den Kunden (B9).
 *   npm run offene-punkte
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';
import de from '../src/i18n/de.ts';
import site from '../src/content/site.json' with { type: 'json' };
import zeiten from '../src/content/oeffnungszeiten.json' with { type: 'json' };

type Deep = string | Deep[] | { [k: string]: Deep };
const MARKE = /\[(FEHLT|UNBESTÄTIGT)(?:\s*[—–:-]\s*([^\]]*))?\]/g;

/** Wo ein Übersetzungsschlüssel auf der Website erscheint */
function seiteVon(key: string): string {
  const regeln: [RegExp, string][] = [
    [/^home\.team/, 'Startseite (26 Leute in Noutem)'],
    [/^home\./, 'Startseite'],
    [/^leistungen\./, 'Startseite (Was wir machen), Leistungen (Übersicht), Karten auf den Leistungsseiten'],
    [/^faq\.(gebiet|angebot)/, 'Startseite, Lichtseite und Leistungen (FAQ)'],
    [/^faq\.kostenlos/, 'Startseite, Leistungen, Neubau und Renovierung, Alarm (FAQ)'],
    [/^faq\.(ladestation|zuschuesse)/, 'Startseite, Photovoltaik und Ladestationen (FAQ)'],
    [/^faq\.hausgeraete/, 'Startseite, Hausgeräte (FAQ)'],
    [/^faq\./, 'Startseite (FAQ)'],
    [/^zeiten\.unbestaetigtKurz/, 'Fuß (alle Seiten)'],
    [/^zeiten\./, 'Startseite (Anrufen oder schreiben), Kontakt'],
    [/^owend\./, 'Licht, Projekte'],
    [/^allgemein\.projekteFehlen/, 'Startseite, Projekte, Leistungsseiten'],
    [/^seiten\.leistungen/, 'Leistungen (Übersicht)'],
    [/^seiten\.installation/, 'Neubau und Renovierung'],
    [/^seiten\.licht/, 'Licht'],
    [/^seiten\.photovoltaik/, 'Photovoltaik und Ladestationen'],
    [/^seiten\.sicherheit/, 'Alarm, Kameras, Brandmelder'],
    [/^seiten\.hausgeraete/, 'Hausgeräte'],
    [/^seiten\.projekte/, 'Projekte'],
    [/^seiten\.ueberUns/, 'Über uns'],
    [/^seiten\.jobs/, 'Jobs'],
    [/^seiten\.job\./, 'Job-Seiten'],
    [/^seiten\.danke/, 'Anfrage angekommen (Danke)'],
    [/^seiten\.impressum/, 'Impressum'],
    [/^seiten\.datenschutz/, 'Datenschutz'],
    [/^formular\./, 'Kontakt (Formular)'],
    [/^footer\./, 'Fuß (alle Seiten)'],
  ];
  return regeln.find(([re]) => re.test(key))?.[1] ?? key.split('.')[0];
}

function blaetter(d: Deep, pfad = ''): [string, string][] {
  if (typeof d === 'string') return [[pfad, d]];
  if (Array.isArray(d)) return d.flatMap((x, i) => blaetter(x, `${pfad}[${i}]`));
  return Object.entries(d).flatMap(([k, v]) => blaetter(v, pfad ? `${pfad}.${k}` : k));
}

const texte: { seite: string; key: string; art: string; was: string }[] = [];
for (const [key, text] of blaetter(de as unknown as Deep)) {
  for (const m of text.matchAll(MARKE)) {
    texte.push({ seite: seiteVon(key), key, art: m[1], was: (m[2] ?? '').trim() || '—' });
  }
}

// Inhaltsdaten
const daten: { seite: string; key: string; art: string; was: string }[] = [];
const fotos: string[] = [];
const projDir = new URL('../src/content/projekte/', import.meta.url);
for (const datei of readdirSync(projDir).filter((f) => f.endsWith('.yaml'))) {
  const p = parse(readFileSync(new URL(datei, projDir), 'utf8'));
  const id = `projekte/${datei}`;
  if (!p.freigabe) daten.push({ seite: 'Projekte, Startseite', key: id, art: 'FEHLT', was: 'Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer' });
  if (!p.ortschaft) daten.push({ seite: 'Projekte', key: `${id} ortschaft`, art: 'FEHLT', was: 'Ortschaft (nur Ort oder Gemeinde, nie die Adresse)' });
  if (p.jahr == null) daten.push({ seite: 'Projekte', key: `${id} jahr`, art: 'FEHLT', was: 'Jahr' });
  if (!p.text?.de) daten.push({ seite: 'Projekte', key: `${id} text`, art: 'FEHLT', was: 'zwei bis vier Sätze in vier Sprachen' });
  for (const f of p.fotos ?? []) {
    if (!f.bild) fotos.push(`- **${p.titel.de}** (\`${id}\`): Original in voller Auflösung anfragen. Motiv: ${f.alt.de}.${f.quelle ? ` Webfassung: ${f.quelle}` : ''}`);
  }
  if (p.owend && (!p.owend.tag.bild || !p.owend.abend.bild)) {
    fotos.push(`- **Fotopaar ${p.owend.motiv.de}** (\`${id}\`${p.startseite && p.reihenfolge === 1 ? ', Startseite' : ', Lichtseite'}): Shooting nach der Anleitung im README; Uhrzeiten kommen aus den EXIF-Daten.`);
  }
}

const jobDir = new URL('../src/content/jobs/', import.meta.url);
for (const datei of readdirSync(jobDir).filter((f) => f.endsWith('.yaml'))) {
  const j = parse(readFileSync(new URL(datei, jobDir), 'utf8'));
  const id = `jobs/${datei}`;
  daten.push({ seite: 'Job-Seiten', key: `${id} offen`, art: 'UNBESTÄTIGT', was: 'Ist die Stelle noch offen?' });
  if (!j.veroeffentlicht) daten.push({ seite: 'Job-Seiten', key: `${id} veroeffentlicht`, art: 'FEHLT', was: 'Datum der Veröffentlichung; ohne Datum kein JobPosting für Google Jobs' });
  if (!j.gueltig_bis) daten.push({ seite: 'Job-Seiten', key: `${id} gueltig_bis`, art: 'FEHLT', was: 'Bewerbungsfrist (validThrough)' });
  if (j.vollzeit == null) daten.push({ seite: 'Job-Seiten', key: `${id} vollzeit`, art: 'UNBESTÄTIGT', was: 'Vollzeit oder Teilzeit (employmentType)' });
}

if (!site.mwst.bestaetigt) daten.push({ seite: 'Impressum, JSON-LD', key: 'site.json mwst', art: 'UNBESTÄTIGT', was: 'MwSt-Nummer LU32155700 in VIES prüfen, dann bestaetigt: true' });
if (!site.facebook) daten.push({ seite: 'Fuß, JSON-LD sameAs', key: 'site.json facebook', art: 'FEHLT', was: 'Facebook-URL' });
if (!zeiten.bestaetigt) daten.push({ seite: 'Startseite, Kontakt, Fuß, JSON-LD', key: 'oeffnungszeiten.json', art: 'UNBESTÄTIGT', was: 'Zeiten beim Betrieb bestätigen: 08:00–12:00/13:30–16:30 (alte Website, wedo.lu), 07:30–16:30 durchgehend (Editus, Google) oder 07:00–12:00/13:00–16:00 (SuperDrecksKëscht); Betriebsferien; dann bestaetigt: true' });
if (zeiten.ausnahmen.length === 0) daten.push({ seite: 'Startseite, Kontakt, JSON-LD', key: 'oeffnungszeiten.json ausnahmen', art: 'FEHLT', was: 'Betriebsferien und Brückentage (falls es welche gibt)' });

const esc = (s: string) => s.replace(/\|/g, '\\|');
const tabelle = (z: typeof texte) => [
  '| Seite | Schlüssel | Art | Was fehlt |',
  '|---|---|---|---|',
  ...z.map((x) => `| ${esc(x.seite)} | \`${x.key}\` | ${x.art} | ${esc(x.was)} |`),
];

const md = [
  '# Offene Punkte – Electricité Biesen',
  '',
  'Diese Datei schreibt `npm run offene-punkte` aus den Übersetzungen (`src/i18n/de.ts`), den Inhaltsdaten (`src/content/`) und den Stammdaten. Bitte nicht von Hand ändern, sondern die Quelle korrigieren und das Skript erneut laufen lassen.',
  '',
  'Auf der Website sind alle Stellen sichtbar markiert (gestrichelter Rahmen: `[FEHLT …]` oder `[UNBESTÄTIGT …]`). Die Hinweise sind intern und in allen Sprachen deutsch. Vor dem Livegang darf keine Markierung übrig sein.',
  '',
  '## 1. Fragen an den Kunden (B9)',
  '',
  '1. **Öffnungs- und Telefonzeiten:** 08:00 mit Mittagspause oder 07:30–16:30 durchgehend? Feiertage, Betriebsferien. → `src/content/oeffnungszeiten.json`',
  '2. **Geschichte freigeben** (B4). Auf „Über uns“ steht ein Entwurf als Zeitleiste: 1976 Gründung eines Elektrobetriebs im Ösling, ein Biesen ist Mitgründer; 2020 Electricité Biesen SA in Noutem; heute in Familienhand mit 26 Leuten. Quellen: heutige Website (Über uns), wedo.lu, Handelsregister (RCS B243775, gegründet 27.04.2020). Zu klären: Stimmt 1976 (ein Verzeichnis nennt Erfahrung seit 1965)? Darf die Trennung im Jahr 2000 erwähnt werden? Vorgängerfirmen werden nicht genannt, kein „seit“, kein `foundingDate`. → `seiten.ueberUns.geschichte`, `geschichteSchritte`',
  '3. **Vertretung der S.A. und Verantwortlicher fürs Impressum;** MwSt-Nummer in VIES prüfen. → Impressum',
  '4. **Hausgeräte:** Ausstellung in Nothum? Lieferung, Anschluss, Reparatur? Aktuelle Marken, Recht zur Nennung. → Hausgeräte, FAQ 7',
  '4a. **Marken für Photovoltaik, Wechselrichter, Ladestationen, Licht, Alarm und Kameras**, die genannt werden dürfen? Dann bekommt jede dieser Leistungsseiten ein Markenband wie die Hausgeräte. (Weder diese Website noch die heutige nennen bisher welche.)',
  '5. **Einsatzgebiet** (Gemeinden; auch Belgien?), **Störungsdienst** ja oder nein. Bis dahin kein `areaServed`, keine Notdienst-Frage. → FAQ 1',
  '6. **Anfragen:** Wer liest sie (`FORM_RECIPIENT`), wie schnell kommt eine Antwort, ist das Angebot kostenlos (auch mit Termin vor Ort)? → Danke-Seite, FAQ 3',
  '7. **Shooting der Tag-und-Abend-Fotopaare** (C5, Anleitung im README); Freigabe der Projekte mit Ortschaft; welcher Stollen; Teamfoto und Namen. → Abschnitt 3',
  '7a. **Symbolbilder ersetzen.** Bis eigene Fotos da sind, stehen Stockfotos (Unsplash-Lizenz, Herkunft in `src/assets/stock/QUELLEN.md`) in den Leistungskarten der Startseite, oben auf drei Leistungsseiten, auf „Über uns“ statt des Teamfotos und auf der Lichtseite statt zweier Fotopaare. Unter jedem steht „Symbolbild“. Eigene Fotos für Elektroinstallation, Photovoltaik, Alarm und Hausgeräte? Sollen die Symbolbilder bis dahin online gehen?',
  '8. **Logo als Vektordatei.** Danach Favicon aus dem gelben Blitz auf Noutem-Blau (`scripts/assets/favicon.py`) und `Logo.astro` auf SVG umstellen.',
  '9. **DNS-Zugang** für electricite-biesen.lu und biesen.lu (vermutlich bei Wedo Solutions); Mailversand über einen EU-Anbieter (SPF/DKIM für die Absenderadresse). → README „Livegang“',
  '10. **Facebook-URL;** Google-Unternehmensprofil übernehmen (README, G4).',
  '11. **Stellen** noch offen? Vollzeit? Lehrstellen? Stellenanzeigen auch auf Portugiesisch?',
  '12. **Mitgliedschaften und Labels** aktuell (FDA, FGT, KNX, SuperDrecksKëscht, Made in Luxembourg, Mir bilden aus)? Logos erlaubt? (Bis dahin als Schrift im Markenband auf „Über uns“.)',
  '13. **Erlaubnis für das Zitat von Karin R.** Bis dahin kein Zitat, keine Sterne, kein Bewertungs-Widget.',
  '14. **Alle luxemburgischen Texte muttersprachlich prüfen lassen** → [`LB-REVIEW.md`](LB-REVIEW.md)',
  '',
  'Weitere Punkte aus dem Bau:',
  '',
  '- **Löschfrist** der Anfragen und Dateien (Vorschlag 6 Monate, wenn kein Auftrag entsteht) → `LOESCHFRIST_MONATE` der Function `aufraeumen`, Datenschutzerklärung',
  '- **Mailanbieter** (EU) mit Nave klären: Brevo oder Scaleway sind vorbereitet → Datenschutzerklärung nennt ihn danach',
  '- **Namen auf der Website:** Leitung (Claude und Romain Biesen laut heutiger Website), technischer Leiter laut Gewerbegenehmigung, Ansprechpartner für Bewerbungen – nur nach Freigabe',
  '- **Herstellername der Fertighäuser** nennen? (heute nicht genannt)',
  '- **Öffentliche Beleuchtung:** Referenzen (Straßen, Plätze, Gemeinden)? Davon hängt ein mögliches weiteres Fotopaar „Straße oder Platz“ ab.',
  '- **„Nieder- und Hochspannung“** bei Ladestationen (heutige Website) ist nicht übernommen; was ist gemeint?',
  '- **Editus-Leistungen** (Bureau d’études, Mittel- und Hochspannung, Mise en conformité, Dépannage) sind nicht übernommen, bis der Kunde sie bestätigt.',
  '- **Bewerbungen:** Aufbewahrungsfrist für Bewerbungsunterlagen (Datenschutzerklärung)',
  '- **Rufnummer für Bewerbungen 95 80 99 13**: noch aktuell, Laurent Maillen weiterhin Ansprechpartner?',
  '',
  `## 2. Markierte Stellen in den Texten (${texte.length})`,
  '',
  'Der Schlüssel gilt in allen vier Sprachen (`src/i18n/fr.ts`, `de.ts`, `lb.ts`, `en.ts`).',
  '',
  ...tabelle(texte),
  '',
  `## 3. Fotos (${fotos.length})`,
  '',
  'Ohne Foto zeigt die Seite eine Fläche in Kalkputz mit „Foto folgt: …“ bzw. „Fotopaar folgt: …“. Keine Bilddatenbank, keine KI-Bilder, nichts hochskalieren. Fotos der alten Galerie nur nach Freigabe und in Originalauflösung.',
  '',
  ...fotos,
  '- **Fotos der Leistungen auf der Startseite:** Neubau (Fertighaus-Module), Licht (Milchviehstall), Photovoltaik und Ladestationen `[FEHLT: Foto]`',
  '- **Teamfoto** (Startseite, Über uns)',
  '',
  `## 4. Inhaltsdaten und Stammdaten (${daten.length})`,
  '',
  ...tabelle(daten),
  '',
  '## 5. Technik vor dem Livegang',
  '',
  '- `PUBLIC_FORM_URL` als GitHub-Variable setzen (Adresse der Edge Function `anfrage`); ohne sie zeigt das Formular einen Hinweis.',
  '- Supabase-Projekt in der EU anlegen, Migration einspielen, Secrets setzen, beide Functions deployen (README „Formular“).',
  '- Formular real abschicken, bis die Mail ankommt; Datei-Links in der Mail prüfen.',
  '- Domain und DNS, „Enforce HTTPS“; echte 301-Weiterleitungen wären mit einem anderen Hosting besser (README).',
  '- Rich-Results-Test (Firma, FAQ, Jobs), Lighthouse erneut mit echten Fotos.',
  '- Auf einem echten Handy testen.',
  '',
].join('\n');

writeFileSync(new URL('../OFFENE-PUNKTE.md', import.meta.url), md);
console.log(`OFFENE-PUNKTE.md: ${texte.length} Textstellen, ${fotos.length} Fotos, ${daten.length} Datenpunkte`);
