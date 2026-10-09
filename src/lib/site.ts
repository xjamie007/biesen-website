import siteJson from '@/content/site.json';
import { withBase } from '@/i18n/config';

export const site = siteJson;

/** tel:-Links (C4: tel:+352958099) */
export const telHref = `tel:${site.telefon.tel}`;
export const bewerbungTelHref = `tel:${site.bewerbung.telefon.tel}`;
export const mailHref = `mailto:${site.email}`;

/** Adresse in einer Zeile, NAP wie im JSON-LD */
export const adresseZeile = `${site.adresse.strasse}, ${site.adresse.plzAnzeige} ${site.adresse.ort}`;

/**
 * Herkunft der Website aus astro.config (site = SITE_URL).
 * In Tests und Skripten der Standardwert.
 */
export const SITE_ORIGIN = (() => {
  const s = (import.meta as { env?: { SITE?: string } }).env?.SITE;
  return s ? new URL(s).origin : 'https://electricite-biesen.lu';
})();

/** Absolute URL zu einem Pfad ab Wurzel (mit Basis-Pfad). */
export function absolute(pathWithBase: string): string {
  return new URL(pathWithBase, SITE_ORIGIN).toString();
}

export const ORG_ID = `${SITE_ORIGIN}${withBase('/')}#firma`;

/** Adresse der Edge Function fürs Formular (nur Umgebungsvariable, nie im Code) */
export const FORM_URL = ((import.meta as { env?: Record<string, string | undefined> }).env?.PUBLIC_FORM_URL ?? '').trim();

/** Im Dev-Modus erscheinen nicht freigegebene Projekte und die Testflächen der Fotopaare */
export const DEV = (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

/**
 * Vorschau (z. B. auf github.io, solange noch Platzhalter auf der Seite stehen):
 * alle Seiten noindex, robots.txt sperrt. Abschalten mit der GitHub-Variable LIVE=true.
 */
export const VORSCHAU = (import.meta as { env?: Record<string, string | undefined> }).env?.PUBLIC_VORSCHAU === '1';
