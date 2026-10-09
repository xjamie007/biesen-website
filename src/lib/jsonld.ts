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
