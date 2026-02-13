import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Warehouse,
  CalendarDays,
  Receipt,
  Truck,
  Package,
  BarChart3,
  FileText,
  Star,
  MapPin,
  Bell,
  Shield,
  Zap,
  Camera,
  ShieldAlert,
  Phone,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  Settings,
  Copy,
  Edit,
  Trash2,
  Clock,
  CreditCard,
  Globe,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  LogIn,
  Hash,
  Send,
  Wrench,
  ShieldCheck,
  FileBarChart,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface GuideSectionProps {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function GuideSection({ id, icon: Icon, iconColor, title, subtitle, children, defaultOpen = false }: GuideSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card id={id} data-testid={`guide-section-${id}`}>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setOpen(!open)}
        data-testid={`button-toggle-${id}`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
          </div>
          {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 space-y-4">
          <div className="border-t pt-4">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3" data-testid={`step-${number}`}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground" data-testid={`text-step-title-${number}`}>{title}</p>
        <div className="text-sm text-muted-foreground mt-1 space-y-1">{children}</div>
      </div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" data-testid="text-tip">
      <Star className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 dark:text-amber-200">{children}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" data-testid="text-warning">
      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-800 dark:text-red-200">{children}</p>
    </div>
  );
}

const NAV_LINKS = [
  { id: "login", label: "Hyrja & Regjistrimi", icon: LogIn },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "procesverbal", label: "Procesverbal i Ri", icon: PlusCircle },
  { id: "clients", label: "Klientët", icon: Users },
  { id: "inventory", label: "Stoku", icon: Warehouse },
  { id: "calendar", label: "Kalendari", icon: CalendarDays },
  { id: "expenses", label: "Shpenzimet", icon: Receipt },
  { id: "suppliers", label: "Furnitorët", icon: Truck },
  { id: "catalog", label: "Katalogu", icon: Package },
  { id: "analytics", label: "Analiza", icon: BarChart3 },
  { id: "pdf", label: "PDF & Dokumentet", icon: FileText },
  { id: "notifications", label: "Njoftimet", icon: Bell },
  { id: "gps", label: "GPS & Lokacioni", icon: MapPin },
  { id: "rating", label: "Vlerësimi Publik", icon: Star },
  { id: "pwa", label: "Aplikacioni Offline", icon: Smartphone },
  { id: "admin", label: "Modaliteti Admin", icon: Shield },
  { id: "settings", label: "Profili & Tema", icon: Settings },
];

export default function GuidePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight" data-testid="text-guide-title">Udhëzuesi i Përdorimit</h1>
            <p className="text-muted-foreground mt-1" data-testid="text-guide-subtitle">Mësoni si të përdorni çdo funksion të Elektronova hap pas hapi</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-3">Kalo direkt te seksioni që doni:</p>
            <div className="flex flex-wrap gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="inline-flex items-center gap-1.5"
                  data-testid={`link-nav-${link.id}`}
                >
                  <Badge variant="secondary" className="cursor-pointer gap-1">
                    <link.icon className="h-3 w-3" />
                    {link.label}
                  </Badge>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <GuideSection
          id="login"
          icon={LogIn}
          iconColor="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400"
          title="Hyrja & Regjistrimi"
          subtitle="Si të hyni ose krijoni llogari të re"
          defaultOpen={true}
        >
          <div className="space-y-4">
            <p className="text-sm">Para se të përdorni aplikacionin, duhet të hyni me llogarinë tuaj ose të krijoni një llogari të re.</p>

            <h4 className="font-semibold text-sm">Hyrja (Login)</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni faqjen e hyrjes">
                <p>Kur hapni aplikacionin, nëse nuk jeni i kyqur, do të ridrejtoheni automatikisht te faqja e hyrjes.</p>
              </Step>
              <Step number={2} title="Vendosni kredencialet">
                <p>Shkruani <strong>emrin e përdoruesit</strong> (username) dhe <strong>fjalëkalimin</strong> tuaj.</p>
              </Step>
              <Step number={3} title="Klikoni &quot;Hyr&quot;">
                <p>Do të ridrejtoheni te Dashboard-i nëse të dhënat janë të sakta.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Regjistrimi (Llogari e Re)</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni &quot;Regjistrohu&quot;">
                <p>Në faqjen e hyrjes, klikoni linkun &quot;Regjistrohu&quot; për të hapur formën e regjistrimit.</p>
              </Step>
              <Step number={2} title="Plotësoni të dhënat">
                <p>Shkruani: <strong>Emrin e plotë</strong>, <strong>Username</strong> (emrin e përdoruesit), dhe <strong>Fjalëkalimin</strong>.</p>
              </Step>
              <Step number={3} title="Roli i llogarisë">
                <p>Llogaria e re krijohet si <strong>Teknik</strong>. Admini mund ta ndryshojë rolin më vonë.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Dy Llojet e Llogarive</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; <strong>Admin</strong> — Akses i plotë: çmimet e blerjes, analiza, menaxhimi i përdoruesve, fitimi</p>
              <p>&bull; <strong>Teknik</strong> — Krijon/ndrysho punë, shiko katalog, stok, klientë, por pa çmimet e blerjes</p>
            </div>

            <Tip>Fjalëkalimi ruhet i enkriptuar. Nëse harroni fjalëkalimin, kontaktoni administratorin për ta rivendosur.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="dashboard"
          icon={LayoutDashboard}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          title="Dashboard (Faqja Kryesore)"
          subtitle="Pamja e përgjithshme e të gjitha punëve"
        >
          <div className="space-y-4">
            <p className="text-sm">Dashboard-i është faqja e parë që shihni kur hyni në aplikacion. Këtu menaxhoni të gjitha procesverbalet (punët) tuaja.</p>

            <h4 className="font-semibold text-sm">Karta Përmbledhëse</h4>
            <p className="text-sm text-muted-foreground">Në krye të Dashboard-it shfaqen 4 karta me statistika të shpejta:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; <strong>Totali Punëve</strong> — Numri i përgjithshëm i punëve</p>
              <p>&bull; <strong>Në Progres</strong> — Sa punë janë aktualisht në progres</p>
              <p>&bull; <strong>Të Përfunduara</strong> — Sa punë janë përfunduar</p>
              <p>&bull; <strong>Pa Paguar</strong> — Sa punë të përfunduara nuk janë paguar ende</p>
            </div>

            <h4 className="font-semibold text-sm">Krijo Punë të Re (Shpejt)</h4>
            <p className="text-sm text-muted-foreground">Në krye të faqjes keni 4 kartela për krijimin e shpejtë sipas kategorisë:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Zap className="h-4 w-4 text-blue-500" /> <span className="text-sm">Rrymë/Elektrike</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Camera className="h-4 w-4 text-emerald-500" /> <span className="text-sm">Kamera</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <ShieldAlert className="h-4 w-4 text-red-500" /> <span className="text-sm">Alarm</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Phone className="h-4 w-4 text-purple-500" /> <span className="text-sm">Interfon</span>
              </div>
            </div>

            <h4 className="font-semibold text-sm">Kërko & Filtro Punët</h4>
            <div className="space-y-3">
              <Step number={1} title="Kërkimi me tekst">
                <p>Shkruani emrin e klientit në fushën e kërkimit për të gjetur shpejt një punë.</p>
              </Step>
              <Step number={2} title="Filtro sipas kategorisë">
                <p>Klikoni dropdown-in &quot;Të gjitha kategoritë&quot; për të filtruar vetëm punët e një kategorie (psh. vetëm Kamera).</p>
              </Step>
              <Step number={3} title="Filtro sipas statusit">
                <p>Zgjidhni &quot;Ofertë&quot;, &quot;Në Progres&quot; ose &quot;E Përfunduar&quot; për të parë vetëm punët me atë status.</p>
              </Step>
              <Step number={4} title="Filtro sipas pagesës">
                <p>Zgjidhni &quot;Pa Paguar&quot;, &quot;Pjesërisht&quot; ose &quot;Paguar&quot; për të parë vetëm punët me atë status pagese.</p>
              </Step>
              <Step number={5} title="Filtro sipas datës">
                <p>Përdorni fushat &quot;Nga&quot; dhe &quot;Deri&quot; për të filtruar punët brenda një periudhe kohore.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Informacionet në çdo Kartelë Pune</h4>
            <p className="text-sm text-muted-foreground">Çdo kartelë pune në Dashboard shfaq:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> <span><strong>Kategoria</strong> — Badge me ngjyrë (Elektrike, Kamera, Alarm, Interfon)</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <span><strong>Statusi</strong> — Ofertë, Në Progres, ose E Përfunduar</span></div>
              <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-slate-500" /> <span><strong>Numri i Faturës</strong> — Gjenerohet automatikisht: ELK-001, KAM-002, ALM-003, INT-004</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-orange-500" /> <span><strong>Statusi i Pagesës</strong> — Pa Paguar (kuq), Pjesërisht (portokalli), Paguar (gjelbrët)</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> <span><strong>Data e Krijimit / Ndryshimit</strong> — Kur është krijuar dhe ndryshuar puna për herë të fundit</span></div>
            </div>

            <h4 className="font-semibold text-sm">Veprimet në çdo Punë</h4>
            <p className="text-sm text-muted-foreground">Në çdo kartelë pune keni butonin me 3 pika (&bull;&bull;&bull;) që hap menunë e veprimeve:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Edit className="h-4 w-4 text-blue-500" /> <span><strong>Ndrysho</strong> — Hapni punën për ta edituar</span></div>
              <div className="flex items-center gap-2"><Copy className="h-4 w-4 text-green-500" /> <span><strong>Dupliko</strong> — Krijon një kopje të punës me &quot;(Kopje)&quot; në emër</span></div>
              <div className="flex items-center gap-2"><Bookmark className="h-4 w-4 text-purple-500" /> <span><strong>Ruaj si Shabllon</strong> — E ruan punën si model për përdorim në të ardhmen</span></div>
              <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-red-500" /> <span><strong>Fshij</strong> — Fshin punën përgjithmonë (kërkon konfirmim)</span></div>
            </div>

            <h4 className="font-semibold text-sm">Butonat e Shpejta</h4>
            <p className="text-sm text-muted-foreground">Në fund të çdo kartele keni dy butona shtesë:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> <span><strong>Harta</strong> — Shikoni vendndodhjen e punës në hartë (Google Maps)</span></div>
              <div className="flex items-center gap-2"><Send className="h-4 w-4 text-blue-500" /> <span><strong>Ndaj</strong> — Kopjoni linkun e vlerësimit për ta dërguar tek klienti</span></div>
            </div>

            <h4 className="font-semibold text-sm">Shablonet</h4>
            <p className="text-sm text-muted-foreground">Në fund të faqjes shfaqen shablonet e ruajtura. Klikoni &quot;Përdor&quot; për të krijuar një punë të re nga shablloni. Shablloni ruan të gjitha materialet, sasitë dhe çmimet — vetëm ndryshoni emrin e klientit.</p>

            <h4 className="font-semibold text-sm">Progresi i Punës</h4>
            <p className="text-sm text-muted-foreground">Për punët elektrike me status &quot;Në Progres&quot;, çdo kartelë shfaq një shirit progresi me përqindjen e përfundimit (psh. &quot;5/11 dhoma - 45%&quot;). Progresi llogaritet automatikisht nga dhomë-pas-dhomës bazuar në materialet e instaluara.</p>

            <h4 className="font-semibold text-sm">Numri Automatik i Faturës</h4>
            <p className="text-sm text-muted-foreground">Çdo punë merr automatikisht një numër fature me prefiksin e kategorisë:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; <strong>ELK-001</strong> — Për punë Elektrike</p>
              <p>&bull; <strong>KAM-001</strong> — Për punë Kamera</p>
              <p>&bull; <strong>ALM-001</strong> — Për punë Alarm</p>
              <p>&bull; <strong>INT-001</strong> — Për punë Interfon</p>
            </div>

            <Tip>Numri i faturës rritet automatikisht — nuk keni nevojë ta vendosni manualisht.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="procesverbal"
          icon={PlusCircle}
          iconColor="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
          title="Krijimi i Procesverbalit të Ri"
          subtitle="Hap pas hapi si të krijoni një punë të re"
        >
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Hapi 1: Zgjidhni Kategorinë</h4>
            <p className="text-sm text-muted-foreground">Klikoni &quot;Procesverbal i Ri&quot; në menu ose njërën nga 4 kartelat e shpejta në Dashboard. Kategoria përcakton cilat tab-e dhe materiale shfaqen në formë:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• <strong>Rrymë/Elektrike</strong>: Pajisje elektrike + Kabllo & Gypa + Punë/Shërbime</p>
              <p>• <strong>Kamera</strong>: Kamera + Punë/Shërbime</p>
              <p>• <strong>Alarm</strong>: Alarm + Punë/Shërbime</p>
              <p>• <strong>Interfon</strong>: Interfon + Punë/Shërbime</p>
            </div>

            <h4 className="font-semibold text-sm">Hapi 2: Të Dhënat e Klientit</h4>
            <div className="space-y-3">
              <Step number={1} title="Emri i Klientit">
                <p>Filloni të shkruani emrin — sistemi ju sugjeron klientët ekzistues. Nëse është klient i ri, shkruani emrin e plotë dhe do të krijohet automatikisht në CRM.</p>
              </Step>
              <Step number={2} title="Telefoni & Adresa">
                <p>Plotësoni numrin e telefonit dhe adresën e plotë të vendit të punës.</p>
              </Step>
              <Step number={3} title="Lloji i Punës">
                <p>Shkruani një përshkrim të shkurtër (psh. &quot;Instalim i Ri&quot;, &quot;Mirëmbajtje&quot;, &quot;Riparim&quot;).</p>
              </Step>
              <Step number={4} title="Data e Punës">
                <p>Zgjidhni datën kur do të kryhet puna. Kjo datë shfaqet edhe në kalendar.</p>
              </Step>
              <Step number={5} title="Shënime">
                <p>Shtoni ndonjë shënim të rëndësishëm (psh. &quot;Kati 2, Hyrja B&quot;).</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Paralajmërimet e Stokut</h4>
            <p className="text-sm text-muted-foreground">Në krye të formës shfaqet një seksion i rrudhshëm me artikujt që kanë stok të ulët ose zero. Klikoni për ta hapur/mbyllur. Artikujt me stok zero janë të bllokuar me badge &quot;Pa Stok&quot; dhe nuk mund të përdoren.</p>

            <h4 className="font-semibold text-sm">Hapi 3: Tabelat e Materialeve</h4>
            <p className="text-sm text-muted-foreground">Në tab-et e materialeve shihni artikujt e katalogut. Për secilin artikull:</p>
            <div className="space-y-3">
              <Step number={1} title="Vendosni sasi për çdo dhomë">
                <p>Keni 11 kolona dhomash (Dhomë 1–11). Shkruani sasitë në fushat përkatëse. Totali llogaritet automatikisht.</p>
              </Step>
              <Step number={2} title="Çmimet">
                <p>Kolona &quot;Çmimi&quot; shfaq çmimin e shitjes për klientin. Në modalitetin Admin shfaqet edhe çmimi i blerjes dhe marzhi i fitimit.</p>
              </Step>
              <Step number={3} title="Totali i rreshtit">
                <p>Total = Sasia totale x Çmimi. Llogaritet automatikisht.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Furnitori & Çmimet (Tab Çmimet)</h4>
            <p className="text-sm text-muted-foreground">Në tab-in &quot;Çmimet&quot; keni dy modalitete për zgjedhjen e furnitorit:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; <strong>Furnitor i Vetëm</strong> — Zgjidhni një furnitor dhe çmimet e tij aplikohen për të gjithë artikujt</p>
              <p>&bull; <strong>Çmimi më i Mirë</strong> — Sistemi krahasom çmimet e të gjithë furnitorëve dhe zgjedh automatikisht çmimin më të lirë për secilin artikull</p>
            </div>

            <h4 className="font-semibold text-sm">Hapi 4: Statusi & Pagesat</h4>
            <div className="space-y-3">
              <Step number={1} title="Statusi i Punës">
                <p>Zgjidhni një nga 3 statuset: <strong>Ofertë</strong> (propozim), <strong>Në Progres</strong> (duke punuar), <strong>E Përfunduar</strong> (mbaruar).</p>
              </Step>
              <Step number={2} title="Pagesa">
                <p>Vendosni statusin e pagesës: <strong>Pa Paguar</strong>, <strong>Pjesërisht</strong> (me shumën e paguar), ose <strong>Paguar</strong>. Zgjidhni metodën (Cash/Bank/Tjetër).</p>
              </Step>
              <Step number={3} title="TVSH (Tatimi)">
                <p>Nëse nevojitet, vendosni përqindjen e TVSH-së (parazgjedhur 0%). TVSH-ja llogaritet automatikisht në PDF.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Hapi 5: Zbritjet (Discount)</h4>
            <div className="space-y-3">
              <Step number={1} title="Lloji i zbritjes">
                <p>Zgjidhni nëse zbritja është në <strong>përqindje</strong> (%) ose <strong>shumë fikse</strong> (€).</p>
              </Step>
              <Step number={2} title="Vlera">
                <p>Shkruani vlerën e zbritjes. Zbritja zbritet automatikisht nga totali dhe shfaqet në PDF.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Hapi 6: Garancia</h4>
            <p className="text-sm text-muted-foreground">Vendosni periudhën e garancisë në muaj (parazgjedhur 12 muaj). Data e skadimit llogaritet automatikisht. Do të merrni njoftim kur garancia është në skadim.</p>

            <h4 className="font-semibold text-sm">Hapi 7: Checklista</h4>
            <p className="text-sm text-muted-foreground">Në tab-in &quot;Kontrolli&quot; keni listën e kontrolleve të sigurisë sipas kategorisë. Shënoni secilin kontroll kur ta keni verifikuar. Nëse ndonjë kontroll nuk është i plotësuar, do të shihni një paralajmërim para ruajtjes.</p>

            <h4 className="font-semibold text-sm">Hapi 8: Progresi i Dhomave (Vetëm Elektrike)</h4>
            <p className="text-sm text-muted-foreground">Në tab-in &quot;Progresi&quot; mund të shënoni përfundimin e çdo artikulli për çdo dhomë. Kur progresi arrin 100%, merrni njoftim automatik që t&apos;ia ndryshoni statusin në &quot;E Përfunduar&quot;.</p>

            <h4 className="font-semibold text-sm">Hapi 9: Ruajtja</h4>
            <p className="text-sm text-muted-foreground">Klikoni &quot;Ruaj Procesverbalin&quot; në fund të faqjes. Puna do të ruhet dhe do të ridrejtoheni në Dashboard.</p>

            <h4 className="font-semibold text-sm">Paralajmërim për Konflikte në Orar</h4>
            <p className="text-sm text-muted-foreground">Kur zgjidhni datën e punës, nëse ka punë tjera të planifikuara për atë ditë, shfaqet një paralajmërim me listën e punëve ekzistuese. Kjo ju ndihmon të shmangni mbingarkesën.</p>

            <h4 className="font-semibold text-sm">Veglat e Sugjeruara</h4>
            <p className="text-sm text-muted-foreground">Bazuar në materialet që shtoni, sistemi automatikisht sugjeron veglat që nevojiten (Dana, Hilti, Shafciger, Qekiq, etj.). Kjo shfaqet në formë dhe në kalendar.</p>

            <h4 className="font-semibold text-sm">Hapi 10: Vlerësimi i Klientit (Tab Feedback)</h4>
            <p className="text-sm text-muted-foreground">Për punët e përfunduara, në fund të formës shfaqet seksioni i vlerësimit ku mund të:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; Shihni vlerësimet ekzistuese (yjet dhe komentet)</p>
              <p>&bull; Shtoni një vlerësim nga ana juaj (1-5 yje + koment opsional)</p>
              <p>&bull; Gjeneroni link për vlerësim publik që ia dërgoni klientit</p>
              <p>&bull; Fshini vlerësimet (vetëm Admin)</p>
            </div>

            <h4 className="font-semibold text-sm">Çfarë Ndodh Kur Përfundoni një Punë</h4>
            <p className="text-sm text-muted-foreground">Kur ndryshoni statusin nga &quot;Në Progres&quot; në &quot;E Përfunduar&quot;, sistemi automatikisht:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; <strong>Krijon shpenzim</strong> — Shpenzim automatik me kategorinë &quot;Material&quot; me vlerën totale të çmimeve të blerjes</p>
              <p>&bull; <strong>Ul stokun</strong> — Zbrit sasitë e materialeve të përdorura nga stoku</p>
              <p>&bull; <strong>Ruan datën</strong> — Regjistron datën e përfundimit për garanci dhe analiza</p>
              <p>&bull; <strong>Ruan foto (snapshot)</strong> — Ruan gjendjen e çmimeve për krahasim në të ardhmen</p>
              <p>&bull; <strong>Pas 3 ditësh</strong> — Kujton të dërgoni linkun e vlerësimit tek klienti</p>
              <p>&bull; <strong>Pas 7/14/30 ditësh</strong> — Njoftim nëse puna nuk është paguar ende</p>
            </div>

            <Tip>Gjithçka bëhet automatikisht kur ndryshoni statusin — nuk keni nevojë të krijoni shpenzime ose ulni stokun manualisht!</Tip>
            <Warning>Nëse një artikull ka stok zero, do të shfaqet me badge &quot;Pa Stok&quot; dhe nuk mund të përdoret në formë derisa të bëni hyrje stoku.</Warning>
          </div>
        </GuideSection>

        <GuideSection
          id="clients"
          icon={Users}
          iconColor="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          title="Menaxhimi i Klientëve (CRM)"
          subtitle="Shtoni, ndryshoni dhe gjurmoni klientët"
        >
          <div className="space-y-4">
            <p className="text-sm">Faqja e klientëve ju lejon të menaxhoni të gjithë klientët tuaj në një vend.</p>

            <h4 className="font-semibold text-sm">Shtimi i Klientit të Ri</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Klient i Ri'">
                <p>Hapet forma ku plotësoni: Emrin, Mbiemrin, Numrin e telefonit, Email-in (opsionale), Adresën.</p>
              </Step>
              <Step number={2} title="Ruani klientin">
                <p>Klikoni &quot;Ruaj&quot; dhe klienti do të shfaqet në listë.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Krijimi Automatik</h4>
            <p className="text-sm text-muted-foreground">Kur krijoni një procesverbal të ri me një emër të ri klienti, sistemi automatikisht e krijon klientin në CRM. Nuk keni nevojë të shkoni në faqjen e klientëve për ta shtuar manualisht.</p>

            <h4 className="font-semibold text-sm">Historiku i Punëve</h4>
            <p className="text-sm text-muted-foreground">Për secilin klient mund të shihni të gjitha punët që keni bërë për ta, duke përfshirë datat, statuset dhe shumat. Për punët aktive elektrike, shfaqet edhe shiriti i progresit.</p>

            <h4 className="font-semibold text-sm">Kërko Klientë</h4>
            <p className="text-sm text-muted-foreground">Përdorni fushën e kërkimit për të gjetur shpejt një klient sipas emrit ose numrit të telefonit.</p>

            <Tip>Klientët që krijohen automatikisht nga procesverbalet ruajnë të gjitha të dhënat që keni shënuar në formën e punës.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="inventory"
          icon={Warehouse}
          iconColor="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
          title="Menaxhimi i Stokut"
          subtitle="Gjurmoni materialet, hyrjet, daljet dhe paralajmërimet"
        >
          <div className="space-y-4">
            <p className="text-sm">Stoku ju ndihmon të dini sa material keni në magazinë dhe kur duhet të porosisni më shumë.</p>

            <h4 className="font-semibold text-sm">Pamja e Stokut</h4>
            <p className="text-sm text-muted-foreground">Çdo artikull i katalogut shfaqet me sasinë aktuale. Artikujt me stok të ulët ose zero theksohen me ngjyrë të kuqe.</p>

            <h4 className="font-semibold text-sm">Lëvizjet e Stokut</h4>
            <div className="space-y-3">
              <Step number={1} title="Hyrje (Stok In)">
                <p>Kur blini material të reja, shtoni një hyrje stoku. Vendosni artikullin, sasinë dhe shënime.</p>
              </Step>
              <Step number={2} title="Dalje (Stok Out)">
                <p>Kur përdorni material në një punë, sistemi automatikisht ul stokun kur puna përfundohet. Mund ta bëni edhe manualisht.</p>
              </Step>
              <Step number={3} title="Rregullim (Adjustment)">
                <p>Për korrigjime të stokut (psh. pas një inventari fizik), përdorni veprimin &quot;Rregullim&quot;.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Niveli Minimal i Stokut</h4>
            <p className="text-sm text-muted-foreground">Për secilin artikull mund të vendosni një nivel minimal. Kur stoku bie nën këtë nivel, merrni një njoftim automatik.</p>

            <h4 className="font-semibold text-sm">Historiku i Lëvizjeve</h4>
            <p className="text-sm text-muted-foreground">Për çdo artikull mund të shihni të gjitha lëvizjet (hyrje, dalje, rregullime) me data dhe shënime.</p>

            <Warning>Artikujt me stok zero shfaqen me badge &quot;Pa Stok&quot; në formën e procesverbalit dhe nuk mund të përdoren deri sa të bëni hyrje të re.</Warning>
          </div>
        </GuideSection>

        <GuideSection
          id="calendar"
          icon={CalendarDays}
          iconColor="bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
          title="Kalendari"
          subtitle="Shikoni punët e planifikuara në kalendar"
        >
          <div className="space-y-4">
            <p className="text-sm">Kalendari shfaq të gjitha punët sipas datës së punës që keni vendosur në procesverbal.</p>

            <h4 className="font-semibold text-sm">Si ta Përdorni</h4>
            <div className="space-y-3">
              <Step number={1} title="Shiko muajin">
                <p>Navigoni përpara/mbrapa me shigjetat për të parë muajt e ndryshëm.</p>
              </Step>
              <Step number={2} title="Ditët me punë">
                <p>Ditët që kanë punë të planifikuara janë të shënuara me pika ose ngjyrë. Klikoni për të parë detajet.</p>
              </Step>
              <Step number={3} title="Informacioni i kontaktit">
                <p>Për çdo punë në kalendar shfaqet numri i telefonit të klientit. Mund ta klikoni për të thirrur direkt.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Progresi i Punës</h4>
            <p className="text-sm text-muted-foreground">Për punët elektrike &quot;Në Progres&quot;, kalendari shfaq automatikisht:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• <strong>Shiriti i progresit</strong> — Sa përqind e punës është përfunduar (sipas dhomave)</p>
              <p>• <strong>Veglat e nevojshme</strong> — Lista e veglave që duhen për atë punë (Dana, Hilti, Shafciger, etj.) bazuar në materialet e zgjedhura</p>
            </div>

            <Tip>Kalendari është i dobishum për të planifikuar ditën tuaj të punës — shihni çfarë keni për sot, nesër dhe javën e ardhshme. Kontrollo veglat e nevojshme para se të nisesh!</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="expenses"
          icon={Receipt}
          iconColor="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
          title="Shpenzimet e Biznesit"
          subtitle="Regjistroni dhe gjurmoni të gjitha shpenzimet"
        >
          <div className="space-y-4">
            <p className="text-sm">Këtu regjistroni të gjitha shpenzimet e biznesit tuaj përveç materialeve (që krijohen automatikisht).</p>

            <h4 className="font-semibold text-sm">Shtimi i Shpenzimit</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Shpenzim i Ri'">
                <p>Hapet forma për shpenzimin e ri.</p>
              </Step>
              <Step number={2} title="Zgjidhni kategorinë">
                <p>8 kategori të disponueshme: <strong>Karburant</strong>, <strong>Transport</strong>, <strong>Vegla</strong>, <strong>Material</strong>, <strong>Ushqim</strong>, <strong>Telefon</strong>, <strong>Qira</strong>, <strong>Tjetër</strong>.</p>
              </Step>
              <Step number={3} title="Vendosni shumën dhe datën">
                <p>Shkruani shumën në euro dhe zgjidhni datën e shpenzimit.</p>
              </Step>
              <Step number={4} title="Shtoni përshkrim">
                <p>Përshkruani shkurt shpenzimin (psh. &quot;Naftë për furgonin&quot;, &quot;Kesh për parkimin&quot;).</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Shpenzimet Automatike</h4>
            <p className="text-sm text-muted-foreground">Kur një punë ndryshon statusin në &quot;E Përfunduar&quot;, sistemi automatikisht krijon një shpenzim me kategorinë &quot;Material&quot; me vlerën e çmimit të blerjes së materialeve të përdorura.</p>

            <h4 className="font-semibold text-sm">Filtrimet</h4>
            <p className="text-sm text-muted-foreground">Filtroni shpenzimet sipas kategorisë, datës ose periudhës kohore për të parë sa keni shpenzuar në një fushë të caktuar.</p>

            <Tip>Shpenzimet zbriten nga fitimi në faqjen e Analizës, duke ju dhënë pamjen e saktë të fitimit neto.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="suppliers"
          icon={Truck}
          iconColor="bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
          title="Furnitorët"
          subtitle="Menaxhoni furnitorët dhe krahasoni çmimet"
        >
          <div className="space-y-4">
            <p className="text-sm">Këtu menaxhoni furnitorët tuaj të materialeve dhe krahasoni çmimet e tyre.</p>

            <h4 className="font-semibold text-sm">Shtimi i Furnitorit</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Furnitor i Ri'">
                <p>Plotësoni: Emrin e kompanisë/furnitorit, Personin e kontaktit, Telefonin, Email, Adresën, Kategoritë që mbulon.</p>
              </Step>
              <Step number={2} title="Ruani">
                <p>Furnitori shfaqet në listë me të gjitha të dhënat e kontaktit.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Çmimet e Furnitorit</h4>
            <div className="space-y-3">
              <Step number={1} title="Shtoni çmim për artikull">
                <p>Për çdo furnitor, mund të vendosni çmimin që ai ofron për secilin artikull të katalogut.</p>
              </Step>
              <Step number={2} title="Krahasimi i çmimeve">
                <p>Faqja e krahasimit tregon të gjithë furnitorët krah për krah me çmimet për të njëjtin artikull. Çmimi më i lirë theksohet me ngjyrë të gjelbrët.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Çmimi më i Mirë Automatik</h4>
            <p className="text-sm text-muted-foreground">Në formën e procesverbalit, butoni &quot;Çmimi më i Mirë&quot; aplikon automatikisht çmimin më të lirë të furnitorëve për të gjithë artikujt.</p>

            <Tip>Krahasoni rregullisht çmimet e furnitorëve për të siguruar që po blini me çmimin më të mirë.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="catalog"
          icon={Package}
          iconColor="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
          title="Katalogu i Materialeve"
          subtitle="Menaxhoni artikujt, çmimet dhe njësitë"
        >
          <div className="space-y-4">
            <p className="text-sm">Katalogu përmban të gjithë artikujt (materialet) që përdorni në punë. Këtu menaxhoni çmimet, njësitë dhe kategorizimin.</p>

            <h4 className="font-semibold text-sm">Shtimi i Artikullit të Ri</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Artikull i Ri'">
                <p>Plotësoni: Emrin, Kategorinë (Pajisje elektrike, Kabllo, Kamera, etj.), Njësinë (copë, metër, set), Çmimin e Blerjes, Çmimin e Shitjes.</p>
              </Step>
              <Step number={2} title="Ruani artikullin">
                <p>Artikulli shfaqet në formën e procesverbalit për kategorinë përkatëse.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Çmimet Duale</h4>
            <p className="text-sm text-muted-foreground">Çdo artikull ka dy çmime:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• <strong>Çmimi i Blerjes</strong> — Sa e blini ju nga furnitori (i fshehur për teknikun, i dukshëm vetëm për admin)</p>
              <p>• <strong>Çmimi i Shitjes</strong> — Sa ia faturoni klientit</p>
            </div>

            <h4 className="font-semibold text-sm">Ndryshimi i Çmimeve</h4>
            <p className="text-sm text-muted-foreground">Kur ndryshoni çmimin e një artikulli, sistemi:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Ruan historikun e çmimeve (mund ta shihni si grafik)</p>
              <p>• Automatikisht përditëson çmimin në të gjitha punët e hapura/në progres</p>
              <p>• Dërgon njoftim për ndryshimin e çmimit</p>
            </div>

            <h4 className="font-semibold text-sm">Përditësimi Automatik i Çmimeve</h4>
            <p className="text-sm text-muted-foreground">Kur ndryshoni çmimin e një artikulli, sistemi automatikisht përditëson çmimin në të gjitha punët e hapura (Ofertë ose Në Progres). Punët e përfunduara nuk preken.</p>

            <h4 className="font-semibold text-sm">Radha & Organizimi</h4>
            <p className="text-sm text-muted-foreground">Mund të ndryshoni radhën e artikujve duke përdorur fushën &quot;Radha&quot;. Artikujt renditen sipas këtij numri në formën e procesverbalit.</p>

            <h4 className="font-semibold text-sm">Stoku i Artikullit</h4>
            <p className="text-sm text-muted-foreground">Çdo artikull në katalog shfaq sasinë aktuale të stokut dhe nivelin minimal. Artikujt me stok zero bllokohen automatikisht në formën e procesverbalit.</p>

            <Tip>Historiku vizual i çmimeve (grafik) ju ndihmon të kuptoni se si kanë ndryshuar çmimet me kalimin e kohës. Shfaqet kur ndryshoni çmimin e një artikulli.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="analytics"
          icon={BarChart3}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
          title="Analiza e Biznesit"
          subtitle="Statistika, fitimi, trende dhe raporte"
        >
          <div className="space-y-4">
            <p className="text-sm">Faqja e Analizës (vetëm për Admin) ju jep një pamje të plotë të performancës së biznesit.</p>

            <h4 className="font-semibold text-sm">Çfarë Shihni</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /> <span><strong>Të Ardhurat</strong> — Totali i faturuar (nga çmimet e shitjes)</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-red-500" /> <span><strong>Shpenzimet</strong> — Materiale + shpenzime të tjera biznesi</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <span><strong>Fitimi Neto</strong> — Të ardhurat minus shpenzimet</span></div>
            </div>

            <h4 className="font-semibold text-sm">Filtrimet</h4>
            <div className="space-y-3">
              <Step number={1} title="Filtro sipas muajit/vitit">
                <p>Zgjidhni muajin ose vitin për të parë statistikat e asaj periudhe.</p>
              </Step>
              <Step number={2} title="Periudhë e personalizuar">
                <p>Vendosni datën e fillimit dhe mbarimit për një periudhë specifike.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Analiza e Avancuar</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• <strong>Ndarje sipas kategorisë</strong> — Sa fitim për çdo kategori (Elektrike, Kamera, etj.)</p>
              <p>• <strong>Trendi mujor</strong> — Grafiku i të ardhurave dhe fitimit në kohë</p>
              <p>• <strong>Produktet kryesore</strong> — Cilët artikuj sjellin më shumë fitim</p>
              <p>• <strong>Analiza sezonale</strong> — Cilët muaj janë më të zymët</p>
              <p>• <strong>Parashikimet</strong> — Projeksione të të ardhurave bazuar në të dhënat historike</p>
            </div>

            <h4 className="font-semibold text-sm">Raporti Mujor PDF</h4>
            <p className="text-sm text-muted-foreground">Klikoni &quot;Shkarko Raportin&quot; për të gjeneruar një PDF me përmbledhjen mujore: punët, të ardhurat, shpenzimet dhe fitimin neto.</p>

            <Tip>Kontrollo analizën çdo javë për të kuptuar se ku po shkon biznesi yt.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="pdf"
          icon={FileText}
          iconColor="bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
          title="PDF & Dokumentet"
          subtitle="6 lloje dokumentesh PDF nga çdo punë"
        >
          <div className="space-y-4">
            <p className="text-sm">Nga çdo procesverbal mund të gjeneroni 6 lloje dokumentesh PDF. Klikoni butonin &quot;Gjenero PDF&quot; dhe zgjidhni llojin:</p>

            <h4 className="font-semibold text-sm">1. Fatura / Oferta (PDF për Klientin)</h4>
            <p className="text-sm text-muted-foreground">Dokumenti kryesor për klientin. Përfshin: logon e Elektronova-s, të dhënat e klientit, tabelën e materialeve me çmimin e shitjes, totalin, TVSH-në, zbritjen, dhe kushtet e garancisë.</p>

            <h4 className="font-semibold text-sm">2. Lista e Blerjes (PDF për Ju)</h4>
            <p className="text-sm text-muted-foreground">Tregon çmimet e blerjes (sa i blini ju materialet nga furnitori). E dobishme për të dhënë në dyqan kur blini materiale.</p>

            <h4 className="font-semibold text-sm">3. Kontrata (PDF Ligjore)</h4>
            <p className="text-sm text-muted-foreground">Kontratë profesionale 1-faqeshe me 8 nene (NENI) ligjore në gjuhën shqipe. Përfshin: palët kontraktuese, shërbimet, çmimin, garancinë, afatin, dhe kushtet.</p>

            <h4 className="font-semibold text-sm">4. Certifikata e Garancisë</h4>
            <p className="text-sm text-muted-foreground">Dokument garancije për klientin. Përfshin: periudhën e garancisë, datën e fillimit dhe skadimit, materialet e instaluara, dhe kushtet e garancisë.</p>

            <h4 className="font-semibold text-sm">5. Raporti i Punës</h4>
            <p className="text-sm text-muted-foreground">Raport teknik i punës së kryer. Përfshin: përshkrimin e punës, materialet e përdorura me sasi, kohën e punës, dhe shënimet teknike.</p>

            <h4 className="font-semibold text-sm">6. Oferta e Detajuar</h4>
            <p className="text-sm text-muted-foreground">Ofertë e zgjeruar me çmime të ndara për çdo dhomë/zonë. E dobishme kur klienti dëshiron të dijë koston për çdo ambient veçmas.</p>

            <h4 className="font-semibold text-sm">Si ta Gjeneroni</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni procesverbalin">
                <p>Shkoni te puna që doni dhe klikoni &quot;Shiko Detajet&quot; ose &quot;Ndrysho&quot;.</p>
              </Step>
              <Step number={2} title="Klikoni butonin &quot;Gjenero PDF&quot;">
                <p>Hapet menyja me 6 opsionet. Zgjidhni llojin që doni.</p>
              </Step>
              <Step number={3} title="Shkarkoni ose ndani">
                <p>PDF-ja shkarkohet automatikisht në pajisjen tuaj. Mund ta ndani me klientin.</p>
              </Step>
            </div>

            <Tip>Të gjitha PDF-të gjerohen direkt në telefon/kompjuter pa nevojë interneti. Të gjitha kanë logon e Elektronova-s dhe janë në gjuhën shqipe me mbështetje të plotë për karakteret shqipe (ë, ç, etj.).</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="notifications"
          icon={Bell}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          title="Sistemi i Njoftimeve"
          subtitle="Paralajmërime automatike për biznesin tuaj"
        >
          <div className="space-y-4">
            <p className="text-sm">Kambana në krye të faqjes tregon numrin e njoftimeve të palexuara. Klikoni për të parë të gjitha.</p>

            <h4 className="font-semibold text-sm">Llojet e Njoftimeve</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /> <span><strong>Ofertë e Vjetër</strong> — Kur një ofertë ka kaluar më shumë se 7 ditë pa u përgjigjur</span></div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-500" /> <span><strong>Punë e Afërt</strong> — Kur keni punë të planifikuara për sot ose nesër</span></div>
              <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" /> <span><strong>Stok i Ulët</strong> — Kur një artikull bie nën nivelin minimal</span></div>
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-purple-500" /> <span><strong>Ndryshim Çmimi</strong> — Kur ndryshon çmimi i një artikulli në katalog</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <span><strong>Punë e Përfunduar</strong> — Konfirmim kur një punë përfundon</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-orange-500" /> <span><strong>Garanci në Skadim</strong> — Kur garancia e një pune skadon brenda 30 ditësh</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-red-500" /> <span><strong>Pagesë e Vonuar</strong> — Kur një punë e përfunduar nuk është paguar pas 7, 14, ose 30 ditësh</span></div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> <span><strong>Kujtesë Vlerësimi</strong> — 3 ditë pas përfundimit, kujton të dërgoni linkun e vlerësimit tek klienti</span></div>
              <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-cyan-500" /> <span><strong>Progresi 100%</strong> — Kur të gjitha dhomët e një pune elektrike janë përfunduar, sugjeron ndryshimin e statusit</span></div>
              <div className="flex items-center gap-2"><FileBarChart className="h-4 w-4 text-indigo-500" /> <span><strong>Përmbledhje Mujore</strong> — Në fillim të çdo muaji, përmbledhje e punëve, të ardhurave dhe shpenzimeve të muajit të kaluar</span></div>
              <div className="flex items-center gap-2"><PlusCircle className="h-4 w-4 text-blue-500" /> <span><strong>Punë e Re</strong> — Kur krijohet një punë e re, me emrin e klientit dhe kategorinë</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-purple-500" /> <span><strong>Shpenzim i Ri</strong> — Kur shtohet një shpenzim biznesi, me kategorinë dhe shumën</span></div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> <span><strong>Vlerësim i Ri</strong> — Kur klienti len vlerësim përmes linkut publik ose formës</span></div>
              <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" /> <span><strong>Punë pa Çmime</strong> — Kur një punë ka materiale por nuk ka çmime të vendosura (kontrollohet çdo javë)</span></div>
              <div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-teal-500" /> <span><strong>Shpenzim Periodik</strong> — Kujtesë kur kanë kaluar 28+ ditë nga shpenzimi i fundit i qirasë</span></div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> <span><strong>Ndryshim Automatik Statusi</strong> — Kur filloni progresin e dhomave, statusi kalon nga &quot;Ofertë&quot; në &quot;Në Progres&quot; automatikisht</span></div>
            </div>

            <h4 className="font-semibold text-sm">Si Funksionon</h4>
            <p className="text-sm text-muted-foreground">Njoftimet kontrollohen automatikisht çdo herë që hapni faqjen. Sistemi kontrollon:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; Ofertat e vjetra (mbi 7 ditë pa përgjigje)</p>
              <p>&bull; Punët e nesërmes/sotme</p>
              <p>&bull; Stokun e ulët nën nivelin minimal</p>
              <p>&bull; Garancitë që skadojnë brenda 30 ditësh</p>
              <p>&bull; Pagesat e vonuara (7, 14, 30 ditë pas përfundimit)</p>
              <p>&bull; Kujtesat për vlerësim (3 ditë pas përfundimit)</p>
              <p>&bull; Progresin 100% (kur të gjitha dhomët janë gati)</p>
              <p>&bull; Përmbledhjen mujore (në fillim të çdo muaji)</p>
            </div>

            <h4 className="font-semibold text-sm">Menaxhimi i Njoftimeve</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; Klikoni mbi një njoftim për ta shënuar si të lexuar</p>
              <p>&bull; Përdorni &quot;Lexo të gjitha&quot; për të pastruar të gjitha njoftimet</p>
              <p>&bull; Numri i njoftimeve të palexuara shfaqet si numër i kuq mbi kambranën</p>
            </div>
          </div>
        </GuideSection>

        <GuideSection
          id="gps"
          icon={MapPin}
          iconColor="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          title="GPS & Lokacioni Automatik"
          subtitle="Regjistroni vendndodhjen e punës me një klik"
        >
          <div className="space-y-4">
            <p className="text-sm">Kur jeni në vendpunë, mund të regjistroni koordinatat GPS automatikisht.</p>

            <h4 className="font-semibold text-sm">Si ta Përdorni</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni formën e punës">
                <p>Në seksionin e të dhënave të klientit, gjeni butonin e GPS-it (ikona e hartës).</p>
              </Step>
              <Step number={2} title="Klikoni butonin GPS">
                <p>Aplikacioni do të kërkojë lejen për të aksesuar vendndodhjen tuaj. Pranojeni.</p>
              </Step>
              <Step number={3} title="Koordinatat ruhen">
                <p>Lat/Lng ruhen automatikisht në punë. Një link i Google Maps gjenerohet që mund ta ndani me të tjerët.</p>
              </Step>
            </div>

            <Tip>GPS funksionon vetëm në pajisje që kanë GPS (telefon ose kompjuter me GPS). Sigurohuni që lokacioni është i aktivizuar në pajisjen tuaj.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="rating"
          icon={Star}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
          title="Vlerësimi Publik i Klientëve"
          subtitle="Merrni vlerësime nga klientët pa nevojë llogarie"
        >
          <div className="space-y-4">
            <p className="text-sm">Pas përfundimit të një pune, mund të gjeneroni një link për vlerësim që ia dërgoni klientit.</p>

            <h4 className="font-semibold text-sm">Si ta Përdorni</h4>
            <div className="space-y-3">
              <Step number={1} title="Përfundoni punën">
                <p>Sigurohuni që puna ka statusin &quot;E Përfunduar&quot;.</p>
              </Step>
              <Step number={2} title="Gjeneroni linkun e vlerësimit">
                <p>Në kartelën e punës në Dashboard, klikoni ikonën e aeroplanit (share). Kopjohet linku automatikisht.</p>
              </Step>
              <Step number={3} title="Dërgoni linkun">
                <p>Dërgojeni linkun nëpërmës WhatsApp, SMS ose Email. Klienti hap linkun në telefon.</p>
              </Step>
              <Step number={4} title="Klienti vlerëson">
                <p>Klienti sheh një faqje të thjeshtë ku zgjedh 1-5 yje dhe mund të lërë një koment (opsional).</p>
              </Step>
            </div>

            <Tip>Vlerësimet e klientëve ju ndihmojnë të përmirësoni shërbimet dhe të ndërtoni besimin me klientët e rinj.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="pwa"
          icon={Smartphone}
          iconColor="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400"
          title="Instalimi si Aplikacion (PWA)"
          subtitle="Instaloni Elektronova në telefon si aplikacion"
        >
          <div className="space-y-4">
            <p className="text-sm">Elektronova mund të instalohet si aplikacion në telefonin tuaj, pa shkuar në App Store ose Play Store.</p>

            <h4 className="font-semibold text-sm">Instalimi në Android</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni faqjen në Chrome">
                <p>Shkoni te adresa e Elektronova-s në shfletuesin Chrome.</p>
              </Step>
              <Step number={2} title="Klikoni 'Instalo' ose 'Shto në Home Screen'">
                <p>Do të shfaqet një mesazh që ju fton të instaloni aplikacionin. Ose shkoni te menyja (3 pikat) dhe zgjidhni &quot;Add to Home screen&quot;.</p>
              </Step>
              <Step number={3} title="Hapeni nga ekrani kryesor">
                <p>Tani Elektronova shfaqet si ikonë në ekranin kryesor, njëlloj si çdo aplikacion tjetër.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Instalimi në iPhone</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni faqjen në Safari">
                <p>Përdorni Safari (jo Chrome) për të hapur faqjen.</p>
              </Step>
              <Step number={2} title="Klikoni butonin Share">
                <p>Në fund të ekranit, klikoni ikonën e Share-it (katrori me shigjetën lart).</p>
              </Step>
              <Step number={3} title="Zgjidhni 'Add to Home Screen'">
                <p>Lëshoni poshtë në menu dhe zgjidhni &quot;Add to Home Screen&quot;. Emërtojeni dhe klikoni &quot;Add&quot;.</p>
              </Step>
            </div>

            <Tip>Aplikacioni funksionon edhe kur nuk keni internet për shikimin e faqjeve të ruajtura (por për të dhëna të reja nevojitet interneti).</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="admin"
          icon={Shield}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          title="Modaliteti Admin"
          subtitle="Funksionet e avansuara për administratorin"
        >
          <div className="space-y-4">
            <p className="text-sm">Llogaria Admin ka akses në funksione shtesë që llogaria e teknikut nuk e ka.</p>

            <h4 className="font-semibold text-sm">Çfarë Sheh Admini më Shumë</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>&bull; <strong>Çmimet e blerjes</strong> në formën e procesverbalit (tekniku sheh vetëm çmimin e shitjes)</p>
              <p>&bull; <strong>Marzhi i fitimit</strong> për çdo artikull (sa fitoni për njësi)</p>
              <p>&bull; <strong>Analiza e fitimit</strong> — faqja e plotë e Analizës me trende dhe parashikime</p>
              <p>&bull; <strong>Dashboard-i i fitimit</strong> me filtra të avansuara (muaj/vit/periudhë)</p>
              <p>&bull; <strong>Butoni &quot;Çmimi më i Mirë&quot;</strong> — Aplikon çmimin më të lirë të furnitorëve për të gjithë artikujt</p>
              <p>&bull; <strong>Krahasimi Ofertë vs. Aktuale</strong> — Krahason çmimet e ofertës fillestare me çmimet aktuale pas përfundimit</p>
              <p>&bull; <strong>Lista e Blerjes (PDF)</strong> — PDF me çmimet e blerjes, e fshehur nga tekniku</p>
              <p>&bull; <strong>Historiku i Çmimeve</strong> — Grafik vizual i ndryshimeve të çmimeve në katalog</p>
              <p>&bull; <strong>Raporti Mujor PDF</strong> — Shkarko përmbledhje mujore me punë, financa dhe shpenzime</p>
            </div>

            <h4 className="font-semibold text-sm">Rolet e Përdoruesve</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; <strong>Admin</strong> — Akses të plotë në të gjitha funksionet: çmimet e blerjes, analiza, menaxhimi i katalogut, furnitorëve, dhe përdoruesve</p>
              <p>&bull; <strong>Teknik</strong> — Krijon/ndrysho punë, shiko stokun, klientët, kalendarin, por pa çmimet e blerjes dhe analizën</p>
            </div>

            <h4 className="font-semibold text-sm">Pamja e Kostos në Procesverbal</h4>
            <p className="text-sm text-muted-foreground">Në tab-in &quot;Çmimet&quot; të procesverbalit, Admini sheh një seksion special me ngjyrë portokalli ku tregohen:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>&bull; Çmimi i blerjes për çdo artikull</p>
              <p>&bull; Çmimi i shitjes</p>
              <p>&bull; Marzhi (fitimi) për njësi dhe total</p>
              <p>&bull; Totali i përgjithshëm: shitje, blerje, fitim</p>
            </div>
          </div>
        </GuideSection>

        <GuideSection
          id="settings"
          icon={Settings}
          iconColor="bg-gray-100 text-gray-600 dark:bg-gray-950 dark:text-gray-400"
          title="Profili & Pjesëtë Tjera"
          subtitle="Ndryshoni fjalëkalimin, temën dhe më shumë"
        >
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Profili Im</h4>
            <p className="text-sm text-muted-foreground">Klikoni emrin tuaj në krye të faqjes ose shkoni te &quot;Profili Im&quot; në menunë mobile. Këtu mund të:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Ndryshoni emrin e plotë</p>
              <p>• Ndryshoni fjalëkalimin</p>
              <p>• Shikoni informacionin e llogarise</p>
            </div>

            <h4 className="font-semibold text-sm">Tema e Ndritshme / e Errët</h4>
            <p className="text-sm text-muted-foreground">Klikoni ikonën e diellit/hënës në krye të faqjes për të ndryshuar mes temës së ndritshme dhe të errët. Zgjedhja ruhet automatikisht.</p>

            <h4 className="font-semibold text-sm">Dalja (Logout)</h4>
            <p className="text-sm text-muted-foreground">Klikoni ikonën e daljes në krye të faqjes për të dalë nga llogaria. Do të ridrejtoheni te faqja e hyrjes.</p>
          </div>
        </GuideSection>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center space-y-3">
            <Globe className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-bold" data-testid="text-questions-title">Keni Pyetje?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto" data-testid="text-questions-description">
              Nëse keni ndonjë pyetje ose problem me aplikacionin, kontaktoni ekipin tonë përmes email-it ose telefonit. Jemi gjithmonë gati t&apos;ju ndihmojmë!
            </p>
            <Link href="/">
              <Button data-testid="button-back-to-dashboard" className="gap-2 mt-2">
                <ArrowLeft className="h-4 w-4" />
                Kthehu në Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}