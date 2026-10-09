# Electricité Biesen – Website

Die neue Website von Electricité Biesen in Nothum (Noutem), in vier Sprachen: Französisch (Standard, x-default), Deutsch, Luxemburgisch und Englisch. Sie ersetzt die WordPress-Seite von Wedo Solutions vollständig.

Die Besonderheit ist **„Owend“**: Ein Biesen-Projekt wird vom selben Stativ am Nachmittag und zur blauen Stunde fotografiert. Auf der Startseite blendet das Tagfoto beim ersten Scrollen ins Abendfoto über. Auf der Lichtseite bewegen die Besucher die Überblendung mit einem Regler selbst.

- Offene Punkte, Fragen an den Kunden und fehlende Fotos: [`OFFENE-PUNKTE.md`](OFFENE-PUNKTE.md)
- Luxemburgische Texte zur Prüfung durch einen Muttersprachler: [`LB-REVIEW.md`](LB-REVIEW.md)
- Maschinelle Sprachprüfung aller vier Sprachen (Werkzeuge, Funde, Korrekturen): [`SPRACHPRUEFUNG.md`](SPRACHPRUEFUNG.md)

**Stand 09.10.2026:** Dritte Runde der Gestaltung (siehe „Gestaltung“): helle Startseite, die in 15 Sekunden sagt, wer Biesen ist, was der Betrieb macht und wie man ihn erreicht; Kontaktformular in drei Schritten. Es ist noch kein Projekt freigegeben und es gibt noch kein Fotopaar. Fotostellen zeigen eine helle Fläche mit Kamerasymbol („Foto folgt: …“), offene Angaben eine kleine Marke „Fehlt“ oder „Offen“ (Wortlaut über den Schalter „Offene Punkte zeigen“). So nicht live schalten.

## Technik

| Bereich | Umsetzung |
|---|---|
| Framework | Astro 7, statisch |
| Interaktiv | Vanilla-TypeScript: Menü, Formular, Regler; Inline-Skript (644 Bytes) als Fallback für Owend. Kein React: Nichts auf der Seite braucht es. |
| Styling | Tailwind CSS 4 mit eigenen Tokens (`src/styles/global.css`), Standardfarben und -schatten von Tailwind entfernt |
| Symbole | eigene SVG-Pfade in `src/lib/icons.ts` (`Icon.astro`), keine Icon-Bibliothek |
| Animation | CSS Scroll-Driven Animations (Owend, Kopf, Einblenden), Fallback per Intersection Observer; ohne Unterstützung steht alles still und sichtbar |
| Schrift | Schibsted Grotesk, variabel 400–900, selbst gehostet (46 KB WOFF2) |
| Formular | Supabase Edge Function `anfrage` (EU), privater Bucket `anfragen`, Mail über einen EU-Anbieter |
| Hosting | GitHub Pages über GitHub Actions |

## Starten

```bash
npm ci
```

```bash
npm run dev
```

Die Vorschau läuft unter http://localhost:4321/fr/. Im Dev-Modus erscheinen auch nicht freigegebene Projekte (markiert „nicht freigegeben“) und die Testflächen „Test Tag“ / „Test Abend“ anstelle fehlender Fotopaare. Beides kommt nie in den Build.

```bash
npm test
```

Vitest: Vollständigkeit der vier Sprachen, Title (50–60 Zeichen) und Description (150–160 Zeichen) jeder Seite in jeder Sprache, Feiertage, Inhaltsregeln (keine Vorgängerfirmen, kein 24/7, keine Werbewörter …), EXIF-Leser.

```bash
npm run build
```

Baut nach `dist/` und prüft danach den fertigen Build (`scripts/check-dist.ts`): keine Testflächen, keine Google-Einbindungen, keine verbotenen Wörter, eine h1 pro Seite, hreflang, keine toten Links und Anker. Schlägt etwas fehl, bricht der Build ab.

```bash
cd supabase/functions/anfrage && deno test lib.test.ts
```

Tests der Formular-Logik (Prüfung je Anliegen, Betreff, Dateien, Mailtext).

Weitere Befehle:

| Befehl | Was er tut |
|---|---|
| `npm run offene-punkte` | schreibt `OFFENE-PUNKTE.md` aus Texten, Inhalten und Stammdaten |
| `npm run lb-review` | schreibt `LB-REVIEW.md` (alle luxemburgischen Texte, die noch nicht geprüft sind) |
| `npm run feiertage` | schreibt die luxemburgischen Feiertage in `oeffnungszeiten.json` (Standard 2026–2028; `npm run feiertage -- 2027 2030`) |
| `npm run testbilder` | erzeugt die Testflächen für den Dev-Modus neu |
| `npm run check` | `astro check` (TypeScript) |
| `node scripts/dev/screens.mjs <url> --w 375 --scroll 0,400 [--reduced] [--nojs]` | Screenshots mit dem installierten Chrome nach `scripts/dev/out/` |

## Aufbau

```
src/
  pages/[lang]/[...path].astro  ein Einstieg für alle Seiten und Sprachen (übersetzte URLs aus i18n/config.ts)
  pages/404.astro               eine 404-Seite für alle Sprachen
  pages/sitemap.xml.ts, robots.txt.ts, og/[name].png.ts
  views/                        eine Datei pro Seite (Home, Leistungen, Installation, Licht, …)
  components/                   Kopf (mit Kontaktleiste), Fuß, OwendRegler, Foto, Faq, Zeiten, Anfrageformular,
                                Leistungskarte, Seitenkarte, Aufruf, Icon …
  i18n/                         config.ts (Sprachen, URLs), de.ts (Ausgangssprache), fr.ts, lb.ts, en.ts
  lib/                          projekte.ts, leistungen.ts, icons.ts, zeiten.ts, feiertage.ts, jsonld.ts, faq.ts, bilder.ts, exif.ts
  content/projekte/*.yaml       ein Projekt pro Datei
  content/jobs/*.yaml           eine Stelle pro Datei
  content/oeffnungszeiten.json  Zeiten, Feiertage, Betriebsferien – einzige Quelle für Tabellen, Fuß und JSON-LD
  content/site.json             Stammdaten (B1) – einzige Quelle für Impressum, Fuß und JSON-LD
  assets/projekte/              freigegebene Fotos (Originale)
  assets/_dev/                  Testflächen, nur Dev-Modus
  scripts/                      menue.ts, formular.ts, regler.ts
  styles/global.css             Tokens und alle Komponenten
supabase/                       Edge Functions anfrage und aufraeumen, Migration
scripts/                        Prüfungen, Generatoren, Schrift, Favicon und OG-Bild
tests/                          Vitest
```

## Inhalte ändern

### Texte

Alle Texte stehen in `src/i18n/de.ts` (Ausgangssprache) und unter denselben Schlüsseln in `fr.ts`, `lb.ts` und `en.ts`. TypeScript und `npm test` sorgen dafür, dass keine Sprache einen Schlüssel oder einen `{Platzhalter}` verliert.

Interne Hinweise schreibt man so in den Text: `[FEHLT — was fehlt]` oder `[UNBESTÄTIGT — was zu klären ist]`. Die Website zeigt an ihrer Stelle eine kleine Marke „Fehlt“ oder „Offen“, der Wortlaut steht im Tooltip. In der Vorschau und im Dev-Modus blendet der Schalter „Offene Punkte zeigen“ unten rechts den ganzen Wortlaut mit gestricheltem Rahmen ein (die Wahl merkt sich der Browser). `npm run offene-punkte` sammelt sie. Sie bleiben in allen Sprachen deutsch. Ist eine Angabe geklärt, den Hinweis in allen vier Sprachen ersetzen.

### Projekte

Eine YAML-Datei pro Projekt in `src/content/projekte/` (Schema in `src/content.config.ts`):

```yaml
titel: { de: "…", fr: "…", lb: "…", en: "…" }
ortschaft: Eschweiler          # nur Ortschaft oder Gemeinde, nie eine Adresse
jahr: 2025
art: landwirtschaft            # neubau, renovierung, licht-innen, licht-aussen, landwirtschaft, halle, oeffentlich, photovoltaik, ladestation, sicherheit, besonders
text: { de: "…", fr: "…", lb: "…", en: "…" }   # zwei bis vier Sätze
fotos:
  - bild: milchviehstall-1.jpg  # Datei in src/assets/projekte/
    alt: { de: "…", fr: "…", lb: "…", en: "…" }
owend: null                     # oder ein Fotopaar, siehe unten
startseite: true                # eins von drei Projekten auf der Startseite
reihenfolge: 2
freigabe: true                  # nur true erscheint im Produktiv-Build
```

- Fotos in Originalauflösung nach `src/assets/projekte/` legen; der Build rechnet sie in AVIF und WebP (480, 768, 1080, 1600, 2000 px) um, nie größer als das Original. Hausnummern, Kennzeichen und Gesichter von Unbeteiligten vorher unkenntlich machen.
- Die vorhandenen Einträge (Milchviehstall, Fertighaus-Module, Ösling-Haus, Halle, Treppe, Stollen) haben `freigabe: false` und leere Felder. In jeder Datei steht oben, welches Original aus der alten Galerie anzufragen ist.
- Die Fotos der Leistungskarten auf der Startseite (Neubau und Licht) kommen aus den Projekten `fertighaus-module` und `milchviehstall`, sobald diese freigegeben sind. Bis dahin sind es Karten ohne Foto.

### Fotopaare (Owend)

```yaml
owend:
  motiv: { de: Milchviehstall, vom Futtergang aus, fr: …, lb: …, en: … }   # für den Platzhalter
  tag:   { bild: milchviehstall-tag.jpg, uhrzeit: "" }      # leer: Uhrzeit aus den EXIF-Daten
  abend: { bild: milchviehstall-abend.jpg, uhrzeit: "" }
  fokus: 50% 60%                                           # CSS object-position für den Ausschnitt
  alt:
    tag:   { de: "Milchviehstall in Eschweiler am Nachmittag, …", fr: …, lb: …, en: … }
    abend: { de: "Derselbe Stall am Abend, …", fr: …, lb: …, en: … }
```

- **Startseite:** zeigt seit 09.10.2026 kein Fotopaar mehr. Das erste Projekt mit Fotopaar und `startseite: true` (heute das Ösling-Haus als Kandidat) liefert weiter das Open-Graph-Bild.
- **Lichtseite:** alle Projekte mit Fotopaar, höchstens fünf, jedes mit Regler. Geplante Paare erscheinen bis zum Shooting als „Fotopaar folgt: [Motiv]“; solange es nur Platzhalter sind, stehen sie klein nebeneinander.
- **Uhrzeiten:** Bleibt `uhrzeit` leer, liest der Build die Aufnahmezeit (EXIF DateTimeOriginal) aus der JPEG-Datei. Die Bildunterschrift lautet dann z. B. „Eschweiler, Milchviehstall mit LED-Licht. Fotografiert um 14:10 und um 21:40 Uhr.“
- **Open-Graph-Bild:** Ist das Startseiten-Paar freigegeben, erzeugt der Build `og/startseite.png` aus dem Abendfoto (Logo klein unten links auf einem weißen Streifen). Bis dahin gilt `public/og/biesen.png`.

### Stellen

Eine YAML-Datei pro Stelle in `src/content/jobs/`. Nur `offen: true` bekommt eine Seite, einen Eintrag in der Sitemap und auf der Jobs-Seite. Ist eine Stelle besetzt, `offen: false` setzen: Seite und Daten verschwinden, die alte URL liefert 404.

- `veroeffentlicht: 2026-10-20` – erst mit diesem Datum gibt es ein `JobPosting` im JSON-LD (Google Jobs verlangt `datePosted`).
- `gueltig_bis` → `validThrough`, `vollzeit: true` → `employmentType: FULL_TIME`.
- `pfad` sind die URL-Teile je Sprache (heißt nicht `slug`, weil Astro das Feld als ID nimmt).

### Öffnungszeiten, Feiertage, Betriebsferien

**Recherche 09.10.2026:** Die Quellen widersprechen sich. Mo–Fr 08:00–12:00 und 13:30–16:30 nennen die alte Website und das Firmenprofil auf wedo.lu; Editus und Google nennen Mo–Fr 07:30–16:30 durchgehend; SuperDrecksKëscht nennt Mo–Fr 07:00–12:00 und 13:00–16:00. Eingetragen sind die Zeiten der eigenen Website, weiter mit `[UNBESTÄTIGT]`, bis der Betrieb sie bestätigt.

Alles steht in `src/content/oeffnungszeiten.json`. Daraus entstehen die Zeiten-Tabelle (Startseite, Kontakt), die Kurzform in Kontaktleiste und Fuß, die Liste „Geschlossen an diesen Tagen“ (die nächsten drei Schließtage an Werktagen, höchstens 75 Tage voraus) und `openingHoursSpecification` im JSON-LD.

**Betriebsferien eintragen** (für das Büro): unter `ausnahmen` einen Eintrag ergänzen, Daten im Format JJJJ-MM-TT:

```json
"ausnahmen": [
  {
    "von": "2026-12-24",
    "bis": "2027-01-01",
    "geschlossen": true,
    "text": { "de": "Betriebsferien", "fr": "Congés annuels", "lb": "Congé", "en": "Company holidays" }
  }
]
```

Für geänderte Zeiten an einzelnen Tagen statt `"geschlossen": true` die Zeiten angeben: `"geschlossen": false, "zeiten": [["08:00", "12:00"]]`. Danach committen; GitHub baut die Seite neu. Weil „Geschlossen an diesen Tagen“ beim Build berechnet wird, baut der Workflow die Seite zusätzlich jeden Montag neu.

Sind die Zeiten mit dem Kunden geklärt, `"bestaetigt": true` setzen; dann verschwindet der Hinweis `[UNBESTÄTIGT]`. Feiertage für weitere Jahre: `npm run feiertage -- 2029 2030`.

### Stammdaten

`src/content/site.json`: Name, Adresse, Telefon, RCS, MwSt, Gewerbegenehmigung, Facebook. Nach der VIES-Prüfung `mwst.bestaetigt: true`; sobald die Facebook-URL da ist, `facebook: "https://…"` (erscheint dann im Fuß und in `sameAs`). NAP überall gleich: **Electricité Biesen, 14, Duerfstrooss, L-9678 Nothum, +352 95 80 99**.

### Luxemburgisch prüfen lassen

Jeder luxemburgische Text ist ein Entwurf und trägt das Flag `review: "lb-native"` (`src/i18n/lb.ts`, gilt auch für alle `lb`-Felder in `src/content/` und die luxemburgischen URLs). Die vollständige Liste mit deutschem Ausgangstext steht in [`LB-REVIEW.md`](LB-REVIEW.md) (heute 512 Texte), gruppiert nach Datei. Vorher maschinell geprüft (Hunspell mit dem Wörterbuch von spellchecker.lu und die Eifeler Regel, siehe [`SPRACHPRUEFUNG.md`](SPRACHPRUEFUNG.md)); das ersetzt die Durchsicht nicht. Ablauf:

1. Muttersprachler korrigiert direkt in `src/i18n/lb.ts` bzw. in den YAML-Dateien.
2. Geprüfte Schlüssel in `src/i18n/lb-geprueft.json` eintragen (z. B. `"home.h1"`, `"projekte/milchviehstall.titel"`, `"slug.licht"`).
3. `npm run lb-review` – die Liste wird kürzer.

Die Liste steht in einer eigenen Datei und nicht in diesem README, weil sie mit fast 500 Zeilen das README unlesbar machen würde.

## Owend: wie es funktioniert

- **Lichtseite** (`OwendRegler.astro`): Tag- und Abendfoto vom selben Stativ liegen übereinander, die Besucher bewegen die Überblendung mit einem Regler.
- **Regler:** `<input type="range">` setzt `--abend` als Deckkraft des Abendbildes und `aria-valuetext` („Tag“, „Abend“, „Übergang, 40 Prozent“) (`src/scripts/regler.ts`). Ohne JavaScript ist der Regler versteckt und beide Fotos stehen nebeneinander (ab 768 px) bzw. untereinander, jedes mit seiner Uhrzeit.
- **Bildgrößen:** Das Original ist ein Querformat; `sizes` rechnet mit der Breite, die das Bild bei `object-fit: cover` wirklich bekommt.
- **Geschichte:** Das Briefing (C5) sah das Paar im Hero vor, das beim ersten Scrollen überblendet. Danach stand es kurz als Zeichnung mit Regler auf der Startseite. Beides hat Nave verworfen: Ohne echte Fotos erklärt es nichts, und auf der Startseite zählt, dass sofort klar ist, was der Betrieb macht. Kommen die Fotopaare, sind sie auf der Lichtseite am richtigen Ort; ob eines davon wieder auf die Startseite kommt, entscheiden Nave und der Kunde mit den echten Bildern.

## Shooting-Anleitung (für Nave und den Fotografen)

Ein echtes Biesen-Projekt wird zweimal vom selben Stativ fotografiert: am Nachmittag und zur blauen Stunde mit eingeschalteter Beleuchtung.

- **Stativ**, identische Position und Brennweite für beide Aufnahmen, Auslöser per Fernbedienung. Zwischen den Aufnahmen nichts am Stativ verändern.
- **Tag:** zwischen 11 und 15 Uhr, gern bedeckter Himmel.
- **Abend:** blaue Stunde, 20 bis 40 Minuten nach Sonnenuntergang, solange der Himmel noch tiefblau ist. Einen schwarzen Himmel vermeiden.
- **Feste manuelle Farbtemperatur** in beiden Aufnahmen (z. B. 4300 K), damit warmes Licht warm bleibt.
- **RAW**, mindestens 4000 px lange Kante, Querformat mit genug Luft für einen 4:5- und einen 1:1-Ausschnitt. Kamerauhr vorher stellen: Die Bildunterschrift nennt die Aufnahmezeiten aus den EXIF-Daten.
- **Keine Personen, keine Kennzeichen, keine lesbaren Hausnummern.** Schriftliche Erlaubnis der Eigentümer.
- **Motive in dieser Reihenfolge:** ein Wohnhaus mit Außen- und Gartenbeleuchtung (Startseite); der Milchviehstall (vom Futtergang aus, tags mit Tageslicht, abends mit LED); eine Straße oder ein Platz mit öffentlicher Beleuchtung [UNBESTÄTIGT]; eine Halle; ein Treppenhaus.
- **3 bis 5 Paare** insgesamt; eins davon für die Startseite.
- **Lieferung:** entwickelte JPEGs in voller Auflösung mit erhaltenen EXIF-Daten, dazu Ortschaft und Projekt in drei bis fünf Wörtern.

## Formular

Normales POST (`multipart/form-data`) an die Edge Function, funktioniert ohne JavaScript. Mit JavaScript prüft das Formular vorher am Feld und zeigt nur die passenden Feldgruppen; gesendet wird trotzdem per normalem POST.

- **Ablauf in der Function:** Honeypot → Prüfung je Anliegen → Rate-Limit (gesalzener IP-Hash, 24 h) → Dateien in den privaten Bucket `anfragen` → Zeile in `anfragen` → Mail an `FORM_RECIPIENT` mit zeitlich begrenzten Links (Standard 30 Tage, keine Anhänge) → 303 auf die Danke-Seite der Sprache. Scheitert die Mail, bleibt die Anfrage gespeichert (`mail_status = fehler`).
- **Betreff zum Sortieren:** `[Ladestation] Haus, Wiltz – Name`, `[Neubau, Fertighaus] Haus, Nothum – Name`, `[Hausgerät] Nothum – Name`. Im Text steht die Sprache des Absenders. Antworten gehen per Reply-To direkt an den Absender.
- **Fehler ohne JavaScript:** Supabase liefert HTML nur mit eigener Domain aus. Die Function leitet deshalb mit 303 zurück zum Formular (`/de/kontakt/?fehler=geraet#fehlt`); dort erscheint ein Hinweis (CSS `:target`, ohne JavaScript), mit JavaScript zusätzlich die Meldung am Feld. Die meisten Pflichtfelder fängt ohne JavaScript schon die Browserprüfung ab.
- **Löschfrist:** Die Function `aufraeumen` löscht täglich (pg_cron) Anfragen samt Dateien, die älter als `LOESCHFRIST_MONATE` sind (Standard 6, [FEHLT – mit dem Kunden festlegen]). Wird aus einer Anfrage ein Auftrag, im Supabase-Dashboard `behalten = true` setzen.

**Einrichtung (Nave):**

1. Supabase-Projekt anlegen, **Region EU** (z. B. Frankfurt).
2. Migration einspielen: `supabase link --project-ref …`, dann `supabase db push`. Legt `anfragen`, `anfrage_rate` (beide mit RLS ohne Policies), den privaten Bucket `anfragen` (10 MB, Bilder und PDF) und die Cron-Jobs an.
3. Im SQL-Editor die beiden Vault-Geheimnisse anlegen (Befehle stehen oben in der Migration).
4. Secrets setzen:
   ```bash
   supabase secrets set SITE_URL=https://electricite-biesen.lu FORM_RECIPIENT=info@biesen.lu MAIL_PROVIDER=brevo MAIL_API_KEY=… MAIL_FROM="Website Electricité Biesen <website@biesen.lu>" IP_HASH_SALT=$(openssl rand -hex 16) CRON_SECRET=… LOESCHFRIST_MONATE=6
   ```
   `MAIL_PROVIDER` kann `brevo` oder `scaleway` sein (beide EU, [mit Nave klären]); bei Scaleway kommt `SCALEWAY_PROJECT_ID` dazu. Für die Absenderadresse SPF/DKIM bei biesen.lu einrichten (DNS-Zugang, siehe offene Punkte).
5. `supabase functions deploy anfrage` und `supabase functions deploy aufraeumen` (`verify_jwt = false` steht in `supabase/config.toml`).
6. In GitHub unter Settings → Variables `PUBLIC_FORM_URL` auf `https://<projekt>.supabase.co/functions/v1/anfrage` setzen. Ohne diese Variable zeigt das Formular einen `[FEHLT]`-Hinweis.

**Grenzen:** Eine Edge Function hat 256 MB Speicher und 2 s CPU-Zeit. Fünf Dateien à 10 MB liegen darin, sollten aber nach dem Einrichten einmal real getestet werden.

**Lokal testen** ohne Datenbank und ohne Mail:

```bash
cd supabase/functions/anfrage && ANFRAGE_DRY_RUN=1 SITE_URL=http://localhost:4321 deno run --allow-net --allow-env --allow-read index.ts
```

```bash
PUBLIC_FORM_URL=http://localhost:8000 npm run dev
```

**Automatisch von Anfang bis Ende** (22 Prüfungen: Vorauswahl, Zusatzfragen je Anliegen, leeres Absenden, Versand mit Bild → Danke-Seite, ohne JavaScript mit Rücksprung und Hinweis, Lockvogelfeld, Hausgerät auf Luxemburgisch): Function wie oben starten und ihre Ausgabe in eine Datei leiten (`… index.ts > /tmp/anfrage.log 2>&1`, Deno braucht dazu noch `--allow-sys`), Seite mit `PUBLIC_FORM_URL=http://localhost:8000 npm run build && npm run preview` ausliefern, dann `ANFRAGE_LOG=/tmp/anfrage.log CHROME_PATH=… node scripts/dev/formular-e2e.mjs`.

## Livegang und Deploy

Der Workflow `.github/workflows/deploy.yml` testet, baut und veröffentlicht bei jedem Push auf `main`, von Hand und jeden Montag früh.

1. Repository auf GitHub anlegen und pushen. Unter Settings → Pages als Quelle „GitHub Actions“ wählen.
2. Ohne eigene Domain liegt die Seite unter `https://<konto>.github.io/<repo>/`; der Workflow übergibt dafür `SITE_URL` und `BASE_PATH`. Lokal testen: `SITE_URL=https://example.github.io BASE_PATH=/biesen-website npm run build`.
   Heute: Repository https://github.com/xjamie007/biesen-website, Vorschau https://xjamie007.github.io/biesen-website/.
   **Vorschau-Modus:** Solange die Repository-Variable `LIVE` nicht auf `true` steht, baut der Workflow mit `PUBLIC_VORSCHAU=1`: alle Seiten tragen `noindex`, `robots.txt` sperrt Suchmaschinen. So landet die Fassung mit Platzhaltern nicht bei Google. Zum Livegang: Settings → Secrets and variables → Actions → Variables → `LIVE` = `true`, Workflow neu starten.
3. Custom Domain `electricite-biesen.lu` eintragen, „Enforce HTTPS“ aktivieren. DNS beim Registrar (Zugang liegt vermutlich bei Wedo Solutions): Apex als A-Einträge auf 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, `www` als CNAME auf `<konto>.github.io`. Optional die GitHub-Variable `SITE_URL` setzen.
4. Vor dem Umschalten: alle Punkte in `OFFENE-PUNKTE.md` erledigt, keine `[FEHLT]`/`[UNBESTÄTIGT]` mehr auf der Seite, Formular real abgeschickt, LB geprüft.

### Weiterleitungen von der alten Website (D5)

Geprüft gegen die Sitemap der alten Seite (`page-sitemap.xml`, 8 Adressen, Stand 06.10.2026); weitere Adressen gibt es nicht (Impressum und Datenschutz leiten dort schon heute auf die Startseite).

| Alt | Neu |
|---|---|
| `/` | `/fr/` |
| `/uber-uns/` | `/de/ueber-uns/` |
| `/dienstleistungen/` | `/de/leistungen/` |
| `/galerie/` | `/de/projekte/` |
| `/jobs/` | `/de/jobs/` |
| `/kontakt/` | `/de/kontakt/` |
| `/stellenangebot-monteurin-im-bereich-elektroinstallation-m-w/` | `/de/jobs/elektromonteur/` |
| `/stellenangebot-hilfs-monteurin-im-bereich-elektroinstallation-m-w/` | `/de/jobs/hilfsmonteur/` |

Umgesetzt über `redirects` in `astro.config.mjs`. **GitHub Pages kann keine echten 301-Antworten.** Astro erzeugt an den alten Adressen kleine Seiten mit sofortiger Weiterleitung (`meta refresh`), `noindex` und Canonical auf die neue Adresse. Google folgt dem, aber ein Hosting mit echten 301 (z. B. Cloudflare Pages, Netlify oder ein eigener Server mit Redirect-Regeln) wäre für den Umzug besser.

## Schrift

Schibsted Grotesk (Bakken & Bæck und Henrik Kongsvoll) aus dem offiziellen Repository github.com/schibsted/schibsted-grotesk, Lizenz SIL OFL 1.1 in `public/fonts/OFL.txt`. Nie über die Google-CDN.

```bash
curl -L -o "fonts-src/SchibstedGrotesk[wght].ttf" "https://raw.githubusercontent.com/schibsted/schibsted-grotesk/main/fonts/variable/SchibstedGrotesk%5Bwght%5D.ttf"
```

```bash
python3 scripts/fonts/build-font.py
```

- **Subset:** Basic Latin, Latin-1, Latin Extended-A, „ “ ” ‚ ‘ ’ – — … €. Ergebnis 46 KB WOFF2, wird vorgeladen, `font-display: swap`.
- **Tabellenziffern:** Die Schrift setzt mit `tnum` auch Doppelpunkt, Punkt und Komma auf Ziffernbreite („08 : 00“). Das Skript nimmt diese Zeichen aus der Ersetzung; nur die Ziffern sind tabellarisch.
- **Fehlende Zeichen:** U+202F (schmales geschütztes Leerzeichen, französische Typografie) und U+2011 (geschützter Bindestrich, Faxnummer) zeigen auf vorhandene Glyphen.
- **Ausweichschrift:** Arial bzw. Arial Bold, vermessen mit `size-adjust` 104,57 % / 103,78 %, `ascent-override` und `descent-override` (`scripts/fonts/fallback.json`). Beim Laden springt nichts (CLS 0).

## Favicon und Open-Graph-Bild

```bash
python3 scripts/assets/favicon.py && node scripts/assets/build-assets.mjs
```

Bis die Vektordatei des Logos da ist: ein „B“ in Weiß auf Noutem-Blau (Favicon) und eine Fläche in Kalkputz mit „Electricité Biesen, Noutem“ und dem Logo auf einem weißen Streifen (OG-Bild). Danach das Favicon aus dem gelben Blitz auf Noutem-Blau ableiten und `Logo.astro` auf die SVG umstellen. Das Logo wird nie nachgezeichnet oder verändert; bis dahin wird das Original-PNG nur verkleinert.

## Google-Unternehmensprofil (G4, Aufgabe für Nave und den Kunden)

- Profil übernehmen (heute nicht vom Inhaber übernommen): https://www.google.com/maps?cid=10939038107944972410
- Namen an die Website angleichen: „Electricité Biesen“ (heute „Entreprise d’Electricité BIESEN“) [mit Kunde abstimmen].
- Zeiten aus `oeffnungszeiten.json` eintragen und den Widerspruch zur alten Website beseitigen; Feiertage und Betriebsferien pflegen.
- Website `https://electricite-biesen.lu/fr/` eintragen. Hauptkategorie Elektriker; Zusatzkategorien für Beleuchtung, Photovoltaik, Ladestationen, Sicherheitstechnik und Hausgeräte, soweit Google sie anbietet.
- Eigene Fotos hochladen, die Abendfotos zuerst.
- Zufriedene Kunden um eine Bewertung bitten (z. B. QR-Code auf der Rechnung), ohne Gegenleistung, nur echte Bewertungen.
- Editus, Yellow und maison.lu auf dieselben NAP-Daten und Zeiten bringen.

## Gestaltung (seit 09.10.2026)

Die erste Fassung war sehr zurückhaltend (Weiß und Kalkputz, keine Symbole, keine Schatten). Nach drei Runden mit Nave ist sie hell, klar und an der Formsprache von Apple orientiert: große, enge Überschriften, viel Luft, runde Kacheln, sanfte Bewegung, Abschnitte, die beim Scrollen stehen bleiben, während daneben etwas abläuft. Die Inhaltsregeln (keine Werbewörter, keine erfundenen Angaben, offene Punkte markiert) gelten unverändert.

> **Vorlagen:** Die Nave-Website ist am Quellcode (Repository `xjamie007/Nave-Website`, `assets/js/main.js` und `assets/css/style.css`) und optisch abgeglichen: lokal ausgeliefert und in Chromium neben Biesen gelegt (Startseite, Leistungen mit Abschnitts-Leiste, Prozess mit gestapelten Karten). Übernommen daraus auch: die aktuelle Seite im Menü als gefüllte Pille, die Abschnitts-Leiste als schlichte Einträge mit gefüllter Pille für den aktuellen Abschnitt. Die Live-Seiten nave.lu und apple.com waren aus der Arbeitsumgebung nicht erreichbar (Netzwerk-Sperre). Für Apple gilt deshalb die bekannte Formsprache (große Überschriften, Abschnitts-Leiste unter dem Kopf, Inhalte, die beim Scrollen stehen bleiben), kein Abgleich mit der heutigen Seite.

- **15-Sekunden-Startseite:** Im ersten Bildschirm stehen „Ihr Elektriker im Norden Luxemburgs“, alle Leistungen und der Ort in einem Satz („… Ein Familienbetrieb mit 26 Leuten in Noutem (Nothum), nahe Wiltz“; beide Ortsnamen, weil oben „Nothum“ steht), „Angebot anfragen“ und die Telefonnummer und die fünf Leistungen als Kacheln mit Symbol und Kurztext („Worum geht es bei Ihnen?“); die zwei Fakten folgen direkt darunter. Damit das auch auf kleinen Bildschirmen gilt: Laptops bis 880 px Höhe bekommen eine kompaktere Fassung (Schrift nach der Höhe, kleinere Kacheln, Pfeil oben rechts), Tablets kürzere Kacheln in zwei Reihen, Handys alle fünf Kacheln in zwei Spalten mit Symbol und Name (die letzte über die ganze Breite). Eine Wischreihe hatte im Test zur Folge, dass niemand „Ladestation“ lesen konnte. Auf schmalen Handys entfällt die Pille über der Überschrift (Logo und Kontaktleiste nennen den Betrieb schon), Kopf und Knöpfe passen in eine Zeile, und unter 384 px sind Überschrift und Einleitung etwas kleiner. Prüfen mit `node scripts/dev/erster-bildschirm.mjs` (vier Sprachen, zehn Größen; eine Kachel zählt nur, wenn ihr Name ganz zu lesen ist). Der Kurztext der Photovoltaik-Kachel nennt Solaranlage und E-Auto, weil Tester „Photovoltaik“ nicht verstanden und die Ladestation nicht fanden. Danach: Laufband, Leistungskarten, Über uns, Weg zum Angebot, Projekte (erst wenn freigegeben), Marken und Mitgliedschaften, Fragen, Kontakt. Die Zeichnungen (Dorf im Hero, Haus mit Regler) sind entfernt.
- **Farben:** aus dem Logo Noutem-Blau `#0070c0` und Bletz-Giel `#ffca24`; Nuecht `#071a33` für Kontaktleiste, Laufband und Fuß, Himmel `#eef5fc` und Sonn `#fff7e3` als helle Flächen. Hero und Seitenköpfe hell mit weichem Licht in Blau und Gelb und einem feinen Raster wie auf einem Elektroplan.
- **Akzentfarbe je Leistung** (`.farbe--…`): Neubau Blau, Licht Gelb, Photovoltaik Grün, Alarm Violett, Hausgeräte Orange; Text in Akzentfarbe erreicht auf der hellen Fassung mindestens 4,5 : 1.
- **Logo:** steht immer auf reinem Weiß (das PNG hat selbst einen weißen Grund), deshalb ist der Kopf nie durchscheinend und der Fuß hat ein weißes Logo-Band. 52 / 60 / 72 px hoch, beim Scrollen 56 px; verlustfrei als PNG in 1x, 2x, 3x. Nicht nachgezeichnet, nicht verändert.
- **Kopf:** Kontaktleiste in Nachtblau (Telefon, Zeiten, E-Mail, Sprachen LU · DE · EN · FR), darunter der weiße Hauptkopf mit allen Seiten (ab 768 px) und „Angebot anfragen“ (ab 1024 px). Sprachkürzel „LU“ sichtbar, im Code `lb`; Französisch bleibt x-default.
- **Effekte nach der Nave-Website** (`src/scripts/effekte.ts` und `global.css`):

  | Nave | Biesen |
  |---|---|
  | Titel Wort für Wort aus einer Maske (`.split-words`) | Hero-Überschrift genauso, nur unten abgeschnitten, damit É und Ä ganz bleiben |
  | Hero wird beim Scrollen kleiner und blendet aus (`--hp`) | `.hero__inhalt` mit einer Scroll-Timeline, fertig nach 80 % der Bildschirmhöhe |
  | Lokale Navigation, klebt unter dem Kopf, aktiver Abschnitt gefüllt (`.local-nav`) | Sprungleiste auf „Leistungen“, halbdurchsichtig, Chip des aktuellen Abschnitts in seiner Farbe |
  | Gestapelte Karten im Prozess (`.stack-card`) | „So kommen Sie zu Ihrem Angebot“ auf „Leistungen“: vier dunkle Karten, die untere wird kleiner und dunkler |
  | Zeitstrahl, Linie füllt sich (`data-timeline`) | „Weg zum Angebot“ auf der Startseite (gab es schon) |
  | Satz leuchtet Wort für Wort auf (`data-highlight`) | Satz über den Betrieb (gab es schon) |
  | Zähler, Lichtpunkt auf Karten, magnetische Knöpfe | Zähler und Lichtpunkt gab es schon; die blauen und gelben Hauptknöpfe folgen jetzt dem Mauszeiger ein Stück |
  | Intro mit Logo beim ersten Besuch, eigener Mauszeiger | **bewusst nicht übernommen:** das Intro kostet zwei Sekunden der 15, ein eigener Mauszeiger hilft beim Finden nicht |

  Dazu: das Licht im Hintergrund wandert langsam, die Kacheln kommen nacheinander, Kacheln und Karten heben sich beim Überfahren; Lichtpunkt und Magnet nur mit Maus und ohne reduzierte Bewegung. Laufband mit den Leistungen (hält beim Überfahren an). Der Satz über den Betrieb leuchtet beim Scrollen Wort für Wort auf, die Zahlen zählen hoch, im Weg zum Angebot wächst eine Linie von Blau nach Gelb und die Nummern gehen nacheinander an; der Kopf daneben bleibt stehen. Knöpfe als Pillen mit Lichtstreifen. Bei reduzierter Bewegung steht alles still und ist sofort da (auch die Verzögerungen fallen weg).
- **Scroll-Effekte nur mit `forwards`:** Was noch unter dem Bildschirm liegt, steht im Endzustand (Druck, Ganzseiten-Screenshots, Suchmaschinen sehen alles) und startet erst beim Hereinscrollen.
- **Scroll-Animationen nur als Einzel-Eigenschaften:** Der CSS-Optimierer von Tailwind zieht `animation-timeline` sonst in die Kurzschreibweise `animation`, und Chrome verwirft die ganze Angabe. In der ersten Fassung stand Owend deshalb sofort auf Abend. In `global.css` nie `animation:` zusammen mit `animation-timeline` schreiben.
- **Zähler:** `@property --zahl` (ganze Zahl) wird über die View-Timeline animiert und per `counter()` gezeigt; die echte Zahl steht daneben für Screenreader und für Browser ohne Scroll-Animationen.
- **Kontaktformular:** drei nummerierte Schritte (Worum geht es, Ihr Projekt, Ihre Kontaktdaten), Anliegen und Gebäude als Kacheln mit Symbol, Name und E-Mail nebeneinander, Ablagefläche für Pläne und Fotos (Klicken oder Hineinziehen), großer Sendeknopf mit dem Hinweis, dass Anfrage und Dateien in der EU gespeichert werden. Gewählte Dateien stehen mit Größe darunter (unter 1 MB in KB). Felder, Namen und Prüfung sind dieselben wie vorher; die Edge Function bleibt unverändert. Mobil steht das Formular vor der Karte zum Anrufen.
- **SEO:** h1 und Einleitung nennen „Elektriker“, die Region (Norden Luxemburgs, Noutem/Nothum, Wiltz) und alle Leistungen in allen vier Sprachen; die h2 der Leistungen lautet „Elektriker für Haus, Hof und Betrieb“. Startseite und Übersicht tragen die Leistungen zusätzlich als `OfferCatalog` im JSON-LD, genau wie sie sichtbar auf der Seite stehen. Titles und Descriptions bleiben in den getesteten Längen.

## Entscheidungen und Abweichungen vom Briefing

- **Owend nicht mehr auf der Startseite:** Das Briefing (C5) sah die Überblendung im Hero vor. Seit 09.10.2026 stehen die Fotopaare nur auf der Lichtseite, siehe „Owend: wie es funktioniert“.
- **Projekte auf der Startseite erst mit Freigabe:** Ohne freigegebenes Projekt zeigt die Startseite den Abschnitt „Wo wir gearbeitet haben“ nicht (statt eines `[FEHLT]`-Kastens). Die Projektseite bleibt im Menü.
- **Titles ohne „Nothum“:** A.5 verlangt Nothum in jedem Title, die Tabelle G2 gibt aber für einige Seiten Titles ohne Ort vor (z. B. „Beleuchtung für Haus, Stall und Halle | Electricité Biesen“). Übernommen ist die Tabelle G2 wörtlich; EN, LB, Jobs, Impressum und Datenschutz tragen den Ort. Vorschlag zur Entscheidung: Für die Lichtseite wäre „Licht für Haus, Stall und Halle, Nothum | Electricité Biesen“ (60 Zeichen) wegen der Verwechslungsgefahr mit dem anderen Betrieb sinnvoll.
- **JobPosting erst mit Datum:** `datePosted` fehlt [FEHLT]; ohne Datum wären die strukturierten Daten ungültig. Die Job-Seiten stehen, das `JobPosting` erscheint, sobald `veroeffentlicht` eingetragen ist.
- **FAQPage nur mit bestätigten Antworten:** Fragen mit `[UNBESTÄTIGT]`/`[FEHLT]` stehen sichtbar auf der Seite, aber nicht im JSON-LD. Heute sind es zwei (Angebot, Fertighaus).
- **Kein `areaServed`, kein Zitat, keine Sterne, kein `foundingDate`** (B4, B5, G3).
- **Fehlerseite der Function:** siehe „Formular“ (HTML nur mit eigener Supabase-Domain).
- **Fehlerfarbe:** Die Palette hat kein Rot. Fehler stehen in Lei, fett, mit einem Balken davor; das Feld bekommt einen 2-px-Rahmen in Lei. Farbe ist nie der einzige Hinweis.
- **„Leistungen“ im Kopf:** Mit JavaScript klappt eine Karte mit allen fünf Leistungen (Symbol und Name) und dem Link „Alle Leistungen im Überblick“ auf. Der Knopf trägt `aria-expanded`; ohne JavaScript ist er ein Link auf die Übersichtsseite.
- **Fußzeile:** Telefon in der internationalen Schreibweise „+352 95 80 99“, genau wie im JSON-LD (NAP). Groß und im Hero steht „95 80 99“ wie vorgegeben.
- **Projekt-Arten:** `besonders` ergänzt (für den Stollen, Bereich „Besondere Orte“ der Lichtseite). Ein sechster Eintrag `treppe` ergänzt, weil Treppenbeleuchtung in der Galerie belegt ist und das Treppenhaus auf der Motivliste steht; so hat die Lichtseite drei geplante Paare (Stall, Halle, Treppenhaus). Ein Paar „Straße oder Platz“ kommt dazu, wenn öffentliche Referenzen bestätigt sind.
- **Seitenkopf der Unterseiten:** sichtbarer Pfad („Startseite / Leistungen / Licht“), weil `BreadcrumbList` dem sichtbaren Inhalt entsprechen muss.
- **404:** Ohne JavaScript stehen alle vier Fassungen untereinander, mit JavaScript nur die der Sprache aus dem Pfad.
- **favicon.ico** zusätzlich, damit Browser, die `/favicon.ico` direkt anfragen, keine 404 bekommen.
- **TypeScript 6 statt 7:** `astro check` unterstützt TypeScript 7 noch nicht.

## Prüfprotokoll

**09.10.2026, Sprachprüfung:** alle 2144 Texte der vier Sprachen maschinell geprüft, Einzelheiten in [`SPRACHPRUEFUNG.md`](SPRACHPRUEFUNG.md). Luxemburgisch: Hunspell (`dictionary-lb` von spellchecker.lu, mit `spylls`) und eine eigene Prüfung der Eifeler Regel; 54 Rechtschreibfehler und 30 Verstöße gegen die n-Regel korrigiert, 10 Wendungen umformuliert. Deutsch, Französisch, Englisch: LanguageTool 6.8 offline und Hunspell; 8 Korrekturen, der Rest als Eigennamen, Fachwörter oder Fehlalarme bewertet. Vitest 102 Tests grün.

**09.10.2026, vierte Runde (Effekte nach der Nave-Website, 15-Sekunden-Test, Handy-Kacheln):**

| Prüfung | Ergebnis |
|---|---|
| Vitest, `astro check`, Build-Prüfung | 102 Tests grün; 0 Fehler, 0 Warnungen; 73 HTML-Dateien ohne Befund |
| 15-Sekunden-Test, Runde 1 | Fünf unabhängige Tester (KI-Agenten ohne Vorwissen, keine Menschen) sahen nur ein Bild des ersten Bildschirms (DE und LB am Laptop, DE und FR am Handy, EN am Laptop) und sollten Firma, Leistung, Ort, Anfrage, Telefon und „Ladestation fürs E-Auto“ finden. Firma, Branche, Ort, Anfrage und Telefon fanden alle fünf. Die Ladestation fanden die drei am Laptop, am Handy nur einer von zwei; der andere konnte die angeschnittene Kachel der Wischreihe nicht lesen. Note 4, 4, 4, 4, 3 (die 3 für die luxemburgische Fassung, gelesen mit Deutschkenntnissen). Weitere Hinweise: „Nothum“ oben, „Noutem“ im Text; „Photovoltaik“ unverständlich; bei kompakten Kacheln fehlte der Pfeil. |
| Änderungen danach | Handy-Kacheln in zwei Spalten statt Wischreihe, beide Ortsnamen im Satz, Kurztext „Solaranlage aufs Dach, Ladestation fürs E-Auto“, Pfeil wieder in allen Desktop-Kacheln (er stand in der kompakten Fassung außerhalb der Kachel) |
| 15-Sekunden-Test, Runde 2 | Vier neue Tester auf dem Handy (DE 390 und 360 px, FR, EN): alle vier finden die Kachel „Photovoltaik und Ladestationen“, Anfrage und Telefon; Note 4, 4, 4, 4. Offen bleiben Punkte, die die Seite nicht erfinden darf (Preise, Bewertungen, Antwortzeit) und das Original-Logo. |
| Erster Bildschirm | Prüfung verschärft: eine Kachel zählt nur, wenn ihr Name ganz im Bild steht, auch seitlich, und kein Wort herausragt. 40 von 40 Fällen (vier Sprachen, zehn Größen). Die alte Prüfung maß nur die Höhe und hatte die Wischreihe deshalb fälschlich als „5/5“ gezählt. |
| Neue Effekte | In Chromium nachgemessen: Hero bei 200 / 420 px Scrollweg mit Deckkraft 0,67 / 0,32 und Größe 0,98 / 0,96; Sprungleiste klebt genau unter dem Kopf (73 px), richtiger Chip aktiv, in allen vier Sprachen 66 px hoch; gestapelte Karten kleben bei 159 / 173 / 187 px (Desktop) unter Kopf und Leiste, `--sp` steigt von 0 auf 0,95; keine Konsolenfehler. Mit „Bewegung reduzieren“: keine Scroll-Animation, kein Stapel-Schrumpfen, alle Wörter sofort an ihrem Platz. |
| Lighthouse 13.5 | `/de/`, `/de/leistungen/`, `/fr/`, `/en/`, je mobil und Desktop: Desktop überall 100 / 100 / 100 / 100; mobil 99–100 Performance, sonst 100. Die Startseite mobil dreimal wiederholt: 100 / 100 / 100 (TBT 30–90 ms). CLS überall 0. Nach Menü-Pille und Leiste erneut `/de/` und `/de/leistungen/`, mobil und Desktop: viermal 100 / 100 / 100 / 100. |
| Vergleich mit Nave | Nave-Repository lokal ausgeliefert (Intro übersprungen), Bildpaare Nave/Biesen bei 1366 × 768: Hero, Abschnitts-Leiste, gestapelte Karten. Danach angeglichen: Menü-Pille, Abschnitts-Leiste ohne Rahmen, Leiste fast deckend (bei 86 % schien Text durch). Menü in LB/DE/EN/FR bei 768–1440 px ohne Umbruch. |
| Strukturierte Daten nach Google-Regeln | `structured-data-testing-tool` 4 (offline) mit den Vorgaben „Google“ und „SocialMedia“ über alle Seiten: zuerst fehlte auf jeder Seite `twitter:image:alt`, ergänzt; danach **64 von 64 Seiten ohne Fehler, 1000 Einzelprüfungen**. Übrig bleiben zwei Hinweise (X/Twitter-Konto des Betriebs), Biesen hat keins. Der Rich-Results-Test von Google selbst war nicht erreichbar. |
| Browser | Nur Chromium vorhanden; Firefox und WebKit (Safari) sind nicht installiert, ihre Download-Server gesperrt. |

**09.10.2026, Nachweise zur dritten Runde (lokal, Live-Build ohne Vorschau-Sperre):**

| Prüfung | Ergebnis |
|---|---|
| Vitest | 102 Tests grün |
| Deno | 10 Tests der Formular-Logik grün (`deno test lib.test.ts`, Deno 2.9) |
| `astro check` | 0 Fehler, 0 Warnungen, 1 Hinweis (unbenutzte Variable `noindex` in `scripts/check-dist.ts`, alt) |
| Build-Prüfung | 73 HTML-Dateien ohne Befund |
| Lighthouse 13.5 | 14 Messungen: `/de/`, `/de/kontakt/`, `/de/leistungen/`, `/de/licht/`, `/fr/`, `/lb/`, `/en/`, je mobil (gedrosselt) und Desktop: **überall 100 / 100 / 100 / 100**. Mobil LCP 1,3–1,4 s, TBT 0–60 ms; Desktop LCP 0,3 s; CLS überall 0. Noch ohne Fotos. In der Vorschau (mit `noindex`) zeigt Lighthouse bei SEO weniger, das ist gewollt. |
| Erster Bildschirm | `scripts/dev/erster-bildschirm.mjs`, LB/DE/EN/FR bei 1920 × 1080, 1536 × 864, 1440 × 900, 1366 × 768, 1280 × 720, 1024 × 768, 800 × 1000, 768 × 1024, 390 × 844, 360 × 740: in allen **40 Fällen** stehen Überschrift, Satz mit Leistungen und Ort, „Angebot anfragen“, Telefon und alle fünf Kacheln ohne Scrollen im Bild (vorher bei 1280 × 720 keine Kachel, bei 360 × 740 brach der Kopf zweizeilig um). Gemessen wird die Lage, kein Test mit echten Menschen. |
| Formular von Anfang bis Ende | `scripts/dev/formular-e2e.mjs` gegen die Edge Function im Probelauf: **22 von 22 Prüfungen bestanden** (Vorauswahl, Zusatzfragen nur beim passenden Anliegen, leeres Absenden mit sechs Fehlern und Fokus auf der Zusammenfassung, Versand mit Bild → `/de/kontakt/danke/` und vollständige Mail im Protokoll, ohne JavaScript Rücksprung `?fehler=…#fehlt` mit sichtbarem Hinweis und danach Versand → `/fr/contact/merci/`, Lockvogelfeld → Danke-Seite ohne Verarbeitung, Hausgerät auf Luxemburgisch bei 360 px ohne Gebäudefrage). Ohne Datenbank und ohne echte Mail. |
| Strukturierte Daten | Alle 65 Seiten lokal ausgelesen: JSON gültig, Pflichtangaben je Typ vorhanden, keine Fehler (Electrician 64, BreadcrumbList 56, FAQPage 20, Service 20, OfferCatalog 8). Der Rich-Results-Test von Google war aus der Arbeitsumgebung nicht erreichbar. |
| Bewegung | Mit „Bewegung reduzieren“: keine Scroll- und Dauer-Animationen, alle Texte sofort voll sichtbar; ohne: 13 Effekte aktiv. Nach dem Durchscrollen bleibt auf Startseite, Leistungen, Kontakt und einer Leistungsseite kein Text halb durchsichtig. |
| Browser | **Nur Chromium 141** (Puppeteer). Firefox und Safari standen nicht zur Verfügung und sind nicht getestet. Scroll-Effekte nutzen CSS Scroll-Driven Animations; wo der Browser sie nicht kennt, steht alles im Endzustand. Nachgestellt in Chromium (die `@supports`-Regeln dafür im Browser entfernt): alle Texte voll sichtbar, die Zahlen 26 und 5 stehen als Text da. Das ersetzt keinen Test in Firefox und Safari. |

**09.10.2026, dritte Runde (helle 15-Sekunden-Startseite, Effekte, Formular in drei Schritten, SEO-Texte, Marken für offene Punkte):** Vitest grün, `astro check` 0 Fehler, Build-Prüfung 73 HTML-Seiten ohne Befund. Screenshots bei 390, 800 und 1440 px; Zähler, Aufleuchten und Fortschrittslinie beim Scrollen geprüft; kein waagerechtes Scrollen, keine Konsolenfehler. Lighthouse noch nicht neu gemessen.

**09.10.2026, zweite Runde (Kopf mit Kontaktleiste, Hero-Dorf, Tag und Abend mit Regler, mehr Inhalt, Akzentfarben):** Vitest 102 Tests grün, `astro check` 0 Fehler, Build-Prüfung 73 HTML-Seiten ohne Befund. Screenshots bei 390, 800 und 1440 px (DE, FR, LB), Regler bedient (Tag, Übergang, Abend), Menü bei 390 px und Aufklapp-Menü am Desktop geprüft; kein waagerechtes Scrollen, keine Konsolenfehler. Lighthouse noch nicht neu gemessen.

**09.10.2026, nach der Neugestaltung (lokal):** Vitest 102 Tests grün (dazu Title/Description der Seite „Leistungen“ in vier Sprachen), `astro check` 0 Fehler, Build-Prüfung 73 HTML-Seiten ohne Befund. Screenshots in Chromium bei 390, 1024 und 1440 px (DE, FR, LB, EN), reduzierte Bewegung und ohne JavaScript; kein waagerechtes Scrollen, keine Konsolenfehler. Lighthouse nach der Neugestaltung noch nicht gemessen.

**06.10.2026, erste Fassung (lokal):**

| Prüfung | Ergebnis |
|---|---|
| Vitest | 98 Tests grün: Übersetzungen (Schlüssel, Platzhalter, Hinweise), Title/Description aller 13 Seiten und beider Stellen in vier Sprachen, Feiertage 2026–2028, Zeiten, Inhaltsregeln, EXIF |
| Deno | 10 Tests der Formular-Logik grün |
| `astro check` | 0 Fehler, 0 Warnungen |
| Build-Prüfung | 69 HTML-Seiten: keine toten Links oder Anker, eine h1, hreflang 4 + x-default, keine externen Einbindungen, keine Testflächen; auch mit `BASE_PATH` |
| Lighthouse mobil (gedrosselt) | `/fr/`, `/de/licht/`, `/de/kontakt/`, `/lb/`, `/en/projects/`: je 100 / 100 / 100 / 100 (Performance / Barrierefreiheit / Best Practices / SEO), LCP 1,1–1,4 s, CLS 0, TBT ≤ 30 ms. **Ohne Fotos gemessen** – mit dem Fotopaar im Hero erneut messen. |
| JavaScript | 0,8–2,2 KB gzip pro Seite, keine externen Skripte |
| Owend | Screenshots bei 0 / 25 / 50 / 75 / 100 % mobil (375 × 812, DE und FR) und Desktop (1440 × 900); reduzierte Bewegung (Paar mit Uhrzeiten); simulierter Browser ohne Scroll-Driven Animations (Intersection Observer, auch rückwärts) |
| Formular | gegen die Function im Probelauf: mit JavaScript (Fehler am Feld, Zusammenfassung, Vorauswahl, bedingte Gruppen, Versand mit PDF → Danke-Seite, Betreff korrekt), ohne JavaScript (alle Gruppen sichtbar, Rückleitung `#fehlt` mit Hinweis), Honeypot |
| Tastatur | Skip-Link, logische Reihenfolge, Fokusring überall, Menü mit Fokusfalle und Escape, Untermenü mit Escape, FAQ per Enter |

**Noch nicht erledigt** (siehe Checkliste „Vor der Übergabe“ im Briefing): echtes Handy, Firefox und Safari (macOS und iOS), Formular real mit Datenbank und Mail, Rich-Results-Test von Google, Lighthouse mit Fotos, Abgleich mit der Live-Seite nave.lu und mit apple.com, ein kurzer Test mit zwei, drei echten Menschen („Was macht die Firma? Wie fragen Sie an?“), alle Platzhalter gefüllt, LB geprüft.
