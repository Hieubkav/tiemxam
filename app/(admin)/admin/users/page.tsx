'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type Toast = { id: number; type: 'success' | 'error'; message: string };

type Role = 'admin' | 'editor' | 'staff';

const roleLabels: Record<Role, string> = {
  admin: 'Quản trị',
  editor: 'Biên tập',
  staff: 'Nhân viên',
};

export default function UsersPage() {
  const users = useQuery(api.users.list, {}) ?? [];
  const updateUser = useMutation(api.users.update);
  const removeUser = useMutation(api.users.remove);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const toggleStatus = async (id: Id<'users'>) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    try {
      await updateUser({ id, active: !user.active });
      pushToast('success', user.active ? 'Đã tạm khóa người dùng' : 'Đã kích hoạt người dùng');
    } catch (error) {
      pushToast('error', 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: Id<'users'>) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await removeUser({ id });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      pushToast('success', 'Đã xóa người dùng');
    } catch (error) {
      pushToast('error', 'Có lỗi xảy ra');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u._id)));
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
      if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} người dùng?`)) return;
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) => removeUser({ id: id as Id<'users'> }))
        );
        pushToast('success', `Đã xóa ${selectedIds.size} người dùng`);
      } catch (error) {
        pushToast('error', 'Có lỗi xảy ra');
      }
    } else {
      const active = action === 'activate';
      try {
        await Promise.all(
          Array.from(selectedIds).map((id) =>
            updateUser({ id: id as Id<'users'>, active })
          )
        );
        pushToast('success', active ? 'Đã kích hoạt người dùng' : 'Đã tạm khóa người dùng');
      } catch (error) {
        pushToast('error', 'Có lỗi xảy ra');
      }
    }

    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Danh sách tài khoản admin và phân quyền truy cập
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          + Tạo người dùng
        </Link>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm text-slate-700 dark:text-slate-200">Hành động hàng loạt:</span>
          <button
            onClick={() => handleBulk('activate')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <CheckCircle2 size={16} /> Kích hoạt
          </button>
          <button
            onClick={() => handleBulk('deactivate')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <XCircle size={16} /> Tạm khóa
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
                    checked={selectedIds.size === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                  />
                </th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Chưa có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`${
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-800/60' : 'bg-slate-50 dark:bg-slate-800/40'
                    } border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user._id)}
                        onChange={() => toggleSelectRow(user._id)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200'
                        }`}
                      >
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(user._id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          user.active
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30'
                            : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {user.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {user.active ? 'Đang hoạt động' : 'Tạm khóa'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id)}
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
