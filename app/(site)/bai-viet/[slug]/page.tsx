'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = useQuery(api.posts.getBySlug, { slug });

  // Loading state
  if (post === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[73px]">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Not found
  if (post === null || !post.active) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-[73px]">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-zinc-600 mb-8">Bài viết không tồn tại</p>
        <Link href="/" className="text-black underline hover:text-zinc-600">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="pt-[73px]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black mb-8"
          >
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </Link>

          {/* Post header */}
          <article>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 leading-tight">
                {post.title}
              </h1>
              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Calendar size={14} />
                  <time>{formattedDate}</time>
                </div>
              )}
            </header>

            {/* Post content */}
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-zinc-100">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-zinc-600"
            >
              <ArrowLeft size={16} />
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
