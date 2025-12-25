'use client';

import { useState, useEffect } from 'react';
import { HeroConfig } from '@/app/(admin)/admin/components/ComponentConfigForms';

interface Props {
  config: HeroConfig;
  imageUrls: Record<string, string | null>;
}

export function DynamicHero({ config, imageUrls }: Props) {
  const [currentHero, setCurrentHero] = useState(0);
  const slides = config.slides || [];
  const validSlides = slides.filter(s => s.storageId && imageUrls[s.storageId]);

  useEffect(() => {
    if (validSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % validSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [validSlides.length]);

  if (validSlides.length === 0) return null;

  return (
    <section className="relative h-[60vh] md:h-screen w-full bg-zinc-100 mt-[73px] md:mt-0">
      {validSlides.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentHero === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={imageUrls[slide.storageId!] || ''} 
            alt={`Slide ${idx}`} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      ))}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        {validSlides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentHero(idx)}
            className={`h-0.5 transition-all duration-500 ${currentHero === idx ? 'bg-white w-16' : 'bg-white/30 w-8'}`}
          />
        ))}
      </div>
    </section>
  );
}
