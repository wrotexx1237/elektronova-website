import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {FaQuestionCircle, FaChevronRight} from 'react-icons/fa';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  return {
    title: `FAQ - Pyetjet e Shpeshta | ElektroNova`,
    description: "Gjeni përgjigje për të gjitha pyetjet tuaja në lidhje me instalimin e kamerave, sistemeve të alarmit dhe shërbimeve tona elektrike në Kosovë."
  };
}

export default function FAQPage() {
  const t = useTranslations('FAQPage');

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') }
  ];

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <FaQuestionCircle className="text-6xl text-primary mx-auto mb-6 opacity-50" />
          <h1 className="text-5xl font-heading font-bold mb-4">{t('title_main')} <span className="text-primary">{t('title_highlight')}</span></h1>
          <p className="text-gray-400 text-lg">{t('description')}</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card group hover:border-primary/50 transition-all p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-primary">0{idx + 1}.</span> {faq.q}
              </h3>
              <p className="text-gray-400 leading-relaxed pl-10 border-l border-primary/20">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-20 p-12 rounded-3xl bg-primary/5 border border-primary/20 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">{t('not_found_title')}</h2>
          <p className="text-gray-400 mb-8">{t('not_found_desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8">{t('contact_us')}</Link>
            <a href="https://wa.me/38349771673" className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-semibold flex items-center justify-center gap-2">
              {t('whatsapp')}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
