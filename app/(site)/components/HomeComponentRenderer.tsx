'use client';

import { DynamicHero } from './DynamicHero';
import { DynamicPortfolio } from './DynamicPortfolio';
import { DynamicServices } from './DynamicServices';
import { DynamicTestimonials } from './DynamicTestimonials';
import { DynamicPosts } from './DynamicPosts';
import {
  HeroConfig,
  PortfolioConfig,
  ServicesConfig,
  TestimonialsConfig,
  PostsConfig,
} from '@/app/(admin)/admin/components/ComponentConfigForms';

interface HomeComponent {
  _id: string;
  type: string;
  config?: string;
  active: boolean;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
}

interface Props {
  components: HomeComponent[];
  imageUrls: Record<string, string | null>;
  posts: Post[];
}

export function HomeComponentRenderer({ components, imageUrls, posts }: Props) {
  return (
    <>
      {components.map((comp) => {
        if (!comp.active) return null;
        
        let config: unknown = {};
        try {
          config = comp.config ? JSON.parse(comp.config) : {};
        } catch {
          config = {};
        }

        switch (comp.type) {
          case 'hero':
            return (
              <DynamicHero 
                key={comp._id} 
                config={config as HeroConfig} 
                imageUrls={imageUrls} 
              />
            );
          case 'portfolio':
            return (
              <DynamicPortfolio 
                key={comp._id} 
                config={config as PortfolioConfig} 
                imageUrls={imageUrls} 
              />
            );
          case 'services':
            return (
              <DynamicServices 
                key={comp._id} 
                config={config as ServicesConfig} 
              />
            );
          case 'testimonials':
            return (
              <DynamicTestimonials 
                key={comp._id} 
                config={config as TestimonialsConfig} 
              />
            );
          case 'posts':
            const postsConfig = config as PostsConfig;
            const postIds = postsConfig.postIds || [];
            // Lọc và giữ thứ tự theo postIds
            const displayPosts = postIds
              .map((id) => posts.find((p) => p._id === id))
              .filter((p): p is Post => p !== undefined);
            return (
              <DynamicPosts 
                key={comp._id} 
                config={postsConfig} 
                posts={displayPosts}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
