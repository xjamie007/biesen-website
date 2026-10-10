/**
 * Symbolbilder (Stockfotos, Unsplash-Lizenz) für Stellen, an denen noch kein eigenes Foto da ist.
 * Herkunft je Datei: src/assets/stock/QUELLEN.md. Sie zeigen keine Arbeit von Biesen; unter jedem
 * steht „Symbolbild“. Ein freigegebenes Projektfoto geht immer vor.
 */
import type { ImageMetadata } from 'astro';
import type { ServicePage } from '@/i18n/config';
import verteiler from '@/assets/stock/verteiler.jpg';
import monteur from '@/assets/stock/monteur.jpg';
import montage from '@/assets/stock/montage.jpg';
import wohnhausGarten from '@/assets/stock/wohnhaus-garten.jpg';
import pvMontage from '@/assets/stock/pv-montage.jpg';
import pvDach from '@/assets/stock/pv-dach.jpg';
import pendelleuchten from '@/assets/stock/pendelleuchten.jpg';
import kueche from '@/assets/stock/kueche.jpg';
import linienlicht from '@/assets/stock/linienlicht.jpg';

export const STOCK = {
  verteiler,
  monteur,
  montage,
  wohnhausGarten,
  pvMontage,
  pvDach,
  pendelleuchten,
  kueche,
  linienlicht,
} satisfies Record<string, ImageMetadata>;

export type StockId = keyof typeof STOCK;

/** Bildausschnitt (object-position), wo die Bildmitte nicht passt */
export const STOCK_FOKUS: Partial<Record<StockId, string>> = {
  monteur: '70% 40%',
  montage: '60% 40%',
  pvMontage: '50% 30%',
  pvDach: '50% 0%',
  kueche: '58% 50%',
};

/** Startseite: Foto oben in der Leistungskarte */
export const STOCK_KARTE: Record<ServicePage, StockId> = {
  installation: 'verteiler',
  licht: 'pendelleuchten',
  photovoltaik: 'pvMontage',
  sicherheit: 'montage',
  hausgeraete: 'kueche',
};

/** Leistungsseiten: breites Foto unter dem Seitenkopf (die Lichtseite zeigt die Fotopaare, die Hausgeräte das Markenband) */
export const STOCK_SEITE: Partial<Record<ServicePage, StockId>> = {
  installation: 'verteiler',
  photovoltaik: 'pvDach',
  sicherheit: 'montage',
};

/** Lichtseite: Symbolbild statt Platzhalter, solange das Fotopaar fehlt (Projekt-ID → Foto) */
export const STOCK_PAAR: Record<string, StockId> = {
  'oesling-haus': 'wohnhausGarten',
  halle: 'linienlicht',
};
