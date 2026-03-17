'use client';

import {useTranslations} from 'next-intl';
import {useState, useRef} from 'react';
import {Link} from '@/i18n/routing';
import {clsx} from 'clsx';
import {sendLeadEmail} from '@/app/actions/email';

export default function LeadForm() {
  const t = useTranslations('Common');
  const tCompliance = useTranslations('Compliance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    };

    const result = await sendLeadEmail(data);

    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(t('error_message'));
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-primary/30 p-8 rounded-2xl text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-heading font-bold mb-4 text-white">{t('success_title')}</h3>
        <p className="text-gray-400">{t('success_message')}</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-primary font-bold hover:underline transition-all"
        >
          {t('send_another')}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('name')}</label>
          <input 
            name="name"
            type="text" 
            required 
            placeholder="Filan Fisteku"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('phone')}</label>
          <input 
            name="phone"
            type="tel" 
            required 
            placeholder="+383 -- --- ---"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{t('email')}</label>
        <input 
          name="email"
          type="email" 
          required 
          placeholder="shembull@email.com"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Qyteti</label>
          <select name="city" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white">
            <option value="" className="bg-background">Zgjidhni qytetin...</option>
            <option value="Pejë" className="bg-background">Pejë</option>
            <option value="Prishtinë" className="bg-background">Prishtinë</option>
            <option value="Gjakovë" className="bg-background">Gjakovë</option>
            <option value="Prizren" className="bg-background">Prizren</option>
            <option value="Mitrovicë" className="bg-background">Mitrovicë</option>
            <option value="Ferizaj" className="bg-background">Ferizaj</option>
            <option value="Gjilan" className="bg-background">Gjilan</option>
            <option value="Istog" className="bg-background">Istog</option>
            <option value="Deçan" className="bg-background">Deçan</option>
            <option value="Klinë" className="bg-background">Klinë</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Shërbimi Interesuar</label>
          <select name="service" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-white">
            <option value="" className="bg-background">Zgjidhni shërbimin...</option>
            <option value="Instalimi i Kamerave" className="bg-background">Instalimi i Kamerave</option>
            <option value="Sistemet e Alarmit" className="bg-background">Sistemet e Alarmit</option>
            <option value="Instalime Elektrike" className="bg-background">Instalime Elektrike</option>
            <option value="Smart Home" className="bg-background">Smart Home</option>
            <option value="Rrjete & Internet" className="bg-background">Rrjete & Internet</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{t('message')}</label>
        <textarea 
          name="message"
          rows={4}
          required
          placeholder="Përshkruani kërkesën tuaj këtu..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all resize-none text-white"
        ></textarea>
      </div>

      <div className="flex items-start gap-3 py-2">
        <input 
          type="checkbox" 
          id="privacy-consent"
          required
          className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
        />
        <label htmlFor="privacy-consent" className="text-xs text-gray-400 leading-relaxed cursor-pointer hover:text-gray-300 transition-colors">
          {tCompliance('form_notice').split('[privacy_policy]')[0]}
          <Link href="/privacy-policy" className="text-primary hover:underline font-bold">
            {tCompliance('privacy_title')}
          </Link>
          {tCompliance('form_notice').split('[privacy_policy]')[1]}
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={clsx(
          "btn-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-3 transition-all",
          isSubmitting && "opacity-70 cursor-not-allowed scale-[0.98]"
        )}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {t('sending')}
          </>
        ) : t('quote')}
      </button>
    </form>
  );
}
