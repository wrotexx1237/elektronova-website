import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['sq', 'en'],
  defaultLocale: 'sq',
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
    // New Electrical Services
    '/services/electrical-installations': {
      sq: '/sherbimet/instalime-elektrike',
      en: '/services/electrical-installations'
    },
    '/services/electrical-repairs': {
      sq: '/sherbimet/riparime-elektrike',
      en: '/services/electrical-repairs'
    },
    '/services/electrical-rewiring': {
      sq: '/sherbimet/nderrim-instalimi-elektrik',
      en: '/services/electrical-rewiring'
    },
    '/services/lighting-installation': {
      sq: '/sherbimet/instalim-ndricimi',
      en: '/services/lighting-installation'
    },
    '/services/electrical-panels': {
      sq: '/sherbimet/panele-elektrike',
      en: '/services/electrical-panels'
    },
    '/services/electrical-maintenance': {
      sq: '/sherbimet/mirembajtje-elektrike-biznes',
      en: '/services/electrical-maintenance'
    },
    '/services/emergency-electrician': {
      sq: '/sherbimet/elektricist-urgjent',
      en: '/services/emergency-electrician'
    },
  }
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
