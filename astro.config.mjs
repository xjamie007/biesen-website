// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL: Adresse der Website (Canonical, Sitemap, JSON-LD). Standard: die eigene Domain.
// BASE_PATH: nur für GitHub Pages ohne eigene Domain, z. B. /biesen-website (setzt der Workflow).
const SITE_URL = process.env.SITE_URL || 'https://electricite-biesen.lu';
const BASE_PATH = process.env.BASE_PATH || '/';
const base = BASE_PATH.replace(/\/$/, '');

/**
 * Weiterleitungen von der alten WordPress-Website (D5), geprüft gegen deren Sitemap
 * (page-sitemap.xml, 8 Adressen, Stand 06.10.2026). GitHub Pages kann keine 301:
 * Astro erzeugt Seiten mit sofortiger Weiterleitung (meta refresh) und Canonical.
 */
const ALT = {
  '/': '/fr/',
  '/uber-uns/': '/de/ueber-uns/',
  '/dienstleistungen/': '/de/#leistungen',
  '/galerie/': '/de/projekte/',
  '/jobs/': '/de/jobs/',
  '/kontakt/': '/de/kontakt/',
  '/stellenangebot-monteurin-im-bereich-elektroinstallation-m-w/': '/de/jobs/elektromonteur/',
  '/stellenangebot-hilfs-monteurin-im-bereich-elektroinstallation-m-w/': '/de/jobs/hilfsmonteur/',
};

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Alles CSS inline: keine render-blockierende Anfrage, schnelleres LCP am Handy
    inlineStylesheets: 'always',
  },
  redirects: Object.fromEntries(Object.entries(ALT).map(([alt, neu]) => [alt, base + neu])),
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: false,
  devToolbar: { enabled: false },
});
