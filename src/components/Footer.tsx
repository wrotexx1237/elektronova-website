'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt} from 'react-icons/fa';

export default function Footer() {
  const t = useTranslations('Navigation');
  
  return (
    <footer className="bg-card border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 md:col-span-3">
            <Link href="/" className="text-2xl font-heading font-bold tracking-tighter mb-6 block">
              ELEKTRO<span className="text-primary">NOVA</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61578235817414" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all"><FaFacebook /></a>
              <a href="https://www.instagram.com/elektronova_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all"><FaInstagram /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6">{t('quick_links')}</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors">{t('home')}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-primary transition-colors">{t('services')}</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-primary transition-colors">{t('portfolio')}</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6">{t('locations')}</h4>
            <ul className="space-y-4">
              {[
                'prishtine', 'prizren', 'peje', 'ferizaj', 
                'gjilan', 'mitrovice', 'gjakove', 'fushe-kosove'
              ].map((slug) => (
                <li key={slug}>
                  <Link href={`/locations/${slug}` as any} className="text-gray-400 hover:text-primary transition-colors">
                    {useTranslations('Cities')(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6">{t('contact_us')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-primary" />
                <span>Haxhi Muzlija nr 48, Peja, Kosovo</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary" />
                <span>+383 49 771 673</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <span>endritsmajlib@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-heading font-bold mb-6">{t('working_hours')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex justify-between">
                <span>{t('mon_fri')}:</span>
                <span className="text-white">08:00 – 16:00</span>
              </li>
              <li className="flex justify-between">
                <span>{t('sat_sun')}:</span>
                <span className="text-red-500">{t('closed')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ElektroNova. {t('rights')}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">{t('privacy_policy')}</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">{t('terms_of_service')}</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              {useTranslations('Compliance')('cookie_title')}
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
              className="hover:text-white transition-colors underline decoration-primary/30 underline-offset-4"
            >
              {useTranslations('Compliance')('manage_cookies')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
