import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['sq', 'en'],
  defaultLocale: 'sq',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/about': {
      sq: '/rreth-nesh',
      en: '/about'
    },
    '/contact': {
      sq: '/kontakt',
      en: '/contact'
    },
    '/faq': {
      sq: '/faq',
      en: '/faq'
    },
    '/portfolio': {
      sq: '/portofolio',
      en: '/portfolio'
    },
    '/blog': {
      sq: '/blogu',
      en: '/blog'
    },
    '/blog/[slug]': {
      sq: '/blogu/[slug]',
      en: '/blog/[slug]'
    },
    '/services': {
      sq: '/sherbimet',
      en: '/services'
    },
    '/services/[slug]': {
      sq: '/sherbimet/[slug]',
      en: '/services/[slug]'
    },
    '/locations/[slug]': {
      sq: '/elektricist-[slug]',
      en: '/electrician-[slug]'
    },
    '/privacy-policy': {
      sq: '/politika-privatesise',
      en: '/privacy-policy'
    },
    '/terms-of-service': {
      sq: '/kushtet-e-perdorimit',
      en: '/terms-of-service'
    },
    '/cookie-policy': {
      sq: '/politika-kukis',
      en: '/cookie-policy'
    },
  }
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
