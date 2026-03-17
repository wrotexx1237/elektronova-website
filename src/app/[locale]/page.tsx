import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import LeadForm from '@/components/LeadForm';
import TestimonialSlider from '@/components/TestimonialSlider';
import Brands from '@/components/Brands';
import MissionSection from '@/components/MissionSection';
import RecentWorkSection from '@/components/RecentWorkSection';
import {FaShieldAlt, FaHome, FaNetworkWired, FaTools} from 'react-icons/fa';

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

  const featuredServices = [
    {
      title: t('why_1_title'),
      description: t('why_1_p'),
      iconName: "camera",
      href: "/services/instalimi-kamerave-sigurise"
    },
    {
      title: t('why_2_title'),
      description: t('why_2_p'),
      iconName: "shield",
      href: "/services/sistemet-alarmit"
    },
    {
      title: t('why_3_title'),
      description: t('why_3_p'),
      iconName: "bolt",
      href: "/services/instalime-elektrike"
    }
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-heading font-bold mb-4">
                {t.rich('services_title', {
                  highlight: (chunks) => <span className="text-primary">{chunks}</span>
                })}
              </h2>
              <p className="text-gray-400">{t('services_p')}</p>
            </div>
            <Link href="/services" className="text-primary hover:underline font-semibold flex items-center gap-2">
              {t('view_all_services')} <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <ServiceCard key={index} index={index} {...service} />
            ))}
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

