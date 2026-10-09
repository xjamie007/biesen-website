/** Häufige Fragen (E6). Die Frage zum Notdienst wird nicht angezeigt, bis der Kunde sie beantwortet. */
import { escapeHtml, fmt, hasOpenPoint, type Dict } from '@/i18n';
import { path, type Lang } from '@/i18n/config';
import { site, telHref } from './site.ts';

export const FAQ_KEYS = ['gebiet', 'angebot', 'kostenlos', 'fertighaus', 'ladestation', 'zuschuesse', 'hausgeraete', 'sprachen'] as const;
export type FaqKey = (typeof FAQ_KEYS)[number];

/** HTML für die Platzhalter in den Antworten */
export function faqHtml(lang: Lang, t: Dict): Record<string, string> {
  return {
    tel: `<a href="${telHref}" class="zahl">${escapeHtml(site.telefon.anzeige)}</a>`,
    formular: `<a href="${path(lang, 'kontakt')}">${escapeHtml(t.faq.angebot.formular)}</a>`,
    klimabonus: `<a href="${site.klimabonus}">klimabonus.lu</a>`,
  };
}

/** Text der Antwort ohne HTML, für FAQPage im JSON-LD */
function faqText(t: Dict, key: FaqKey): string {
  return fmt(t.faq[key].a, { tel: site.telefon.anzeige, formular: t.faq.angebot.formular, klimabonus: 'klimabonus.lu' });
}

/**
 * FAQPage nur mit Fragen, deren Antwort keinen offenen Punkt enthält:
 * unbestätigte Aussagen gehören nicht in strukturierte Daten.
 */
export function faqJsonItems(t: Dict, keys: readonly FaqKey[]): { q: string; a: string }[] {
  return keys
    .filter((k) => !hasOpenPoint(t.faq[k].a))
    .map((k) => ({ q: t.faq[k].q, a: faqText(t, k).replace(/\u00AD/g, '') }));
}
