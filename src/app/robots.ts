import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Placeholder for future routes
    },
    sitemap: 'https://elektronova.online/sitemap.xml',
  };
}
