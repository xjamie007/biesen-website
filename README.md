# Electricité Biesen – Website

Die neue Website von Electricité Biesen in Nothum (Noutem), in vier Sprachen: Französisch (Standard, x-default), Deutsch, Luxemburgisch und Englisch. Sie ersetzt die WordPress-Seite von Wedo Solutions vollständig.

Die Besonderheit ist **„Owend“**: Ein Biesen-Projekt wird vom selben Stativ am Nachmittag und zur blauen Stunde fotografiert. Auf der Startseite blendet das Tagfoto beim ersten Scrollen ins Abendfoto über. Auf der Lichtseite bewegen die Besucher die Überblendung mit einem Regler selbst.

- Offene Punkte, Fragen an den Kunden und fehlende Fotos: [`OFFENE-PUNKTE.md`](OFFENE-PUNKTE.md)
- Luxemburgische Texte zur Prüfung durch einen Muttersprachler: [`LB-REVIEW.md`](LB-REVIEW.md)

**Stand 09.10.2026:** Neu gestaltet (siehe „Gestaltung“) und um die Seite „Leistungen“ mit allen fünf Bereichen ergänzt. Es ist noch kein Projekt freigegeben und es gibt noch kein Fotopaar. Deshalb zeigt die Website an allen Fotostellen eine helle Fläche mit Kamerasymbol („Foto folgt: …“), im Hero ein gezeichnetes Haus, das von Tag zu Abend wechselt („Fotopaar folgt: …“), und alle fehlenden oder unbestätigten Angaben sind sichtbar markiert. So nicht live schalten.

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
  components/                   Kopf (mit Kontaktleiste), Fuß, HeroDorf, TagAbend, OwendSzene, OwendRegler, Foto, Faq,
                                Zeiten, Anfrageformular, Leistungskarte, Seitenkarte, Aufruf, Icon …
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

- **Startseite:** das erste Projekt mit Fotopaar und `startseite: true` nach `reihenfolge` (heute das Ösling-Haus als Kandidat). Es steht im Abschnitt „Bei Tag und am Abend“ mit Regler und ersetzt dort die Zeichnung.
- **Lichtseite:** alle anderen Projekte mit Fotopaar, höchstens fünf. Geplante Paare erscheinen bis zum Shooting als „Fotopaar folgt: [Motiv]“.
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

Jeder luxemburgische Text ist ein Entwurf und trägt das Flag `review: "lb-native"` (`src/i18n/lb.ts`, gilt auch für alle `lb`-Felder in `src/content/` und die luxemburgischen URLs). Die vollständige Liste mit deutschem Ausgangstext steht in [`LB-REVIEW.md`](LB-REVIEW.md) (heute 502 Texte), gruppiert nach Datei. Ablauf:

1. Muttersprachler korrigiert direkt in `src/i18n/lb.ts` bzw. in den YAML-Dateien.
2. Geprüfte Schlüssel in `src/i18n/lb-geprueft.json` eintragen (z. B. `"home.h1"`, `"projekte/milchviehstall.titel"`, `"slug.licht"`).
3. `npm run lb-review` – die Liste wird kürzer.

Die Liste steht in einer eigenen Datei und nicht in diesem README, weil sie mit fast 500 Zeilen das README unlesbar machen würde.

## Owend: wie es funktioniert

- **Startseite, Abschnitt „Bei Tag und am Abend“** (`TagAbend.astro`): zeigt, was Licht ausmacht. Tag- und Abendfassung liegen übereinander, die Besucher bewegen die Überblendung mit einem Regler (Startwert 20 %). Ist das Startseiten-Paar freigegeben, stehen hier die Fotos (`OwendRegler.astro`), bis dahin das gezeichnete Haus mit Garten (`OwendSzene.astro`) mit dem Hinweis „Fotopaar folgt: …“.
- **Lichtseite:** dieselbe Technik für alle weiteren Paare (`OwendRegler.astro`).
- **Regler:** `<input type="range">` setzt `--abend` als Deckkraft des Abendbildes und `aria-valuetext` („Tag“, „Abend“, „Übergang, 40 Prozent“) (`src/scripts/regler.ts`). Ohne JavaScript ist der Regler versteckt und beide Fassungen stehen nebeneinander (ab 768 px) bzw. untereinander, jede mit ihrer Uhrzeit.
- **Bildgrößen:** Das Original ist ein Querformat; `sizes` rechnet mit der Breite, die das Bild bei `object-fit: cover` wirklich bekommt.
- **Früher im Hero:** Bis 09.10.2026 blendete das Paar im Hero beim ersten Scrollen über. Die Überblendung ohne eigenes Zutun war dort schwer zu verstehen; mit Regler im eigenen Abschnitt und erklärendem Satz ist klar, was sie zeigt. Der Hero zeigt jetzt das gezeichnete Dorf (siehe „Gestaltung“).

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

Die erste Fassung war sehr zurückhaltend (Weiß und Kalkputz, keine Symbole, keine Schatten, nicht stickyer Kopf). Auf Wunsch von Nave ist sie jetzt farbiger, voller und lebendiger. Die Inhaltsregeln (keine Werbewörter, keine erfundenen Angaben, offene Punkte sichtbar) gelten unverändert.

- **Farben:** aus dem Logo Noutem-Blau `#0070c0` und Bletz-Giel `#ffca24`; dazu aus dem Owend-Konzept die blaue Stunde: Blo-Stonn `#0d2c54` und Nuecht `#071a33` für Hero, Seitenköpfe, Kontaktleiste und Fuß, Himmel `#eef5fc` und Sonn `#fff7e3` als helle Flächen, Mound `#c6d5e9` für Text auf Dunkel. Das Fakten-Band unter dem Hero steht in Bletz-Giel.
- **Akzentfarbe je Leistung** (`.farbe--…`): Neubau Blau, Licht Gelb, Photovoltaik Grün, Alarm Violett, Hausgeräte Orange. Sie färbt Symbole, Leisten, Stichpunkte und die Punkte im Hero; Text in Akzentfarbe erreicht auf der hellen Fassung mindestens 4,5 : 1.
- **Logo:** steht immer auf reinem Weiß, weil das PNG selbst einen weißen Grund hat. Deshalb ist der Kopf nie durchscheinend, und im Fuß hat das Logo ein eigenes weißes Band. Höhe 52 px mobil, 60 px ab 768 px, 72 px ab 1024 px (beim Scrollen 56 px). Ausgeliefert verlustfrei als PNG in einfacher, doppelter und dreifacher Dichte. Nicht nachgezeichnet, nicht verändert.
- **Kopf:** oben eine Kontaktleiste in Nachtblau (Telefon, Zeiten, E-Mail, Sprachen LU · DE · EN · FR), sie scrollt weg. Darunter der weiße Hauptkopf mit Logo, allen Seiten und „Angebot anfragen“; er bleibt oben stehen und wird beim Scrollen flacher. Alle Seiten stehen ab 768 px im Kopf, darunter im Menü. Ohne JavaScript scrollt der Kopf mobil normal mit, weil dann die ganze Navigation darin steht.
- **Sprachen im Umschalter:** Reihenfolge LU, DE, EN, FR; Luxemburgisch heißt sichtbar „LU“, im Code, in den Adressen und in `hreflang` bleibt es `lb`. Französisch bleibt x-default.
- **Hero:** `HeroDorf.astro` zeichnet ein Stück Ösling zur blauen Stunde mit allem, wofür Biesen arbeitet: Hof mit Stall und Silo, Wohnhaus mit Carport und Ladestation, Halle mit Photovoltaik, Straßenlaternen, Pollerleuchten. Beim Laden gehen die Lichter nacheinander an. Fünf Punkte im Bild führen zu den Leistungen (Name beim Überfahren); für Tastatur und Screenreader stehen dieselben Links als Chips daneben, deshalb sind die Punkte `aria-hidden`. Überfährt man einen Chip, hebt sich der passende Punkt hervor. Mobil zeigt das Bild nur die rechte Hälfte mit den Gebäuden.
- **Mehr Inhalt auf der Startseite:** Fakten-Band (26 Leute, 5 Leistungen, Ort, Telefon und Zeiten), Leistungskarten, „Bei Tag und am Abend“, Weg zum Angebot [UNBESTÄTIGT], Projekte, Team mit den offenen Stellen, Marken der Hausgeräte (als Text, keine Hersteller-Logos) und Mitgliedschaften [UNBESTÄTIGT], Fragen, Kontakt.
- **Leistungen:** eigene Seite mit allen fünf Bereichen (Text, alles, was dazugehört, Link zur Leistungsseite, „Angebot anfragen“ mit vorgewähltem Anliegen), Sprungleiste, Weg zum Angebot. Im Fuß als Liste. Jede Leistungsseite zeigt die anderen vier als Karten und am Desktop eine mitlaufende Kontaktkarte.
- **Effekte:** Karten heben sich beim Überfahren, das Symbol nimmt die Akzentfarbe an, oben wächst eine Leiste; Lichtstreifen über den Knöpfen; Unterstrich der Navigation wächst in Gelb; Inhalte kommen beim Scrollen leicht von unten (nur `forwards`, damit nichts unsichtbar bleibt); Lichter im Hero gehen an, Punkte pulsieren; ein warmer Lichtschein wandert langsam durch Hero und Seitenköpfe. Bei reduzierter Bewegung steht alles still und die Lichter sind sofort an.
- **Scroll-Animationen nur als Einzel-Eigenschaften:** Der CSS-Optimierer von Tailwind zieht `animation-timeline` sonst in die Kurzschreibweise `animation`, und Chrome verwirft die ganze Angabe. Genau das war in der ersten Fassung passiert: Owend stand dort sofort auf Abend. Deshalb in `global.css` nie `animation:` zusammen mit `animation-timeline` schreiben.

## Entscheidungen und Abweichungen vom Briefing

- **Owend nicht mehr im Hero:** Das Briefing (C5) sah die Überblendung beim ersten Scrollen im Hero vor. Seit 09.10.2026 steht sie mit Regler im Abschnitt „Bei Tag und am Abend“, siehe „Owend: wie es funktioniert“.
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

**Noch nicht erledigt** (siehe Checkliste „Vor der Übergabe“ im Briefing): echtes Handy, Formular real mit Mail, Rich-Results-Test, Lighthouse mit Fotos, alle Platzhalter gefüllt, LB geprüft.
