/**
 * Favicon-PNGs, favicon.ico und das Open-Graph-Bild für die Zeit bis zum Shooting (G2).
 *   python3 scripts/assets/favicon.py && node scripts/assets/build-assets.mjs
 *
 * OG-Bild (1200 × 630): Fläche in Kalkputz, „Electricité Biesen, Noutem“ in Schibsted Grotesk 800 in Lei,
 * das Logo (Original-PNG, unverändert) klein unten links auf einem Streifen in Weiß.
 * Gerendert mit dem installierten Chrome, damit Kerning und Schrift stimmen.
 */
import sharp from 'sharp';
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pfad = (p) => fileURLToPath(new URL(`../../${p}`, import.meta.url));
const svg = readFileSync(pfad('public/favicon.svg'));

await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(pfad('public/favicon-32.png'));
await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(pfad('public/apple-touch-icon.png'));

// favicon.ico mit eingebettetem 32-px-PNG (für Browser, die /favicon.ico direkt anfragen)
const png32 = readFileSync(pfad('public/favicon-32.png'));
const kopf = Buffer.alloc(22);
kopf.writeUInt16LE(0, 0);
kopf.writeUInt16LE(1, 2);
kopf.writeUInt16LE(1, 4);
kopf.writeUInt8(32, 6);
kopf.writeUInt8(32, 7);
kopf.writeUInt16LE(1, 10);
kopf.writeUInt16LE(32, 12);
kopf.writeUInt32LE(png32.length, 14);
kopf.writeUInt32LE(22, 18);
writeFileSync(pfad('public/favicon.ico'), Buffer.concat([kopf, png32]));

const schrift = readFileSync(pfad('src/assets/fonts/schibsted-grotesk-var.woff2')).toString('base64');
const logo = readFileSync(pfad('src/assets/brand/logo.png')).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face { font-family: 'S'; src: url(data:font/woff2;base64,${schrift}) format('woff2'); font-weight: 400 900; }
html, body { margin: 0; }
.og { position: relative; width: 1200px; height: 630px; background: #F2F3F1; font-family: 'S'; color: #33373C; }
.og h1 { position: absolute; left: 72px; top: 96px; margin: 0; font-weight: 800; font-size: 92px; line-height: 1.02; letter-spacing: -0.025em; max-width: 900px; }
.og .streifen { position: absolute; left: 0; right: 0; bottom: 0; height: 128px; background: #FFFFFF; }
.og img { position: absolute; left: 72px; bottom: 24px; height: 80px; }
</style></head><body><div class="og"><h1>Electricité Biesen, Noutem</h1><div class="streifen"></div><img src="data:image/png;base64,${logo}" alt=""></div></body></html>`;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const bild = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
await sharp(bild).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(pfad('public/og/biesen.png'));
console.log('favicon-32.png, apple-touch-icon.png, favicon.ico, og/biesen.png geschrieben');
