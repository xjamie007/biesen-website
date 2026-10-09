/** Feiertage (Ostern), Zeiten-Gruppen und openingHoursSpecification (G3) */
import { describe, expect, it } from 'vitest';
import { feiertage, ostersonntag } from '@/lib/feiertage';
import { kurzText, naechsteSchliessungen, openingHoursSpecification, wochenGruppen, zeiten } from '@/lib/zeiten';
import { useT } from '@/i18n';

describe('Feiertage Luxemburg', () => {
  it('Ostersonntag', () => {
    expect(ostersonntag(2026)).toBe('2026-04-05');
    expect(ostersonntag(2027)).toBe('2027-03-28');
    expect(ostersonntag(2028)).toBe('2028-04-16');
  });
  it('bewegliche Feiertage 2026', () => {
    const f = Object.fromEntries(feiertage(2026).map((x) => [x.key, x.datum]));
    expect(f.ostermontag).toBe('2026-04-06');
    expect(f.himmelfahrt).toBe('2026-05-14');
    expect(f.pfingstmontag).toBe('2026-05-25');
    expect(feiertage(2026)).toHaveLength(11);
  });
  it('oeffnungszeiten.json enthält 2026 bis 2028 und stimmt mit der Berechnung überein', () => {
    const erwartet = [2026, 2027, 2028].flatMap((j) => feiertage(j).map((f) => f.datum));
    expect(zeiten.feiertage.map((f) => f.datum)).toEqual(erwartet);
    for (const f of zeiten.feiertage) expect(Object.keys(f.name).sort()).toEqual(['de', 'en', 'fr', 'lb']);
  });
});

describe('Zeiten', () => {
  it('Mo bis Fr gleich, Sa und So geschlossen', () => {
    const g = wochenGruppen();
    expect(g.map((x) => `${x.von}-${x.bis}`)).toEqual(['mo-fr', 'sa-so']);
  });
  it('Kurzform im Footer', () => {
    expect(kurzText(useT('de'))).toBe('Mo bis Fr 08:00–12:00 und 13:30–16:30');
  });
  it('nächste Schließtage: Allerheiligen 2026 (Sonntag) und 26.12.2026 (Samstag) werden nicht genannt', () => {
    const s = naechsteSchliessungen('de', '2026-10-06', 3, 120);
    expect(s.map((x) => x.von)).toEqual(['2026-12-25', '2027-01-01']);
  });
  it('openingHoursSpecification: zwei Blöcke Mo–Fr, Feiertage geschlossen', () => {
    const o = openingHoursSpecification('2026-10-06') as Record<string, unknown>[];
    expect(o[0]).toMatchObject({ opens: '08:00', closes: '12:00' });
    expect(o[1]).toMatchObject({ opens: '13:30', closes: '16:30' });
    expect(o.some((x) => x.validFrom === '2026-12-25' && x.opens === '00:00' && x.closes === '00:00')).toBe(true);
    expect(o.some((x) => x.validFrom === '2026-05-01')).toBe(false);
  });
});
