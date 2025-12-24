'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface HomeComponent {
  id: number;
  name: string;
  type: string;
  active: boolean;
  order: number;
}

const initialComponents: HomeComponent[] = [
  { id: 1, name: 'Hero Slider', type: 'hero', active: true, order: 1 },
  { id: 2, name: 'Hình Xăm Nổi Bật', type: 'portfolio', active: true, order: 2 },
  { id: 3, name: 'Mẫu Hình Xăm Mới', type: 'latest', active: true, order: 3 },
  { id: 4, name: 'Dịch Vụ', type: 'services', active: true, order: 4 },
  { id: 5, name: 'Đánh Giá Khách Hàng', type: 'testimonials', active: true, order: 5 },
  { id: 6, name: 'Bài Viết', type: 'posts', active: true, order: 6 },
];

export default function HomeComponentsPage() {
  const [components, setComponents] = useState<HomeComponent[]>(initialComponents);
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error'; message: string }[]>([]);

  const pushToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const toggleStatus = (id: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    const comp = components.find((c) => c.id === id);
    pushToast('success', comp?.active ? 'Đã ẩn component' : 'Đã hiển thị component');
  };

  const moveUp = (id: number) => {
    setComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  };

  const moveDown = (id: number) => {
    setComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((c, i) => ({ ...c, order: i + 1 }));
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá component này?')) return;
    setComponents((prev) => prev.filter((c) => c.id !== id));
    pushToast('success', 'Đã xoá component');
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
              {components.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Chưa có component nào
                  </td>
                </tr>
              ) : (
                components.map((comp, idx) => (
                  <tr
                    key={comp.id}
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
                          onClick={() => moveUp(comp.id)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveDown(comp.id)}
                          disabled={idx === components.length - 1}
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
                        onClick={() => toggleStatus(comp.id)}
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
                          href={`/admin/home-components/${comp.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(comp.id)}
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

      {/* Toast stack */}
      <div className="fixed top-6 right-6 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[240px] max-w-sm px-4 py-3 rounded-lg shadow-lg border ${
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
