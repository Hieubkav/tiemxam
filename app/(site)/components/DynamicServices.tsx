'use client';

import { ShieldCheck, Check } from 'lucide-react';
import { ServicesConfig } from '@/app/(admin)/admin/components/ComponentConfigForms';

interface Props {
  config: ServicesConfig;
}

export function DynamicServices({ config }: Props) {
  const services = config.services || [];
  const qualities = config.qualities || [];

  if (services.length === 0 && qualities.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-zinc-900">
            {config.title || 'Dịch vụ của chúng tôi'}
          </h2>
          <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
        </div>
        
        {services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 mb-16 overflow-hidden">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white py-6 px-8 md:py-8 md:px-10 flex flex-col justify-center items-center text-center min-h-[120px] lg:min-h-[140px]">
                <div className="max-w-[240px] w-full">
                  <h4 className="text-[13.5px] md:text-[15px] font-black uppercase tracking-[0.1em] leading-snug text-zinc-900 break-words">
                    {service}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {qualities.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-black overflow-hidden bg-white">
            <div className="lg:col-span-4 bg-black text-white p-6 md:p-8 relative overflow-hidden flex flex-col justify-center items-center text-center border-b lg:border-b-0">
               <div className="relative z-10">
                 <div className="w-8 h-px bg-white/20 mx-auto mb-3"></div>
                 <h3 className="text-base md:text-lg font-black uppercase tracking-[0.25em] leading-none mb-2">
                   Chúng tôi cam kết
                 </h3>
                 <div className="flex items-center justify-center gap-2">
                   <div className="w-3 h-3 border border-white/30 rotate-45"></div>
                   <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-500 font-bold italic">Tiêu chuẩn nghệ thuật</p>
                   <div className="w-3 h-3 border border-white/30 rotate-45"></div>
                 </div>
                 <div className="w-8 h-px bg-white/20 mx-auto mt-4"></div>
               </div>
               <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <ShieldCheck size={180} />
               </div>
            </div>

            <div className="lg:col-span-8 bg-white p-8 md:p-10 flex flex-col justify-center border-l border-black lg:border-l-0">
              <div className="space-y-6">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 border-b border-zinc-100 pb-2">Đảm bảo an toàn tuyệt đối</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {qualities.map((quality, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center border border-black mt-0.5">
                        <Check size={10} className="text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13.5px] md:text-[15px] font-black leading-tight text-zinc-900 uppercase tracking-tight">
                          {quality}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
