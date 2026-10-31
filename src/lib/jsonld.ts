/**
 * Strukturierte Daten (G3). Alles entspricht dem sichtbaren Inhalt.
 * Kein foundingDate, kein aggregateRating, keine review, kein areaServed (unbestätigt).
 */
import { withBase } from '@/i18n/config';
import { absolute, ORG_ID, site } from './site.ts';
import { openingHoursSpecification } from './zeiten.ts';

export const LOGO_URL = absolute(withBase('/logo.png'));

const adresse = {
  '@type': 'PostalAddress',
  streetAddress: site.adresse.strasse,
  postalCode: site.adresse.plz,
  addressLocality: site.adresse.ort,
  addressRegion: site.adresse.gemeinde,
  addressCountry: site.adresse.land,
};

/** Die Firma, auf jeder Seite, mit fester @id. */
export function firma() {
  const sameAs = [site.facebook, site.editus].filter((x): x is string => typeof x === 'string' && x.length > 0);
  return {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: absolute(withBase('/fr/')),
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: site.telefon.international,
    faxNumber: site.fax.international,
    email: site.email,
    vatID: site.mwst.nummer,
    identifier: { '@type': 'PropertyValue', propertyID: site.rcs.gericht, value: site.rcs.nummer },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: site.mitarbeitende },
    address: adresse,
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.googleProfil,
    knowsLanguage: site.sprachenKunden,
    sameAs,
    openingHoursSpecification: openingHoursSpecification(),
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.url),
    })),
  };
}

/** Nur Fragen, deren Antwort keinen offenen Punkt enthält (siehe Faq.astro). */
export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function service(opts: { name: string; description: string; url: string; serviceType: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: absolute(opts.url),
    provider: { '@id': ORG_ID },
  };
}

export function jobPosting(opts: {
  title: string;
  descriptionHtml: string;
  datePosted: string;
  validThrough: string | null;
  vollzeit: boolean | null;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: opts.title,
    description: opts.descriptionHtml,
    datePosted: opts.datePosted,
    ...(opts.validThrough ? { validThrough: `${opts.validThrough}T23:59:59+01:00` } : {}),
    ...(opts.vollzeit === true ? { employmentType: 'FULL_TIME' } : opts.vollzeit === false ? { employmentType: 'PART_TIME' } : {}),
    hiringOrganization: { '@type': 'Organization', '@id': ORG_ID, name: site.name, sameAs: absolute(withBase('/fr/')), logo: LOGO_URL },
    jobLocation: { '@type': 'Place', address: adresse },
    directApply: false,
    url: absolute(opts.url),
  };
}

/** Die Leistungen als Katalog (Startseite, Übersicht), genau wie sie sichtbar auf der Seite stehen. */
export function leistungsKatalog(name: string, items: { name: string; description: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name,
    provider: { '@id': ORG_ID },
    itemListElement: items.map((it, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: {
        '@type': 'Service',
        name: it.name,
        description: it.description,
        url: absolute(it.url),
        provider: { '@id': ORG_ID },
      },
    })),
  };
}

/** Die Website als Ganzes, auf jeder Seite (verknüpft Seiten, Sprachen und Firma). */
export const WEBSITE_ID = absolute(withBase('/#website'));

export function webseite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    alternateName: site.legalName,
    url: absolute(withBase('/fr/')),
    inLanguage: ['fr', 'de', 'lb', 'en'],
    publisher: { '@id': ORG_ID },
    copyrightHolder: { '@id': ORG_ID },
  };
}

/**
 * Die einzelne Seite: Typ nach Inhalt (Kontakt, Über uns, Sammlung), Sprache, Bild und Bezug zur Firma.
 * Hilft Suchmaschinen, Seite, Website und Betrieb als Einheit zu verstehen.
 */
export function webseiteSeite(opts: {
  page: string;
  url: string;
  name: string;
  description: string;
  lang: string;
  bild: string;
}) {
  const typ: Record<string, string> = {
    kontakt: 'ContactPage',
    ueberUns: 'AboutPage',
    projekte: 'CollectionPage',
    jobs: 'CollectionPage',
    leistungen: 'CollectionPage',
  };
  const url = absolute(opts.url);
  return {
    '@context': 'https://schema.org',
    '@type': typ[opts.page] ?? 'WebPage',
    '@id': `${url}#seite`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: opts.bild },
  };
}
