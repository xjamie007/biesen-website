# Offene Punkte – Electricité Biesen

Diese Datei schreibt `npm run offene-punkte` aus den Übersetzungen (`src/i18n/de.ts`), den Inhaltsdaten (`src/content/`) und den Stammdaten. Bitte nicht von Hand ändern, sondern die Quelle korrigieren und das Skript erneut laufen lassen.

Auf der Website sind alle Stellen sichtbar markiert (gestrichelter Rahmen: `[FEHLT …]` oder `[UNBESTÄTIGT …]`). Die Hinweise sind intern und in allen Sprachen deutsch. Vor dem Livegang darf keine Markierung übrig sein.

## 1. Fragen an den Kunden (B9)

1. **Öffnungs- und Telefonzeiten:** 08:00 mit Mittagspause oder 07:30–16:30 durchgehend? Feiertage, Betriebsferien. → `src/content/oeffnungszeiten.json`
2. **Freigegebener Absatz zur Geschichte** (B4). Bis dahin keine Jahreszahlen, kein „seit“, kein `foundingDate`. → `seiten.ueberUns.geschichte`
3. **Vertretung der S.A. und Verantwortlicher fürs Impressum;** MwSt-Nummer in VIES prüfen. → Impressum
4. **Hausgeräte:** Ausstellung in Nothum? Lieferung, Anschluss, Reparatur? Aktuelle Marken, Recht zur Nennung. → Hausgeräte, FAQ 7
5. **Einsatzgebiet** (Gemeinden; auch Belgien?), **Störungsdienst** ja oder nein. Bis dahin kein `areaServed`, keine Notdienst-Frage. → FAQ 1
6. **Anfragen:** Wer liest sie (`FORM_RECIPIENT`), wie schnell kommt eine Antwort, ist das Angebot kostenlos (auch mit Termin vor Ort)? → Danke-Seite, FAQ 3
7. **Shooting der Tag-und-Abend-Fotopaare** (C5, Anleitung im README); Freigabe der Projekte mit Ortschaft; welcher Stollen; Teamfoto und Namen. → Abschnitt 3
8. **Logo als Vektordatei.** Danach Favicon aus dem gelben Blitz auf Noutem-Blau (`scripts/assets/favicon.py`) und `Logo.astro` auf SVG umstellen.
9. **DNS-Zugang** für electricite-biesen.lu und biesen.lu (vermutlich bei Wedo Solutions); Mailversand über einen EU-Anbieter (SPF/DKIM für die Absenderadresse). → README „Livegang“
10. **Facebook-URL;** Google-Unternehmensprofil übernehmen (README, G4).
11. **Stellen** noch offen? Vollzeit? Lehrstellen? Stellenanzeigen auch auf Portugiesisch?
12. **Mitgliedschaften und Labels** aktuell (FDA, FGT, KNX, SuperDrecksKëscht, Made in Luxembourg, Mir bilden aus)? Logos erlaubt? (Bis dahin nur als Text auf „Über uns“.)
13. **Erlaubnis für das Zitat von Karin R.** Bis dahin kein Zitat, keine Sterne, kein Bewertungs-Widget.
14. **Alle luxemburgischen Texte muttersprachlich prüfen lassen** → [`LB-REVIEW.md`](LB-REVIEW.md)

Weitere Punkte aus dem Bau:

- **Löschfrist** der Anfragen und Dateien (Vorschlag 6 Monate, wenn kein Auftrag entsteht) → `LOESCHFRIST_MONATE` der Function `aufraeumen`, Datenschutzerklärung
- **Mailanbieter** (EU) mit Nave klären: Brevo oder Scaleway sind vorbereitet → Datenschutzerklärung nennt ihn danach
- **Namen auf der Website:** Leitung (Claude und Romain Biesen laut heutiger Website), technischer Leiter laut Gewerbegenehmigung, Ansprechpartner für Bewerbungen – nur nach Freigabe
- **Herstellername der Fertighäuser** nennen? (heute nicht genannt)
- **Öffentliche Beleuchtung:** Referenzen (Straßen, Plätze, Gemeinden)? Davon hängt ein mögliches weiteres Fotopaar „Straße oder Platz“ ab.
- **„Nieder- und Hochspannung“** bei Ladestationen (heutige Website) ist nicht übernommen; was ist gemeint?
- **Editus-Leistungen** (Bureau d’études, Mittel- und Hochspannung, Mise en conformité, Dépannage) sind nicht übernommen, bis der Kunde sie bestätigt.
- **Bewerbungen:** Aufbewahrungsfrist für Bewerbungsunterlagen (Datenschutzerklärung)
- **Rufnummer für Bewerbungen 95 80 99 13**: noch aktuell, Laurent Maillen weiterhin Ansprechpartner?

## 2. Markierte Stellen in den Texten (44)

Der Schlüssel gilt in allen vier Sprachen (`src/i18n/fr.ts`, `de.ts`, `lb.ts`, `en.ts`).

| Seite | Schlüssel | Art | Was fehlt |
|---|---|---|---|
| Startseite, Projekte, Leistungsseiten | `allgemein.projekteFehlen` | FEHLT | freigegebene Projekte mit Ortschaft, Jahr und Text |
| Startseite (Was wir machen), Leistungen (Übersicht), Karten auf den Leistungsseiten | `leistungen.hausgeraete.text` | UNBESTÄTIGT | Ausstellung, Lieferung und Anschluss ergänzen |
| Startseite (Hero), Licht, Projekte | `owend.bildunterschriftFehlt` | FEHLT | Ortschaft, Projekt in drei bis fünf Wörtern, Uhrzeiten aus den EXIF-Daten |
| Startseite (26 Leute in Noutem) | `home.teamLeitung` | UNBESTÄTIGT | Leitung und Ansprechpartner mit Rollen, siehe B3 |
| Startseite (Anrufen oder schreiben), Kontakt | `zeiten.unbestaetigt` | UNBESTÄTIGT | 08:00–12:00 und 13:30–16:30 laut heutiger Website, 07:30–16:30 durchgehend laut Google und Editus |
| Fuß (alle Seiten) | `zeiten.unbestaetigtKurz` | UNBESTÄTIGT | Zeiten |
| Startseite, Lichtseite und Leistungen (FAQ) | `faq.gebiet.a` | UNBESTÄTIGT | Einsatzgebiet und zwei bis drei Ortsbeispiele |
| Startseite, Leistungen, Neubau und Renovierung, Alarm (FAQ) | `faq.kostenlos.a` | UNBESTÄTIGT | so steht es auf der heutigen Website; auch für einen Termin vor Ort? |
| Startseite, Photovoltaik und Ladestationen (FAQ) | `faq.ladestation.a` | UNBESTÄTIGT | Meldung beim Netzbetreiber durch Biesen? |
| Startseite, Photovoltaik und Ladestationen (FAQ) | `faq.zuschuesse.a` | UNBESTÄTIGT | Stand vor Livegang prüfen; hilft Biesen beim Antrag? |
| Startseite, Hausgeräte (FAQ) | `faq.hausgeraete.a` | FEHLT | Ausstellung, Lieferung, Anschluss |
| Startseite (FAQ) | `faq.sprachen.a` | UNBESTÄTIGT | auch Portugiesisch und Englisch? |
| Leistungen (Übersicht) | `seiten.leistungen.ablaufHinweis` | UNBESTÄTIGT | Ablauf vom Kunden bestätigen lassen |
| Neubau und Renovierung | `seiten.installation.fertighaus` | UNBESTÄTIGT | Ablauf, Herstellernamen |
| Neubau und Renovierung | `seiten.installation.ablaufHinweis` | UNBESTÄTIGT | Ablauf vom Kunden bestätigen lassen, ebenso wer den Netzanschluss beim Netzbetreiber beantragt |
| Licht | `seiten.licht.bereiche.oeffentlich.text` | UNBESTÄTIGT | Referenzen, Auftraggeber |
| Licht | `seiten.licht.bereiche.besonders.text` | UNBESTÄTIGT | welcher Stollen, darf er gezeigt werden |
| Photovoltaik und Ladestationen | `seiten.photovoltaik.intro` | UNBESTÄTIGT | bietet Biesen diese Kopplung an? |
| Alarm, Kameras, Brandmelder | `seiten.sicherheit.kamera` | UNBESTÄTIGT | Formulierung mit Kunde abstimmen; Verweis auf die CNPD |
| Hausgeräte | `seiten.hausgeraete.intro` | FEHLT | Ausstellung, Beratung, Lieferung, Anschluss, Reparatur |
| Projekte | `seiten.projekte.jahrFehlt` | FEHLT | Jahr |
| Projekte | `seiten.projekte.ortFehlt` | FEHLT | Ortschaft |
| Projekte | `seiten.projekte.textFehlt` | FEHLT | zwei bis vier Sätze zum Projekt |
| Über uns | `seiten.ueberUns.leitung` | UNBESTÄTIGT | Leitung und Ansprechpartner mit Rollen, siehe B3 |
| Über uns | `seiten.ueberUns.geschichte` | FEHLT | freigegebener Absatz zur Geschichte, siehe B4 |
| Über uns | `seiten.ueberUns.sprache` | UNBESTÄTIGT | welche Sprachen Kunden angeboten werden |
| Über uns | `seiten.ueberUns.mitgliedHinweis` | UNBESTÄTIGT | Mitgliedschaften und Labels aktuell? |
| Jobs | `seiten.jobs.lehre` | UNBESTÄTIGT | Lehrstellen |
| Job-Seiten | `seiten.job.arbeitszeitFehlt` | UNBESTÄTIGT | Vollzeit? |
| Job-Seiten | `seiten.job.veroeffentlichtFehlt` | FEHLT | Datum der Veröffentlichung |
| Job-Seiten | `seiten.job.gueltigFehlt` | FEHLT | Bewerbungsfrist |
| Anfrage angekommen (Danke) | `seiten.danke.text` | FEHLT | Antwortzeit beim Kunden erfragen |
| Anfrage angekommen (Danke) | `seiten.danke.ablaufHinweis` | UNBESTÄTIGT | Ablauf |
| Impressum | `seiten.impressum.mwstHinweis` | UNBESTÄTIGT | vor Livegang in VIES prüfen |
| Impressum | `seiten.impressum.vertretungFehlt` | FEHLT | Verwaltungsrat bzw. administrateur-délégué |
| Impressum | `seiten.impressum.verantwortlichFehlt` | FEHLT | Name |
| Impressum | `seiten.impressum.leitung` | UNBESTÄTIGT | Nennung des Namens laut Gewerbegenehmigung freigeben |
| Impressum | `seiten.impressum.fotos` | FEHLT | Name des Fotografen nach dem Shooting |
| Datenschutz | `seiten.datenschutz.speicherung` | UNBESTÄTIGT | EU-Mailanbieter, mit Nave klären |
| Datenschutz | `seiten.datenschutz.loeschung` | FEHLT | Löschfrist mit dem Kunden festlegen, Vorschlag: 6 Monaten |
| Datenschutz | `seiten.datenschutz.kontakt` | UNBESTÄTIGT | Frist für Bewerbungen |
| Datenschutz | `seiten.datenschutz.dienstleister[2]` | UNBESTÄTIGT | EU-Mailanbieter, mit Nave klären |
| Kontakt (Formular) | `formular.nichtKonfiguriert` | FEHLT | PUBLIC_FORM_URL: Adresse der Supabase Edge Function |
| Fuß (alle Seiten) | `footer.facebookFehlt` | FEHLT | Facebook-URL |

## 3. Fotos (11)

Ohne Foto zeigt die Seite eine Fläche in Kalkputz mit „Foto folgt: …“ bzw. „Fotopaar folgt: …“. Keine Bilddatenbank, keine KI-Bilder, nichts hochskalieren. Fotos der alten Galerie nur nach Freigabe und in Originalauflösung.

- **Elektrik für Fertighaus-Module** (`projekte/fertighaus-module.yaml`): Original in voller Auflösung anfragen. Motiv: Fertighaus-Module in einer Werkshalle, die Leitungen liegen offen in den Wänden. Webfassung: https://electricite-biesen.lu/galerie/ (2024/06/galerie-electricite-biesen_*.jpeg)
- **Beleuchtung einer Halle** (`projekte/halle.yaml`): Original in voller Auflösung anfragen. Motiv: Große Halle mit Hallenleuchten unter dem Dach. Webfassung: https://electricite-biesen.lu/galerie/ (2024/06/galerie-electricite-biesen_*.jpeg)
- **Fotopaar Halle** (`projekte/halle.yaml`, Lichtseite): Shooting nach der Anleitung im README; Uhrzeiten kommen aus den EXIF-Daten.
- **Milchviehstall mit LED-Beleuchtung** (`projekte/milchviehstall.yaml`): Original in voller Auflösung anfragen. Motiv: Milchviehstall mit LED-Leuchten über dem Futtergang. Webfassung: https://www.editus.lu/fr/entreprise-d-electricite-biesen-nothum-1949232
- **Fotopaar Milchviehstall, vom Futtergang aus** (`projekte/milchviehstall.yaml`, Lichtseite): Shooting nach der Anleitung im README; Uhrzeiten kommen aus den EXIF-Daten.
- **Wohnhaus mit Gartenbeleuchtung** (`projekte/oesling-haus.yaml`): Original in voller Auflösung anfragen. Motiv: Ösling-Haus mit grünen Fensterläden, im Vordergrund eine Pollerleuchte. Webfassung: https://electricite-biesen.lu/wp-content/uploads/2025/07/Beleuchtung-bild-0032.jpg
- **Fotopaar Wohnhaus mit Außen- und Gartenbeleuchtung** (`projekte/oesling-haus.yaml`, Startseite): Shooting nach der Anleitung im README; Uhrzeiten kommen aus den EXIF-Daten.
- **Licht für einen Stollen** (`projekte/stollen.yaml`): Original in voller Auflösung anfragen. Motiv: Portal eines Stollens, als Trockenmauer aus Schiefer gebaut. Webfassung: https://electricite-biesen.lu/wp-content/uploads/2025/07/Beleuchtung-bild-0014.jpg
- **Licht für einen Stollen** (`projekte/stollen.yaml`): Original in voller Auflösung anfragen. Motiv: Das Innere des Stollens, von Leuchten an den Wänden erhellt. Webfassung: https://electricite-biesen.lu/wp-content/uploads/2025/07/Beleuchtung-bild-0020.jpg
- **Licht für eine Treppe** (`projekte/treppe.yaml`): Original in voller Auflösung anfragen. Motiv: Treppe mit Licht an den Stufen. Webfassung: https://electricite-biesen.lu/galerie/ (2025/07/Beleuchtung-bild-*.jpg)
- **Fotopaar Treppenhaus** (`projekte/treppe.yaml`, Lichtseite): Shooting nach der Anleitung im README; Uhrzeiten kommen aus den EXIF-Daten.
- **Fotos der Leistungen auf der Startseite:** Neubau (Fertighaus-Module), Licht (Milchviehstall), Photovoltaik und Ladestationen `[FEHLT: Foto]`
- **Teamfoto** (Startseite, Über uns)

## 4. Inhaltsdaten und Stammdaten (36)

| Seite | Schlüssel | Art | Was fehlt |
|---|---|---|---|
| Projekte, Startseite | `projekte/fertighaus-module.yaml` | FEHLT | Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer |
| Projekte | `projekte/fertighaus-module.yaml ortschaft` | FEHLT | Ortschaft (nur Ort oder Gemeinde, nie die Adresse) |
| Projekte | `projekte/fertighaus-module.yaml jahr` | FEHLT | Jahr |
| Projekte | `projekte/fertighaus-module.yaml text` | FEHLT | zwei bis vier Sätze in vier Sprachen |
| Projekte, Startseite | `projekte/halle.yaml` | FEHLT | Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer |
| Projekte | `projekte/halle.yaml ortschaft` | FEHLT | Ortschaft (nur Ort oder Gemeinde, nie die Adresse) |
| Projekte | `projekte/halle.yaml jahr` | FEHLT | Jahr |
| Projekte | `projekte/halle.yaml text` | FEHLT | zwei bis vier Sätze in vier Sprachen |
| Projekte, Startseite | `projekte/milchviehstall.yaml` | FEHLT | Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer |
| Projekte | `projekte/milchviehstall.yaml ortschaft` | FEHLT | Ortschaft (nur Ort oder Gemeinde, nie die Adresse) |
| Projekte | `projekte/milchviehstall.yaml jahr` | FEHLT | Jahr |
| Projekte | `projekte/milchviehstall.yaml text` | FEHLT | zwei bis vier Sätze in vier Sprachen |
| Projekte, Startseite | `projekte/oesling-haus.yaml` | FEHLT | Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer |
| Projekte | `projekte/oesling-haus.yaml ortschaft` | FEHLT | Ortschaft (nur Ort oder Gemeinde, nie die Adresse) |
| Projekte | `projekte/oesling-haus.yaml jahr` | FEHLT | Jahr |
| Projekte | `projekte/oesling-haus.yaml text` | FEHLT | zwei bis vier Sätze in vier Sprachen |
| Projekte, Startseite | `projekte/stollen.yaml` | FEHLT | Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer |
| Projekte | `projekte/stollen.yaml ortschaft` | FEHLT | Ortschaft (nur Ort oder Gemeinde, nie die Adresse) |
| Projekte | `projekte/stollen.yaml jahr` | FEHLT | Jahr |
| Projekte | `projekte/stollen.yaml text` | FEHLT | zwei bis vier Sätze in vier Sprachen |
| Projekte, Startseite | `projekte/treppe.yaml` | FEHLT | Freigabe durch den Kunden (freigabe: true), Erlaubnis der Eigentümer |
| Projekte | `projekte/treppe.yaml ortschaft` | FEHLT | Ortschaft (nur Ort oder Gemeinde, nie die Adresse) |
| Projekte | `projekte/treppe.yaml jahr` | FEHLT | Jahr |
| Projekte | `projekte/treppe.yaml text` | FEHLT | zwei bis vier Sätze in vier Sprachen |
| Job-Seiten | `jobs/elektromonteur.yaml offen` | UNBESTÄTIGT | Ist die Stelle noch offen? |
| Job-Seiten | `jobs/elektromonteur.yaml veroeffentlicht` | FEHLT | Datum der Veröffentlichung; ohne Datum kein JobPosting für Google Jobs |
| Job-Seiten | `jobs/elektromonteur.yaml gueltig_bis` | FEHLT | Bewerbungsfrist (validThrough) |
| Job-Seiten | `jobs/elektromonteur.yaml vollzeit` | UNBESTÄTIGT | Vollzeit oder Teilzeit (employmentType) |
| Job-Seiten | `jobs/hilfsmonteur.yaml offen` | UNBESTÄTIGT | Ist die Stelle noch offen? |
| Job-Seiten | `jobs/hilfsmonteur.yaml veroeffentlicht` | FEHLT | Datum der Veröffentlichung; ohne Datum kein JobPosting für Google Jobs |
| Job-Seiten | `jobs/hilfsmonteur.yaml gueltig_bis` | FEHLT | Bewerbungsfrist (validThrough) |
| Job-Seiten | `jobs/hilfsmonteur.yaml vollzeit` | UNBESTÄTIGT | Vollzeit oder Teilzeit (employmentType) |
| Impressum, JSON-LD | `site.json mwst` | UNBESTÄTIGT | MwSt-Nummer LU32155700 in VIES prüfen, dann bestaetigt: true |
| Fuß, JSON-LD sameAs | `site.json facebook` | FEHLT | Facebook-URL |
| Startseite, Kontakt, Fuß, JSON-LD | `oeffnungszeiten.json` | UNBESTÄTIGT | Zeiten 08:00–12:00/13:30–16:30 oder 07:30–16:30 durchgehend; Betriebsferien; dann bestaetigt: true |
| Startseite, Kontakt, JSON-LD | `oeffnungszeiten.json ausnahmen` | FEHLT | Betriebsferien und Brückentage (falls es welche gibt) |

## 5. Technik vor dem Livegang

- `PUBLIC_FORM_URL` als GitHub-Variable setzen (Adresse der Edge Function `anfrage`); ohne sie zeigt das Formular einen Hinweis.
- Supabase-Projekt in der EU anlegen, Migration einspielen, Secrets setzen, beide Functions deployen (README „Formular“).
- Formular real abschicken, bis die Mail ankommt; Datei-Links in der Mail prüfen.
- Domain und DNS, „Enforce HTTPS“; echte 301-Weiterleitungen wären mit einem anderen Hosting besser (README).
- Rich-Results-Test (Firma, FAQ, Jobs), Lighthouse erneut mit echten Fotos.
- Auf einem echten Handy testen.
