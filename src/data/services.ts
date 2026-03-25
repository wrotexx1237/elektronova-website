export interface ServiceContent {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  benefits: string[];
  useCases: string[];
  technology: string[];
  installationProcess: string[];
  faq: { q: string; a: string }[];
  relatedArticles?: string[];
  iconName: string;
}

export const servicesData: Record<string, Record<string, ServiceContent>> = {
  sq: {
    'instalimi-kamerave-sigurise': {
      slug: 'instalimi-kamerave-sigurise',
      title: 'Instalimi i Kamerave të Sigurisë',
      description: 'Zgjidhje profesionale për monitorim 24/7 me teknologjinë më të fundit CCTV.',
      longDescription: 'Në ElektroNova, ne ofrojmë shërbimet më profesionale për **instalimin e kamerave të sigurisë në Pejë** dhe në tërë territorin e Kosovës. Siguria e pronës suaj, qoftë ajo shtëpi, biznes apo objekt industrial, fillon me një monitorim efikas dhe të besueshëm. Ne përdorim pajisjet më të avancuara të brendeve lider botërorë si Dahua dhe Hikvision, duke garantuar cilësi kristal të figurës (deri në 4K) dhe performancë të lartë edhe në kushtet klimatike specifike të Rrafshit të Dukagjinit.\n\n### Pse është i rëndësishëm instalimi profesional në Kosovë?\nInstalimi i kamerave nuk është thjesht vendosja e pajisjeve në mur. Ai kërkon një analizë të detajuar të dritës, rrezeve të fushëveprimit dhe mbrojtjes nga vandalizmi. Duke pasur parasysh nevojën për siguri proaktive në qytetet tona, ne sigurohemi që çdo kabllim të jetë i fshehur dhe i mbrojtur brenda tubave dhe kutive mbrojtëse profesionale. Kjo rrit jetëgjatësinë e sistemit dhe parandalon ndërhyrjet e paautorizuara. Ne mbulojmë çdo qytet, nga Prishtina në Pejë, duke ofruar ndërhyrje të shpejtë brenda disa orëve.\n\nZgjidhjet tona për **instalim kamerat e sigurisë në Kosovë** janë të dizajnuara për t\'ju dhënë qetësi shpirtërore. Çdo projekt fillon me një vlerësim falas në terren, ku teknikët tanë projektojnë pikat strategjike të monitorimit për të shmangur zonat e vdekura. Ne jemi të specializuar në integrimin e Inteligjencës Artificiale që lejon njohjen e fytyrave, targave të automjeteve dhe detektimin e personave në perimetra të ndaluar.\n\n### Monitoroni shtëpinë apo biznesin tuaj kudo që jeni\nSistemet tona moderne lidhen me aplikacione mobile të sigurta. Pavarësisht nëse jeni në Pejë, Prishtinë apo jashtë vendit, ju mund të shihni kamerat tuaja në kohë reale. Ky shërbim është kritik për pronarët e bizneseve në Kosovë që duan të kenë kontroll mbi pronën e tyre në çdo sekondë. Teknologjia AI redukton alarmet false nga kafshët apo moti, duke ju njoftuar vetëm kur ka një rrezik real.\n\n**Lidhja me shërbime të tjera:**\nPër siguri maksimale, rekomandojmë kombinimin e kamerave me [Sistemet e Alarmit](/sq/sherbimet/sistemet-alarmit). Informohuni më shumë mbi zgjedhjen e duhur në artikullin tonë: [Si të zgjedhësh kamerat e sigurisë në Kosovë?](/sq/blogu/si-te-zgjedhesh-kamerat-e-sigurise-kosove).\n\n### Mbështetja Lokale dhe Mirëmbajtja\nElektroNova, me seli në qytetin e Pejës, ofron mbështetje teknike 24/7. Ne njohim mirë rrjetin elektrik në Kosovë dhe instalojmë stabilizues që mbrojnë kamerat nga luhatjet e tensionit. Shërbimi ynë përfshin edhe mirëmbajtjen periodike për të siguruar që lentet janë të pastra dhe regjistrimi po kryhet pa ndërprerje.',
      benefits: [
        'Monitorim në kohë reale nga celulari me enkriptim të lartë',
        'Cilësi e lartë e figurës (4K / 8MP) për detaje kristal',
        'Vizion nate i avancuar me teknologji Full-Color ose IR',
        'Njoftime automatike inteligjente (AI Person/Vehicle Detection)',
        'Kursim në koston e sigurimit dhe parandalim i vjedhjeve',
        'Arkivim i videove në Cloud ose lokalisht për kohë të gjatë'
      ],
      useCases: [
        'Shtëpi dhe villa private me rrethime të gjera',
        'Dyqane, markete dhe qendra tregtare të mëdha',
        'Zgjidhje industriale për fabrika dhe depo',
        'Hapësira publike, institucione arsimore dhe parkingje'
      ],
      technology: [
        'Inteligjencë Artificiale për detektim njerëzish dhe fytyrash',
        'Teknologjia Full-Color për pamje me ngjyra 24/7',
        'Kompresim video H.265+ për kursim drastik të memorisë',
        'Lidhje IP, Analogi HDCVI dhe sisteme Wireless'
      ],
      installationProcess: [
        'Konsultimi dhe vlerësimi falas i lokacionit në terren',
        'Projektimi teknik i rrjetit dhe skicimi i pikave të mbulimit',
        'Instalimi fizik, kabllimi dhe montimi i pajisjeve',
        'Konfigurimi i serverit (NVR/DVR) dhe aplikacioneve mobile',
        'Testimi i performancës dhe trajnimi i detajuar i klientit'
      ],
      faq: [
        { q: 'A mund t\'i shoh kamerat nga telefoni im?', a: 'Po, të gjitha sistemet tona vijnë me aplikacione falas për iOS dhe Android me qasje të enkriptuar.' },
        { q: 'Sa kohë zgjat instalimi i një sistemi?', a: 'Zakonisht një shtëpi mesatare përfundohet brenda ditës, ndërsa bizneset varen nga kompleksiteti.' },
        { q: 'Çfarë ndodh nëse ndalet rryma?', a: 'Sistemet tona mund të pajisen me UPS (bateri rezervë) që mbajnë kamerat ndezur për orë të tëra.' }
      ],
      relatedArticles: ['5-gabime-kamera-sigurie', 'sa-kushton-instalimi-i-kamerave-te-sigurise-ne-kosove', 'kamera-sigurie-kosove-udhezues-2026'],
      iconName: 'camera'
    },
    'sistemet-dahua-cctv': {
      slug: 'sistemet-dahua-cctv',
      title: 'Sistemet Dahua CCTV',
      description: 'Teknologjia lider botërore për siguri maksimale dhe inteligjencë artificiale.',
      longDescription: 'Dahua Technology është lider botëror në fushën e video-vëzhgimit, dhe në ElektroNova, ne jemi partnerët tuaj të besueshëm për **sistemet Dahua në Kosovë**. Specializimi ynë përqendrohet në instalimin e teknologjisë më të fundit AI nga Dahua, duke ofruar siguri inteligjente për shtëpitë dhe korporatat më të mëdha në vend. Pse të zgjidhni Dahua? Sepse është një investim që garanton cilësi, besueshmëri dhe inovacion të vazhdueshëm në çdo produkt.\n\n### Teknologjia WizSense dhe WizMind në Pejë\nKamerat Dahua që ne instalojmë në Pejë dhe qytete të tjera të Kosovës përdorin çipat më të avancuar të Inteligjencës Artificiale. Teknologjia WizSense fokusohet vetëm në objektet që kanë rëndësi: njerëzit dhe makinat. Kjo do të thotë se ju nuk do të shqetësoheni nga alarmet e lëvizjeve të pemëve apo dritat gjatë natës. Për projektet më komplekse në institucione, ne ofrojmë linjën WizMind, e cila mundëson matjen e temperaturës, numërimin e njerëzve dhe analiza të detajuara të sjelljes.\n\n### Kamerat TiOC - Siguri 3-në-1 për biznese\nNjë ndër zgjedhjet më të kërkuara nga klientët tanë në Kosovë janë kamerat TiOC (Three-in-One Camera). Këto pajisje kombinojnë monitorimin 24/7 me ngjyra të plota (Full-Color), alarmet aktive me drita dhe sirenë, si dhe AI proaktive. Nëse dikush hyn në perimetrin tuaj të siguruar në Pejë, kamera do të lëshojë një njoftim zanor dhe drita paralajmëruese, duke parandaluar krimin para se të ndodhë.\n\n**Integrimi i plotë dhe SEO:**\nSistemet Dahua integrohen shkëlqyeshëm me [Sistemet e Alarmit](/sq/sherbimet/sistemet-alarmit) ekzistuese. Gjithashtu, mund të informoheni për kostot e instalimit në artikullin tonë: [Sa kushton instalimi i kamerave të sigurisë në Kosovë?](/sq/blogu/sa-kushton-instalimi-i-kamerave-sigurise-kosove).\n\n### Pse ElektroNova për Sistemet Dahua?\nNe ofrojmë projektim teknik, instalim të certifikuar dhe një garanci të plotë. Eksperti ynë sigurohet që NVR-të të jenë të konfiguruar për të maksimizuar hapësirën e memorisë përmes kodeve H.265+. Me seli në Pejë, ne jemi gjithmonë afër jush për çdo servisim apo përditësim të sistemit tuaj. Ne garantojmë që pajisjet tona janë origjinale dhe vijnë me softuerin më të fundit të sigurisë.',
      benefits: [
        'Analitikë inteligjente e videos (Facial Recognition)',
        'Integrim i lehtë me sisteme alarmi dhe kontrolli hyrjeje',
        'Besueshmëri e klasit botëror me garancion të gjatë',
        'Aplikacione intuitive dhe të shpejta (DMSS)',
        'Cilësi superiore e figurës me teknologji Starlight'
      ],
      useCases: [
        'Siguri bankare dhe institucione financiare',
        'Biznese me trafik të lartë dhe dyqane bizhuterish',
        'Menaxhim i trafikut rrugor dhe monitorim qyteti',
        'Hotele, restorante dhe vila luksoze'
      ],
      technology: [
        'WizSense dhe WizMind (AI Deep Learning)',
        'TiOC (Three-in-One Camera: Full-color, Siren, Warning lights)',
        'PoE (Power over Ethernet) për instalim të thjeshtë',
        'Starlight Technology për performancë në dritë ultra-të-ulët'
      ],
      installationProcess: [
        'Vlerësimi teknik i nevojave për AI',
        'Përzgjedhja e modelit optimal nga gama Dahua',
        'Konfigurimi i NVR-it inteligjent dhe serverëve',
        'Vendosja e perimeterave të sigurisë (Tripwire/Intrusion)',
        'Testimi i saktësisë së njoftimeve në celular'
      ],
      faq: [
        { q: 'Pse Dahua është zgjedhje më e mirë se brendet tjera?', a: 'Për shkak të inovacionit të pasur në AI dhe raportit të shkëlqyeshëm çmim/cilësi për tregun tonë.' },
        { q: 'A mund të përdoret Dahua me sistemet ekzistuese?', a: 'Po, shumica e pajisjeve Dahua mbështesin standardin ONVIF për integrim me brende tjera.' }
      ],
      relatedArticles: ['dahua-vs-hikvision', 'kamerat-me-te-mira-per-shtepi', '5-gabime-kamera-sigurie'],
      iconName: 'video'
    },
    'sistemet-alarmit': {
      slug: 'sistemet-alarmit',
      title: 'Sistemet e Alarmit dhe Anti-Vjedhje',
      description: 'Mbrojtje e pakonpizuar me sisteme alarmi inteligjente dhe detektim proaktiv.',
      longDescription: 'Siguria e familjes dhe biznesit tuaj është prioriteti ynë kryesor. Në ElektroNova, ne ofrojmë sistemet më të sigurta të **alarmit në Kosovë**, duke përdorur teknologji hibride që kombinon besueshmërinë e kabllos me fleksibilitetin e wireless-it. Sistemet tona detektojnë çdo hyrje të paautorizuar në çastin e parë dhe ju njoftojnë menjëherë në telefonin tuaj. Ne punojmë me brendet elitare si Ajax, DSC dhe Paradox, të njohura për mbrojtjen e tyre kundër ndërhyrjeve.\n\n### Pse ju nevojitet një alarm në Pejë?\nAlarmi nuk shërben vetëm kur ju nuk jeni aty. Me funksionin "Stay Mode", ju mund të siguroni perimetrin e shtëpisë tuaj në Pejë (dyert dhe dritaret) ndërkohë që jeni brenda. Kjo ju jep një mbrojtje 24-orëshe pa kufizuar lëvizjen tuaj. Sistemet tona inteligjente janë imun ndaj kafshëve shtëpiake, duke evituar alarmet e panevojshme që mund të shqetësojnë fqinjtë. Në qytetin e Pejës, ku afërsia me qytetarët është e madhe, një alarm me sirenë të fuqishme është mjeti më i mirë parandalues.\n\nIntegrimi me [Instalimin e Kamerave](/sq/sherbimet/instalimi-kamerave-sigurise) lejon verifikimin vizual. Nëse alarmi bie, ju mund të hapni kamerat në telefonin tuaj dhe të shihni nëse bëhet fjalë për një rrezik real apo një gabim njerëzor. Kjo teknologji sinkronizuese është ajo që e bën një shtëpi vërtet inteligjente dhe të sigurt. ElektroNova ofron gjithashtu mirëmbajtje të rregullt dhe ndërrim të baterive rezervë që sistemi juaj të mos dështojë kurrë.\n\n### Shërbim i Shpejtë dhe Instalim pa Dëmtime\nShumë klientë në Kosovë shqetësohen për shpimet e mureve. Ne përdorim sisteme Wireless profesionale që instalohen pa asnjë dëmtim estetik në shtëpinë tuaj. Për të shmangur gabimet e zakonshme gjatë vendosjes, ju ftojmë të lexoni: [5 gabime që njerëzit bëjnë kur instalojnë kamera dhe alarme](/sq/blogu/5-gabime-kamera-sigurie). Ne jemi këtu për t\'u siguruar që sistemi juaj të jetë i pakonpizueshëm nga asnjë thyerës.',
      benefits: [
        'Detektim i menjëhershëm i thyerjes së dyerve apo dritareve',
        'Sirena të fuqishme për alarmim të jashtëm dhe të brendshëm',
        'Menaxhim i plotë përmes panelit dhe aplikacionit mobil',
        'Bateri rezervë që mbajnë sistemin ndezur edhe pa rrymë',
        'Senzorë inteligjentë që nuk reagojnë ndaj kafshëve',
        'Lidhje me qendrat e monitorimit emergjent'
      ],
      useCases: [
        'Apartamente dhe shtëpi private',
        'Depo mallrash dhe dyqane pakice',
        'Zyra biznesi dhe laboratorë teknologjikë',
        'Vila pushimi në zona malore'
      ],
      technology: [
        'Teknologji Wireless me rreze deri në 2000 metra (Ajax)',
        'Senzorë Lëvizjeje (PIR), Akustikë (Glass Break) dhe Magnetikë',
        'Detektorë të tymit dhe gazit të integruar',
        'Komunikim përmes Wi-Fi, Ethernet dhe GPRS/4G'
      ],
      installationProcess: [
        'Zbulimi i pikave të dobëta të hyrjes',
        'Zgjedhja midis sistemit me kabllo apo wireless',
        'Montimi i panelit qendror dhe senzorëve strategjikë',
        'Programimi i kodeve të qasjes dhe telekomandave',
        'Verifikimi i sinjalit dhe njoftimeve në telefon'
      ],
      faq: [
        { q: 'A mund ta aktivizoj alarmin kur jam brenda shtëpisë?', a: 'Po, sistemi ka modalitetin "Night Mode" që mbron vetëm perimetrin e jashtëm.' },
        { q: 'Çfarë ndodh nëse dikush e pret internetin?', a: 'Sistemi aktivizon sirenën lokalisht dhe dërgon njoftim përmes kartelës backup GSM.' }
      ],
      relatedArticles: ['rendesia-e-alarmit-wireless', 'kamera-sigurie-kosove-udhezues-2026', '5-gabime-kamera-sigurie'],
      iconName: 'shield'
    },
    'instalime-elektrike': {
      slug: 'instalime-elektrike',
      title: 'Instalime Elektrike Profesionale',
      description: 'Shërbime të plota të instalimeve elektrike për shtëpi, banesa dhe biznese në tërë Kosovën.',
      longDescription: "Instalimet elektrike janë shtylla kurrizore e çdo objekti modern. Në ElektroNova, ne ofrojmë **instalime elektrike profesionale në Pejë** dhe në tërë territorin e Kosovës, duke garantuar siguri, efikasitet dhe jetëgjatësi për rrjetin tuaj. Pavarësisht nëse jeni duke ndërtuar një shtëpi të re apo po renovoni një objekt ekzistues, ekipi ynë i inxhinierëve dhe elektricistëve të certifikuar është i gatshëm t'ju ofrojë zgjedhjet më të mira teknike.\n\n### Pse është i rëndësishëm instalimi profesional?\nShumë zjarre në Kosovë shkaktohen nga instalimet e dobëta elektrike. Ne nuk bëjmë thjesht lidhje kabllosh; ne projektojmë sisteme që përballojnë ngarkesën e pajisjeve të sotme moderne. Nga përzgjedhja e trashësisë së duhur të telave deri te instalimi i paneleve moderne me mbrojtje FI, çdo detaj llogaritet me precizitet. Ne përdorim vetëm materiale të brendeve lider botërorë si Schneider, ABB dhe Legrand, duke siguruar që investimi juaj të jetë i mbrojtur për dekada.\n\n### Ekspertiza jonë në Pejë dhe Kosovë\nSi një kompani me seli në qytetin e Pejës, ne njohim mirë specifikat e rrjetit elektrik në rajonin tonë. Ne ofrojmë konsulta falas në vendngjarje për të vlerësuar nevojat tuaja. Shërbimet tona përfshijnë shtrirjen e kabllimit, montimin e kutive shpërndarëse, instalimin e ndriçimit dhe tokëzimin e plotë të objektit. Çdo projekt shoqërohet me skemat përkatëse dhe testimet e nevojshme të sigurisë para lëshimit në punë.\n\n**Integrimi me Sigurinë:**\nInstalimi i mirë elektrik është baza për [Kamerat e Sigurisë](/sq/sherbimet/instalimi-kamerave-sigurise) dhe [Sistemet e Alarmit](/sq/sherbimet/sistemet-alarmit). Lexoni më shumë në faqen tonë mbi: [Rëndësia e tokëzimit për pajisje elektronike](/sq/blogu/rendesia-e-tokezimit).\n\n### Shërbime për Biznese (Sektori Komercial)\nPër bizneset në Kosovë, ne ofrojmë instalime industriale që përfshijnë panele komanduese, ndriçim emergjent dhe sisteme UPS. Ne e kuptojmë se çdo minutë ndërprerje kushton, prandaj punojmë me orare fleksibile për të minimizuar shqetësimet gjatë procesit të instalimit.",
      benefits: [
        'Siguri maksimale sipas standardeve evropiane EN',
        'Përdorimi i materialeve cilësore (Schneider, ABB, Legrand)',
        'Projektim i personalizuar për çdo lloj objekti',
        'Garanci afatgjatë për të gjitha punimet',
        'Mbështetje teknike 24/7 pas përfundimit të instalimit'
      ],
      useCases: [
        'Shtëpi të reja dhe vila luksoze',
        'Objekte banesore dhe komplekse të reja',
        'Dyqane, zyra dhe qendra tregtare',
        'Objekte industriale dhe depo prodhimi'
      ],
      technology: [
        'Kabllim i mbrojtur pa halogen (LSZH)',
        'Panele elektrike inteligjente me siguresa automatike',
        'Sisteme të mbrojtjes nga mbingarkesa (SPD)',
        'Matës profesionalë të rezistencës së tokëzimit'
      ],
      installationProcess: [
        'Konsultimi dhe planifikimi i rrjetit elektrik',
        'Shtrirja e kabllove dhe montimi i kutive në mur',
        'Instalimi i panelit kryesor dhe kutive shpërndarëse',
        'Montimi i prizave, ndërprerësve dhe pikave të ndriçimit',
        'Testimi final i qarkut dhe lëshimi i certifikatës së sigurisë'
      ],
      faq: [
        { q: 'Sa zgjat instalimi elektrik i një shtëpie mesatare?', a: 'Zakonisht procesi zgjat 7 deri në 14 ditë pune, varësisht nga madhësia.' },
        { q: 'A ofroni certifikatë për instalimin e bërë?', a: 'Po, çdo instalim i yni testohet dhe certifikohet për siguri teknike.' }
      ],
      relatedArticles: ['sa-kushton-instalimi-elektrik', '5-shenja-nderrim-instalimi', 'elektricist-urgjent'],
      iconName: 'zap'
    },
    'riparime-elektrike': {
      slug: 'riparime-elektrike',
      title: 'Riparime Elektrike dhe Mirëmbajtje',
      description: 'Zgjidhje të shpejta dhe të sigurta për çdo defekt elektrik në shtëpinë apo biznesin tuaj.',
      longDescription: "Defektet elektrike mund të ndodhin në çdo kohë dhe shpesh paraqesin rrezik serioz për sigurinë e njerëzve dhe pronës. ElektroNova ofron shërbime të specializuara për **riparime elektrike në Pejë** dhe tërë Kosovën, duke siguruar që rrjeti juaj të kthehet në funksionim normal brenda një kohe rekord. Ne trajtojmë çdo gjë, nga prizat e djegura deri te problemet komplekse të tensionit në biznese.\n\n### Ndërhyrje Profesionale për Defektet në Kosovë\nNë tregun e Kosovës, ku luhatjet e tensionit janë të shpeshta, mbrojtja e pajisjeve tuaja është jetike. Teknikët tanë përdorin aparatura diagnostikuese të teknologjisë së fundit për të gjetur burimin e saktë të problemit, duke shmangur riparimet e përkohshme që mund të shkaktojnë dëme më të mëdha më vonë. Ne jemi të certifikuar për të ndërhyrë në sisteme industriale dhe rezidenciale, duke garantuar siguri maksimale sipas standardeve ISO.\n\n### Pse janë të rëndësishme riparimet e rregullta?\nNjë lidhje e dobët elektrike mund të shkaktojë nxehje të telave dhe potencialisht zjarr. Shumë zjarre në Kosovë shkaktohen pikërisht nga instalimet e vjetruara apo riparimet e bëra keq. Në ElektroNova, ne nuk bëjmë thjesht 'arnime'. Ne sigurohemi që pika problematike të riparohet në mënyrë përfundimtare dhe kontrollojmë pikat përreth për të parandaluar defektet e ardhshme. Shërbimi ynë për **elektricist urgjent në Pejë** është i disponueshëm 24/7 për rastet kritike.\n\n**Siguria e Pajisjeve:**\nPër të shmangur dëmtimet e pajisjeve elektronike si [Kamerat e Sigurisë](/sq/sherbimet/instalimi-kamerave-sigurise), rekomandojmë instalimin e mbrojtësve nga mbingarkesa. Lexoni më shumë në blogun tonë: [5 shenja që instalimi elektrik duhet ndërruar](/sq/blogu/5-shenja-instalimi-elektrik-duhet-nderruar).\n\n### Mirëmbajtja Preventive për Biznese\nPër bizneset, një ndërprerje e rrymës do të thotë humbje financiare. ElektroNova ofron kontrata mirëmbajtjeje për markete, fabrika dhe zyra. Ne kryejmë inspektime periodike me kamera termike për të zbuluar nxehjen e siguresave para se ato të dështojnë. Ky është investimi më smart që mund të bëni për vazhdimësinë e biznesit tuaj.",
      benefits: [
        'Diagnostikim i shpejtë dhe i saktë i defekteve',
        'Përdorimi i pjesëve rezervë origjinale dhe cilësore',
        'Siguri e garantuar pas çdo ndërhyrjeje',
        'Minimizim i kohës së ndërprerjes së energjisë',
        'Këshillim për mbrojtjen e pajisjeve elektronike'
      ],
      useCases: [
        'Riparimi i prizave, ndërprerësve dhe ndriçimit',
        'Zëvendësimi i siguresave të vjetruara',
        'Zgjidhja e problemeve me tokëzim',
        'Riparime urgjente pas lidhjeve të shkurtra'
      ],
      technology: [
        'Kamera termike për zbulimin e nxehjes së telave',
        'Multimetra profesionalë dhe matës të rezistencës së tokëzimit',
        'Siguresa automatike të brendeve Schneider dhe ABB'
      ],
      installationProcess: [
        'Pranimi i thirrjes dhe vlerësimi fillestar i rrezikut',
        'Arritja në lokacion dhe diagnostikimi me pajisje matëse',
        'Izolimi i zonës problematike për siguri',
        'Riparimi apo zëvendësimi i komponentëve të dëmtuar',
        'Testimi final i ngarkesës dhe lëshimi në punë'
      ],
      faq: [
        { q: 'Sa shpejt mund të vini për një riparim?', a: 'Në qytetin e Pejës vijmë brenda 30-60 minutave, ndërsa në qytetet tjera varet nga distanca.' },
        { q: 'A ka garanci për riparimet që bëni?', a: 'Po, çdo ndërhyrje e jona dhe pjesë e ndërruar ka garancinë e saj teknike.' }
      ],
      relatedArticles: ['pse-ndalet-rryma', 'elektricist-urgjent'],
      iconName: 'tool'
    },

    'nderrim-instalimi-elektrik': {
      slug: 'nderrim-instalimi-elektrik',
      title: 'Ndërrimi i Instalimit Elektrik (Rewiring)',
      description: 'Modernizoni sigurinë e shtëpisë tuaj me ndërrim të plotë të kabllimit të vjetër.',
      longDescription: "Nëse jetoni në një shtëpi të ndërtuar para 30 apo 40 vitesh në Kosovë, ka shumë mundësi që instalimi juaj elektrik të jetë i vjetruar dhe i rrezikshëm. ElektroNova është e specializuar në **ndërrimin e instalimeve elektrike në Pejë** dhe tërë Kosovën, duke sjellë shtëpinë tuaj në standardet e vitit 2026. Ky është një proces kompleks që kërkon planifikim të detajuar dhe ekzekutim preciz për të garantuar një jetë të sigurt për dekadas e ardhshme.\n\n### Pse duhet të bëni 'Rewiring'?\nInstalimet e vjetra me tela alumini apo izolim të thërrmueshëm nuk janë të dizajnuara për të përballuar ngarkesën e pajisjeve të sotme komun kondicionerët, furrat elektrike dhe sistemet e [Smart Home](/sq/sherbimet/smart-home-automatizimi). Mbingarkesa në tela të vjetër është shkaktari numër një i zjarreve në shtëpitë në Kosovë. Ndërrimi i instalimit nuk është vetëm çështje sigurie, por edhe komoditeti; ne shtojmë priza aty ku ju nevojiten dhe optimizojmë rrjetin për t'i shërbyer teknologjisë moderne.\n\n### Procesi i Punës në ElektroNova\nNdërrimi i plotë i kabllimit mund të duket i frikshëm, por ekipi ynë në Pejë e bën atë në mënyrë të strukturuar dhe me sa më pak rrëmujë. Ne përdorim kabllo bakri me izolim të trefishtë dhe instalojmë panele të reja me mbrojtje FI (RCD) që mbrojnë njerëzit nga goditjet elektrike. Çdo kabllo shënohet dhe dokumentohet, në mënyrë që në të ardhmen ta dini saktësisht ku kalon çdo linjë. Kjo rrit vlerën e shtëpisë tuaj në tregun e patundshmërive në Kosovë.\n\n**Udhëzues për pronarët:**\nPara se të filloni, informohuni mbi kostot dhe procesin në artikullin tonë: [Sa kushton ndërrimi i instalimit elektrik në Kosovë?](/sq/blogu/sa-kushton-instalimi-elektrik-shtepie-kosove).\n\n### Siguri dhe Certifikim\nPas përfundimit të punimeve, ne kryejmë matje të plota të rezistencës së izolimit dhe tokëzimit. Ju merrni një certifikatë teknike që vërteton se shtëpia juaj është 100% e sigurt. Si lider në Pejë, ElektroNova garanton se çdo kabllo dhe siguresë e instaluar është e brendeve më të mira botërore, duke ju dhënë qetësi për 50 vitet e ardhshme.",
      benefits: [
        'Eliminim i plotë i rrezikut nga zjarri elektrik',
        'Mundësi për të shtuar priza dhe ndriçim të ri',
        'Kursim i energjisë përmes kabllimit efikas',
        'Rritje e konsiderueshme e vlerës së pronës',
        'Përshtatshmëri me sistemet Smart Home dhe Solar'
      ],
      useCases: [
        'Shtëpi dhe banesa të vjetra (mbi 25 vjet)',
        'Objekte që po kalojnë në restaurim të plotë',
        'Biznese që po shtojnë makineri të rënda',
        'Ndërtesa që kanë pasur probleme të shpeshta me siguresa'
      ],
      technology: [
        'Kabllo bakri pa halogen (LSZH) për siguri nga tymi',
        'Gypa mbrojtës të qëndrueshëm ndaj zjarrit',
        'Sisteme moderne të shpërndarjes (Busbar)'
      ],
      installationProcess: [
        'Inspektimi i detajuar i instalimit ekzistues',
        'Hartimi i planit të ri të shpërndarjes elektrike',
        'Heqja e kabllove të vjetra (aty ku është e mundur)',
        'Shtrirja e linjave të reja dhe montimi i kutive',
        'Instalimi i panelit i ri dhe testimi i pikave'
      ],
      faq: [
        { q: 'A duhet të dal nga shtëpia gjatë punimeve?', a: 'Jo domosdoshmërish, ne punojmë zonë pas zone për të minimizuar shqetësimet.' },
        { q: 'Sa kohë zgjat ndërrimi i plotë i instalimit?', a: 'Për një shtëpi standarde 100m2, procesi zgjat zakonisht 5-10 ditë pune.' }
      ],
      relatedArticles: ['5-shenja-nderrim-instalimi', 'sa-kushton-instalimi-elektrik'],
      iconName: 'refresh'
    },
    'instalim-ndricimi': {
      slug: 'instalim-ndricimi',
      title: 'Instalim Ndriçimi Modern dhe LED',
      description: 'Transformoni ambientin tuaj me ndriçim inteligjent dhe efikas që kursen energji.',
      longDescription: "Ndriçimi nuk është vetëm mjet për të parë natën; ai është shpirti i dekorit të shtëpisë tuaj dhe faktor kyç në produktivitetin e biznesit. ElektroNova ofron shërbime elite për **instalim ndriçimi në Pejë** dhe tërë Kosovën, duke u fokusuar në teknologjinë LED dhe sistemet inteligjente të kontrollit. Ne kombinojmë inxhinierinë elektrike me dizajnin e dritës për të krijuar ambiente mahnitëse.\n\n### Ndriçimi LED në Kosovë: Kursim dhe Estetikë\nKalimi në ndriçimin LED është investimi më i thjeshtë dhe më efikas që mund të bëni. Në Kosovë, ku kostoja e energjisë është në rritje, sistemet tona LED reduktojnë shpenzimet për ndriçim deri në 80%. Ne nuk instalojmë vetëm llamba; ne projektojmë skema ndriçimi që theksojnë arkitekturën e shtëpisë tuaj në Pejë apo Prishtinë. Nga dritat e fshehura në tavan deri te ndriçimi i oborrit dhe fasadës, ne ofrojmë zgjedhje 360 gradë.\n\n### Inteligjenca e Dritës (Smart Lighting)\nImagjinoni të kontrolloni intensitetin e dritës dhe ngjyrën nga telefoni juaj apo përmes zërit. Sistemet tona de ndriçimit smart integrohen me platformat si Apple HomeKit dhe Google Home. Kjo lejon krijimin e skenarëve: 'Mëngjes' me dritë të butë që ju zgjon natyrshëm, apo 'Siguri' ku dritat e jashtme ndizen automatikisht nëse [Kamerat e Sigurisë](/sq/sherbimet/instalimi-kamerave-sigurise) detektojnë lëvizje. Ky është standardi i ri i jetesës që ElektroNova sjell në shtëpitë tuaja.\n\n**Ide për ndriçim:**\nZbuloni se si ndriçimi mund të përmirësojë sigurinë në artikullin tonë: [Si të instaloni ndriçim inteligjent në shtëpi](/sq/blogu/instalimi-ndricimi-inteligjent-shtepi).\n\n### Ndriçimi Industrial dhe Publik\nElektroNova ka përvojë të gjerë në ndriçimin e hapësirave të mëdha si depo, fabrika dhe parkingje në tërë Kosovën. Ne përdorim projektorë me fuqi të lartë dhe senzorë lëvizjeje industrialë që garantojnë siguri dhe kursim maksimal. Çdo projekt shoqërohet me një kalkulim të luksit (ndriçueshmërisë) për të siguruar që çdo kënd të jetë i mbuluar saktë sipas rregulloreve të shëndetit dhe sigurisë në punë.",
      benefits: [
        'Reduktim i faturave të rrymës deri në 80%',
        'Jetëgjatësi e dritave LED deri në 50,000 orë pune',
        'Kontroll i plotë i ambientit përmes smartfonit',
        'Përmirësim i sigurisë së jashtme përmes ndriçimit strategjik',
        'Atmosferë e personalizuar për çdo dhomë'
      ],
      useCases: [
        'Ndriçim dekorativ për shtëpi dhe vila',
        'Ndriçim profesional për zyra dhe dyqane',
        'Ndriçim i jashtëm për kopshte dhe fasada',
        'Sisteme emergjente të ndriçimit për biznese'
      ],
      technology: [
        'Chip-et LED më të fundit me efikasitet mbi 120 lm/W',
        'Sisteme kontrolli DALI dhe Zigbee',
        'Senzorë inteligjentë të dritës së ditës (Daylight harvesting)'
      ],
      installationProcess: [
        'Konsultimi për nevojat estetike dhe funksionale',
        'Kalkulimi i ndriçueshmërisë së nevojshme (Dialux)',
        'Shtrirja e kabllimit dhe montimi i dritave',
        'Programimi i dimerave dhe sistemeve smart',
        'Verifikimi i konsumit dhe performancës'
      ],
      faq: [
        { q: 'A mund të ndërroj dritat e vjetra në LED pa ndërruar kabllot?', a: 'Në shumicën e rasteve po, mjafton të zëvendësohen ndriçuesit ekzistues.' },
        { q: 'A ofroni ndriçim solar për oborr?', a: 'Po, ofrojmë projektorë solarë kualitativë që punojnë pa pasur nevojë për rrymë.' }
      ],
      relatedArticles: ['instalimi-i-ndricimit', 'smart-home-kosove'],
      iconName: 'lightbulb'
    },
    'panele-elektrike': {
      slug: 'panele-elektrike',
      title: 'Panele Elektrike dhe Siguresa',
      description: 'Instalimi dhe modernizimi i paneleve shpërndarëse për mbrojtje maksimale.',
      longDescription: "Paneli elektrik është 'truri' i shtëpisë tuaj. Ai kontrollon shpërndarjen e energjisë dhe mbron familjen tuaj nga rreziqet elektrike. ElektroNova ofron shërbime të specializuara për **instalim panele elektrike në Pejë** dhe në tërë territorin e Kosovës. Ne zëvendësojmë kutitë e vjetra me siguresa plumbi me panele moderne automatike që reagojnë në milisekonda në rast defekti.\n\n### Pse duhet të modernizoni panelin tuaj?\nNë Kosovë, ku luhatjet e tensionit dhe stuhitë janë të pranishme, një panel i vjetër mund të dështojë të fiket në kohë, duke shkaktuar djegien e pajisjeve apo edhe zjarr. Panelet tona moderne përfshijnë mbrojtës nga mbingarkesa (Surge Protectors) dhe ndërprerës FI (RCD). Siguresa FI është jetike: ajo detekton rrjedhjen më të vogël të rrymës dhe e fik atë menjëherë nëse dikush preket me energji, duke shpëtuar jetë njerëzish. Ky është një standard që ne e aplikojmë në çdo shtëpi në Pejë dhe përreth.\n\n### Shërbime për Industrinë dhe Biznesin\nPër objektet komerciale në Kosovë, ne projektojmë dhe montojmë panele komanduese komplekse. Këto përfshijnë sisteme të komutimit automatik për gjeneratorë (ATS), në mënyrë që biznesi juaj të mos mbetet kurrë pa dritë. Ne përdorim vetëm siguresa të brendeve Schneider, Eaton dhe ABB, të cilat njihen për saktësinë e tyre. Çdo panel i montuar nga ElektroNova është i testuar nën ngarkesë maksimale dhe vjen me dokumentacionin përkatës teknik.\n\n**Siguria dhe Monitorimi:**\nPanelet tona mund të integrohen me sisteme monitorimi që ju tregojnë konsumin në kohë reale. Kjo lidhet shkëlqyeshëm me [Smart Home](/sq/sherbimet/smart-home-automatizimi) dhe lejon menaxhimin e energjisë nga larg. Ne jemi partneri juaj për siguri elektrike në tërë Kosovën.",
      benefits: [
        'Mbrojtje e garantuar kundër goditjeve elektrike (FI / RCD)',
        'Parandalim i dëmtimit të pajisjeve nga luhatjet e tensionit',
        'Shpërndarje e balancuar e energjisë në çdo dhomë',
        'Lehtësi në identifikimin dhe zgjidhjen e defekteve',
        'Certifikim i plotë teknik pas instalimit'
      ],
      useCases: [
        'Zëvendësimi i paneleve të vjetra me siguresa plumbi',
        'Panele të reja për shtëpi dhe apartamente',
        'Panele komanduese për fabrika dhe industri',
        'Sisteme të kalimit automatik në gjenerator (ATS)'
      ],
      technology: [
        'Siguresa automatike (MCB) dhe ndërprerës FI (RCCB)',
        'Mbrojtës nga tensioni dhe shkarkimet atmosferike (SPD)',
        'Kontaktet e qëndrueshme prej bakri dhe sisteme Busbar'
      ],
      installationProcess: [
        'Vlerësimi i ngarkesës totale të objektit',
        'Dizajnimi i skemës së shpërndarjes së rrymës',
        'Montimi fizik i kutisë dhe siguresave',
        'Lidhja e linjave dhe matja e tokëzimit',
        'Etiketimi i çdo sigurese për përdorim të lehtë'
      ],
      faq: [
        { q: 'Pse po më fiket siguresa FI shpesh?', a: 'Kjo zakonisht tregon një problem me tokëzimin ose një pajisje me defekt që po rrjedh rrymë.' },
        { q: 'Sa kushton zëvendësimi i një paneli të vjetër?', a: 'Çmimi varet nga numri i siguresave, por siguria që përfitoni është e paçmueshme.' }
      ],
      relatedArticles: ['panelet-elektrike-modernizimi', 'pse-ndalet-rryma'],
      iconName: 'grid'
    },
    'mirembajtje-elektrike-biznes': {
      slug: 'mirembajtje-elektrike-biznes',
      title: 'Mirëmbajtje Elektrike për Biznese',
      description: 'Programet e mirëmbajtjes parandaluese për të garantuar vazhdimësinë e biznesit tuaj.',
      longDescription: "Për çdo biznes në Kosovë, energjia elektrike është mjeti kryesor i punës. Një defekt i papritur nuk është vetëm problem teknik, por humbje financiare dhe rrezik për sigurinë e klientëve. ElektroNova ofron shërbime të specializuara të **mirëmbajtjes elektrike për biznese në Pejë** dhe në tërë territorin e Kosovës, duke siguruar që rrjeti i tyre të jetë gjithmonë në gjendje optimale.\n\n### Mirëmbajtja Preventive: Investimi më Smart\nZgjidhja e një problemi para se ai të ndodhë është çelësi i suksesit. Programet tona të mirëmbajtjes përfshijnë inspektime periodike me kamera termike. Kjo teknologji na lejon të shohim nxehjen e siguresave dhe kabllove që nuk duket me sy të lirë, duke parandaluar zjarret dhe shkrirjen e pajisjeve. Ne jemi lider në Pejë për diagnostikimin e hershëm të sistemeve komerciale, duke ju kursyer mijëra euro në riparime emergjente.\n\n### Shërbime 24/7 dhe Përgjigje Prioritare\nSi klient i mirëmbajtjes në ElektroNova, biznesi juaj përfiton qasje prioritare. Në rast të ndonjë defekti, ekipi ynë në Pejë niset drejt jush menjëherë. Ne mbulojmë mbrojtjen e [Kamerave të Sigurisë](/sq/shermbet/instalimi-kamerave-sigurise) dhe [Sistemeve të Alarmit](/sq/shermbet/sistemet-alarmit), duke u siguruar që edhe sistemet e sigurisë të kenë energji të vazhdueshme. Kontratat tona janë fleksibile dhe përshtaten sipas madhësisë dhe nevojave specifike të biznesit tuaj në Kosovë.\n\n**Efikasiteti Energjetik:**\nMirëmbajtja nuk ka të bëjë vetëm me riparimet, por edhe me kursimin. Ne analizojmë konsumin tuaj dhe propozojmë zgjedhjet më të mira për ndriçim LED dhe automatizim që ulin faturat e rrymës. Lexoni më shumë mbi: [Si të kurseni energji në biznesin tuaj](/sq/blogu/kursimi-energjise-biznes).",
      benefits: [
        'Minimizim i rrezikut për ndërprerje të papritura të punës',
        'Zgjidhje proaktive përmes inspektimit termik',
        'Mbështetje teknike prioritare 24/7',
        'Rritje e jetëgjatësisë së makinerive dhe pajisjeve',
        'Përputhshmëri me normat e sigurisë në punë'
      ],
      useCases: [
        'Restorante dhe hotele që kërkojnë energji 24/7',
        'Fabrika dhe punëtori prodhuese me makineri të rënda',
        'Qendra tregtare dhe markete ushqimore',
        'Zyra biznesi dhe laboratorë teknologjikë'
      ],
      technology: [
        'Kamera termike profesionale (FLIR)',
        'Analizues të kualitetit të energjisë',
        'Sisteme monitorimi në distancë të ngarkesës'
      ],
      installationProcess: [
        'Auditimi fillestar i instalimit ekzistues',
        'Hartimi i planit të mirëmbajtjes periodike',
        'Kryerja e inspektimeve dhe testimeve të rregullta',
        'Raportimi teknik për çdo ndërhyrje të kryer',
        'Mbështetje e menjëhershme në raste emergjente'
      ],
      faq: [
        { q: 'Pse i duhet kontratë mirëmbajtjeje një biznesi të vogël?', a: 'Sepse edhe defekti më i vogël mund të bllokojë punën dhe të dëmtojë pajisjet tuaja të shtrenjta.' },
        { q: 'A përfshihet ndërrimi i ndriçimit në mirëmbajtje?', a: 'Po, ne kujdesemi për të gjitha pikat e ndriçimit që biznesi juaj të jetë gjithmonë i ndriçuar mirë.' }
      ],
      relatedArticles: ['mirembajtja-elektrike-per-biznese', 'energjia-solare-elektrike'],
      iconName: 'briefcase'
    },
    'elektricist-urgjent': {
      slug: 'elektricist-urgjent',
      title: 'Elektricist Urgjent 24/7',
      description: 'Ndërhyrje të menjëhershme për defekte elektrike kritike në tërë Kosovën.',
      longDescription: "Kur rryma fiket, kur dëgjoni kërcitje në mure, ose kur ndjeni erë të djegur nga siguresat, nuk ka kohë për të pritur. ElektroNova ofron shërbimin më të shpejtë për **elektricist urgjent në Pejë** dhe zonat rrethuese. Ne kuptojmë se urgjencat elektrike nuk ndodhin vetëm gjatë orarit të punës, prandaj ekipet tona mobile janë në gatishmëri 24 orë në ditë, 7 ditë në javë, në tërë territorin e Kosovës.\n\n### Kur duhet të thirrni elektricistin urgjent?\nRreziqet elektrike janë të paparashikueshme. Nëse keni humbje të plotë të energjisë (dhe fqinjët kanë), nëse ndodh një lidhje e shkurtër që shkakton shkëndija, ose nëse pajisjet tuaja fillojnë të nxehen teper, na thirrni menjëherë. Specialiteti ynë në Pejë është zgjidhja e problemeve që paraqesin rrezik direkt për jetën. Ne jemi të pajisur me mjetet më moderne për të izoluar defektin dhe për të rikthyer sigurinë në shtëpinë tuaj brenda minutave.\n\n### Siguria juaj në Duart e Profesionalistëve\nShumë njerëz në Kosovë tentojnë t'i riparojnë vetë defektet urgjente, gjë që mund të jetë fatale. ElektroNova ju këshillon: mos prekni asgjë që ka shenja djegieje apo shkëndija. Teknikët tanë të certifikuar kanë përvojën dhe veshjet mbrojtëse të duhura për të ndërhyrë në tension të lartë. Shërbimi ynë urgjent mbulon gjithashtu riparimin e sistemeve kritike si [Panelet Elektrike](/sq/sherbimet/panele-elektrike) dhe furnizimin me energji për [Kamerat e Sigurisë](/sq/sherbimet/instalimi-kamerave-sigurise).\n\n**Hapat që duhet të ndërmerrni:**\nNë rast rreziku, sigurohuni të njihni faqen tonë: [Si të reagoni në raste urgjente elektrike](/sq/blogu/elektricist-urgjent). Ne jemi thirrja juaj e parë për siguri në Pejë, Prishtinë dhe çdo kënd të Kosovës.",
      benefits: [
        'Arritja në lokacion brenda 30-60 minutave në Pejë',
        'Gatishmëri e plotë 24/7 (edhe gjatë festave)',
        'Teknikë të certifikuar dhe me përvojë në raste kritike',
        'Diagnostikim i menjëhershëm me pajisje moderne',
        'Zgjidhje përfundimtare për të parandaluar përsëritjen'
      ],
      useCases: [
        'Lidhje të shkurtra dhe shkëndija elektrike',
        'Djegia e paneleve apo siguresave kryesore',
        'Humbja e tensionit në një fazë',
        'Defekte pas stuhive apo rrjedhjes së ujit'
      ],
      technology: [
        'Aparatura për gjetjen e defekteve nën mur',
        'Veshje mbrojtëse ndaj harkut elektrik',
        'Pjesë rezervë të menjëhershme për riparim'
      ],
      installationProcess: [
        'Pranimi i thirrjes dhe udhëzimi i klientit për siguri',
        'Nisja e menjëhershme e ekipit mobil',
        'Izolomi i defektit dhe stabilizimi i situatës',
        'Riparimi i plotë i pikave problematike',
        'Testimi i sigurisë para lëshimit të rrymës'
      ],
      faq: [
        { q: 'A punoni edhe gjatë natës?', a: 'Po, shërbimi ynë urgjent nuk ndalet kurrë, 24 orë çdo ditë të vitit.' },
        { q: 'Sa kushton shërbimi urgjent?', a: 'Çmimi fillestar varet nga distanca dhe koha e thirrjes, por ne jemi transparentë me kostot.' }
      ],
      relatedArticles: ['elektricist-urgjent', 'pse-ndalet-rryma'],
      iconName: 'alert'
    },
    'smart-home-automatizimi': {
      slug: 'smart-home-automatizimi',
      title: 'Smart Home dhe Automatizimi',
      description: 'Transformoni shtëpinë tuaj në një hapësirë inteligjente dhe efikase.',
      longDescription: "Shtëpitë inteligjente nuk janë më një koncept i së ardhmes; ato janë këtu. ElektroNova ofron zgjidhjet më të avancuara të **Smart Home në Kosovë**, duke ju mundësuar të keni kontroll të plotë mbi ambientin tuaj përmes një aplikacioni të vetëm. Nga kontrolli i ndriçimit dhe temperaturës deri te automatizimi i grilave dhe rrethojave, ne i bëjmë të gjitha.\n\n### Pse Smart Home në Pejë?\nJeta moderne kërkon efikasitet. Duke instaluar sisteme inteligjente në Pejë apo Prishtinë, ju mund të reduktoni kostot e energjisë deri në 30%. Imagjinoni që ngrohja të fiket automatikisht kur dilni nga shtëpia dhe të ndizet pak para se të ktheheni. Ose dritat që adaptohen sipas kohës së ditës për të krijuar atmosferën perfekte. Kjo jo vetëm shton komoditetin, por edhe rrit vlerën e pronës suaj në tregun e Kosovës.",
      benefits: [
        'Kontroll i plotë i ndriçimit dhe pajisjeve nga celulari',
        'Kursim i konsiderueshëm i energjisë elektrike',
        'Skenarë të personalizuar (p.sh. "Movie Night" apo "Leaving Home")',
        'Njoftime në kohë reale për sigurinë e ambientit',
        'Rritje e vlerës së pronës suaj',
        'Integrim me asistentët zanorë (Alexa, Google Assistant)'
      ],
      useCases: [
        'Shtëpi moderne dhe apartamente luksoze',
        'Zyra që kërkojnë efikasitet në ndriçim dhe ngrohje',
        'Hotele dhe apartamente me qera (control nga distanca)',
        'Objekte industriale për monitorimin e kushteve'
      ],
      technology: [
        'Protokollet Zigbee 3.0 dhe Z-Wave Plus',
        'Senzorë inteligjentë për temperaturë, lagështi dhe dritë',
        'Ndërprerës dhe priza smart që nuk kërkojnë ndryshim të kabllos',
        'Serverë lokalë për privatësi maksimale (Home Assistant/Hubitat)'
      ],
      installationProcess: [
        'Analiza e kërkesave për automatizim të klientit',
        'Përzgjedhja e ekosistemit të përshtatshëm (Apple, Google, etj)',
        'Instalimi i pajisjeve smart dhe urave ndërlidhëse',
        'Konfigurimi i skenarëve dhe rregullave të automatizimit',
        'Trajnimi i klientit për përdorimin e aplikacionit'
      ],
      faq: [
        { q: 'A duhet të shpoj muret për të bërë shtëpinë smart?', a: 'Jo, shumë nga sistemet tona funksionojnë me wireless dhe mund të instalohen në shtëpi ekzistuese.' },
        { q: 'A mund ta kontrolloj shtëpinë kur jam jashtë Kosovës?', a: 'Po, përmes internetit ju keni qasje të plotë nga kudo në botë.' }
      ],
      relatedArticles: ['smart-home-kosove', 'instalimi-i-ndricimit'],
      iconName: 'home'
    },
    'kamerap-ip': {
      slug: 'kamerap-ip',
      title: 'Kamerat IP dhe Siguria Digjitale',
      description: 'Zgjidhje moderne me rezolucion të lartë dhe teknologji PoE për monitorim profesional.',
      longDescription: "Kamerat IP (Internet Protocol) përfaqësojnë standardin më të lartë të sigurisë vizuale sot. Në ElektroNova, ne ofrojmë **instalim kamerash IP në Kosovë** që ofrojnë cilësi superiore të imazhit, fleksibilitet të pafund dhe integrim të plotë me rrjetet ekzistuese të internetit. Ndryshe nga sistemet analoge, kamerat IP dërgojnë të dhëna digjitale, duke siguruar që asnjë detaj të mos humbet gjatë transmetimit.\n\n### Avantazhet e Kamerave IP në Pejë\nPërdorimi i teknologjisë PoE (Power over Ethernet) do të thotë që një kabllo e vetme rrjeti furnizon kamerën me rrymë dhe dërgon sinjalin e videos. Kjo redukton koston e instalimit dhe rrit saktësinë. Me rezolucione që arrijnë deri në 12MP dhe më shumë, këto kamera janë ideale për pikat ku kërkohet identifikim preciz, si mbi arka në dyqane apo në hyrje të institucioneve në Pejë dhe Prishtinë.\n\n### Inteligjenca e Inkorporuar\nShumë nga kamerat tona IP kanë procesorë të fuqishëm që kryejnë analizë të videos direkt në pajisje. Kjo përfshin detektimin e fytyrave, numërimin e vizitorëve dhe alarme inteligjente që vijnë në telefonin tuaj në sekondë. Ne punojmë me brendet lider si Dahua dhe Hikvision për t'u siguruar që ju të keni qasjen më të fundit në teknologjinë e sigurisë.",
      benefits: [
        'Cilësi kristal e figurës deri në 4K dhe më lart',
        'Instalim i thjeshtë me një kabllo të vetme (PoE)',
        'Qasje e sigurt nga larg përmes enkriptimit të lartë',
        'Mundësi për ruajtje të regjistrimeve në kartë memorie SD',
        'Integrim i lehtë me sisteme tjera digjitale'
      ],
      useCases: [
        'Biznese që kërkojnë detaje maksimale',
        'Shtëpi inteligjente që kërkojnë kontroll total',
        'Monitorim i hapësirave të hapura dhe parkingjeve',
        'Zgjidhje për institucione bankare dhe shtetërore'
      ],
      technology: [
        'Senzorë progresivë CMOS për imazhe pa turbullira',
        'Enkriptim i të dhënave TLS/SSL',
        'Standardi ONVIF për përputhshmëri me pajisje tjera',
        'Teknologji hibride për dritë të ulët'
      ],
      installationProcess: [
        'Auditimi i infrastrukturës së rrjetit ekzistues',
        'Zgjedhja e pikave strategjike për mbulim maksimal',
        'Shtrirja e kabllimit CAT6 dhe montimi i switch-ave PoE',
        'Konfigurimi i adresave IP dhe sigurisë kibernetike',
        'Testimi i stabilitetit të sinjalit dhe regjistrimit'
      ],
      faq: [
        { q: 'A munden kamerat IP të punojnë pa internet?', a: 'Po, ato regjistrojnë lokalisht në NVR ose kartë SD; interneti ju duhet vetëm për t\'i parë nga larg.' },
        { q: 'Sa kamera IP mund të mbajë një rrjet i thjeshtë?', a: 'Varet nga shpejtësia e rrjetit, por ne aplikojmë VLAN-e të ndara për të mos ngarkuar internetin tuaj të punës.' }
      ],
      relatedArticles: ['kamerat-me-te-mira-per-shtepi', 'dahua-vs-hikvision'],
      iconName: 'video'
    },
    'sistemet-nvr-dvr': {
      slug: 'sistemet-nvr-dvr',
      title: 'Regjistruesit NVR dhe DVR',
      description: 'Qendra e kontrollit për sistemin tuaj të vëzhgimit, me ruajtje të sigurt të të dhënave.',
      longDescription: "Regjistruesi është zemra e çdo sistemi sigurie. ElektroNova ofron instalimin dhe konfigurimin e **sistemeve NVR (Network Video Recorder)** për kamera IP dhe **DVR (Digital Video Recorder)** për sisteme analoge. Ne sigurohemi që qendra juaj e monitorimit në Pejë të jetë e pathyeshme dhe e besueshme 24/7.\n\n### NVR vs DVR: Çfarë ju nevojitet?\nNVR-të janë zgjedhja moderne që përpunojnë të dhënat digjitale direkt nga rrjeti, duke ofruar rezolucion më të lartë dhe mundësi të avancuara të AI. DVR-të janë një zgjedhje ekonomike dhe e qëndrueshme për objektet ku kabllimi koaksial është tashmë i pranishëm. Ne përdorim regjistrues që mbështesin standarde të larta të kompresimit (H.265+), duke ju lejuar të mbani regjistrime për javë të tëra pa pasur nevojë për investime gjigande në Hard Disqe.\n\n### Siguria e të Dhënave\nNe instalojmë Hard Disqe të dedikuara për mbikëqyrje (Surveillance Grade) që janë të dizajnuar për punë intensive 24/7. Gjithashtu, konfigurojmë sisteme automatike të backup-it dhe njoftimeve në rast të dështimit të diskun, duke garantuar që asnjë sekondë e rëndësishme e videos të mos humbet.",
      benefits: [
        'Regjistrim i vazhdueshëm me rezolucion të plotë',
        'Menaxhim i thjeshtë i të gjitha kamerave nga një vend',
        'Backup automatik në Cloud apo serverë të jashtëm',
        'Aplikacion celular për monitorim nga kudo në botë',
        'Mbrojtje e lartë me fjalëkalime dhe enkriptim'
      ],
      useCases: [
        'Shtëpi private dhe objekte rezidenciale',
        'Zgjidhje industriale me numër të madh kamerash',
        'Dyqane dhe rrjete marketesh në tërë Kosovën',
        'Sisteme mobile për transporte dhe automjete'
      ],
      technology: [
        'Kompresim H.265+ për kursim të memories',
        'Mbështetje për Inteligjencë Artificiale (AI Decoding)',
        'Sisteme RAID për sigurinë e disqeve',
        'Dalje HDMI/VGA për monitorim lokal 4K'
      ],
      installationProcess: [
        'Përzgjedhja e regjistruesit sipas numrit të kamerave',
        'Instalimi i Hard Disqeve dhe ventilimit të duhur',
        'Lidhja me rrjetin e internetit dhe burimet e rrymës',
        'Konfigurimi i orareve të regjistrimit (Motion/Continuous)',
        'Trajnimi i përdoruesit për nxjerrjen e regjistrimeve'
      ],
      faq: [
        { q: 'Sa ditë regjistrim mund të mbajë një NVR?', a: 'Varet nga numri i kamerave dhe madhësia e hard diskut. Zakonisht ne konfigurojmë 15 deri në 30 ditë.' },
        { q: 'A mund t\'i shoh regjistrimet e vjetra nga telefoni?', a: 'Po, përmes aplikacionit mund të ktheheni në çdo orë dhe ditë të ruajtur në regjistrues.' }
      ],
      relatedArticles: ['sa-kushton-instalimi-i-kamerave-te-sigurise-ne-kosove', '5-gabime-kamera-sigurie'],
      iconName: 'database'
    },
    'mirembajtja-cctv': {
      slug: 'mirembajtja-cctv',
      title: 'Mirëmbajtja e Sistemeve CCTV',
      description: 'Siguroni jetëgjatësi dhe performancë maksimale për kamerat tuaja përmes servisimit periodik.',
      longDescription: "Një sistem sigurie që nuk mirëmbahet është një rrezik i fshehur. Pluhuri, rrjetat e merimangave në lente, dhe luhatjet e tensionit mund të ulin efikasitetin e sistemit tuaj në momentin kur ju nevojitet më së shumti. ElektroNova ofron paketa të plota të **mirëmbajtjes CCTV në Pejë** dhe tërë Kosovën, që garantojnë që çdo kamerë të jetë në gjendje perfekte pune.\n\n### Pse është e rëndësishme mirëmbajtja?\nShumë klientë kuptojnë që Hard Disku ka dështuar vetëm kur u duhet të shohin një vjedhje. Ne kryejmë kontrolle periodike që përfshijnë pastrimin fizik të lenteve, kontrollin e shëndetit të disqeve, përditësimin e softuerit (Firmware) dhe testimin e baterive rezervë (UPS). Kjo parandalon dështimet e papritura dhe rrit jetëgjatësinë e investimit tuaj për dekadas.\n\n### Shërbim Profesional në Terren\nEkipi ynë vjen në lokacionin tuaj me të gjitha mjetet e nevojshme. Ne bëjmë ri-fokusimin e kamerave që mund të jenë lëvizur nga era apo ndërhyrjet, dhe sigurohemi që shikimi natën (IR/FullColor) të jetë po aq i qartë sa ditën e parë të instalimit.",
      benefits: [
        'Parandalim i dështimeve kritike të sistemit',
        'Imazhe të pastra dhe pa interferenca',
        'Siguri e vazhdueshme e regjistrimeve në Hard Disk',
        'Mbrojtje nga hakerimi përmes update-ve të rregullta',
        'Ulje e kostove të riparimit në planin afatgjatë'
      ],
      useCases: [
        'Biznese me mjedise me pluhur apo lagështi',
        'Sisteme sigurie në objekte industriale',
        'Monitorim qyteti dhe hapësira publike',
        'Shtëpi dhe vila që kërkojnë siguri 100%'
      ],
      technology: [
        'Lëngje pastruese antistatike për lente',
        'Software diagnostikues për Hard Disqe',
        'Matës të tensionit dhe stabilitetit të PoE',
        'Sisteme monitorimi në distancë të gjendjes'
      ],
      installationProcess: [
        'Auditimi fillestar i gjendjes së sistemit',
        'Pastrimi fizik i të gjitha kamerave dhe kutive',
        'Verifikimi i të gjitha lidhjeve dhe kabllimit',
        'Kontrolli i cilësisë së videos dhe fokusit',
        'Raportimi teknik i punimeve dhe këshillat për përditësim'
      ],
      faq: [
        { q: 'Sa shpesh duhet të pastrohen kamerat e sigurisë?', a: 'Rekomandojmë pastrim të plotë çdo 6 muaj, sidomos për kamerat e jashtme.' },
        { q: 'A përfshihet ndërrimi i pjesëve në mirëmbajtje?', a: 'Punët e servisimit përfshihen, ndërsa komponentët e dëmtuar zëvendësohen sipas marrëveshjes ose garancionit.' }
      ],
      relatedArticles: ['kamera-sigurie-kosove-udhezues-2026', 'dahua-vs-hikvision'],
      iconName: 'tool'
    },
    'siguria-shtepise-menqur': {
      slug: 'siguria-shtepise-menqur',
      title: 'Siguria e Shtëpisë së Mençur',
      description: 'Integrimi i mbrojtjes fizike me automatizimin inteligjent për siguri 360 gradë.',
      longDescription: "Siguria nuk është më vetëm një alarm apo një kamerë; është një ekosistem që bashkëvepron. Në ElektroNova, ne jemi pionierë të **sigurisë së shtëpive të mençura në Kosovë**. Ne ndërtojmë sisteme ku dritat, kamerat, alarmet dhe bravat inteligjente punojnë së bashku për të parandaluar rrezikun para se ai të ndodhë.\n\n### Filozofia e Sigurisë Proaktive\nImagjinoni këtë: Nëse senzorët e jashtëm detektojnë lëvizje pas mesnate, dritat e oborrit ndizen automatikisht, roletat e dritareve mbyllen dhe ju merrni një njoftim zanor në dhomën e gjumit. Kjo është forca e automatizimit. Ne përdorim pajisje që punojnë me protokollet Matter, Zigbee dhe Z-Wave, duke garantuar se shtëpia juaj mbetet e sigurt edhe pa nevojën e kabllove në çdo dhomë.\n\n### Kontrolli nga Kudo\nPavarësisht nëse jeni në Pejë apo në pushime jashtë vendit, ju keni kontrollin e plotë. Mund të mbyllni dyert, të kontrolloni kush po pret te zilja ose të simuloni praninë tuaj në shtëpi duke ndezur dritat në distancë. Ky është standardi i ri i mbrojtjes familjare në Kosovë.",
      benefits: [
        'Mbrojtje e shtresëzuar dhe proaktive',
        'Kursim i energjisë përmes automatizimit të zgjuar',
        'Njoftime të menjëhershme për çdo anomali',
        'Lehtësi në përdorim përmes asistentëve zanorë',
        'Qetësi mendore 24 orë në ditë'
      ],
      useCases: [
        'Vila luksoze dhe shtëpi moderne familjare',
        'Apartamente smart në qendrat urbane',
        'Zyra që kërkojnë menaxhim efikas të sigurisë',
        'Objekte pushimi që monitorohen nga distanca'
      ],
      technology: [
        'Standardi Matter për ndërlidhje universale',
        'Enkriptim i shkallës bankare për pajisjet wireless',
        'Senzorë shumë-funksionalë (Lëvizje, Dritë, Temperaturë)',
        'Sisteme të integrimit si Apple Home, Google dhe Amazon'
      ],
      installationProcess: [
        'Projektimi i ekosistemit të sigurisë smart',
        'Instalimi i qendrës kontrolluese (Hub-it)',
        'Konfigurimi i senzorëve dhe pajisjeve ekzekutuese',
        'Krijimi i skenarëve të personalizuar të sigurisë',
        'Testimi i integrimit dhe trajnimi i familjes'
      ],
      faq: [
        { q: 'A është siguria wireless po aq e mirë sa ajo me kabllo?', a: 'Po, sistemet tona profesionale përdorin frekuenca të enkriptuara që janë imun ndaj bllokimeve të zakonshme.' },
        { q: 'Çfarë ndodh nëse bie interneti?', a: 'Sistemi vazhdon të punojë lokalisht; senzorët dhe alarmet do të nisin punën normalisht brenda shtëpisë.' }
      ],
      relatedArticles: ['smart-home-kosove', 'rendesia-e-alarmit-wireless'],
      iconName: 'home'
    },
    'kontrolli-hyrjes': {
      slug: 'kontrolli-hyrjes',
      title: 'Sistemet e Kontrollit të Hyrjes',
      description: 'Menaxhoni qasjen në ambientet tuaja përmes teknologjisë biometrike dhe kartelave RFID.',
      longDescription: "Siguria fizike fillon në derë. ElektroNova ofron zgjedhje elite për **kontrollin e hyrjes në Kosovë**, duke zëvendësuar çelësat tradicionalë me teknologji digjitale të sigurt. Nga zyrat e bizneseve të vogla deri te fabrikat e mëdha në Pejë, ne sigurohemi që vetëm personat e autorizuar të kenë qasje në zonat tuaja të ndjeshme.\n\n### Teknologjia Biometrike dhe Moderne\nNe instalojmë lexues të shenjave të gishtave, njohje të fytyrës dhe lexues të kartelave inteligjente. Kjo jo vetëm që rrit sigurinë, por edhe lehtëson menaxhimin e stafit. Çdo hyrje dhe dalje regjistrohet në një bazë të dhënash, duke ju dhënë një pasqyrë të plotë se kush dhe kur ka hyrë në objekt. Sistemi mund të integrohet edhe me [Sistemet e Alarmit](/sq/sherbimet/sistemet-alarmit) që të fiket automatikisht sapo stafi i autorizuar të paraqitet.\n\n### Siguri për Shkallët dhe Ashensorët\nPër komplekset banesore në Prishtinë dhe Pejë, ne ofrojmë kontroll qasjeje për ashensorë dhe hyrje kryesore. Kjo mbron banorët nga vizitorët e paftuar dhe rrit shkallën e privatësisë brenda objektit.",
      benefits: [
        'Eliminimi i rrezikut nga kopjimi i çelësave',
        'Kontroll i plotë dhe raportim i qasjeve në kohë reale',
        'Zgjidhje pa kontakt për higjienë maksimale',
        'Mundësi për caktimin e orareve specifike të hyrjes',
        'Integrim me sisteme të kohës dhe prezencës së stafit'
      ],
      useCases: [
        'Zyra biznesi, banka dhe institucione',
        'Objekte banesore dhe komplekse të reja',
        'Hotele dhe apartamente me qasje digjitale',
        'Hapësira industriale dhe depo'
      ],
      technology: [
        'Lexues biometrikë (Fingerprint / Face ID)',
        'Teknologji RFID dhe NFC (Kartela dhe Smartphone)',
        'Brava elektrike dhe motorike me kualitet të lartë',
        'Serverë të menaxhimit të qasjes me qasje nga Web'
      ],
      installationProcess: [
        'Vlerësimi i pikave të kalimit dhe numrit të përdoruesve',
        'Zgjedhja e metodës së vërtetimit (Kartelë/Biometri)',
        'Montimi i lexuesve dhe bllokuesve të dyerve',
        'Konfigurimi i softuerit të menaxhimit',
        'Regjistrimi i përdoruesve dhe testimet e sigurisë'
      ],
      faq: [
        { q: 'Çfarë ndodh nëse dikush e humb kartelën e hyrjes?', a: 'Kartela fshihet nga sistemi menjëherë, duke e bërë atë të padobishme për gjetësin.' },
        { q: 'A funksionojnë bravat elektrike nëse ndalet rryma?', a: 'Po, ne instalojmë sisteme që hapen automatikisht në rast emergjence ose mbeten të mbyllura me bateri rezervë.' }
      ],
      relatedArticles: ['interfoni-video', 'smart-home-automatizimi'],
      iconName: 'lock'
    },
    'sistemet-interfonit': {
      slug: 'sistemet-interfonit',
      title: 'Sistemet e Interfonit',
      description: 'Komunikim i sigurt dhe i qartë për hyrjen e shtëpisë apo objektit tuaj.',
      longDescription: "Interfoni është hapi i parë drejt ndërtimit të një perimetri të sigurt. ElektroNova ofron instalimin e **sistemeve të interfonit në Pejë** për shtëpi private dhe objekte shumë-banesore. Ne përdorim pajisje audio-vizuale që mbështesin komunikimin e qartë dhe menaxhimin e thjeshtë të vizitorëve.\n\n### Zgjidhje për Banesa dhe Shtëpi\nNga sistemet klasike audio deri te ato digjitale që mundësojnë lidhjen me dhjetëra banesa, ne ofrojmë zgjedhjen e duhur për çdo kërkesë. Ne punojmë me brendet e njohura si Biticino, Hikvision dhe Commax, duke garantuar që sistemi juaj të jetë i qëndrueshëm ndaj vandalizmit dhe kushteve klimatike në Kosovë.",
      benefits: [
        'Siguri e shtuar duke folur para hapjes së derës',
        'Zgjidhje rezistente ndaj kushteve të jashtme',
        'Zë i pastër dhe pa zhurmë',
        'Vlera shtesë për objektin tuaj',
        'Pajisje moderne që përshtaten me dizajnin e brendshëm',
        'Instalim i qëndrueshëm për përdorim afatgjatë'
      ],
      useCases: [
        'Shtëpi private dhe vila',
        'Ndërtesa banesore dhe komplekse të përbashkëta',
        'Objekte biznesi dhe recepsione',
        'Zyra që kërkojnë kontroll të vizitorëve'
      ],
      technology: [
        'Sisteme analoge dhe digjitale (2-wire / IP)',
        'Panele të jashtme nga alumini apo çeliku',
        'Lidhje me bravat elektrike standarde'
      ],
      installationProcess: [
        'Pozicionimi i panelit të jashtëm dhe të brendshëm',
        'Shtrirja e kabllimit të dedikuar',
        'Montimi i pajisjeve dhe lidhja e rrymës',
        'Sinkronizimi me bravën elektrike të derës',
        'Testimi i zërit dhe hapjes së derës'
      ],
      faq: [
        { q: 'A mund ta ndërroj interfonin e vjetër me një të ri?', a: 'Po, ne bëjmë modernizimin e sistemeve ekzistuese pa pasur nevojë për ndryshime të mëdha.' }
      ],
      relatedArticles: ['interfoni-video', 'kontrolli-hyrjes'],
      iconName: 'phone'
    },
    'interfoni-video': {
      slug: 'interfoni-video',
      title: 'Sistemet e Interfonit Video',
      description: 'Shihni dhe flisni me vizitorët tuaj përmes ekranit HD apo direkt nga telefoni juaj.',
      longDescription: "Video interfoni është evolucioni i interfonit klasik. ElektroNova instalon **video interfona në Pejë** që ju lejojnë të shihni vizitorin në kohë reale, duke rritur sigurinë dhe komoditetin tuaj. Kjo teknologji është ideale për shtëpi ku dëshironi të shihni kush po pret te dera para se të përgjigjeni.\n\n### Video Interfoni IP - Siguria në Smartphone\nSistemet tona moderne IP ju lejojnë të merrni thirrjen e derës direkt në telefonin tuaj, kudo që jeni. Nëse dikush shtyp zilen në Pejë ndërsa ju jeni në Prishtinë apo jashtë vendit, ju mund të flisni me vizitorin dhe madje t'i hapni derën nëse dëshironi. Pajisjet tona kanë kamera me rezolucion të lartë dhe pamje natën (IR), duke u siguruar që ju të shihni qartë në çdo orë.",
      benefits: [
        'Identifikim vizual i vizitorit para qasjes',
        'Thirrja vjen në smartphone-in tuaj në kohë reale',
        'Regjistrim foto/video i personave që shtypin zilen',
        'Ekranë modernë me teknologji Touch',
        'Lidhje me [Kamerat e Sigurisë](/sq/sherbimet/instalimi-kamerave-sigurise)'
      ],
      useCases: [
        'Shtëpi private dhe villa luksoze',
        'Apartamente moderne me monitorim qendror',
        'Biznese që kërkojnë kontroll vizual në hyrje',
        'Hotele dhe zyra profesionale'
      ],
      technology: [
        'Kamera HD me kënd të gjërë shikimi (180°)',
        'Protokolli SIP për komunikim të qëndrueshëm',
        'Lidhje Wi-Fi dhe Ethernet',
        'Ekranë të brendshëm LCD deri në 10 inç'
      ],
      installationProcess: [
        'Vlerësimi i këndit të shikimit të kamerës',
        'Instalimi i kabllimit CAT6 për video IP',
        'Montimi i monitorit të brendshëm dhe panelit të jashtëm',
        'Lidhja me aplikacionin celular dhe rrjetin Wi-Fi',
        'Konfigurimi i funksioneve të regjistrimit'
      ],
      faq: [
        { q: 'A regjistron video interfoni kush ka thirrur kur nuk kam qenë në shtëpi?', a: 'Po, sistemet tona ruajnë fotot e vizitorëve të humbur në memoren e brendshme.' },
        { q: 'A mund të lidhet video interfoni me kamerat tjera?', a: 'Po, ju mund t\'i shihni kamerat e sigurisë direkt nga ekrani i interfonit tuaj.' }
      ],
      relatedArticles: ['sistemet-interfonit', 'kontrolli-hyrjes'],
      iconName: 'eye'
    },
    'instalimi-rrjetit-internetit': {
      slug: 'instalimi-rrjetit-internetit',
      title: 'Instalimi i Rrjetit dhe Internetit',
      description: 'Ndërtoni një infrastrukturë të fortë dhe të shpejtë të internetit për shtëpi dhe biznese.',
      longDescription: "Në ditët e sotme, interneti i shpejtë dhe i qëndrueshëm është po aq i rëndësishëm sa energjia elektrike. ElektroNova ofron shërbime profesionale për **instalimin e rrjeteve kompjuterike në Pejë**, duke garantuar mbulim maksimal me Wi-Fi dhe lidhje stabile me kabllo CAT6/CAT7. Ne ndihmojmë bizneset dhe shtëpitë të kenë një rrjet që nuk dështon kurrë.\n\n### Wi-Fi i Fuqishëm pa \"Zona të Vdekura\"\nHarroni problemet me sinjalin që nuk kap në katin e dytë apo në oborr. Ne instalojmë Access Point-er profesionalë që krijojnë një rrjet unik (Mesh) në tërë shtëpinë tuaj. Kjo siguron që [Kamerat e Sigurisë IP](/sq/sherbimet/kamerap-ip) dhe [Smart Home](/sq/sherbimet/smart-home-automatizimi) të punojnë pa ndërprerje. Për bizneset, ne projektojmë rrjete të sigurta me VLAN-e të ndara për stafin dhe vizitorët.",
      benefits: [
        'Shpejtësi maksimale e transferit të të dhënave',
        'Mbulim 100% me Wi-Fi në çdo cep të objektit',
        'Stabilitet i lartë për punë nga shtëpia dhe gaming',
        'Rrjet i sigurt nga thyerjet kibernetike',
        'Kabllim i organizuar dhe estetik në zyra'
      ],
      useCases: [
        'Shtëpi moderne me shumë pajisje të lidhura',
        'Zyra biznesi, Call Centers dhe hapësira Co-working',
        'Hotele, restorante dhe kafiteri',
        'Depo dhe objekte industriale që kërkojnë internet'
      ],
      technology: [
        'Kabllim strukturor CAT6A / CAT7 (10 Gbps)',
        'Sisteme Wi-Fi 6 dhe Mesh (Ubiquiti / TP-Link)',
        'Switch-a Gigabit dhe Firewall profesionalë',
        'Rack-a dhe panele shpërndarëse të organizuara'
      ],
      installationProcess: [
        'Analiza e nevojave për shpejtësi dhe mbulim',
        'Shtrirja e kabllove në pikat strategjike',
        'Instalimi i routerëve dhe access point-eve',
        'Konfigurimi i sigurisë së rrjetit dhe fjalëkalimeve',
        'Matja e shpejtësisë dhe testimet e ngarkesës'
      ],
      faq: [
        { q: 'Pse interneti im është i ngadalshëm edhe pse kam paketë të shpejtë?', a: 'Shpesh problemi qëndron te router-i i dobët apo kabllimi i vjetër i brendshëm.' },
        { q: 'A mund të bëni rrjet të internetit në një shtëpi të përfunduar?', a: 'Po, ne përdorim zgjedhje wireless Mesh ose tërheqim kabllot nëpër kanale ekzistuese.' }
      ],
      relatedArticles: ['kamerap-ip', 'smart-home-automatizimi'],
      iconName: 'wifi'
    },
    'instalimi-fibres-optike': {
      slug: 'instalimi-fibres-optike',
      title: 'Instalimi i Fibres Optike',
      description: 'Lidhje ultra të shpejta përmes teknologjisë së fibrave optike për distancat të gjata.',
      longDescription: "Kur kabllot tradicionale të bakrit arrijnë limitet e tyre, fibra optike vjen në ndihmë. ElektroNova ofron **shërbime të fibrave optike në Kosovë** për projekte që kërkojnë shpejtësi marramendëse dhe distancat të gjata pa humbje sinjali. Kjo teknologji është ideale për kampuset e bizneseve, lidhjen e shumë objekteve apo sistemet CCTV në distanca të mëdha.\n\n### Shpejtësia e Dritës në Objektin Tuaj\nFibra optike nuk ndikohet nga interferencat elektrike, gjë që e bën atë perfekte për ambientet industriale. Ne bëjmë instalimin e fibrave brenda objekteve (FTTH) dhe ndërlidhjen e tyre me pajisjet e rrjetit. Me ekspertizën tonë në Pejë, ne sigurohemi që infrastruktura juaj digjitale të jetë gati për standardet e dekadës së ardhshme.",
      benefits: [
        'Shpejtësi e pakufizuar e internetit dhe të dhënave',
        'Imunitet total ndaj rrufeve dhe interferencave elektrike',
        'Gjatësi e kabllos pa humbje sinjali deri në kilometra',
        'Infrastrukturë afatgjatë (Future-proof)',
        'Siguri e lartë - fibra vështirë se mund të përgjohet'
      ],
      useCases: [
        'Ndërlidhja e serverëve dhe zyrave qendrore',
        'Sisteme sigurie në perimetra të gjatë (fabrika, kufij)',
        'Shtëpi inteligjente të shkallës së lartë',
        'Institucione arsimore dhe spitalore'
      ],
      technology: [
        'Fibra Single-mode dhe Multi-mode',
        'Konverterët Media dhe Switch-at SFP',
        'Teknologjia e saldimit (Splicing) të fibrave',
        'Fishekët dhe panelet optike (ODF)'
      ],
      installationProcess: [
        'Projektimi i rrugëtimit të fibrave optike',
        'Shtrirja fizike e kabllit dhe mbrojtja e tij',
        'Terminimi dhe saldimi profesional i fibrave',
        'Testimi me pajisje matëse të humbjeve (OTDR)',
        'Lidhja fund-për-fund dhe lëshimi në punë'
      ],
      faq: [
        { q: 'A mbetet fibra optike operative edhe pas stuhive?', a: 'Po, duke qenë se është qelq/plastikë, ajo nuk përcjell rrymën dhe nuk dëmtohet nga shkarkimet atmosferike.' }
      ],
      relatedArticles: ['instalimi-rrjetit-internetit', 'kamerap-ip'],
      iconName: 'zap'
    },
    'sistemet-e-alarmit': {
      slug: 'sistemet-e-alarmit',
      title: 'Sistemet e Alarmit dhe Kundër Vjedhjes',
      description: 'Mbrojtje e pakompromis me sisteme alarmi inteligjente dhe detektim proaktiv.',
      longDescription: "Siguria e shtëpisë apo biznesit tuaj është prioriteti ynë kryesor. Në ElektroNova, ne ofrojmë sistemet më të sigurta të **alarmit në Kosovë**, duke përdorur teknologji hibride që kombinon besueshmërinë e kabllos me fleksibilitetin e pajisjeve wireless. Sistemet tona detektojnë çdo hyrje të paautorizuar në sekondën e parë dhe ju njoftojnë menjëherë në telefonin tuaj. Ne punojmë me brendet elite si Ajax, DSC dhe Paradox, të njohura për mbrojtjen e tyre kundër ndërhyrjeve.\n\n### Pse Ju Nevojitet një Alarm në Pejë\nNjë alarm nuk kryen funksionin e tij vetëm kur nuk jeni aty. Me funksionin 'Stay Mode', ju mund të siguroni perimetrin e shtëpisë tuaj në Pejë (dyert dhe dritaret) ndërsa jeni brenda. Kjo ju jep mbrojtje 24-orëshe pa kufizuar lëvizjen tuaj. Sistemet tona inteligjente janë imune ndaj kafshëve shtëpiake, duke shmangur alarmet e panevojshme që mund të shqetësojnë fqinjët. Në qytetin e Pejës, ku afërsia me qytetarët është e lartë, një alarm me sirenë të fuqishme është parandaluesi më i mirë.\n\nIntegrimi me [Instalimin e Kamerave](/sq/sherbimet/kamerap-ip) mundëson verifikimin vizual. Nëse një alarm bie, mund të hapni kamerat në telefon dhe të shihni nëse është një rrezik i vërtetë apo gabim njerëzor. Kjo teknologji sinkronizuese është ajo që e bën një shtëpi vërtetë smart dhe të sigurt. ElektroNova ofron gjithashtu mirëmbajtje të rregullt dhe ndërrim të baterive rezervë në mënyrë që sistemi juaj të mos dështojë kurrë.",
      benefits: [
        'Detektim i menjëhershëm i thyerjes së dyerve apo dritareve',
        'Sirena të fuqishme për alarmim të jashtëm dhe të brendshëm',
        'Menaxhim i plotë përmes panelit të kontrollit dhe aplikacionit celular',
        'Bateri rezervë që mbajnë sistemin ndezur edhe pa rrymë',
        'Senzorë inteligjentë që nuk reagojnë ndaj kafshëve shtëpiake',
        'Lidhje me qendrat e monitorimit emergjent'
      ],
      useCases: [
        'Shtëpi private dhe apartamente',
        'Depo dhe dyqane të shitjes me pakicë',
        'Zyra biznesi dhe laboratorë teknologjikë',
        'Vila pushimi në zonat malore'
      ],
      technology: [
        'Teknologji wireless me rreze deri në 2000 metra (Ajax)',
        'Senzorë Lëvizjeje (PIR), Akustikë (Glass Break) dhe Magnetikë',
        'Detektorë të tymit dhe gazit të integruar',
        'Komunikim përmes Wi-Fi, Ethernet dhe GPRS/4G'
      ],
      installationProcess: [
        'Zbulimi i pikave të dobëta të hyrjes',
        'Zgjedhja midis sistemit me kabllo apo wireless',
        'Montimi i panelit qendror dhe senzorëve strategjikë',
        'Programimi i kodeve të qasjes dhe telekomandave',
        'Verifikimi i sinjalit dhe njoftimeve në telefon'
      ],
      faq: [
        { q: 'A mund ta instaloj alarmin pa dëmtuar muret?', a: 'Po, ne përdorim sisteme profesionale Wireless (si Ajax) që nuk kërkojnë shpime apo kabllo.' },
        { q: 'Çfarë ndodh nëse bie interneti?', a: 'Sistemi vazhdon të punojë përmes një SIM kartele (4G) dhe alarmon përmes sirenës.' }
      ],
      relatedArticles: ['rendesia-e-alarmit-wireless', 'kamera-sigurie-kosove-udhezues-2026', '5-gabime-kamera-sigurie'],
      iconName: 'shield'
    }
  },
  en: {
    'instalimi-kamerave-sigurise': {
      slug: 'security-camera-installation',
      title: 'Security Camera Installation (CCTV)',
      description: 'Professional 24/7 monitoring solutions with latest CCTV technology.',
      longDescription: "At ElektroNova, we provide the most professional **security camera installation in Peja** and throughout the territory of Kosovo. The security of your property—whether it is a home, business, or industrial facility—starts with efficient and reliable monitoring. We use the most advanced equipment from world-leading brands like Dahua and Hikvision, guaranteeing crystal-clear image quality (up to 4K) and high performance even in the specific climatic conditions of the Dukagjin Plain.\n\n### Why is Professional Installation Critical in Kosovo?\nInstalling cameras is not just about mounting hardware on a wall. It requires a detailed analysis of light, field of view, and protection against vandalism. Given the need for proactive security in our cities, we ensure that all cabling is hidden and protected within professional conduits and boxes. This increases system longevity and prevents unauthorized tampering. We cover every city, from Prishtina to Peja, offering rapid response within hours.\n\nOur solutions for **security camera installation in Kosovo** are designed to give you peace of mind. Every project begins with a free on-site assessment, where our technicians design strategic monitoring points to eliminate blind spots. We specialize in integrating Artificial Intelligence that allows for facial recognition, license plate recognition, and person detection in restricted perimeters.\n\n### Monitor Your Home or Business Anywhere in the World\nOur modern systems connect to secure mobile applications. Whether you are in Peja, Prishtina, or abroad, you can view your cameras in real-time. This service is critical for business owners in Kosovo who want to have control over their property at every second. AI technology reduces false alarms from animals or weather, notifying you only when there is a real threat.\n\n**Connection with Other Services:**\nFor maximum security, we recommend combining cameras with [Alarm Systems](/en/services/alarm-systems). Learn more about making the right choice in our guide: [How to choose security cameras in Kosovo?](/en/blog/si-te-zgjedhesh-kamerat-e-sigurise-kosove).\n\n### Local Support and Maintenance\nElektroNova, based in the city of Peja, offers 24/7 technical support. We are well-acquainted with the electrical grid in Kosovo and install stabilizers that protect your cameras from voltage fluctuations. Our service also includes periodic maintenance to ensure lenses are clean and recording is performed without interruption.",
      benefits: [
        'Real-time encrypted mobile monitoring',
        'High image quality (4K / 8MP) for crystal details',
        'Advanced night vision with Full-Color or IR technology',
        'Intelligent AI notifications (Person/Vehicle Detection)',
        'Insurance cost savings and theft prevention',
        'Long-term Cloud or local video storage'
      ],
      useCases: [
        'Private homes and villas with large perimeters',
        'Large shops, markets, and shopping centers',
        'Industrial factory and warehouse solutions',
        'Public spaces, educational institutions, and parking lots'
      ],
      technology: [
        'AI for human and facial recognition',
        'Full-Color technology for natural night vision',
        'H.265+ video compression for drastic memory savings',
        'IP, HDCVI, and Wireless system connections'
      ],
      installationProcess: [
        'Free on-site consultation and assessment',
        'Technical network design and coverage mapping',
        'Physical installation and professional cabling',
        'NVR/DVR and mobile app configuration',
        'Performance testing and detailed customer training'
      ],
      faq: [
        { q: 'Can I view cameras from my phone?', a: 'Yes, all our systems come with free encrypted apps for iOS and Android.' },
        { q: 'How long does a system installation take?', a: 'Usually a medium home is finished within a day, while businesses depend on complexity.' },
        { q: 'What happens if the power goes out?', a: 'Our systems can be equipped with UPS (backup batteries) that keep cameras running for hours.' }
      ],
      relatedArticles: ['5-common-security-camera-mistakes', 'security-camera-installation-cost-kosovo', 'security-cameras-kosovo-guide-2026'],
      iconName: 'camera'
    },
    'sistemet-dahua-cctv': {
      slug: 'dahua-cctv-systems',
      title: 'Dahua CCTV Systems',
      description: 'World leading technology for maximum security and artificial intelligence.',
      longDescription: "Dahua Technology is a global leader in video surveillance, and at ElektroNova, we are your trusted partners for **Dahua systems in Kosovo**. Our specialization focuses on installing the latest AI technology from Dahua, providing intelligent security for homes and the largest corporations in the country. Why choose Dahua? Because it is an investment that guarantees quality, reliability, and continuous innovation in every product.\n\n### WizSense and WizMind Technology in Peja\nThe Dahua cameras we install in Peja and other cities in Kosovo use the most advanced Artificial Intelligence chips. WizSense technology focuses only on objects that matter: people and cars. This means you won't be bothered by alarms triggered by tree movements or lights at night. For more complex institutional projects, we offer the WizMind line, which enables thermal imaging, people counting, and detailed behavior analysis.\n\n### TiOC Cameras - 3-in-1 Security for Businesses\nOne of the most requested choices by our clients in Kosovo is the TiOC (Three-in-One Camera). These devices combine 24/7 full-color monitoring, active deterrent alarms with lights and sirens, and proactive AI. If someone enters your secured perimeter in Peja, the camera will emit a voice notification and warning lights, preventing crime before it happens.\n\n**Full Integration and SEO:**\nDahua systems integrate perfectly with existing [Alarm Systems](/en/services/alarm-systems). Additionally, you can find out about installation costs in our article: [How much does security camera installation cost in Kosovo?](/en/blog/security-camera-installation-cost-kosovo).\n\n### Why ElektroNova for Dahua Systems?\nWe provide technical design, certified installation, and a full warranty. Our experts ensure that NVRs are configured to maximize memory space using H.265+ codecs, saving up to 90% of storage without losing quality. Based in Peja, we are always close to you for any service or update to your system.",
      benefits: [
        'Intelligent video analytics (Facial Recognition)',
        'Easy integration with alarm and access control systems',
        'World-class reliability with long warranty',
        'Intuitive and fast applications (DMSS)',
        'Superior image quality with Starlight technology'
      ],
      useCases: [
        'Banking and financial institution security',
        'High-traffic businesses and jewelry stores',
        'Traffic management and city monitoring',
        'Hotels, restaurants, and luxury villas'
      ],
      technology: [
        'WizSense and WizMind (AI Deep Learning)',
        'TiOC (Three-in-One Camera: Full-color, Siren, Warning lights)',
        'PoE (Power over Ethernet) for simple installation',
        'Starlight Technology for ultra-low light performance'
      ],
      installationProcess: [
        'Technical AI needs assessment',
        'Optimal Dahua model selection',
        'Intelligent NVR and server configuration',
        'Security perimeter setup (Tripwire/Intrusion)',
        'Mobile notification accuracy testing'
      ],
      faq: [
        { q: 'Why is Dahua better than other brands?', a: 'Because of rich AI innovation and excellent price/quality ratio for our market.' }
      ],
      relatedArticles: ['dahua-vs-hikvision', 'best-home-security-cameras-2025', '5-common-security-camera-mistakes'],
      iconName: 'video'
    },
    'sistemet-alarmit': {
      slug: 'alarm-systems',
      title: 'Alarm Systems and Anti-Theft',
      description: 'Uncompromised protection with intelligent alarm systems and proactive detection.',
      longDescription: "The safety of your family and business is our top priority. At ElektroNova, we offer the most secure **alarm systems in Kosovo**, utilizing hybrid technology that combines the reliability of cables with the flexibility of wireless. Our systems detect any unauthorized entry at the first second and notify you immediately on your phone. We work with elite brands like Ajax, DSC, and Paradox, known for their protection against intrusions.\n\n### Why You Need an Alarm in Peja\nAn alarm doesn't just serve its purpose when you aren't there. With the 'Stay Mode' function, you can secure the perimeter of your home in Peja (doors and windows) while you are inside. This gives you 24-hour protection without restricting your movement. Our intelligent systems are immune to pets, avoiding unnecessary alarms that might disturb neighbors. In the city of Peja, where proximity to citizens is high, a powerful siren alarm is the best deterrent.\n\nIntegration with [Camera Installation](/en/services/security-camera-installation) allows for visual verification. If an alarm goes off, you can open the cameras on your phone and see if it's a real danger or human error. This synchronizing technology is what makes a home truly smart and secure. ElektroNova also offers regular maintenance and replacement of backup batteries so your system never fails.",
      benefits: [
        'Immediate detection of door or window breaking',
        'Powerful sirens for external and internal alerting',
        'Full management via control panel and mobile app',
        'Backup batteries that keep the system on even without power',
        'Intelligent sensors that do not react to pets',
        'Connection to emergency monitoring centers'
      ],
      useCases: [
        'Private homes and apartments',
        'Warehouses and retail stores',
        'Business offices and tech labs',
        'Holiday villas in mountain areas'
      ],
      technology: [
        'Wireless technology with up to 2000 meters range (Ajax)',
        'Motion (PIR), Acoustic (Glass Break), and Magnetic sensors',
        'Integrated smoke and gas detectors',
        'Communication via Wi-Fi, Ethernet, and GPRS/4G'
      ],
      installationProcess: [
        'Detection of weak entry points',
        'Choice between cable or wireless systems',
        'Mounting the central panel and strategic sensors',
        'Programming access codes and remote controls',
        'Signal and notification verification on the phone'
      ],
      faq: [
        { q: 'Can I install the alarm without damaging the walls?', a: 'Yes, we use professional Wireless systems (like Ajax) that do not require drilling or cables.' },
        { q: 'What happens if the internet goes down?', a: 'The system continues to work via a SIM card (4G) and alarms via the siren.' }
      ],
      relatedArticles: ['importance-of-wireless-alarms', 'security-cameras-kosovo-guide-2026', '5-common-security-camera-mistakes'],
      iconName: 'shield'
    },
    'instalime-elektrike': {
      slug: 'electrical-installations',
      title: 'Professional Electrical Installations',
      description: 'Full electrical installation services for homes, apartments, and businesses across Kosovo.',
      longDescription: "Electrical installations are the backbone of any modern facility. At ElektroNova, we provide **professional electrical installations in Peja** and across the entire territory of Kosovo, guaranteeing safety, efficiency, and longevity for your network. Whether you are building a new home or renovating an existing property, our team of certified engineers and electricians is ready to offer you the best technical solutions.\n\n### Why is Professional Installation Important?\nMany fires in Kosovo are caused by poor electrical installations. We don't just connect cables; we design systems that handle the load of today's modern appliances. From selecting the correct wire thickness to installing modern panels with FI protection, every detail is calculated with precision. We use only materials from world-leading brands like Schneider, ABB, and Legrand, ensuring your investment is protected for decades.\n\n### Our Expertise in Peja and Kosovo\nAs a company based in the city of Peja, we are well-acquainted with the specifics of the electrical grid in our region. We offer free on-site consultations to assess your needs. Our services include cable routing, mounting distribution boxes, lighting installation, and full grounding of the facility. Every project is accompanied by relevant diagrams and necessary safety tests before commissioning.\n\n**Safety Integration:**\nGood electrical installation is the basis for [Security Cameras](/en/services/security-camera-installation) and [Alarm Systems](/en/services/alarm-systems). Read more on our page about: [Professional Electrical Installations](/en/services/electrical-installations).\n\n### Services for Businesses (Commercial Sector)\nFor businesses in Kosovo, we offer industrial installations that include control panels, emergency lighting, and UPS systems. We understand that every minute of downtime costs money, so we work with flexible hours to minimize disruptions during the installation process.",
      benefits: [
        'Maximum safety according to EN European standards',
        'Use of quality materials (Schneider, ABB, Legrand)',
        'Custom design for every type of facility',
        'Long-term warranty for all works',
        '24/7 technical support after installation completion'
      ],
      useCases: [
        'New homes and luxury villas',
        'Residential buildings and new complexes',
        'Shops, offices, and shopping centers',
        'Industrial facilities and production warehouses'
      ],
      technology: [
        'Halogen-free protected cabling (LSZH)',
        'Smart electrical panels with automatic fuses',
        'Surge protection systems (SPD)',
        'Professional grounding resistance meters'
      ],
      installationProcess: [
        'Consultation and electrical network planning',
        'Cable routing and mounting boxes in the wall',
        'Main panel and distribution box installation',
        'Mounting of outlets, switches, and lighting points',
        'Final circuit testing and safety certificate issuance'
      ],
      faq: [
        { q: 'How long does the electrical installation of an average house take?', a: 'Usually the process takes 7 to 14 business days, depending on the size.' },
        { q: 'Do you provide a certificate for the installation performed?', a: 'Yes, every installation of ours is tested and certified for technical safety.' }
      ],
      relatedArticles: ['electrical-installation-cost-kosovo', '5-signs-house-needs-rewiring', 'emergency-electrician-guide'],
      iconName: 'zap'
    },
    'riparime-elektrike': {
      slug: 'electrical-repairs',
      title: 'Electrical Repairs and Maintenance',
      description: 'Fast and safe solutions for any electrical defect in your home or business.',
      longDescription: "Electrical defects can happen at any time and often pose a serious risk to the safety of people and property. ElektroNova offers specialized services for **electrical repairs in Peja** and all of Kosovo, ensuring your network returns to normal operation within record time. We handle everything from burnt outlets to complex voltage issues in businesses.\n\n### Professional Intervention for Defects in Kosovo\nIn the Kosovo market, where voltage fluctuations are frequent, protecting your devices is vital. Our technicians use state-of-the-art diagnostic equipment to find the exact source of the problem, avoiding temporary fixes that could cause greater damage later. We are certified to intervene in industrial and residential systems, guaranteeing maximum safety according to ISO standards.\n\n### Why are Regular Repairs Important?\nA weak electrical connection can cause wires to heat up and potentially catch fire. Many fires in Kosovo are caused precisely by outdated installations or poorly performed repairs. At ElektroNova, we don't just do 'patchwork'. We ensure the problematic point is repaired permanently and check surrounding points to prevent future defects. Our service for **emergency electrician in Peja** is available 24/7 for critical cases.\n\n**Device Safety:**\nTo avoid damaging electronic devices like [Security Cameras](/en/services/security-camera-installation), we recommend installing surge protectors. Read more on our blog: [5 signs your house needs electrical rewiring](/en/blog/5-signs-house-needs-rewiring).\n\n### Preventive Maintenance for Businesses\nFor businesses, a power outage means financial loss. ElektroNova offers maintenance contracts for markets, factories, and offices. We perform periodic inspections with thermal cameras to detect overheating fuses before they fail. This is the smartest investment you can make for the continuity of your business.",
      benefits: [
        'Fast and accurate defect diagnosis',
        'Use of original and quality spare parts',
        'Guaranteed safety after every intervention',
        'Minimization of power downtime',
        'Advice on protecting electronic devices'
      ],
      useCases: [
        'Repair of outlets, switches, and lighting',
        'Replacement of outdated fuses',
        'Solving grounding problems',
        'Urgent repairs after short circuits'
      ],
      technology: [
        'Thermal cameras for detecting wire heating',
        'Professional multimeters and grounding resistance meters',
        'Automatic fuses from Schneider and ABB brands'
      ],
      installationProcess: [
        'Call reception and initial risk assessment',
        'Arrival at location and diagnosis with measuring devices',
        'Isolation of the problematic area for safety',
        'Repair or replacement of damaged components',
        'Final load testing and commissioning'
      ],
      faq: [
        { q: 'How fast can you come for a repair?', a: 'In the city of Peja we arrive within 30-60 minutes, while in other cities it depends on the distance.' },
        { q: 'Is there a warranty for the repairs you do?', a: 'Yes, every intervention of ours and replaced part has its own technical warranty.' }
      ],
      relatedArticles: ['why-does-the-power-trip', 'emergency-electrician-guide'],
      iconName: 'tool'
    },
    'nderrim-instalimi-elektrik': {
      slug: 'electrical-rewiring',
      title: 'Electrical Rewiring Services',
      description: 'Modernize your home safety with a complete replacement of old cabling.',
      longDescription: "If you live in a house built 30 or 40 years ago in Kosovo, there is a high chance that your electrical installation is outdated and dangerous. ElektroNova specializes in **electrical rewiring in Peja** and all of Kosovo, bringing your home up to 2026 standards. This is a complex process that requires detailed planning and precise execution to guarantee a safe life for decades to come.\n\n### Why Should You Do 'Rewiring'?\nOld installations with aluminum wires or crumbling insulation are not designed to handle the load of today's appliances like air conditioners, electric ovens, and [Smart Home](/en/services/smart-home-automation) systems. Overload in old wires is the number one cause of fires in homes in Kosovo. Rewiring is not just a matter of safety, but also of comfort; we add outlets where you need them and optimize the network to serve modern technology.\n\n### Work Process at ElektroNova\nA complete rewiring can seem daunting, but our team in Peja does it in a structured way and with as little mess as possible. We use triple-insulated copper cables and install new panels with FI (RCD) protection that protect people from electrical shocks. Every cable is labeled and documented, so in the future you know exactly where every line passes. This increases the value of your home in the Kosovo real estate market.\n\n**Homeowner Guide:**\nBefore you start, inform yourself on costs and the process in our article: [How much does electrical rewiring cost in Kosovo?](/en/blog/electrical-installation-cost-kosovo).\n\n### Safety and Certification\nAfter completion of works, we perform full measurements of insulation resistance and grounding. You receive a technical certificate proving your home is 100% safe. As a leader in Peja, ElektroNova guarantees that every cable and fuse installed is from the world's best brands, giving you peace of mind for the next 50 years.",
      benefits: [
        'Complete elimination of electrical fire risk',
        'Ability to add new outlets and lighting',
        'Energy savings through efficient cabling',
        'Significant increase in property value',
        'Compatibility with Smart Home and Solar systems'
      ],
      useCases: [
        'Old houses and apartments (over 25 years)',
        'Properties undergoing full restoration',
        'Businesses adding heavy machinery',
        'Buildings with frequent fuse problems'
      ],
      technology: [
        'Halogen-free copper cables (LSZH) for smoke safety',
        'Fire-resistant protective conduits',
        'Modern distribution systems (Busbar)'
      ],
      installationProcess: [
        'Detailed inspection of existing installation',
        'Drafting of the new electrical distribution plan',
        'Removal of old cables (where possible)',
        'Routing new lines and mounting boxes',
        'New panel installation and point testing'
      ],
      faq: [
        { q: 'Do I have to leave the house during works?', a: 'Not necessarily, we work zone by zone to minimize disruptions.' },
        { q: 'How long does a full rewiring take?', a: 'For a standard 100m2 house, the process usually takes 5-10 business days.' }
      ],
      relatedArticles: ['5-signs-house-needs-rewiring', 'electrical-installation-cost-kosovo'],
      iconName: 'refresh'
    },

    'instalim-ndricimi': {
      slug: 'lighting-installation',
      title: 'Modern and LED Lighting Installation',
      description: 'Transform your environment with intelligent and energy-efficient lighting.',
      longDescription: "Lighting is not just a means to see at night; it is the soul of your home decor and a key factor in business productivity. ElektroNova offers elite services for **lighting installation in Peja** and all of Kosovo, focusing on LED technology and intelligent control systems. We combine electrical engineering with light design to create stunning environments.\n\n### LED Lighting in Kosovo: Savings and Aesthetics\nSwitching to LED lighting is the simplest and most efficient investment you can make. In Kosovo, where energy costs are rising, our LED systems reduce lighting expenses by up to 80%. We don't just install bulbs; we design lighting schemes that highlight the architecture of your home in Peja or Prishtina. From recessed lights in the ceiling to garden and facade lighting, we offer 360-degree choices.\n\n### Intelligence of Light (Smart Lighting)\nImagine controlling light intensity and color from your phone or via voice. Our smart lighting systems integrate with platforms like Apple HomeKit and Google Home. This allows for the creation of scenarios: 'Morning' with soft light that wakes you up naturally, or 'Security' where external lights turn on automatically if [Security Cameras](/en/services/security-camera-installation) detect movement. This is the new standard of living that ElektroNova brings to your homes.\n\n**Lighting Ideas:**\nDiscover how lighting can improve security in our article: [How to install smart lighting at home](/en/blog/lighting-installation-guide).\n\n### Industrial and Public Lighting\nElektroNova has extensive experience in lighting large spaces such as warehouses, factories, and parking lots throughout Kosovo. We use high-power projectors and industrial motion sensors that guarantee maximum security and savings. Every project is accompanied by a lux (brightness) calculation to ensure every corner is correctly covered according to health and safety regulations at work.",
      benefits: [
        'Reduction of power bills by up to 80%',
        'LED light lifespan up to 50,000 hours',
        'Full environment control via smartphone',
        'Improved outdoor security through strategic lighting',
        'Personalized atmosphere for every room'
      ],
      useCases: [
        'Decorative lighting for homes and villas',
        'Professional lighting for offices and shops',
        'Outdoor lighting for gardens and facades',
        'Emergency lighting systems for businesses'
      ],
      technology: [
        'Latest LED chips with efficiency over 120 lm/W',
        'DALI and Zigbee control systems',
        'Intelligent daylight harvesting sensors'
      ],
      installationProcess: [
        'Consultation for aesthetic and functional needs',
        'Calculation of required brightness (Dialux)',
        'Cable routing and mounting of lights',
        'Programming dimmers and smart systems',
        'Verification of consumption and performance'
      ],
      faq: [
        { q: 'Can I change old lights to LED without changing cables?', a: 'In most cases yes, it is enough to replace existing fixtures.' },
        { q: 'Do you offer solar lighting for the garden?', a: 'Yes, we offer quality solar projectors that work without the need for power.' }
      ],
      relatedArticles: ['lighting-installation-guide', 'smart-home-kosovo-guide'],
      iconName: 'lightbulb'
    },
    'panele-elektrike': {
      slug: 'electrical-panels',
      title: 'Electrical Panels and Fuses',
      description: 'Installation and modernization of distribution panels for maximum protection.',
      longDescription: "The electrical panel is the 'brain' of your home. It controls energy distribution and protects your family from electrical hazards. ElektroNova offers specialized services for **electrical panel installation in Peja** and throughout the territory of Kosovo. We replace old lead fuse boxes with modern automatic panels that react in milliseconds in case of a defect.\n\n### Why Should You Modernize Your Panel?\nIn Kosovo, where voltage fluctuations and storms are present, an old panel can fail to turn off in time, causing appliance burnout or even fire. Our modern panels include Surge Protectors and FI (RCD) breakers. The FI fuse is vital: it detects the slightest current leakage and turns it off immediately if someone is touched by energy, saving lives. This is a standard we apply in every home in Peja and surrounding areas.\n\n### Services for Industry and Business\nFor commercial facilities in Kosovo, we design and mount complex control panels. These include Automatic Transfer Switches (ATS) for generators, so your business never stays without light. We use only fuses from Schneider, Eaton, and ABB brands, known for their precision. Every panel mounted by ElektroNova is tested under maximum load and comes with the relevant technical documentation.\n\n**Security and Monitoring:**\nOur panels can be integrated with monitoring systems that show you real-time consumption. This links excellently with [Smart Home](/en/services/smart-home-automation) and allows energy management from afar. We are your partner for electrical safety across all of Kosovo.",
      benefits: [
        'Guaranteed protection against electrical shocks (FI / RCD)',
        'Prevention of device damage from voltage fluctuations',
        'Balanced energy distribution in every room',
        'Ease in identifying and solving defects',
        'Full technical certification after installation'
      ],
      useCases: [
        'Replacing old lead fuse panels',
        'New panels for homes and apartments',
        'Control panels for factories and industry',
        'Automatic generator transfer systems (ATS)'
      ],
      technology: [
        'Automatic fuses (MCB) and FI (RCCB) breakers',
        'Surge and atmospheric discharge protectors (SPD)',
        'Durable copper contacts and Busbar systems'
      ],
      installationProcess: [
        'Assessment of total facility load',
        'Design of the power distribution scheme',
        'Physical mounting of the box and fuses',
        'Line connection and grounding measurement',
        'Labeling of every fuse for easy use'
      ],
      faq: [
        { q: 'Why is my FI fuse tripping often?', a: 'This usually indicates a grounding problem or a defective device leaking current.' },
        { q: 'How much does it cost to replace an old panel?', a: 'The price depends on the number of fuses, but the safety you gain is priceless.' }
      ],
      relatedArticles: ['electrical-panels-modernization', 'why-does-the-power-trip'],
      iconName: 'grid'
    },
    'mirembajtje-elektrike-biznes': {
      slug: 'electrical-maintenance-business',
      title: 'Electrical Maintenance for Businesses',
      description: 'Preventive maintenance programs to ensure your business continuity.',
      longDescription: "For every business in Kosovo, electricity is the main work tool. An unexpected defect is not just a technical problem, but a financial loss and a risk to customer safety. ElektroNova offers specialized services of **electrical maintenance for businesses in Peja** and across the territory of Kosovo. We work with markets, factories, hotels, and shopping centers to ensure their network is always in optimal condition.\n\n### Preventive Maintenance: The Smartest Investment\nSolving a problem before it happens is the key to success. Our maintenance programs include periodic inspections with thermal cameras. This technology allows us to see the heating of fuses and cables that is not visible to the naked eye, preventing fires and device melting. We are leaders in Peja for early diagnosis of commercial systems, saving you thousands of euros in emergency repairs.\n\n### 24/7 Service and Priority Response\nAs a maintenance client at ElektroNova, your business benefits from priority access. In case of any defect, our team in Peja sets off towards you immediately. We cover the protection of [Security Cameras](/en/services/security-camera-installation) and [Alarm Systems](/en/services/alarm-systems), ensuring that security systems also have continuous power. Our contracts are flexible and adapt according to the size and specific needs of your business in Kosovo.\n\n**Energy Efficiency:**\nMaintenance is not just about repairs, but also about savings. We analyze your consumption and propose the best choices for LED lighting and automation that lower power bills. Read more on: [How to save energy in your business](/en/blog/business-electrical-maintenance).",
      benefits: [
        'Minimization of risk for unexpected work interruptions',
        'Proactive solutions through thermal inspection',
        '24/7 priority technical support',
        'Increase in the lifespan of machinery and equipment',
        'Compliance with health and safety at work norms'
      ],
      useCases: [
        'Restaurants and hotels requiring 24/7 energy',
        'Factories and production workshops with heavy machinery',
        'Shopping centers and grocery markets',
        'Business offices and tech labs'
      ],
      technology: [
        'Professional thermal cameras (FLIR)',
        'Power quality analyzers',
        'Remote load monitoring systems'
      ],
      installationProcess: [
        'Initial audit of existing installation',
        'Drafting of the periodic maintenance plan',
        'Performing regular inspections and tests',
        'Technical reporting for every intervention performed',
        'Immediate support in emergency cases'
      ],
      faq: [
        { q: 'Why does a small business need a maintenance contract?', a: 'Because even the smallest defect can block work and damage your expensive equipment.' },
        { q: 'Is lighting replacement included in maintenance?', a: 'Yes, we take care of all lighting points so your business is always well-lit.' }
      ],
      relatedArticles: ['business-electrical-maintenance', 'solar-energy-kosovo-guide'],
      iconName: 'briefcase'
    },
    'elektricist-urgjent': {
      slug: 'emergency-electrician-24h',
      title: '24/7 Emergency Electrician',
      description: 'Immediate intervention for critical electrical defects across Kosovo.',
      longDescription: "When the power goes out, when you hear crackling in the walls, or when you smell something burning from the fuses, there is no time to wait. ElektroNova offers the fastest service for **emergency electrician in Peja** and surrounding areas. We understand that electrical emergencies don't just happen during business hours, so our mobile teams are on standby 24 hours a day, 7 days a week, across the entire territory of Kosovo.\n\n### When Should You Call the Emergency Electrician?\nElectrical hazards are unpredictable. If you have a total power loss (and neighbors have power), if a short circuit happens causing sparks, or if your devices start overheating significantly, call us immediately. Our specialty in Peja is solving problems that pose a direct risk to life. We are equipped with the most modern tools to isolate the defect and restore safety to your home within minutes.\n\n### Your Safety in Professional Hands\nMany people in Kosovo attempt to repair emergency defects themselves, which can be fatal. ElektroNova advises you: do not touch anything that has signs of burning or sparks. Our certified technicians have the experience and proper protective clothing to intervene in high voltage. Our emergency service also covers the repair of critical systems like [Electrical Panels](/en/services/electrical-panels) and power supply for [Security Cameras](/en/services/security-camera-installation).\n\n**Steps to Take:**\nIn case of danger, make sure to know our page: [How to react in electrical emergency cases](/en/blog/emergency-electrician-guide). We are your first call for safety in Peja, Prishtina, and every corner of Kosovo.",
      benefits: [
        'Arrival at location within 30-60 minutes in Peja',
        'Full 24/7 readiness (even during holidays)',
        'Certified technicians experienced in critical cases',
        'Immediate diagnosis with modern equipment',
        'Final solution to prevent recurrence'
      ],
      useCases: [
        'Short circuits and electrical sparks',
        'Burning of panels or main fuses',
        'Loss of voltage in one phase',
        'Defects after storms or water leaks'
      ],
      technology: [
        'Apparatus for finding defects under walls',
        'Protective clothing against electrical arc',
        'Immediate spare parts for repair'
      ],
      installationProcess: [
        'Call reception and client instruction for safety',
        'Immediate dispatch of the mobile team',
        'Isolation of defect and situation stabilization',
        'Full repair of problematic points',
        'Safety testing before power release'
      ],
      faq: [
        { q: 'Do you also work during the night?', a: 'Yes, our emergency service never stops, 24 hours every day of the year.' },
        { q: 'How much does the emergency service cost?', a: 'Initial price depends on distance and call time, but we are transparent with costs.' }
      ],
      relatedArticles: ['emergency-electrician-guide', 'why-does-the-power-trip'],
      iconName: 'alert'
    },

    'smart-home-automatizimi': {
      slug: 'smart-home-automation',
      title: 'Smart Home and Automation',
      description: 'Transform your home into an intelligent and efficient space.',
      longDescription: "Smart homes are no longer a concept of the future; they are here. ElektroNova offers the most advanced **Smart Home solutions in Kosovo**, allowing you to have full control over your environment through a single application. From lighting and temperature control to shutter and fence automation, we do it all.\n\n### Why Smart Home in Peja?\nModern living requires efficiency. By installing intelligent systems in Peja or Prishtina, you can reduce energy costs by up to 30%. Imagine the heating turning off automatically when you leave the house and turning on just before you return. Or lights that adapt according to the time of day to create the perfect atmosphere. This not only adds comfort but also increases the value of your property in the Kosovo market.",
      benefits: [
        'Full control of lighting and devices from mobile',
        'Significant energy savings',
        'Customized scenarios (e.g., \"Movie Night\" or \"Leaving Home\")',
        'Real-time notifications for environment security',
        'Increase in property value',
        'Integration with voice assistants (Alexa, Google Assistant)'
      ],
      useCases: [
        'Modern homes and luxury apartments',
        'Offices requiring efficiency in lighting and heating',
        'Hotels and apartments for rent (remote control)',
        'Industrial facilities for condition monitoring'
      ],
      technology: [
        'Zigbee 3.0 and Z-Wave Plus protocols',
        'Smart sensors for temperature, humidity, and light',
        'Smart switches and outlets that do not require cable changes',
        'Local servers for maximum privacy (Home Assistant/Hubitat)'
      ],
      installationProcess: [
        'Analysis of client automation needs',
        'Selection of suitable ecosystem (Apple, Google, etc.)',
        'Installation of smart devices and bridging hubs',
        'Configuration of scenarios and automation rules',
        'Client training for app usage'
      ],
      faq: [
        { q: 'Do I have to drill walls to make my home smart?', a: 'No, many of our systems work wirelessly and can be installed in existing homes.' },
        { q: 'Can I control my home when I am outside Kosovo?', a: 'Yes, through the internet you have full access from anywhere in the world.' }
      ],
      relatedArticles: ['smart-home-kosovo-guide', 'lighting-installation-guide'],
      iconName: 'home'
    },
    'kamerap-ip': {
      slug: 'ip-cameras',
      title: 'IP Cameras and Digital Security',
      description: 'Modern solutions with high resolution and PoE technology for professional monitoring.',
      longDescription: "IP (Internet Protocol) cameras represent the highest standard of visual security today. At ElektroNova, we provide **IP camera installation in Kosovo** that offers superior image quality, infinite flexibility, and full integration with existing internet networks. Unlike analog systems, IP cameras transmit digital data, ensuring no detail is lost during transmission.\n\n### Advantages of IP Cameras in Peja\nThe use of PoE (Power over Ethernet) technology means that a single network cable supplies the camera with power and transmits the video signal. This reduces installation costs and increases accuracy. With resolutions reaching up to 12MP and more, these cameras are ideal for spots requiring precise identification, like over cash registers in shops or at the entrances of institutions in Peja and Prishtina.\n\n### Built-in Intelligence\nMany of our IP cameras have powerful processors that perform video analysis directly on the device. This includes facial recognition, people counting, and intelligent alarms that arrive on your phone in seconds. We work with leading brands like Dahua and Hikvision to ensure you have access to the latest in security technology.",
      benefits: [
        'Crystal clear image quality up to 4K and above',
        'Simple installation with a single cable (PoE)',
        'Secure remote access via high encryption',
        'Capability for recording on SD memory cards',
        'Easy integration with other digital systems'
      ],
      useCases: [
        'Businesses requiring maximum details',
        'Smart homes demanding total control',
        'Monitoring of open spaces and parking lots',
        'Solutions for banking and state institutions'
      ],
      technology: [
        'CMOS progressive sensors for blur-free images',
        'TLS/SSL data encryption',
        'ONVIF standard for compatibility with other devices',
        'Hybrid technology for low light'
      ],
      installationProcess: [
        'Audit of existing network infrastructure',
        'Selection of strategic points for maximum coverage',
        'CAT6 cabling routing and PoE switch mounting',
        'Configuration of IP addresses and cybersecurity',
        'Testing signal stability and recording'
      ],
      faq: [
        { q: 'Can IP cameras work without internet?', a: 'Yes, they record locally on an NVR or SD card; internet is only needed to view them remotely.' },
        { q: 'How many IP cameras can a simple network handle?', a: 'It depends on network speed, but we apply isolated VLANs so as not to overload your work internet.' }
      ],
      relatedArticles: ['best-home-security-cameras-2025', 'dahua-vs-hikvision'],
      iconName: 'video'
    },
    'sistemet-nvr-dvr': {
      slug: 'nvr-dvr-systems',
      title: 'NVR and DVR Recorders',
      description: 'The control center for your surveillance system, with secure data storage.',
      longDescription: "The recorder is the heart of every security system. ElektroNova offers installation and configuration of **NVR (Network Video Recorder) systems** for IP cameras and **DVR (Digital Video Recorder)** for analog systems. We ensure your monitoring center in Peja is impregnable and reliable 24/7.\n\n### NVR vs DVR: What do you need?\nNVRs are the modern choice that processes digital data directly from the network, providing higher resolution and advanced AI capabilities. DVRs are an economical and stable choice for facilities where coaxial cabling is already present. We use recorders that support high compression standards (H.265+), allowing you to keep recordings for weeks without the need for massive Hard Drive investments.\n\n### Data Security\nWe install dedicated Surveillance Grade Hard Drives designed for intensive 24/7 workloads. Furthermore, we configure automated backup systems and notifications in case of disk failure, guaranteeing that no important second of video is lost.",
      benefits: [
        'Continuous recording in full resolution',
        'Simple management of all cameras from one place',
        'Automatic backup to Cloud or external servers',
        'Mobile app for monitoring from anywhere in the world',
        'High protection with passwords and encryption'
      ],
      useCases: [
        'Private homes and residential facilities',
        'Industrial solutions with large number of cameras',
        'Shops and market chains across Kosovo',
        'Mobile systems for transport and vehicles'
      ],
      technology: [
        'H.265+ compression for memory saving',
        'Support for Artificial Intelligence (AI Decoding)',
        'RAID systems for disk security',
        'HDMI/VGA output for local 4K monitoring'
      ],
      installationProcess: [
        'Selecting recorder based on camera count',
        'Installing Hard Drives and proper ventilation',
        'Connecting to the internet network and power sources',
        'Configuring recording schedules (Motion/Continuous)',
        'User training for recording retrieval'
      ],
      faq: [
        { q: 'How many days of recording can an NVR hold?', a: 'It depends on the number of cameras and hard drive size. Usually we configure 15 to 30 days.' },
        { q: 'Can I view old recordings from the phone?', a: 'Yes, via the app you can go back to any recorded time and day stored on the recorder.' }
      ],
      relatedArticles: ['security-camera-installation-cost-kosovo', '5-common-security-camera-mistakes'],
      iconName: 'database'
    },
    'mirembajtja-cctv': {
      slug: 'cctv-maintenance',
      title: 'CCTV Systems Maintenance',
      description: 'Ensure longevity and maximum performance for your cameras through periodic servicing.',
      longDescription: "A security system that is not maintained represents a hidden risk. Dust, spider webs on lenses, and voltage fluctuations can lower the efficiency of your system exactly when you need it most. ElektroNova offers complete packages of **CCTV maintenance in Peja** and all of Kosovo, guaranteeing every camera is in perfect working condition.\n\n### Why is maintenance important?\nMany clients realize a Hard Drive has failed only when they need to review a theft. We perform periodic checks that include physical cleaning of lenses, checking disk health, software updates (Firmware), and testing backup batteries (UPS). This prevents unexpected failures and increases the lifespan of your investment for decades.\n\n### Professional On-site Service\nOur team arrives at your location with all the necessary tools. We re-focus cameras that may have been moved by wind or tampering, and ensure that night vision (IR/FullColor) is as clear as the first day of installation.",
      benefits: [
        'Prevention of critical system failures',
        'Clear images without interference',
        'Continuous security of recordings on Hard Drive',
        'Protection from hacking through regular updates',
        'Reduction of repair costs in the long run'
      ],
      useCases: [
        'Businesses in dusty or humid environments',
        'Security systems in industrial facilities',
        'City monitoring and public spaces',
        'Homes and villas requiring 100% security'
      ],
      technology: [
        'Antistatic cleaning fluids for lenses',
        'Diagnostic software for Hard Drives',
        'Meters for voltage and PoE stability',
        'Remote condition monitoring systems'
      ],
      installationProcess: [
        'Initial audit of system condition',
        'Physical cleaning of all cameras and boxes',
        'Verification of all connections and cables',
        'Control of video quality and focus',
        'Technical report of works and update advice'
      ],
      faq: [
        { q: 'How often should security cameras be cleaned?', a: 'We recommend a full cleaning every 6 months, especially for outdoor cameras.' },
        { q: 'Are replacement parts included in maintenance?', a: 'Servicing works are included, whereas damaged components are replaced according to the agreement or warranty.' }
      ],
      relatedArticles: ['security-cameras-kosovo-guide-2026', 'dahua-vs-hikvision'],
      iconName: 'tool'
    },
    'siguria-shtepise-menqur': {
      slug: 'smart-home-security',
      title: 'Smart Home Security',
      description: 'Integration of physical protection with smart automation for 360-degree security.',
      longDescription: "Security is no longer just an alarm or a camera; it is an ecosystem that interacts. At ElektroNova, we are pioneers of **smart home security in Kosovo**. We build systems where lights, cameras, alarms, and smart locks work together to prevent danger before it happens.\n\n### The Philosophy of Proactive Security\nImagine this: If exterior sensors detect movement past midnight, yard lights turn on automatically, window shutters close, and you get an audio notification in your bedroom. That is the power of automation. We use devices operating on Matter, Zigbee, and Z-Wave protocols, guaranteeing your home remains safe even without the need for cables in every room.\n\n### Control from Anywhere\nWhether you are in Peja or on vacation abroad, you have full control. You can lock doors, check who is waiting at the doorbell, or simulate your presence at home by turning on lights remotely. This is the new standard of family protection in Kosovo.",
      benefits: [
        'Layered and proactive protection',
        'Energy savings through smart automation',
        'Instant notifications for any anomaly',
        'Ease of use via voice assistants',
        'Peace of mind 24 hours a day'
      ],
      useCases: [
        'Luxury villas and modern family homes',
        'Smart apartments in urban centers',
        'Offices requiring efficient security management',
        'Vacation properties monitored remotely'
      ],
      technology: [
        'Matter standard for universal connectivity',
        'Bank-grade encryption for wireless devices',
        'Multi-functional sensors (Motion, Light, Temperature)',
        'Integration systems like Apple Home, Google, and Amazon'
      ],
      installationProcess: [
        'Designing the smart security ecosystem',
        'Installation of the control hub',
        'Configuration of sensors and actuating devices',
        'Creation of custom security scenarios',
        'Integration testing and family training'
      ],
      faq: [
        { q: 'Is wireless security as good as wired?', a: 'Yes, our professional systems use encrypted frequencies immune to common jamming devices.' },
        { q: 'What happens if the internet goes down?', a: 'The system continues working locally; sensors and alarms will trigger normally inside the house.' }
      ],
      relatedArticles: ['smart-home-kosovo-guide', 'importance-of-wireless-alarms'],
      iconName: 'home'
    },
    'kontrolli-hyrjes': {
      slug: 'access-control',
      title: 'Access Control Systems',
      description: 'Manage access to your premises via biometric technology and RFID cards.',
      longDescription: "Physical security starts at the door. ElektroNova offers elite choices for **access control in Kosovo**, replacing traditional keys with secure digital technology. From small business offices to large factories in Peja, we ensure that only authorized persons enter your sensitive domains.\n\n### Biometric and Modern Technology\nWe install fingerprint readers, facial recognition, and smart card readers. This not only enhances security but also simplifies staff management. Every entry and exit is logged in a database, providing a full overview of who and when someone entered the facility. The system can also be integrated with [Alarm Systems](/en/services/alarm-systems) to automatically disarm when an authorized staff member arrives.\n\n### Security for Staircases and Elevators\nFor residential complexes in Prishtina and Peja, we provide access control for elevators and main entrances. This protects residents from uninvited guests and raises the level of privacy within the building.",
      benefits: [
        'Elimination of risk from key duplication',
        'Full control and reporting of accesses in real-time',
        'Contactless solutions for maximum hygiene',
        'Possibility to assign specific entry schedules',
        'Integration with staff time and attendance systems'
      ],
      useCases: [
        'Business offices, banks, and institutions',
        'Residential buildings and new complexes',
        'Hotels and apartments with digital access',
        'Industrial spaces and warehouses'
      ],
      technology: [
        'Biometric readers (Fingerprint / Face ID)',
        'RFID and NFC technology (Cards and Smartphone)',
        'High-quality electric and motor locks',
        'Access management servers with Web access'
      ],
      installationProcess: [
        'Assessment of passing points and number of users',
        'Selection of authentication method (Card/Biometrics)',
        'Mounting readers and door blockers',
        'Configuration of management software',
        'User enrollment and security testing'
      ],
      faq: [
        { q: 'What happens if someone loses an access card?', a: 'The card is deleted from the system immediately, rendering it useless to the finder.' },
        { q: 'Do electric locks work if the power goes out?', a: 'Yes, we install systems that open automatically in emergencies or remain closed via backup batteries.' }
      ],
      relatedArticles: ['video-intercom-systems', 'smart-home-automation'],
      iconName: 'lock'
    },
    'sistemet-interfonit': {
      slug: 'intercom-systems',
      title: 'Intercom Systems',
      description: 'Secure and clear communication for the entrance of your home or building.',
      longDescription: "An intercom is the first step towards building a secure perimeter. ElektroNova provides installation of **intercom systems in Peja** for private homes and multi-residential buildings. We use audio-visual equipment that supports clear communication and easy management of visitors.\n\n### Solutions for Apartments and Homes\nFrom classic audio systems to digital ones connecting tens of apartments, we provide the right choice for any request. We work with renowned brands like Biticino, Hikvision, and Commax, guaranteeing your system is resilient to vandalism and climatic conditions in Kosovo.",
      benefits: [
        'Increased security by speaking before opening the door',
        'Weather-resistant solutions',
        'Crystal clear audio without noise',
        'Added value to your property',
        'Modern devices fitting interior design',
        'Sturdy installation for long-term use'
      ],
      useCases: [
        'Private homes and villas',
        'Residential buildings and joint complexes',
        'Business facilities and receptions',
        'Offices requiring visitor control'
      ],
      technology: [
        'Analog and digital systems (2-wire / IP)',
        'Outdoor panels from aluminum or steel',
        'Connection with standard electric locks'
      ],
      installationProcess: [
        'Positioning of outdoor and indoor panels',
        'Routing dedicated cabling',
        'Mounting devices and connecting power',
        'Syncing with the door electric lock',
        'Testing sound and door unlocking'
      ],
      faq: [
        { q: 'Can I replace my old intercom with a new one?', a: 'Yes, we modernize existing systems without the need for major changes.' }
      ],
      relatedArticles: ['video-intercom-systems', 'access-control-guide'],
      iconName: 'phone'
    },
    'interfoni-video': {
      slug: 'video-intercom-systems',
      title: 'Video Intercom Systems',
      description: 'See and speak with your visitors through an HD screen or directly from your phone.',
      longDescription: "The video intercom is the evolution of the classic intercom. ElektroNova installs **video intercoms in Peja** that let you see the visitor in real-time, increasing security and comfort. This technology is ideal for homes where you want to see who is waiting at the door before answering.\n\n### IP Video Intercom - Security on your Smartphone\nOur modern IP systems allow you to receive the doorbell call directly on your phone, wherever you are. If someone rings the bell in Peja while you are in Prishtina or abroad, you can talk to the visitor and even unlock the door if you choose. Our devices feature high-resolution cameras and night vision (IR), ensuring you see clearly at any hour.",
      benefits: [
        'Visual identification of visitor prior to access',
        'The call rings on your smartphone in real-time',
        'Photo/video recording of individuals who ring the bell',
        'Modern screens with Touch technology',
        'Link with [Security Cameras](/en/services/security-camera-installation)'
      ],
      useCases: [
        'Private homes and luxury villas',
        'Modern apartments with centralized monitoring',
        'Businesses requiring visual entrance control',
        'Hotels and professional offices'
      ],
      technology: [
        'HD camera with wide viewing angle (180°)',
        'SIP protocol for stable communication',
        'Wi-Fi and Ethernet connectivity',
        'Indoor LCD screens up to 10 inches'
      ],
      installationProcess: [
        'Assessing the camera viewing angle',
        'Installing CAT6 cabling for IP video',
        'Mounting indoor monitors and outdoor panels',
        'Linking with mobile app and Wi-Fi network',
        'Configuration of recording functions'
      ],
      faq: [
        { q: 'Does the video intercom record who called when I am not at home?', a: 'Yes, our systems save photos of missed visitors in internal memory.' },
        { q: 'Can the video intercom connect with other cameras?', a: 'Yes, you can view security cameras directly from your intercom screen.' }
      ],
      relatedArticles: ['intercom-systems', 'access-control-guide'],
      iconName: 'eye'
    },
    'instalimi-rrjetit-internetit': {
      slug: 'network-internet-installation',
      title: 'Network and Internet Installation',
      description: 'Build a robust and fast internet infrastructure for homes and businesses.',
      longDescription: "Nowadays, fast and stable internet is as crucial as electricity. ElektroNova provides professional services for **computer network installation in Peja**, guaranteeing maximum Wi-Fi coverage and stable links using CAT6/CAT7 cables. We help businesses and homes have a network that never fails.\n\n### Powerful Wi-Fi without \"Dead Zones\"\nForget about signal issues on the second floor or in the yard. We install professional Access Points that create a unified Mesh network throughout the whole house. This ensures that [IP Security Cameras](/en/services/ip-cameras) and [Smart Home](/en/services/smart-home-automation) run uninterrupted. For businesses, we design secure networks with separate VLANs for staff and visitors.",
      benefits: [
        'Maximum data transfer speeds',
        '100% Wi-Fi coverage in every corner of the property',
        'High stability for working from home and gaming',
        'Secure network from cyber threats',
        'Organized and aesthetic cabling in offices'
      ],
      useCases: [
        'Modern homes with multiple connected devices',
        'Business offices, Call Centers, and Co-working spaces',
        'Hotels, restaurants, and cafeterias',
        'Warehouses and industrial facilities requiring internet'
      ],
      technology: [
        'CAT6A / CAT7 structural cabling (10 Gbps)',
        'Wi-Fi 6 and Mesh systems (Ubiquiti / TP-Link)',
        'Gigabit Switches and professional Firewalls',
        'Organized racks and distribution panels'
      ],
      installationProcess: [
        'Needs analysis for speed and coverage',
        'Routing cables to strategic points',
        'Installing routers and access points',
        'Network security and passwords configuration',
        'Speed measuring and load tests'
      ],
      faq: [
        { q: 'Why is my internet slow despite having a fast package?', a: 'Often the problem lies with a weak router or old internal cabling.' },
        { q: 'Can you build an internet network in a finished house?', a: 'Yes, we use wireless Mesh choices or pull cables through existing conduits.' }
      ],
      relatedArticles: ['ip-cameras', 'smart-home-automation'],
      iconName: 'wifi'
    },
    'instalimi-fibres-optike': {
      slug: 'fiber-optic-installation',
      title: 'Fiber Optic Installation',
      description: 'Ultra-fast connections through fiber optic technology for long distances.',
      longDescription: "When traditional copper cables reach their limits, fiber optics come to the rescue. ElektroNova offers **fiber optic services in Kosovo** for projects demanding breakneck speeds and long distances with zero signal loss. This technology is ideal for business campuses, interlinking multiple facilities, or CCTV systems over large distances.\n\n### Speed of Light at your Facility\nFiber optic cables are immune to electrical interferences, making them perfect for industrial environments. We perform fiber installation within buildings (FTTH) and linking with network devices. With our expertise in Peja, we ensure your digital infrastructure is ready for the next decade's standards.",
      benefits: [
        'Unlimited internet and data speeds',
        'Total immunity to lightning and electrical interference',
        'Cable length spanning kilometers without signal loss',
        'Future-proof infrastructure',
        'High security - fiber is difficult to tap'
      ],
      useCases: [
        'Interlinking servers and main offices',
        'Security systems over long perimeters (factories, borders)',
        'High-scale smart homes',
        'Educational and hospital institutions'
      ],
      technology: [
        'Single-mode and Multi-mode fiber',
        'Media Converters and SFP Switches',
        'Fiber splicing technology',
        'Optical Distribution Frames (ODF) and pigtails'
      ],
      installationProcess: [
        'Designing fiber optic pathways',
        'Physical cable pulling and its protection',
        'Professional termination and splicing of fibers',
        'Loss testing with meters (OTDR)',
        'End-to-end linking and commissioning'
      ],
      faq: [
        { q: 'Does fiber optic remain operational after storms?', a: 'Yes, being glass/plastic, it does not conduct electricity and is immune to atmospheric discharges.' }
      ],
      relatedArticles: ['network-internet-installation', 'ip-cameras'],
      iconName: 'zap'
    },
    'sistemet-e-alarmit': {
      slug: 'alarm-systems-anti-theft',
      title: 'Alarm Systems and Anti-Theft',
      description: 'Uncompromised protection with intelligent alarm systems and proactive detection.',
      longDescription: "The safety of your home or business is our top priority. At ElektroNova, we offer the most secure **alarm systems in Kosovo**, utilizing hybrid technology that combines the reliability of cables with the flexibility of wireless devices. Our systems detect any unauthorized entry in the very first second and notify you immediately on your phone. We work with elite brands like Ajax, DSC, and Paradox, known for their protection against intrusions.\n\n### Why You Need an Alarm in Peja\nAn alarm doesn't just fulfill its function when you're absent. With the 'Stay Mode' function, you can secure your home's perimeter in Peja (doors and windows) while you are inside. This gives you 24-hour protection without restricting movement. Our intelligent systems are immune to pets, avoiding unnecessary alarms that might disturb neighbors. In the city of Peja, where citizen proximity is high, a powerful siren alarm is the best deterrent.\n\nIntegration with [Camera Installation](/en/services/ip-cameras) enables visual verification. If an alarm goes off, you can open the cameras on your phone and see if it is a real risk or human error. This synchronizing technology is what makes a home truly smart and safe. ElektroNova also offers regular maintenance and replacement of backup batteries so your system never fails.",
      benefits: [
        'Immediate detection of door or window breaking',
        'Powerful sirens for external and internal alerting',
        'Full management via control panel and mobile app',
        'Backup batteries that keep the system on even without power',
        'Intelligent sensors that do not react to pets',
        'Connection to emergency monitoring centers'
      ],
      useCases: [
        'Private homes and apartments',
        'Warehouses and retail stores',
        'Business offices and tech labs',
        'Holiday villas in mountain areas'
      ],
      technology: [
        'Wireless technology with up to 2000 meters range (Ajax)',
        'Motion (PIR), Acoustic (Glass Break), and Magnetic sensors',
        'Integrated smoke and gas detectors',
        'Communication via Wi-Fi, Ethernet, and GPRS/4G'
      ],
      installationProcess: [
        'Detection of weak entry points',
        'Choice between cable or wireless systems',
        'Mounting the central panel and strategic sensors',
        'Programming access codes and remote controls',
        'Signal and notification verification on the phone'
      ],
      faq: [
        { q: 'Can I install the alarm without damaging the walls?', a: 'Yes, we use professional Wireless systems (like Ajax) that do not require drilling or cables.' },
        { q: 'What happens if the internet goes down?', a: 'The system continues to work via a SIM card (4G) and alarms via the siren.' }
      ],
      relatedArticles: ['importance-of-wireless-alarms', 'security-cameras-kosovo-guide-2026', '5-common-security-camera-mistakes'],
      iconName: 'shield'
    }
  }
};

export const getServiceBySlug = (slug: string, localeCode: string): ServiceContent | undefined => {
  return servicesData[localeCode]?.[slug] || 
         Object.values(servicesData[localeCode] || {}).find(s => s.slug === slug);
};

export const getAlternateServiceSlug = (currentSlug: string, targetLocale: string): string => {
  let baseKey: string | undefined;
  
  for (const loc of ['sq', 'en']) {
    const data = servicesData[loc];
    if (!data) continue;
    
    if (data[currentSlug]) {
      baseKey = currentSlug;
      break;
    }
    
    const foundEntry = Object.entries(data).find(([k, v]) => v.slug === currentSlug);
    if (foundEntry) {
      baseKey = foundEntry[0];
      break;
    }
  }

  if (baseKey && servicesData[targetLocale]?.[baseKey]) {
    return servicesData[targetLocale][baseKey].slug;
  }
  return currentSlug;
};
