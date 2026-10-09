/**
 * Testflächen für die Fotopaare (C5, Fallback 4): hell „Test Tag“, dunkel „Test Abend“.
 * Nur für den Dev-Modus (src/lib/bilder.ts lädt sie nur dort; check-dist.ts prüft den Build).
 *   npm run testbilder
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const W = 3000;
const H = 2000;
const ziel = new URL('../../src/assets/_dev/', import.meta.url);
mkdirSync(ziel, { recursive: true });

function svg(hinter, vorder, text) {
  // Raster aus Linien, damit Ausschnitt und Überblendung erkennbar sind
  const linien = [];
  for (let x = 0; x <= W; x += 250) linien.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${vorder}" stroke-opacity="0.15" stroke-width="2"/>`);
  for (let y = 0; y <= H; y += 250) linien.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${vorder}" stroke-opacity="0.15" stroke-width="2"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="100%" height="100%" fill="${hinter}"/>
    ${linien.join('')}
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-size="220" font-weight="700" fill="${vorder}">${text}</text>
  </svg>`;
}

await sharp(Buffer.from(svg('#e4e7ea', '#33373c', 'Test Tag'))).jpeg({ quality: 80 }).toFile(fileURLToPath(new URL('test-tag.jpg', ziel)));
await sharp(Buffer.from(svg('#1d2733', '#f2f3f1', 'Test Abend'))).jpeg({ quality: 80 }).toFile(fileURLToPath(new URL('test-abend.jpg', ziel)));
console.log('src/assets/_dev/test-tag.jpg und test-abend.jpg geschrieben');
