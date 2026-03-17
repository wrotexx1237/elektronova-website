'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import {FaFacebook, FaInstagram, FaWhatsapp, FaPhone} from 'react-icons/fa';
import {useState, useEffect} from 'react';
import {clsx} from 'clsx';

export default function Header() {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-heading font-bold tracking-tighter">
          ELEKTRO<span className="text-primary">NOVA</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">{t('home')}</Link>
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">{t('services')}</Link>
          <Link href="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">{t('portfolio')}</Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">{t('blog')}</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">{t('contact')}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
            <a href="https://www.facebook.com/profile.php?id=61578235817414" target="_blank" className="text-gray-400 hover:text-primary transition-colors"><FaFacebook /></a>
            <a href="https://www.instagram.com/elektronova_" target="_blank" className="text-gray-400 hover:text-primary transition-colors"><FaInstagram /></a>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
