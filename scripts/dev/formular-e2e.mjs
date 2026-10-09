/**
 * Formular von Anfang bis Ende: Browser → Edge Function (Probelauf) → Danke-Seite, mit und ohne JavaScript.
 *
 *   1. Edge Function im Probelauf starten (speichert nichts, schickt keine Mail, schreibt ins Protokoll):
 *        cd supabase/functions/anfrage
 *        ANFRAGE_DRY_RUN=1 SITE_URL=http://localhost:4321 deno run --allow-net --allow-env --allow-read --allow-sys index.ts > /tmp/anfrage.log 2>&1
 *   2. Seite mit dieser Adresse bauen und ausliefern:
 *        PUBLIC_FORM_URL=http://localhost:8000 npm run build && npm run preview
 *   3. ANFRAGE_LOG=/tmp/anfrage.log CHROME_PATH=… node scripts/dev/formular-e2e.mjs
 *
 * Prüft: Vorauswahl über ?anliegen=, Zusatzfragen je Anliegen, Fehler am Feld beim leeren Absenden,
 * Server-Prüfung ohne JavaScript (Rücksprung mit Hinweis), Lockvogelfeld gegen Bots, Hausgerät ohne
 * Gebäudefrage. Endet mit Code 1, wenn eine Prüfung fehlschlägt.
 */
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const LOG = process.env.ANFRAGE_LOG || '/tmp/anfrage.log';
const B = (process.env.BASE_URL || 'http://localhost:4321').replace(/\/+$/, '');
const out = fileURLToPath(new URL('./out/', import.meta.url));
mkdirSync(out, { recursive: true });

// Kleines PNG als Testdatei (8 × 8 Pixel, Bletz-Giel)
const BILD = `${out}zaehlerkasten.png`;
{
  const crc = (b) => {
    let c = ~0;
    for (const x of b) {
      c ^= x;
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return ~c >>> 0;
  };
  const teil = (typ, daten) => {
    const t = Buffer.from(typ);
    const l = Buffer.alloc(4);
    l.writeUInt32BE(daten.length);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(Buffer.concat([t, daten])));
    return Buffer.concat([l, t, daten, c]);
  };
  const kopf = Buffer.alloc(13);
  kopf.writeUInt32BE(8, 0);
  kopf.writeUInt32BE(8, 4);
  kopf.set([8, 2, 0, 0, 0], 8);
  const zeilen = Buffer.concat(Array.from({ length: 8 }, () => Buffer.from([0, ...Array(8).fill([0xff, 0xca, 0x24]).flat()])));
  writeFileSync(
    BILD,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      teil('IHDR', kopf),
      teil('IDAT', zlib.deflateSync(zeilen)),
      teil('IEND', Buffer.alloc(0)),
    ]),
  );
}

const logLaenge = () => readFileSync(LOG, 'utf8').length;
const neuesLog = (ab) => readFileSync(LOG, 'utf8').slice(ab);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox'],
});

let fehlerZahl = 0;
const pruefe = (name, ok, extra = '') => {
  console.log(`${ok ? 'OK  ' : 'FEHL'} ${name}${extra ? ' — ' + extra : ''}`);
  if (!ok) fehlerZahl++;
};
const waehle = (page, name, wert) => page.click(`label:has(> input[name="${name}"][value="${wert}"])`);

async function ausfuellen(page, { anliegen, gebaeude = 'haus', ort = 'Wiltz', datei = true, honig = false }) {
  if (anliegen) await waehle(page, 'anliegen', anliegen);
  if (gebaeude) await waehle(page, 'gebaeude', gebaeude);
  await page.type('#ortschaft', ort);
  await page.type('#beschreibung', 'Einfamilienhaus, Dach nach Süden, etwa 40 m². Wir möchten eine PV-Anlage mit Speicher.');
  if (datei) {
    const f = await page.$('#dateien');
    await f.uploadFile(BILD);
  }
  await page.type('#name', 'Test Person');
  await page.type('#email', 'test@beispiel.lu');
  await page.type('#telefon', '+352 621 000 000');
  await page.click('label:has(> input[name="einwilligung"])');
  if (honig) await page.$eval('#website', (e) => (e.value = 'http://spam.example'));
}

// 1) Mit JavaScript, Deutsch, Desktop: leeres Absenden, dann vollständig
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(`${B}/de/kontakt/?anliegen=photovoltaik`, {
    waitUntil: 'networkidle0',
  });
  const vor = await page.$eval('input[name="anliegen"][value="photovoltaik"]', (e) => e.checked);
  pruefe('Vorauswahl ?anliegen=photovoltaik', vor);
  const zusatz = await page.$$eval('[data-nur]', (l) =>
    l.filter((e) => !e.disabled && e.offsetHeight > 0).map((e) => e.dataset.nur),
  );
  pruefe('Photovoltaik: keine fremden Zusatzfragen sichtbar', zusatz.length === 0, zusatz.join(','));
  await waehle(page, 'anliegen', 'ladestation');
  const lade = await page.$$eval('[data-nur]', (l) =>
    l.filter((e) => !e.disabled && e.offsetHeight > 0).map((e) => e.dataset.nur),
  );
  pruefe('Ladestation gewählt: deren Zusatzfragen erscheinen', lade.join() === 'ladestation', lade.join(','));
  await waehle(page, 'anliegen', 'photovoltaik');
  const ab = logLaenge();
  await page.click('[data-senden]');
  await new Promise((r) => setTimeout(r, 400));
  const z = await page.evaluate(() => ({
    url: location.href,
    fehler: [...document.querySelectorAll('.fehler:not([hidden])')].map((e) => e.id),
    fokus: document.activeElement?.matches('[data-zusammenfassung]'),
    text: document.querySelector('[data-zusammenfassung]').textContent.trim(),
  }));
  pruefe('leer: bleibt auf der Seite', z.url.includes('/de/kontakt/'));
  pruefe('leer: Fehler an den Feldern', z.fehler.length >= 4, z.fehler.join(','));
  pruefe('leer: Fokus auf Zusammenfassung', z.fokus, z.text.slice(0, 90));
  pruefe('leer: nichts an den Server geschickt', !neuesLog(ab).includes('[probelauf]'));
  await ausfuellen(page, {});
  const liste = await page.$eval('[data-dateiliste]', (e) => e.textContent.trim());
  pruefe('Datei wird in der Liste angezeigt (mit KB)', liste.includes('zaehlerkasten.png') && /KB/.test(liste), liste);
  const ab2 = logLaenge();
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('[data-senden]')]);
  const ziel = page.url();
  const h1 = await page.$eval('h1', (e) => e.textContent.trim());
  pruefe('JS an: Weiterleitung auf Danke-Seite', ziel === `${B}/de/kontakt/danke/`, `${ziel} „${h1}“`);
  await new Promise((r) => setTimeout(r, 300));
  const log = neuesLog(ab2);
  pruefe('Server hat die Anfrage erhalten (Probelauf)', log.includes('[probelauf]'));
  pruefe(
    '… mit Ortschaft, Name, Datei',
    log.includes('Wiltz') && log.includes('Test Person') && log.includes('zaehlerkasten.png'),
  );
  console.log('---- Ausschnitt Protokoll ----\n' + log.split('\n').slice(0, 22).join('\n') + '\n------------------------------');
  await page.close();
}

// 2) Ohne JavaScript, Französisch: Server-Prüfung, dann vollständig
{
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${B}/fr/contact/`, { waitUntil: 'networkidle0' });
  await page.type('#name', 'Sans JS');
  const ab = logLaenge();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.$eval('form[data-formular]', (f) => f.submit()),
  ]);
  const u = new URL(page.url());
  pruefe(
    'ohne JS, unvollständig: zurück zum Formular mit ?fehler=',
    u.pathname === '/fr/contact/' && u.searchParams.has('fehler') && u.hash === '#fehlt',
    page.url(),
  );
  pruefe('ohne JS, unvollständig: nichts verarbeitet', !neuesLog(ab).includes('[probelauf]'));
  const hinweis = await page.$eval('#fehlt', (e) => ({
    h: e.getBoundingClientRect().height,
    t: e.textContent.trim().slice(0, 70),
  }));
  pruefe('ohne JS, unvollständig: Hinweis oben sichtbar', hinweis.h > 0, hinweis.t);
  await page.goto(`${B}/fr/contact/`, { waitUntil: 'networkidle0' });
  await ausfuellen(page, {
    anliegen: 'renovierung',
    gebaeude: 'landwirtschaft',
    ort: 'Eschweiler',
    datei: true,
  });
  const ab2 = logLaenge();
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('[data-senden]')]);
  pruefe('ohne JS, vollständig: Danke-Seite', page.url() === `${B}/fr/contact/merci/`, page.url());
  await new Promise((r) => setTimeout(r, 300));
  const log = neuesLog(ab2);
  pruefe('ohne JS: Server hat Anfrage mit Sprache fr', log.includes('[probelauf]') && log.includes('Eschweiler'));
  await page.close();
}

// 3) Lockvogelfeld (Bot): Danke-Seite, aber nichts verarbeitet
{
  const page = await browser.newPage();
  await page.goto(`${B}/en/contact/`, { waitUntil: 'networkidle0' });
  await ausfuellen(page, { anliegen: 'licht', datei: false, honig: true });
  const ab = logLaenge();
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('[data-senden]')]);
  await new Promise((r) => setTimeout(r, 300));
  pruefe('Bot (Lockvogelfeld): Danke-Seite', page.url() === `${B}/en/contact/thank-you/`, page.url());
  pruefe('Bot: nichts verarbeitet', !neuesLog(ab).includes('[probelauf]'));
  await page.close();
}

// 4) Hausgerät auf Luxemburgisch, Handy: Gebäude entfällt, Gerät ist Pflicht
{
  const page = await browser.newPage();
  await page.setViewport({
    width: 360,
    height: 740,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${B}/lb/kontakt/?anliegen=hausgeraet`, {
    waitUntil: 'networkidle0',
  });
  const gebWeg = await page.$eval('#feld-gebaeude', (e) => e.hidden && e.disabled);
  pruefe('Hausgerät: Gebäudefrage ausgeblendet', gebWeg);
  await ausfuellen(page, { gebaeude: null, datei: false });
  await page.click('[data-senden]');
  await new Promise((r) => setTimeout(r, 300));
  const f = await page.$$eval('.fehler:not([hidden])', (l) => l.map((e) => e.id));
  pruefe('Hausgerät ohne Gerät: Fehler am Feld Gerät', f.includes('fehler-geraet'), f.join(','));
  await page.type('#geraet', 'Miele Waschmaschine W1');
  const ab = logLaenge();
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('[data-senden]')]);
  await new Promise((r) => setTimeout(r, 300));
  pruefe('Hausgerät LB: Danke-Seite', page.url() === `${B}/lb/kontakt/merci/`, page.url());
  pruefe('Hausgerät LB: Server erhielt Gerät', neuesLog(ab).includes('Miele Waschmaschine W1'));
  await page.close();
}
await browser.close();
console.log(fehlerZahl ? `${fehlerZahl} Prüfungen fehlgeschlagen` : 'Alle Prüfungen bestanden');
process.exitCode = fehlerZahl ? 1 : 0;
