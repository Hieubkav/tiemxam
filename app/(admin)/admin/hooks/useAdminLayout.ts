'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAdminLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(stored === 'dark' ? true : stored === 'light' ? false : prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      if (typeof window !== 'undefined') localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (typeof window !== 'undefined') localStorage.setItem('admin-theme', 'light');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => setIsDarkMode((v) => !v);

  const handleChangeView = (view: string) => {
    const map: Record<string, string> = {
      dashboard: '/admin',
      'home-components': '/admin/home-components',
      posts: '/admin/posts',
      users: '/admin/users',
    };
    const target = map[view];
    if (target) router.push(target);
  };

  const getCurrentView = () => {
    if (pathname?.includes('/home-components')) return 'home-components';
    if (pathname?.includes('/posts')) return 'posts';
    if (pathname?.includes('/users')) return 'users';
    return 'dashboard';
  };

  const getBreadcrumbs = () => {
    const view = getCurrentView();

    if (view === 'home-components') {
      if (pathname?.endsWith('/create')) return ['Giao diện trang chủ', 'Thêm mới'];
      if (pathname?.match(/\/home-components\/\d+/)) return ['Giao diện trang chủ', 'Chỉnh sửa'];
      return ['Giao diện trang chủ'];
    }

    if (view === 'posts') {
      if (pathname?.endsWith('/create')) return ['Bài viết', 'Thêm mới'];
      if (pathname?.match(/\/posts\/\d+/)) return ['Bài viết', 'Chỉnh sửa'];
      return ['Bài viết'];
    }

    if (view === 'users') {
      if (pathname?.endsWith('/create')) return ['Người dùng', 'Thêm mới'];
      if (pathname?.match(/\/users\/\d+/)) return ['Người dùng', 'Chỉnh sửa'];
      return ['Người dùng'];
    }

    return ['Dashboard'];
  };

  return {
    isDarkMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    pathname,
    handleThemeToggle,
    handleChangeView,
    getCurrentView,
    getBreadcrumbs,
  };
}
