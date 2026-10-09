/**
 * Deutsch: Ausgangssprache des Briefings. Alle anderen Sprachen haben dieselben Schlüssel
 * (vom Typ erzwungen, von tests/i18n.test.ts geprüft).
 *
 * Platzhalter in Texten:
 *   {name}               wird beim Rendern ersetzt (Telefon, Links …)
 *   [FEHLT — …]          Angabe fehlt, wird sichtbar markiert und in OFFENE-PUNKTE.md gesammelt
 *   [UNBESTÄTIGT — …]    Angabe muss der Kunde bestätigen, ebenso
 * Die Hinweise in eckigen Klammern sind intern und bleiben in allen Sprachen deutsch.
 */
const de = {
  meta: {
    siteName: 'Electricité Biesen',
    ogAlt: 'Electricité Biesen, Elektrobetrieb in Nothum',
  },

  a11y: {
    skip: 'Zum Inhalt springen',
    sprache: 'Sprache',
    hauptnavigation: 'Hauptnavigation',
    pfad: 'Sie sind hier',
    logo: 'Electricité Biesen, zur Startseite',
    menue: 'Menü',
    schliessen: 'Schließen',
    anrufen: 'Anrufen',
    leistungenUntermenue: 'Leistungen',
    neuesFenster: '(öffnet eine andere Website)',
  },

  nav: {
    home: 'Startseite',
    leistungen: 'Leistungen',
    alleLeistungen: 'Alle Leistungen im Überblick',
    projekte: 'Projekte',
    ueberUns: 'Über uns',
    jobs: 'Jobs',
    kontakt: 'Kontakt',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
  },

  allgemein: {
    angebotAnfragen: 'Angebot anfragen',
    oderAnrufen: 'Oder rufen Sie an: {tel}',
    telefon: 'Telefon',
    fax: 'Fax',
    email: 'E-Mail',
    adresse: 'Adresse',
    fotoFolgt: 'Foto folgt: {motiv}',
    fotopaarFolgt: 'Fotopaar folgt: {motiv}',
    nichtFreigegeben: 'nicht freigegeben',
    projekteFehlen: '[FEHLT — freigegebene Projekte mit Ortschaft, Jahr und Text]',
    passendeProjekte: 'Projekte',
    passendeFragen: 'Häufige Fragen',
  },

  /** Die fünf Leistungen (Name = Navigation, h3 auf der Startseite, Anliegen im Formular) */
  leistungen: {
    installation: {
      name: 'Neubau und Renovierung',
      text: 'Wir planen und verlegen die Elektrik für neue Häuser, auch für Fertighäuser, und bringen alte Anlagen auf den heutigen Stand: Verteiler, Leitungen, Steckdosen, Gemeinschaftsantennen und Gebäudesteuerung mit KNX.',
      link: 'Mehr zu Neubau und Renovierung',
    },
    licht: {
      name: 'Licht',
      text: 'Licht für Wohnräume, Treppen und Gärten, für Ställe und Hallen, für Straßen und Plätze. Wir überlegen mit Ihnen, wo welches Licht hingehört, und montieren es.',
      link: 'Projekte bei Tag und am Abend ansehen',
    },
    photovoltaik: {
      name: 'Photovoltaik und Ladestationen',
      text: 'Photovoltaikanlagen für das Dach von Haus, Hof oder Halle, die sich später erweitern lassen. Ladestationen für Elektroautos, zu Hause oder im Betrieb.',
      link: 'Mehr zu Photovoltaik und Ladestationen',
    },
    sicherheit: {
      name: 'Alarm, Kameras, Brandmelder',
      text: 'Alarmanlagen, Videoüberwachung und Brandmeldeanlagen, abgestimmt auf Ihr Gebäude und von uns installiert.',
      link: 'Mehr zur Sicherheitstechnik',
    },
    hausgeraete: {
      name: 'Hausgeräte',
      text: 'Waschmaschinen, Kühlschränke, Backöfen und Küchengeräte von AEG, Miele, Liebherr, Bosch und Siemens. [UNBESTÄTIGT — Ausstellung, Lieferung und Anschluss ergänzen]',
      link: 'Zu den Hausgeräten',
    },
  },

  /** Owend: Tag- und Abendfoto desselben Projekts (C5, C6) */
  owend: {
    bildunterschrift: '{ort}, {projekt}. Fotografiert um {tag} und um {abend} Uhr.',
    bildunterschriftFehlt: '[FEHLT — Ortschaft, Projekt in drei bis fünf Wörtern, Uhrzeiten aus den EXIF-Daten]',
    tagZeit: 'Am Nachmittag, {zeit} Uhr',
    abendZeit: 'Am Abend, {zeit} Uhr',
    regler: 'Von Tag zu Abend',
    reglerTag: 'Tag',
    reglerAbend: 'Abend',
    reglerUebergang: 'Übergang, {wert} Prozent',
    testTag: 'Test Tag',
    testAbend: 'Test Abend',
    motivStartseite: 'Wohnhaus mit Außen- und Gartenbeleuchtung',
  },

  home: {
    h1: 'Strom und Licht für Haus, Hof und Betrieb',
    lead: 'Wir sind ein Elektrobetrieb mit 26 Leuten in Noutem, in der Stauseegemeinde. Wir verlegen die Elektrik in neuen und alten Häusern, in Ställen und Hallen und montieren Licht, Photovoltaik und Ladestationen.',
    leistungenH2: 'Was wir machen',
    leistungenIntro: 'Wir arbeiten in fünf Bereichen, in Wohnhäusern, auf Höfen und in Betrieben. Wählen Sie einen Bereich, um mehr zu erfahren.',
    alleLeistungen: 'Alle Leistungen im Überblick',
    projekteH2: 'Wo wir gearbeitet haben',
    alleProjekte: 'Alle Projekte',
    teamH2: '26 Leute in Noutem',
    team: 'Electricité Biesen ist ein Familienbetrieb. 26 Leute arbeiten bei uns, auf den Baustellen und im Büro. Wenn Sie anrufen, erreichen Sie jemanden, der Ihnen weiterhilft.',
    teamLeitung: '[UNBESTÄTIGT — Leitung und Ansprechpartner mit Rollen, siehe B3]',
    teamFoto: 'Teamfoto',
    jobs: 'Wir suchen Monteurinnen und Monteure.',
    jobsLink: 'Offene Stellen',
    faqH2: 'Häufige Fragen',
    kontaktH2: 'Anrufen oder schreiben',
    schreiben: 'Oder schreiben Sie an {email}. {adresse}.',
  },

  zeiten: {
    titel: 'Telefon- und Bürozeiten',
    tage: {
      mo: 'Montag',
      di: 'Dienstag',
      mi: 'Mittwoch',
      do: 'Donnerstag',
      fr: 'Freitag',
      sa: 'Samstag',
      so: 'Sonntag',
    },
    tageKurz: { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa', so: 'So' },
    spanne: '{von} bis {bis}',
    paar: '{a} und {b}',
    geschlossen: 'geschlossen',
    unbestaetigt: '[UNBESTÄTIGT — 08:00–12:00 und 13:30–16:30 laut heutiger Website, 07:30–16:30 durchgehend laut Google und Editus]',
    unbestaetigtKurz: '[UNBESTÄTIGT — Zeiten]',
    naechste: 'Geschlossen an diesen Tagen:',
    tagSpalte: 'Tag',
    zeitSpalte: 'Zeiten',
  },

  faq: {
    gebiet: {
      q: 'In welchen Orten arbeiten Sie?',
      a: 'Unser Betrieb liegt in Noutem in der Stauseegemeinde. Wir arbeiten vor allem im Norden des Landes. [UNBESTÄTIGT — Einsatzgebiet und zwei bis drei Ortsbeispiele] Wohnen Sie weiter weg, rufen Sie an: {tel}.',
    },
    angebot: {
      q: 'Was brauchen Sie für ein Angebot?',
      a: 'Den Ort, was gemacht werden soll, und wann. Pläne oder Fotos helfen sehr: ein Grundriss, ein Elektroplan oder ein Foto vom Sicherungskasten. Sie können alles im {formular} hochladen.',
      formular: 'Anfrageformular',
    },
    kostenlos: {
      q: 'Ist das Angebot kostenlos?',
      a: 'Ja. [UNBESTÄTIGT — so steht es auf der heutigen Website; auch für einen Termin vor Ort?]',
    },
    fertighaus: {
      q: 'Verlegen Sie auch die Elektrik in Fertighäusern?',
      a: 'Ja. Wir arbeiten auch für Bauherren, die ein Fertighaus bauen, und stimmen uns mit dem Hersteller ab.',
    },
    ladestation: {
      q: 'Kann ich zu Hause eine Ladestation für mein Elektroauto bekommen?',
      a: 'Das prüfen wir für Ihr Haus: ob Hausanschluss und Verteiler die Leistung tragen, wie das Kabel zum Stellplatz kommt und ob sich die Station mit einer Photovoltaikanlage verbinden lässt. Danach bekommen Sie ein Angebot. [UNBESTÄTIGT — Meldung beim Netzbetreiber durch Biesen?]',
    },
    zuschuesse: {
      q: 'Gibt es Zuschüsse für Photovoltaik oder Ladestationen?',
      a: 'Der Staat fördert beides über das Programm Klimabonus. Bedingungen und Beträge ändern sich; den aktuellen Stand finden Sie auf {klimabonus}. [UNBESTÄTIGT — Stand vor Livegang prüfen; hilft Biesen beim Antrag?]',
    },
    hausgeraete: {
      q: 'Verkaufen Sie Hausgeräte? Kann ich sie mir ansehen?',
      a: 'Wir verkaufen Geräte von AEG, Miele, Liebherr, Bosch und Siemens. [FEHLT — Ausstellung, Lieferung, Anschluss]',
    },
    sprachen: {
      q: 'In welchen Sprachen kann ich mit Ihnen sprechen?',
      a: 'Luxemburgisch, Französisch und Deutsch. [UNBESTÄTIGT — auch Portugiesisch und Englisch?]',
    },
  },

  seiten: {
    leistungen: {
      h1: 'Unsere Leistungen im Überblick',
      intro: 'Elektroinstallation für Neubau und Renovierung, Licht, Photovoltaik und Ladestationen, Alarm- und Brandmeldeanlagen und Hausgeräte. Hier sehen Sie alle Bereiche auf einen Blick.',
      dazu: 'Dazu gehört',
      ablaufH2: 'So kommen Sie zu Ihrem Angebot',
      ablauf: [
        'Sie rufen an oder schicken uns Ihre Anfrage, gern mit Plänen oder Fotos.',
        'Wir besprechen mit Ihnen, was gemacht werden soll, bei größeren Projekten vor Ort.',
        'Sie bekommen ein schriftliches Angebot.',
        'Wir führen die Arbeiten aus und nehmen alles mit Ihnen in Betrieb.',
      ],
      ablaufHinweis: '[UNBESTÄTIGT — Ablauf vom Kunden bestätigen lassen]',
      unsicherH2: 'Nicht sicher, welcher Bereich passt?',
      unsicher: 'Beschreiben Sie uns kurz, worum es geht. Wir sagen Ihnen, was möglich ist und wer sich darum kümmert.',
    },
    installation: {
      h1: 'Elektrik für Neubau und Renovierung',
      intro: 'Ob Sie neu bauen, ein Fertighaus aufstellen lassen oder ein altes Haus umbauen: Wir planen die Elektrik mit Ihnen, verlegen sie und nehmen sie in Betrieb.',
      wasH2: 'Was wir machen',
      was: [
        'Elektroplan und Steckdosenplan',
        'Verteiler und Leitungen',
        'Schalter, Steckdosen, Anschlüsse',
        'Gemeinschaftsantennen in Mehrfamilienhäusern',
        'Gebäudesteuerung mit KNX',
        'Prüfung und Erneuerung alter Anlagen',
      ],
      fertighausH2: 'Für Fertighaus-Bauherren',
      fertighaus: 'Wir verlegen die Elektrik auch in Fertighäusern und stimmen uns mit dem Hersteller ab. [UNBESTÄTIGT — Ablauf, Herstellernamen]',
      renovierungH2: 'Renovierung und Umbau',
      renovierung: 'Wir prüfen bestehende Anlagen, erneuern sie und bringen sie auf den heutigen Stand. Für ein erstes Gespräch hilft ein Foto vom Sicherungskasten.',
      anliegenRenovierung: 'Angebot für eine Renovierung anfragen',
      ablaufH2: 'So läuft ein Neubau ab',
      ablauf: [
        'Sie schicken uns Ihre Pläne.',
        'Wir besprechen mit Ihnen, wo Steckdosen, Schalter und Licht hinkommen.',
        'Rohinstallation im Rohbau.',
        'Feininstallation nach dem Verputzen.',
        'Inbetriebnahme und Prüfung.',
      ],
      ablaufHinweis: '[UNBESTÄTIGT — Ablauf vom Kunden bestätigen lassen, ebenso wer den Netzanschluss beim Netzbetreiber beantragt]',
      fotoMotiv: 'Fertighaus-Module in der Werkshalle',
    },
    licht: {
      h1: 'Licht für Haus, Hof, Halle und Straße',
      intro: 'Bewegen Sie den Regler unter den Fotos: Sie sehen dasselbe Projekt am Nachmittag und am Abend.',
      paareH2: 'Bei Tag und am Abend',
      bereicheH2: 'Wo wir Licht machen',
      bereiche: {
        innen: {
          h: 'Wohnräume und Treppen',
          text: 'Lichtprofile mit LED in Wohnräumen und Licht für Treppen. Wir überlegen mit Ihnen, wo das Licht hinfällt und wie Sie es schalten.',
        },
        aussen: {
          h: 'Außen und Garten',
          text: 'Licht für Fassade, Wege und Garten, zum Beispiel Pollerleuchten am Weg. So finden Sie und Ihre Gäste auch am Abend sicher zur Tür.',
        },
        landwirtschaft: {
          h: 'Landwirtschaft',
          text: 'Licht für Ställe, zum Beispiel LED-Beleuchtung in einem Milchviehstall. Wir planen mit Ihnen, wo die Leuchten hängen, und montieren sie.',
        },
        hallen: {
          h: 'Hallen und Betriebe',
          text: 'Licht für große Hallen, Werkstätten und Empfangsbereiche. Wir planen die Beleuchtung so, dass dort gut gearbeitet werden kann.',
        },
        oeffentlich: {
          h: 'Straßen und Plätze',
          text: 'Beleuchtung für Straßen, Plätze und öffentliche Orte. [UNBESTÄTIGT — Referenzen, Auftraggeber]',
        },
        besonders: {
          h: 'Besondere Orte',
          text: 'Manche Orte brauchen ihr eigenes Licht, zum Beispiel ein Stollen mit einem Portal aus Schiefer. [UNBESTÄTIGT — welcher Stollen, darf er gezeigt werden]',
        },
      },
    },
    photovoltaik: {
      h1: 'Photovoltaik und Ladestationen',
      intro: 'Wir bauen Photovoltaikanlagen für Wohnhäuser, Höfe und Betriebe und installieren Ladestationen für Elektroautos. Beides lässt sich verbinden, damit Ihr Auto mit dem Strom vom eigenen Dach lädt. [UNBESTÄTIGT — bietet Biesen diese Kopplung an?]',
      wasH2: 'Was wir machen',
      was: [
        'Photovoltaikanlagen für das Dach von Haus, Hof oder Halle',
        'Anlagen, die sich später erweitern lassen',
        'Ladestationen für Elektroautos, zu Hause oder im Betrieb',
      ],
      pruefenH2: 'Was wir prüfen, bevor Sie ein Angebot bekommen',
      pruefen: ['Dachfläche und Ausrichtung', 'Hausanschluss und Verteiler', 'Weg vom Verteiler zum Stellplatz'],
      foerderungH2: 'Förderung',
      foerderung: 'Der Staat fördert Photovoltaik und Ladestationen über das Programm Klimabonus. Mehr dazu unten in den häufigen Fragen.',
      fotoMotiv: 'Photovoltaikanlage oder Ladestation',
      anliegenLadestation: 'Angebot für eine Ladestation anfragen',
    },
    sicherheit: {
      h1: 'Alarm, Kameras und Brandmelder',
      intro: 'Wir planen Alarmanlagen, Videoüberwachung und Brandmeldeanlagen für Ihr Gebäude und installieren sie. Für Wohnhäuser und für Betriebe.',
      wasH2: 'Was wir machen',
      was: ['Alarmanlagen', 'Videoüberwachung', 'Brandmeldeanlagen'],
      kameraH2: 'Hinweis zur Videoüberwachung',
      kamera: 'Kameras dürfen nur Ihr eigenes Grundstück filmen. [UNBESTÄTIGT — Formulierung mit Kunde abstimmen; Verweis auf die CNPD]',
    },
    hausgeraete: {
      h1: 'Hausgeräte von AEG, Miele, Liebherr, Bosch und Siemens',
      intro: '[FEHLT — Ausstellung, Beratung, Lieferung, Anschluss, Reparatur]',
      wasH2: 'Was wir verkaufen',
      was: ['Waschmaschinen', 'Kühlschränke', 'Backöfen', 'Küchengeräte'],
      marken: 'Marken: AEG, Miele, Liebherr, Bosch und Siemens.',
      online: 'Wir verkaufen nicht online. Preise und Verfügbarkeit erfahren Sie am Telefon: {tel}.',
    },
    projekte: {
      h1: 'Projekte: Licht, Neubau, Ställe und Hallen',
      intro: 'Was wir gebaut und beleuchtet haben, mit Ortschaft und Jahr. Bei manchen Projekten sehen Sie dasselbe Motiv am Nachmittag und am Abend.',
      sprung: 'Springen zu',
      jahr: 'Jahr',
      jahrFehlt: '[FEHLT — Jahr]',
      ortFehlt: '[FEHLT — Ortschaft]',
      textFehlt: '[FEHLT — zwei bis vier Sätze zum Projekt]',
    },
    ueberUns: {
      h1: 'Ein Familienbetrieb in Noutem',
      intro: 'Electricité Biesen ist ein Familienbetrieb. 26 Leute arbeiten bei uns, auf den Baustellen und im Büro. Wenn Sie anrufen, erreichen Sie jemanden, der Ihnen weiterhilft.',
      leitungH2: 'Leitung und Ansprechpartner',
      leitung: '[UNBESTÄTIGT — Leitung und Ansprechpartner mit Rollen, siehe B3]',
      geschichteH2: 'Geschichte',
      geschichte: '[FEHLT — freigegebener Absatz zur Geschichte, siehe B4]',
      spracheH2: 'Sprachen',
      sprache: 'Im Team sprechen wir Französisch und Deutsch, viele auch Luxemburgisch oder Portugiesisch. [UNBESTÄTIGT — welche Sprachen Kunden angeboten werden]',
      mitgliedH2: 'Mitgliedschaften und Labels',
      mitglied: ['Fédération des Artisans', 'FGT', 'KNX', 'SuperDrecksKëscht', 'Made in Luxembourg', 'Mir bilden aus'],
      mitgliedHinweis: '[UNBESTÄTIGT — Mitgliedschaften und Labels aktuell?]',
      ortH2: 'Wo Sie uns finden',
      ort: 'Unser Betrieb liegt in Noutem, in der Stauseegemeinde, etwa 8 km von Wiltz.',
      karte: 'Auf OpenStreetMap ansehen',
      jobsH2: 'Bei uns arbeiten',
    },
    jobs: {
      h1: 'Jobs bei Electricité Biesen in Noutem',
      intro: 'Wir arbeiten in Wohnhäusern, Betrieben, Hallen und Ställen im Norden des Landes. Wir suchen Leute, die mit anpacken. Arbeitsort ist Noutem.',
      offenH2: 'Offene Stellen',
      keine: 'Im Moment haben wir keine offene Stelle. Eine Bewerbung können Sie uns trotzdem schicken: {email}.',
      lehre: '[UNBESTÄTIGT — Lehrstellen]',
      bewerbenH2: 'So bewerben Sie sich',
      bewerben: 'Schicken Sie Ihren Lebenslauf und ein paar Sätze zu Ihnen an {email}. Oder rufen Sie an: {tel}.',
    },
    job: {
      aufgabenH2: 'Ihre Aufgaben',
      profilH2: 'Ihr Profil',
      angebotH2: 'Was wir bieten',
      vertragH2: 'Vertrag',
      bewerbenH2: 'So bewerben Sie sich',
      bewerben: 'Schicken Sie Ihren Lebenslauf und ein paar Sätze zu Ihnen an {email}. Oder rufen Sie an: {tel}.',
      mailBetreff: 'Bewerbung: {titel}',
      mailLink: 'E-Mail schreiben',
      arbeitsort: 'Arbeitsort',
      beginn: 'Beginn',
      beginnText: 'nach Vereinbarung',
      vertragsart: 'Vertrag',
      unbefristet: 'unbefristet',
      arbeitszeit: 'Arbeitszeit',
      vollzeit: 'Vollzeit',
      teilzeit: 'Teilzeit',
      arbeitszeitFehlt: '[UNBESTÄTIGT — Vollzeit?]',
      veroeffentlicht: 'Veröffentlicht am {datum}',
      veroeffentlichtFehlt: '[FEHLT — Datum der Veröffentlichung]',
      gueltig: 'Bewerbungen bis {datum}',
      gueltigFehlt: '[FEHLT — Bewerbungsfrist]',
      alleJobs: 'Alle offenen Stellen',
    },
    kontakt: {
      h1: 'Angebot anfragen',
      intro: 'Je genauer Sie beschreiben, worum es geht, desto schneller bekommen Sie ein Angebot. Pläne oder Fotos helfen am meisten.',
      direktH2: 'Anrufen oder schreiben',
      anfahrt: 'Anfahrt auf OpenStreetMap',
      ablaufH2: 'Was nach dem Absenden passiert',
    },
    danke: {
      h1: 'Ihre Anfrage ist angekommen',
      text: 'Wir melden uns [FEHLT — Antwortzeit beim Kunden erfragen]. Eilt es, rufen Sie an: {tel}.',
      ablaufH2: 'So geht es weiter',
      ablauf: [
        'Wir lesen Ihre Anfrage und schauen uns Pläne und Fotos an.',
        'Wenn etwas fehlt, rufen wir Sie an oder schreiben Ihnen.',
        'Sie bekommen ein Angebot, bei größeren Projekten nach einem Termin vor Ort.',
      ],
      ablaufHinweis: '[UNBESTÄTIGT — Ablauf]',
      zurueck: 'Zur Startseite',
    },
    nichtGefunden: {
      h1: 'Diese Seite gibt es nicht (mehr)',
      text: 'Vielleicht hilft Ihnen eine dieser Seiten weiter:',
      telefon: 'Oder rufen Sie an: {tel}',
    },
    impressum: {
      h1: 'Impressum',
      herausgeberH2: 'Herausgeber der Website',
      firma: 'Firmenname',
      rechtsform: 'Rechtsform',
      rechtsformWert: 'Société anonyme (S.A.)',
      sitz: 'Sitz',
      land: 'Luxemburg',
      rcs: 'Handelsregister',
      mwst: 'MwSt.-Nummer',
      mwstHinweis: '[UNBESTÄTIGT — vor Livegang in VIES prüfen]',
      vertretung: 'Vertretung der Gesellschaft',
      vertretungFehlt: '[FEHLT — Verwaltungsrat bzw. administrateur-délégué]',
      verantwortlich: 'Verantwortlich für den Inhalt',
      verantwortlichFehlt: '[FEHLT — Name]',
      genehmigungH2: 'Gewerbegenehmigung',
      genehmigung: 'Niederlassungsgenehmigung Nr. {nr}, ausgestellt am {datum}, für diese Tätigkeiten:',
      taetigkeiten: ['10116411/0: Elektriker (électricien)', '10116411/1: Handelstätigkeiten und Dienstleistungen (activités et services commerciaux)'],
      leitung: 'Technische Leitung: [UNBESTÄTIGT — Nennung des Namens laut Gewerbegenehmigung freigeben]',
      hostingH2: 'Hosting',
      hosting: 'Die Website wird von GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Vereinigte Staaten.',
      inhaltH2: 'Inhalt',
      inhalt: 'Die Angaben auf dieser Website sind unverbindlich. Verbindlich ist allein unser schriftliches Angebot.',
      fotosH2: 'Fotos',
      fotos: 'Alle Fotos zeigen Projekte von Electricité Biesen. [FEHLT — Name des Fotografen nach dem Shooting]',
      schriftH2: 'Schrift',
      schrift: 'Schibsted Grotesk von Bakken & Bæck und Henrik Kongsvoll, SIL Open Font License 1.1.',
    },
    datenschutz: {
      h1: 'Datenschutzerklärung',
      intro: 'Wir verarbeiten Ihre Daten nur, um Ihre Anfrage oder Bewerbung zu bearbeiten. Diese Website setzt keine Cookies, nutzt keine Analyse- oder Werbedienste und lädt keine Inhalte von anderen Servern.',
      verantwortlichH2: 'Verantwortlich',
      verantwortlich: 'Entreprise d’électricité BIESEN S.A., 14, Duerfstrooss, L-9678 Nothum, Luxemburg. Telefon +352 95 80 99, {email}.',
      formularH2: 'Anfrageformular',
      formular: 'Wenn Sie das Anfrageformular senden, erhalten wir die Angaben, die Sie eintragen: worum es geht, die Art des Gebäudes, die Ortschaft, Ihre Beschreibung, Ihren Namen, Ihre E-Mail-Adresse, auf Wunsch Ihre Telefonnummer und die Pläne oder Fotos, die Sie hochladen. Wir nutzen sie, um Ihre Anfrage zu bearbeiten und Ihnen ein Angebot zu schreiben.',
      rechtsgrundlage: 'Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und die Vorbereitung eines Vertrags auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Sie können Ihre Einwilligung jederzeit per E-Mail oder Telefon widerrufen.',
      speicherung: 'Ihre Anfrage und Ihre Dateien werden bei Supabase in einem Rechenzentrum in der Europäischen Union gespeichert. Die Dateien liegen in einem privaten Speicher; in der E-Mail an unser Büro stehen nur zeitlich begrenzte Links. Die E-Mail verschickt [UNBESTÄTIGT — EU-Mailanbieter, mit Nave klären].',
      loeschung: 'Entsteht aus Ihrer Anfrage kein Auftrag, löschen wir Anfrage und Dateien nach [FEHLT — Löschfrist mit dem Kunden festlegen, Vorschlag: 6 Monaten]. Unterlagen zu einem Auftrag bewahren wir so lange auf, wie es die gesetzlichen Pflichten verlangen.',
      missbrauch: 'Um Missbrauch zu begrenzen, speichern wir 24 Stunden lang einen verschlüsselten Prüfwert (Hash) Ihrer IP-Adresse. Aus ihm lässt sich Ihre Adresse nicht zurückrechnen.',
      kontaktH2: 'E-Mail, Telefon und Bewerbungen',
      kontakt: 'Wenn Sie uns anrufen, eine E-Mail schreiben oder sich per E-Mail bewerben, verarbeiten wir Ihre Angaben, um Ihnen zu antworten oder Ihre Bewerbung zu prüfen. Bewerbungsunterlagen löschen wir, wenn die Stelle besetzt ist, es sei denn, Sie sind mit einer längeren Aufbewahrung einverstanden. [UNBESTÄTIGT — Frist für Bewerbungen]',
      hostingH2: 'Hosting und Server-Logdateien',
      hosting: 'Die Website wird von GitHub Pages (GitHub, Inc., Vereinigte Staaten) ausgeliefert. Bei jedem Aufruf verarbeitet GitHub Ihre IP-Adresse und technische Angaben wie Browser und Uhrzeit, um die Seiten auszuliefern und die Sicherheit zu gewährleisten. GitHub ist nach dem EU-US-Datenschutzrahmen (Data Privacy Framework) zertifiziert. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und erreichbaren Website (Art. 6 Abs. 1 lit. f DSGVO).',
      dienstleisterH2: 'Wer Daten in unserem Auftrag verarbeitet',
      dienstleister: [
        'GitHub, Inc. (Vereinigte Staaten): Hosting der Website',
        'Supabase, Inc.: Speicherung der Anfragen und Dateien, Rechenzentrum in der Europäischen Union',
        'Mailversand: [UNBESTÄTIGT — EU-Mailanbieter, mit Nave klären]',
      ],
      linksH2: 'Links zu anderen Diensten',
      links: 'Schriften und Bilder liegen auf unserem eigenen Server. Links zu OpenStreetMap, Facebook, Editus oder klimabonus.lu öffnen andere Websites erst, wenn Sie darauf klicken. Dort gelten die Datenschutzregeln dieser Anbieter.',
      rechteH2: 'Ihre Rechte',
      rechte: 'Sie können Auskunft über Ihre Daten verlangen, ihre Berichtigung, Löschung oder die Einschränkung der Verarbeitung, und Sie können der Verarbeitung widersprechen und Ihre Daten mitnehmen. Schreiben Sie uns an {email}. Sie können sich außerdem bei der Nationalen Kommission für den Datenschutz (CNPD) beschweren: 15, boulevard du Jazz, L-4370 Belvaux, {cnpd}.',
      stand: 'Stand: {datum}',
    },
  },

  /** Arten der Projekte (D3), für Unterzeilen und die Gruppen auf der Projektseite */
  arten: {
    neubau: 'Neubau',
    renovierung: 'Renovierung',
    'licht-innen': 'Licht innen',
    'licht-aussen': 'Licht außen',
    landwirtschaft: 'Landwirtschaft',
    halle: 'Hallen und Betriebe',
    oeffentlich: 'Straßen und Plätze',
    photovoltaik: 'Photovoltaik',
    ladestation: 'Ladestationen',
    sicherheit: 'Sicherheitstechnik',
    besonders: 'Besondere Orte',
  },

  formular: {
    pflicht: 'Pflichtfeld',
    freiwillig: 'freiwillig',
    hinweisPflicht: 'Felder mit dem Zusatz „freiwillig“ können Sie leer lassen. Alle anderen brauchen wir für das Angebot.',
    anliegen: {
      legende: 'Worum geht es?',
      optionen: {
        neubau: 'Neubau',
        renovierung: 'Renovierung oder Umbau',
        licht: 'Licht',
        photovoltaik: 'Photovoltaik',
        ladestation: 'Ladestation',
        sicherheit: 'Alarm, Kamera oder Brandmelder',
        hausgeraet: 'Hausgerät',
        anderes: 'Etwas anderes',
      },
    },
    gebaeude: {
      legende: 'Was für ein Gebäude?',
      hinweis: 'Nicht nötig bei Hausgeräten.',
      optionen: {
        haus: 'Haus',
        wohnung: 'Wohnung',
        betrieb: 'Betrieb oder Halle',
        landwirtschaft: 'Landwirtschaft',
        oeffentlich: 'Gemeinde oder öffentliches Gebäude',
      },
    },
    nurNeubau: 'Nur bei Neubau',
    fertighaus: {
      legende: 'Bauen Sie ein Fertighaus?',
      optionen: { ja: 'Ja', nein: 'Nein', offen: 'Weiß ich noch nicht' },
    },
    nurLadestation: 'Nur bei Ladestation',
    abstand: {
      legende: 'Wie weit ist der Stellplatz vom Sicherungskasten entfernt?',
      optionen: { unter10: 'unter 10 m', bis25: '10 bis 25 m', ueber25: 'über 25 m', unbekannt: 'weiß ich nicht' },
    },
    pv: {
      legende: 'Haben Sie eine Photovoltaikanlage?',
      optionen: { ja: 'Ja', nein: 'Nein', geplant: 'Geplant' },
    },
    nurHausgeraet: 'Nur bei Hausgerät',
    geraet: { label: 'Welches Gerät suchen Sie?' },
    ortschaft: { label: 'Ortschaft', hinweis: 'Damit wir wissen, wer bei Ihnen in der Nähe ist.' },
    start: {
      label: 'Wann soll es losgehen?',
      leer: 'Bitte wählen',
      optionen: { bald: 'So bald wie möglich', dreiMonate: 'In den nächsten drei Monaten', spaeter: 'Später, wir planen noch' },
    },
    beschreibung: {
      label: 'Beschreibung',
      hinweise: {
        standard: 'Zum Beispiel: Altbau von 1975, Küche und Bad neu, Verteiler erneuern.',
        neubau: 'Zum Beispiel: Einfamilienhaus mit Keller, Baubeginn im Frühjahr, Pläne vom Architekten.',
        renovierung: 'Zum Beispiel: Altbau von 1975, Küche und Bad neu, Verteiler erneuern.',
        licht: 'Zum Beispiel: Garten mit Weg zur Haustür, Pollerleuchten und Licht an der Fassade.',
        photovoltaik: 'Zum Beispiel: Satteldach nach Süden, etwa 60 m², die Anlage soll später erweiterbar sein.',
        ladestation: 'Zum Beispiel: Carport neben dem Haus, ein Elektroauto, Sicherungskasten im Keller.',
        sicherheit: 'Zum Beispiel: Alarmanlage für ein Einfamilienhaus, zwei Kameras an der Einfahrt.',
        hausgeraet: 'Zum Beispiel: Einbau-Backofen, 60 cm breit.',
        anderes: 'Beschreiben Sie, was gemacht werden soll und wo.',
      },
    },
    dateien: {
      label: 'Pläne oder Fotos',
      hinweis: 'Ein Grundriss, ein Elektroplan oder ein Foto vom Sicherungskasten. Bis zu 5 Dateien, je höchstens 10 MB, Bilder oder PDF.',
      gewaehlt: 'Ausgewählt:',
    },
    name: { label: 'Name' },
    email: { label: 'E-Mail', hinweis: 'Dahin schicken wir das Angebot.' },
    telefon: { label: 'Telefon', hinweis: 'Für Rückfragen ist ein Anruf oft schneller.' },
    einwilligung: {
      text: 'Ich bin einverstanden, dass Electricité Biesen meine Angaben und Dateien zur Bearbeitung meiner Anfrage verwendet. Mehr dazu in der {link}.',
      link: 'Datenschutzerklärung',
    },
    honeypot: 'Dieses Feld bitte leer lassen',
    senden: 'Anfrage senden',
    sendet: 'Anfrage wird gesendet …',
    nichtKonfiguriert: '[FEHLT — PUBLIC_FORM_URL: Adresse der Supabase Edge Function]',
    fehler: {
      zusammenfassung: { one: 'Eine Angabe fehlt noch. Sie ist unten markiert.', other: '{n} Angaben fehlen noch. Sie sind unten markiert.' },
      anliegen: 'Wählen Sie aus, worum es geht.',
      gebaeude: 'Wählen Sie aus, um was für ein Gebäude es geht.',
      geraet: 'Schreiben Sie, welches Gerät Sie suchen.',
      ortschaft: 'Geben Sie die Ortschaft an, zum Beispiel Wiltz.',
      beschreibung: 'Beschreiben Sie in ein paar Sätzen, was gemacht werden soll.',
      name: 'Geben Sie Ihren Namen an.',
      email: 'Geben Sie Ihre E-Mail-Adresse an, damit wir Ihnen das Angebot schicken können.',
      emailFormat: 'Die E-Mail-Adresse ist unvollständig. Sie sieht so aus: name@beispiel.lu',
      einwilligung: 'Setzen Sie das Häkchen, damit wir Ihre Anfrage bearbeiten dürfen.',
      dateien: 'Wählen Sie höchstens 5 Bilder oder PDF mit je höchstens 10 MB.',
      zuVieleDateien: 'Wählen Sie höchstens 5 Dateien aus.',
      dateiZuGross: '„{datei}“ ist größer als 10 MB. Verkleinern Sie die Datei oder schicken Sie sie an {email}.',
      dateiTyp: '„{datei}“ ist weder ein Bild noch ein PDF.',
    },
  },

  /** Seite, die die Edge Function ohne JavaScript bei fehlenden Angaben zeigt */
  serverFehler: {
    titel: 'Es fehlen noch Angaben',
    text: 'Bitte prüfen Sie Ihre Angaben und senden Sie die Anfrage noch einmal. Wir brauchen die Art des Gebäudes (bei Hausgeräten das Gerät), die Ortschaft, eine kurze Beschreibung, Ihren Namen, Ihre E-Mail-Adresse und Ihr Einverständnis. Dateien: höchstens 5 Bilder oder PDF mit je höchstens 10 MB.',
    zuViele: 'Es kamen in kurzer Zeit sehr viele Anfragen von Ihrem Anschluss. Bitte rufen Sie uns an.',
    technisch: 'Die Anfrage konnte nicht gespeichert werden. Bitte rufen Sie uns an oder schreiben Sie an info@biesen.lu.',
  },

  footer: {
    zeitenKurz: 'Telefon und Büro',
    genehmigung: 'Gewerbegenehmigung Nr. {nr}',
    facebook: 'Facebook',
    facebookFehlt: '[FEHLT — Facebook-URL]',
  },

  seo: {
    home: {
      title: 'Elektriker in Nothum, nahe Wiltz | Electricité Biesen',
      description:
        'Electricité Biesen in Nothum: Elektroinstallation für Neubau und Renovierung, Licht, Photovoltaik, Ladestationen und Alarmanlagen. Familienbetrieb, 26 Leute.',
    },
    leistungen: {
      title: 'Alle Leistungen im Überblick, Nothum | Electricité Biesen',
      description:
        'Alle Leistungen von Electricité Biesen in Nothum auf einen Blick: Elektroinstallation, Licht, Photovoltaik, Ladestationen, Alarm, Brandmelder, Hausgeräte.',
    },
    installation: {
      title: 'Elektroinstallation Neubau, Umbau | Electricité Biesen',
      description:
        'Elektrik für Neubau, Fertighaus und Renovierung im Norden Luxemburgs: Verteiler, Leitungen, Steckdosen, Antennen und KNX. Electricité Biesen aus Nothum.',
    },
    licht: {
      title: 'Beleuchtung für Haus, Stall und Halle | Electricité Biesen',
      description:
        'Licht planen und montieren: Wohnräume, Treppen, Gärten, Ställe, Hallen, Straßen und Plätze. Sehen Sie unsere Projekte bei Tag und am Abend. Biesen, Nothum.',
    },
    photovoltaik: {
      title: 'Photovoltaik und Ladestationen, Nothum | Electricité Biesen',
      description:
        'Photovoltaikanlagen für Haus, Hof und Halle und Ladestationen für Elektroautos, geplant und installiert von Electricité Biesen in Nothum, nahe bei Wiltz.',
    },
    sicherheit: {
      title: 'Alarm, Kameras und Brandmelder | Electricité Biesen',
      description:
        'Alarmanlagen, Kameras und Brandmeldeanlagen für Haus und Betrieb, geplant für Ihr Gebäude und installiert von Electricité Biesen aus Nothum im Ösling.',
    },
    hausgeraete: {
      title: 'Hausgeräte AEG, Miele, Liebherr | Electricité Biesen',
      description:
        'Waschmaschinen, Kühlschränke, Backöfen und Küchengeräte von AEG, Miele, Liebherr, Bosch und Siemens bei Electricité Biesen in Nothum. Rufen Sie uns an.',
    },
    projekte: {
      title: 'Projekte: Licht, Neubau und Ställe | Electricité Biesen',
      description:
        'Was wir gebaut haben: Elektrik und Licht in Wohnhäusern, Fertighäusern, Ställen, Hallen und öffentlichen Orten im Norden Luxemburgs, mit Fotos und Ort.',
    },
    ueberUns: {
      title: 'Familienbetrieb mit 26 Leuten in Nothum | Electricité Biesen',
      description:
        'Electricité Biesen ist ein Elektrobetrieb in Familienhand in Nothum in der Stauseegemeinde. Lernen Sie das Team kennen und erfahren Sie, wie wir arbeiten.',
    },
    jobs: {
      title: 'Jobs als Elektriker in Nothum | Electricité Biesen',
      description:
        'Wir suchen Elektromonteure und Hilfsmonteure für Wohn-, Gewerbe- und Industriebau. Unbefristeter Vertrag, Arbeitsort Nothum. So bewerben Sie sich bei uns.',
    },
    kontakt: {
      title: 'Kontakt und Angebot anfragen | Electricité Biesen, Nothum',
      description:
        'Rufen Sie 95 80 99 an oder senden Sie Ihre Anfrage mit Plänen oder Fotos. Electricité Biesen, 14, Duerfstrooss, L-9678 Nothum. Montag bis Freitag erreichbar.',
    },
    danke: {
      title: 'Ihre Anfrage ist angekommen | Electricité Biesen, Nothum',
      description:
        'Danke für Ihre Anfrage an Electricité Biesen in Nothum. Wir lesen sie, schauen uns Ihre Pläne und Fotos an und melden uns. Eilt es, rufen Sie 95 80 99 an.',
    },
    impressum: {
      title: 'Impressum der Electricité Biesen S.A. in Nothum, Ösling',
      description:
        'Impressum der Entreprise d’électricité BIESEN S.A., 14, Duerfstrooss, L-9678 Nothum: Handelsregister B243775, Gewerbegenehmigung 10116411 und Hosting.',
    },
    datenschutz: {
      title: 'Datenschutzerklärung der Electricité Biesen, Nothum',
      description:
        'Welche Daten Electricité Biesen in Nothum verarbeitet, wenn Sie eine Anfrage senden oder sich bewerben, wie lange, und welche Rechte Sie haben. Ohne Cookies.',
    },
    notFound: {
      title: 'Seite nicht gefunden | Electricité Biesen, Nothum',
    },
  },
};

export type Dict = typeof de;
export default de;
