import { MetadataRoute } from 'next';
import { servicesData } from '@/data/services';
import { locationsData } from '@/data/locations';
import { blogData } from '@/data/blog';
import { getPathname } from '@/i18n/routing';

const baseUrl = 'https://elektronova.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['sq', 'en'] as const;

  // Static pages (keys from routing.ts)
  const staticPages = [
    '/',
    '/about',
    '/services',
    '/portfolio',
    '/blog',
    '/contact',
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy'
  ] as const;

  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Static Routes
    staticPages.forEach((page) => {
      routes.push({
        url: `${baseUrl}${getPathname({ locale, href: page as any })}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: page === '/' ? 1 : 0.8,
      });
    });

    // Dynamic Service Pages
    Object.keys(servicesData[locale] || {}).forEach((slug) => {
      // Check if there's a specific route for this service
      const specificPath = `/services/${slug}`;
      routes.push({
        url: `${baseUrl}${getPathname({
          locale,
          // @ts-ignore
          href: specificPath
        })}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    });

    // Dynamic Location Pages
    Object.keys(locationsData[locale] || {}).forEach((slug) => {
      const specificPath = `/locations/${slug}`;
      routes.push({
        url: `${baseUrl}${getPathname({
          locale,
          // @ts-ignore
          href: specificPath
        })}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    });

    // Dynamic Blog Pages
    Object.keys(blogData[locale] || {}).forEach((slug) => {
      routes.push({
        url: `${baseUrl}${getPathname({
          locale,
          // @ts-ignore - pathname matches routing.ts
          href: { pathname: '/blog/[slug]', params: { slug } }
        })}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      });
    });
  });

  return routes;
}
