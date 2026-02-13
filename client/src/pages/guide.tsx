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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "procesverbal", label: "Procesverbal i Ri", icon: PlusCircle },
  { id: "clients", label: "Klient\u00ebt", icon: Users },
  { id: "inventory", label: "Stoku", icon: Warehouse },
  { id: "calendar", label: "Kalendari", icon: CalendarDays },
  { id: "expenses", label: "Shpenzimet", icon: Receipt },
  { id: "suppliers", label: "Furnitor\u00ebt", icon: Truck },
  { id: "catalog", label: "Katalogu", icon: Package },
  { id: "analytics", label: "Analiza", icon: BarChart3 },
  { id: "pdf", label: "PDF & Kontrata", icon: FileText },
  { id: "notifications", label: "Njoftimet", icon: Bell },
  { id: "gps", label: "GPS & Lokacioni", icon: MapPin },
  { id: "rating", label: "Vler\u00ebsimi Publik", icon: Star },
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
            <h1 className="text-3xl font-display font-bold tracking-tight" data-testid="text-guide-title">Udh\u00ebzuesi i P\u00ebrdorimit</h1>
            <p className="text-muted-foreground mt-1" data-testid="text-guide-subtitle">M\u00ebsoni si t\u00eb p\u00ebrdorni \u00e7do funksion t\u00eb Elektronova hap pas hapi</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-3">Kalo direkt te seksioni q\u00eb doni:</p>
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
          id="dashboard"
          icon={LayoutDashboard}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          title="Dashboard (Faqja Kryesore)"
          subtitle="Pamja e p\u00ebrgjithshme e t\u00eb gjitha pun\u00ebve"
          defaultOpen={true}
        >
          <div className="space-y-4">
            <p className="text-sm">Dashboard-i \u00ebsht\u00eb faqja e par\u00eb q\u00eb shihni kur hyni n\u00eb aplikacion. K\u00ebtu menaxhoni t\u00eb gjitha procesverbalet (pun\u00ebt) tuaja.</p>

            <h4 className="font-semibold text-sm">Krijo Pun\u00eb t\u00eb Re (Shpejt)</h4>
            <p className="text-sm text-muted-foreground">N\u00eb krye t\u00eb faqjes keni 4 kartela p\u00ebr krijimin e shpejt\u00eb sipas kategoris\u00eb:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Zap className="h-4 w-4 text-blue-500" /> <span className="text-sm">Rrym\u00eb/Elektrike</span>
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

            <h4 className="font-semibold text-sm">K\u00ebrko & Filtro Pun\u00ebt</h4>
            <div className="space-y-3">
              <Step number={1} title="K\u00ebrkimi me tekst">
                <p>Shkruani emrin e klientit n\u00eb fush\u00ebn e k\u00ebrkimit p\u00ebr t\u00eb gjetur shpejt nj\u00eb pun\u00eb.</p>
              </Step>
              <Step number={2} title="Filtro sipas kategoris\u00eb">
                <p>Klikoni dropdown-in &quot;T\u00eb gjitha kategorit\u00eb&quot; p\u00ebr t\u00eb filtruar vet\u00ebm pun\u00ebt e nj\u00eb kategorie (psh. vet\u00ebm Kamera).</p>
              </Step>
              <Step number={3} title="Filtro sipas statusit">
                <p>Zgjidhni &quot;Ofert\u00eb&quot;, &quot;N\u00eb Progres&quot; ose &quot;E P\u00ebrfunduar&quot; p\u00ebr t\u00eb par\u00eb vet\u00ebm pun\u00ebt me at\u00eb status.</p>
              </Step>
              <Step number={4} title="Filtro sipas dat\u00ebs">
                <p>P\u00ebrdorni fushat &quot;Nga&quot; dhe &quot;Deri&quot; p\u00ebr t\u00eb filtruar pun\u00ebt brenda nj\u00eb periudhe kohore.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Veprimet n\u00eb \u00e7do Pun\u00eb</h4>
            <p className="text-sm text-muted-foreground">N\u00eb \u00e7do kartel\u00eb pune keni butonin me 3 pika (&bull;&bull;&bull;) q\u00eb hap menun\u00eb e veprimeve:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Edit className="h-4 w-4 text-blue-500" /> <span><strong>Ndrysho</strong> \u2014 Hapni pun\u00ebn p\u00ebr ta edituar</span></div>
              <div className="flex items-center gap-2"><Copy className="h-4 w-4 text-green-500" /> <span><strong>Dupliko</strong> \u2014 Krijon nj\u00eb kopje t\u00eb pun\u00ebs (e dobishme p\u00ebr pun\u00eb t\u00eb ngjashme)</span></div>
              <div className="flex items-center gap-2"><Bookmark className="h-4 w-4 text-purple-500" /> <span><strong>Ruaj si Shabllon</strong> \u2014 E ruan pun\u00ebn si model p\u00ebr p\u00ebrdorim n\u00eb t\u00eb ardhmen</span></div>
              <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-red-500" /> <span><strong>Fshij</strong> \u2014 Fshin pun\u00ebn p\u00ebrgjithmon\u00eb (k\u00ebrkon konfirmim)</span></div>
            </div>

            <h4 className="font-semibold text-sm">Shablonet</h4>
            <p className="text-sm text-muted-foreground">N\u00eb fund t\u00eb faqjes shfaqen shablonet e ruajtura. Klikoni &quot;P\u00ebrdor&quot; p\u00ebr t\u00eb krijuar nj\u00eb pun\u00eb t\u00eb re nga shablloni.</p>

            <Tip>N\u00eb \u00e7do kartel\u00eb pune shihni: kategorin\u00eb (badge me ngjyr\u00eb), statusin, numrin e fatur\u00ebs, dat\u00ebn e krijimit dhe dat\u00ebn e ndryshimit t\u00eb fundit.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="procesverbal"
          icon={PlusCircle}
          iconColor="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
          title="Krijimi i Procesverbali t\u00eb Ri"
          subtitle="Hap pas hapi si t\u00eb krijoni nj\u00eb pun\u00eb t\u00eb re"
        >
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Hapi 1: Zgjidhni Kategorin\u00eb</h4>
            <p className="text-sm text-muted-foreground">Klikoni &quot;Procesverbal i Ri&quot; n\u00eb menu ose nj\u00ebr\u00ebn nga 4 kartelat e shpejta n\u00eb Dashboard. Kategoria p\u00ebrcakton cilat tab-e dhe materiale shfaqen n\u00eb form\u00eb:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>\u2022 <strong>Rrym\u00eb/Elektrike</strong>: Pajisje elektrike + Kabllo & Gypa + Pun\u00eb/Sh\u00ebrbime</p>
              <p>\u2022 <strong>Kamera</strong>: Kamera + Pun\u00eb/Sh\u00ebrbime</p>
              <p>\u2022 <strong>Alarm</strong>: Alarm + Pun\u00eb/Sh\u00ebrbime</p>
              <p>\u2022 <strong>Interfon</strong>: Interfon + Pun\u00eb/Sh\u00ebrbime</p>
            </div>

            <h4 className="font-semibold text-sm">Hapi 2: T\u00eb Dh\u00ebnat e Klientit</h4>
            <div className="space-y-3">
              <Step number={1} title="Emri i Klientit">
                <p>Filloni t\u00eb shkruani emrin \u2014 sistemi ju sugjeron klient\u00ebt ekzistues. N\u00ebse \u00ebsht\u00eb klient i ri, shkruani emrin e plot\u00eb dhe do t\u00eb krijohet automatikisht n\u00eb CRM.</p>
              </Step>
              <Step number={2} title="Telefoni & Adresa">
                <p>Plotësoni numrin e telefonit dhe adresen e plot\u00eb t\u00eb vendit t\u00eb pun\u00ebs.</p>
              </Step>
              <Step number={3} title="Lloji i Pun\u00ebs">
                <p>Shkruani nj\u00eb p\u00ebrshkrim t\u00eb shkurt\u00ebr (psh. &quot;Instalim i Ri&quot;, &quot;Mir\u00ebmbajtje&quot;, &quot;Riparim&quot;).</p>
              </Step>
              <Step number={4} title="Data e Pun\u00ebs">
                <p>Zgjidhni dat\u00ebn kur do t\u00eb kryhet puna. Kjo dat\u00eb shfaqet edhe n\u00eb kalendar.</p>
              </Step>
              <Step number={5} title="Sh\u00ebnime">
                <p>Shtoni ndonj\u00eb sh\u00ebnim t\u00eb r\u00ebndsish\u00ebm (psh. &quot;Kati 2, Hyrja B&quot;).</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Hapi 3: Tabelat e Materialeve</h4>
            <p className="text-sm text-muted-foreground">N\u00eb tab-et e materialeve shihni artikujt e katalogut. P\u00ebr secilin artikull:</p>
            <div className="space-y-3">
              <Step number={1} title="Vendosni sasi p\u00ebr \u00e7do dhom\u00eb">
                <p>Keni 11 kolona dhomash (Dhom\u00eb 1\u201311). Shkruani sasit\u00eb n\u00eb fushat p\u00ebrkat\u00ebse. Totali llogaritet automatikisht.</p>
              </Step>
              <Step number={2} title="\u00c7mimet">
                <p>Kolona &quot;\u00c7mimi&quot; shfaq \u00e7mimin e shitjes p\u00ebr klientin. N\u00eb modalitetin Admin shfaqet edhe \u00e7mimi i blerjes dhe marzhi i fitimit.</p>
              </Step>
              <Step number={3} title="Totali i rreshtit">
                <p>Total = Sasia totale \u00d7 \u00c7mimi. Llogaritet automatikisht.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Hapi 4: Statusi & Pagesat</h4>
            <div className="space-y-3">
              <Step number={1} title="Statusi i Pun\u00ebs">
                <p>Zgjidhni nj\u00eb nga 3 statuset: <strong>Ofert\u00eb</strong> (propozim), <strong>N\u00eb Progres</strong> (duke punuar), <strong>E P\u00ebrfunduar</strong> (mbaruar).</p>
              </Step>
              <Step number={2} title="Pagesa">
                <p>Vendosni statusin e pages\u00ebs: <strong>Pa Paguar</strong>, <strong>Pjes\u00ebrisht</strong> (me shum\u00ebn e paguar), ose <strong>Paguar</strong>. Zgjidhni metod\u00ebn (Cash/Bank/Tjet\u00ebr).</p>
              </Step>
              <Step number={3} title="TVSH (Tatimi)">
                <p>N\u00ebse nevojitet, vendosni p\u00ebrqindjen e TVSH-s\u00eb (parazgjedhur 0%). TVSH-ja llogaritet automatikisht n\u00eb PDF.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Hapi 5: Zbritjet (Discount)</h4>
            <div className="space-y-3">
              <Step number={1} title="Lloji i zbritjes">
                <p>Zgjidhni n\u00ebse zbritja \u00ebsht\u00eb n\u00eb <strong>p\u00ebrqindje</strong> (%) ose <strong>shum\u00eb fikse</strong> (\u20ac).</p>
              </Step>
              <Step number={2} title="Vlera">
                <p>Shkruani vler\u00ebn e zbritjes. Zbritja zbritet automatikisht nga totali dhe shfaqet n\u00eb PDF.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Hapi 6: Garancia</h4>
            <p className="text-sm text-muted-foreground">Vendosni periudh\u00ebn e garancis\u00eb n\u00eb muaj (parazgjedhur 12 muaj). Data e skadimit llogaritet automatikisht. Do t\u00eb merrni njoftim kur garancia \u00ebsht\u00eb n\u00eb skadim.</p>

            <h4 className="font-semibold text-sm">Hapi 7: Checklista</h4>
            <p className="text-sm text-muted-foreground">N\u00eb tab-in &quot;Kontrolli&quot; keni list\u00ebn e kontrolleve t\u00eb siguris\u00eb sipas kategoris\u00eb. Shk\u00ebputni secilin kontroll kur ta keni verifikuar. N\u00ebse ndonj\u00eb kontroll nuk \u00ebsht\u00eb i plot\u00ebsuar, do t\u00eb shihni nj\u00eb paralajm\u00ebrim para ruajtjes.</p>

            <h4 className="font-semibold text-sm">Hapi 8: Ruajtja</h4>
            <p className="text-sm text-muted-foreground">Klikoni &quot;Ruaj Procesverbalin&quot; n\u00eb fund t\u00eb faqjes. Puna do t\u00eb ruhet dhe do t\u00eb ridrejtoheni n\u00eb Dashboard.</p>

            <Tip>Kur ndryshoni statusin n\u00eb &quot;E P\u00ebrfunduar&quot;, sistemi automatikisht krijon nj\u00eb shpenzim p\u00ebr materialet e p\u00ebrdorura dhe ul stokun p\u00ebrkat\u00ebs.</Tip>
            <Warning>N\u00ebse nj\u00eb artikull ka stok zero, do t\u00eb shfaqet me badge &quot;Pa Stok&quot; dhe nuk mund t\u00eb p\u00ebrdoret n\u00eb form\u00eb.</Warning>
          </div>
        </GuideSection>

        <GuideSection
          id="clients"
          icon={Users}
          iconColor="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          title="Menaxhimi i Klient\u00ebve (CRM)"
          subtitle="Shtoni, ndryshoni dhe gjurmoni klient\u00ebt"
        >
          <div className="space-y-4">
            <p className="text-sm">Faqja e klient\u00ebve ju lejon t\u00eb menaxhoni t\u00eb gjith\u00eb klient\u00ebt tuaj n\u00eb nj\u00eb vend.</p>

            <h4 className="font-semibold text-sm">Shtimi i Klientit t\u00eb Ri</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Klient i Ri'">
                <p>Hapet forma ku plotësoni: Emrin, Mbiemrin, Numrin e telefonit, Email-in (opsionale), Adres\u00ebn.</p>
              </Step>
              <Step number={2} title="Ruani klientin">
                <p>Klikoni &quot;Ruaj&quot; dhe klienti do t\u00eb shfaqet n\u00eb list\u00eb.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Krijimi Automatik</h4>
            <p className="text-sm text-muted-foreground">Kur krijoni nj\u00eb procesverbal t\u00eb ri me nj\u00eb em\u00ebr t\u00eb ri klienti, sistemi automatikisht e krijon klientin n\u00eb CRM. Nuk keni nevoj\u00eb t\u00eb shkoni n\u00eb faqjen e klient\u00ebve p\u00ebr ta shtuar manualisht.</p>

            <h4 className="font-semibold text-sm">Historiku i Pun\u00ebve</h4>
            <p className="text-sm text-muted-foreground">P\u00ebr secilin klient mund t\u00eb shihni t\u00eb gjitha pun\u00ebt q\u00eb keni b\u00ebr\u00eb p\u00ebr ta, duke p\u00ebrfshir\u00eb datat, statuset dhe shumat.</p>

            <h4 className="font-semibold text-sm">K\u00ebrko Klient\u00eb</h4>
            <p className="text-sm text-muted-foreground">P\u00ebrdorni fush\u00ebn e k\u00ebrkimit p\u00ebr t\u00eb gjetur shpejt nj\u00eb klient sipas emrit ose numrit t\u00eb telefonit.</p>

            <Tip>Klient\u00ebt q\u00eb krijohen automatikisht nga procesverbalet ruajn\u00eb t\u00eb gjitha t\u00eb dh\u00ebnat q\u00eb keni sh\u00ebnuar n\u00eb form\u00ebn e pun\u00ebs.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="inventory"
          icon={Warehouse}
          iconColor="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
          title="Menaxhimi i Stokut"
          subtitle="Gjurmoni materialet, hyrjet, daljet dhe paralajm\u00ebrimet"
        >
          <div className="space-y-4">
            <p className="text-sm">Stoku ju ndihmon t\u00eb dini sa material keni n\u00eb magazin\u00eb dhe kur duhet t\u00eb porosisni m\u00eb shum\u00eb.</p>

            <h4 className="font-semibold text-sm">Pamja e Stokut</h4>
            <p className="text-sm text-muted-foreground">\u00c7do artikull i katalogut shfaqet me sasin\u00eb aktuale. Artikujt me stok t\u00eb ul\u00ebt ose zero theksohen me ngjyr\u00eb t\u00eb kuqe.</p>

            <h4 className="font-semibold text-sm">L\u00ebvizjet e Stokut</h4>
            <div className="space-y-3">
              <Step number={1} title="Hyrje (Stok In)">
                <p>Kur blini material t\u00eb reja, shtoni nj\u00eb hyrje stoku. Vendosni artikullin, sasin\u00eb dhe sh\u00ebnime.</p>
              </Step>
              <Step number={2} title="Dalje (Stok Out)">
                <p>Kur p\u00ebrdorni material n\u00eb nj\u00eb pun\u00eb, sistemi automatikisht ul stokun kur puna p\u00ebrfundohet. Mund ta b\u00ebni edhe manualisht.</p>
              </Step>
              <Step number={3} title="Rregullim (Adjustment)">
                <p>P\u00ebr korrigjime t\u00eb stokut (psh. pas nj\u00eb inventari fizik), p\u00ebrdorni veprimin &quot;Rregullim&quot;.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Niveli Minimal i Stokut</h4>
            <p className="text-sm text-muted-foreground">P\u00ebr secilin artikull mund t\u00eb vendosni nj\u00eb nivel minimal. Kur stoku bie n\u00ebn k\u00ebt\u00eb nivel, merrni nj\u00eb njoftim automatik.</p>

            <h4 className="font-semibold text-sm">Historiku i L\u00ebvizjeve</h4>
            <p className="text-sm text-muted-foreground">P\u00ebr \u00e7do artikull mund t\u00eb shihni t\u00eb gjitha l\u00ebvizjet (hyrje, dalje, rregullime) me data dhe sh\u00ebnime.</p>

            <Warning>Artikujt me stok zero shfaqen me badge &quot;Pa Stok&quot; n\u00eb form\u00ebn e procesverbalti dhe nuk mund t\u00eb p\u00ebrdoren deri sa t\u00eb b\u00ebni hyrje t\u00eb re.</Warning>
          </div>
        </GuideSection>

        <GuideSection
          id="calendar"
          icon={CalendarDays}
          iconColor="bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
          title="Kalendari"
          subtitle="Shikoni pun\u00ebt e planifikuara n\u00eb kalendar"
        >
          <div className="space-y-4">
            <p className="text-sm">Kalendari shfaq t\u00eb gjitha pun\u00ebt sipas dat\u00ebs s\u00eb pun\u00ebs q\u00eb keni vendosur n\u00eb procesverbal.</p>

            <h4 className="font-semibold text-sm">Si ta P\u00ebrdorni</h4>
            <div className="space-y-3">
              <Step number={1} title="Shiko muajin">
                <p>Navigoni p\u00ebrpara/mbrapa me shigjetat p\u00ebr t\u00eb par\u00eb muajt e ndrysh\u00ebm.</p>
              </Step>
              <Step number={2} title="Dit\u00ebt me pun\u00eb">
                <p>Dit\u00ebt q\u00eb kan\u00eb pun\u00eb t\u00eb planifikuara jan\u00eb t\u00eb sh\u00ebnuara me pika ose ngjyr\u00eb. Klikoni p\u00ebr t\u00eb par\u00eb detajet.</p>
              </Step>
              <Step number={3} title="Informacioni i kontaktit">
                <p>P\u00ebr \u00e7do pun\u00eb n\u00eb kalendar shfaqet numri i telefonit t\u00eb klientit. Mund ta klikoni p\u00ebr t\u00eb thirrur direkt.</p>
              </Step>
            </div>

            <Tip>Kalendari \u00ebsht\u00eb i dobishum p\u00ebr t\u00eb planifikuar dit\u00ebn tuaj t\u00eb pun\u00ebs \u2014 shihni \u00e7far\u00eb keni p\u00ebr sot, nes\u00ebr dhe jav\u00ebn e ardhshme.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="expenses"
          icon={Receipt}
          iconColor="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
          title="Shpenzimet e Biznesit"
          subtitle="Regjistroni dhe gjurmoni t\u00eb gjitha shpenzimet"
        >
          <div className="space-y-4">
            <p className="text-sm">K\u00ebtu regjistroni t\u00eb gjitha shpenzimet e biznesit tuaj p\u00ebrve\u00e7 materialeve (q\u00eb krijohen automatikisht).</p>

            <h4 className="font-semibold text-sm">Shtimi i Shpenzimit</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Shpenzim i Ri'">
                <p>Hapet forma p\u00ebr shpenzimin e ri.</p>
              </Step>
              <Step number={2} title="Zgjidhni kategorin\u00eb">
                <p>8 kategori t\u00eb disponueshme: <strong>Karburant</strong>, <strong>Transport</strong>, <strong>Vegla</strong>, <strong>Material</strong>, <strong>Ushqim</strong>, <strong>Telefon</strong>, <strong>Qira</strong>, <strong>Tjet\u00ebr</strong>.</p>
              </Step>
              <Step number={3} title="Vendosni shum\u00ebn dhe daten">
                <p>Shkruani shum\u00ebn n\u00eb euro dhe zgjidhni dat\u00ebn e shpenzimit.</p>
              </Step>
              <Step number={4} title="Shtoni p\u00ebrshkrim">
                <p>P\u00ebrshkruani shkurt shpenzimin (psh. &quot;Nafte p\u00ebr furgonin&quot;, &quot;Kesh p\u00ebr parkimin&quot;).</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Shpenzimet Automatike</h4>
            <p className="text-sm text-muted-foreground">Kur nj\u00eb pun\u00eb ndryshon statusin n\u00eb &quot;E P\u00ebrfunduar&quot;, sistemi automatikisht krijon nj\u00eb shpenzim me kategorin\u00eb &quot;Material&quot; me vler\u00ebn e \u00e7mimit t\u00eb blerjes s\u00eb materialeve t\u00eb p\u00ebrdorura.</p>

            <h4 className="font-semibold text-sm">Filtrimet</h4>
            <p className="text-sm text-muted-foreground">Filtroni shpenzimet sipas kategoris\u00eb, dat\u00ebs ose periudh\u00ebs kohore p\u00ebr t\u00eb par\u00eb sa keni shpenzuar n\u00eb nj\u00eb fush\u00eb t\u00eb caktuar.</p>

            <Tip>Shpenzimet zbriten nga fitimi n\u00eb faqjen e Analiz\u00ebs, duke ju dh\u00ebn\u00eb pamjen e sakt\u00eb t\u00eb fitimit neto.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="suppliers"
          icon={Truck}
          iconColor="bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
          title="Furnitor\u00ebt"
          subtitle="Menaxhoni furnitor\u00ebt dhe krahasoni \u00e7mimet"
        >
          <div className="space-y-4">
            <p className="text-sm">K\u00ebtu menaxhoni furnitor\u00ebt tuaj t\u00eb materialeve dhe krahasoni \u00e7mimet e tyre.</p>

            <h4 className="font-semibold text-sm">Shtimi i Furnitorit</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Furnitor i Ri'">
                <p>Plotësoni: Emrin e kompanisë/furnitorit, Personin e kontaktit, Telefonin, Email, Adresën, Kategorit\u00eb q\u00eb mbulon.</p>
              </Step>
              <Step number={2} title="Ruani">
                <p>Furnitori shfaqet n\u00eb list\u00eb me t\u00eb gjitha t\u00eb dh\u00ebnat e kontaktit.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">\u00c7mimet e Furnitorit</h4>
            <div className="space-y-3">
              <Step number={1} title="Shtoni \u00e7mim p\u00ebr artikull">
                <p>P\u00ebr \u00e7do furnitor, mund t\u00eb vendosni \u00e7mimin q\u00eb ai ofron p\u00ebr secilin artikull t\u00eb katalogut.</p>
              </Step>
              <Step number={2} title="Krahasimi i \u00e7mimeve">
                <p>Faqja e krahasimit tregon t\u00eb gjith\u00eb furnitor\u00ebt krah p\u00ebr krah me \u00e7mimet p\u00ebr t\u00eb nj\u00ebjtin artikull. \u00c7mimi m\u00eb i lir\u00eb theksohet me ngjyr\u00eb t\u00eb gjelbr\u00ebt.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">\u00c7mimi m\u00eb i Mir\u00eb Automatik</h4>
            <p className="text-sm text-muted-foreground">N\u00eb form\u00ebn e procesverbaliti, butoni &quot;\u00c7mimi m\u00eb i Mir\u00eb&quot; aplikon automatikisht \u00e7mimin m\u00eb t\u00eb lir\u00eb t\u00eb furnitor\u00ebve p\u00ebr t\u00eb gjith\u00eb artikujt.</p>

            <Tip>Krahasoni rregullisht \u00e7mimet e furnitor\u00ebve p\u00ebr t\u00eb siguruar q\u00eb po blini me \u00e7mimin m\u00eb t\u00eb mir\u00eb.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="catalog"
          icon={Package}
          iconColor="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
          title="Katalogu i Materialeve"
          subtitle="Menaxhoni artikujt, \u00e7mimet dhe nj\u00ebsit\u00eb"
        >
          <div className="space-y-4">
            <p className="text-sm">Katalogu p\u00ebrmban t\u00eb gjith\u00eb artikujt (materialet) q\u00eb p\u00ebrdorni n\u00eb pun\u00eb. K\u00ebtu menaxhoni \u00e7mimet, nj\u00ebsit\u00eb dhe kategorizimin.</p>

            <h4 className="font-semibold text-sm">Shtimi i Artikullit t\u00eb Ri</h4>
            <div className="space-y-3">
              <Step number={1} title="Klikoni 'Artikull i Ri'">
                <p>Plotësoni: Emrin, Kategorinë (Pajisje elektrike, Kabllo, Kamera, etj.), Nj\u00ebsin\u00eb (cop\u00eb, metër, set), \u00c7mimin e Blerjes, \u00c7mimin e Shitjes.</p>
              </Step>
              <Step number={2} title="Ruani artikullin">
                <p>Artikulli shfaqet n\u00eb form\u00ebn e procesverbatit p\u00ebr kategorin\u00eb p\u00ebrkat\u00ebse.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">\u00c7mimet Duale</h4>
            <p className="text-sm text-muted-foreground">\u00c7do artikull ka dy \u00e7mime:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>\u2022 <strong>\u00c7mimi i Blerjes</strong> \u2014 Sa e blini ju nga furnitori (i fshehur p\u00ebr teknikun, i dukshum vet\u00ebm p\u00ebr admin)</p>
              <p>\u2022 <strong>\u00c7mimi i Shitjes</strong> \u2014 Sa ia faturoni klientit</p>
            </div>

            <h4 className="font-semibold text-sm">Ndryshimi i \u00c7mimeve</h4>
            <p className="text-sm text-muted-foreground">Kur ndryshoni \u00e7mimin e nj\u00eb artikulli, sistemi:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>\u2022 Ruan historikun e \u00e7mimeve (mund ta shihni si grafik)</p>
              <p>\u2022 Automatikisht p\u00ebrdit\u00ebson \u00e7mimin n\u00eb t\u00eb gjitha pun\u00ebt e hapura/n\u00eb progres</p>
              <p>\u2022 D\u00ebrgon njoftim p\u00ebr ndryshimin e \u00e7mimit</p>
            </div>

            <h4 className="font-semibold text-sm">Rradh\u00ebs\u00ebs & Organizimi</h4>
            <p className="text-sm text-muted-foreground">Mund t\u00eb ndryshoni radh\u00ebn e artikujve duke p\u00ebrdorur fush\u00ebn &quot;Radha&quot;. Artikujt renditen sipas k\u00ebtij numri n\u00eb form\u00ebn e procesverbaliti.</p>

            <Tip>Historiku vizual i \u00e7mimeve ju ndihmon t\u00eb kuptoni se si kan\u00eb ndryshuar \u00e7mimet me kalimin e koh\u00ebs.</Tip>
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
            <p className="text-sm">Faqja e Analiz\u00ebs (vet\u00ebm p\u00ebr Admin) ju jep nj\u00eb pamje t\u00eb plot\u00eb t\u00eb performanc\u00ebs s\u00eb biznesit.</p>

            <h4 className="font-semibold text-sm">\u00c7far\u00eb Shihni</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /> <span><strong>T\u00eb Ardhurat</strong> \u2014 Totali i faturuar (nga \u00e7mimet e shitjes)</span></div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-red-500" /> <span><strong>Shpenzimet</strong> \u2014 Materiale + shpenzime t\u00eb tjera biznesi</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <span><strong>Fitimi Neto</strong> \u2014 T\u00eb ardhurat minus shpenzimet</span></div>
            </div>

            <h4 className="font-semibold text-sm">Filtrimet</h4>
            <div className="space-y-3">
              <Step number={1} title="Filtro sipas muajit/vitit">
                <p>Zgjidhni muajin ose vitin p\u00ebr t\u00eb par\u00eb statistikat e asaj periudhe.</p>
              </Step>
              <Step number={2} title="Periudh\u00eb e personalizuar">
                <p>Vendosni dat\u00ebn e fillimit dhe mbarimit p\u00ebr nj\u00eb periudh\u00eb specifike.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Analiza e Avancuar</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>\u2022 <strong>Ndarje sipas kategoris\u00eb</strong> \u2014 Sa fitim p\u00ebr \u00e7do kategori (Elektrike, Kamera, etj.)</p>
              <p>\u2022 <strong>Trendi mujor</strong> \u2014 Grafiku i t\u00eb ardhurave dhe fitimit n\u00eb koh\u00eb</p>
              <p>\u2022 <strong>Produktet kryesore</strong> \u2014 Cilat artikuj sjellin m\u00eb shum\u00eb fitim</p>
              <p>\u2022 <strong>Analiza sezonale</strong> \u2014 Cil\u00ebt muaj jan\u00eb m\u00eb t\u00eb zym\u00ebt</p>
              <p>\u2022 <strong>Parashikimet</strong> \u2014 Projeksione t\u00eb t\u00eb ardhurave bazuar n\u00eb t\u00eb dh\u00ebnat historike</p>
            </div>

            <h4 className="font-semibold text-sm">Raporti Mujor PDF</h4>
            <p className="text-sm text-muted-foreground">Klikoni &quot;Shkarko Raportin&quot; p\u00ebr t\u00eb gjeneruar nj\u00eb PDF me p\u00ebrmbledhjen mujore: pun\u00ebt, t\u00eb ardhurat, shpenzimet dhe fitimin neto.</p>

            <Tip>Kontrollo analiz\u00ebn \u00e7do jav\u00eb p\u00ebr t\u00eb kuptuar se ku po shkon biznesi yt.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="pdf"
          icon={FileText}
          iconColor="bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
          title="PDF & Kontrata"
          subtitle="Gjeneroni fatura, lista blerjes dhe kontrata"
        >
          <div className="space-y-4">
            <p className="text-sm">Nga \u00e7do procesverbal mund t\u00eb gjeneroni 3 lloje dokumentesh PDF:</p>

            <h4 className="font-semibold text-sm">1. Fatura / Oferta (PDF p\u00ebr Klientin)</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni procesverbaltin">
                <p>Shkoni te puna q\u00eb doni dhe klikoni &quot;Shiko Detajet&quot; ose &quot;Ndrysho&quot;.</p>
              </Step>
              <Step number={2} title="Klikoni 'Gjenero PDF'">
                <p>Zgjidhni &quot;Fatur\u00eb/Ofert\u00eb&quot;. PDF-ja p\u00ebrmban: logon, t\u00eb dh\u00ebnat e klientit, tabel\u00ebn e materialeve me \u00e7mimin e shitjes, totalin, TVSH-n\u00eb, zbritjen.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">2. Lista e Blerjes (PDF p\u00ebr Ju)</h4>
            <p className="text-sm text-muted-foreground">K\u00ebtu shfaqen \u00e7mimet e blerjes (sa i blini ju materialet). E dobishme p\u00ebr t\u00eb dh\u00ebn\u00eb n\u00eb dyqan.</p>

            <h4 className="font-semibold text-sm">3. Kontrata (PDF Ligjore)</h4>
            <p className="text-sm text-muted-foreground">Gjeneron nj\u00eb kontrat\u00eb profesionale 1-faqeshe me 8 nene (NENI) ligjore n\u00eb gjuh\u00ebn shqipe. P\u00ebrfshin t\u00eb dh\u00ebnat e pal\u00ebve, sh\u00ebrbimet, \u00e7mimin, garancin\u00eb dhe kushtet.</p>

            <Tip>PDF-ja gjenerohet direkt n\u00eb telefon/kompjuter (pa nevoj\u00eb p\u00ebr internet n\u00eb momentin e gjenerimit).</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="notifications"
          icon={Bell}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          title="Sistemi i Njoftimeve"
          subtitle="Paralajm\u00ebrime automatike p\u00ebr biznesi tuaj"
        >
          <div className="space-y-4">
            <p className="text-sm">Kambana n\u00eb krye t\u00eb faqjes tregon numrin e njoftimeve t\u00eb palexuara. Klikoni p\u00ebr t\u00eb par\u00eb t\u00eb gjitha.</p>

            <h4 className="font-semibold text-sm">Llojet e Njoftimeve</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /> <span><strong>Ofert\u00eb e Vjet\u00ebr</strong> \u2014 Kur nj\u00eb ofert\u00eb ka kaluar m\u00eb shum\u00eb se 7 dit\u00eb pa u p\u00ebrgjigji</span></div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-500" /> <span><strong>Pun\u00eb e Af\u00ebrt</strong> \u2014 Kur keni pun\u00eb t\u00eb planifikuara p\u00ebr sot ose nes\u00ebr</span></div>
              <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" /> <span><strong>Stok i Ul\u00ebt</strong> \u2014 Kur nj\u00eb artikull bie n\u00ebn nivelin minimal</span></div>
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-purple-500" /> <span><strong>Ndryshim \u00c7mimi</strong> \u2014 Kur ndryshon \u00e7mimi i nj\u00eb artikulli n\u00eb katalog</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> <span><strong>Pun\u00eb e P\u00ebrfunduar</strong> \u2014 Konfirmim kur nj\u00eb pun\u00eb p\u00ebrfundon</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-orange-500" /> <span><strong>Garanci n\u00eb Skadim</strong> \u2014 Kur garancia e nj\u00eb pune skadon brenda 30 dit\u00ebsh</span></div>
            </div>

            <h4 className="font-semibold text-sm">Menaxhimi i Njoftimeve</h4>
            <p className="text-sm text-muted-foreground">Klikoni mbi nj\u00eb njoftim p\u00ebr ta sh\u00ebnuar si t\u00eb lexuar. P\u00ebrdorni &quot;Lexo t\u00eb gjitha&quot; p\u00ebr t\u00eb pastruar t\u00eb gjitha njoftimet.</p>
          </div>
        </GuideSection>

        <GuideSection
          id="gps"
          icon={MapPin}
          iconColor="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          title="GPS & Lokacioni Automatik"
          subtitle="Regjistroni vendndodhjen e pun\u00ebs me nj\u00eb klik"
        >
          <div className="space-y-4">
            <p className="text-sm">Kur jeni n\u00eb vendpun\u00eb, mund t\u00eb regjistroni koordinatat GPS automatikisht.</p>

            <h4 className="font-semibold text-sm">Si ta P\u00ebrdorni</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni form\u00ebn e pun\u00ebs">
                <p>N\u00eb seksionin e t\u00eb dh\u00ebnave t\u00eb klientit, gjeni butonin e GPS-it (ikona e hart\u00ebs).</p>
              </Step>
              <Step number={2} title="Klikoni butonin GPS">
                <p>Aplikacioni do t\u00eb k\u00ebrkoj\u00eb lejen p\u00ebr t\u00eb aksesuar vendndodhjen tuaj. Pranojeni.</p>
              </Step>
              <Step number={3} title="Koordinatat ruhen">
                <p>Lat/Lng ruhen automatikisht n\u00eb pun\u00eb. Nj\u00eb link i Google Maps gjenerohet q\u00eb mund ta ndani me t\u00eb tjer\u00ebt.</p>
              </Step>
            </div>

            <Tip>GPS funksionon vet\u00ebm n\u00eb p\u00ebrdorim n\u00eb telefon ose kompjuter q\u00eb ka GPS. Sigurohuni q\u00eb lokacioni \u00ebsht\u00eb i aktivizuar n\u00eb pajisjen tuaj.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="rating"
          icon={Star}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
          title="Vler\u00ebsimi Publik i Klient\u00ebve"
          subtitle="Merrni vler\u00ebsime nga klient\u00ebt pa nevoj\u00eb llogarie"
        >
          <div className="space-y-4">
            <p className="text-sm">Pas p\u00ebrfundimit t\u00eb nj\u00eb pune, mund t\u00eb gjeneroni nj\u00eb link p\u00ebr vler\u00ebsim q\u00eb ia d\u00ebrgoni klientit.</p>

            <h4 className="font-semibold text-sm">Si ta P\u00ebrdorni</h4>
            <div className="space-y-3">
              <Step number={1} title="P\u00ebrfundoni pun\u00ebn">
                <p>Sigurohuni q\u00eb puna ka statusin &quot;E P\u00ebrfunduar&quot;.</p>
              </Step>
              <Step number={2} title="Gjeneroni linkun e vler\u00ebsimit">
                <p>N\u00eb kartel\u00ebn e pun\u00ebs n\u00eb Dashboard, klikoni ikonën e aeroplanit (share). Kopjohet linku automatikisht.</p>
              </Step>
              <Step number={3} title="D\u00ebrgoni linkun">
                <p>D\u00ebrgojeni linkun n\u00ebp\u00ebrm\u00ebs WhatsApp, SMS ose Email. Klienti hap linkun n\u00eb telefon.</p>
              </Step>
              <Step number={4} title="Klienti vler\u00ebson">
                <p>Klienti sheh nj\u00eb faqje t\u00eb thjesht\u00eb ku zgjedh 1-5 yje dhe mund t\u00eb l\u00ebr\u00eb nj\u00eb koment (opsional).</p>
              </Step>
            </div>

            <Tip>Vler\u00ebsimet e klient\u00ebve ju ndihmojn\u00eb t\u00eb p\u00ebrmirësoni sh\u00ebrbimet dhe t\u00eb nd\u00ebrtoni besimin me klient\u00ebt e rinj.</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="pwa"
          icon={Smartphone}
          iconColor="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400"
          title="Instalimi si Aplikacion (PWA)"
          subtitle="Instaloni Elektronova n\u00eb telefon si aplikacion"
        >
          <div className="space-y-4">
            <p className="text-sm">Elektronova mund t\u00eb instalohet si aplikacion n\u00eb telefonin tuaj, pa shkuar n\u00eb App Store ose Play Store.</p>

            <h4 className="font-semibold text-sm">Instalimi n\u00eb Android</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni faqjen n\u00eb Chrome">
                <p>Shkoni te adresa e Elektronova-s n\u00eb shfletuesin Chrome.</p>
              </Step>
              <Step number={2} title="Klikoni 'Instalo' ose 'Shto n\u00eb Home Screen'">
                <p>Do t\u00eb shfaqet nj\u00eb mesazh q\u00eb ju fton t\u00eb instaloni aplikacionin. Ose shkoni te menyja (3 pikat) dhe zgjidhni &quot;Add to Home screen&quot;.</p>
              </Step>
              <Step number={3} title="Hapeni nga ekrani kryesor">
                <p>Tani Elektronova shfaqet si ikona n\u00eb ekranin kryesor, nj\u00eblloj si \u00e7do aplikacion tjet\u00ebr.</p>
              </Step>
            </div>

            <h4 className="font-semibold text-sm">Instalimi n\u00eb iPhone</h4>
            <div className="space-y-3">
              <Step number={1} title="Hapni faqjen n\u00eb Safari">
                <p>P\u00ebrdorni Safari (jo Chrome) p\u00ebr t\u00eb hapur faqjen.</p>
              </Step>
              <Step number={2} title="Klikoni butonin Share">
                <p>N\u00eb fund t\u00eb ekranit, klikoni ikonën e Share-it (katrori me shigjet\u00ebn lart).</p>
              </Step>
              <Step number={3} title="Zgjidhni 'Add to Home Screen'">
                <p>L\u00ebshoni posht\u00eb n\u00eb menu dhe zgjidhni &quot;Add to Home Screen&quot;. Emertojeni dhe klikoni &quot;Add&quot;.</p>
              </Step>
            </div>

            <Tip>Aplikacioni funksionon edhe kur nuk keni internet p\u00ebr shikimin e faqjeve t\u00eb ruajtura (por p\u00ebr t\u00eb dh\u00ebna t\u00eb reja nevojitet interneti).</Tip>
          </div>
        </GuideSection>

        <GuideSection
          id="admin"
          icon={Shield}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          title="Modaliteti Admin"
          subtitle="Funksionet e avansuara p\u00ebr administratorin"
        >
          <div className="space-y-4">
            <p className="text-sm">Llogaria Admin ka akses n\u00eb funksione shtes\u00eb q\u00eb llogaria e teknikut nuk e ka.</p>

            <h4 className="font-semibold text-sm">\u00c7far\u00eb Sheh Admini m\u00eb Shum\u00eb</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>\u2022 <strong>\u00c7mimet e blerjes</strong> n\u00eb form\u00ebn e procesverbaliti (tekniku sheh vet\u00ebm \u00e7mimin e shitjes)</p>
              <p>\u2022 <strong>Marzhi i fitimit</strong> p\u00ebr \u00e7do artikull (sa fitoni p\u00ebr nj\u00ebsi)</p>
              <p>\u2022 <strong>Analiza e fitimit</strong> \u2014 faqja e plot\u00eb e Analiz\u00ebs</p>
              <p>\u2022 <strong>Dashboard-i i fitimit</strong> me filtra t\u00eb avansuara</p>
            </div>

            <h4 className="font-semibold text-sm">Rolet e P\u00ebrdoruesve</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>\u2022 <strong>Admin</strong> \u2014 Akses t\u00eb plot\u00eb n\u00eb t\u00eb gjitha funksionet, p\u00ebrfshir\u00eb \u00e7mimet e blerjes, analiz\u00ebn dhe menaxhimin e p\u00ebrdoruesve</p>
              <p>\u2022 <strong>Teknik</strong> \u2014 Mund t\u00eb krijoj\u00eb/ndryshoj\u00eb pun\u00eb, shikojë katalogun, stokun, klient\u00ebt, por pa parë \u00e7mimet e blerjes</p>
            </div>
          </div>
        </GuideSection>

        <GuideSection
          id="settings"
          icon={Settings}
          iconColor="bg-gray-100 text-gray-600 dark:bg-gray-950 dark:text-gray-400"
          title="Profili & Pjes\u00ebt\u00eb Tjera"
          subtitle="Ndryshoni fjal\u00ebkalimin, tem\u00ebn dhe m\u00eb shum\u00eb"
        >
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Profili Im</h4>
            <p className="text-sm text-muted-foreground">Klikoni emrin tuaj n\u00eb krye t\u00eb faqjes ose shkoni te &quot;Profili Im&quot; n\u00eb menun\u00eb mobile. K\u00ebtu mund t\u00eb:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>\u2022 Ndryshoni emrin e plot\u00eb</p>
              <p>\u2022 Ndryshoni fjal\u00ebkalimin</p>
              <p>\u2022 Shikoni informacionin e llogaris\u00eb</p>
            </div>

            <h4 className="font-semibold text-sm">Tema e Ndritshme / e Err\u00ebt</h4>
            <p className="text-sm text-muted-foreground">Klikoni ikonën e diellit/h\u00ebn\u00ebs n\u00eb krye t\u00eb faqjes p\u00ebr t\u00eb ndryshuar mes tem\u00ebs s\u00eb ndritshme dhe t\u00eb err\u00ebt. Zgjedhja ruhet automatikisht.</p>

            <h4 className="font-semibold text-sm">Dalja (Logout)</h4>
            <p className="text-sm text-muted-foreground">Klikoni ikonën e daljes n\u00eb krye t\u00eb faqjes p\u00ebr t\u00eb dal\u00eb nga llogaria. Do t\u00eb ridrejtoheni te faqja e hyrjes.</p>
          </div>
        </GuideSection>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center space-y-3">
            <Globe className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-bold" data-testid="text-questions-title">Keni Pyetje?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto" data-testid="text-questions-description">
              N\u00ebse keni ndonj\u00eb pyetje ose problem me aplikacionin, kontaktoni ekipin ton\u00eb p\u00ebrmes email-it ose telefonit. Jemi gjithmon\u00eb gati t&apos;ju ndihmojm\u00eb!
            </p>
            <Link href="/">
              <Button data-testid="button-back-to-dashboard" className="gap-2 mt-2">
                <ArrowLeft className="h-4 w-4" />
                Kthehu n\u00eb Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}