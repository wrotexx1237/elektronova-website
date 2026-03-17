import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {blogData} from '@/data/blog';
import {Link} from '@/i18n/routing';
import {FaCalendarAlt, FaUser, FaClock, FaArrowRight} from 'react-icons/fa';
import BlogCard from '@/components/BlogCard';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  return {
    title: `ElektroNova | ${t('blog')}`,
    description: (await getTranslations({locale, namespace: 'Blog'}))('meta_description')
  };
}

export default async function BlogListingPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const blogT = await getTranslations({locale, namespace: 'Blog'});
  const articles = Object.values(blogData[locale as keyof typeof blogData] || {});

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl font-heading font-bold mb-6">
            {blogT.rich('title', {
              highlight: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </h1>
          <p className="text-gray-400 text-lg">
            {blogT('subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <BlogCard 
              key={article.slug}
              slug={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              mainImage={article.mainImage}
              date={article.date}
              readTime={article.readTime}
              index={index}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
