'use client';

import { useEffect, useState } from 'react';

const brands = [
  { name: "Dahua",     activeColor: "text-[#FF0000]" },
  { name: "Hikvision", activeColor: "text-[#EE2B2E]" },
  { name: "Ezviz",     activeColor: "text-[#F8981D]" },
  { name: "Ajax",      activeColor: "text-white"      },
  { name: "TP-Link",   activeColor: "text-[#00AFEE]"  },
  { name: "Ubiquiti",  activeColor: "text-[#0559C9]"  },
];

export default function Brands() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  // Auto-cycle through each brand
  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % brands.length);
    }, 1300);
    return () => clearInterval(id);
  }, []);

  const highlighted = hovered !== null ? hovered : active;

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
      {brands.map((brand, i) => {
        const isActive = highlighted === i;
        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`
              text-2xl md:text-3xl font-heading font-black tracking-tighter
              transition-all duration-500 cursor-pointer select-none
              ${isActive
                ? `${brand.activeColor} opacity-100 scale-110 grayscale-0 drop-shadow-[0_0_12px_currentColor]`
                : 'text-gray-600 opacity-40 scale-100 grayscale'
              }
            `}
          >
            {brand.name}
          </div>
        );
      })}
    </div>
  );
}
