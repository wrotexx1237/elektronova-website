import {useTranslations, useLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import Image from 'next/image';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import LeadForm from '@/components/LeadForm';
import TestimonialSlider from '@/components/TestimonialSlider';
import Brands from '@/components/Brands';
import MissionSection from '@/components/MissionSection';
import RecentWorkSection from '@/components/RecentWorkSection';
import {FaShieldAlt, FaHome, FaNetworkWired, FaTools} from 'react-icons/fa';
import {blogData} from '@/data/blog';
import BlogCard from '@/components/BlogCard';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Index'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default function IndexPage() {
  const t = useTranslations('Index');
  const nav = useTranslations('Navigation');
  const common = useTranslations('Common');
  const locale = useLocale();

  const latestArticles = Object.values(blogData[locale] || {}).slice(0, 3);

  const featuredServices = [
    {
      title: t('why_1_title'),
      description: t('why_1_p'),
      iconName: "camera",
      href: "/services/instalimi-kamerave-sigurise",
      accentColor: "#007BFF",
    },
    {
      title: t('why_2_title'),
      description: t('why_2_p'),
      iconName: "shield",
      href: "/services/sistemet-alarmit",
      accentColor: "#00D4FF",
    },
    {
      title: t('why_3_title'),
      description: t('why_3_p'),
      iconName: "bolt",
      href: "/services/instalime-elektrike",
      accentColor: "#FFB800",
    }
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section className="py-32 relative overflow-hidden bg-[#020202]">
        {/* === BACKGROUND === */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-[700px] h-[500px] bg-blue-500/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-yellow-500/3 blur-[160px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          {/* === SECTION HEADER === */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,123,255,0.9)]" />
              <span className="text-primary font-black uppercase tracking-[0.25em] text-[10px]">çfarë ofrojmë</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-white leading-[1.05]">
              {t.rich('services_title', {
                highlight: (chunks) => <span className="text-primary italic">{chunks}</span>
              })}
            </h2>
            <p className="text-white/40 text-lg leading-relaxed max-w-2xl mx-auto">{t('services_p')}</p>
          </div>

          {/* === SERVICE CARDS === */}
          <div className="space-y-6">

            {/* ─── CARD 1: KAMERAT E SIGURISË ─── */}
            <div className="group relative rounded-3xl overflow-hidden border border-white/[0.07] hover:border-blue-500/30 transition-all duration-700 bg-[#06090f]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,123,255,0.12), transparent 60%)' }} />

              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px]">
                {/* Image side */}
                <div className="relative overflow-hidden order-2 lg:order-1 h-64 lg:h-auto">
                  <Image
                    src="/blog/hero-vs.webp"
                    alt="Sisteme Kamerash"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover scale-110 group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#06090f] via-transparent to-transparent lg:via-[#06090f]/30 lg:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06090f] to-transparent lg:bg-none" />

                  {/* Badge on image */}
                  <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                    {['Dahua', 'Hikvision', '4K', 'AI'].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-black/60 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content side */}
                <div className="relative flex flex-col justify-center p-10 lg:p-14 order-1 lg:order-2">
                  <span className="absolute top-8 right-10 font-black text-[8rem] leading-none select-none pointer-events-none text-blue-500/[0.06] group-hover:text-blue-500/[0.1] transition-colors duration-700">01</span>

                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/15 border border-blue-500/20">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>
                    </div>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-blue-500/40 to-transparent" />
                    <span className="text-[10px] font-black tracking-[0.25em] text-blue-500/60 uppercase">Surveillance</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tight group-hover:text-blue-50 transition-colors duration-300">
                    Kamerat e Sigurisë<br />
                    <span className="text-blue-400">Profesionale</span>
                  </h3>
                  <p className="text-white/45 text-base leading-relaxed mb-8 group-hover:text-white/60 transition-colors duration-500 max-w-md">
                    Instalim profesional i kamerave IP dhe CCTV me rezolucion 4K, mbikëqyrje 24/7 dhe teknologji AI për detektim të personave dhe automjeteve. Sistemet tona mbulojnë çdo cep — brenda dhe jashtë.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {['Rezolucion 4K Ultra HD', 'Shikimi natën (IR 60m)', 'Detektim AI i personave', 'Akses Remote në telefon'].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)] shrink-0" />
                        <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors duration-300">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={'/services/instalimi-kamerave-sigurise' as any} className="inline-flex items-center gap-3 self-start">
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 group-hover:text-blue-300 transition-colors">Mëso Më Shumë</span>
                    <div className="w-10 h-10 rounded-full border border-blue-500/40 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300">
                      <span className="text-blue-400 group-hover:text-white text-sm transition-colors">→</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 bg-gradient-to-r from-blue-500 via-blue-400/50 to-transparent" />
            </div>

            {/* ─── CARDS 2+3 SIDE BY SIDE ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ─── CARD 2: SISTEMET E ALARMIT ─── */}
              <div className="group relative rounded-3xl overflow-hidden border border-white/[0.07] hover:border-red-500/30 transition-all duration-700 bg-[#09060a] min-h-[420px]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(239,68,68,0.12), transparent 60%)' }} />

                {/* Background image */}
                <div className="absolute inset-0">
                  <Image src="/blog/hero-ajax.webp" alt="Systemet e Alarmit" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-700 scale-110 group-hover:scale-100 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09060a] via-[#09060a]/80 to-[#09060a]/50" />
                </div>

                <div className="relative z-10 p-10 flex flex-col h-full">
                  <span className="absolute top-6 right-8 font-black text-[6rem] leading-none select-none pointer-events-none text-red-500/[0.07] group-hover:text-red-500/[0.12] transition-colors duration-700">02</span>

                  <div className="flex items-center gap-3 mb-auto">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/15 border border-red-500/20 mb-8">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd"/></svg>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-[10px] font-black tracking-[0.25em] text-red-500/70 uppercase">Ajax Systems · Wireless</span>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight">
                      Sistemet e<br />
                      <span className="text-red-400">Alarmit Ajax</span>
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-6 group-hover:text-white/65 transition-colors duration-500">
                      Mbrojtje totale me sensorë wireless Ajax — lajmërim i çastit kur dikush tenton të hyjë pa leje. Integrim me telefon, qendër monitorimi dhe reagim i shpejtë.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-7">
                      {['Ajax Hub 2+', 'Sensor lëvizjeje', 'Siren 105dB', 'App mobile'].map(f => (
                        <span key={f} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400/80 text-[11px] font-bold">{f}</span>
                      ))}
                    </div>

                    <Link href={'/services/sistemet-alarmit' as any} className="inline-flex items-center gap-3">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-red-400 group-hover:text-red-300 transition-colors">Mëso Më Shumë</span>
                      <div className="w-9 h-9 rounded-full border border-red-500/40 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-400 transition-all duration-300">
                        <span className="text-red-400 group-hover:text-white text-sm transition-colors">→</span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 bg-gradient-to-r from-red-500 via-red-400/50 to-transparent" />
              </div>

              {/* ─── CARD 3: INSTALIME ELEKTRIKE ─── */}
              <div className="group relative rounded-3xl overflow-hidden border border-white/[0.07] hover:border-yellow-500/30 transition-all duration-700 bg-[#0a0900] min-h-[420px]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(234,179,8,0.12), transparent 60%)' }} />

                {/* Background image */}
                <div className="absolute inset-0">
                  <Image src="/blog/modern-electrical-panel.webp" alt="Instalime Elektrike" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-700 scale-110 group-hover:scale-100 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0900] via-[#0a0900]/80 to-[#0a0900]/50" />
                </div>

                <div className="relative z-10 p-10 flex flex-col h-full">
                  <span className="absolute top-6 right-8 font-black text-[6rem] leading-none select-none pointer-events-none text-yellow-500/[0.07] group-hover:text-yellow-500/[0.12] transition-colors duration-700">03</span>

                  <div className="flex items-center gap-3 mb-auto">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-yellow-500/15 border border-yellow-500/20 mb-8">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-[10px] font-black tracking-[0.25em] text-yellow-500/70 uppercase">Elektricist Certifikuar</span>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 leading-tight tracking-tight">
                      Instalime<br />
                      <span className="text-yellow-400">Elektrike</span>
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-6 group-hover:text-white/65 transition-colors duration-500">
                      Instalime elektrike të sigurta për shtëpi, biznese dhe objekte industriale. Nga paneli elektrik deri te çdo prizë — punë e rregullt, standarde europiane.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-7">
                      {['Tablo elektrike', 'Kabllo premium', 'Smart Home', 'Energji diellore'].map(f => (
                        <span key={f} className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400/80 text-[11px] font-bold">{f}</span>
                      ))}
                    </div>

                    <Link href={'/services/instalime-elektrike' as any} className="inline-flex items-center gap-3">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400 group-hover:text-yellow-300 transition-colors">Mëso Më Shumë</span>
                      <div className="w-9 h-9 rounded-full border border-yellow-500/40 flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-400 transition-all duration-300">
                        <span className="text-yellow-400 group-hover:text-black text-sm transition-colors">→</span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 bg-gradient-to-r from-yellow-500 via-yellow-400/50 to-transparent" />
              </div>

            </div>{/* end side-by-side */}
          </div>{/* end space-y-6 */}

          {/* View all CTA */}
          <div className="flex justify-center mt-16">
            <Link
              href="/services"
              className="group flex items-center gap-4 text-white font-bold transition-all duration-500 bg-white/5 px-10 py-5 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_60px_rgba(0,123,255,0.2)] backdrop-blur-md"
            >
              <span className="text-sm uppercase tracking-[0.15em]">{t('view_all_services')}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <span className="text-white text-sm">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <TestimonialSlider />
        </div>
      </section>

      {/* Mission & History Section */}
      <MissionSection />

      {/* Recent Work / Gallery Section */}
      <RecentWorkSection />

      {/* Trust Section / Lead Gen */}
      <section className="py-24 bg-card/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-primary/5 blur-[150px] pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-8">
                {t.rich('why_title', {
                  highlight: (chunks) => <span className="text-primary">{chunks}</span>
                })}
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FaTools className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t('why_1_title')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('why_1_p')}</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FaHome className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t('why_2_title')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('why_2_p')}</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FaNetworkWired className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t('why_3_title')}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('why_3_p')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-3xl z-0 opacity-50 pointer-events-none"></div>
              <div className="relative z-10 bg-background/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-heading font-bold mb-6 text-center">
                    {t.rich('consultation_title', {
                      highlight: (chunks) => <span className="text-primary">{chunks}</span>
                    })}
                </h3>
                <LeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4 italic">
                {t.rich('faq_title', {
                  highlight: (chunks) => <span className="text-primary">{chunks}</span>
                })}
            </h2>
            <p className="text-gray-400">{t('faq_p')}</p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card">
              <h4 className="text-lg font-bold mb-3 text-white">{t('faq_1_q')}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t('faq_1_a')}</p>
            </div>
            <div className="glass-card">
              <h4 className="text-lg font-bold mb-3 text-white">{t('faq_2_q')}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t('faq_2_a')}</p>
            </div>
            <div className="glass-card">
              <h4 className="text-lg font-bold mb-3 text-white">{t('faq_3_q')}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t('faq_3_a')}</p>
            </div>
            <div className="glass-card">
              <h4 className="text-lg font-bold mb-3 text-white">{t('faq_4_q')}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t('faq_4_a')}</p>
            </div>
            <div className="glass-card">
              <h4 className="text-lg font-bold mb-3 text-white">{t('faq_5_q')}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t('faq_5_a')}</p>
            </div>
            <div className="glass-card">
              <h4 className="text-lg font-bold mb-3 text-white">{t('faq_6_q')}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t('faq_6_a')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Section */}
      {latestArticles.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-card/10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4 italic text-white flex justify-center gap-2">
                  <span>{nav('blog') || 'Latest'}</span> <span className="text-primary italic">Articles</span>
              </h2>
              <p className="text-gray-400">Discover our latest articles and updates.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article, idx) => (
                <BlogCard
                  key={article.slug}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  mainImage={article.mainImage}
                  date={article.date}
                  readTime={article.readTime}
                  index={idx}
                  locale={locale}
                />
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/blog" className="group flex items-center gap-4 text-white font-bold transition-all duration-500 bg-white/5 px-10 py-5 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_60px_rgba(0,123,255,0.2)] backdrop-blur-md">
                <span className="text-sm uppercase tracking-[0.15em]">{nav('blog') || 'View All Blogs'}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      <section className="py-20 border-y border-white/5 bg-background">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 uppercase tracking-[0.2em] text-xs font-bold mb-12">{t('brands_p')}</p>
          <Brands />
        </div>
      </section>
    </main>
  );
}

