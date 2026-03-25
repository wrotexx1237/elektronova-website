import {useTranslations} from 'next-intl';
import { getPathname } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Compliance'});

  const baseUrl = 'https://elektronova.online';
  const pathname = getPathname({ locale, href: '/cookie-policy' as any });

  const alternates: Record<string, string> = {};
  ['sq', 'en'].forEach((l) => {
    alternates[l] = `${baseUrl}${getPathname({ locale: l, href: '/cookie-policy' as any })}`;
  });

  return {
    title: `Politika e Kukis - Cookie Policy | ElektroNova`,
    description: "Si i përdorim cookies për të përmirësuar përvojën tuaj.",
    alternates: {
      canonical: alternates[locale] || `${baseUrl}${pathname}`,
      languages: alternates,
    }
  };
}

export default function CookiePolicy() {
  const t = useTranslations('Compliance');
  const cats = ['necessary', 'analytics', 'marketing'];

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold mb-10 text-white">
          {t('cookie_title').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t('cookie_title').split(' ').pop()}</span>
        </h1>
        
        <div className="glass-card space-y-8 text-gray-400 leading-relaxed shadow-2xl border-white/5">
          <p className="border-b border-white/5 pb-6 text-sm italic">
            {t('last_updated')}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 italic tracking-tighter">1. {t('categories.necessary').split(' ').pop()}?</h2>
            <p>
              {t('cookie_banner_desc')}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4 italic tracking-tighter">2. {t('cookie_title')}</h2>
            <div className="grid gap-6">
              {cats.map(cat => (
                <div key={cat} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {t(`categories.${cat}`)}
                  </h3>
                  <p className="text-sm">
                    {t(`categories.${cat}_desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 italic tracking-tighter">3. {t('customize')}</h2>
            <p>
              {t('categories.necessary_desc')}
            </p>
            <div className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-white">
              <p className="text-sm opacity-80">
                You can change your preferences at any time by clicking the "Manage Cookies" button in the footer of our website.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
