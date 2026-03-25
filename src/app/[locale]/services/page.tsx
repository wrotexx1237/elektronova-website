import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import ServiceCard from '@/components/ServiceCard';
import { getServiceBySlug } from '@/data/services';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  return {
    title: `ElektroNova | ${t('services')}`,
    description: (await getTranslations({locale, namespace: 'Services'}))('description')
  };
}

// Unsplash stock images per category — real photos, no copyright issues
const categoryMeta = [
  {
    key: 'cctv',
    image: '/images/stock/stock-22.jpg',
    accent: '#007BFF',
    badge: 'CCTV & Video',
    stat: '500+ Sisteme',
  },
  {
    key: 'security',
    image: '/images/stock/stock-23.jpg',
    accent: '#22c55e',
    badge: 'Siguri & Alarm',
    stat: '300+ Klientë',
  },
  {
    key: 'electrical',
    image: '/images/stock/stock-24.jpg',
    accent: '#f97316',
    badge: 'Instalime Elektrike',
    stat: '10+ Vite Eksperiencë',
  },
];

// Per-service Unsplash thumbnails
const serviceImages: Record<string, string> = {
  'instalimi-kamerave-sigurise':    '/images/stock/stock-25.jpg',
  'sistemet-dahua-cctv':            '/images/stock/stock-26.jpg',
  'kamerap-ip':                     '/images/stock/stock-27.jpg',
  'sistemet-nvr-dvr':               '/images/stock/stock-28.jpg',
  'mirembajtja-cctv':               '/images/stock/stock-29.jpg',
  'sistemet-alarmit':               '/images/stock/stock-30.jpg',
  'siguria-shtepise-menqur':        '/images/stock/stock-31.jpg',
  'kontrolli-hyrjes':               '/images/stock/stock-23.jpg',
  'sistemet-interfonit':            '/images/stock/stock-33.jpg',
  'interfoni-video':                '/images/stock/stock-22.jpg',
  'instalime-elektrike':            '/images/stock/stock-35.jpg',
  'riparime-elektrike':             '/images/stock/stock-24.jpg',
  'instalimi-rrjetit-internetit':   '/images/stock/stock-41.webp',
  'instalimi-fibres-optike':        '/images/stock/stock-38.jpg',
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Services'});

  const getService = (baseKey: string, fallbackTitle: string, fallbackIcon: string) => {
    const s = getServiceBySlug(baseKey, locale);
    return {
      title: s ? s.title : fallbackTitle,
      iconName: s ? s.iconName : fallbackIcon,
      href: `/services/${s ? s.slug : baseKey}`,
      baseKey
    };
  };

  const categories = [
    {
      name: t('cat_cctv'),
      meta: categoryMeta[0],
      services: [
        getService('instalimi-kamerave-sigurise', 'Instalimi i Kamerave', 'camera'),
        getService('sistemet-dahua-cctv', 'Sistemet Dahua CCTV', 'video'),
        getService('kamerap-ip', 'Kamerat IP', 'stream'),
        getService('sistemet-nvr-dvr', 'Sistemet NVR/DVR', 'server'),
        getService('mirembajtja-cctv', 'Mirëmbajtja e CCTV', 'userShield'),
      ],
    },
    {
      name: t('cat_security'),
      meta: categoryMeta[1],
      services: [
        getService('sistemet-alarmit', 'Sistemet e Alarmit', 'shield'),
        getService('siguria-shtepise-menqur', 'Smart Home Security', 'home'),
        getService('kontrolli-hyrjes', 'Kontrolli i Hyrjes', 'lock'),
        getService('sistemet-interfonit', 'Sistemet e Interfonit', 'door'),
        getService('interfoni-video', 'Video Interfoni', 'tv'),
      ],
    },
    {
      name: t('cat_electrical'),
      meta: categoryMeta[2],
      services: [
        getService('instalime-elektrike', 'Instalime Elektrike', 'bolt'),
        getService('riparime-elektrike', 'Riparime Elektrike', 'wrench'),
        getService('instalimi-rrjetit-internetit', 'Rrjeta & Internet', 'wifi'),
        getService('instalimi-fibres-optike', 'Fibra Optike', 'microchip'),
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#020202]">

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-32 overflow-hidden border-b border-white/5">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,123,255,0.12),transparent)]" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 mb-10 backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,123,255,0.8)]" />
            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">ElektroNova Services</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight leading-[1.0]">
            {t('title_main')}{' '}
            <span className="text-primary">{t('title_highlight')}</span>
            {t('title_suffix') && <> {t('title_suffix')}</>}
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>

          {/* Quick-jump chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat, i) => (
              <a
                key={i}
                href={`#cat-${i}`}
                className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-bold hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <div className="space-y-0">
        {categories.map((cat, idx) => (
          <section key={idx} id={`cat-${idx}`} className="relative py-28 border-b border-white/5 overflow-hidden">

            {/* Ambient tint from category accent */}
            <div
              className="absolute top-0 right-0 w-[700px] h-[500px] blur-[200px] pointer-events-none opacity-[0.06] rounded-full"
              style={{ background: cat.meta.accent }}
            />

            <div className="container mx-auto px-6 relative z-10">

              {/* Category Banner */}
              <div className="relative rounded-3xl overflow-hidden mb-16 h-52 md:h-64 group">
                <img
                  src={cat.meta.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center px-10 md:px-14">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm" style={{ color: cat.meta.accent }}>
                        {cat.meta.badge}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                      {cat.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cat.meta.accent }} />
                      <span className="text-white/50 text-sm font-bold uppercase tracking-widest">{cat.meta.stat}</span>
                    </div>
                  </div>

                  {/* Index number */}
                  <span className="ml-auto text-[7rem] md:text-[10rem] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom border line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${cat.meta.accent}60, transparent)` }} />
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.services.map((service, sIdx) => {
                  return (
                    <ServiceCard
                      key={sIdx}
                      index={sIdx}
                      title={service.title}
                      iconName={service.iconName}
                      href={service.href}
                      description={(t as any)('service_description')}
                      image={serviceImages[service.baseKey]}
                      accentColor={cat.meta.accent}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ─── CTA ─── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(0,123,255,0.08),transparent)]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-2xl mx-auto p-12 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
            <h3 className="text-4xl font-heading font-black mb-4">{t('cta_title')}</h3>
            <p className="text-white/40 mb-10 leading-relaxed">{t('cta_desc')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+38349771673"
                className="btn-primary px-8 py-3.5 rounded-xl text-base"
              >
                {t('call_expert')}
              </a>
              <a
                href="https://wa.me/38349771673"
                className="flex items-center gap-3 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                {t('whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
