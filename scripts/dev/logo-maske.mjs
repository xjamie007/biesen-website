/**
 * Macht aus einer Logo-Datei die einfarbige Maske für das Markenband (src/assets/marken/).
 * Schneidet auf die deckenden Pixel zu, skaliert auf 160 px Höhe, speichert nur die Deckkraft.
 * „knockout“: helle Flächen werden durchsichtig (weiße Schrift auf farbigem Feld, z. B. Miele).
 *
 *   node scripts/dev/logo-maske.mjs src/assets/marken pfad/logo@2x.png=miele:knockout pfad/aeg.png=aeg
 *
 * Quelle der heutigen Logos: github.com/home-assistant/brands, Ordner core_integrations/<marke>/logo@2x.png
 * (Bosch: custom_integrations/bosch). Farbe für das Überfahren in src/lib/marken.ts.
 */
import sharp from 'sharp';

const [ziel, ...auftraege] = process.argv.slice(2);
for (const auftrag of auftraege) {
  const [quelle, rest] = auftrag.split('=');
  const [name, art] = rest.split(':');
  const { data, info } = await sharp(quelle).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  let [x0, y0, x1, y1] = [info.width, info.height, -1, -1];
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b, a] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
    const hell = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const alpha = art === 'knockout' ? Math.round(a * Math.min(1, Math.max(0, (0.85 - hell) / 0.5))) : a;
    out[i * 4 + 3] = alpha;
    if (alpha > 8) {
      const x = i % info.width;
      const y = Math.floor(i / info.width);
      [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x), Math.max(y1, y)];
    }
  }
  const res = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .resize({ height: 160 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${ziel}/${name}.png`);
  console.log(name, `${res.width}x${res.height}`, `${Math.round(res.size / 1024)} KB`);
}
