'use client';

import {FaShareAlt, FaFacebookF, FaWhatsapp} from 'react-icons/fa';

interface ShareButtonsProps {
  url: string;
  title: string;
  shareLabel: string;
}

export default function ShareButtons({url, title, shareLabel}: ShareButtonsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard?
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
  };

  return (
    <div className="glass-card">
      <button 
        onClick={handleShare}
        className="w-full text-left font-bold mb-6 flex items-center gap-2 italic hover:text-primary transition-colors group"
      >
        <FaShareAlt className="text-primary group-hover:scale-110 transition-transform" /> {shareLabel}
      </button>
      <div className="flex gap-4">
        <button 
          onClick={shareFacebook}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-all"
          aria-label="Share on Facebook"
        >
          <FaFacebookF />
        </button>
        <button 
          onClick={shareWhatsApp}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366] transition-all"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp />
        </button>
      </div>
    </div>
  );
}
