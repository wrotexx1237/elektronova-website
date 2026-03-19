export interface LocationSection {
  title: string;
  content: string;
}

export interface InstallationExample {
  title: string;
  description: string;
  image: string;
}

export interface LocationContent {
  slug: string;
  city: string;
  title: string;
  description: string;
  intro: string;
  sections: LocationSection[];
  installationExamples: InstallationExample[];
  servicesOffered: string[];
  localBenefits: string[];
  neighborhoods: string[];
}

export const locations: {
  sq: Record<string, LocationContent>;
  en: Record<string, LocationContent>;
} = {
  sq: {
    'peje': {
      slug: 'peje',
      city: 'Pejë',
      title: 'Elektricist në Pejë – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Shërbime profesionale elektrike në Pejë. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'ElektroNova ofron zgjidhjet më të mira elektrike në qytetin e Pejës dhe rrethinë. Me një ekip profesionist me përvojë mbi 10-vjeçare, ne garantojmë cilësi dhe siguri maksimale për çdo projekt.',
      sections: [
        {
          title: 'Zgjidhje Profesionale për Shtëpinë tuaj',
          content: 'Ne kujdesemi që rrjeti juaj elektrik në Pejë të jetë i sigurt dhe efikas. Nga riparimet e vogla deri te instalimet e plota në ndërtesa të reja, ElektroNova është partneri juaj i besuar.'
        },
        {
          title: 'Sisteme të Avancuara të Sigurisë',
          content: 'Përveç shërbimeve elektrike, ne jemi lider në instalimin e kamerave të sigurisë dhe alarmeve në rajonin e Dukagjinit. Mbroni pronën tuaj me teknologjinë më të fundit.'
        }
      ],
      installationExamples: [
        {
          title: 'Instalim në Rezidencë',
          description: 'Sistem i plotë i ndriçimit dhe rrjetit elektrik në një shtëpi moderne në Pejë.',
          image: '/images/stock/stock-18.webp'
        },
        {
          title: 'Sistem Sigurie për Biznes',
          description: 'Monitorim 24/7 me kamera 4K për një qendër tregtare.',
          image: '/images/stock/stock-21.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Smart Home', 'Mirëmbajtje'],
      localBenefits: ['Ndërhyrje e shpejtë', 'Materiale cilësore', 'Garanci 2-vjeçare'],
      neighborhoods: ['Qendra', 'Dardania', 'Karagaqi', 'Kapeshnica', 'Asllan Çeshme', 'Zatra']
    },
    'prishtine': {
      slug: 'prishtine',
      city: 'Prishtinë',
      title: 'Elektricist në Prishtinë – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Shërbime profesionale elektrike në Prishtinë. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Prishtina, si kryeqyteti i Kosovës, kërkon standarde të larta të sigurisë dhe profesionalizmit. ElektroNova ofron shërbime elitare për shtëpi, biznese dhe komplekse banesore në çdo lagje të Prishtinës.',
      sections: [
        {
          title: 'Zgjidhje për Komplekse Banesore',
          content: 'Ne jemi specialistë për instalime elektrike në ndërtesa të larta dhe mirëmbajtjen e tyre. Siguria e banorëve është prioriteti ynë.'
        },
        {
          title: 'Sisteme Smart Home në Prishtinë',
          content: 'Transformoni shtëpinë tuaj në një ambient inteligjent. Kontrolloni ndriçimin, ngrohjen dhe sigurinë direkt nga telefoni juaj.'
        }
      ],
      installationExamples: [
        {
          title: 'Penthouse në Lakrishtë',
          description: 'Sistem i avancuar i automatizimit dhe ndriçimit LED.',
          image: '/images/stock/stock-3.webp'
        }
      ],
      servicesOffered: ['Instalime Industriale', 'Smart Home', 'Mirëmbajtje Banesash', 'Kamera Sigurie', 'Alarme'],
      localBenefits: ['Asistencë 24/7', 'Teknologji e fundit', 'Certifikim teknik'],
      neighborhoods: ['Qendra', 'Dardania', 'Lakrishtja', 'Arbëria', 'Veterniku', 'Bregu i Diellit']
    },
    'prizren': {
      slug: 'prizren',
      city: 'Prizren',
      title: 'Elektricist në Prizren – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Zgjidhje profesionale elektrike për Prizrenin. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Në qytetin historik të Prizrenit, ElektroNova sjell përvojën e tashme dhe teknologjinë moderne për të mbrojtur dhe ndriçuar pronat tuaja. Ne respektojmë arkitekturën e qytetit duke ofruar instalime estetike dhe të sigurta.',
      sections: [
        {
          title: 'Mirëmbajtja e Bizneseve në Shadërvan',
          content: 'Ne ofrojmë shërbime të dedikuara për bizneset gastronomike dhe tregtare në qendër të Prizrenit, duke garantuar punë pa ndërprerje.'
        }
      ],
      installationExamples: [
        {
          title: 'Hotel në Qendër',
          description: 'Instalimi i rrjetit elektrik dhe kamerave për një hotel tradicional.',
          image: '/images/stock/stock-4.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Ndriçim Dekorativ', 'Mirëmbajtje'],
      localBenefits: ['Respektim i arkitekturës', 'Punë cilësore', 'Mbështetje lokale'],
      neighborhoods: ['Shadërvani', 'Ortakolli', 'Bajram Curri', 'Arbana', 'Kurilla']
    },
    'gjakove': {
      slug: 'gjakove',
      city: 'Gjakovë',
      title: 'Elektricist në Gjakovë – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Shërbime profesionale elektrike në Gjakovë. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'ElektroNova sjell sigurinë elektrike në qytetin e Gjakovës. Me një traditë në punë cilësore, ne shërbejmë shtëpitë dhe bizneset gjakovare me përkushtim.',
      sections: [
        {
          title: 'Siguria në Çarshinë e Madhe',
          content: 'Ne ofrojmë sisteme të avancuara të alarmeve dhe kamerave për mbrojtjen e bizneseve në zonat historike dhe ato moderne.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Familjare',
          description: 'Instalimi i plotë elektrik dhe sistemet e sigurisë.',
          image: '/images/stock/stock-5.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime Urgjente', 'Smart Home'],
      localBenefits: ['Përvojë profesionale', 'Çmime korrekte', 'Siguri maksimale'],
      neighborhoods: ['Qendra', 'Çarshia e Madhe', 'Orize', 'Blloku i Ri']
    },
    'gjilan': {
      slug: 'gjilan',
      city: 'Gjilan',
      title: 'Elektricist në Gjilan – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Zgjidhje profesionale elektrike për Gjilanin. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Në Anamoravë, ElektroNova është sinonim i sigurisë elektrike. Ne ofrojmë shërbime të shpejta për të gjithë qytetarët e Gjilanit.',
      sections: [
        {
          title: 'Riparime Elektrike 24/7',
          content: 'Për çdo defekt të papritur, ekipi ynë në Gjilan është në gatishmëri për t\'ju ndihmuar në çdo kohë.'
        }
      ],
      installationExamples: [
        {
          title: 'Biznes Lokal',
          description: 'Instalimi i panelesh elektrike dhe ndriçimit LED.',
          image: '/images/stock/stock-6.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Riparime', 'Kamera Sigurie', 'Alarme', 'Mirëmbajtje'],
      localBenefits: ['Gatishmëri 24h', 'Teknikë të certifikuar', 'Materiale Schneider'],
      neighborhoods: ['Qendra', 'Dardania', 'Arbëria', 'Zabeli']
    },
    'ferizaj': {
      slug: 'ferizaj',
      city: 'Ferizaj',
      title: 'Elektricist në Ferizaj – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Zgjidhje profesionale elektrike për Ferizajin. Instalime industriale, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Ferizaj, si një qendër e rëndësishme ekonomike, kërkon instalime elektrike të qëndrueshme dhe profesionale. ElektroNova ofron ekspertizën më të mirë për fabrikat dhe shtëpitë tuaja.',
      sections: [
        {
          title: 'Instalime Industriale në Ferizaj',
          content: 'Ne jemi specialistë për rrjeta elektrike në zona industriale, duke garantuar fuqi dhe stabilitet për bizneset tuaja.'
        }
      ],
      installationExamples: [
        {
          title: 'Fabrikë në Zonën Industriale',
          description: 'Projektimi dhe ekzekutimi i rrjetit elektrik treshfazor.',
          image: '/images/stock/stock-7.webp'
        }
      ],
      servicesOffered: ['Instalime Industriale', 'Panele Elektrike', 'Kamera Sigurie', 'Alarme', 'Mirëmbajtje'],
      localBenefits: ['Ekspertizë teknike', 'Pajisje moderne', 'Efikasitet energjetik'],
      neighborhoods: ['Qendra', 'Terrni', 'Nikadini', 'Gallaqpana', 'Lagjja e Re']
    },
    'mitrovice': {
      slug: 'mitrovice',
      city: 'Mitrovicë',
      title: 'Shërbime Elektrike në Mitrovicë – ElektroNova',
      description: 'Elektricist profesional në Mitrovicë. Instalime, riparime dhe sisteme sigurie për shtëpi dhe biznese.',
      intro: 'ElektroNova shtrin shërbimet e saj edhe në Mitrovicë, duke ofruar siguri dhe profesionalizëm për të gjithë banorët buzë Ibrit.',
      sections: [
        {
          title: 'Siguria me Kamera në Mitrovicë',
          content: 'Mbroni pronën tuaj me sistemet tona të monitorimit 4K, të dizajnuara për t\'u bërë ballë çdo kushti atmosferik.'
        }
      ],
      installationExamples: [
        {
          title: 'Monitorim Rezidencial',
          description: 'Sistem i plotë i kamerave dhe alarmeve wireless.',
          image: '/images/stock/stock-10.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime', 'Mirëmbajtje'],
      localBenefits: ['Gatishmëri e shpejtë', 'Korrektësi', 'Teknologji e lartë'],
      neighborhoods: ['Qendra', 'Bair', 'Ilirida', 'Tavnik', 'Shipol']
    },
    'vushtrri': {
      slug: 'vushtrri',
      city: 'Vushtrri',
      title: 'Elektricist në Vushtrri – Instalime dhe Siguri 24/7',
      description: 'Shërbime profesionale elektrike në Vushtrri. Riparime, instalime të reja dhe sisteme monitorimi nga ElektroNova.',
      intro: 'Qyteti i lashtë i Vushtrrisë meriton shërbime moderne elektrike. ElektroNova ofron elektricistë të certifikuar për çdo nevojë tuajën.',
      sections: [
        {
          title: 'Renovimi i Instalimeve të Vjetra',
          content: 'Ne modernizojmë rrjetin elektrik të shtëpive tuaja, duke rritur sigurinë dhe duke parandaluar defektet e mundshme.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Tradicionale',
          description: 'Ndërrimi i plotë i instalimit elektrik dhe sigurimi me kamera.',
          image: '/images/stock/stock-9.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Riparime Urgjente', 'Kamera Sigurie', 'Alarme', 'Smart Home'],
      localBenefits: ['Teknikë me përvojë', 'Materiale të sigurta', 'Korrektësi 100%'],
      neighborhoods: ['Qendra', 'Pashallarët', 'Kalaja', 'Ura e Gurit']
    },
    'podujeve': {
      slug: 'podujeve',
      city: 'Podujevë',
      title: 'Shërbime Elektrike në Podujevë – ElektroNova',
      description: 'Zgjidhje profesionale për Podujevën. Instalime, riparime dhe sisteme sigurie nga ekipi ynë.',
      intro: 'ElektroNova vjen edhe në Llap, duke ofruar shërbime të elektricistit për të gjithë banorët e Podujevës dhe fshatrave përreth.',
      sections: [
        {
          title: 'Gatishmëri për çdo Defekt',
          content: 'Pavarësisht rëndësisë së problemit, ekipi ynë në Podujevë reagon shpejt për të rikthyer energjinë dhe sigurinë në shtëpinë tuaj.'
        }
      ],
      installationExamples: [
        {
          title: 'Vilë në Periferi',
          description: 'Instalimi i rrjetit elektrik dhe sigurisë për një vilë moderne.',
          image: '/images/stock/stock-10.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Riparime', 'Kamera Sigurie', 'Alarme', 'Mirëmbajtje'],
      localBenefits: ['Mbulueshmëri e plotë', 'Materiale premium', 'Përvojë profesionale'],
      neighborhoods: ['Qendra', 'Përshëndetja', 'Llapashtica', 'Gërdoci']
    },
    'suhareke': {
      slug: 'suhareke',
      city: 'Suharekë',
      title: 'Elektricist në Suharekë – Shërbime Elektrike dhe Siguri',
      description: 'Shërbime profesionale elektrike në Suharekë. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Suhareka mund të mbështetet te ElektroNova për të gjitha nevojat elektrike. Ne sjellim shërbime të shpejta dhe cilësore për çdo objekt.',
      sections: [
        {
          title: 'Instalime Elektrike për Shtëpi dhe Biznes',
          content: 'Ekipi ynë garanton punë të pastër dhe të sigurt, duke përdorur standardet më të larta të inxhinierisë elektrike.'
        }
      ],
      installationExamples: [
        {
          title: 'Objekt Afarist',
          description: 'Sistem i plotë i monitorimit dhe rrjetit elektrik.',
          image: '/images/stock/stock-11.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Smart Home', 'Mirëmbajtje'],
      localBenefits: ['Teknikë të shpejtë', 'Materiale të certifikuara', 'Mbështetje lokale'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Shiroka']
    },
    'rahovec': {
      slug: 'rahovec',
      city: 'Rahovec',
      title: 'Elektricist në Rahovec – Shërbime Elektrike dhe Siguri',
      description: 'Zgjidhje profesionale elektrike për Rahovecin. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Në qytetin e vreshtarëve, ElektroNova sjell shërbime të sigurta elektrike. Ne kujdesemi që çdo bodrum e shtëpi në Rahovec të ketë ndriçim dhe siguri maksimale.',
      sections: [
        {
          title: 'Zgjidhje për Bujqësi dhe Biznes',
          content: 'Ne ofrojmë instalime specifike për bodrumet e verës dhe objektet bujqësore, duke garantuar qëndrueshmëri në kushte lagështie.'
        }
      ],
      installationExamples: [
        {
          title: 'Bodrum i Verës',
          description: 'Instalimi i ndriçimit industrial dhe rrjetit elektrik.',
          image: '/images/stock/stock-12.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime', 'Mirëmbajtje'],
      localBenefits: ['Njohje e nevojave lokale', 'Teknikë të shpejtë', 'Materiale kualitative'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Vreshtat']
    },
    'lipjan': {
      slug: 'lipjan',
      city: 'Lipjan',
      title: 'Elektricist në Lipjan – Shërbime Elektrike 24/7',
      description: 'Zgjidhje profesionale për Lipjanin. Instalime, riparime urgjente dhe sisteme sigurie nga ElektroNova.',
      intro: 'Në udhëkryqin e Kosovës, Lipjani kërkon shërbime të shpejta dhe profesionale. ElektroNova është gjithmonë gati për çdo kërkesë tuajën në Lipjan.',
      sections: [
        {
          title: 'Urgjenca Elektrike në Lipjan',
          content: 'Për çdo lidhje të shkurtër apo problem me tension, ekipi ynë në Lipjan reagon menjëherë.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Moderne',
          description: 'Sistem i plotë elektrik dhe alarme sigurie.',
          image: '/images/stock/stock-16.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Riparime Urgjente', 'Kamera Sigurie', 'Alarme', 'Smart Home'],
      localBenefits: ['Reagim i shpejtë', 'Përvojë shumëvjeçare', 'Mbështetje lokale'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Sllovia']
    },
    'kamenice': {
      slug: 'kamenice',
      city: 'Kamenicë',
      title: 'Shërbime Elektrike në Kamenicë – ElektroNova',
      description: 'Elektricist profesional në Kamenicë. Instalime, riparime dhe sisteme sigurie për pronën tuaj.',
      intro: 'Kamenica mund të mbështetet te ElektroNova për siguri maksimale elektrike. Ne ofrojmë shërbime të certifikuara për çdo objekt në Kamenicë.',
      sections: [
        {
          title: 'Siguria me Kamera 4K',
          content: 'Instalojmë sisteme monitorimi që mbrojnë shtëpinë tuaj 24/7, me qasje nga telefoni juaj.'
        }
      ],
      installationExamples: [
        {
          title: 'Biznes Lokal',
          description: 'Instalimi i sistemit të kamerave dhe alarmeve.',
          image: '/images/stock/stock-14.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime', 'Smart Home'],
      localBenefits: ['Korrektësi', 'Teknikë profesionalë', 'Garanci e plotë'],
      neighborhoods: ['Qendra', 'Dardania', 'Lagjja e Re']
    },
    'decan': {
      slug: 'decan',
      city: 'Deçan',
      title: 'Elektricist në Deçan – Shërbime Elektrike dhe Siguri',
      description: 'Zgjidhje profesionale për Deçanin. Instalime elektrike, kamera 4K dhe alarme sigurie nga ekipi ynë.',
      intro: 'Deçani meriton siguri dhe profesionalizëm. ElektroNova sjell teknologjinë më moderne në qytetin e Deçanit, duke garantuar punë cilësore.',
      sections: [
        {
          title: 'Instalime në Vila dhe Shtëpi',
          content: 'Ne jemi specialistë për instalime në objekte turistike dhe vila, duke përdorur materiale që i rezistojnë kohës.'
        }
      ],
      installationExamples: [
        {
          title: 'Vilë në Grykë të Deçanit',
          description: 'Sistem i plotë i ndriçimit dhe sigurisë.',
          image: '/images/stock/stock-20.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Smart Home', 'Mirëmbajtje'],
      localBenefits: ['Njohje e terrenit', 'Materiale premium', 'Përvojë profesionale'],
      neighborhoods: ['Qendra', 'Isniqi', 'Carrabregu']
    },
    'istog': {
      slug: 'istog',
      city: 'Istog',
      title: 'Shërbime Elektrike në Istog – ElektroNova',
      description: 'Elektricist profesional në Istog. Instalime, riparime dhe sisteme monitorimi 24/7.',
      intro: 'Istogu, si një qytet me bukuri natyrore dhe zhvillim të shpejtë, kërkon standarde të larta elektrike. ElektroNova është këtu për t\'ju shërbyer.',
      sections: [
        {
          title: 'Mbrojtja nga Erërat e Forta',
          content: 'Në Istog, ne fokusojmë instalimet tona në sigurinë kundër mbingarkesave dhe forcave të natyrës, duke mbrojtur pajisjet tuaja.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Moderne',
          description: 'Sistem i plotë i monitorimit dhe rrjetit elektrik.',
          image: '/images/stock/stock-16.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime Urgjente', 'Smart Home'],
      localBenefits: ['Instalime rezistente', 'Përvojë teknike', 'Mbështetje 24h'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Banja']
    },
    'malisheve': {
      slug: 'malisheve',
      city: 'Malishevë',
      title: 'Elektricist në Malishevë – Shërbime Elektrike dhe Siguri',
      description: 'Zgjidhje profesionale për Malishevën. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'ElektroNova sjell standardet më të larta të sigurisë elektrike në Malishevë. Ekipi ynë siguron që çdo projekt të përfundojë me sukses dhe në kohë rekorde.',
      sections: [
        {
          title: 'Zgjidhje për Rezidenca dhe Biznese',
          content: 'Nga shtëpitë familjare deri te objektet afariste, ne ofrojmë instalime që garantojnë siguri afatgjatë.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Familjare',
          description: 'Instalimi i rrjetit elektrik dhe kamerave të sigurisë.',
          image: '/images/stock/stock-3.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Smart Home', 'Mirëmbajtje'],
      localBenefits: ['Punë cilësore', 'Materiale të sigurta', 'Përvojë profesionale'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Banja']
    },
    'skenderaj': {
      slug: 'skenderaj',
      city: 'Skenderaj',
      title: 'Elektricist në Skenderaj – Shërbime Elektrike dhe Siguri',
      description: 'Shërbime profesionale elektrike në Skenderaj. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Në zemër të Drenicës, ElektroNova ofron siguri dhe profesionalizëm. Ne kujdesemi që çdo familje në Skenderaj të ketë një rrjet elektrik të sigurt.',
      sections: [
        {
          title: 'Siguria e Pronës tuaj',
          content: 'Instalojmë sisteme monitorimi 4K dhe alarme Ajax që mbrojnë pronën tuaj në çdo kohë.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Profesionale',
          description: 'Sistem i plotë elektrik dhe vëzhgim 24/7.',
          image: '/images/stock/stock-9.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime Urgjente', 'Mirëmbajtje'],
      localBenefits: ['Gatishmëri e plotë', 'Materiale Schneider', 'Mbështetje lokale'],
      neighborhoods: ['Qendra', 'Prekazi', 'Lagjja e Re']
    },
    'gracanice': {
      slug: 'gracanice',
      city: 'Graçanicë',
      title: 'Shërbime Elektrike në Graçanicë – ElektroNova',
      description: 'Elektricist profesional në Graçanicë. Instalime, riparime dhe sisteme monitorimi 24/7.',
      intro: 'ElektroNova ofron shërbime të elektricistit në Graçanicë, duke garantuar siguri elektrike për të gjithë banorët dhe bizneset e zonës.',
      sections: [
        {
          title: 'Modernizimi i Rrjetit Elektrik',
          content: 'Ne ofrojmë shërbime të renovimit të instalimeve të vjetra për t\'i përshtatur ato me kërkesat e pajisjeve moderne.'
        }
      ],
      installationExamples: [
        {
          title: 'Objekt Afarist',
          description: 'Instalimi i panelsh elektrike dhe rrjetit të sigurisë.',
          image: '/images/stock/stock-18.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime', 'Smart Home'],
      localBenefits: ['Korrektësi', 'Teknikë të certifikuar', 'Gatishmëri 24h'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Llapllasella']
    },
    'kline': {
      slug: 'kline',
      city: 'Klinë',
      title: 'Elektricist në Klinë – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Zgjidhje profesionale për Klinën. Instalime, riparime urgjente dhe sisteme sigurie nga ElektroNova.',
      intro: 'Klinë, qyteti në udhëkryqin e rrugëve të rëndësishme, kërkon shërbime të shpejta elektrike. ElektroNova është gjithmonë në gatishmëri për ju.',
      sections: [
        {
          title: 'Urgjenca dhe Riparime',
          content: 'Për çdo problem elektrik në shtëpinë apo biznesin tuaj në Klinë, ne ofrojmë ndërhyrje brenda orës.'
        }
      ],
      installationExamples: [
        {
          title: 'Pikë Karburanti',
          description: 'Punimi i instalimit elektrik dhe kamerave të sigurisë.',
          image: '/images/stock/stock-14.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Riparime Urgjente', 'Kamera Sigurie', 'Alarme', 'Smart Home'],
      localBenefits: ['Shpejtësi', 'Punë e garantuar', 'Materiale premium'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Gllareva']
    },
    'shtime': {
      slug: 'shtime',
      city: 'Shtime',
      title: 'Elektricist në Shtime – Shërbime Elektrike 24/7',
      description: 'Zgjidhje profesionale për Shtimen. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Shtimja mund të llogarisë në ElektroNova për çdo nevojë elektrike. Ne sjellim përvojën tonë profesionale direkt te ju.',
      sections: [
        {
          title: 'Instalime të Reja dhe Siguri',
          content: 'Ne projektojmë dhe ekzekutojmë rrjeta elektrike moderne që mbrojnë shtëpinë tuaj nga çdo rrezik.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Familjare',
          description: 'Instalimi i rrjetit elektrik dhe kamerave.',
          image: '/images/stock/stock-20.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Riparime', 'Kamera Sigurie', 'Alarme', 'Mirëmbajtje'],
      localBenefits: ['Teknikë të shpejtë', 'Korrektësi', 'Mbështetje teknike'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Petrova']
    },
    'obiliq': {
      slug: 'obiliq',
      city: 'Obiliq',
      title: 'Elektricist në Obiliq – Shërbime Elektrike dhe Siguri 24/7',
      description: 'Zgjidhje profesionale për Obiliqin. Instalime industriale, riparime dhe sisteme monitorimi nga ElektroNova.',
      intro: 'Obiliqi, si qendër e rëndësishme energjetike, kërkon instalime elektrike të qëndrueshme. ElektroNova ofron shërbime cilësore për çdo objekt në Obiliq.',
      sections: [
        {
          title: 'Instalime Elektrike Industriale',
          content: 'Ne jemi specialistë për rrjeta elektrike që përballojnë kërkesa të larta energjetike, duke garantuar siguri maksimale.'
        }
      ],
      installationExamples: [
        {
          title: 'Shtëpi Familjare',
          description: 'Instalimi i plotë elektrik dhe kamerat e sigurisë.',
          image: '/images/stock/stock-21.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime', 'Smart Home'],
      localBenefits: ['Ekspertizë teknike', 'Pajisje moderne', 'Garanci e plotë'],
      neighborhoods: ['Qendra', 'Millosheva', 'Plemetina']
    },
    'drenas': {
      slug: 'drenas',
      city: 'Drenas',
      title: 'Elektricist në Drenas – Shërbime Elektrike dhe Siguri',
      description: 'Shërbime profesionale elektrike në Drenas. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'ElektroNova sjell sigurinë elektrike në zemër të Drenicës. Ne ofrojmë shërbime të certifikuara për të gjithë qytetarët e Drenasit.',
      sections: [
        {
          title: 'Siguria me Kamera në Drenas',
          content: 'Instalojmë sisteme moderne monitorimi që mbrojnë shtëpinë dhe biznesin tuaj 24/7.'
        }
      ],
      installationExamples: [
        {
          title: 'Qendër Tregtare',
          description: 'Sistem i plotë i monitorimit dhe rrjetit elektrik.',
          image: '/images/stock/stock-21.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Mirëmbajtje', 'Ndriçim'],
      localBenefits: ['Gatishmëri e shpejtë', 'Punë cilësore', 'Mbështetje lokale'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Komorani']
    },
    'fushe-kosove': {
      slug: 'fushe-kosove',
      city: 'Fushë Kosovë',
      title: 'Elektricist në Fushë Kosovë – Shërbime Elektrike 24/7',
      description: 'Shërbime profesionale elektrike në Fushë Kosovë. Instalime në komplekse banesore dhe riparime urgjente.',
      intro: 'Fushë Kosova po zhvillohet shpejt dhe ne jemi partneri juaj për çdo projekt elektrik dhe sistem sigurie.',
      sections: [
        {
          title: 'Instalime në Komplekse Banesore',
          content: 'Ne ofrojmë mirëmbajtje dhe instalime elektrike moderne për ndërtesat e reja në Fushë Kosovë.'
        }
      ],
      installationExamples: [
        {
          title: 'Bllok Banesor',
          description: 'Instalimi i rrjetit elektrik dhe kamerave.',
          image: '/images/stock/stock-3.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Smart Home', 'Mirëmbajtje'],
      localBenefits: ['Mbulim i plotë', 'Teknikë të shpejtë', 'Garanci zyrtare'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Bresje']
    },
    'junik': {
      slug: 'junik',
      city: 'Junik',
      title: 'Elektricist në Junik – Shërbime Elektrike dhe Siguri',
      description: 'Zgjidhje profesionale elektrike për Junikun. Instalime, riparime dhe sisteme sigurie nga ElektroNova.',
      intro: 'Në Junik, ElektroNova ofron shërbime elitare të elektricistit, duke respektuar traditën dhe duke sjellë teknologjinë më të re.',
      sections: [
        {
          title: 'Siguria në Oda dhe Shtëpi',
          content: 'Ne ofrojmë instalime estetike që përshtaten me arkitekturën unike të Junikut, duke garantuar siguri maksimale.'
        }
      ],
      installationExamples: [
        {
          title: 'Kulla Turistike',
          description: 'Instalimi i rrjetit elektrik dhe ndriçimit dekorativ.',
          image: '/images/stock/stock-4.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Smart Home', 'Mirëmbajtje'],
      localBenefits: ['Teknikë profesionalë', 'Materiale kualitative', 'Garanci afatgjatë'],
      neighborhoods: ['Qendra', 'Lagjja e Poshtme', 'Lagjja e Sipërme']
    },
    'hani-i-elezit': {
      slug: 'hani-i-elezit',
      city: 'Hani i Elezit',
      title: 'Shërbime Elektrike në Han të Elezit – ElektroNova',
      description: 'Elektricist profesional në Han të Elezit. Instalime, riparime dhe sisteme monitorimi 24/7.',
      intro: 'Në kufirin e Kosovës, ElektroNova sjell sigurinë elektrike në Han të Elezit. Ne ofrojmë shërbime të shpejta për shtëpitë dhe bizneset tuaja.',
      sections: [
        {
          title: 'Instalime për Biznese Kufitare',
          content: 'Ne ofrojmë shërbime të dedikuara për depot dhe bizneset që operojnë në zonën kufitare, duke garantuar monitorim 24/7.'
        }
      ],
      installationExamples: [
        {
          title: 'Depo Industriale',
          description: 'Instalimi i rrjetit elektrik dhe kamerave të sigurisë.',
          image: '/images/stock/stock-18.webp'
        }
      ],
      servicesOffered: ['Instalime Elektrike', 'Kamera Sigurie', 'Alarme', 'Riparime', 'Mirëmbajtje'],
      localBenefits: ['Gatishmëri 24h', 'Materiale premium', 'Përvojë profesionale'],
      neighborhoods: ['Qendra', 'Lagjja e Re', 'Paldenica']
    }
  },
  en: {
    'peje': {
      slug: 'peje',
      city: 'Peja',
      title: 'Electrician in Peja – Electrical Services & Security 24/7',
      description: 'Professional electrical services in Peja. Installations, repairs, and security systems by ElektroNova.',
      intro: 'ElektroNova provides the best electrical solutions in the city of Peja and the surrounding area. With a professional team having over 10 years of experience, we guarantee quality and maximum safety for every project.',
      sections: [
        {
          title: 'Professional Solutions for Your Home',
          content: 'We ensure your electrical network in Peja is safe and efficient. From small repairs to full installations in new buildings, ElektroNova is your trusted partner.'
        },
        {
          title: 'Advanced Security Systems',
          content: 'In addition to electrical services, we are leaders in installing security cameras and alarms in the Dukagjin region. Protect your property with the latest technology.'
        }
      ],
      installationExamples: [
        {
          title: 'Residential Installation',
          description: 'Complete lighting and electrical network system in a modern house in Peja.',
          image: '/images/stock/stock-18.webp'
        },
        {
          title: 'Business Security System',
          description: '24/7 monitoring with 4K cameras for a commercial center.',
          image: '/images/stock/stock-21.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Smart Home', 'Maintenance'],
      localBenefits: ['Rapid Response', 'Quality Materials', '2-Year Warranty'],
      neighborhoods: ['Center', 'Dardania', 'Karagaqi', 'Kapeshnica', 'Asllan Ceshme', 'Zatra']
    },
    'prishtine': {
      slug: 'prishtine',
      city: 'Prishtina',
      title: 'Electrician in Prishtina – Electrical Services & Security 24/7',
      description: 'Professional electrical services in Prishtina. Installations, repairs, and security systems by ElektroNova.',
      intro: 'Prishtina, as the capital of Kosovo, requires high standards of security and professionalism. ElektroNova provides elite services for homes, businesses, and residential complexes in every neighborhood of Prishtina.',
      sections: [
        {
          title: 'Solutions for Residential Complexes',
          content: 'We are specialists in electrical installations for high-rise buildings and their maintenance. Resident safety is our priority.'
        },
        {
          title: 'Smart Home Systems in Prishtina',
          content: 'Transform your home into an intelligent environment. Control lighting, heating, and security directly from your phone.'
        }
      ],
      installationExamples: [
        {
          title: 'Penthouse in Lakrishte',
          description: 'Advanced automation system and LED lighting.',
          image: '/images/stock/stock-3.webp'
        }
      ],
      servicesOffered: ['Industrial Installations', 'Smart Home', 'Apartment Maintenance', 'Security Cameras', 'Alarms'],
      localBenefits: ['24/7 Assistance', 'Latest Technology', 'Technical Certification'],
      neighborhoods: ['Center', 'Dardania', 'Lakrishtja', 'Arberia', 'Veterniku', 'Sunny Hill']
    },
    'prizren': {
      slug: 'prizren',
      city: 'Prizren',
      title: 'Electrician in Prizren – Electrical Services & Security 24/7',
      description: 'Professional electrical solutions for Prizren. Installations, repairs, and security systems by ElektroNova.',
      intro: 'In the historic city of Prizren, ElektroNova brings experience and modern technology to protect and light up your properties. We respect the city\'s architecture by offering aesthetic and safe installations.',
      sections: [
        {
          title: 'Business Maintenance in Shadervan',
          content: 'We offer dedicated services for gastronomic and commercial businesses in the center of Prizren, ensuring uninterrupted work.'
        }
      ],
      installationExamples: [
        {
          title: 'Center Hotel',
          description: 'Electrical network and camera installation for a traditional hotel.',
          image: '/images/stock/stock-4.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Decorative Lighting', 'Maintenance'],
      localBenefits: ['Architectural Respect', 'Quality Work', 'Local Support'],
      neighborhoods: ['Shadervani', 'Ortakolli', 'Bajram Curri', 'Arbana', 'Kurilla']
    },
    'gjakove': {
      slug: 'gjakove',
      city: 'Gjakova',
      title: 'Electrician in Gjakova – Electrical Services & Security 24/7',
      description: 'Professional electrical services in Gjakova. Installations, repairs, and security systems by ElektroNova.',
      intro: 'ElektroNova brings electrical safety to the city of Gjakova. With a tradition of quality work, we serve Gjakova homes and businesses with dedication.',
      sections: [
        {
          title: 'Security in the Grand Bazaar',
          content: 'We offer advanced alarm and camera systems for the protection of businesses in both historic and modern zones.'
        }
      ],
      installationExamples: [
        {
          title: 'Family Home',
          description: 'Full electrical installation and security systems.',
          image: '/images/stock/stock-5.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Emergency Repairs', 'Smart Home'],
      localBenefits: ['Professional Experience', 'Fair Prices', 'Maximum Safety'],
      neighborhoods: ['Center', 'Grand Bazaar', 'Orize', 'New Block']
    },
    'gjilan': {
      slug: 'gjilan',
      city: 'Gjilan',
      title: 'Electrician in Gjilan – Electrical Services & Security 24/7',
      description: 'Professional electrical solutions for Gjilan. Installations, repairs, and security systems by ElektroNova.',
      intro: 'In Anamorava, ElektroNova is synonymous with electrical safety. We offer fast services for all Gjilan citizens.',
      sections: [
        {
          title: '24/7 Electrical Repairs',
          content: 'For any unexpected fault, our team in Gjilan is on standby to help you at any time.'
        }
      ],
      installationExamples: [
        {
          title: 'Local Business',
          description: 'Electrical panel and LED lighting installation.',
          image: '/images/stock/stock-6.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Repairs', 'Security Cameras', 'Alarms', 'Maintenance'],
      localBenefits: ['24h Readiness', 'Certified Technicians', 'Schneider Materials'],
      neighborhoods: ['Center', 'Dardania', 'Arberia', 'Zabeli']
    },
    'ferizaj': {
      slug: 'ferizaj',
      city: 'Ferizaj',
      title: 'Electrician in Ferizaj – Electrical Services & Security 24/7',
      description: 'Professional electrical solutions for Ferizaj. Industrial, residential installations, and security systems by ElektroNova.',
      intro: 'Ferizaj, as a major economic center, requires stable and professional electrical installations. ElektroNova offers the best expertise for your factories and homes.',
      sections: [
        {
          title: 'Industrial Installations in Ferizaj',
          content: 'We are specialists in electrical grids for industrial zones, guaranteeing power and stability for your businesses.'
        }
      ],
      installationExamples: [
        {
          title: 'Factory in Industrial Zone',
          description: 'Design and execution of a three-phase electrical network.',
          image: '/images/stock/stock-7.webp'
        }
      ],
      servicesOffered: ['Industrial Installations', 'Electrical Panels', 'Security Cameras', 'Alarms', 'Maintenance'],
      localBenefits: ['Technical Expertise', 'Modern Equipment', 'Energy Efficiency'],
      neighborhoods: ['Center', 'Sherret', 'Nikadini', 'New Neighborhood']
    },
    'mitrovice': {
      slug: 'mitrovice',
      city: 'Mitrovica',
      title: 'Electrical Services in Mitrovica – ElektroNova',
      description: 'Professional electrician in Mitrovica. Installations, repairs, and security systems for homes and businesses.',
      intro: 'ElektroNova extends its services to Mitrovica, offering safety and professionalism to all residents along the Ibar river.',
      sections: [
        {
          title: 'Security with Cameras in Mitrovica',
          content: 'Protect your property with our 4K monitoring systems, designed to withstand any weather conditions.'
        }
      ],
      installationExamples: [
        {
          title: 'Residential Monitoring',
          description: 'Full camera and wireless alarm system.',
          image: '/images/stock/stock-10.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Repairs', 'Maintenance'],
      localBenefits: ['Rapid Response', 'Reliability', 'High Technology'],
      neighborhoods: ['Center', 'Bair', 'Ilirida', 'Tavnik', 'Shipol']
    },
    'vushtrri': {
      slug: 'vushtrri',
      city: 'Vushtrri',
      title: 'Electrician in Vushtrri – Installations & Security 24/7',
      description: 'Professional electrical services in Vushtrri. Repairs, new installations, and monitoring systems by ElektroNova.',
      intro: 'The ancient city of Vushtrri deserves modern electrical services. ElektroNova offers certified electricians for all your needs.',
      sections: [
        {
          title: 'Modernizing Old Installations',
          content: 'We modernize your homes\' electrical grids, increasing safety and preventing potential faults.'
        }
      ],
      installationExamples: [
        {
          title: 'Traditional House',
          description: 'Full electrical installation replacement and camera security.',
          image: '/images/stock/stock-9.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Emergency Repairs', 'Security Cameras', 'Alarms', 'Smart Home'],
      localBenefits: ['Experienced Technicians', 'Safe Materials', '100% Reliability'],
      neighborhoods: ['Center', 'Pashallaret', 'Castle', 'Stone Bridge']
    },
    'podujeve': {
      slug: 'podujeve',
      city: 'Podujevo',
      title: 'Electrical Services in Podujevo – ElektroNova',
      description: 'Professional solutions for Podujevo. Installations, repairs, and security systems by our team.',
      intro: 'ElektroNova comes to Llap, offering electrician services to all residents of Podujevo and surrounding villages.',
      sections: [
        {
          title: 'Readiness for Every Fault',
          content: 'Regardless of the problem\'s severity, our team in Podujevo reacts quickly to restore power and safety to your home.'
        }
      ],
      installationExamples: [
        {
          title: 'Suburban Villa',
          description: 'Electrical network and security installation for a modern villa.',
          image: '/images/stock/stock-10.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Repairs', 'Security Cameras', 'Alarms', 'Maintenance'],
      localBenefits: ['Full Coverage', 'Premium Materials', 'Professional Experience'],
      neighborhoods: ['Center', 'Taukbashce', 'Llapashtica', 'Gerdoc']
    },
    'suhareke': {
      slug: 'suhareke',
      city: 'Suhareka',
      title: 'Electrician in Suhareka – Electrical Services & Security',
      description: 'Professional electrical services in Suhareka. Installations, repairs, and security systems by ElektroNova.',
      intro: 'Suhareka can rely on ElektroNova for all electrical needs. We bring fast and quality services for every property.',
      sections: [
        {
          title: 'Electrical Installations for Home and Business',
          content: 'Our team guarantees clean and safe work, using the highest standards of electrical engineering.'
        }
      ],
      installationExamples: [
        {
          title: 'Commercial Object',
          description: 'Full monitoring and electrical network system.',
          image: '/images/stock/stock-11.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Smart Home', 'Maintenance'],
      localBenefits: ['Fast Technicians', 'Certified Materials', 'Local Support'],
      neighborhoods: ['Center', 'New Neighborhood', 'Shiroka']
    },
    'rahovec': {
      slug: 'rahovec',
      city: 'Rahovec',
      title: 'Electrician in Rahovec – Electrical Services & Security',
      description: 'Professional electrical solutions for Rahovec. Installations, repairs, and security systems by ElektroNova.',
      intro: 'In the city of winemakers, ElektroNova brings safe electrical services. We ensure every cellar and home in Rahovec has maximum lighting and security.',
      sections: [
        {
          title: 'Solutions for Agriculture and Business',
          content: 'We offer specific installations for wine cellars and agricultural facilities, guaranteeing durability in humid conditions.'
        }
      ],
      installationExamples: [
        {
          title: 'Wine Cellar',
          description: 'Industrial lighting and electrical network installation.',
          image: '/images/stock/stock-12.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Repairs', 'Maintenance'],
      localBenefits: ['Local Needs Knowledge', 'Fast Technicians', 'Quality Materials'],
      neighborhoods: ['Center', 'New Neighborhood', 'Vineyards']
    },
    'lipjan': {
      slug: 'lipjan',
      city: 'Lipjan',
      title: 'Electrician in Lipjan – Electrical Services 24/7',
      description: 'Professional solutions for Lipjan. Installations, emergency repairs, and security systems by ElektroNova.',
      intro: 'At the crossroads of Kosovo, Lipjan requires fast and professional services. ElektroNova is always ready for any of your requests in Lipjan.',
      sections: [
        {
          title: '24/7 Electrical Emergency in Lipjan',
          content: 'For any short circuit or voltage problem, our team in Lipjan reacts immediately.'
        }
      ],
      installationExamples: [
        {
          title: 'Modern House',
          description: 'Full electrical system and security alarms.',
          image: '/images/stock/stock-16.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Emergency Repairs', 'Security Cameras', 'Alarms', 'Smart Home'],
      localBenefits: ['Fast Response', 'Long-term Experience', 'Local Support'],
      neighborhoods: ['Center', 'New Neighborhood', 'Sllovia']
    },
    'kamenice': {
      slug: 'kamenice',
      city: 'Kamenica',
      title: 'Electrical Services in Kamenica – ElektroNova',
      description: 'Professional electrician in Kamenica. Installations, repairs, and security systems for your property.',
      intro: 'Kamenica can rely on ElektroNova for maximum electrical safety. We offer certified services for every object in Kamenica.',
      sections: [
        {
          title: 'Security with 4K Cameras',
          content: 'We install monitoring systems that protect your home 24/7, with access from your phone.'
        }
      ],
      installationExamples: [
        {
          title: 'Local Business',
          description: 'Camera and alarm system installation.',
          image: '/images/stock/stock-14.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Repairs', 'Smart Home'],
      localBenefits: ['Reliability', 'Professional Technicians', 'Full Warranty'],
      neighborhoods: ['Center', 'Dardania', 'New Neighborhood']
    },
    'decan': {
      slug: 'decan',
      city: 'Decan',
      title: 'Electrician in Decan – Electrical Services & Security',
      description: 'Professional solutions for Decan. Electrical installations, 4K cameras, and security alarms by our team.',
      intro: 'Decan deserves safety and professionalism. ElektroNova brings the latest technology to the city of Decan, guaranteeing quality work.',
      sections: [
        {
          title: 'Installations for Villas and Homes',
          content: 'We are specialists in installations for tourist facilities and villas, using materials built to last.'
        }
      ],
      installationExamples: [
        {
          title: 'Decan Gorge Villa',
          description: 'Complete lighting and security system.',
          image: '/images/stock/stock-20.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Smart Home', 'Maintenance'],
      localBenefits: ['Terrain Knowledge', 'Premium Materials', 'Professional Experience'],
      neighborhoods: ['Center', 'Isniqi', 'Carrabregu']
    },
    'istog': {
      slug: 'istog',
      city: 'Istog',
      title: 'Electrical Services in Istog – ElektroNova',
      description: 'Professional electrician in Istog. Installations, repairs, and monitoring systems 24/7.',
      intro: 'Istog, as a city of natural beauty and rapid development, requires high electrical standards. ElektroNova is here to serve you.',
      sections: [
        {
          title: 'Protection from Strong Winds',
          content: 'In Istog, we focus our installations on safety against overloads and natural forces, protecting your devices.'
        }
      ],
      installationExamples: [
        {
          title: 'Modern House',
          description: 'Full monitoring and electrical network system.',
          image: '/images/stock/stock-16.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Emergency Repairs', 'Smart Home'],
      localBenefits: ['Resistant Installations', 'Technical Experience', '24h Support'],
      neighborhoods: ['Center', 'New Neighborhood', 'Banja']
    },
    'malisheve': {
      slug: 'malisheve',
      city: 'Malisheva',
      title: 'Electrician in Malisheva – Electrical Services & Security',
      description: 'Professional solutions for Malisheva. Installations, repairs, and security systems by ElektroNova.',
      intro: 'ElektroNova brings the highest standards of electrical safety to Malisheva. Our team ensures that every project is completed successfully and in record time.',
      sections: [
        {
          title: 'Solutions for Residences and Businesses',
          content: 'From family homes to commercial facilities, we offer installations that guarantee long-term safety.'
        }
      ],
      installationExamples: [
        {
          title: 'Family Home',
          description: 'Electrical network and security camera installation.',
          image: '/images/stock/stock-3.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Smart Home', 'Maintenance'],
      localBenefits: ['Quality Work', 'Safe Materials', 'Professional Experience'],
      neighborhoods: ['Center', 'New Neighborhood', 'Banja']
    },
    'skenderaj': {
      slug: 'skenderaj',
      city: 'Skenderaj',
      title: 'Electrician in Skenderaj – Electrical Services & Security',
      description: 'Professional electrical services in Skenderaj. Installations, repairs, and security systems by ElektroNova.',
      intro: 'In the heart of Drenica, ElektroNova offers safety and professionalism. We ensure every family in Skenderaj has a safe electrical network.',
      sections: [
        {
          title: 'Your Property Security',
          content: 'We install 4K monitoring systems and Ajax alarms that protect your property at all times.'
        }
      ],
      installationExamples: [
        {
          title: 'Professional Home',
          description: 'Full electrical system and 24/7 monitoring.',
          image: '/images/stock/stock-9.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Emergency Repairs', 'Maintenance'],
      localBenefits: ['Full Readiness', 'Schneider Materials', 'Local Support'],
      neighborhoods: ['Center', 'Prekazi', 'New Neighborhood']
    },
    'gracanice': {
      slug: 'gracanice',
      city: 'Gracanica',
      title: 'Electrical Services in Gracanica – ElektroNova',
      description: 'Professional electrician in Gracanica. Installations, repairs, and 24/7 monitoring systems.',
      intro: 'ElektroNova offers electrician services in Gracanica, guaranteeing electrical safety for all residents and businesses in the area.',
      sections: [
        {
          title: 'Electrical Network Modernization',
          content: 'We offer renovation services for old installations to adapt them to the requirements of modern devices.'
        }
      ],
      installationExamples: [
        {
          title: 'Commercial Building',
          description: 'Electrical panel and security network installation.',
          image: '/images/stock/stock-18.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Repairs', 'Smart Home'],
      localBenefits: ['Reliability', 'Certified Technicians', '24h Readiness'],
      neighborhoods: ['Center', 'New Neighborhood', 'Laplje Selo']
    },
    'kline': {
      slug: 'kline',
      city: 'Kline',
      title: 'Electrician in Kline – Electrical Services & Security 24/7',
      description: 'Professional solutions for Kline. Installations, emergency repairs, and security systems by ElektroNova.',
      intro: 'Kline, a city at the crossroads of important roads, requires fast electrical services. ElektroNova is always ready for you.',
      sections: [
        {
          title: 'Emergencies and Repairs',
          content: 'For any electrical problem in your home or business in Kline, we offer intervention within an hour.'
        }
      ],
      installationExamples: [
        {
          title: 'Gas Station',
          description: 'Electrical installation and security camera work.',
          image: '/images/stock/stock-14.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Emergency Repairs', 'Security Cameras', 'Alarms', 'Smart Home'],
      localBenefits: ['Speed', 'Guaranteed Work', 'Premium Materials'],
      neighborhoods: ['Center', 'New Neighborhood', 'Gllareva']
    },
    'shtime': {
      slug: 'shtime',
      city: 'Shtime',
      title: 'Electrician in Shtime – Electrical Services 24/7',
      description: 'Professional solutions for Shtime. Installations, repairs, and security systems by ElektroNova.',
      intro: 'Shtime can count on ElektroNova for every electrical need. We bring our professional experience directly to you.',
      sections: [
        {
          title: 'New Installations and Security',
          content: 'We design and execute modern electrical grids that protect your home from any danger.'
        }
      ],
      installationExamples: [
        {
          title: 'Family Home',
          description: 'Electrical network and camera installation.',
          image: '/images/stock/stock-20.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Repairs', 'Security Cameras', 'Alarms', 'Maintenance'],
      localBenefits: ['Fast Technicians', 'Reliability', 'Technical Support'],
      neighborhoods: ['Center', 'New Neighborhood', 'Petrova']
    },
    'obiliq': {
      slug: 'obiliq',
      city: 'Obiliq',
      title: 'Electrician in Obiliq – Electrical Services & Security 24/7',
      description: 'Professional solutions for Obiliq. Industrial installations, repairs, and monitoring systems by ElektroNova.',
      intro: 'Obiliq, as an important energy center, requires stable electrical installations. ElektroNova offers quality services for every facility in Obiliq.',
      sections: [
        {
          title: 'Industrial Electrical Installations',
          content: 'We are specialists in electrical grids that handle high energy demands, guaranteeing maximum safety.'
        }
      ],
      installationExamples: [
        {
          title: 'Family House',
          description: 'Full electrical installation and security cameras.',
          image: '/images/stock/stock-21.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Repairs', 'Smart Home'],
      localBenefits: ['Technical Expertise', 'Modern Equipment', 'Full Warranty'],
      neighborhoods: ['Center', 'Millosheva', 'Plemetina']
    },
    'drenas': {
      slug: 'drenas',
      city: 'Drenas',
      title: 'Electrician in Drenas – Electrical Services & Security',
      description: 'Professional electrical services in Drenas. Installations, repairs, and security systems by ElektroNova.',
      intro: 'ElektroNova brings electrical safety to the heart of Drenica. We offer certified services for all citizens of Drenas.',
      sections: [
        {
          title: 'Security with Cameras in Drenas',
          content: 'We install modern monitoring systems that protect your home and business 24/7.'
        }
      ],
      installationExamples: [
        {
          title: 'Commercial Center',
          description: 'Full monitoring and electrical network system.',
          image: '/images/stock/stock-21.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Maintenance', 'Lighting'],
      localBenefits: ['Fast Readiness', 'Quality Work', 'Local Support'],
      neighborhoods: ['Center', 'New Neighborhood', 'Komorani']
    },
    'fushe-kosove': {
      slug: 'fushe-kosove',
      city: 'Fushe Kosove',
      title: 'Electrician in Fushe Kosove – Electrical Services 24/7',
      description: 'Professional electrical services in Fushe Kosove. Installations in residential complexes and emergency repairs.',
      intro: 'Fushe Kosove is developing fast, and we are your partner for every electrical project and security system.',
      sections: [
        {
          title: 'Installations in Residential Complexes',
          content: 'We offer maintenance and modern electrical installations for new buildings in Fushe Kosove.'
        }
      ],
      installationExamples: [
        {
          title: 'Building Block',
          description: 'Electrical network and camera installation.',
          image: '/images/stock/stock-3.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Smart Home', 'Maintenance'],
      localBenefits: ['Full Coverage', 'Fast Technicians', 'Official Warranty'],
      neighborhoods: ['Center', 'New Neighborhood', 'Bresje']
    },
    'junik': {
      slug: 'junik',
      city: 'Junik',
      title: 'Electrician in Junik – Electrical Services & Security',
      description: 'Professional electrical solutions for Junik. Installations, repairs, and security systems by ElektroNova.',
      intro: 'In Junik, ElektroNova offers elite electrician services, respecting tradition while bringing the latest technology.',
      sections: [
        {
          title: 'Security in Traditional Houses',
          content: 'We offer aesthetic installations that fit Junik\'s unique architecture, guaranteeing maximum safety.'
        }
      ],
      installationExamples: [
        {
          title: 'Tourist Kulla',
          description: 'Electrical network and decorative lighting installation.',
          image: '/images/stock/stock-4.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Smart Home', 'Maintenance'],
      localBenefits: ['Professional Technicians', 'Quality Materials', 'Long-term Warranty'],
      neighborhoods: ['Center', 'Lower Neighborhood', 'Upper Neighborhood']
    },
    'hani-i-elezit': {
      slug: 'hani-i-elezit',
      city: 'Hani i Elezit',
      title: 'Electrical Services in Hani i Elezit – ElektroNova',
      description: 'Professional electrician in Hani i Elezit. Installations, repairs, and 24/7 monitoring systems.',
      intro: 'At the border of Kosovo, ElektroNova brings electrical safety to Hani i Elezit. We offer fast services for your homes and businesses.',
      sections: [
        {
          title: 'Installations for Border Businesses',
          content: 'We offer dedicated services for warehouses and businesses operating in the border zone, guaranteeing 24/7 monitoring.'
        }
      ],
      installationExamples: [
        {
          title: 'Industrial Warehouse',
          description: 'Electrical network and security camera installation.',
          image: '/images/stock/stock-18.webp'
        }
      ],
      servicesOffered: ['Electrical Installations', 'Security Cameras', 'Alarms', 'Repairs', 'Maintenance'],
      localBenefits: ['24h Readiness', 'Premium Materials', 'Professional Experience'],
      neighborhoods: ['Center', 'New Neighborhood', 'Paldenica']
    }
  }
};

export const locationsData = locations;

export const getLocationBySlug = (slug: string, localeCode: string): LocationContent | undefined => {
  return locations[localeCode as 'sq' | 'en']?.[slug] || 
         Object.values(locations[localeCode as 'sq' | 'en'] || {}).find(l => l.slug === slug);
};
