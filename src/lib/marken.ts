/**
 * Logos für das Markenband. Im Band stehen sie einfarbig (Maske in Nachtblau), beim Überfahren in
 * der Farbe der Marke. Ohne Eintrag hier steht der Name als Schrift.
 *
 * Herkunft: Logo-Dateien aus dem Archiv github.com/home-assistant/brands (dort zur Kennzeichnung
 * der Integrationen), in scripts/dev/logo-maske.mjs auf die Form zugeschnitten und als Maske
 * gespeichert, Farben aus den Logos gemessen. Die Marken gehören ihren Inhabern; Biesen zeigt sie,
 * weil es diese Geräte verkauft bzw. mit KNX arbeitet. Freigabe durch den Kunden: OFFENE-PUNKTE 4 und 12.
 */
import type { ImageMetadata } from 'astro';
import aeg from '@/assets/marken/aeg.png';
import miele from '@/assets/marken/miele.png';
import liebherr from '@/assets/marken/liebherr.png';
import bosch from '@/assets/marken/bosch.png';
import siemens from '@/assets/marken/siemens.png';
import knx from '@/assets/marken/knx.png';

export interface MarkenLogo {
  bild: ImageMetadata;
  /** Farbe beim Überfahren */
  farbe: string;
  /** eigener Größenfaktor, wenn der berechnete nicht passt (Miele: volles Feld wirkt schwerer) */
  faktor?: number;
}

export const MARKEN_LOGOS: Record<string, MarkenLogo> = {
  AEG: { bild: aeg, farbe: '#d01030' },
  Miele: { bild: miele, farbe: '#900018', faktor: 0.92 },
  Liebherr: { bild: liebherr, farbe: '#000000' },
  Bosch: { bild: bosch, farbe: '#e00010' },
  Siemens: { bild: siemens, farbe: '#009898' },
  KNX: { bild: knx, farbe: '#0068b8' },
};

/**
 * Optischer Ausgleich: breite Wortmarken wirken bei gleicher Höhe viel größer als kompakte.
 * Die Höhe folgt deshalb der Wurzel des Seitenverhältnisses (Bezug 3 : 1), begrenzt auf 0,55–1,15.
 */
export function logoFaktor({ bild, faktor }: MarkenLogo): number {
  if (faktor) return faktor;
  const f = Math.sqrt(3 / (bild.width / bild.height));
  return Math.round(Math.min(1.15, Math.max(0.55, f)) * 100) / 100;
}
