'use client';

import { Layers, FileText, Users, Eye } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Components trang chủ', value: '6', icon: Layers, color: 'bg-indigo-500', href: '/admin/home-components' },
  { label: 'Bài viết', value: '12', icon: FileText, color: 'bg-green-500', href: '/admin/posts' },
  { label: 'Người dùng', value: '3', icon: Users, color: 'bg-orange-500', href: '/admin/users' },
  { label: 'Lượt xem hôm nay', value: '256', icon: Eye, color: 'bg-pink-500', href: '#' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Chào mừng đến trang quản trị Trung Địa Tattoo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Thao tác nhanh</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/home-components/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
          >
            + Thêm component
          </Link>
          <Link
            href="/admin/posts/create"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
          >
            + Viết bài mới
          </Link>
          <Link
            href="/admin/users/create"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm"
          >
            + Thêm người dùng
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bài viết gần đây</h2>
          <div className="space-y-3">
            {['Hướng dẫn chăm sóc hình xăm', 'Top 10 mẫu tattoo 2024', 'Ý nghĩa các hình xăm'].map((title, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">{title}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">2 ngày trước</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            {[
              'Admin đã cập nhật Hero Banner',
              'Admin đã thêm bài viết mới',
              'Admin đã thay đổi thông tin liên hệ',
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
