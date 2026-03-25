import { NextResponse } from 'next/server';
import { servicesData } from '@/data/services';
import { getPathname } from '@/i18n/routing';

const baseUrl = 'https://elektronova.online';

export async function GET() {
  const locales = ['sq', 'en'] as const;
  const now = new Date().toISOString();
  
  let urls = '';

  locales.forEach((locale) => {
    Object.values(servicesData[locale] || {}).forEach((service) => {
      const slug = service.slug;
      const urlPath = getPathname({
        locale,
        // @ts-ignore
        href: { pathname: '/services/[slug]', params: { slug } }
      });
      const fullUrl = `${baseUrl}${urlPath}`;
      
      urls += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
