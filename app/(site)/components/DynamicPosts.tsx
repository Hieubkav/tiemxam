'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { PostsConfig } from '@/app/(admin)/admin/components/ComponentConfigForms';

interface Post {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
}

interface Props {
  config: PostsConfig;
  posts: Post[];
}

export function DynamicPosts({ config, posts }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-zinc-900">
              {config.title || 'Bài viết'}
            </h2>
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
          {posts.map((post) => (
            <Link 
              key={post._id} 
              href={`/bai-viet/${post.slug}`}
              className="min-w-[280px] md:min-w-[340px] border border-zinc-100 group bg-white rounded-[5px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                {post.thumbnail ? (
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="text-[13px] font-black uppercase tracking-wider leading-relaxed text-zinc-900 group-hover:text-zinc-600 transition-colors">
                  {post.title}
                </h4>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Xem chi tiết</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
