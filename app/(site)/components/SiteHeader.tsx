'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const settings = useQuery(api.settings.get);
  const menus = useQuery(api.menus.list, { activeOnly: true });

  const logoStorageId = settings?.logoStorageId;
  const logoUrl = useQuery(
    api.files.getUrl,
    logoStorageId ? { storageId: logoStorageId as never } : 'skip'
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white border-b border-black py-2 shadow-sm' : 'bg-white py-4 border-b border-zinc-100'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="block overflow-hidden">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={settings?.siteName || 'Logo'} 
              className="h-10 md:h-12 w-auto object-contain"
            />
          ) : (
            <span className="font-bold text-lg">{settings?.siteName || 'Logo'}</span>
          )}
        </Link>

        <div className="hidden md:flex gap-10 text-[15px] font-black uppercase tracking-[0.15em]">
          {menus?.map((menu) => (
            <Link 
              key={menu._id} 
              href={menu.url} 
              className="hover:text-zinc-400 transition-colors relative group"
              {...(menu.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {menu.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
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
            {menus?.map((menu) => (
              <Link 
                key={menu._id} 
                href={menu.url} 
                onClick={() => setIsMenuOpen(false)}
                {...(menu.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
