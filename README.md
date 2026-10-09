# Electricité Biesen – Website

Die neue Website von Electricité Biesen in Nothum (Noutem), in vier Sprachen: Französisch (Standard, x-default), Deutsch, Luxemburgisch und Englisch. Sie ersetzt die WordPress-Seite von Wedo Solutions vollständig.

Die Besonderheit ist **„Owend“**: Ein Biesen-Projekt wird vom selben Stativ am Nachmittag und zur blauen Stunde fotografiert. Auf der Startseite blendet das Tagfoto beim ersten Scrollen ins Abendfoto über. Auf der Lichtseite bewegen die Besucher die Überblendung mit einem Regler selbst.

- Offene Punkte, Fragen an den Kunden und fehlende Fotos: [`OFFENE-PUNKTE.md`](OFFENE-PUNKTE.md)
- Luxemburgische Texte zur Prüfung durch einen Muttersprachler: [`LB-REVIEW.md`](LB-REVIEW.md)

**Stand 06.10.2026:** Gebaut und geprüft. Es ist noch kein Projekt freigegeben und es gibt noch kein Fotopaar. Deshalb zeigt die Website an allen Fotostellen eine Fläche in Kalkputz („Foto folgt: …“, „Fotopaar folgt: …“), und alle fehlenden oder unbestätigten Angaben sind sichtbar markiert. So nicht live schalten.

## Technik

| Bereich | Umsetzung |
|---|---|
| Framework | Astro 7, statisch |
| Interaktiv | Vanilla-TypeScript: Menü, Formular, Regler; Inline-Skript (644 Bytes) als Fallback für Owend. Kein React: Nichts auf der Seite braucht es. |
| Styling | Tailwind CSS 4 mit den Tokens aus dem Designkonzept (`src/styles/global.css`), Standardfarben und -schatten von Tailwind entfernt |
| Animation | CSS Scroll-Driven Animations, Fallback per Intersection Observer |
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
  views/                        eine Datei pro Seite (Home, Installation, Licht, …)
  components/                   Kopf, Fuß, Owend (Hero), OwendRegler, Foto, Faq, Zeiten, Anfrageformular …
  i18n/                         config.ts (Sprachen, URLs), de.ts (Ausgangssprache), fr.ts, lb.ts, en.ts
  lib/                          projekte.ts, zeiten.ts, feiertage.ts, jsonld.ts, faq.ts, bilder.ts, exif.ts
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

Interne Hinweise schreibt man so in den Text: `[FEHLT — was fehlt]` oder `[UNBESTÄTIGT — was zu klären ist]`. Die Website zeigt sie mit gestricheltem Rahmen, `npm run offene-punkte` sammelt sie. Sie bleiben in allen Sprachen deutsch. Ist eine Angabe geklärt, den Hinweis in allen vier Sprachen ersetzen.

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
- Die Fotos der Leistungen auf der Startseite kommen aus den Projekten `fertighaus-module` (Neubau) und `milchviehstall` (Licht), sobald diese freigegeben sind.

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

- **Startseite:** das erste Projekt mit Fotopaar und `startseite: true` nach `reihenfolge` (heute das Ösling-Haus als Kandidat).
- **Lichtseite:** alle anderen Projekte mit Fotopaar, höchstens fünf. Geplante Paare erscheinen bis zum Shooting als „Fotopaar folgt: [Motiv]“.
- **Uhrzeiten:** Bleibt `uhrzeit` leer, liest der Build die Aufnahmezeit (EXIF DateTimeOriginal) aus der JPEG-Datei. Die Bildunterschrift lautet dann z. B. „Eschweiler, Milchviehstall mit LED-Licht. Fotografiert um 14:10 und um 21:40 Uhr.“
- **Open-Graph-Bild:** Ist das Startseiten-Paar freigegeben, erzeugt der Build `og/startseite.png` aus dem Abendfoto (Logo klein unten links auf einem weißen Streifen). Bis dahin gilt `public/og/biesen.png`.

### Stellen

Eine YAML-Datei pro Stelle in `src/content/jobs/`. Nur `offen: true` bekommt eine Seite, einen Eintrag in der Sitemap und auf der Jobs-Seite. Ist eine Stelle besetzt, `offen: false` setzen: Seite und Daten verschwinden, die alte URL liefert 404.

- `veroeffentlicht: 2026-10-20` – erst mit diesem Datum gibt es ein `JobPosting` im JSON-LD (Google Jobs verlangt `datePosted`).
- `gueltig_bis` → `validThrough`, `vollzeit: true` → `employmentType: FULL_TIME`.
- `pfad` sind die URL-Teile je Sprache (heißt nicht `slug`, weil Astro das Feld als ID nimmt).

### Öffnungszeiten, Feiertage, Betriebsferien

Alles steht in `src/content/oeffnungszeiten.json`. Daraus entstehen die Zeiten-Tabelle (Startseite, Kontakt), die Kurzform im Fuß, die Liste „Geschlossen an diesen Tagen“ (die nächsten drei Schließtage an Werktagen, höchstens 75 Tage voraus) und `openingHoursSpecification` im JSON-LD.

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

Jeder luxemburgische Text ist ein Entwurf und trägt das Flag `review: "lb-native"` (`src/i18n/lb.ts`, gilt auch für alle `lb`-Felder in `src/content/` und die luxemburgischen URLs). Die vollständige Liste mit deutschem Ausgangstext steht in [`LB-REVIEW.md`](LB-REVIEW.md) (heute 478 Texte), gruppiert nach Datei. Ablauf:

1. Muttersprachler korrigiert direkt in `src/i18n/lb.ts` bzw. in den YAML-Dateien.
2. Geprüfte Schlüssel in `src/i18n/lb-geprueft.json` eintragen (z. B. `"home.h1"`, `"projekte/milchviehstall.titel"`, `"slug.licht"`).
3. `npm run lb-review` – die Liste wird kürzer.

Die Liste steht in einer eigenen Datei und nicht in diesem README, weil sie mit fast 500 Zeilen das README unlesbar machen würde.

## Owend: wie es funktioniert

- **Hero:** Tag- und Abendfoto liegen im selben Grid-Feld übereinander. Nur die Deckkraft des Abendfotos ändert sich; kein Zoom, kein Parallax, kein Filter. Die Überschrift bewegt sich nicht.
- **Mobil (unter 1024 px):** `animation-timeline: view()` am Foto selbst, `animation-range: cover 36% cover 68%`. Der Übergang beginnt, wenn das Foto ganz zu sehen ist, und ist fertig, wenn seine Unterkante die Bildschirmmitte erreicht. Gemessen bei 375 × 812: Deckkraft 0 / 25 / 50 / 75 / 100 % bei 232 / 334 / 437 / 539 / 642 px Scrollweg (Deutsch); auf Französisch mit längerem Text entsprechend später, aber am selben Punkt des Fotos.
- **Desktop:** `animation-timeline: scroll(root block)`, `animation-range: 4vh 60vh`. Bei 1440 × 900: 0 / 25 / 50 / 75 / 100 % bei 36 / 162 / 288 / 414 / 540 px.
- **Rückwärts scrollen** macht wieder Tag.
- **Fallbacks:** Ohne Scroll-Driven Animations mit JavaScript schaltet ein Intersection Observer auf eine unsichtbare Marke 30 vh unter dem Seitenanfang (Überblendung 900 ms). Ohne beides steht das Abendfoto. Bei reduzierter Bewegung stehen beide Fotos als Paar nebeneinander (ab 768 px) bzw. untereinander, jedes mit seiner Uhrzeit.
- **Lichtseite:** `<input type="range">` setzt `--abend` als Deckkraft und `aria-valuetext` („Tag“, „Abend“, „Übergang, 40 Prozent“). Ohne JavaScript ist der Regler versteckt und beide Fotos stehen nebeneinander.
- **Bildgrößen:** Das Original ist ein Querformat, gezeigt wird mobil ein 4:5-Ausschnitt. `sizes` rechnet deshalb mit der Breite, die das Bild bei `object-fit: cover` wirklich bekommt (bei 3:2: `188vw` mobil, `81vw` am Desktop).

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
| `/dienstleistungen/` | `/de/#leistungen` |
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

## Entscheidungen und Abweichungen vom Briefing

- **Owend mobil mit View-Timeline statt `scroll(root)`:** Mit `scroll(root)` hängt der Zeitpunkt von der Textlänge der Sprache ab (das Foto steht auf Französisch 96 px tiefer). Die View-Timeline misst am Foto und trifft das Ziel („Abend ist da, wenn die Unterkante die Bildschirmmitte erreicht“) in allen Sprachen. Am Desktop gilt `scroll(root)` mit 4–60 vh wie vorgegeben. Das Foto-Feld nutzt `overflow: clip` statt `hidden`, sonst misst die Timeline am falschen Container.
- **Titles ohne „Nothum“:** A.5 verlangt Nothum in jedem Title, die Tabelle G2 gibt aber für einige Seiten Titles ohne Ort vor (z. B. „Beleuchtung für Haus, Stall und Halle | Electricité Biesen“). Übernommen ist die Tabelle G2 wörtlich; EN, LB, Jobs, Impressum und Datenschutz tragen den Ort. Vorschlag zur Entscheidung: Für die Lichtseite wäre „Licht für Haus, Stall und Halle, Nothum | Electricité Biesen“ (60 Zeichen) wegen der Verwechslungsgefahr mit dem anderen Betrieb sinnvoll.
- **JobPosting erst mit Datum:** `datePosted` fehlt [FEHLT]; ohne Datum wären die strukturierten Daten ungültig. Die Job-Seiten stehen, das `JobPosting` erscheint, sobald `veroeffentlicht` eingetragen ist.
- **FAQPage nur mit bestätigten Antworten:** Fragen mit `[UNBESTÄTIGT]`/`[FEHLT]` stehen sichtbar auf der Seite, aber nicht im JSON-LD. Heute sind es zwei (Angebot, Fertighaus).
- **Kein `areaServed`, kein Zitat, keine Sterne, kein `foundingDate`** (B4, B5, G3).
- **Fehlerseite der Function:** siehe „Formular“ (HTML nur mit eigener Supabase-Domain).
- **Fehlerfarbe:** Die Palette hat kein Rot. Fehler stehen in Lei, fett, mit einem Balken davor; das Feld bekommt einen 2-px-Rahmen in Lei. Farbe ist nie der einzige Hinweis.
- **„Leistungen“ ohne Pfeil:** Es gibt keine Icons außer Plus/Minus an der FAQ. Der Knopf trägt `aria-expanded`; ohne JavaScript ist er ein Link auf `#leistungen`.
- **Fußzeile:** Telefon in der internationalen Schreibweise „+352 95 80 99“, genau wie im JSON-LD (NAP). Groß und im Hero steht „95 80 99“ wie vorgegeben.
- **Projekt-Arten:** `besonders` ergänzt (für den Stollen, Bereich „Besondere Orte“ der Lichtseite). Ein sechster Eintrag `treppe` ergänzt, weil Treppenbeleuchtung in der Galerie belegt ist und das Treppenhaus auf der Motivliste steht; so hat die Lichtseite drei geplante Paare (Stall, Halle, Treppenhaus). Ein Paar „Straße oder Platz“ kommt dazu, wenn öffentliche Referenzen bestätigt sind.
- **Linien:** nur zwischen den FAQ-Einträgen und an Eingabefeldern. Das Untermenü „Leistungen“ ist eine Fläche in Kalkputz ohne Rahmen und Schatten; ausgewählte Optionen im Formular haben einen 2-px-Rahmen in Noutem-Blau (kein Schatten).
- **Seitenkopf der Unterseiten:** sichtbarer Pfad („Startseite / Licht“), weil `BreadcrumbList` dem sichtbaren Inhalt entsprechen muss.
- **404:** Ohne JavaScript stehen alle vier Fassungen untereinander, mit JavaScript nur die der Sprache aus dem Pfad.
- **favicon.ico** zusätzlich, damit Browser, die `/favicon.ico` direkt anfragen, keine 404 bekommen.
- **TypeScript 6 statt 7:** `astro check` unterstützt TypeScript 7 noch nicht.

## Prüfprotokoll (06.10.2026, lokal)

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

**Noch nicht erledigt** (siehe Checkliste „Vor der Übergabe“ im Briefing): echtes Handy, Formular real mit Mail, Rich-Results-Test, Lighthouse mit Fotos, alle Platzhalter gefüllt, LB geprüft.
