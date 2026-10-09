/**
 * Symbole als SVG-Pfade (24 × 24, Kontur in currentColor). Eigene, einfache Zeichnungen,
 * keine Icon-Bibliothek, nichts von anderen Servern. Das Logo wird nie nachgezeichnet;
 * der Blitz hier ist ein eigenes Zeichen für Akzente.
 */
import type { ServicePage } from '@/i18n/config';

export const ICONS = {
  haus: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11.5h14V9"/><path d="M12.6 10 10 14.4h4l-2.6 4.4"/>',
  licht:
    '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.7 10.7c.7.6 1.2 1.4 1.2 2.3h5c0-.9.5-1.7 1.2-2.3A6 6 0 0 0 12 3Z"/><path d="M12 7.5v3"/>',
  solar:
    '<circle cx="17" cy="5.2" r="2.2"/><path d="M17 1v.7M21.2 5.2h-.7M12.8 5.2h.7M20 2.2l-.5.5M14 2.2l.5.5"/><path d="M3 20.5 5.6 11h13.2l-2.6 9.5Z"/><path d="M4.3 15.8h13.2"/><path d="M10 11 8.7 20.5M14.4 11l-1.3 9.5"/>',
  ladestation:
    '<rect x="3.5" y="3" width="10" height="18" rx="2"/><path d="M9.3 7 7 11h3.2l-2.3 4"/><path d="M13.5 9h2a2 2 0 0 1 2 2v5.2a1.6 1.6 0 0 0 3.2 0V8.5L19 6.5"/>',
  schild: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6Z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
  geraet:
    '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M4 7h16"/><circle cx="12" cy="14" r="4.5"/><path d="M9.6 14.6c.8-.7 1.6-.7 2.4 0s1.6.7 2.4 0"/><path d="M7 4.8h.01M9.5 4.8h.01"/>',
  telefon:
    '<path d="M5.2 3.5h3.3l1.8 4.6-2.3 1.4a11.5 11.5 0 0 0 6.5 6.5l1.4-2.3 4.6 1.8v3.3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.2 5.7a2 2 0 0 1 2-2.2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pfeil: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  haken: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  uhr: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ort: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  team: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c2.8.2 5 2.6 5 5.8"/>',
  kamera: '<path d="M4 7.5h3l1.5-2.5h7L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/>',
  blitz: '<path d="M13.6 2 5 13.4h6.2L9.6 22 19 10.4h-6.3Z" fill="currentColor" stroke="none"/>',
  werkzeug:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z"/>',
  frage:
    '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M10 9.5a2 2 0 1 1 2.8 1.8c-.5.2-.8.7-.8 1.2"/><path d="M12 14.5h.01"/>',
  wohnhaus: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11.5h14V9"/><path d="M10 20.5v-6h4v6"/>',
  wohnung: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/><path d="M11 21v-3h2v3"/>',
  halle: '<path d="M3 21V10l5 3V10l5 3V7l8 4v10Z"/><path d="M3 21h18"/><path d="M8 17h2M13 17h2"/>',
  hof: '<path d="M3 10 7 5h10l4 5"/><path d="M4 10v11h16V10"/><path d="M9 21v-6h6v6"/><path d="m9 15 6 6M15 15l-6 6"/>',
  gemeinde: '<path d="M3 9 12 4l9 5"/><path d="M5 9v9M9 9v9M15 9v9M19 9v9"/><path d="M3 21h18M3 18h18"/>',
  hochladen: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  schloss: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
} as const;

export type IconName = keyof typeof ICONS;

/** Symbol je Anliegen und je Gebäude im Anfrageformular */
export const ANLIEGEN_ICON = {
  neubau: 'haus',
  renovierung: 'werkzeug',
  licht: 'licht',
  photovoltaik: 'solar',
  ladestation: 'ladestation',
  sicherheit: 'schild',
  hausgeraet: 'geraet',
  anderes: 'frage',
} as const satisfies Record<string, IconName>;

export const GEBAEUDE_ICON = {
  haus: 'wohnhaus',
  wohnung: 'wohnung',
  betrieb: 'halle',
  landwirtschaft: 'hof',
  oeffentlich: 'gemeinde',
} as const satisfies Record<string, IconName>;

/** Symbol je Leistung (Navigation, Karten, Seitenkopf) */
export const LEISTUNG_ICON: Record<ServicePage, IconName> = {
  installation: 'haus',
  licht: 'licht',
  photovoltaik: 'solar',
  sicherheit: 'schild',
  hausgeraete: 'geraet',
};
