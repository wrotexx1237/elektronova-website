'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FaBolt } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Hero = () => {
  const t = useTranslations('Index');
  const nav = useTranslations('Navigation');
  const common = useTranslations('Common');

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#050505]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Glow Following Mouse */}
        <motion.div 
          className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] opacity-30"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 200, mass: 0.5 }}
        />
        
        {/* Stationary Accent Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        {/* Scanning Line Effect */}
        <motion.div 
           className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[100px] w-full z-0 pointer-events-none"
           animate={{ y: ['-100%', '1000%'] }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] brightness-100 contrast-150"></div>

        {/* Moving Particles/Glows */}
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.2, 0.1],
           }}
           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[180px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Badge */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="inline-block py-1.5 px-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-8 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,123,255,0.1)] backdrop-blur-sm">
            {t('hero_badge')}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-[1.05] tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.rich('hero_h1', {
            gradient: (chunks) => (
              <span className="relative inline-block">
                <span className="text-gradient drop-shadow-[0_0_25px_rgba(0,123,255,0.4)]">{chunks}</span>
              </span>
            ),
            br: () => <br className="hidden md:block" />
          })}
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {t('hero_p')}
        </motion.p>

        {/* Actions */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
        >
          <Link 
            href="/services" 
            className="btn-primary w-full sm:w-auto px-12 py-5 text-xl relative group overflow-hidden flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <span className="relative z-10">
              {nav('services')}
            </span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="relative z-10"
            >
              →
            </motion.span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link 
            href="/contact" 
            className="group flex items-center gap-5 text-white text-lg font-bold hover:text-primary transition-all duration-300"
          >
            <span className="border-b-2 border-white/10 group-hover:border-primary pb-1 transition-all duration-300">
              {common('quote')}
            </span>
            <div className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:rotate-[15deg] transition-all duration-500 shadow-2xl backdrop-blur-md">
              <FaBolt className="text-primary text-xl group-hover:scale-125 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Floating Elements / Tech Details */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-20 hidden md:block">
         <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white flex justify-center p-2"
         >
            <div className="w-1 h-2 bg-white rounded-full"></div>
         </motion.div>
      </div>
    </section>
  );
};

export default Hero;
