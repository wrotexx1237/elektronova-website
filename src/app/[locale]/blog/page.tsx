import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {blogData} from '@/data/blog';
import {Link} from '@/i18n/routing';
import {FaCalendarAlt, FaUser, FaClock, FaArrowRight} from 'react-icons/fa';
import BlogCard from '@/components/BlogCard';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  const baseUrl = 'https://elektronova.online';
  
  const alternates: Record<string, string> = {
    sq: `${baseUrl}/sq/blogu`,
    en: `${baseUrl}/en/blog`
  };

  return {
    title: `ElektroNova | ${t('blog')}`,
    description: (await getTranslations({locale, namespace: 'Blog'}))('meta_description'),
    alternates: {
      canonical: `${baseUrl}${locale === 'sq' ? '/sq/blogu' : '/en/blog'}`,
      languages: alternates
    }
  };
}

export default async function BlogListingPage({
  params,
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const blogT = await getTranslations({locale, namespace: 'Blog'});
  
  const allArticles = Object.values(blogData[locale as keyof typeof blogData] || {});
  
  // Filtering
  const categoryFilter = typeof sp?.category === 'string' ? sp.category : null;
  const categories = Array.from(new Set(allArticles.map(a => a.category)));
  
  let filteredArticles = allArticles;
  if (categoryFilter) {
    filteredArticles = filteredArticles.filter(a => a.category === categoryFilter);
  }

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const currentPage = typeof sp?.page === 'string' ? parseInt(sp.page, 10) : 1;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl font-heading font-bold mb-6">
            {blogT.rich('title', {
              highlight: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </h1>
          <p className="text-gray-400 text-lg">
            {blogT('subtitle')}
          </p>
        </div>

        {/* Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-16">
            <Link 
              href="/blog" 
              className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${
                !categoryFilter 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              Të gjitha / All
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                href={{ pathname: '/blog', query: { category: cat } } as any}
                className={`px-6 py-2 rounded-full border text-sm font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentArticles.map((article, index) => (
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

         {/* Empty State */}
         {currentArticles.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-2xl text-white italic">No articles found in this category.</h3>
            <Link href="/blog" className="text-primary mt-4 inline-block hover:underline">
              Clear filters
            </Link>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-20">
            {currentPage > 1 && (
              <Link 
                href={{ pathname: '/blog', query: { ...(categoryFilter ? { category: categoryFilter } : {}), page: (currentPage - 1).toString() } } as any}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                ←
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={{ pathname: '/blog', query: { ...(categoryFilter ? { category: categoryFilter } : {}), page: pageNum.toString() } } as any}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border font-bold text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            {currentPage < totalPages && (
              <Link 
                href={{ pathname: '/blog', query: { ...(categoryFilter ? { category: categoryFilter } : {}), page: (currentPage + 1).toString() } } as any}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
