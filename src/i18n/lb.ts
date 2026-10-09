/**
 * Lëtzebuergesch – ENTWURF.
 * Jeder Text in dieser Datei trägt das Flag review: "lb-native" (siehe REVIEW unten),
 * bis er in src/i18n/lb-geprueft.json als geprüft eingetragen ist.
 * `npm run lb-review` schreibt die Liste nach LB-REVIEW.md.
 */
import type { Dict } from './de.ts';

/** Gilt für jeden Schlüssel dieser Datei und für alle lb-Felder in src/content/. */
export const REVIEW = 'lb-native' as const;

const lb: Dict = {
  meta: {
    siteName: 'Electricité Biesen',
    ogAlt: 'Electricité Biesen, Elektrobetrib zu Noutem',
  },

  a11y: {
    skip: 'Direkt bei den Inhalt',
    sprache: 'Sprooch',
    hauptnavigation: 'Haaptnavigatioun',
    pfad: 'Dir sidd hei',
    logo: 'Electricité Biesen, op d’Startsäit',
    menue: 'Menü',
    schliessen: 'Zoumaachen',
    anrufen: 'Uruffen',
    leistungenUntermenue: 'Leeschtungen',
    neuesFenster: '(mécht eng aner Websäit op)',
  },

  nav: {
    home: 'Startsäit',
    leistungen: 'Leeschtungen',
    projekte: 'Projeten',
    ueberUns: 'Iwwer eis',
    jobs: 'Jobs',
    kontakt: 'Kontakt',
    impressum: 'Impressum',
    datenschutz: 'Dateschutz',
  },

  allgemein: {
    angebotAnfragen: 'Offer ufroen',
    oderAnrufen: 'Oder rufft eis un: {tel}',
    telefon: 'Telefon',
    fax: 'Fax',
    email: 'E-Mail',
    adresse: 'Adress',
    fotoFolgt: 'Foto kënnt nach: {motiv}',
    fotopaarFolgt: 'Fotopaar kënnt nach: {motiv}',
    nichtFreigegeben: 'net fräigi',
    projekteFehlen: '[FEHLT — freigegebene Projekte mit Ortschaft, Jahr und Text]',
    passendeProjekte: 'Projeten',
    passendeFragen: 'Heefeg Froen',
  },

  leistungen: {
    installation: {
      name: 'Neibau a Renovatioun',
      text: 'Mir plangen a leeën d’Elektresch fir nei Haiser, och fir Fäerdeghaiser, a bréngen al Installatiounen op den aktuelle Stand: Verdeeler, Leitungen, Steckdousen, Gemeinschaftsantennen a Gebaisteierung mat KNX.',
      link: 'Méi iwwer Neibau a Renovatioun',
    },
    licht: {
      name: 'Liicht',
      text: 'Liicht fir Wunnraim, Trapen a Gäert, fir Ställ an Hallen, fir Stroossen a Plazen. Mir iwwerleeë mat Iech, wou wéi e Liicht higehéiert, a mir montéieren et.',
      link: 'Projeten am Dag an am Owend kucken',
    },
    photovoltaik: {
      name: 'Photovoltaik a Luedstatiounen',
      text: 'Photovoltaikanlage fir den Daach vun Haus, Haff oder Hal, déi sech spéider erweidere loossen. Luedstatioune fir Elektroautoen, doheem oder am Betrib.',
      link: 'Méi iwwer Photovoltaik a Luedstatiounen',
    },
    sicherheit: {
      name: 'Alarm, Kameraen, Brandmelder',
      text: 'Alarmanlagen, Videoiwwerwaachung a Brandmeldeanlagen, ofgestëmmt op Äert Gebai an vun eis installéiert.',
      link: 'Méi iwwer d’Sécherheetstechnik',
    },
    hausgeraete: {
      name: 'Haushaltsapparater',
      text: 'Wäschmaschinnen, Frigoen, Bakuewen a Kichenapparater vun AEG, Miele, Liebherr, Bosch a Siemens. [UNBESTÄTIGT — Ausstellung, Lieferung und Anschluss ergänzen]',
      link: 'Bei d’Haushaltsapparater',
    },
  },

  owend: {
    bildunterschrift: '{ort}, {projekt}. Fotograféiert um {tag} an um {abend} Auer.',
    bildunterschriftFehlt: '[FEHLT — Ortschaft, Projekt in drei bis fünf Wörtern, Uhrzeiten aus den EXIF-Daten]',
    tagZeit: 'Mëttes, {zeit} Auer',
    abendZeit: 'Owes, {zeit} Auer',
    regler: 'Vum Dag bis an den Owend',
    reglerTag: 'Dag',
    reglerAbend: 'Owend',
    reglerUebergang: 'Iwwergank, {wert} Prozent',
    testTag: 'Test Dag',
    testAbend: 'Test Owend',
    motivStartseite: 'Wunnhaus mat Liicht dobaussen an am Gaart',
  },

  home: {
    h1: 'Stroum a Liicht fir Haus, Haff a Betrib',
    lead: 'Mir sinn en Elektrobetrib mat 26 Leit zu Noutem, an der Stauséigemeng. Mir leeën d’Elektresch an neien an alen Haiser, a Ställ an Hallen a montéieren Liicht, Photovoltaik a Luedstatiounen.',
    leistungenH2: 'Wat mir maachen',
    projekteH2: 'Wou mir geschafft hunn',
    alleProjekte: 'All d’Projeten',
    teamH2: '26 Leit zu Noutem',
    team: 'Electricité Biesen ass e Familljebetrib. 26 Leit schaffe bei eis, op de Chantieren an am Büro. Wann Dir urufft, kritt Dir een um Telefon, deen Iech weiderhëlleft.',
    teamLeitung: '[UNBESTÄTIGT — Leitung und Ansprechpartner mit Rollen, siehe B3]',
    teamFoto: 'Equipefoto',
    jobs: 'Mir sichen Monteurinnen a Monteuren.',
    jobsLink: 'Fräi Plazen',
    faqH2: 'Heefeg Froen',
    kontaktH2: 'Uruffen oder schreiwen',
    schreiben: 'Oder schreift eis op {email}. {adresse}.',
  },

  zeiten: {
    titel: 'Telefon- a Bürosstonnen',
    tage: {
      mo: 'Méindeg',
      di: 'Dënschdeg',
      mi: 'Mëttwoch',
      do: 'Donneschdeg',
      fr: 'Freideg',
      sa: 'Samschdeg',
      so: 'Sonndeg',
    },
    tageKurz: { mo: 'Mé', di: 'Dë', mi: 'Më', do: 'Do', fr: 'Fr', sa: 'Sa', so: 'So' },
    spanne: '{von} bis {bis}',
    paar: '{a} an {b}',
    geschlossen: 'zou',
    unbestaetigt: '[UNBESTÄTIGT — 08:00–12:00 und 13:30–16:30 laut heutiger Website, 07:30–16:30 durchgehend laut Google und Editus]',
    unbestaetigtKurz: '[UNBESTÄTIGT — Zeiten]',
    naechste: 'Zou un dësen Deeg:',
    tagSpalte: 'Dag',
    zeitSpalte: 'Zäiten',
  },

  faq: {
    gebiet: {
      q: 'A wéi enge Plaze schafft Dir?',
      a: 'Eise Betrib ass zu Noutem an der Stauséigemeng. Mir schaffe virun allem am Norde vum Land. [UNBESTÄTIGT — Einsatzgebiet und zwei bis drei Ortsbeispiele] Wunnt Dir méi wäit ewech, rufft eis un: {tel}.',
    },
    angebot: {
      q: 'Wat braucht Dir fir eng Offer?',
      a: 'Den Uert, wat gemaach soll ginn, a wéini. Pläng oder Fotoe hëllefe vill: e Grondrëss, en Elektroplang oder e Foto vum Sécherungskaschten. Dir kënnt alles am {formular} eroplueden.',
      formular: 'Ufroformulaire',
    },
    kostenlos: {
      q: 'Ass d’Offer gratis?',
      a: 'Jo. [UNBESTÄTIGT — so steht es auf der heutigen Website; auch für einen Termin vor Ort?]',
    },
    fertighaus: {
      q: 'Leet Dir och d’Elektresch a Fäerdeghaiser?',
      a: 'Jo. Mir schaffen och fir Bauhären, déi e Fäerdeghaus bauen, a mir stëmmen eis mam Hiersteller of.',
    },
    ladestation: {
      q: 'Kann ech doheem eng Luedstatioun fir mäin Elektroauto kréien?',
      a: 'Dat iwwerpréife mir fir Ärt Haus: ob den Haususchloss an de Verdeeler d’Leeschtung droen, wéi de Kabel bei de Parkplaz kënnt an ob d’Statioun sech mat enger Photovoltaikanlag verbanne léisst. Duerno kritt Dir eng Offer. [UNBESTÄTIGT — Meldung beim Netzbetreiber durch Biesen?]',
    },
    zuschuesse: {
      q: 'Gëtt et Subside fir Photovoltaik oder Luedstatiounen?',
      a: 'De Staat fërdert béides iwwer de Programm Klimabonus. D’Konditiounen an d’Montante änneren sech; den aktuelle Stand fannt Dir op {klimabonus}. [UNBESTÄTIGT — Stand vor Livegang prüfen; hilft Biesen beim Antrag?]',
    },
    hausgeraete: {
      q: 'Verkaaft Dir Haushaltsapparater? Kann ech se mir ukucken?',
      a: 'Mir verkafen Apparater vun AEG, Miele, Liebherr, Bosch a Siemens. [FEHLT — Ausstellung, Lieferung, Anschluss]',
    },
    sprachen: {
      q: 'A wéi enge Sprooche kann ech mat Iech schwätzen?',
      a: 'Lëtzebuergesch, Franséisch an Däitsch. [UNBESTÄTIGT — auch Portugiesisch und Englisch?]',
    },
  },

  seiten: {
    installation: {
      h1: 'Elektresch fir Neibau a Renovatioun',
      intro: 'Ob Dir nei baut, e Fäerdeghaus opstelle loosst oder en aalt Haus ëmbaut: Mir plangen d’Elektresch mat Iech, leeën se a setzen se a Betrib.',
      wasH2: 'Wat mir maachen',
      was: [
        'Elektroplang a Steckdouseplang',
        'Verdeeler a Leitungen',
        'Schalter, Steckdousen, Uschlëss',
        'Gemeinschaftsantennen a Residenzen',
        'Gebaisteierung mat KNX',
        'Iwwerpréiwung an Erneierung vun alen Installatiounen',
      ],
      fertighausH2: 'Fir Fäerdeghaiser',
      fertighaus: 'Mir leeën d’Elektresch och a Fäerdeghaiser a stëmmen eis mam Hiersteller of. [UNBESTÄTIGT — Ablauf, Herstellernamen]',
      renovierungH2: 'Renovatioun an Ëmbau',
      renovierung: 'Mir iwwerpréiwe bestoend Installatiounen, erneieren se a bréngen se op den aktuelle Stand. Fir en éischt Gespréich hëlleft e Foto vum Sécherungskaschten.',
      anliegenRenovierung: 'Offer fir eng Renovatioun ufroen',
      ablaufH2: 'Esou leeft en Neibau of',
      ablauf: [
        'Dir schéckt eis Är Pläng.',
        'Mir schwätze mat Iech of, wou Steckdousen, Schalter a Liicht hikommen.',
        'Rouinstallatioun am Rohbau.',
        'Feininstallatioun nom Verputzen.',
        'Inbetribnam an Iwwerpréiwung.',
      ],
      ablaufHinweis: '[UNBESTÄTIGT — Ablauf vom Kunden bestätigen lassen, ebenso wer den Netzanschluss beim Netzbetreiber beantragt]',
      fotoMotiv: 'Moduler vun engem Fäerdeghaus an der Atelierhal',
    },
    licht: {
      h1: 'Liicht fir Haus, Haff, Hal a Strooss',
      intro: 'Beweegt de Regler ënnert de Fotoen: Dir gesitt datselwecht Projet mëttes an owes.',
      paareH2: 'Am Dag an am Owend',
      bereicheH2: 'Wou mir Liicht maachen',
      bereiche: {
        innen: {
          h: 'Wunnraim an Trapen',
          text: 'Liichtprofiller mat LED a Wunnraim a Liicht fir Trapen. Mir iwwerleeë mat Iech, wou d’Liicht hifält a wéi Dir et schalt.',
        },
        aussen: {
          h: 'Dobaussen an am Gaart',
          text: 'Liicht fir Fassad, Weeër a Gaart, zum Beispill Pollerluuchten um Wee. Esou fannt Dir an Är Gäscht owes sécher bei d’Dier.',
        },
        landwirtschaft: {
          h: 'Landwirtschaft',
          text: 'Liicht fir Ställ, zum Beispill LED-Beliichtung an engem Mëllechkéistall. Mir plange mat Iech, wou d’Luuchten hänken, a montéieren se.',
        },
        hallen: {
          h: 'Hallen a Betriber',
          text: 'Liicht fir grouss Hallen, Atelieren an Empfangsberäicher. Mir plangen d’Beliichtung esou, datt een do gutt schaffe kann.',
        },
        oeffentlich: {
          h: 'Stroossen a Plazen',
          text: 'Beliichtung fir Stroossen, Plazen an ëffentlech Plazen. [UNBESTÄTIGT — Referenzen, Auftraggeber]',
        },
        besonders: {
          h: 'Besonnesch Plazen',
          text: 'Verschidde Plaze brauchen hiert eegent Liicht, zum Beispill e Stollen mat engem Portal aus Lee. [UNBESTÄTIGT — welcher Stollen, darf er gezeigt werden]',
        },
      },
    },
    photovoltaik: {
      h1: 'Photovoltaik a Luedstatiounen',
      intro: 'Mir baue Photovoltaikanlage fir Wunnhaiser, Haff a Betriber an installéiere Luedstatioune fir Elektroautoen. Béides léisst sech verbannen, sou datt Ären Auto mam Stroum vum eegenen Daach lued. [UNBESTÄTIGT — bietet Biesen diese Kopplung an?]',
      wasH2: 'Wat mir maachen',
      was: [
        'Photovoltaikanlage fir den Daach vun Haus, Haff oder Hal',
        'Anlagen, déi sech spéider erweidere loossen',
        'Luedstatioune fir Elektroautoen, doheem oder am Betrib',
      ],
      pruefenH2: 'Wat mir iwwerpréiwen, ier Dir eng Offer kritt',
      pruefen: ['Daachfläch an Ausriichtung', 'Haususchloss a Verdeeler', 'Wee vum Verdeeler bis bei d’Parkplaz'],
      foerderungH2: 'Subsiden',
      foerderung: 'De Staat fërdert Photovoltaik a Luedstatiounen iwwer de Programm Klimabonus. Méi dozou ënnen an den heefege Froen.',
      fotoMotiv: 'Photovoltaikanlag oder Luedstatioun',
      anliegenLadestation: 'Offer fir eng Luedstatioun ufroen',
    },
    sicherheit: {
      h1: 'Alarm, Kameraen a Brandmelder',
      intro: 'Mir plangen Alarmanlagen, Videoiwwerwaachung a Brandmeldeanlage fir Äert Gebai an installéieren se. Fir Wunnhaiser a fir Betriber.',
      wasH2: 'Wat mir maachen',
      was: ['Alarmanlagen', 'Videoiwwerwaachung', 'Brandmeldeanlagen'],
      kameraH2: 'Hiweis zur Videoiwwerwaachung',
      kamera: 'Kamerae däerfen nëmmen Ärt eegent Terrain filmen. [UNBESTÄTIGT — Formulierung mit Kunde abstimmen; Verweis auf die CNPD]',
    },
    hausgeraete: {
      h1: 'Haushaltsapparater vun AEG, Miele, Liebherr, Bosch a Siemens',
      intro: '[FEHLT — Ausstellung, Beratung, Lieferung, Anschluss, Reparatur]',
      wasH2: 'Wat mir verkafen',
      was: ['Wäschmaschinnen', 'Frigoen', 'Bakuewen', 'Kichenapparater'],
      marken: 'Marken: AEG, Miele, Liebherr, Bosch a Siemens.',
      online: 'Mir verkafen net online. Präisser a Verfügbarkeet erfuert Dir um Telefon: {tel}.',
    },
    projekte: {
      h1: 'Projeten: Liicht, Neibau, Ställ an Hallen',
      intro: 'Wat mir gebaut a beliicht hunn, mat Uertschaft a Joer. Bei e puer Projete gesitt Dir datselwecht Motiv mëttes an owes.',
      sprung: 'Spréngen op',
      jahr: 'Joer',
      jahrFehlt: '[FEHLT — Jahr]',
      ortFehlt: '[FEHLT — Ortschaft]',
      textFehlt: '[FEHLT — zwei bis vier Sätze zum Projekt]',
    },
    ueberUns: {
      h1: 'E Familljebetrib zu Noutem',
      intro: 'Electricité Biesen ass e Familljebetrib. 26 Leit schaffe bei eis, op de Chantieren an am Büro. Wann Dir urufft, kritt Dir een um Telefon, deen Iech weiderhëlleft.',
      leitungH2: 'Leedung an Uspriechpartner',
      leitung: '[UNBESTÄTIGT — Leitung und Ansprechpartner mit Rollen, siehe B3]',
      geschichteH2: 'Geschicht',
      geschichte: '[FEHLT — freigegebener Absatz zur Geschichte, siehe B4]',
      spracheH2: 'Sproochen',
      sprache: 'An der Equipe schwätze mir Franséisch an Däitsch, vill och Lëtzebuergesch oder Portugisesch. [UNBESTÄTIGT — welche Sprachen Kunden angeboten werden]',
      mitgliedH2: 'Memberschaften a Labelen',
      mitglied: ['Fédération des Artisans', 'FGT', 'KNX', 'SuperDrecksKëscht', 'Made in Luxembourg', 'Mir bilden aus'],
      mitgliedHinweis: '[UNBESTÄTIGT — Mitgliedschaften und Labels aktuell?]',
      ortH2: 'Wou Dir eis fannt',
      ort: 'Eise Betrib ass zu Noutem, an der Stauséigemeng, ongeféier 8 km vu Wolz.',
      karte: 'Op OpenStreetMap kucken',
      jobsH2: 'Bei eis schaffen',
    },
    jobs: {
      h1: 'Jobs bei Electricité Biesen zu Noutem',
      intro: 'Mir schaffen a Wunnhaiser, Betriber, Hallen a Ställ am Norde vum Land. Mir sichen Leit, déi mat upaken. Aarbechtsplaz ass Noutem.',
      offenH2: 'Fräi Plazen',
      keine: 'Am Moment hu mir keng fräi Plaz. Eng Bewerbung kënnt Dir eis trotzdem schécken: {email}.',
      lehre: '[UNBESTÄTIGT — Lehrstellen]',
      bewerbenH2: 'Esou bewerbt Dir Iech',
      bewerben: 'Schéckt Äre Liewenslaf an e puer Sätz iwwer Iech op {email}. Oder rufft eis un: {tel}.',
    },
    job: {
      aufgabenH2: 'Är Aufgaben',
      profilH2: 'Äre Profil',
      angebotH2: 'Wat mir bidden',
      vertragH2: 'Kontrakt',
      bewerbenH2: 'Esou bewerbt Dir Iech',
      bewerben: 'Schéckt Äre Liewenslaf an e puer Sätz iwwer Iech op {email}. Oder rufft eis un: {tel}.',
      mailBetreff: 'Bewerbung: {titel}',
      mailLink: 'E-Mail schreiwen',
      arbeitsort: 'Aarbechtsplaz',
      beginn: 'Ufank',
      beginnText: 'no Ofsprooch',
      vertragsart: 'Kontrakt',
      unbefristet: 'onbefrist (CDI)',
      arbeitszeit: 'Aarbechtszäit',
      vollzeit: 'Vollzäit',
      teilzeit: 'Deelzäit',
      arbeitszeitFehlt: '[UNBESTÄTIGT — Vollzeit?]',
      veroeffentlicht: 'Verëffentlecht den {datum}',
      veroeffentlichtFehlt: '[FEHLT — Datum der Veröffentlichung]',
      gueltig: 'Bewerbunge bis den {datum}',
      gueltigFehlt: '[FEHLT — Bewerbungsfrist]',
      alleJobs: 'All déi fräi Plazen',
    },
    kontakt: {
      h1: 'Offer ufroen',
      intro: 'Wat Dir méi genee beschreift, ëm wat et geet, wat Dir méi séier eng Offer kritt. Pläng oder Fotoen hëllefen am meeschten.',
      direktH2: 'Uruffen oder schreiwen',
      anfahrt: 'Wee op OpenStreetMap',
      ablaufH2: 'Wat nom Schécke geschitt',
    },
    danke: {
      h1: 'Är Ufro ass ukomm',
      text: 'Mir mellen eis [FEHLT — Antwortzeit beim Kunden erfragen]. Ass et dréngend, rufft eis un: {tel}.',
      ablaufH2: 'Esou geet et weider',
      ablauf: [
        'Mir liesen Är Ufro a kucken eis Är Pläng a Fotoen un.',
        'Wann eppes feelt, rufe mir Iech un oder schreiwen Iech.',
        'Dir kritt eng Offer, bei gréissere Projeten no engem Rendez-vous op der Plaz.',
      ],
      ablaufHinweis: '[UNBESTÄTIGT — Ablauf]',
      zurueck: 'Op d’Startsäit',
    },
    nichtGefunden: {
      h1: 'Dës Säit gëtt et net (méi)',
      text: 'Vläicht hëlleft Iech eng vun dëse Säite weider:',
      telefon: 'Oder rufft eis un: {tel}',
    },
    impressum: {
      h1: 'Impressum',
      herausgeberH2: 'Erausgeber vun der Websäit',
      firma: 'Firmennumm',
      rechtsform: 'Rechtsform',
      rechtsformWert: 'Société anonyme (S.A.)',
      sitz: 'Sëtz',
      land: 'Lëtzebuerg',
      rcs: 'Handelsregister',
      mwst: 'TVA-Nummer',
      mwstHinweis: '[UNBESTÄTIGT — vor Livegang in VIES prüfen]',
      vertretung: 'Vertriedung vun der Gesellschaft',
      vertretungFehlt: '[FEHLT — Verwaltungsrat bzw. administrateur-délégué]',
      verantwortlich: 'Responsabel fir den Inhalt',
      verantwortlichFehlt: '[FEHLT — Name]',
      genehmigungH2: 'Geweerbegenehmegung',
      genehmigung: 'Autorisation d’établissement Nr. {nr}, ausgestallt den {datum}, fir dës Aktivitéiten:',
      taetigkeiten: ['10116411/0: Elektriker (électricien)', '10116411/1: Handelsaktivitéiten a Servicer (activités et services commerciaux)'],
      leitung: 'Technesch Leedung: [UNBESTÄTIGT — Nennung des Namens laut Gewerbegenehmigung freigeben]',
      hostingH2: 'Hosting',
      hosting: 'D’Websäit gëtt vu GitHub Pages gehost, engem Service vun der GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Vereenegt Staaten.',
      inhaltH2: 'Inhalt',
      inhalt: 'D’Informatiounen op dëser Websäit sinn onverbindlech. Verbindlech ass just eis schrëftlech Offer.',
      fotosH2: 'Fotoen',
      fotos: 'All d’Fotoe weise Projete vun Electricité Biesen. [FEHLT — Name des Fotografen nach dem Shooting]',
      schriftH2: 'Schrëft',
      schrift: 'Schibsted Grotesk vu Bakken & Bæck an Henrik Kongsvoll, SIL Open Font License 1.1.',
    },
    datenschutz: {
      h1: 'Dateschutzerklärung',
      intro: 'Mir veraarbechten Är Donnéeën nëmmen, fir Är Ufro oder Bewerbung ze beäntweren. Dës Websäit setzt keng Cookien, notzt keng Analyse- oder Reklammendéngschter a lued keng Inhalter vun anere Serveren.',
      verantwortlichH2: 'Responsabel',
      verantwortlich: 'Entreprise d’électricité BIESEN S.A., 14, Duerfstrooss, L-9678 Nothum, Lëtzebuerg. Telefon +352 95 80 99, {email}.',
      formularH2: 'Ufroformulaire',
      formular: 'Wann Dir den Ufroformulaire schéckt, kréie mir d’Informatiounen, déi Dir aginn: ëm wat et geet, d’Zort vu Gebai, d’Uertschaft, Är Beschreiwung, Ären Numm, Är E-Mail-Adress, wann Dir wëllt Är Telefonsnummer, an d’Pläng oder Fotoen, déi Dir eropluet. Mir notzen se, fir Är Ufro ze bearbechten an Iech eng Offer ze schreiwen.',
      rechtsgrundlage: 'Rechtsgrondlag ass Är Zoustëmmung (Art. 6 Par. 1 Bst. a DSGVO) an d’Virbereedung vun engem Kontrakt op Är Ufro (Art. 6 Par. 1 Bst. b DSGVO). Dir kënnt Är Zoustëmmung all Moment per E-Mail oder Telefon zréckzéien.',
      speicherung: 'Är Ufro an Är Fichiere ginn bei Supabase an engem Rechenzentrum an der Europäescher Unioun gespäichert. D’Fichiere leien an engem private Späicher; an der E-Mail un eise Büro stinn nëmmen Linken, déi no enger gewësser Zäit oflafen. D’E-Mail verschéckt [UNBESTÄTIGT — EU-Mailanbieter, mit Nave klären].',
      loeschung: 'Gëtt aus Ärer Ufro keen Optrag, läsche mir Ufro a Fichieren no [FEHLT — Löschfrist mit dem Kunden festlegen, Vorschlag: 6 Monaten]. Ënnerlage fir en Optrag halen mir esou laang op, wéi d’Gesetz et verlaangt.',
      missbrauch: 'Fir Mëssbrauch ze begrenzen, späichere mir 24 Stonnen e verschlësselte Préifwäert (Hash) vun Ärer IP-Adress. Doraus léisst sech Är Adress net zréckrechnen.',
      kontaktH2: 'E-Mail, Telefon a Bewerbungen',
      kontakt: 'Wann Dir eis urufft, eis eng E-Mail schreift oder Iech per E-Mail bewerbt, veraarbechte mir Är Informatiounen, fir Iech z’äntweren oder Är Bewerbung ze préiwen. Bewerbungsënnerlage läsche mir, wann d’Plaz besat ass, ausser Dir sidd domat averstanen, datt mir se méi laang halen. [UNBESTÄTIGT — Frist für Bewerbungen]',
      hostingH2: 'Hosting a Server-Logdateien',
      hosting: 'D’Websäit gëtt vu GitHub Pages (GitHub, Inc., Vereenegt Staaten) ausgeliwwert. Bei all Opruff veraarbecht GitHub Är IP-Adress an technesch Informatioune wéi Browser an Auerzäit, fir d’Säiten auszeliwweren an d’Sécherheet ze garantéieren. GitHub ass nom EU-US-Dateschutzkader (Data Privacy Framework) zertifizéiert. Rechtsgrondlag ass eist berechtegt Interessi un enger sécherer an erreechbarer Websäit (Art. 6 Par. 1 Bst. f DSGVO).',
      dienstleisterH2: 'Wien an eisem Optrag Donnéeë veraarbecht',
      dienstleister: [
        'GitHub, Inc. (Vereenegt Staaten): Hosting vun der Websäit',
        'Supabase, Inc.: Späichere vun den Ufroen a Fichieren, Rechenzentrum an der Europäescher Unioun',
        'E-Mail-Versand: [UNBESTÄTIGT — EU-Mailanbieter, mit Nave klären]',
      ],
      linksH2: 'Linken op aner Déngschter',
      links: 'Schrëften a Biller leien op eisem eegene Server. Linken op OpenStreetMap, Facebook, Editus oder klimabonus.lu maachen aner Websäiten eréischt op, wann Dir drop klickt. Do gëllen d’Dateschutzreegele vun dësen Ubidder.',
      rechteH2: 'Är Rechter',
      rechte: 'Dir kënnt Auskunft iwwer Är Donnéeë froen, hir Korrektur, Läschung oder d’Aschränkung vun der Veraarbechtung, Dir kënnt der Veraarbechtung widderspriechen an Är Donnéeë mathuelen. Schreift eis op {email}. Dir kënnt Iech och bei der Nationaler Kommissioun fir den Dateschutz (CNPD) beschwéieren: 15, boulevard du Jazz, L-4370 Belvaux, {cnpd}.',
      stand: 'Stand: {datum}',
    },
  },

  arten: {
    neubau: 'Neibau',
    renovierung: 'Renovatioun',
    'licht-innen': 'Liicht dobannen',
    'licht-aussen': 'Liicht dobaussen',
    landwirtschaft: 'Landwirtschaft',
    halle: 'Hallen a Betriber',
    oeffentlich: 'Stroossen a Plazen',
    photovoltaik: 'Photovoltaik',
    ladestation: 'Luedstatiounen',
    sicherheit: 'Sécherheetstechnik',
    besonders: 'Besonnesch Plazen',
  },

  formular: {
    pflicht: 'Pflichtfeld',
    freiwillig: 'fräiwëlleg',
    hinweisPflicht: 'Felder mam Zousaz „fräiwëlleg“ kënnt Dir eidel loossen. All déi aner brauche mir fir d’Offer.',
    anliegen: {
      legende: 'Ëm wat geet et?',
      optionen: {
        neubau: 'Neibau',
        renovierung: 'Renovatioun oder Ëmbau',
        licht: 'Liicht',
        photovoltaik: 'Photovoltaik',
        ladestation: 'Luedstatioun',
        sicherheit: 'Alarm, Kamera oder Brandmelder',
        hausgeraet: 'Haushaltsapparat',
        anderes: 'Eppes anescht',
      },
    },
    gebaeude: {
      legende: 'Wat fir e Gebai?',
      hinweis: 'Net néideg bei Haushaltsapparater.',
      optionen: {
        haus: 'Haus',
        wohnung: 'Appartement',
        betrieb: 'Betrib oder Hal',
        landwirtschaft: 'Landwirtschaft',
        oeffentlich: 'Gemeng oder ëffentlecht Gebai',
      },
    },
    nurNeubau: 'Just bei engem Neibau',
    fertighaus: {
      legende: 'Baut Dir e Fäerdeghaus?',
      optionen: { ja: 'Jo', nein: 'Neen', offen: 'Weess ech nach net' },
    },
    nurLadestation: 'Just bei enger Luedstatioun',
    abstand: {
      legende: 'Wéi wäit ass de Parkplaz vum Sécherungskaschten ewech?',
      optionen: { unter10: 'manner wéi 10 m', bis25: '10 bis 25 m', ueber25: 'méi wéi 25 m', unbekannt: 'weess ech net' },
    },
    pv: {
      legende: 'Hutt Dir eng Photovoltaikanlag?',
      optionen: { ja: 'Jo', nein: 'Neen', geplant: 'Geplangt' },
    },
    nurHausgeraet: 'Just bei engem Haushaltsapparat',
    geraet: { label: 'Wéi en Apparat sicht Dir?' },
    ortschaft: { label: 'Uertschaft', hinweis: 'Esou wësse mir, wien a Ärer Géigend ass.' },
    start: {
      label: 'Wéini soll et lassgoen?',
      leer: 'Wielt w.e.g.',
      optionen: { bald: 'Esou séier wéi méiglech', dreiMonate: 'An den nächsten dräi Méint', spaeter: 'Méi spéit, mir plangen nach' },
    },
    beschreibung: {
      label: 'Beschreiwung',
      hinweise: {
        standard: 'Zum Beispill: aalt Haus vun 1975, Kichen a Buedzëmmer nei, Verdeeler erneieren.',
        neubau: 'Zum Beispill: Eefamilljenhaus mat Keller, Baubegin am Fréijoer, Pläng vum Architekt.',
        renovierung: 'Zum Beispill: aalt Haus vun 1975, Kichen a Buedzëmmer nei, Verdeeler erneieren.',
        licht: 'Zum Beispill: Gaart mat Wee bis bei d’Hausdier, Pollerluuchten a Liicht un der Fassad.',
        photovoltaik: 'Zum Beispill: Saddeldaach no Süden, ongeféier 60 m², d’Anlag soll spéider erweiderbar sinn.',
        ladestation: 'Zum Beispill: Carport nieft dem Haus, een Elektroauto, Sécherungskaschten am Keller.',
        sicherheit: 'Zum Beispill: Alarmanlag fir en Eefamilljenhaus, zwou Kameraen un der Afaart.',
        hausgeraet: 'Zum Beispill: Abau-Bakuewen, 60 cm breet.',
        anderes: 'Beschreift, wat gemaach soll ginn a wou.',
      },
    },
    dateien: {
      label: 'Pläng oder Fotoen',
      hinweis: 'E Grondrëss, en Elektroplang oder e Foto vum Sécherungskaschten. Bis zu 5 Fichieren, all héchstens 10 MB, Biller oder PDF.',
      gewaehlt: 'Erausgesicht:',
    },
    name: { label: 'Numm' },
    email: { label: 'E-Mail', hinweis: 'Dohi schécke mir d’Offer.' },
    telefon: { label: 'Telefon', hinweis: 'Fir Récksfroen ass en Uruff dacks méi séier.' },
    einwilligung: {
      text: 'Ech sinn domat averstanen, datt Electricité Biesen meng Informatiounen a Fichiere benotzt, fir meng Ufro ze bearbechten. Méi dozou an der {link}.',
      link: 'Dateschutzerklärung',
    },
    honeypot: 'Dëst Feld w.e.g. eidel loossen',
    senden: 'Ufro schécken',
    sendet: 'Ufro gëtt geschéckt …',
    nichtKonfiguriert: '[FEHLT — PUBLIC_FORM_URL: Adresse der Supabase Edge Function]',
    fehler: {
      zusammenfassung: { one: 'Eng Informatioun feelt nach. Si ass ënne markéiert.', other: '{n} Informatioune feelen nach. Si sinn ënne markéiert.' },
      anliegen: 'Wielt aus, ëm wat et geet.',
      gebaeude: 'Wielt aus, ëm wat fir e Gebai et geet.',
      geraet: 'Schreift, wéi en Apparat Dir sicht.',
      ortschaft: 'Gitt d’Uertschaft un, zum Beispill Wolz.',
      beschreibung: 'Beschreift an e puer Sätz, wat gemaach soll ginn.',
      name: 'Gitt Ären Numm un.',
      email: 'Gitt Är E-Mail-Adress un, fir datt mir Iech d’Offer schécke kënnen.',
      emailFormat: 'D’E-Mail-Adress ass net komplett. Si gesäit esou aus: numm@beispill.lu',
      einwilligung: 'Setzt den Haken, fir datt mir Är Ufro bearbechten däerfen.',
      dateien: 'Wielt héchstens 5 Biller oder PDF mat all héchstens 10 MB aus.',
      zuVieleDateien: 'Wielt héchstens 5 Fichieren aus.',
      dateiZuGross: '„{datei}“ ass méi grouss wéi 10 MB. Maacht de Fichier méi kleng oder schéckt en op {email}.',
      dateiTyp: '„{datei}“ ass weder e Bild nach e PDF.',
    },
  },

  serverFehler: {
    titel: 'Et feelen nach Informatiounen',
    text: 'Iwwerpréift w.e.g. Är Informatiounen a schéckt d’Ufro nach eng Kéier. Mir brauchen d’Zort vu Gebai (bei Haushaltsapparater den Apparat), d’Uertschaft, eng kuerz Beschreiwung, Ären Numm, Är E-Mail-Adress an Är Zoustëmmung. Fichieren: héchstens 5 Biller oder PDF mat all héchstens 10 MB.',
    zuViele: 'Vun Ärem Uschloss koumen a kuerzer Zäit ganz vill Ufroen. Rufft eis w.e.g. un.',
    technisch: 'D’Ufro konnt net gespäichert ginn. Rufft eis w.e.g. un oder schreift op info@biesen.lu.',
  },

  footer: {
    zeitenKurz: 'Telefon a Büro',
    genehmigung: 'Geweerbegenehmegung Nr. {nr}',
    facebook: 'Facebook',
    facebookFehlt: '[FEHLT — Facebook-URL]',
  },

  seo: {
    home: {
      title: 'Elektriker zu Noutem, bei Wolz | Electricité Biesen',
      description:
        'Electricité Biesen zu Noutem: Elektroinstallatioun fir Neibau a Renovatioun, Liicht, Photovoltaik, Luedstatiounen an Alarmanlagen. Familljebetrib, 26 Leit.',
    },
    installation: {
      title: 'Elektroinstallatioun Neibau, Ëmbau | Electricité Biesen',
      description:
        'Elektresch fir Neibau, Fäerdeghaus a Renovatioun am Éislek an am Norden: Verdeeler, Leitungen, Steckdousen, Antennen a KNX. Electricité Biesen vu Noutem.',
    },
    licht: {
      title: 'Liicht fir Haus, Stall an Hal, Noutem | Electricité Biesen',
      description:
        'Liicht plangen a montéieren: Wunnraim, Trapen, Gäert, Ställ, Hallen, Stroossen a Plazen. Kuckt eis Projeten am Dag an am Owend. Electricité Biesen, Noutem.',
    },
    photovoltaik: {
      title: 'Photovoltaik a Luedstatioun, Noutem | Electricité Biesen',
      description:
        'Photovoltaikanlage fir Haus, Haff an Hal a Luedstatioune fir Elektroautoen, geplangt an installéiert vun Electricité Biesen zu Noutem, ganz no bei Wolz.',
    },
    sicherheit: {
      title: 'Alarm, Kameraen a Brandmelder | Electricité Biesen',
      description:
        'Alarmanlagen, Iwwerwaachungskameraen a Brandmeldeanlage fir Haus a Betrib, geplangt fir Äert Gebai an installéiert vun Electricité Biesen vu Noutem am Éislek.',
    },
    hausgeraete: {
      title: 'Haushaltsapparater AEG, Miele, Bosch | Electricité Biesen',
      description:
        'Wäschmaschinnen, Frigoen, Bakuewen a Kichenapparater vun AEG, Miele, Liebherr, Bosch a Siemens bei Electricité Biesen zu Noutem. Rufft eis un: 95 80 99.',
    },
    projekte: {
      title: 'Projeten: Liicht, Neibau a Ställ | Electricité Biesen',
      description:
        'Wat mir gebaut hunn: Elektresch a Liicht a Wunnhaiser, Fäerdeghaiser, Ställ, Hallen an ëffentleche Plazen am Norde vu Lëtzebuerg, mat Fotoen an Uertschaft.',
    },
    ueberUns: {
      title: 'Familljebetrib mat 26 Leit zu Noutem | Electricité Biesen',
      description:
        'Electricité Biesen ass en Elektrobetrib a Familljenhand zu Noutem an der Stauséigemeng. Léiert d’Equipe kennen a gesitt, wéi mir schaffen. Rufft eis gär un.',
    },
    jobs: {
      title: 'Jobs als Elektriker zu Noutem | Electricité Biesen',
      description:
        'Mir sichen Elektromonteuren an Hëllefsmonteuren fir Wunn-, Geschäfts- an Industriebau. Onbefristte Kontrakt, Aarbechtsplaz Noutem. Esou bewerbt Dir Iech.',
    },
    kontakt: {
      title: 'Kontakt an Offer ufroen | Electricité Biesen, Noutem',
      description:
        'Rufft 95 80 99 un oder schéckt Är Ufro mat Pläng oder Fotoen. Electricité Biesen, 14, Duerfstrooss, L-9678 Nothum. Mir sinn Méindes bis Freides fir Iech do.',
    },
    danke: {
      title: 'Merci, Är Ufro ass ukomm | Electricité Biesen, Noutem',
      description:
        'Merci fir Är Ufro un Electricité Biesen zu Noutem. Mir liesen se, kucken eis Är Pläng a Fotoen un a mellen eis. Ass et dréngend, rufft eis um 95 80 99 un.',
    },
    impressum: {
      title: 'Impressum vun der Electricité Biesen S.A. zu Noutem',
      description:
        'Impressum vun der Entreprise d’électricité BIESEN S.A., 14, Duerfstrooss, L-9678 Nothum: Handelsregister B243775, Geweerbegenehmegung 10116411, Hosting.',
    },
    datenschutz: {
      title: 'Dateschutzerklärung vun Electricité Biesen, Noutem',
      description:
        'Wéi eng Donnéeën Electricité Biesen zu Noutem veraarbecht, wann Dir eng Ufro schéckt oder Iech bewerbt, wéi laang, a wéi eng Rechter Dir hutt. Ouni Cookien.',
    },
    notFound: {
      title: 'Säit net fonnt | Electricité Biesen, Noutem',
    },
  },
};

export default lb;
