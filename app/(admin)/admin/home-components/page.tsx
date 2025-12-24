'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function HomeComponentsPage() {
  const components = useQuery(api.homeComponents.list, {});
  const updateComponent = useMutation(api.homeComponents.update);
  const removeComponent = useMutation(api.homeComponents.remove);

  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error'; message: string }[]>([]);

  const pushToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const list = components ?? [];

  const toggleStatus = async (id: Id<'home_components'>, active: boolean) => {
    await updateComponent({ id, active: !active });
    pushToast('success', active ? 'Đã ẩn component' : 'Đã hiển thị component');
  };

  const moveUp = async (id: Id<'home_components'>) => {
    const idx = list.findIndex((c) => c._id === id);
    if (idx <= 0) return;
    const current = list[idx];
    const prev = list[idx - 1];
    await Promise.all([
      updateComponent({ id: current._id, order: prev.order }),
      updateComponent({ id: prev._id, order: current.order }),
    ]);
  };

  const moveDown = async (id: Id<'home_components'>) => {
    const idx = list.findIndex((c) => c._id === id);
    if (idx < 0 || idx >= list.length - 1) return;
    const current = list[idx];
    const next = list[idx + 1];
    await Promise.all([
      updateComponent({ id: current._id, order: next.order }),
      updateComponent({ id: next._id, order: current.order }),
    ]);
  };

  const handleDelete = async (id: Id<'home_components'>) => {
    if (!confirm('Ban co chac chan muon xoa component nay?')) return;
    await removeComponent({ id });
    pushToast('success', 'Da xoa component');
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hero: 'Hero Banner',
      portfolio: 'Portfolio Grid',
      latest: 'Latest Works',
      services: 'Services',
      testimonials: 'Testimonials',
      posts: 'Blog Posts',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Giao diện trang chủ</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Quản lý các thành phần hiển thị trên trang chủ
          </p>
        </div>
        <Link
          href="/admin/home-components/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          + Thêm component
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-xs font-semibold uppercase text-slate-700 dark:text-slate-200">
                <th className="px-4 py-3 w-12">STT</th>
                <th className="px-4 py-3 w-12">Sắp xếp</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Chưa có component nào
                  </td>
                </tr>
              ) : (
                list.map((comp, idx) => (
                  <tr
                    key={comp._id}
                    className={`${
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-800/60' : 'bg-slate-50 dark:bg-slate-800/40'
                    } border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors`}
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-100">
                      {comp.order}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveUp(comp._id)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveDown(comp._id)}
                          disabled={idx === list.length - 1}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{comp.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {getTypeLabel(comp.type)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(comp._id, comp.active)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          comp.active
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30'
                            : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {comp.active ? <Eye size={14} /> : <EyeOff size={14} />}
                        {comp.active ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/home-components/${comp._id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(comp._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-slate-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed top-6 right-6 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-60 max-w-sm px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === 'success'
                ? 'bg-green-600 text-white border-green-500'
                : 'bg-red-600 text-white border-red-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
