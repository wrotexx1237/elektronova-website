import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import LeadForm from '@/components/LeadForm';
import {FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock} from 'react-icons/fa';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Navigation'});
  return {
    title: `ElektroNova | ${t('contact')}`,
    description: "Kontaktoni ElektroNova për shërbimet e sigurisë dhe instalimeve elektrike. Ne jemi këtu për t'ju shërbyer në të gjithë Kosovën."
  };
}

export default function ContactPage() {
  const t = useTranslations('Contact');
  const tNav = useTranslations('Navigation');

  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-heading font-bold mb-6">{t('title_main')} <span className="text-primary">{t('title_highlight')}</span></h1>
          <p className="text-gray-400 text-lg">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary" /> {t('office_title')}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Haxhi Muzlija nr 48<br />
                30000 Pejë, Kosovë
              </p>
              <a 
                href="https://share.google/aJd3GblNPW2lUtI2u" 
                target="_blank" 
                className="text-primary text-sm font-bold mt-4 inline-block hover:underline"
              >
                {t('google_maps')}
              </a>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FaPhone className="text-primary" /> {t('contact_details')}
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <FaPhone className="text-primary" /> +383 49 771 673
                </li>
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="text-[#25D366]" /> +383 49 771 673
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" /> endritsmajlib@gmail.com
                </li>
              </ul>
            </div>

            <div className="glass-card">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FaClock className="text-primary" /> {t('hours_title')}
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>{tNav('mon_fri')}:</span>
                  <span className="text-white">08:00 – 16:00</span>
                </li>
                <li className="flex justify-between pt-2">
                  <span>{tNav('sat_sun')}:</span>
                  <span className="text-red-500 font-bold">{tNav('closed')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 relative">
             <div className="absolute -inset-4 bg-primary/10 blur-[80px] rounded-3xl z-0 pointer-events-none"></div>
             <div className="relative z-10 bg-card/50 backdrop-blur-xl p-10 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-heading font-bold mb-8 italic">{t('send_message')} <span className="text-primary">{t('message_highlight')}</span></h2>
                <LeadForm />
             </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-20 h-96 rounded-3xl bg-card border border-white/5 overflow-hidden relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.3290921303611!2d20.398724!3d42.6463212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135303bdea8ec825%3A0x48d3727ed687d190!2s48%20Haxhi%20Muzlia%2C%20Pej%C3%AB%2030000!5e0!3m2!1ssq!2sxk!4v1710640000000!5m2!1ssq!2sxk" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-700"
          ></iframe>
        </div>
      </div>
    </main>
  );
}
