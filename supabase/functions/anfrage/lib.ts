/**
 * Prüfung, Betreff und Mailtext der Anfragen (F). Ohne Abhängigkeiten, mit Deno testbar:
 *   cd supabase/functions/anfrage && deno test lib.test.ts
 */
export const SPRACHEN = ['fr', 'de', 'lb', 'en'] as const;
export type Sprache = (typeof SPRACHEN)[number];

export const ANLIEGEN = ['neubau', 'renovierung', 'licht', 'photovoltaik', 'ladestation', 'sicherheit', 'hausgeraet', 'anderes'] as const;
export type Anliegen = (typeof ANLIEGEN)[number];

export const GEBAEUDE = ['haus', 'wohnung', 'betrieb', 'landwirtschaft', 'oeffentlich'] as const;
const FERTIGHAUS = ['ja', 'nein', 'offen'] as const;
const ABSTAND = ['unter10', 'bis25', 'ueber25', 'unbekannt'] as const;
const PV = ['ja', 'nein', 'geplant'] as const;
const START = ['bald', 'dreiMonate', 'spaeter'] as const;

export const MAX_DATEIEN = 5;
export const MAX_BYTES = 10 * 1024 * 1024;

/** Pfade der Seiten, auf die die Function weiterleitet (D1) */
export const DANKE: Record<Sprache, string> = {
  fr: '/fr/contact/merci/',
  de: '/de/kontakt/danke/',
  lb: '/lb/kontakt/merci/',
  en: '/en/contact/thank-you/',
};
export const KONTAKT: Record<Sprache, string> = {
  fr: '/fr/contact/',
  de: '/de/kontakt/',
  lb: '/lb/kontakt/',
  en: '/en/contact/',
};

/** Bezeichnungen für das Büro (Mail auf Deutsch, die Sprache des Absenders steht im Text) */
const L_ANLIEGEN: Record<Anliegen, string> = {
  neubau: 'Neubau',
  renovierung: 'Renovierung',
  licht: 'Licht',
  photovoltaik: 'Photovoltaik',
  ladestation: 'Ladestation',
  sicherheit: 'Alarm, Kamera, Brandmelder',
  hausgeraet: 'Hausgerät',
  anderes: 'Anderes',
};
const L_GEBAEUDE: Record<string, string> = {
  haus: 'Haus',
  wohnung: 'Wohnung',
  betrieb: 'Betrieb oder Halle',
  landwirtschaft: 'Landwirtschaft',
  oeffentlich: 'Gemeinde oder öffentliches Gebäude',
};
const L_FERTIGHAUS: Record<string, string> = { ja: 'ja', nein: 'nein', offen: 'weiß noch nicht' };
const L_ABSTAND: Record<string, string> = { unter10: 'unter 10 m', bis25: '10 bis 25 m', ueber25: 'über 25 m', unbekannt: 'weiß nicht' };
const L_PV: Record<string, string> = { ja: 'ja', nein: 'nein', geplant: 'geplant' };
const L_START: Record<string, string> = { bald: 'so bald wie möglich', dreiMonate: 'in den nächsten drei Monaten', spaeter: 'später, plant noch' };
const L_SPRACHE: Record<Sprache, string> = { fr: 'Französisch', de: 'Deutsch', lb: 'Luxemburgisch', en: 'Englisch' };

export interface Datei {
  name: string;
  type: string;
  size: number;
}

export interface Anfrage {
  sprache: Sprache;
  anliegen: Anliegen;
  gebaeude: string | null;
  fertighaus: string | null;
  abstand: string | null;
  pv: string | null;
  geraet: string | null;
  ortschaft: string;
  start: string | null;
  beschreibung: string;
  name: string;
  email: string;
  telefon: string | null;
}

export type Pruefung = { ok: true; anfrage: Anfrage } | { ok: false; sprache: Sprache; felder: string[] };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function eins<T extends readonly string[]>(liste: T, wert: string | undefined): T[number] | null {
  return wert && (liste as readonly string[]).includes(wert) ? (wert as T[number]) : null;
}

function kurz(wert: string | undefined, max: number): string {
  return (wert ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function istSprache(x: unknown): x is Sprache {
  return typeof x === 'string' && (SPRACHEN as readonly string[]).includes(x);
}

/** Dateityp: Bilder oder PDF, geprüft über MIME-Typ und Endung */
export function dateiErlaubt(d: Datei): boolean {
  const endung = d.name.toLowerCase().split('.').pop() ?? '';
  const bild = d.type.startsWith('image/') && /^(jpe?g|png|webp|heic|heif|gif|tiff?|avif|bmp)$/.test(endung);
  const pdf = (d.type === 'application/pdf' || d.type === '') && endung === 'pdf';
  return bild || pdf;
}

/** Serverseitige Prüfung je nach Anliegen (F). Liefert die Namen der fehlerhaften Felder. */
export function pruefe(f: Record<string, string>, dateien: Datei[]): Pruefung {
  const sprache: Sprache = istSprache(f.sprache) ? f.sprache : 'fr';
  const felder: string[] = [];
  const anliegen = eins(ANLIEGEN, f.anliegen);
  if (!anliegen) felder.push('anliegen');
  const gebaeude = eins(GEBAEUDE, f.gebaeude);
  if (anliegen && anliegen !== 'hausgeraet' && !gebaeude) felder.push('gebaeude');
  const geraet = kurz(f.geraet, 200);
  if (anliegen === 'hausgeraet' && !geraet) felder.push('geraet');
  const ortschaft = kurz(f.ortschaft, 120);
  if (!ortschaft) felder.push('ortschaft');
  const beschreibung = (f.beschreibung ?? '').trim().slice(0, 5000);
  if (!beschreibung) felder.push('beschreibung');
  const name = kurz(f.name, 120);
  if (!name) felder.push('name');
  const email = kurz(f.email, 200);
  if (!EMAIL.test(email)) felder.push('email');
  if (f.einwilligung !== 'ja') felder.push('einwilligung');
  if (dateien.length > MAX_DATEIEN || dateien.some((d) => d.size > MAX_BYTES || !dateiErlaubt(d))) felder.push('dateien');

  if (felder.length) return { ok: false, sprache, felder };
  return {
    ok: true,
    anfrage: {
      sprache,
      anliegen: anliegen!,
      gebaeude: anliegen === 'hausgeraet' ? null : gebaeude,
      fertighaus: anliegen === 'neubau' ? eins(FERTIGHAUS, f.fertighaus) : null,
      abstand: anliegen === 'ladestation' ? eins(ABSTAND, f.abstand) : null,
      pv: anliegen === 'ladestation' ? eins(PV, f.pv) : null,
      geraet: anliegen === 'hausgeraet' ? geraet : null,
      ortschaft,
      start: eins(START, f.start),
      beschreibung,
      name,
      email,
      telefon: kurz(f.telefon, 40) || null,
    },
  };
}

/**
 * Betreff, damit das Büro im Posteingang sortieren kann (F):
 *   [Ladestation] Haus, Wiltz – Name
 *   [Neubau, Fertighaus] Haus, Ortschaft – Name
 *   [Hausgerät] Ortschaft – Name
 */
export function betreff(a: Anfrage): string {
  const kopf = [L_ANLIEGEN[a.anliegen], a.anliegen === 'neubau' && a.fertighaus === 'ja' ? 'Fertighaus' : null].filter(Boolean).join(', ');
  const ort = [a.gebaeude ? L_GEBAEUDE[a.gebaeude] : null, a.ortschaft].filter(Boolean).join(', ');
  return `[${kopf}] ${ort} – ${a.name}`;
}

export function mailText(a: Anfrage, links: { name: string; url: string }[], tageGueltig: number, eingang: Date, kennung: string): string {
  const zeilen: (string | false | null)[] = [
    `Anliegen: ${L_ANLIEGEN[a.anliegen]}`,
    a.gebaeude && `Gebäude: ${L_GEBAEUDE[a.gebaeude]}`,
    a.fertighaus && `Fertighaus: ${L_FERTIGHAUS[a.fertighaus]}`,
    a.abstand && `Abstand Stellplatz – Sicherungskasten: ${L_ABSTAND[a.abstand]}`,
    a.pv && `Photovoltaikanlage: ${L_PV[a.pv]}`,
    a.geraet && `Gerät: ${a.geraet}`,
    `Ortschaft: ${a.ortschaft}`,
    a.start && `Beginn: ${L_START[a.start]}`,
    '',
    'Beschreibung:',
    a.beschreibung,
    '',
    `Name: ${a.name}`,
    `E-Mail: ${a.email}`,
    a.telefon && `Telefon: ${a.telefon}`,
    `Sprache des Absenders: ${L_SPRACHE[a.sprache]} (${a.sprache})`,
    '',
    links.length ? `Pläne und Fotos (Links ${tageGueltig} Tage gültig, danach im Supabase-Dashboard unter Storage › anfragen):` : 'Keine Dateien.',
    ...links.map((l) => `- ${l.name}: ${l.url}`),
    '',
    `Eingegangen: ${eingang.toISOString()}`,
    `Kennung: ${kennung}`,
  ];
  return zeilen.filter((z) => z !== false && z !== null).join('\n');
}

/** Dateiname für den Speicher: nur sichere Zeichen, Endung bleibt */
export function sichererName(name: string, index: number): string {
  const sauber = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')
    .slice(-80);
  return `${index + 1}-${sauber || 'datei'}`;
}

/** Ziel der Weiterleitung bei fehlenden Angaben: zurück zum Formular, Felder in der Adresse */
export function fehlerZiel(siteUrl: string, sprache: Sprache, felder: string[]): string {
  return `${siteUrl}${KONTAKT[sprache]}?fehler=${encodeURIComponent(felder.join(','))}#fehlt`;
}
