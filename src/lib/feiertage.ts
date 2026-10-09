/**
 * Gesetzliche Feiertage in Luxemburg (Code du travail, Art. L.232-2):
 * Neujahr, Ostermontag, 1. Mai, Europatag (9. Mai), Christi Himmelfahrt, Pfingstmontag,
 * Nationalfeiertag (23. Juni), Mariä Himmelfahrt (15. August), Allerheiligen,
 * 1. und 2. Weihnachtstag.
 */
export type FeiertagKey =
  | 'neujahr'
  | 'ostermontag'
  | 'arbeit'
  | 'europa'
  | 'himmelfahrt'
  | 'pfingstmontag'
  | 'national'
  | 'mariae'
  | 'allerheiligen'
  | 'weihnachten'
  | 'stephan';

export const FEIERTAG_NAMEN: Record<FeiertagKey, { de: string; fr: string; lb: string; en: string }> = {
  neujahr: { de: 'Neujahr', fr: 'Jour de l’an', lb: 'Neijoerschdag', en: 'New Year’s Day' },
  ostermontag: { de: 'Ostermontag', fr: 'Lundi de Pâques', lb: 'Ouschterméindeg', en: 'Easter Monday' },
  arbeit: { de: 'Tag der Arbeit', fr: 'Fête du Travail', lb: 'Dag vun der Aarbecht', en: 'Labour Day' },
  europa: { de: 'Europatag', fr: 'Journée de l’Europe', lb: 'Europadag', en: 'Europe Day' },
  himmelfahrt: { de: 'Christi Himmelfahrt', fr: 'Ascension', lb: 'Christi Himmelfaart', en: 'Ascension Day' },
  pfingstmontag: { de: 'Pfingstmontag', fr: 'Lundi de Pentecôte', lb: 'Péngschtméindeg', en: 'Whit Monday' },
  national: { de: 'Nationalfeiertag', fr: 'Fête nationale', lb: 'Nationalfeierdag', en: 'National Day' },
  mariae: { de: 'Mariä Himmelfahrt', fr: 'Assomption', lb: 'Léiffrawëschdag', en: 'Assumption Day' },
  allerheiligen: { de: 'Allerheiligen', fr: 'Toussaint', lb: 'Allerhellgen', en: 'All Saints’ Day' },
  weihnachten: { de: '1. Weihnachtstag', fr: 'Noël', lb: 'Chrëschtdag', en: 'Christmas Day' },
  stephan: { de: '2. Weihnachtstag', fr: 'Saint-Étienne', lb: 'Stiefesdag', en: 'St Stephen’s Day' },
};

/** Ostersonntag (gregorianisch, Algorithmus nach Meeus/Jones/Butcher) als 'YYYY-MM-DD'. */
export function ostersonntag(jahr: number): string {
  const a = jahr % 19;
  const b = Math.floor(jahr / 100);
  const c = jahr % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31);
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
}

function plusTage(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function feiertage(jahr: number): { datum: string; key: FeiertagKey }[] {
  const ostern = ostersonntag(jahr);
  const liste: { datum: string; key: FeiertagKey }[] = [
    { datum: `${jahr}-01-01`, key: 'neujahr' },
    { datum: plusTage(ostern, 1), key: 'ostermontag' },
    { datum: `${jahr}-05-01`, key: 'arbeit' },
    { datum: `${jahr}-05-09`, key: 'europa' },
    { datum: plusTage(ostern, 39), key: 'himmelfahrt' },
    { datum: plusTage(ostern, 50), key: 'pfingstmontag' },
    { datum: `${jahr}-06-23`, key: 'national' },
    { datum: `${jahr}-08-15`, key: 'mariae' },
    { datum: `${jahr}-11-01`, key: 'allerheiligen' },
    { datum: `${jahr}-12-25`, key: 'weihnachten' },
    { datum: `${jahr}-12-26`, key: 'stephan' },
  ];
  return liste.sort((x, y) => x.datum.localeCompare(y.datum));
}
