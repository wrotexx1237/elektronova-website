'use client';

import {FaWhatsapp, FaPhone} from 'react-icons/fa';

export default function StickyCTA() {
  return (
    <>
      {/* Scroll to Top / Floating WhatsApp for desktop/mobile */}
      <a 
        href="https://wa.me/38349771673" 
        target="_blank" 
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>

      {/* Sticky Mobile Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-white/10 p-4 flex gap-4">
        <a 
          href="tel:+38349771673" 
          className="flex-1 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 py-3 rounded-xl transition-all border border-white/10"
        >
          <FaPhone className="text-primary" />
          <span className="font-semibold text-sm uppercase tracking-wider">Thirr</span>
        </a>
        <a 
          href="https://wa.me/38349771673" 
          target="_blank"
          className="flex-[2] bg-primary hover:bg-primary-dark flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,123,255,0.4)]"
        >
          <FaWhatsapp className="text-white text-lg" />
          <span className="font-semibold text-sm uppercase tracking-wider">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
