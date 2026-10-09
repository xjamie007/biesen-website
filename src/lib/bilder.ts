/**
 * Bilder der Projekte: Dateien in src/assets/projekte/, angesprochen über den Dateinamen
 * im Feld `bild` der Projektdaten. Fehlt die Datei, zeigt die Seite einen Platzhalter.
 *
 * Testflächen der Fotopaare (C5, Fallback 4) liegen in src/assets/_dev/ und werden nur im
 * Dev-Modus geladen; scripts/check-dist.ts prüft, dass sie nie im Build landen.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ImageMetadata } from 'astro';
import { exifZeit } from './exif.ts';

const PROJEKT_BILDER = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/projekte/**/*.{jpg,jpeg,JPG,JPEG,png,webp,avif,tif,tiff}',
  { eager: true },
);

export function projektBild(name: string): ImageMetadata | null {
  if (!name) return null;
  return PROJEKT_BILDER[`/src/assets/projekte/${name}`]?.default ?? null;
}

/** Aufnahmezeit HH:MM aus den EXIF-Daten der Originaldatei (nur JPEG). */
export function aufnahmeZeit(name: string): string | null {
  if (!name || !/\.jpe?g$/i.test(name)) return null;
  try {
    // Build und Dev laufen im Projektordner
    return exifZeit(readFileSync(join(process.cwd(), 'src/assets/projekte', name)));
  } catch {
    return null;
  }
}

export interface Testbilder {
  tag: ImageMetadata;
  abend: ImageMetadata;
}

/** Testflächen „Test Tag“ / „Test Abend“, nur im Dev-Modus. */
export async function testbilder(): Promise<Testbilder | null> {
  if (import.meta.env.DEV) {
    const m = import.meta.glob<{ default: ImageMetadata }>('/src/assets/_dev/test-*.jpg');
    const tag = m['/src/assets/_dev/test-tag.jpg'];
    const abend = m['/src/assets/_dev/test-abend.jpg'];
    if (tag && abend) return { tag: (await tag()).default, abend: (await abend()).default };
  }
  return null;
}
