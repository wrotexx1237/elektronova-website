import {useTranslations} from 'next-intl';
import { getPathname } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Compliance'});

  const baseUrl = 'https://elektronova.online';
  const pathname = getPathname({ locale, href: '/terms-of-service' as any });

  const alternates: Record<string, string> = {};
  ['sq', 'en'].forEach((l) => {
    alternates[l] = `${baseUrl}${getPathname({ locale: l, href: '/terms-of-service' as any })}`;
  });

  return {
    title: `Kushtet e Përdorimit - Terms of Service | ElektroNova`,
    description: "Kushtet e përdorimit të shërbimeve dhe platformës sonë.",
    alternates: {
      canonical: alternates[locale] || `${baseUrl}${pathname}`,
      languages: alternates,
    }
  };
}

export default function TermsOfService() {
  const t = useTranslations('Compliance');
  const sections = ['t1', 't2', 't3', 't4'];

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold mb-10 text-white">
          {t('terms_title').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t('terms_title').split(' ').pop()}</span>
        </h1>
        
        <div className="glass-card space-y-8 text-gray-400 leading-relaxed shadow-2xl border-white/5">
          <p className="border-b border-white/5 pb-6 text-sm italic">
            {t('last_updated')}
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section} className="border-l-2 border-primary/20 pl-6 hover:border-primary transition-colors">
                <h2 className="text-xl font-bold text-white mb-3">
                  {t(`terms_sections.${section}_title`)}
                </h2>
                <p className="">
                  {t(`terms_sections.${section}_content`)}
                </p>
              </section>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 text-sm">
             <p>© {new Date().getFullYear()} ElektroNova Sh.P.K. - Kosovo</p>
          </div>
        </div>
      </div>
    </main>
  );
}
