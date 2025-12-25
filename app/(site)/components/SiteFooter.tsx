'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function SiteFooter() {
  const settings = useQuery(api.settings.get);

  return (
    <footer className="bg-black text-white pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-base md:text-lg font-bold uppercase tracking-[0.15em] mb-8 md:mb-10">
            {settings?.siteName || 'WEBSITE'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-left md:text-center border-y border-white/10 py-8 md:py-10">
            {settings?.address && (
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Địa chỉ</p>
                <p className="text-sm font-medium text-zinc-200">{settings.address}</p>
              </div>
            )}
            {settings?.phone && (
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Hotline</p>
                <p className="text-xl font-black text-white leading-tight">{settings.phone}</p>
                {settings?.zalo && (
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">(Hỗ trợ Zalo 24/7)</p>
                )}
              </div>
            )}
            {settings?.facebook && (
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest">Kết nối</p>
                <a 
                  href={settings.facebook} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-zinc-200 hover:text-white transition-colors block truncate underline decoration-white/20 underline-offset-4"
                >
                  {settings.facebook.replace('https://', '').replace('www.', '')}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 md:mt-14 text-center">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">
            &copy; {new Date().getFullYear()} {settings?.siteName || 'WEBSITE'}. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
