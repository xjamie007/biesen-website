/**
 * Screenshots zur Selbstkontrolle (H, „Zurückhaltung“) mit dem installierten Chrome.
 *
 *   node scripts/dev/screens.mjs <url> [--w 375] [--h 812] [--scroll 0,200,400] [--full] [--reduced] [--nojs] [--name x]
 *
 * Bilder landen in scripts/dev/out/ (nicht im Repository).
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const url = args[0];
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const flag = (k) => args.includes(`--${k}`);
const w = Number(opt('w', 375));
const h = Number(opt('h', 812));
const scrolls = String(opt('scroll', '0')).split(',').map(Number);
const name = opt('name', 'shot');
const out = fileURLToPath(new URL('./out/', import.meta.url));
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
if (flag('reduced')) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
if (flag('nojs')) await page.setJavaScriptEnabled(false);
const fehler = [];
page.on('console', (m) => m.type() === 'error' && fehler.push(m.text()));
page.on('pageerror', (e) => fehler.push(String(e)));
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
for (const y of scrolls) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 350));
  const datei = `${out}${name}-${w}-${y}.png`;
  await page.screenshot({ path: datei, fullPage: flag('full') });
  console.log(datei);
}
if (fehler.length) console.log('Konsole:', fehler.join('\n'));
await browser.close();
