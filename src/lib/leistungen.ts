/**
 * Die fünf Leistungen für Übersicht, Startseite und Menü: Stichpunkte und vorgewähltes Anliegen
 * im Formular. Die Stichpunkte kommen aus den Texten der Leistungsseiten, damit beides gleich bleibt.
 */
import type { Dict } from '@/i18n';
import type { ServicePage } from '@/i18n/config';

/** Anliegen, das der Link „Angebot anfragen“ im Formular vorwählt */
export const ANLIEGEN: Record<ServicePage, string> = {
  installation: 'neubau',
  licht: 'licht',
  photovoltaik: 'photovoltaik',
  sicherheit: 'sicherheit',
  hausgeraete: 'hausgeraet',
};

/** Was zu einer Leistung gehört, in der Reihenfolge der Leistungsseite */
export function leistungsPunkte(t: Dict, page: ServicePage): string[] {
  switch (page) {
    case 'installation':
      return t.seiten.installation.was;
    case 'licht':
      return Object.values(t.seiten.licht.bereiche).map((b) => b.h);
    case 'photovoltaik':
      return t.seiten.photovoltaik.was;
    case 'sicherheit':
      return t.seiten.sicherheit.was;
    case 'hausgeraete':
      return t.seiten.hausgeraete.was;
  }
}

/**
 * Kurze Stichpunkte für die Karten der Startseite. Bei Photovoltaik sind die Punkte der
 * Leistungsseite ganze Sätze; dort stehen die beiden Arten aus den Projekten.
 */
export function kartenPunkte(t: Dict, page: ServicePage): string[] {
  if (page === 'photovoltaik') return [t.arten.photovoltaik, t.arten.ladestation];
  return leistungsPunkte(t, page);
}

/** Marken der Hausgeräte, als Text (keine Hersteller-Logos), wie in den Texten der Hausgeräte */
export const MARKEN = ['AEG', 'Miele', 'Liebherr', 'Bosch', 'Siemens'] as const;
