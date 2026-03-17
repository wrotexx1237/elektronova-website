'use client';

import {Link} from '@/i18n/routing';
import {IconType} from 'react-icons';
import {
  FaCamera, FaShieldAlt, FaBolt, FaHome, FaNetworkWired, FaTools,
  FaVideo, FaMicrochip, FaServer, FaLock, FaDoorOpen, FaTv,
  FaWrench, FaWifi, FaStream, FaUserShield, FaArrowRight
} from 'react-icons/fa';
import {motion, useMotionValue, useSpring, useTransform, useMotionTemplate} from 'framer-motion';

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

  // Mouse-tracking glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });
  const cardGlow = useMotionTemplate`radial-gradient(350px circle at ${springX}px ${springY}px, ${accentColor}22, transparent 60%)`;

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(useSpring(y), [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(useSpring(x), [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <Link href={href as any} className="block relative overflow-hidden rounded-2xl border border-white/5 group-hover:border-white/15 transition-all duration-500 bg-[#0a0a0a]" style={{ textDecoration: 'none' }}>
        
        {/* Mouse glow overlay */}
        <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ background: cardGlow }} />

        {/* ─── Image area ─── */}
        {image && (
          <div className="relative h-44 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-[1.2s] ease-out opacity-75 group-hover:opacity-90"
            />
            {/* Gradient fade to card body */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

            {/* Icon badge floating on image */}
            <div
              className="absolute bottom-4 left-5 w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md"
              style={{ background: `${accentColor}22` }}
            >
              <Icon className="text-xl" style={{ color: accentColor }} />
            </div>
          </div>
        )}

        {/* ─── No-image fallback (icon card) ─── */}
        {!image && (
          <div className="relative h-20 overflow-hidden flex items-end px-5 pb-0">
            <div className="absolute inset-0 opacity-[0.04]" style={{ background: `radial-gradient(circle at 30% 70%, ${accentColor}, transparent 70%)` }} />
            <motion.div
              className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-[-8px] border border-white/10"
              style={{ background: `${accentColor}18` }}
              whileHover={{ scale: 1.1 }}
            >
              <Icon className="text-2xl" style={{ color: accentColor }} />
            </motion.div>
          </div>
        )}

        {/* ─── Content ─── */}
        <div className="p-5 relative z-10">
          <h3 className="text-lg font-black text-white mb-2 leading-tight group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 group-hover:text-white/55 transition-colors duration-300 mb-5">
            {description}
          </p>

          {/* Action row */}
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-white/5 to-transparent" />
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors duration-300" style={{ color: `${accentColor}99` }}>
              <span className="group-hover:opacity-100 opacity-70 transition-opacity">Mëso më shumë</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                <FaArrowRight style={{ color: accentColor }} size={11} />
              </motion.span>
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
        />
      </Link>
    </motion.div>
  );
}
