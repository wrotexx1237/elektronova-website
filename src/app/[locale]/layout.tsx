import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { FaCamera, FaShieldAlt, FaBolt, FaNetworkWired, FaHome } from 'react-icons/fa';
import { Inter, Outfit } from 'next/font/google';
import "../globals.css";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import CookieBanner from '@/components/CookieBanner';
import Schema from '@/components/Schema';
import { headers } from 'next/headers';
import { getPathname } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '/';
  const baseUrl = 'https://elektronova.online';

  // Normalize pathname: remove locale prefix
  const cleanPath = pathname.replace(/^\/(sq|en)/, '') || '/';

  // Identify the internal route template and slug for dynamic routes
  let template: any = '/';
  let routeParams: any = {};

  if (cleanPath.startsWith('/sherbimet/') || cleanPath.startsWith('/services/')) {
    template = '/services/[slug]';
    routeParams = { slug: cleanPath.split('/').pop() };
  } else if (cleanPath.startsWith('/blogu/') || cleanPath.startsWith('/blog/')) {
    template = '/blog/[slug]';
    routeParams = { slug: cleanPath.split('/').pop() };
  } else if (cleanPath.includes('elektricist-') || cleanPath.includes('electrician-')) {
    template = '/locations/[slug]';
    const lastPart = cleanPath.split('/').pop() || '';
    const slug = lastPart.replace('elektricist-', '').replace('electrician-', '');
    routeParams = { slug };
  } else if (cleanPath === '/rreth-nesh' || cleanPath === '/about') {
    template = '/about';
  } else if (cleanPath === '/kontakt' || cleanPath === '/contact') {
    template = '/contact';
  } else if (cleanPath === '/portofolio' || cleanPath === '/portfolio') {
    template = '/portfolio';
  }

  const alternates: Record<string, string> = {};
  routing.locales.forEach((l) => {
    try {
      const localizedPath = getPathname({
        locale: l,
        href: Object.keys(routeParams).length > 0
          ? { pathname: template, params: routeParams }
          : template
      });
      alternates[l] = `${baseUrl}${localizedPath}`;
    } catch (e) {
      alternates[l] = `${baseUrl}/${l}${cleanPath}`;
    }
  });

  return {
    alternates: {
      canonical: alternates[locale],
      languages: {
        ...alternates,
        'x-default': alternates['sq']
      },
    }
  };
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '/';

  // Normalize pathname to get the internal route template
  let internalPath = pathname;
  routing.locales.forEach(l => {
    if (pathname.startsWith(`/${l}/`)) {
      internalPath = pathname.replace(`/${l}`, '') || '/';
    } else if (pathname === `/${l}`) {
      internalPath = '/';
    }
  });

  return (
    <html lang={locale} className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-background text-foreground scroll-smooth">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <StickyCTA />
            <CookieBanner />
            <Schema
              locale={locale}
              type={
                pathname.includes('/sherbimet/') || pathname.includes('/services/') ? 'service' :
                  pathname.includes('/blogu/') || pathname.includes('/blog/') ? 'blog' :
                    pathname.includes('elektricist-') || pathname.includes('electrician-') ? 'location' :
                      internalPath === '/' ? 'home' : 'other'
              }
              slug={pathname.split('/').pop()?.replace(/^(elektricist-|electrician-)/, '')}
            />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
