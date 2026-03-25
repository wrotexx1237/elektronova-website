import { notFound } from 'next/navigation';
import { getArticleBySlug, blogData, getAlternateBlogSlug } from '@/data/blog';
import { FaCalendarAlt, FaUser, FaClock, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { Link } from '@/i18n/routing';
import LeadForm from '@/components/LeadForm';
import { getTranslations } from 'next-intl/server';
import ShareButtons from '@/components/ShareButtons';
import { getServiceBySlug, ServiceContent } from '@/data/services';
import ServiceCard from '@/components/ServiceCard';
import BlogCard from '@/components/BlogCard';

import { getPathname } from '@/i18n/routing';
import Schema from '@/components/Schema';

export async function generateStaticParams() {
  const locales = ['sq', 'en'];
  const params: { locale: string; slug: string }[] = [];

  locales.forEach(locale => {
    Object.values(blogData[locale] || {}).forEach(article => {
      params.push({ locale, slug: article.slug });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug, locale);
  if (!article) return {};

  const baseUrl = 'https://elektronova.online';
  const pathname = getPathname({ locale, href: { pathname: '/blog/[slug]', params: { slug } } as any });

  const alternates: Record<string, string> = {};
  ['sq', 'en'].forEach((l) => {
    const alternateSlug = l === locale ? slug : getAlternateBlogSlug(slug);
    alternates[l] = `${baseUrl}${getPathname({ locale: l, href: { pathname: '/blog/[slug]', params: { slug: alternateSlug } } as any })}`;
  });

  return {
    title: `ElektroNova | ${article.title}`,
    description: article.excerpt,
    alternates: {
      canonical: `${baseUrl}${pathname}`,
      languages: alternates,
    }
  };
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const article = getArticleBySlug(slug, locale);

  if (!article) notFound();

  // We can't use window.location.href on server, so we construct it
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://elektronova.online';
  // Use the localized path based on the routing configuration
  const blogPath = locale === 'sq' ? 'blogu' : 'blog';
  const shareUrl = `${baseUrl}/${locale}/${blogPath}/${slug}`;

  // Fetch related services
  const relatedServicesData = (article.relatedServices || [])
    .map(serviceSlug => getServiceBySlug(serviceSlug, locale))
    .filter((service): service is ServiceContent => service !== undefined);

  // Fetch related articles (excluding the current one)
  const allArticles = Object.values(blogData[locale] || {});
  const relatedArticles = allArticles
    .filter(a => a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <Schema locale={locale} type="blog" slug={slug} />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-8 hover:translate-x-1 transition-transform">
              <FaArrowLeft /> {t('back_to_blog')}
            </Link>

            <div className="mb-10">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 uppercase tracking-widest">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">{article.category}</span>
                <span className="flex items-center gap-1"><FaCalendarAlt /> {article.date}</span>
                <span className="flex items-center gap-1"><FaClock /> {article.readTime}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FaUser />
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">{article.author}</span>
                  <span className="text-xs uppercase">{t('security_expert')}</span>
                </div>
              </div>
            </div>

            <div className="glass-card mb-12 p-0 overflow-hidden aspect-video relative group">
              <img
                src={article.mainImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg pb-20">
              <p className="text-xl font-medium text-white italic border-l-4 border-primary pl-6 mb-12">
                {article.excerpt}
              </p>
              <div
                className="rich-content space-y-8"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Related Services Section */}
            {relatedServicesData.length > 0 && (
              <div className="mt-20 pt-20 border-t border-white/10">
                <h3 className="text-3xl font-heading font-bold mb-12 italic text-center md:text-left">
                  {t('related_services')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedServicesData.map((service, idx) => (
                    <ServiceCard
                      key={service.slug}
                      index={idx}
                      title={service.title}
                      description={service.description}
                      iconName={service.iconName}
                      href={`/services/${service.slug}` as any}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="mt-20 pt-20 border-t border-white/10">
                <h3 className="text-3xl font-heading font-bold mb-12 italic text-center md:text-left">
                  {t('related_articles') || 'Te Ngjashme / Related'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((relatedArticle, idx) => (
                    <BlogCard
                      key={relatedArticle.slug}
                      slug={relatedArticle.slug}
                      title={relatedArticle.title}
                      excerpt={relatedArticle.excerpt}
                      mainImage={relatedArticle.mainImage}
                      date={relatedArticle.date}
                      readTime={relatedArticle.readTime}
                      index={idx}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Social Share & Lead Gen */}
            <div className="mt-16 pt-16 border-t border-white/10">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-grow">
                  <h4 className="text-2xl font-heading font-bold mb-8 italic">{t('questions_title')}</h4>
                  <div className="bg-card/50 p-8 rounded-3xl border border-white/5">
                    <LeadForm />
                  </div>
                </div>
                <div className="w-full md:w-64 sticky top-32">
                  <ShareButtons
                    url={shareUrl}
                    title={article.title}
                    shareLabel={t('share')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
