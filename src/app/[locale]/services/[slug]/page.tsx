import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getServiceBySlug, servicesData } from '@/data/services';
import LeadForm from '@/components/LeadForm';
import { FaCheckCircle, FaLaptopCode, FaTools, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@/i18n/routing';
import { getArticleBySlug, ArticleContent } from '@/data/blog';
import BlogCard from '@/components/BlogCard';

import { getPathname } from '@/i18n/routing';
import Schema from '@/components/Schema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug, locale);
  if (!service) return {};

  const baseUrl = 'https://elektronova.online';
  const pathname = getPathname({ locale, href: { pathname: '/services/[slug]', params: { slug } } as any });

  const alternates: Record<string, string> = {};
  ['sq', 'en'].forEach((l) => {
    alternates[l] = `${baseUrl}${getPathname({ locale: l, href: { pathname: '/services/[slug]', params: { slug } } as any })}`;
  });

  return {
    title: `ElektroNova | ${service.title}`,
    description: service.description,
    alternates: {
      canonical: `${baseUrl}${pathname}`,
      languages: alternates,
    },
    openGraph: {
      title: service.title,
      description: service.description,
    }
  };
}

export async function generateStaticParams() {
  const locales = ['sq', 'en'];
  const params: { locale: string; slug: string }[] = [];

  locales.forEach(locale => {
    Object.keys(servicesData[locale] || {}).forEach(slug => {
      params.push({ locale, slug });
    });
  });

  return params;
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug, locale);
  if (!service) notFound();
  const t = await getTranslations({ locale, namespace: 'Services' });

  const relatedArticlesData = (service.relatedArticles || [])
    .map(articleSlug => getArticleBySlug(articleSlug, locale))
    .filter((article): article is ArticleContent => article !== undefined);

  return (
    <>
      <Schema locale={locale} type="service" slug={slug} />
      <main className="pt-24 pb-16">
        {/* Service Hero */}
        <section className="relative py-20 bg-card/30 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10">
            <Link href="/services" className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-8 hover:translate-x-1 transition-transform">
              <FaArrowLeft /> {t('back_to_services')}
            </Link>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">{service.title}</h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-0">
                {service.description}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              <section>
                <h2 className="text-3xl font-heading font-bold mb-6">{t('service_description_title')}</h2>
                <div className="prose prose-invert max-w-none text-gray-300 leading-loose">
                  <p className="text-lg">{service.longDescription}</p>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary">
                    <FaCheckCircle /> {t('main_benefits')}
                  </h3>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary">
                    <FaLaptopCode /> {t('tech_used')}
                  </h3>
                  <ul className="space-y-4">
                    {service.technology.map((tech, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></span>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-heading font-bold mb-8">{t('where_applies')}</h2>
                <div className="flex flex-wrap gap-4">
                  {service.useCases.map((useCase, i) => (
                    <span key={i} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                      {useCase}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-heading font-bold mb-8">{t('install_process')}</h2>
                <div className="space-y-6">
                  {service.installationProcess.map((step, i) => (
                    <div key={i} className="flex gap-6 items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0 border border-primary/30">
                        {i + 1}
                      </div>
                      <p className="text-gray-300 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {service.faq.length > 0 && (
                <section>
                  <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-3">
                    <FaQuestionCircle className="text-primary" /> {t('service_faq')}
                  </h2>
                  <div className="space-y-4">
                    {service.faq.map((item, i) => (
                      <div key={i} className="glass-card">
                        <h4 className="font-bold mb-2 text-white">{item.q}</h4>
                        <p className="text-gray-400 text-sm">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Articles Section */}
              {relatedArticlesData.length > 0 && (
                <section className="pt-16 border-t border-white/10">
                  <h2 className="text-3xl font-heading font-bold mb-10 italic">
                    {t('related_articles')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedArticlesData.map((article, idx) => (
                      <BlogCard
                        key={article.slug}
                        index={idx}
                        locale={locale}
                        {...article}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Sidebar Lead Gen */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl">
                  <h3 className="text-2xl font-heading font-bold mb-6">{t('get_quote')}</h3>
                  <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                    {t('quote_desc')}
                  </p>
                  <LeadForm />
                </div>

                <div className="mt-8 glass-card">
                  <h4 className="font-bold mb-4">{t('need_help')}</h4>
                  <p className="text-sm text-gray-400 mb-6">{t('free_cons_desc')}</p>
                  <a href="tel:+38349771673" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-primary/50 text-primary font-bold hover:bg-primary/10 transition-all">
                    <FaTools /> +383 49 771 673
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
