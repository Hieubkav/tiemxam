'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, CheckCircle2, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type Toast = { id: number; type: 'success' | 'error'; message: string };

export default function MenusPage() {
  const menus = useQuery(api.menus.list, {}) ?? [];
  const updateMenu = useMutation(api.menus.update);
  const removeMenu = useMutation(api.menus.remove);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const moveUp = async (id: Id<'menus'>) => {
    const idx = menus.findIndex((m) => m._id === id);
    if (idx <= 0) return;
    const current = menus[idx];
    const prev = menus[idx - 1];
    await Promise.all([
      updateMenu({ id: current._id, order: prev.order }),
      updateMenu({ id: prev._id, order: current.order }),
    ]);
  };

  const moveDown = async (id: Id<'menus'>) => {
    const idx = menus.findIndex((m) => m._id === id);
    if (idx < 0 || idx >= menus.length - 1) return;
    const current = menus[idx];
    const next = menus[idx + 1];
    await Promise.all([
      updateMenu({ id: current._id, order: next.order }),
      updateMenu({ id: next._id, order: current.order }),
    ]);
  };

  const toggleStatus = async (id: Id<'menus'>) => {
    const menu = menus.find((m) => m._id === id);
    if (!menu) return;
    try {
      await updateMenu({ id, active: !menu.active });
      pushToast('success', menu.active ? 'Đã ẩn menu' : 'Đã hiển thị menu');
    } catch {
      pushToast('error', 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: Id<'menus'>) => {
    if (!confirm('Bạn có chắc chắn muốn xóa menu này?')) return;
    try {
      await removeMenu({ id });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      pushToast('success', 'Đã xóa menu');
    } catch {
      pushToast('error', 'Có lỗi xảy ra');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === menus.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(menus.map((m) => m._id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulk = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedIds.size === 0) return;

    if (action === 'delete') {
      if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} menu?`)) return;
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) => removeMenu({ id: id as Id<'menus'> }))
        );
        pushToast('success', `Đã xóa ${selectedIds.size} menu`);
      } catch {
        pushToast('error', 'Có lỗi xảy ra');
      }
    } else {
      const active = action === 'activate';
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) =>
            updateMenu({ id: id as Id<'menus'>, active })
          )
        );
        pushToast('success', active ? 'Đã hiển thị menu' : 'Đã ẩn menu');
      } catch {
        pushToast('error', 'Có lỗi xảy ra');
      }
    }

    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Menu</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Danh sách các mục menu hiển thị trên website
          </p>
        </div>
        <Link
          href="/admin/menus/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          + Tạo menu
        </Link>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm text-slate-700 dark:text-slate-200">Hành động hàng loạt:</span>
          <button
            onClick={() => handleBulk('activate')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <CheckCircle2 size={16} /> Hiển thị
          </button>
          <button
            onClick={() => handleBulk('deactivate')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <XCircle size={16} /> Ẩn
          </button>
          <button
            onClick={() => handleBulk('delete')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40"
          >
            <Trash2 size={16} /> Xóa ({selectedIds.size})
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-xs font-semibold uppercase text-slate-700 dark:text-slate-200">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === menus.length && menus.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                  />
                </th>
                <th className="px-4 py-3 w-12">STT</th>
                <th className="px-4 py-3 w-12">Sắp xếp</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Đường dẫn</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Chưa có menu nào
                  </td>
                </tr>
              ) : (
                menus.map((menu, idx) => (
                  <tr
                    key={menu._id}
                    className={`${
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-800/60' : 'bg-slate-50 dark:bg-slate-800/40'
                    } border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(menu._id)}
                        onChange={() => toggleSelectRow(menu._id)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-100">{menu.order}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveUp(menu._id)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveDown(menu._id)}
                          disabled={idx === menus.length - 1}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{menu.name}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{menu.url}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(menu._id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          menu.active
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30'
                            : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {menu.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {menu.active ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/menus/${menu._id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(menu._id)}
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
