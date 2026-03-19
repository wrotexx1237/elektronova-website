'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import {FaFacebook, FaInstagram, FaBars, FaTimes} from 'react-icons/fa';
import {useState, useEffect} from 'react';
import {clsx} from 'clsx';

export default function Header() {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isMenuOpen ? 'bg-background/80 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] border-b border-white/10 py-3' : 'bg-transparent py-5'
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-heading font-bold tracking-tighter"
            onClick={() => setIsMenuOpen(false)}
          >
            ELEKTRO<span className="text-primary">NOVA</span>
          </Link>

          {/* Desktop Navigation */}
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
              <a href="https://www.facebook.com/profile.php?id=61578235817414" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook"><FaFacebook aria-hidden="true" /></a>
              <a href="https://www.instagram.com/elektronova_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram"><FaInstagram aria-hidden="true" /></a>
            </div>
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Outside header for absolute solid background */}
      <div className={clsx(
        'fixed inset-0 bg-[#000000] z-[9999] md:hidden transition-all duration-500 transform-gpu',
        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      )}>
        {/* Subtle decorative elements for premium feel */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,123,255,0.15),transparent)] pointer-events-none" />
        
        <nav className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 text-center px-6">
          <div className="flex flex-col gap-6 w-full max-w-xs">
            <Link 
              href="/"
              className="text-4xl font-heading font-black tracking-tighter text-white active:text-primary transition-colors flex items-center justify-center gap-4 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {t('home')}
            </Link>
            <Link 
              href="/services"
              className="text-4xl font-heading font-black tracking-tighter text-white active:text-primary transition-colors flex items-center justify-center gap-4 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {t('services')}
            </Link>
            <Link 
              href="/portfolio"
              className="text-4xl font-heading font-black tracking-tighter text-white active:text-primary transition-colors flex items-center justify-center gap-4 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {t('portfolio')}
            </Link>
            <Link 
              href="/blog"
              className="text-4xl font-heading font-black tracking-tighter text-white active:text-primary transition-colors flex items-center justify-center gap-4 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {t('blog')}
            </Link>
            <Link 
              href="/contact"
              className="text-4xl font-heading font-black tracking-tighter text-white active:text-primary transition-colors flex items-center justify-center gap-4 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {t('contact')}
            </Link>
          </div>

          {/* CTA & Socials Section */}
          <div className="mt-12 w-full max-w-xs p-8 rounded-3xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/45 mb-8 font-black">Kontakti & Rrjetet Sociale</p>
            
            <div className="flex justify-center gap-10 mb-10">
              <a href="https://www.facebook.com/profile.php?id=61578235817414" target="_blank" rel="noopener noreferrer" className="text-3xl text-white/60 hover:text-primary transition-transform hover:scale-110 active:scale-90" aria-label="Facebook"><FaFacebook aria-hidden="true" /></a>
              <a href="https://www.instagram.com/elektronova_" target="_blank" rel="noopener noreferrer" className="text-3xl text-white/60 hover:text-primary transition-transform hover:scale-110 active:scale-90" aria-label="Instagram"><FaInstagram aria-hidden="true" /></a>
            </div>

            <a 
              href="https://wa.me/38349771673" 
              className="group flex items-center justify-center gap-3 w-full bg-primary py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-[0_10px_25px_rgba(0,123,255,0.3)] hover:shadow-[0_15px_35px_rgba(0,123,255,0.5)] transition-all active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              WhatsApp Us <span>→</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
