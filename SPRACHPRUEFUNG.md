# Sprachprüfung (09.10.2026)

Geprüft wurden alle sichtbaren Texte in vier Sprachen: `src/i18n/*.ts`, die Sprachfelder in
`src/content/projekte` und `src/content/jobs` und die Pfade, zusammen 2144 Texte (536 je Sprache).
Die Hinweise in eckigen Klammern (`[FEHLT …]`, `[UNBESTÄTIGT …]`) sind intern, immer deutsch und
wurden nicht mitgeprüft.

## Werkzeuge

| Werkzeug | Sprache | Wofür |
|---|---|---|
| Hunspell-Wörterbuch `dictionary-lb` 4.0.0 (von [spellchecker.lu](https://github.com/spellchecker-lu/dictionary-lb-lu), EUPL) mit `spylls` 0.1.7 (vollständige Hunspell-Umsetzung) | LB | Rechtschreibung, rund 95 000 Stämme mit allen Beugungen; auch zum Nachschlagen einzelner Wörter und Formen |
| Eigene Prüfung der Eifeler Regel (`scripts/sprache/nregel.py`) auf Grundlage desselben Wörterbuchs | LB | End-n vor Konsonanten außer n, d, t, z, h; ob ein n beweglich ist, entscheidet das Wörterbuch |
| LanguageTool 6.8 (offline, von Maven Central) | DE, FR, EN (britisch) | Grammatik, Zeichensetzung, Stil, Rechtschreibung |
| Hunspell `dictionary-de` 3.0.0 (igerman98), `dictionary-fr` 3.0.0 (Grammalecte), `dictionary-en` 4.0.0 (SCOWL, amerikanisch) | DE, FR, EN | zweite Meinung zur Rechtschreibung |
| `nspell` | alle | nur als Gegenprobe; versteht das luxemburgische Wörterbuch nicht vollständig (meldet sogar „fir“, „datt“), Ergebnisse nicht verwendet |

Nicht erreichbar aus der Arbeitsumgebung: spellchecker.lu online, LOD (lod.lu), LanguageTool online.
LanguageTool hat kein Luxemburgisch. **Eine Durchsicht durch eine Muttersprachlerin oder einen
Muttersprachler ersetzt das nicht** (siehe `LB-REVIEW.md`); die Werkzeuge finden Schreibfehler und
die n-Regel, aber keine unidiomatischen Wendungen.

## Luxemburgisch: korrigiert

Rechtschreibung (vom Wörterbuch bestätigt, die Ersatzform ist jeweils im Wörterbuch):

| vorher | nachher | Stellen |
|---|---|---|
| bearbechten | beaarbechten | Formular, Einwilligung, Datenschutz |
| iwwerpréife | iwwerpréiwe (Infinitiv iwwerpréiwen) | FAQ Ladestation |
| rufe mir | ruffe mir | Danke-Seite |
| trotzdem | trotzdeem | Jobs |
| Récksfroen | Réckfroen | Formular, Telefon |
| Ärt Haus, Ärt eegent Terrain | Äert Haus, Ären eegenen Terrain | FAQ, Sicherheit |
| lued | luet | Photovoltaik, Datenschutz |
| zertifizéiert | zertifiéiert | Datenschutz |
| Onbefristte | Onbefriste | SEO Jobs, Elektromonteur |
| Daglicht | Dagesliicht | Projekt Milchviehstall |
| Rohbau, Rouinstallatioun | Réibau, Réiinstallatioun | Neubau-Ablauf |
| Sécherungskaschten (de) | Sécherungskëscht (d’), mit angepasstem Artikel | FAQ, Renovierung, Formular (5×) |
| Moduler | Modullen / Modulle | Fertighaus |
| Éislécker Haus mat gréngen Fënsterluede, vir eng Pollerluucht | Éisleker Haus mat grénge Klappluede, virdrun eng Pollerluucht | Projekt Ösling |
| Handelsregister | Handelsregëster | Impressum |
| Geweerbegenehmegung | Geschäftsgeneemegung | Impressum, Fuß |
| Rechenzentrum | Datenzenter | Datenschutz, Formular |
| Pflichtfeld | Flichtfeld | Formular |
| Saddeldaach | Suedeldaach | Formular |
| Brandmelder, Brandmeldeanlag(en) | Feiermelder | Leistung Sicherheit, SEO, Formular (10×); der Pfad bleibt `alarm-video-brandmelder` |
| datselwecht, Deeselwechte, Déiselwecht | dat selwecht, Dee selwechte, Déi selwecht | Licht, Projekte |

Umformuliert, weil das Wort nicht im Wörterbuch steht und es eine sichere Alternative gibt:
„Baubegin“ → „Ufank vum Bau“; „Feininstallatioun nom Verputzen“ → „…, wann d’Maueren fäerdeg sinn“;
„Inbetribnam an Iwwerpréiwung“ → „Alles a Betrib huelen an iwwerpréiwen“; „Beweegt de Regler“ →
„Réckelt de Knäppchen“; „Préifwäert“ → „Wäert“; „Auskunft … froen“ → „froen, wéi eng Donnéeë mir vun
Iech hunn“; „erfuert Dir um Telefon“ → „rufft eis un“; „hifält“ → „hikënnt“; „D’Bannenzäit vum
Stollen“ → „Am Stollen“; „weiderzentwéckelen“ → „weiderzebilden“.

Eifeler Regel (30 Stellen): „änneren sech“ → „ännere sech“, „Fichieren ginn“ → „Fichiere ginn“,
„ginn bei“ → „gi bei“, „nëmmen Linken“ → „nëmme Linken“, „halen mir“ → „hale mir“, „notzen se“ →
„notze se“, „sichen Leit/Monteurinnen“ → „siche …“, „wien sech“ → „wie sech“, „Stollen mat“ →
„Stolle mat“, „sinn Méindes“ → „si Méindes“, „Dousen setzen“ → „Douse setzen“, „dréchen Mauer“ →
„dréche Mauer“, „leeën/setzen/bréngen/erneieren/montéieren/installéieren/liesen se“ → „… -e se“,
„an vun eis“ → „a vun eis“, „Führerschäin B“ → „Führerschäi B“ (5×; das Wörterbuch kennt beide
Formen, „B“ wird „Bee“ gesprochen); in die andere Richtung „Fotoe hëllefe“ → „Fotoen hëllefe“,
„Kamerae däerfen“ → „Kameraen däerfen“, „vu Noutem“ → „vun Noutem“ (2×).

Dazu: die Knöpfe des Prüfmodus standen auf Deutsch („Offene Punkte zeigen“) → „Oppe Punkte weisen /
verstoppen“.

## Luxemburgisch: geprüft und so gelassen

Hunspell kennt danach noch 110 Wörter nicht. Alle sind von Hand bewertet:

- **Eigennamen, Marken, Abkürzungen:** Biesen, Electricité, Noutem/Nothum, Miele, Liebherr, GitHub,
  Supabase, OpenStreetMap, Klimabonus, SuperDrecksKëscht, Fédération des Artisans, „Mir bilden aus“,
  Mé/Dë/Më/Fr/Sa, Nr., Art., Bst. und die französischen Rechtsnamen im Impressum.
- **Zusammengesetzte Wörter**, deren Teile alle im Wörterbuch stehen (Hunspell kennt freie
  Zusammensetzungen nicht): Elektroinstallatioun(en), Luedstatioun(en), Elektromonteur(in),
  Hëllefsmonteur(in), Haususchloss, Steckdouseplang, Elektroplang, Atelierhal, Pollerluucht(en),
  Fuddergank, Mëllechkéistall, Gaardebeliichtung, Gebaisteierung, Liichtprofiller,
  Empfangsberäicher, Ufroformulaire, Dateschutzerklärung, Reklammendéngschter,
  Geschäftsgeneemegung, Flichtfeld, Suedeldaach, Réiinstallatioun, Bewerbungsënnerlage u. a.
- **Gebeugte Formen** wie „ofgeschlossener“ (Partizip „ofgeschloss“).
- **Restliche Meldungen der n-Regel:** Fehlalarme. „méi“, „no“ und „Wee“ haben keine n-Form; nach den
  Platzhaltern {datum} und {zeit} folgt eine Zahl, deren Aussprache wechselt; französische Namen.

## Deutsch, Französisch, Englisch: korrigiert

| Sprache | vorher | nachher |
|---|---|---|
| DE | Dateien … hierher ziehen | hierherziehen |
| DE, FR, EN, LB | Satzanfang mit Ziffer („26 Leute arbeiten bei uns“) | „Bei uns arbeiten 26 Leute“, „Elle compte 26 personnes“, „We are a team of 26“, „Bei eis schaffe 26 Leit“ |
| FR | plus vite vous recevez un devis. Des plans ou des photos aident le plus. | plus vite vous recevrez un devis. Des plans ou des photos nous aident beaucoup. |
| EN | full time, part time | full-time, part-time |
| FR, EN | Prüfmodus-Knöpfe auf Deutsch | „Afficher/Masquer les points ouverts“, „Show/Hide open points“ |

Zwei nicht mehr benutzte Texte der entfernten Hauszeichnung (`home.tagAbendText`, `home.bildAlt`)
sind in allen Sprachen gelöscht.

## Deutsch, Französisch, Englisch: geprüft und so gelassen

LanguageTool meldet danach noch 584 Stellen, Hunspell 73 (DE), 35 (FR), 47 (EN) Wörter. Bewertet:

- **Großschreibung am Satzanfang:** Listenpunkte, Tageskürzel und Bildunterschriften sind keine Sätze.
- **Eigennamen** wie oben; „lit.“ in „Art. 6 Abs. 1 lit. a DSGVO“.
- **FR:** „Électricité neuf et rénovation“ ist die übliche Fachbezeichnung; „Ou appelez-nous“ (oder,
  nicht „où“); „aides-monteurs“ ist die richtige Mehrzahl; „Voyez nos projets“ ist korrekt (die
  vorgeschlagene Variante wäre für die Description zu lang).
- **EN:** britische Schreibung (centre, licence, enquiry, programme, façade) ist gewollt; das
  englische Hunspell-Wörterbuch ist amerikanisch und meldet sie deshalb. „SIL Open Font License“ ist
  ein Name.
- **Platzhalter:** „au X“, „et X“ sind Uhrzeiten und Daten, die erst beim Rendern eingesetzt werden.

## Wiederholen

```bash
node --experimental-strip-types scripts/sprache/texte.ts > /tmp/texte.jsonl
python3 scripts/sprache/hunspell.py /tmp/sprache /tmp/texte.jsonl lb,de,fr,en   # Vorbereitung siehe Datei
python3 scripts/sprache/nregel.py /tmp/sprache /tmp/texte.jsonl
cd scripts/sprache && mvn -q dependency:copy-dependencies -DoutputDirectory=lib \
  && java -Dstdout.encoding=UTF-8 -cp "lib/*" LanguageTool.java /tmp/texte.jsonl > /tmp/languagetool.tsv
```
