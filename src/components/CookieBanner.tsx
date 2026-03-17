'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FaCookieBite, FaTimes, FaCog, FaCheck } from 'react-icons/fa';
import { clsx } from 'clsx';

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieBanner() {
  const t = useTranslations('Compliance');
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('elektronova-consent');
    if (!savedConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      try {
        setConsent(JSON.parse(savedConsent));
      } catch (e) {
        setIsVisible(true);
      }
    }

    // Listen for custom event to re-open
    const handleOpen = () => {
      setIsVisible(true);
      setIsCustomizing(true);
    };
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => window.removeEventListener('open-cookie-settings', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    const allConsent = { necessary: true, analytics: true, marketing: true };
    save(allConsent);
  };

  const handleRejectAll = () => {
    const minConsent = { necessary: true, analytics: false, marketing: false };
    save(minConsent);
  };

  const handleSaveCustom = () => {
    save(consent);
  };

  const save = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    localStorage.setItem('elektronova-consent', JSON.stringify(newConsent));
    setIsVisible(false);
    setIsCustomizing(false);
    // Reload or trigger event for analytics scripts to initialize
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: newConsent }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 md:p-8 border-primary/20 bg-card/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6">
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl shrink-0">
                <FaCookieBite />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{t('cookie_banner_title')}</h3>
                {!isCustomizing && (
                  <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                    {t('cookie_banner_desc')}
                  </p>
                )}
              </div>
            </div>
            {!isCustomizing && (
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {isCustomizing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 animate-in fade-in duration-300">
              {(['necessary', 'analytics', 'marketing'] as const).map((cat) => (
                <div 
                  key={cat} 
                  className={clsx(
                    "p-4 rounded-xl border transition-all cursor-pointer select-none",
                    consent[cat] ? "bg-primary/10 border-primary/40" : "bg-white/5 border-white/10 opacity-70"
                  )}
                  onClick={() => cat !== 'necessary' && setConsent({ ...consent, [cat]: !consent[cat] })}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-sm uppercase tracking-wider">{t(`categories.${cat}`)}</span>
                    <div className={clsx(
                      "w-5 h-5 rounded-md flex items-center justify-center border transition-all",
                      consent[cat] ? "bg-primary border-primary text-white" : "border-white/20"
                    )}>
                      {consent[cat] && <FaCheck size={10} />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {t(`categories.${cat}_desc`)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex gap-4 text-xs">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-primary underline transition-colors">
                {t('privacy_title')}
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-primary underline transition-colors">
                {t('cookie_title')}
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {!isCustomizing ? (
                <>
                  <button 
                    onClick={() => setIsCustomizing(true)}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <FaCog className="text-gray-400" /> {t('customize')}
                  </button>
                  <button 
                    onClick={handleRejectAll}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
                  >
                    {t('reject_all')}
                  </button>
                  <button 
                    onClick={handleAcceptAll}
                    className="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                  >
                    {t('accept_all')}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsCustomizing(false)}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all"
                  >
                    {t('reject_all').split(' ')[0]} {/* Back/Cancel logic */}
                  </button>
                  <button 
                    onClick={handleSaveCustom}
                    className="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all"
                  >
                    {t('save_preferences')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
