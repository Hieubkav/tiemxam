'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, ChevronLeft, ArrowUp, Phone } from 'lucide-react';
import { HERO_IMAGES, PORTFOLIO_ITEMS, LATEST_ITEMS, NEWS } from '../lib/constants';
import { ServicesSection } from '../components/ServicesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasTrackedRef = useRef(false);
  const trackVisitor = useMutation(api.visitors.track);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    if (typeof window === 'undefined') return;
    const storageKey = 'visitor-id';
    let visitorId = localStorage.getItem(storageKey);
    if (!visitorId) {
      const uuid =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      visitorId = uuid;
      localStorage.setItem(storageKey, visitorId);
    }

    trackVisitor({
      visitorId,
      path: window.location.pathname,
      userAgent: navigator.userAgent,
    });
  }, [trackVisitor]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-black py-2 shadow-sm' : 'bg-white py-4 border-b border-zinc-100'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="w-20 md:w-24 block overflow-hidden">
            <img 
              src="https://trungdiatattoo.vn/wp-content/uploads/2021/09/unnamed.jpg" 
              alt="Logo Trung Địa" 
              className="w-full h-auto object-contain"
            />
          </a>

          <div className="hidden md:flex gap-10 text-[15px] font-black uppercase tracking-[0.15em]">
            {['Trang chủ', 'Tác phẩm', 'Dịch vụ', 'Tin tức', 'Liên hệ'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:text-zinc-400 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[73px] bottom-0 bg-white border-t border-black z-50 overflow-y-auto">
            <div className="flex flex-col p-10 gap-8 text-center text-lg uppercase tracking-widest font-bold">
              {['Trang chủ', 'Tác phẩm', 'Dịch vụ', 'Tin tức', 'Liên hệ'].map((item) => (
                <a key={item} href={`#${item}`} onClick={() => setIsMenuOpen(false)}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Slider */}
      <section className="relative h-[60vh] md:h-screen w-full bg-zinc-100 mt-[73px] md:mt-0">
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentHero === idx ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {HERO_IMAGES.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentHero(idx)}
              className={`h-0.5 transition-all duration-500 ${currentHero === idx ? 'bg-white w-16' : 'bg-white/30 w-8'}`}
            />
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="Tác phẩm" className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-center">Hình Xăm Nổi Bật</h2>
            <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {PORTFOLIO_ITEMS.map((item) => (
              <div key={item.id} className="aspect-[3/4] bg-zinc-100 overflow-hidden group">
                <img 
                  src={item.imageUrl} 
                  alt="Tác phẩm" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Works Section */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-center">Mẫu Hình Xăm Mới Nhất</h2>
            <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {LATEST_ITEMS.map((item) => (
              <div key={item.id} className="aspect-[3/4] bg-zinc-100 overflow-hidden group">
                <img 
                  src={item.imageUrl} 
                  alt="Tác phẩm mới" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />

      <TestimonialsSection />

      {/* Blog Carousel */}
      <section id="Tin tức" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-zinc-900">Bài viết</h2>
              <div className="w-12 h-1 bg-black mt-3"></div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' })} 
                className="p-3 border border-zinc-200 hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' })} 
                className="p-3 border border-zinc-200 hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          >
            {NEWS.map((post, idx) => (
              <div key={idx} className="min-w-[280px] md:min-w-[340px] border border-zinc-100 group bg-white rounded-[5px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h4 className="text-[13px] font-black uppercase tracking-wider leading-relaxed text-zinc-900 group-hover:text-zinc-600 transition-colors">{post.title}</h4>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Xem chi tiết</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="Liên hệ" className="bg-black text-white pt-16 pb-8 md:pt-20 md:pb-10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-base md:text-lg font-bold uppercase tracking-[0.15em] mb-8 md:mb-10">XĂM HÌNH NGHỆ THUẬT TRUNG ĐỊA TATTOO STUDIO</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-left md:text-center border-y border-white/10 py-8 md:py-10">
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Địa chỉ</p>
                <p className="text-sm font-medium text-zinc-200">65/15 Trần Hưng Đạo, P. An Cư, Q. Ninh Kiều, Cần Thơ</p>
              </div>
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Hotline</p>
                <p className="text-xl font-black text-white leading-tight">0878 519 519</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">(Hỗ trợ Zalo 24/7)</p>
              </div>
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Kết nối</p>
                <a href="https://www.facebook.com/trungdiatattoo" className="text-sm font-bold text-zinc-200 hover:text-white transition-colors block truncate underline decoration-white/20 underline-offset-4">facebook.com/trungdiatattoo</a>
              </div>
            </div>
          </div>
          <div className="mt-12 md:mt-14 text-center">
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">
              &copy; 2024 TRUNG ĐỊA TATTOO. HIGH PRECISION ARTISTRY.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-[60]">
        <a 
          href="https://zalo.me/0878519519" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-black shadow-2xl hover:bg-zinc-100 transition-all group"
        >
          <span className="font-black text-lg md:text-xl group-hover:scale-110 transition-transform">Z</span>
        </a>
        <a 
          href="tel:0878519519" 
          className="bg-black text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-zinc-800 transition-all"
        >
          <Phone size={18} className="md:w-[22px] md:h-[22px]" />
        </a>
        <button 
          onClick={scrollToTop}
          className={`bg-white text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-black shadow-2xl transition-all ${
            scrolled ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <ArrowUp size={18} className="md:w-[22px] md:h-[22px]" />
        </button>
      </div>
    </div>
  );
}
