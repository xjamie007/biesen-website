import { assertEquals, assert } from 'jsr:@std/assert@1';
import { betreff, dateiErlaubt, fehlerZiel, mailText, pruefe, sichererName } from './lib.ts';

const basis = {
  sprache: 'de',
  anliegen: 'ladestation',
  gebaeude: 'haus',
  ortschaft: 'Wiltz',
  beschreibung: 'Carport neben dem Haus',
  name: 'Anna Muster',
  email: 'anna@example.lu',
  einwilligung: 'ja',
};

Deno.test('gültige Anfrage Ladestation, Betreff wie im Briefing', () => {
  const p = pruefe({ ...basis, abstand: 'unter10', pv: 'geplant', fertighaus: 'ja' }, []);
  assert(p.ok);
  if (!p.ok) return;
  assertEquals(betreff(p.anfrage), '[Ladestation] Haus, Wiltz – Anna Muster');
  assertEquals(p.anfrage.fertighaus, null, 'Fertighaus nur bei Neubau');
  assertEquals(p.anfrage.pv, 'geplant');
});

Deno.test('Neubau mit Fertighaus', () => {
  const p = pruefe({ ...basis, anliegen: 'neubau', fertighaus: 'ja', ortschaft: 'Nothum' }, []);
  assert(p.ok);
  if (p.ok) assertEquals(betreff(p.anfrage), '[Neubau, Fertighaus] Haus, Nothum – Anna Muster');
});

Deno.test('Hausgerät: Gerät Pflicht, kein Gebäude', () => {
  const ohne = pruefe({ ...basis, anliegen: 'hausgeraet', gebaeude: '' }, []);
  assertEquals(ohne.ok ? [] : ohne.felder, ['geraet']);
  const mit = pruefe({ ...basis, anliegen: 'hausgeraet', gebaeude: 'haus', geraet: 'Backofen' }, []);
  assert(mit.ok);
  if (mit.ok) {
    assertEquals(mit.anfrage.gebaeude, null);
    assertEquals(betreff(mit.anfrage), '[Hausgerät] Wiltz – Anna Muster');
  }
});

Deno.test('fehlende Pflichtfelder', () => {
  const p = pruefe({ sprache: 'fr' }, []);
  assert(!p.ok);
  if (!p.ok) {
    assertEquals(p.sprache, 'fr');
    assertEquals(p.felder, ['anliegen', 'ortschaft', 'beschreibung', 'name', 'email', 'einwilligung']);
  }
});

Deno.test('Gebäude Pflicht außer bei Hausgerät', () => {
  const p = pruefe({ ...basis, gebaeude: '' }, []);
  assertEquals(p.ok ? [] : p.felder, ['gebaeude']);
});

Deno.test('Dateien: Anzahl, Größe, Typ', () => {
  const bild = { name: 'kasten.jpg', type: 'image/jpeg', size: 1000 };
  assert(pruefe(basis, [bild]).ok);
  assertEquals(pruefe(basis, Array(6).fill(bild)).ok, false);
  assertEquals(pruefe(basis, [{ ...bild, size: 10 * 1024 * 1024 + 1 }]).ok, false);
  assertEquals(dateiErlaubt({ name: 'plan.pdf', type: 'application/pdf', size: 1 }), true);
  assertEquals(dateiErlaubt({ name: 'virus.exe', type: 'image/jpeg', size: 1 }), false);
  assertEquals(dateiErlaubt({ name: 'plan.docx', type: 'application/vnd.openxmlformats', size: 1 }), false);
});

Deno.test('unbekannte Sprache wird Französisch', () => {
  const p = pruefe({ ...basis, sprache: 'xx' }, []);
  assert(p.ok);
  if (p.ok) assertEquals(p.anfrage.sprache, 'fr');
});

Deno.test('Mailtext nennt die Sprache und die Links', () => {
  const p = pruefe({ ...basis, sprache: 'lb' }, []);
  assert(p.ok);
  if (!p.ok) return;
  const text = mailText(p.anfrage, [{ name: 'kasten.jpg', url: 'https://x/sign/1' }], 30, new Date('2026-10-06T10:00:00Z'), 'k-1');
  assert(text.includes('Sprache des Absenders: Luxemburgisch (lb)'));
  assert(text.includes('kasten.jpg: https://x/sign/1'));
  assert(text.includes('30 Tage'));
});

Deno.test('sichere Dateinamen', () => {
  assertEquals(sichererName('Sicherungskasten Küche (2).JPG', 0), '1-Sicherungskasten-Kuche-2-.JPG');
  assertEquals(sichererName('../../etc/passwd', 1), '2-etc-passwd');
});

Deno.test('Weiterleitung bei Fehlern zurück zum Formular', () => {
  assertEquals(fehlerZiel('https://electricite-biesen.lu', 'de', ['gebaeude', 'geraet']), 'https://electricite-biesen.lu/de/kontakt/?fehler=gebaeude%2Cgeraet#fehlt');
});
