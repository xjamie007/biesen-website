/**
 * Öffnungs- und Telefonzeiten aus src/content/oeffnungszeiten.json (G3):
 * Tabelle, Kurzform im Footer, openingHoursSpecification und die nächsten Schließtage.
 */
import json from '@/content/oeffnungszeiten.json';
import { fmt, type Dict } from '@/i18n';
import { intlLocale, type Lang } from '@/i18n/config';

export type TagKey = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so';
export const TAGE: TagKey[] = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];
export type Intervall = [string, string];
type Text4 = Record<Lang, string>;

export interface Zeiten {
  zeitzone: string;
  bestaetigt: boolean;
  woche: Record<TagKey, Intervall[]>;
  ausnahmen: { von: string; bis: string; geschlossen: boolean; zeiten?: Intervall[]; text: Text4 }[];
  feiertage: { datum: string; name: Text4 }[];
}

export const zeiten = json as unknown as Zeiten;

const SCHEMA_TAG: Record<TagKey, string> = {
  mo: 'Monday',
  di: 'Tuesday',
  mi: 'Wednesday',
  do: 'Thursday',
  fr: 'Friday',
  sa: 'Saturday',
  so: 'Sunday',
};

const gleich = (a: Intervall[], b: Intervall[]) => JSON.stringify(a) === JSON.stringify(b);

/** Aufeinanderfolgende Tage mit gleichen Zeiten zusammenfassen: Mo–Fr, Sa–So. */
export function wochenGruppen(woche = zeiten.woche): { von: TagKey; bis: TagKey; zeiten: Intervall[] }[] {
  const out: { von: TagKey; bis: TagKey; zeiten: Intervall[] }[] = [];
  for (const tag of TAGE) {
    const letzte = out[out.length - 1];
    if (letzte && gleich(letzte.zeiten, woche[tag])) letzte.bis = tag;
    else out.push({ von: tag, bis: tag, zeiten: woche[tag] });
  }
  return out;
}

export function tageText(t: Dict, von: TagKey, bis: TagKey, kurz = false): string {
  const name = kurz ? t.zeiten.tageKurz : t.zeiten.tage;
  if (von === bis) return name[von];
  const abstand = TAGE.indexOf(bis) - TAGE.indexOf(von);
  return fmt(abstand === 1 ? t.zeiten.paar : t.zeiten.spanne, { a: name[von], b: name[bis], von: name[von], bis: name[bis] });
}

export function intervallText(t: Dict, iv: Intervall[]): string {
  if (iv.length === 0) return t.zeiten.geschlossen;
  const teile = iv.map(([a, b]) => `${a}–${b}`);
  return teile.length === 2 ? fmt(t.zeiten.paar, { a: teile[0], b: teile[1] }) : teile.join(', ');
}

/** Kurzform für den Footer: „Mo bis Fr 08:00–12:00 und 13:30–16:30“ (nur geöffnete Tage). */
export function kurzText(t: Dict): string {
  return wochenGruppen()
    .filter((g) => g.zeiten.length > 0)
    .map((g) => `${tageText(t, g.von, g.bis, true)} ${intervallText(t, g.zeiten)}`)
    .join(', ');
}

/** Heutiges Datum in Luxemburg als YYYY-MM-DD (Build-Zeitpunkt). */
export function heuteLuxemburg(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zeiten.zeitzone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function wochentag(iso: string): TagKey {
  const i = new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0 = Sonntag
  return TAGE[(i + 6) % 7];
}

export interface Schliessung {
  von: string;
  bis: string;
  text: string;
}

/**
 * Die nächsten Schließtage ab `heute` (Feiertage an sonst geöffneten Tagen und Ausnahmen),
 * höchstens `anzahl`, innerhalb von `tage` Tagen.
 */
export function naechsteSchliessungen(lang: Lang, heute = heuteLuxemburg(), anzahl = 3, tage = 75): Schliessung[] {
  const grenze = new Date(`${heute}T12:00:00Z`);
  grenze.setUTCDate(grenze.getUTCDate() + tage);
  const bisGrenze = grenze.toISOString().slice(0, 10);
  const liste: Schliessung[] = [
    ...zeiten.feiertage
      .filter((f) => zeiten.woche[wochentag(f.datum)].length > 0)
      .map((f) => ({ von: f.datum, bis: f.datum, text: f.name[lang] })),
    ...zeiten.ausnahmen.filter((a) => a.geschlossen).map((a) => ({ von: a.von, bis: a.bis, text: a.text[lang] })),
  ];
  return liste
    .filter((s) => s.bis >= heute && s.von <= bisGrenze)
    .sort((a, b) => a.von.localeCompare(b.von))
    .slice(0, anzahl);
}

export function datumText(lang: Lang, iso: string, mitWochentag = true): string {
  return new Intl.DateTimeFormat(intlLocale(lang), {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    ...(mitWochentag ? { weekday: 'long' } : { year: 'numeric' }),
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** openingHoursSpecification (G3): reguläre Zeiten plus Feiertage und Ausnahmen ab heute. */
export function openingHoursSpecification(heute = heuteLuxemburg()) {
  const gruppen = new Map<string, { tage: string[]; opens: string; closes: string }>();
  for (const tag of TAGE) {
    for (const [opens, closes] of zeiten.woche[tag]) {
      const key = `${opens}-${closes}`;
      const g = gruppen.get(key) ?? { tage: [], opens, closes };
      g.tage.push(`https://schema.org/${SCHEMA_TAG[tag]}`);
      gruppen.set(key, g);
    }
  }
  const regulaer = [...gruppen.values()].map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.tage,
    opens: g.opens,
    closes: g.closes,
  }));
  const geschlossen = (von: string, bis: string) => ({
    '@type': 'OpeningHoursSpecification',
    opens: '00:00',
    closes: '00:00',
    validFrom: von,
    validThrough: bis,
  });
  const besondere = [
    ...zeiten.feiertage.filter((f) => f.datum >= heute).map((f) => geschlossen(f.datum, f.datum)),
    ...zeiten.ausnahmen
      .filter((a) => a.bis >= heute)
      .flatMap((a) =>
        a.geschlossen
          ? [geschlossen(a.von, a.bis)]
          : (a.zeiten ?? []).map(([opens, closes]) => ({
              '@type': 'OpeningHoursSpecification',
              opens,
              closes,
              validFrom: a.von,
              validThrough: a.bis,
            })),
      ),
  ];
  return [...regulaer, ...besondere];
}
