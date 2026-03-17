import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  return {
    title: `ElektroNova | ${t('about')}`,
    description: "Mësoni më shumë për ElektroNova, vizionin tonë për sigurinë dhe standardet tona profesionale in instalime elektrike."
  };
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'About'});

  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-heading font-bold mb-8 text-center">{t('title_main')} <span className="text-primary">{t('title_highlight')}</span></h1>
          
          <div className="glass-card mb-12 overflow-hidden border-none p-0">
             {/* Dynamic background effect for narrative */}
             <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/5 flex items-center justify-center">
                <span className="text-8xl font-black opacity-10 font-heading tracking-tighter uppercase select-none">ELEKTRONOVA</span>
             </div>
          </div>

          <div className="space-y-12 text-gray-300 leading-relaxed text-lg">
            <section>
              <h2 className="text-3xl font-heading font-bold text-white mb-6 underline decoration-primary decoration-4 underline-offset-8">{t('vision_title')}</h2>
              <p>
                {t('vision_p')}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary transition-all group">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{t('integrity_title')}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('integrity_p')}
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary transition-all group">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{t('innovation_title')}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('innovation_p')}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">{t('standards_title')}</h2>
              <p>
                {t('standards_p1')}
              </p>
              <p className="mt-4">
                {t('standards_p2')}
              </p>
            </section>

            <section className="bg-primary/5 border border-primary/20 p-12 rounded-3xl italic text-white text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 to-transparent opacity-30"></div>
               <p className="relative z-10 text-xl font-medium">
                 {t('quote_text')}
               </p>
            </section>

            <section>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">{t('geography_title')}</h2>
              <p>
                {t('geography_p1')}
              </p>
              <p className="mt-4">
                {t('geography_p2')}
              </p>
            </section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2025</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('stat_founded')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('stat_coverage')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('stat_support')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{t('stat_reliability')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
