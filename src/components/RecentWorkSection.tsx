'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useRef, MouseEvent } from 'react';
import { FaArrowRight, FaExpand } from 'react-icons/fa';
import Image from 'next/image';

type Project = {
  image: string;
  title: string;
  location: string;
  tags: string[];
  year: string;
  category: string;
};

const projects: Project[] = [
  {
    image: "/images/stock/stock-22.jpg",
    title: "Sistemi Inteligjent CCTV",
    location: "Pejë",
    tags: ["Dahua", "AI", "4K"],
    year: "2024",
    category: "Surveillance"
  },
  {
    image: "/images/stock/stock-23.jpg",
    title: "Siguria Perimetrike",
    location: "Prishtinë",
    tags: ["PTZ", "Radar"],
    year: "2024",
    category: "Perimeter"
  },
  {
    image: "/images/stock/stock-24.jpg",
    title: "Qendra e Monitorimit",
    location: "Prizren",
    tags: ["NVR", "Video Wall"],
    year: "2023",
    category: "Control Room"
  },
  {
    image: "/images/stock/stock-25.jpg",
    title: "Instalim Industrial",
    location: "Gjakovë",
    tags: ["Fiber", "Access Control"],
    year: "2023",
    category: "Industrial"
  }
];

function ProjectStrip({ project, idx }: { project: Project; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgX = useTransform(scrollYProgress, [0, 1], idx % 2 === 0 ? ['-5%', '5%'] : ['5%', '-5%']);
  const smoothImgX = useSpring(imgX, { damping: 30, stiffness: 80 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardGlow = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0,123,255,0.12), transparent 55%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const isEven = idx % 2 === 0;
  const numStr = String(idx + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative"
    >
      {/* Mouse-following glow per row */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-0 hidden md:block"
        style={{ background: cardGlow }}
      />

      <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/5 group-hover:border-primary/20 transition-all duration-700 bg-[#080808]`}>

        {/* ─── IMAGE HALF ─── */}
        <div className={`relative overflow-hidden h-72 md:h-96 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
          {/* Parallax image */}
          <motion.div
            className="absolute inset-0 w-full h-full scale-110 group-hover:scale-125 transition-transform duration-[1.4s] ease-out"
            style={{ x: smoothImgX }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          {/* Colour wash overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-multiply" />
          {/* Dark vignette */}
          <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent to-[#080808]`} />

          {/* Category badge */}
          <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
            {project.tags.map((tag, tIdx) => (
              <span key={tIdx} className="px-3 py-1 rounded-full bg-black/50 border border-primary/30 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_12px_rgba(0,123,255,0.2)]">
                {tag}
              </span>
            ))}
          </div>

          {/* Expand icon */}
          <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 backdrop-blur-md">
            <FaExpand className="text-white/70" size={12} />
          </div>
        </div>

        {/* ─── INFO HALF ─── */}
        <div className={`relative flex flex-col justify-between p-10 md:p-14 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
          {/* Big index number */}
          <span
            className="absolute select-none pointer-events-none font-black text-[8rem] md:text-[11rem] leading-none text-white/[0.025] group-hover:text-white/[0.04] transition-colors duration-700"
            style={{ top: '-1rem', right: isEven ? '-1rem' : 'auto', left: isEven ? 'auto' : '-1rem' }}
          >
            {numStr}
          </span>

          <div>
            {/* Category label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-[1px] bg-primary" />
              <span className="text-primary text-[11px] font-black uppercase tracking-[0.25em]">{project.category}</span>
              <span className="ml-auto text-white/20 text-[11px] font-mono">{project.year}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-white transition-colors duration-300">
              {project.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
              <span className="uppercase tracking-widest font-bold">{project.location}, Kosovë</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-5 mt-10">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/5 to-transparent" />
            <span className="flex items-center gap-3 text-sm font-bold text-white/30 group-hover:text-white transition-colors duration-500 cursor-pointer" aria-label={`Shih projektin: ${project.title}`}>
              <span className="uppercase tracking-widest group-hover:text-primary transition-colors">Shih Projektin</span>
              <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-primary/60 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300">
                <FaArrowRight size={10} className="-rotate-45 group-hover:text-primary" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecentWorkSection() {
  const t = useTranslations('Index');
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] });
  const lineScaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { damping: 25, stiffness: 80 });

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden bg-[#020202] border-t border-white/5">
      {/* Subtle dot matrix bg */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-primary/6 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-blue-900/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">

        {/* ─── Section Header ─── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,123,255,0.8)]" />
              <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Premium Gallery</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-heading font-black mb-5 tracking-tight text-white leading-[1.05]">
              {t.rich('recent_work_title', {
                highlight: (chunks) => <span className="text-primary italic block">{chunks}</span>
              })}
            </h2>
            <p className="text-white/40 text-lg leading-relaxed">{t('recent_work_p')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/portfolio"
              className="group flex items-center gap-4 text-white font-bold transition-all duration-500 bg-white/5 px-8 py-4 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_50px_rgba(0,123,255,0.25)] backdrop-blur-md"
            >
              <span>{t('view_full_gallery')}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <FaArrowRight className="text-white" size={11} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ─── Project Strips with animated connector line ─── */}
        <div className="relative flex gap-8 md:gap-10">
          {/* Vertical animated line on the left */}
          <div className="hidden md:flex flex-col items-center flex-shrink-0 pt-8">
            <motion.div
              className="w-[1px] bg-gradient-to-b from-primary via-primary/50 to-transparent origin-top"
              style={{ scaleY: lineScaleY, height: `${projects.length * 100}%` }}
            />
          </div>

          {/* Strips */}
          <div className="flex-1 flex flex-col gap-6">
            {projects.map((project, idx) => (
              <ProjectStrip key={idx} project={project} idx={idx} />
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-3 gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl"
        >
          {[
            { value: '500+', label: 'Projekte të Kryera' },
            { value: '10+', label: 'Vite Eksperiencë' },
            { value: '98%', label: 'Klientë të Kënaqur' },
          ].map(({ value, label }, i) => (
            <div key={i} className={`text-center ${i !== 0 ? 'border-l border-white/5' : ''}`}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{value}</div>
              <div className="text-white/30 text-xs uppercase tracking-widest font-bold">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
