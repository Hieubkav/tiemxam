'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function DynamicHead() {
  const settings = useQuery(api.settings.get);
  const faviconRef = useRef<HTMLLinkElement | null>(null);
  const metaRef = useRef<HTMLMetaElement | null>(null);
  
  const faviconStorageId = settings?.faviconStorageId;
  const faviconUrl = useQuery(
    api.files.getUrl,
    faviconStorageId ? { storageId: faviconStorageId as never } : 'skip'
  );

  // Update document title
  useEffect(() => {
    if (settings?.seoTitle || settings?.siteName) {
      document.title = settings.seoTitle || settings.siteName || '';
    }
  }, [settings]);

  // Update favicon
  useEffect(() => {
    if (!faviconUrl) return;
    
    // Create or update favicon link
    if (!faviconRef.current) {
      faviconRef.current = document.createElement('link');
      faviconRef.current.rel = 'icon';
      document.head.appendChild(faviconRef.current);
    }
    faviconRef.current.href = faviconUrl;

    return () => {
      if (faviconRef.current && faviconRef.current.parentNode) {
        faviconRef.current.parentNode.removeChild(faviconRef.current);
        faviconRef.current = null;
      }
    };
  }, [faviconUrl]);

  // Update meta description
  useEffect(() => {
    if (!settings?.seoDescription) return;
    
    if (!metaRef.current) {
      metaRef.current = document.createElement('meta');
      metaRef.current.setAttribute('name', 'description');
      document.head.appendChild(metaRef.current);
    }
    metaRef.current.setAttribute('content', settings.seoDescription);

    return () => {
      if (metaRef.current && metaRef.current.parentNode) {
        metaRef.current.parentNode.removeChild(metaRef.current);
        metaRef.current = null;
      }
    };
  }, [settings?.seoDescription]);

  return null;
}
