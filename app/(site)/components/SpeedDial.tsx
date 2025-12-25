'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Phone } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function SpeedDial() {
  const [scrolled, setScrolled] = useState(false);
  const settings = useQuery(api.settings.get);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-[60]">
      {settings?.zalo && (
        <a 
          href={`https://zalo.me/${settings.zalo}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-black shadow-2xl hover:bg-zinc-100 transition-all group"
        >
          <span className="font-black text-lg md:text-xl group-hover:scale-110 transition-transform">Z</span>
        </a>
      )}
      {settings?.phone && (
        <a 
          href={`tel:${settings.phone}`} 
          className="bg-black text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-zinc-800 transition-all"
        >
          <Phone size={18} className="md:w-[22px] md:h-[22px]" />
        </a>
      )}
      <button 
        onClick={scrollToTop}
        className={`bg-white text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-black shadow-2xl transition-all ${
          scrolled ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp size={18} className="md:w-[22px] md:h-[22px]" />
      </button>
    </div>
  );
}
