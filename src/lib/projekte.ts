/**
 * Projekte (D3) und Fotopaare (C5, C6).
 * - Produktiv-Build: nur `freigabe: true`.
 * - Dev-Modus: alle Projekte, nicht freigegebene sichtbar markiert.
 * - Ein Fotopaar ist „fertig“, wenn das Projekt freigegeben ist und beide Bilddateien da sind.
 *   Sonst zeigt die Seite den Platzhalter „Fotopaar folgt: …“ (im Dev-Modus die Testflächen).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import type { Lang } from '@/i18n/config';
import { aufnahmeZeit, projektBild, testbilder } from './bilder.ts';
import { DEV } from './site.ts';

export type Projekt = CollectionEntry<'projekte'>;
export type Art = Projekt['data']['art'];

export async function alleProjekte(): Promise<Projekt[]> {
  const liste = await getCollection('projekte', (p) => DEV || p.data.freigabe);
  return liste.sort((a, b) => a.data.reihenfolge - b.data.reihenfolge || a.id.localeCompare(b.id));
}

export async function startseitenProjekte(): Promise<Projekt[]> {
  return (await alleProjekte()).filter((p) => p.data.startseite).slice(0, 3);
}

export async function projekteNachArt(arten: readonly Art[]): Promise<Projekt[]> {
  return (await alleProjekte()).filter((p) => arten.includes(p.data.art));
}

export interface PaarBild {
  bild: ImageMetadata;
  uhrzeit: string;
  alt: string;
}

/** Ein Fotopaar, wie es die Komponenten brauchen. `bilder: null` = Platzhalter. */
export interface Paar {
  id: string;
  motiv: string;
  ort: string;
  projekt: string;
  fokus: string;
  freigegeben: boolean;
  test: boolean;
  bilder: { tag: PaarBild; abend: PaarBild } | null;
}

export async function paarFuer(p: Projekt, lang: Lang, testTexte: { tag: string; abend: string }): Promise<Paar> {
  const o = p.data.owend!;
  const tagBild = projektBild(o.tag.bild);
  const abendBild = projektBild(o.abend.bild);
  const basis = {
    id: p.id,
    motiv: o.motiv[lang],
    ort: p.data.ortschaft,
    projekt: p.data.titel[lang],
    fokus: o.fokus,
    freigegeben: p.data.freigabe,
  };
  if (tagBild && abendBild) {
    return {
      ...basis,
      test: false,
      bilder: {
        tag: { bild: tagBild, uhrzeit: o.tag.uhrzeit || aufnahmeZeit(o.tag.bild) || '', alt: o.alt.tag[lang] },
        abend: { bild: abendBild, uhrzeit: o.abend.uhrzeit || aufnahmeZeit(o.abend.bild) || '', alt: o.alt.abend[lang] },
      },
    };
  }
  const test = await testbilder();
  if (test) {
    return {
      ...basis,
      test: true,
      bilder: {
        tag: { bild: test.tag, uhrzeit: '14:10', alt: testTexte.tag },
        abend: { bild: test.abend, uhrzeit: '21:40', alt: testTexte.abend },
      },
    };
  }
  return { ...basis, test: false, bilder: null };
}

/**
 * Das Paar im Hero: erstes Projekt mit Fotopaar und `startseite: true` nach `reihenfolge`.
 * Im Produktiv-Build nur freigegebene Projekte; gibt es keins, bleibt der Platzhalter
 * mit dem Motiv aus dem ersten geplanten Paar (auch wenn das Projekt nicht freigegeben ist –
 * der Platzhalter zeigt nur das Motiv, keinen Ort).
 */
export async function heroPaar(lang: Lang, testTexte: { tag: string; abend: string }, motivFallback: string): Promise<Paar> {
  const alle = (await getCollection('projekte'))
    .filter((p) => p.data.owend && p.data.startseite)
    .sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const sichtbar = alle.filter((p) => DEV || p.data.freigabe);
  const fertig = sichtbar.find((p) => projektBild(p.data.owend!.tag.bild) && projektBild(p.data.owend!.abend.bild));
  const wahl = fertig ?? sichtbar[0];
  if (wahl) return paarFuer(wahl, lang, testTexte);
  const geplant = alle[0];
  return {
    id: geplant?.id ?? 'startseite',
    motiv: geplant?.data.owend?.motiv[lang] ?? motivFallback,
    ort: '',
    projekt: '',
    fokus: '50% 50%',
    freigegeben: false,
    test: false,
    bilder: null,
  };
}

/**
 * Die weiteren Paare für die Lichtseite (C6): alle Projekte mit Fotopaar außer dem Hero-Paar.
 * Geplante Paare nicht freigegebener Projekte erscheinen im Produktiv-Build nur als Platzhalter
 * mit ihrem Motiv.
 */
export async function lichtPaare(lang: Lang, testTexte: { tag: string; abend: string }, heroId: string): Promise<Paar[]> {
  const alle = (await getCollection('projekte'))
    .filter((p) => p.data.owend && p.id !== heroId)
    .sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const out: Paar[] = [];
  for (const p of alle) {
    if (DEV || p.data.freigabe) out.push(await paarFuer(p, lang, testTexte));
    else out.push({ id: p.id, motiv: p.data.owend!.motiv[lang], ort: '', projekt: '', fokus: '50% 50%', freigegeben: false, test: false, bilder: null });
  }
  return out.slice(0, 5);
}
