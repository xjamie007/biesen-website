/**
 * Open-Graph-Bild der Startseite (G2): das Abendfoto des Startseiten-Paars, ohne Text darauf,
 * das Logo klein unten links auf einem Streifen in Weiß. Entsteht nur, wenn das Paar
 * freigegeben ist und beide Bilder da sind; sonst gilt public/og/biesen.png.
 */
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { heroPaar } from '@/lib/projekte';

const W = 1200;
const H = 630;
const STREIFEN = 104;

export async function getStaticPaths() {
  const paar = await heroPaar('fr', { tag: '', abend: '' }, '');
  if (!paar.bilder || paar.test || !paar.freigegeben) return [];
  return [{ params: { name: 'startseite' } }];
}

export const GET: APIRoute = async () => {
  const paar = await heroPaar('fr', { tag: '', abend: '' }, '');
  const quelle = (paar.bilder!.abend.bild as unknown as { fsPath?: string }).fsPath;
  if (!quelle) throw new Error('OG-Bild: Pfad des Abendfotos unbekannt');
  const [x, y] = paar.fokus.split(/\s+/).map((v) => (v.endsWith('%') ? Number(v.slice(0, -1)) / 100 : 0.5));
  const foto = await sharp(quelle)
    .resize(W, H - STREIFEN, { fit: 'cover', position: y < 0.4 ? 'north' : y > 0.6 ? 'south' : x < 0.4 ? 'west' : x > 0.6 ? 'east' : 'centre' })
    .toBuffer();
  const logo = await sharp(readFileSync(join(process.cwd(), 'src/assets/brand/logo.png'))).resize({ height: 72 }).toBuffer();
  const png = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([
      { input: foto, top: 0, left: 0 },
      { input: logo, top: H - STREIFEN + 16, left: 40 },
    ])
    .png()
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
