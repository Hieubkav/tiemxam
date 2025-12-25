'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { HomeComponentRenderer } from './components/HomeComponentRenderer';

export default function Home() {
  const hasTrackedRef = useRef(false);
  const trackVisitor = useMutation(api.visitors.track);

  const homeComponents = useQuery(api.homeComponents.list, { activeOnly: true });
  const posts = useQuery(api.posts.list, { activeOnly: true });

  // Extract all storageIds from components config
  const allStorageIds = useMemo(() => {
    const ids: string[] = [];
    
    homeComponents?.forEach((comp) => {
      if (!comp.config) return;
      try {
        const config = JSON.parse(comp.config);
        const extract = (obj: unknown) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) {
            obj.forEach(extract);
          } else {
            for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
              if (key === 'storageId' && typeof value === 'string') {
                ids.push(value);
              } else {
                extract(value);
              }
            }
          }
        };
        extract(config);
      } catch {}
    });

    return ids;
  }, [homeComponents]);

  const imageUrls = useQuery(
    api.files.getUrls,
    allStorageIds.length > 0 ? { storageIds: allStorageIds } : 'skip'
  );

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

  // Loading state
  if (!homeComponents || !posts) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[73px]">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <HomeComponentRenderer 
      components={homeComponents}
      imageUrls={imageUrls || {}}
      posts={posts.map(p => ({ _id: p._id, title: p.title, slug: p.slug, thumbnail: p.thumbnail }))}
    />
  );
}
