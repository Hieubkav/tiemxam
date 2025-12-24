'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Home,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentView?: string;
  currentPath?: string;
  onChangeView?: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  currentPath,
}) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng Quan', href: '/admin' },
    { id: 'home-components', icon: Layers, label: 'Giao diện trang chủ', href: '/admin/home-components' },
    { id: 'posts', icon: FileText, label: 'Bài viết', href: '/admin/posts' },
    { id: 'users', icon: Users, label: 'Người dùng', href: '/admin/users' },
    { id: 'settings', icon: Settings, label: 'Cài đặt', href: '/admin/settings' },
  ];

  const normalizePath = (path?: string | null) =>
    (path || '').replace(/\/+$/, '') || '/';

  const activeNormalized = normalizePath(activePath);

  const isActive = (href: string) => {
    const hrefNormalized = normalizePath(href);
    if (hrefNormalized === '/admin') {
      return activeNormalized === hrefNormalized;
    }
    return activeNormalized.startsWith(hrefNormalized);
  };

  return (
    <aside
      className={`
        ${collapsed ? 'w-20' : 'w-64'}
        flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        h-screen sticky top-0 transition-all duration-300 z-30
      `}
    >
      {/* Logo Area */}
      <div
        className={`p-6 flex items-center ${
          collapsed ? 'justify-center' : 'justify-between'
        } border-b border-slate-100 dark:border-slate-800 h-16`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-black dark:bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Admin
            </span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 bg-black dark:bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">T</span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400
            ${collapsed ? 'hidden' : 'block'}
          `}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                ${
                  active
                    ? 'bg-black dark:bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                size={20}
                className={
                  active
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-300'
                }
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <Link
          href="/"
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Về trang chủ' : undefined}
        >
          <Home size={20} className="text-slate-500 dark:text-slate-500" />
          {!collapsed && 'Về trang chủ'}
        </Link>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
