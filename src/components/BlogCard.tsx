'use client';

import { Link } from '@/i18n/routing';
import { FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  mainImage: string;
  date: string;
  readTime: string;
  index: number;
  locale: string;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  mainImage,
  date,
  readTime,
  index,
  locale
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        href={`/blog/${slug}` as any}
        className="glass-card flex flex-col group h-full hover:border-primary/40 transition-all duration-500"
      >
        <div className="mb-6 overflow-hidden rounded-xl bg-primary/5 aspect-video relative group">
           <img 
             src={mainImage} 
             alt={title}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 uppercase tracking-wider">
          <span className="flex items-center gap-1"><FaCalendarAlt /> {date}</span>
          <span className="flex items-center gap-1"><FaClock /> {readTime}</span>
        </div>
        <h2 className="text-xl font-heading font-bold mb-4 group-hover:text-primary transition-colors duration-300">
          {title}
        </h2>
        <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
          <span>{locale === 'sq' ? 'Lexo më shumë' : 'Read more'}</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
