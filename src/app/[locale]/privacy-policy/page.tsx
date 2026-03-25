import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

import { getPathname } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Compliance'});

  const baseUrl = 'https://elektronova.online';
  const pathname = getPathname({ locale, href: '/privacy-policy' as any });

  const alternates: Record<string, string> = {};
  ['sq', 'en'].forEach((l) => {
    alternates[l] = `${baseUrl}${getPathname({ locale: l, href: '/privacy-policy' as any })}`;
  });

  return {
    title: `Politika e Privatësisë - Privacy Policy | ElektroNova`,
    description: "Politika jonë e privatësisë në lidhje me të dhënat tuaja dhe sistemet e instaluara.",
    alternates: {
      canonical: alternates[locale] || `${baseUrl}${pathname}`,
      languages: alternates,
    }
  };
}

export default function PrivacyPolicy() {
  const t = useTranslations('Compliance');

  const sections = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-heading font-bold mb-10 text-white">
          {t('privacy_title').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{t('privacy_title').split(' ').pop()}</span>
        </h1>
        
        <div className="glass-card space-y-8 text-gray-400 leading-relaxed shadow-2xl border-white/5">
          <p className="border-b border-white/5 pb-6 text-sm italic">
            {t('last_updated')}
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section} className="border-l-2 border-primary/20 pl-6 hover:border-primary transition-colors">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  {t(`privacy_sections.${section}_title`)}
                </h2>
                <p className="text-gray-400">
                  {t(`privacy_sections.${section}_content`)}
                </p>
              </section>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
             <p>Endrit Smajli - ElektroNova</p>
             <a href="mailto:endritsmajlib@gmail.com" className="text-primary hover:underline transition-all">
               endritsmajlib@gmail.com
             </a>
          </div>
        </div>
      </div>
    </main>
  );
}
