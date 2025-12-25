'use client';

import { TestimonialsConfig } from '@/app/(admin)/admin/components/ComponentConfigForms';

interface Props {
  config: TestimonialsConfig;
}

export function DynamicTestimonials({ config }: Props) {
  const items = config.items || [];

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-50 border-y border-zinc-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-zinc-900">
            {config.title || 'Cảm nhận khách hàng'}
          </h2>
          <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {items.map((t, idx) => (
            <div key={idx} className="relative p-8 md:p-10 bg-white border border-zinc-100 flex flex-col justify-between shadow-sm">
              <div className="text-5xl font-serif text-zinc-100 absolute top-4 left-4 pointer-events-none">&quot;</div>
              <div className="relative z-10">
                <p className="text-[13px] md:text-[14px] font-medium leading-relaxed mb-6 italic text-zinc-800">
                  {t.content}
                </p>
              </div>
              <div className="border-t border-zinc-100 pt-5">
                <h5 className="text-[11px] uppercase tracking-[0.3em] font-black text-zinc-900">{t.author}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
