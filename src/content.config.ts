/**
 * Sammlungen (D3, D4).
 *   projekte/  eine YAML-Datei pro Projekt; nur `freigabe: true` erscheint im Produktiv-Build
 *   jobs/      eine YAML-Datei pro Stelle; nur `offen: true` bekommt eine Seite
 * Bilder liegen in src/assets/projekte/ und werden über den Dateinamen in `bild` gefunden.
 * Ein leeres `bild` bedeutet: Foto fehlt noch, die Seite zeigt einen Platzhalter.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text4 = z.object({ de: z.string(), fr: z.string(), lb: z.string(), en: z.string() });
const liste4 = z.object({ de: z.array(z.string()), fr: z.array(z.string()), lb: z.array(z.string()), en: z.array(z.string()) });

export const ARTEN = [
  'neubau',
  'renovierung',
  'licht-innen',
  'licht-aussen',
  'landwirtschaft',
  'halle',
  'oeffentlich',
  'photovoltaik',
  'ladestation',
  'sicherheit',
  'besonders',
] as const;

const uhrzeit = z.string().regex(/^(|[01]\d:[0-5]\d|2[0-3]:[0-5]\d)$/, 'Uhrzeit als HH:MM oder leer');

const projekte = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projekte' }),
  schema: z.object({
    titel: text4,
    /** nur Ortschaft oder Gemeinde, nie eine Adresse; leer = fehlt */
    ortschaft: z.string(),
    jahr: z.number().int().min(1990).max(2100).nullable(),
    art: z.enum(ARTEN),
    /** zwei bis vier Sätze; leer = fehlt */
    text: text4,
    fotos: z
      .array(
        z.object({
          bild: z.string(),
          alt: text4,
          /** Webfassung in der alten Galerie, nur als Hinweis, welches Original anzufragen ist */
          quelle: z.string().optional(),
        }),
      )
      .default([]),
    owend: z
      .object({
        /** Motiv für den Platzhalter „Fotopaar folgt: …“ */
        motiv: text4,
        tag: z.object({ bild: z.string(), uhrzeit }),
        abend: z.object({ bild: z.string(), uhrzeit }),
        /** CSS object-position */
        fokus: z.string().default('50% 50%'),
        alt: z.object({ tag: text4, abend: text4 }),
      })
      .nullable()
      .default(null),
    startseite: z.boolean().default(false),
    reihenfolge: z.number().default(0),
    freigabe: z.boolean().default(false),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/jobs' }),
  schema: z.object({
    offen: z.boolean(),
    /** ISO-Datum 'YYYY-MM-DD'; ohne Datum gibt es kein JobPosting im JSON-LD */
    veroeffentlicht: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    gueltig_bis: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    /** null = noch nicht bestätigt */
    vollzeit: z.boolean().nullable(),
    unbefristet: z.boolean(),
    reihenfolge: z.number().default(0),
    /** URL-Teil je Sprache (nicht „slug“: das Feld nutzt der glob-Loader als ID) */
    pfad: text4,
    titel: text4,
    kurz: text4,
    aufgaben: liste4,
    profil: liste4,
    angebot: liste4,
    seo: z.object({ title: text4, description: text4 }),
  }),
});

export const collections = { projekte, jobs };
