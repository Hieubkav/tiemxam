'use client';

import { PortfolioConfig } from '@/app/(admin)/admin/components/ComponentConfigForms';

interface Props {
  config: PortfolioConfig;
  imageUrls: Record<string, string | null>;
}

export function DynamicPortfolio({ config, imageUrls }: Props) {
  const items = config.items || [];
  const validItems = items.filter(item => item.storageId && imageUrls[item.storageId]);

  if (validItems.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-center">
            {config.title || 'Hình Xăm Nổi Bật'}
          </h2>
          <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {validItems.map((item, idx) => (
            <div key={idx} className="aspect-[3/4] bg-zinc-100 overflow-hidden group">
              <img 
                src={imageUrls[item.storageId!] || ''} 
                alt="Tác phẩm" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
