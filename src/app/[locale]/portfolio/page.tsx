import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {
  FaCamera, FaShieldAlt, FaBolt, FaNetworkWired, FaHome, FaTools, 
  FaIndustry, FaSun, FaKey, FaCar, FaStore, FaGraduationCap, 
  FaEye, FaIdCard, FaWifi, FaFire, FaLightbulb, FaWarehouse, 
  FaCity, FaObjectGroup, FaBatteryFull, FaBell, FaShoppingCart, 
  FaBuilding, FaServer, FaCheckCircle, FaLock, FaArrowUp, FaProjectDiagram
} from 'react-icons/fa';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  return {
    title: `ElektroNova | ${t('portfolio')}`,
    description: "Shikoni projektet tona të realizuara në tërë Kosovën — nga instalimet e kamerave deri te sistemet smart home."
  };
}

export default async function PortfolioPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Portfolio'});
  const tNav = await getTranslations({locale, namespace: 'Navigation'});

  const projects = [
    {
      title: locale === 'sq' ? "Instalimi i Kamerave të Sigurisë" : "Security Camera Installation",
      category: "CCTV",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaCamera,
      image: "/images/stock/stock-22.jpg",
      description: locale === 'sq' ? "Instalimi i Kamerave të Sigurisë në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Security Camera Installation in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Monitorimi i Dyqaneve me Rezolucion të Lartë" : "High-Resolution Shop Monitoring",
      category: "Retail",
      location: locale === 'sq' ? "Prizren" : "Prizren",
      icon: FaShoppingCart,
      image: "/images/stock/stock-23.jpg",
      description: locale === 'sq' ? "Monitorimi i Dyqaneve me Rezolucion të Lartë në Prizren, duke përdorur teknologjitë e fundit për siguri maksimale." : "High-Resolution Shop Monitoring in Prizren, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Siguria e Infrastrukturës Kritike" : "Critical Infrastructure Security",
      category: "Strategic",
      location: locale === 'sq' ? "Kosovë" : "Kosovo",
      icon: FaBuilding,
      image: "/images/stock/stock-24.jpg",
      description: locale === 'sq' ? "Siguria e Infrastrukturës Kritike në Kosovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Critical Infrastructure Security in Kosovo, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalimi i Serverëve të Sigurisë" : "Security Server Installation",
      category: "IT",
      location: locale === 'sq' ? "Prishtinë" : "Prishtina",
      icon: FaServer,
      image: "/images/stock/stock-25.jpg",
      description: locale === 'sq' ? "Instalimi i Serverëve të Sigurisë në Prishtinë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Security Server Installation in Prishtina, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi i Verifikimit Vizual" : "Visual Verification System",
      category: "Verification",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaCheckCircle,
      image: "/images/stock/stock-26.jpg",
      description: locale === 'sq' ? "Sistemi i Verifikimit Vizual në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Visual Verification System in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Mbrojtja e Pasurisë Private" : "Private Property Protection",
      category: "Protection",
      location: locale === 'sq' ? "Kosovë" : "Kosovo",
      icon: FaLock,
      image: "/images/stock/stock-27.jpg",
      description: locale === 'sq' ? "Mbrojtja e Pasurisë Private në Kosovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Private Property Protection in Kosovo, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalimi i Kamerave në Lartësi" : "High-Altitude Camera Installation",
      category: "CCTV",
      location: locale === 'sq' ? "Mitrovicë" : "Mitrovica",
      icon: FaArrowUp,
      image: "/images/stock/stock-28.jpg",
      description: locale === 'sq' ? "Instalimi i Kamerave në Lartësi në Mitrovicë, duke përdorur teknologjitë e fundit për siguri maksimale." : "High-Altitude Camera Installation in Mitrovica, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi i Avancuar i Rrjetit" : "Advanced Network System",
      category: "Networking",
      location: locale === 'sq' ? "Ferizaj" : "Ferizaj",
      icon: FaProjectDiagram,
      image: "/images/stock/stock-29.jpg",
      description: locale === 'sq' ? "Sistemi i Avancuar i Rrjetit në Ferizaj, duke përdorur teknologjitë e fundit për siguri maksimale." : "Advanced Network System in Ferizaj, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Zgjidhja Finale e Sigurisë" : "Final Security Solution",
      category: "Security",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaShieldAlt,
      image: "/images/stock/stock-30.jpg",
      description: locale === 'sq' ? "Zgjidhja Finale e Sigurisë në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Final Security Solution in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Kamera të Jashtme për Monitorim" : "Outdoor Monitoring Cameras",
      category: "Services",
      location: locale === 'sq' ? "Kosovë" : "Kosovo",
      icon: FaTools,
      image: "/images/stock/stock-31.jpg",
      description: locale === 'sq' ? "Kamera të Jashtme për Monitorim në Kosovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Outdoor Monitoring Cameras in Kosovo, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Monitorimi i Perimetrit të Jashtëm" : "Outdoor Perimeter Monitoring",
      category: "CCTV",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaEye,
      image: "/images/stock/stock-35.jpg",
      description: locale === 'sq' ? "Monitorimi i Perimetrit të Jashtëm në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Outdoor Perimeter Monitoring in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalimi i Interfonave Smart" : "Smart Intercom Installation",
      category: "Intercom",
      location: locale === 'sq' ? "Gjakovë" : "Gjakova",
      icon: FaIdCard,
      image: "/images/stock/stock-3.webp",
      description: locale === 'sq' ? "Instalimi i Interfonave Smart në Gjakovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Smart Intercom Installation in Gjakova, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Rrjeti WiFi për Biznes" : "WiFi Network for Business",
      category: "Networking",
      location: locale === 'sq' ? "Prizren" : "Prizren",
      icon: FaWifi,
      image: "/images/stock/stock-4.webp",
      description: locale === 'sq' ? "Rrjeti WiFi për Biznes në Prizren, duke përdorur teknologjitë e fundit për siguri maksimale." : "WiFi Network for Business in Prizren, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi i Detektimit të Zjarrit" : "Fire Detection System",
      category: "Safety",
      location: locale === 'sq' ? "Kosovë" : "Kosovo",
      icon: FaFire,
      image: "/images/stock/stock-5.webp",
      description: locale === 'sq' ? "Sistemi i Detektimit të Zjarrit në Kosovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Fire Detection System in Kosovo, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Automimi i Ndriçimit" : "Lighting Automation",
      category: "Automation",
      location: locale === 'sq' ? "Prishtinë" : "Prishtina",
      icon: FaLightbulb,
      image: "/images/stock/stock-6.webp",
      description: locale === 'sq' ? "Automimi i Ndriçimit në Prishtinë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Lighting Automation in Prishtina, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Mbrojtja e Depove Industriale" : "Industrial Warehouse Protection",
      category: "Security",
      location: locale === 'sq' ? "Vushtrri" : "Vushtrri",
      icon: FaWarehouse,
      image: "/images/stock/stock-11.webp",
      description: locale === 'sq' ? "Mbrojtja e Depove Industriale në Vushtrri, duke përdorur teknologjitë e fundit për siguri maksimale." : "Industrial Warehouse Protection in Vushtrri, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Kamera për Mbikëqyrjen e Qytetit" : "City Surveillance Cameras",
      category: "Public",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaCity,
      image: "/images/stock/stock-22.jpg",
      description: locale === 'sq' ? "Kamera për Mbikëqyrjen e Qytetit në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "City Surveillance Cameras in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Zgjidhje e Integruar e Sigurisë" : "Integrated Security Solution",
      category: "Integrated",
      location: locale === 'sq' ? "Klinë" : "Klina",
      icon: FaObjectGroup,
      image: "/images/stock/stock-23.jpg",
      description: locale === 'sq' ? "Zgjidhje e Integruar e Sigurisë në Klinë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Integrated Security Solution in Klina, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalimi i Akumulatorëve për Siguri" : "Battery Backup Installation for Security",
      category: "Energy",
      location: locale === 'sq' ? "Deçan" : "Decan",
      icon: FaBatteryFull,
      image: "/images/stock/stock-24.jpg",
      description: locale === 'sq' ? "Instalimi i Akumulatorëve për Siguri në Deçan, duke përdorur teknologjitë e fundit për siguri maksimale." : "Battery Backup Installation for Security in Decan, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi i Alarmit për Shtëpi" : "Home Alarm System",
      category: "Home",
      location: locale === 'sq' ? "Istog" : "Istog",
      icon: FaBell,
      image: "/images/stock/stock-25.jpg",
      description: locale === 'sq' ? "Sistemi i Alarmit për Shtëpi në Istog, duke përdorur teknologjitë e fundit për siguri maksimale." : "Home Alarm System in Istog, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalim Kamerash në Strukturë Metalike" : "Camera Installation on Metal Structure",
      category: "Electrical",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaBolt,
      image: "/images/stock/stock-26.jpg",
      description: locale === 'sq' ? "Instalim Kamerash në Strukturë Metalike në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Camera Installation on Metal Structure in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Kamera me Energji Solare" : "Solar Powered Cameras",
      category: "Solar",
      location: locale === 'sq' ? "Gjakovë" : "Gjakova",
      icon: FaSun,
      image: "/images/stock/stock-27.jpg",
      description: locale === 'sq' ? "Kamera me Energji Solare në Gjakovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Solar Powered Cameras in Gjakova, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistem Kamerash për Ambiente të Brendshme" : "Indoor Camera System",
      category: "CCTV",
      location: locale === 'sq' ? "Prishtinë" : "Prishtina",
      icon: FaCamera,
      image: "/images/stock/stock-28.jpg",
      description: locale === 'sq' ? "Sistem Kamerash për Ambiente të Brendshme në Prishtinë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Indoor Camera System in Prishtina, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Monitorim 24/7 me Inteligjencë Artificiale" : "24/7 Monitoring with AI",
      category: "Security",
      location: locale === 'sq' ? "Gjakovë" : "Gjakova",
      icon: FaShieldAlt,
      image: "/images/stock/stock-29.jpg",
      description: locale === 'sq' ? "Monitorim 24/7 me Inteligjencë Artificiale në Gjakovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "24/7 Monitoring with AI in Gjakova, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalim i Sistemit të Alarmit Wireless" : "Wireless Alarm System Installation",
      category: "Alarms",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaShieldAlt,
      image: "/images/stock/stock-30.jpg",
      description: locale === 'sq' ? "Instalim i Sistemit të Alarmit Wireless në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Wireless Alarm System Installation in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi Smart Home në Pejë" : "Smart Home System in Peja",
      category: "Smart Home",
      location: locale === 'sq' ? "Pejë" : "Peja",
      icon: FaHome,
      image: "/images/stock/stock-31.jpg",
      description: locale === 'sq' ? "Sistemi Smart Home në Pejë në Pejë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Smart Home System in Peja in Peja, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Rrjeti dhe Infrastruktura e Sigurisë" : "Security Network & Infrastructure",
      category: "Networking",
      location: locale === 'sq' ? "Prishtinë" : "Prishtina",
      icon: FaNetworkWired,
      image: "/images/stock/stock-35.jpg",
      description: locale === 'sq' ? "Rrjeti dhe Infrastruktura e Sigurisë në Prishtinë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Security Network & Infrastructure in Prishtina, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Siguria e Fabrikës me Kamera Termike" : "Factory Security with Thermal Cameras",
      category: "Industrial",
      location: locale === 'sq' ? "Gjakovë" : "Gjakova",
      icon: FaIndustry,
      image: "/images/stock/stock-3.webp",
      description: locale === 'sq' ? "Siguria e Fabrikës me Kamera Termike në Gjakovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Factory Security with Thermal Cameras in Gjakova, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalimi i Paneleve Solare për Kamera" : "Solar Panel Installation for Cameras",
      category: "Solar",
      location: locale === 'sq' ? "Kosovë" : "Kosovo",
      icon: FaSun,
      image: "/images/stock/stock-4.webp",
      description: locale === 'sq' ? "Instalimi i Paneleve Solare për Kamera në Kosovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Solar Panel Installation for Cameras in Kosovo, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi i Kontrollit të Qasjes" : "Access Control System",
      category: "Access Control",
      location: locale === 'sq' ? "Prizren" : "Prizren",
      icon: FaKey,
      image: "/images/stock/stock-5.webp",
      description: locale === 'sq' ? "Sistemi i Kontrollit të Qasjes në Prizren, duke përdorur teknologjitë e fundit për siguri maksimale." : "Access Control System in Prizren, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemet e Sigurisë për Parkingje" : "Parking Security Systems",
      category: "Security",
      location: locale === 'sq' ? "Ferizaj" : "Ferizaj",
      icon: FaCar,
      image: "/images/stock/stock-6.webp",
      description: locale === 'sq' ? "Sistemet e Sigurisë për Parkingje në Ferizaj, duke përdorur teknologjitë e fundit për siguri maksimale." : "Parking Security Systems in Ferizaj, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Zgjidhje për Siguri në Lokale" : "Security Solutions for Shops",
      category: "Commercial",
      location: locale === 'sq' ? "Gjilan" : "Gjilan",
      icon: FaStore,
      image: "/images/stock/stock-11.webp",
      description: locale === 'sq' ? "Zgjidhje për Siguri në Lokale në Gjilan, duke përdorur teknologjitë e fundit për siguri maksimale." : "Security Solutions for Shops in Gjilan, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Instalim i Kamerave 4K në Vila" : "4K Camera Installation in Villas",
      category: "Residential",
      location: locale === 'sq' ? "Prishtinë" : "Prishtina",
      icon: FaHome,
      image: "/images/stock/stock-22.jpg",
      description: locale === 'sq' ? "Instalim i Kamerave 4K në Vila në Prishtinë, duke përdorur teknologjitë e fundit për siguri maksimale." : "4K Camera Installation in Villas in Prishtina, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Mbrojtja e Shkollave me Kamera" : "School Protection with Cameras",
      category: "Education",
      location: locale === 'sq' ? "Mitrovicë" : "Mitrovica",
      icon: FaGraduationCap,
      image: "/images/stock/stock-23.jpg",
      description: locale === 'sq' ? "Mbrojtja e Shkollave me Kamera në Mitrovicë, duke përdorur teknologjitë e fundit për siguri maksimale." : "School Protection with Cameras in Mitrovica, using the latest technologies for maximum security."
    },
    {
      title: locale === 'sq' ? "Sistemi i Avancuar i Sigurisë" : "Advanced Security System",
      category: "Security",
      location: locale === 'sq' ? "Kosovë" : "Kosovo",
      icon: FaShieldAlt,
      image: "/images/stock/stock-24.jpg",
      description: locale === 'sq' ? "Sistemi i Avancuar i Sigurisë në Kosovë, duke përdorur teknologjitë e fundit për siguri maksimale." : "Advanced Security System in Kosovo, using the latest technologies for maximum security."
    }
  ];

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-heading font-bold mb-6 italic">
            {t('title_main')} <span className="text-primary">{t('title_highlight')}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, idx) => (
            <div key={idx} className="glass-card group overflow-hidden p-0 border-white/5 hover:border-primary/50 transition-all duration-500">
              <div className="relative aspect-video overflow-hidden">
                <img 
                   src={project.image} 
                   alt={project.title}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                   {project.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">{project.location}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                   {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-24 p-12 rounded-[40px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-white/10 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <h3 className="text-4xl font-heading font-bold mb-4">{t('cta_title')}</h3>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">{t('cta_desc')}</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact" className="btn-primary px-12 py-4">{t('request_quote')}</Link>
                <a href="tel:+38349771673" className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold">{t('call_phone')}</a>
              </div>
            </div>
        </section>
      </div>
    </main>
  );
}
