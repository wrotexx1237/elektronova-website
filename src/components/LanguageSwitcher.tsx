'use client';

import {useLocale} from 'next-intl';
import {routing, usePathname, useRouter} from '@/i18n/routing';
import {useTransition} from 'react';
import {useParams} from 'next/navigation';
import {clsx} from 'clsx';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onLocaleChange(nextLocale: string) {
    startTransition(() => {
      // Create a clean params object excluding the locale itself
      // We cast to any because useParams can return multiple types depending on context
      const currentParams = (params || {}) as any;
      const { locale: _, ...cleanParams } = currentParams;
      
      // FALLBACK: If we are on a dynamic route (like /blog/[slug]) but useParams() 
      // didn't return the slug (common in parent layouts), we try to extract it from the URL.
      if (pathname.includes('[slug]') && !cleanParams.slug) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        // The slug is typically the last segment in our defined routes
        if (segments.length > 0) {
          cleanParams.slug = segments[segments.length - 1];
        }
      }

      // Do the same for other dynamic parameters if they might exist
      if (pathname.includes('[id]') && !cleanParams.id) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          cleanParams.id = segments[segments.length - 1];
        }
      }

      router.replace(
        { pathname, params: cleanParams },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((cur) => (
        <button
          key={cur}
          className={clsx(
            'px-2 py-1 text-sm font-medium rounded transition-all uppercase',
            locale === cur 
              ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,123,255,0.5)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          )}
          disabled={isPending}
          onClick={() => onLocaleChange(cur)}
          aria-label={cur === 'sq' ? 'Kalo në Shqip' : 'Switch to English'}
        >
          {cur}
        </button>
      ))}
    </div>
  );
}
