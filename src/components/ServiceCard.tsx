'use client';

import { Link } from '@/i18n/routing';
import { IconType } from 'react-icons';
import {
  FaCamera, FaShieldAlt, FaBolt, FaHome, FaNetworkWired, FaTools,
  FaVideo, FaMicrochip, FaServer, FaLock, FaDoorOpen, FaTv,
  FaWrench, FaWifi, FaStream, FaUserShield, FaArrowRight
} from 'react-icons/fa';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

const ICON_MAP: Record<string, IconType> = {
  camera: FaCamera, shield: FaShieldAlt, bolt: FaBolt, home: FaHome,
  network: FaNetworkWired, tools: FaTools, video: FaVideo, microchip: FaMicrochip,
  server: FaServer, lock: FaLock, door: FaDoorOpen, tv: FaTv,
  wrench: FaWrench, wifi: FaWifi, stream: FaStream, userShield: FaUserShield,
};

interface ServiceCardProps {
  title: string;
  description: string;
  iconName: string;
  href: string;
  index: number;
  image?: string;
  accentColor?: string;
}

export default function ServiceCard({
  title, description, iconName, href, index, image, accentColor = '#007BFF',
}: ServiceCardProps) {
  const Icon = ICON_MAP[iconName] || FaShieldAlt;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 180 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 180 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg']);

  const glowBg = useMotionTemplate`radial-gradient(500px circle at ${useSpring(mouseX, { damping: 20, stiffness: 200 })}px ${useSpring(mouseY, { damping: 20, stiffness: 200 })}px, ${accentColor}30, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const numStr = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative perspective-1000"
    >
      <Link
        href={href as any}
        className="block relative overflow-hidden rounded-3xl"
        style={{ textDecoration: 'none' }}
        aria-label={`${title} - Mëso më shumë`}
      >
        {/* Animated gradient border */}
        <div
          className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{ background: `linear-gradient(135deg, ${accentColor}80, transparent 50%, ${accentColor}40)` }}
        />

        {/* Card body */}
        <div className="relative z-10 rounded-3xl overflow-hidden bg-[#080c12] border border-white/[0.06] group-hover:border-transparent transition-colors duration-500">

          {/* Mouse glow overlay */}
          <motion.div className="absolute inset-0 pointer-events-none z-20 rounded-3xl" style={{ background: glowBg }} />

          {/* ── Image / Background ── */}
          <div className="relative h-56 overflow-hidden">
            {image ? (
              <>
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[1.5s] ease-out opacity-50 group-hover:opacity-70"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c12] via-[#080c12]/60 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, ${accentColor}50, transparent 70%)` }}
                />
              </>
            ) : (
              <>
                {/* Abstract background when no image */}
                <div
                  className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-700"
                  style={{ background: `radial-gradient(ellipse at 30% 60%, ${accentColor}, #000 70%)` }}
                />
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c12] via-transparent to-transparent" />
              </>
            )}

            {/* Big floating index number */}
            <span
              className="absolute top-4 right-6 font-black text-[5rem] leading-none select-none pointer-events-none transition-all duration-700"
              style={{ color: `${accentColor}15`, fontVariantNumeric: 'tabular-nums' }}
            >
              {numStr}
            </span>

            {/* Icon badge */}
            <motion.div
              className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              style={{ background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="text-2xl drop-shadow-[0_0_12px_currentColor]" style={{ color: accentColor }} />
            </motion.div>

            {/* Category tag top-left */}
            <div className="absolute top-5 left-6 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 group-hover:text-white/70 transition-colors duration-300">
                Service
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="p-7 relative z-10">
            {/* Title */}
            <h3 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-white transition-colors duration-300 tracking-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/40 text-sm leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors duration-500 mb-6">
              {description}
            </p>

            {/* CTA Row */}
            <div className="flex items-center justify-between">
              {/* Progress line */}
              <div className="flex-1 h-[1px] mr-4 bg-white/5 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div
                  className="absolute inset-y-0 left-0 w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full opacity-60"
                  style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
                />
              </div>

              {/* Link text + arrow */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300"
                  style={{ color: `${accentColor}80` }}
                >
                  <span className="group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                    Mëso
                  </span>
                </span>
                <motion.div
                  className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-400"
                  style={{ borderColor: `${accentColor}30` }}
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.15 }}
                >
                  <FaArrowRight size={12} style={{ color: accentColor }} className="-rotate-45" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom glow line that slides on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
            style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}00)` }}
          />

          {/* Corner glow on hover */}
          <div
            className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
            style={{ background: `radial-gradient(circle at bottom right, ${accentColor}, transparent)` }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
