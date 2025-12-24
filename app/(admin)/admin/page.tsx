'use client';

import { Layers, FileText, Users, Eye } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminDashboard() {
  const homeComponents = useQuery(api.homeComponents.list, {});
  const posts = useQuery(api.posts.list, {});
  const visitorStats = useQuery(api.visitors.stats, {});

  const stats = [
    {
      label: 'Components trang chủ',
      value: homeComponents?.length ?? 0,
      icon: Layers,
      color: 'bg-indigo-500',
      href: '/admin/home-components',
    },
    {
      label: 'Bài viết',
      value: posts?.length ?? 0,
      icon: FileText,
      color: 'bg-green-500',
      href: '/admin/posts',
    },
    {
      label: 'Unique visitors',
      value: visitorStats?.uniqueVisitors ?? 0,
      icon: Users,
      color: 'bg-orange-500',
      href: '/admin',
    },
    {
      label: 'Tổng lượt truy cập',
      value: visitorStats?.totalVisits ?? 0,
      icon: Eye,
      color: 'bg-pink-500',
      href: '/admin',
    },
  ];

  const recentPosts = (posts ?? []).slice(0, 3);

  const activities = [
    ...(homeComponents ?? []).map((item) => ({
      type: 'component',
      title: item.name,
      updatedAt: item.updatedAt,
    })),
    ...(posts ?? []).map((item) => ({
      type: 'post',
      title: item.title,
      updatedAt: item.updatedAt,
    })),
  ]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Chào mừng đến trang quản trị Trung Dõa Tattoo
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bài viết gần đây</h2>
          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">Chưa có bài viết nào</div>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">{post.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">Chưa có hoạt động</div>
            ) : (
              activities.map((activity) => (
                <div
                  key={`${activity.type}-${activity.title}-${activity.updatedAt}`}
                  className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {activity.type === 'post' ? 'Cập nhật bài viết: ' : 'Cập nhật component: '}
                    {activity.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

