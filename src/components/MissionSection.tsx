'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const Counter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);
    const target = parseInt(value.replace(/\D/g, ''));
    const suffix = value.replace(/\d/g, '');

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = target;
            const totalFrames = duration * 60;
            const increment = end / totalFrames;
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 1000 / 60);
            return () => clearInterval(timer);
        }
    }, [inView, target, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {count}{suffix}
        </span>
    );
};

export default function MissionSection() {
  const t = useTranslations('Index');
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax for Visual
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Scroll Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);

  return (
    <section ref={sectionRef} className="py-40 relative border-t border-white/5 bg-[#080808] overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.05),transparent_70%)]" />
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          
          {/* Visual Side with Mouse Parallax */}
          <motion.div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ y: scrollY, rotate: scrollRotate, scale: scrollScale, rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="order-2 lg:order-1 relative perspective-1000"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_80px_150px_rgba(0,0,0,0.9)] group">
                <motion.img 
                    src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80&fit=crop" 
                    alt="Professional electrician at work" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[3s] ease-out"
                />
                
                {/* HUD Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
                
                {/* Scanning Line */}
                <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-primary/40 blur-sm z-30 pointer-events-none"
                />

                {/* Floating HUD Elements */}
                <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-12 right-12 w-16 h-16 border-t-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-12 left-12 w-16 h-16 border-b-2 border-l-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* UI Badge Overlay */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-12 left-12 right-12 p-10 glass-card bg-black/40 backdrop-blur-2xl border-white/10 rounded-3xl transform translate-z-20 shadow-2xl overflow-hidden group/badge"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <h4 className="text-white font-black text-2xl mb-2 tracking-tight">AI Integrated Systems</h4>
                    <p className="text-primary/70 font-bold text-xs uppercase tracking-[0.3em]">Next-Gen Security Standards</p>
                    
                    <div className="mt-6 flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full bg-primary/40"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Depth Orbs */}
            <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-40 animate-pulse" />
          </motion.div>

          {/* Text Side */}
          <div className="order-1 lg:order-2">
            <div className="space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-10 group hover:border-primary/40 transition-all">
                        <div className="relative">
                            <span className="w-3 h-3 rounded-full bg-primary block" />
                            <span className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-ping" />
                        </div>
                        <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">{t('mission_badge')}</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-heading font-black leading-[0.95] tracking-tighter mb-12">
                        {t.rich('mission_title', {
                            highlight: (chunks) => (
                                <span className="relative">
                                    <span className="text-gradient block italic">{chunks}</span>
                                    <motion.span 
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="absolute -bottom-4 left-0 w-full h-2 bg-primary/20 origin-left rounded-full"
                                    />
                                </span>
                            )
                        })}
                    </h2>
                </motion.div>

                <div className="space-y-10 text-gray-400 leading-relaxed text-xl font-medium">
                    {[t('mission_p1'), t('mission_p2'), t('mission_p3')].map((text, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className={i === 1 ? "pl-8 border-l-4 border-primary/30 relative overflow-hidden group" : "relative"}
                        >
                            {i === 1 && <div className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />}
                            <p className="relative z-10">{text}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Animated Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 pt-16 border-t border-white/5">
                    {[
                        { label: (locale: string) => locale === 'sq' ? "Vite Përvojë" : "Years Experience", value: "10+" },
                        { label: (locale: string) => locale === 'sq' ? "Projekte" : "Projects Done", value: "1000+" },
                        { label: (locale: string) => locale === 'sq' ? "Mbështetje" : "Active Support", value: "24/7", color: "text-primary" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className="group"
                        >
                            <span className={`block text-6xl font-heading font-black text-white ${stat.color || ''} mb-3 group-hover:scale-110 group-hover:text-primary transition-all duration-500 origin-left`}>
                                <Counter value={stat.value} />
                            </span>
                            <span className="text-xs text-gray-500 uppercase tracking-[0.25em] font-black group-hover:text-white transition-colors">
                                {typeof stat.label === 'function' ? stat.label(t('mission_badge').includes('Misioni') ? 'sq' : 'en') : stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
