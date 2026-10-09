/**
 * Erster Bildschirm der Startseite: Steht ohne Scrollen da, wer wir sind, was wir machen, wo, wie man
 * anfragt und anruft, und stehen alle fünf Leistungen im Bild? Für typische Bildschirmgrößen und alle
 * Sprachen. Eine Kachel zählt nur, wenn ihr Name ganz im Bild steht (oben, unten, links, rechts) und
 * kein Wort aus der Kachel ragt.
 *
 *   npm run build && npm run preview
 *   CHROME_PATH=… node scripts/dev/erster-bildschirm.mjs   (SPRACHEN=de,fr  BASE_URL=…)
 */
import puppeteer from 'puppeteer-core';

const B = (process.env.BASE_URL || 'http://localhost:4321').replace(/\/+$/, '');
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox'],
});
const groessen = [
  [1920, 1080],
  [1536, 864],
  [1440, 900],
  [1366, 768],
  [1280, 720],
  [1024, 768],
  [800, 1000],
  [768, 1024],
  [390, 844],
  [360, 740],
];
for (const lang of (process.env.SPRACHEN ?? 'lb,de,en,fr').split(','))
  for (const [w, h] of groessen) {
    const page = await browser.newPage();
    await page.setViewport({
      width: w,
      height: h,
      isMobile: w < 768,
      hasTouch: w < 768,
    });
    await page.goto(`${B}/${lang}/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1600));
    const r = await page.evaluate(() => {
      const sicht = (el) => {
        if (!el) return false;
        const b = el.getBoundingClientRect();
        return b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth && b.height > 0;
      };
      // ganz lesbar: im Bild und nicht abgeschnitten (kein Wort ragt aus der Kachel)
      const lesbar = (el) => sicht(el) && el.scrollWidth <= el.clientWidth + 1;
      const tel = [...document.querySelectorAll('a[href^="tel:"]')].some(sicht);
      const kacheln = [...document.querySelectorAll('.kachel__name')];
      return {
        wer_was: sicht(document.querySelector('.hero__titel')),
        leistungen_satz: sicht(document.querySelector('.hero__lead')),
        anfrage: sicht(document.querySelector('.hero__aktionen .knopf')),
        telefon: tel,
        wo: sicht(document.querySelector('.hero__fakten')),
        kacheln: `${kacheln.filter(lesbar).length}/5`,
      };
    });
    console.log(lang, `${w}x${h}`.padEnd(10), JSON.stringify(r));
    await page.close();
  }
await browser.close();
