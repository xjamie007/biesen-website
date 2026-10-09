/**
 * Sprachen und übersetzte URLs (D1).
 * Standardsprache (x-default) ist Französisch. Reihenfolge im Umschalter: FR, DE, LB, EN.
 * Luxemburgische Slugs sind Entwürfe und stehen in LB-REVIEW.md zur Prüfung.
 */
export const LANGS = ['fr', 'de', 'lb', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';

export function isLang(x: unknown): x is Lang {
  return typeof x === 'string' && (LANGS as readonly string[]).includes(x);
}

/** Name der Sprache in der eigenen Sprache (für Screenreader im Umschalter). */
export const LANG_NAME: Record<Lang, string> = {
  fr: 'Français',
  de: 'Deutsch',
  lb: 'Lëtzebuergesch',
  en: 'English',
};

/**
 * Reihenfolge und Kürzel im Sprachumschalter: Lëtzebuergesch, Deutsch, English, Français
 * (Wunsch von Nave, 09.10.2026). Luxemburgisch heißt sichtbar „LU“, im Code und in hreflang bleibt es „lb“.
 */
export const SPRACH_REIHENFOLGE: readonly Lang[] = ['lb', 'de', 'en', 'fr'];
export const SPRACH_KURZ: Record<Lang, string> = { lb: 'LU', de: 'DE', en: 'EN', fr: 'FR' };

/** Locale für Intl (Datum). „lb“ kennt nicht jede Laufzeit, dann de-LU. */
const INTL_LOCALE: Record<Lang, string> = { fr: 'fr-LU', de: 'de-LU', lb: 'lb', en: 'en-GB' };

export function intlLocale(lang: Lang): string {
  const wanted = INTL_LOCALE[lang];
  try {
    if (Intl.DateTimeFormat.supportedLocalesOf([wanted]).length === 0) return 'de-LU';
  } catch {
    return 'de-LU';
  }
  return wanted;
}

type SlugTable = Record<Lang, string>;

/** Seiten mit festem Slug. Leerer Slug = Startseite der Sprache. */
export const PAGE_SLUGS = {
  home: { fr: '', de: '', lb: '', en: '' },
  leistungen: { fr: 'services', de: 'leistungen', lb: 'leeschtungen', en: 'services' },
  installation: {
    fr: 'installation-electrique',
    de: 'elektroinstallation',
    lb: 'elektroinstallatioun',
    en: 'electrical-installation',
  },
  licht: { fr: 'eclairage', de: 'licht', lb: 'liicht', en: 'lighting' },
  photovoltaik: {
    fr: 'photovoltaique-borne-de-recharge',
    de: 'photovoltaik-ladestation',
    lb: 'photovoltaik-luedstatioun',
    en: 'solar-ev-charging',
  },
  sicherheit: {
    fr: 'alarme-video-detection-incendie',
    de: 'alarm-video-brandmelder',
    lb: 'alarm-video-feiermelder',
    en: 'alarm-cctv-fire-detection',
  },
  hausgeraete: { fr: 'electromenager', de: 'hausgeraete', lb: 'haushaltsapparater', en: 'home-appliances' },
  projekte: { fr: 'realisations', de: 'projekte', lb: 'projeten', en: 'projects' },
  ueberUns: { fr: 'entreprise', de: 'ueber-uns', lb: 'iwwer-eis', en: 'about' },
  jobs: { fr: 'emplois', de: 'jobs', lb: 'jobs', en: 'jobs' },
  kontakt: { fr: 'contact', de: 'kontakt', lb: 'kontakt', en: 'contact' },
  danke: { fr: 'contact/merci', de: 'kontakt/danke', lb: 'kontakt/merci', en: 'contact/thank-you' },
  impressum: { fr: 'mentions-legales', de: 'impressum', lb: 'impressum', en: 'legal-notice' },
  datenschutz: { fr: 'protection-des-donnees', de: 'datenschutz', lb: 'dateschutz', en: 'privacy' },
} satisfies Record<string, SlugTable>;

export type PageKey = keyof typeof PAGE_SLUGS;

/** Die fünf Leistungsseiten in der Reihenfolge der Startseite (Licht an zweiter Stelle). */
export const SERVICE_PAGES = ['installation', 'licht', 'photovoltaik', 'sicherheit', 'hausgeraete'] as const;
export type ServicePage = (typeof SERVICE_PAGES)[number];

/** Eine Route beschreibt eine Seite unabhängig von der Sprache. Job-Slugs kommen aus src/content/jobs/. */
export type Route = { page: PageKey } | { page: 'job'; id: string; slugs: SlugTable };

/**
 * Basis-Pfad: '' auf der eigenen Domain, z. B. '/biesen-website' auf GitHub Pages.
 * Außerhalb von Astro (Tests, Skripte) leer.
 */
export const BASE = ((import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/').replace(/\/$/, '');

/** Hängt den Basis-Pfad vor einen Pfad ab Wurzel. */
export function withBase(p: string): string {
  return BASE + p;
}

/** Pfad einer Seite ab Wurzel, ohne Basis-Pfad (für getStaticPaths). */
export function routePath(lang: Lang, route: Route): string {
  if (route.page === 'job') return `/${lang}/${PAGE_SLUGS.jobs[lang]}/${route.slugs[lang]}/`;
  const slug = PAGE_SLUGS[route.page][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

/** Link zu einer Seite, mit Basis-Pfad. */
export function pathFor(lang: Lang, route: Route): string {
  return withBase(routePath(lang, route));
}

/** Kurzform: path('de', 'licht') */
export function path(lang: Lang, page: PageKey): string {
  return pathFor(lang, { page });
}

export function alternates(route: Route): { lang: Lang; href: string }[] {
  return LANGS.map((lang) => ({ lang, href: pathFor(lang, route) }));
}
