import { notFound } from 'next/navigation';
import { getLocationBySlug, locationsData } from '@/data/locations';
import LeadForm from '@/components/LeadForm';
import { FaMapMarkerAlt, FaShieldAlt, FaPhone, FaTools, FaCheckCircle, FaCamera, FaHome, FaBolt } from 'react-icons/fa';
import { Link, getPathname } from '@/i18n/routing';
import Schema from '@/components/Schema';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const location = getLocationBySlug(slug, locale);
  if (!location) return {};

  const baseUrl = 'https://elektronova.online';
  const pathname = getPathname({ locale, href: { pathname: '/locations/[slug]', params: { slug } } as any });

  const alternates: Record<string, string> = {};
  ['sq', 'en'].forEach((l) => {
    alternates[l] = `${baseUrl}${getPathname({ locale: l, href: { pathname: '/locations/[slug]', params: { slug } } as any })}`;
  });

  return {
    title: location.title,
    description: location.description,
    alternates: {
      canonical: `${baseUrl}${pathname}`,
      languages: alternates,
    }
  };
}

export async function generateStaticParams() {
  const locales = ['sq', 'en'];
  const params: { locale: string; slug: string }[] = [];

  locales.forEach(locale => {
    Object.keys(locationsData[locale as 'sq' | 'en'] || {}).forEach(slug => {
      params.push({ locale, slug });
    });
  });

  return params;
}

export default async function LocationPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const location = getLocationBySlug(slug, locale);
  if (!location) notFound();

  const t = await getTranslations({ locale, namespace: 'Locations' });

  return (
    <>
      <Schema locale={locale} type="location" slug={slug} />
      <main className="pt-24 pb-16">
        <section className="relative py-24 bg-card/20 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center gap-3 text-primary font-semibold mb-6">
              <FaMapMarkerAlt />
              <span className="uppercase tracking-widest text-sm">{location.city}, {t('kosovo')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight max-w-4xl">
              {location.title}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
              {location.intro}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <section>
                <h2 className="text-3xl font-heading font-bold mb-8 italic">{t('services_in')} <span className="text-primary">{location.city}</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {location.servicesOffered.map((service, i) => (
                    <Link
                      key={i}
                      href="/services"
                      className="glass-card flex items-center gap-4 hover:border-primary/40 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FaShieldAlt />
                      </div>
                      <span className="font-semibold">{service}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {location.sections.map((section, idx) => (
                <section key={idx} className="scroll-mt-32">
                  <h2 className="text-3xl font-heading font-bold mb-6">{section.title}</h2>
                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
                    {section.content.split('\n\n').map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}

              {location.installationExamples.length > 0 && (
                <section>
                  <h2 className="text-3xl font-heading font-bold mb-10">{t('realizations_in')} {location.city}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {location.installationExamples.map((ex, exIdx) => (
                      <div key={exIdx} className="glass-card overflow-hidden p-0 group">
                        <div className="aspect-video relative overflow-hidden bg-white/5">
                          {/* Image placeholder since we don't have real images yet */}
                          <div className="absolute inset-0 flex items-center justify-center text-white/20">
                            <FaCamera size={48} />
                          </div>
                          <img
                            src={ex.image}
                            alt={ex.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-bold mb-3">{ex.title}</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">{ex.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="bg-card/40 p-10 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-heading font-bold mb-8">{t('why_elektronova_in')} {location.city}?</h2>
                <p className="text-gray-300 mb-10 leading-relaxed">
                  {t('local_presence_desc', { city: location.city })}
                </p>
                <div className="space-y-6">
                  {location.localBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent mt-1">
                        <FaTools className="text-xs" />
                      </div>
                      <p className="text-gray-300 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-bold mb-6">{t('service_coverage')}</h2>
                <p className="text-gray-400 leading-relaxed">
                  {t('coverage_desc', { city: location.city })}
                </p>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl">
                  <h3 className="text-2xl font-heading font-bold mb-4">{t('consultation_in')} {location.city}</h3>
                  <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                    {t('consultation_desc', { city: location.city })}
                  </p>
                  <LeadForm />
                </div>

                <div className="mt-8 glass-card border-accent/20">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <FaPhone className="text-accent ring-accent ring-offset-background" />
                    {t('local_line')}
                  </h4>
                  <p className="text-2xl font-heading font-bold text-white tracking-wider">+383 49 771 673</p>
                  <p className="text-xs text-gray-500 mt-4 uppercase">{t('fast_service_kosovo')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
