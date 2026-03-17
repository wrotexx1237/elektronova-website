import { servicesData, getServiceBySlug } from '@/data/services';
import { blogData, getArticleBySlug } from '@/data/blog';
import { locationsData, getLocationBySlug } from '@/data/locations';
import { getPathname } from '@/i18n/routing';

interface SchemaProps {
  locale: string;
  type?: 'home' | 'service' | 'blog' | 'location' | 'other';
  slug?: string;
}

export default function Schema({ locale, type, slug }: SchemaProps) {
  const baseUrl = 'https://elektronova.online';
  const schemas: any[] = [];

  // 1. LocalBusiness (Always present)
  const localBusiness = {
    "@type": "LocalBusiness",
    "name": "ElektroNova",
    "image": `${baseUrl}/logo.png`,
    "@id": `${baseUrl}/${locale}`,
    "url": `${baseUrl}/${locale}`,
    "telephone": "+38349771673",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Haxhi Muzlija nr 48",
      "addressLocality": "Peja",
      "postalCode": "30000",
      "addressCountry": "XK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 42.6629,
      "longitude": 20.2922
    },
    "areaServed": {
      "@type": "Country",
      "name": "Kosovo"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "16:00"
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578235817414",
      "https://www.instagram.com/elektronova_"
    ]
  };
  schemas.push(localBusiness);

  // 2. BreadcrumbList
  const breadcrumbs: any[] = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": locale === 'sq' ? 'Ballina' : 'Home',
      "item": `${baseUrl}/${locale}`
    }
  ];

  if (type === 'service' && slug) {
    const service = getServiceBySlug(slug, locale);
    if (service) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": service.title,
        "item": `${baseUrl}${getPathname({ locale, href: { pathname: '/services/[slug]', params: { slug } } as any })}`
      });

      // Service Schema
      schemas.push({
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "provider": { "@id": `${baseUrl}/${locale}` },
        "areaServed": "Kosovo",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": service.title,
          "itemListElement": service.benefits.map((b) => ({
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": b }
          }))
        }
      });

      // FAQ Schema for Service
      if (service.faq && service.faq.length > 0) {
        schemas.push({
          "@type": "FAQPage",
          "mainEntity": service.faq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        });
      }
    }
  } else if (type === 'blog' && slug) {
    const post = getArticleBySlug(slug, locale);
    if (post) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": post.title,
        "item": `${baseUrl}${getPathname({ locale, href: { pathname: '/blog/[slug]', params: { slug } } as any })}`
      });

      // BlogPosting Schema
      schemas.push({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.mainImage.startsWith('http') ? post.mainImage : `${baseUrl}${post.mainImage}`,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author,
          "url": `${baseUrl}/${locale}/about`
        },
        "publisher": { "@id": `${baseUrl}/${locale}` },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}${getPathname({ locale, href: { pathname: '/blog/[slug]', params: { slug } } as any })}`
        }
      });
    }
  } else if (type === 'location' && slug) {
    const location = getLocationBySlug(slug, locale);
    if (location) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": location.title,
        "item": `${baseUrl}${getPathname({ locale, href: `/locations/${slug}` as any })}`
      });

      // LocalBusiness variation for specific city
      schemas.push({
        "@type": "LocalBusiness",
        "name": `ElektroNova ${location.city}`,
        "description": location.description,
        "image": `${baseUrl}/logo.png`,
        "url": `${baseUrl}${getPathname({ locale, href: `/locations/${slug}` as any })}`,
        "telephone": "+38349771673",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location.city,
          "addressCountry": "XK"
        }
      });
    }
  }

  schemas.push({
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": schemas
        })
      }}
    />
  );
}
