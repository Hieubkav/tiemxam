'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Hướng dẫn chăm sóc hình xăm sau khi xăm',
    slug: 'huong-dan-cham-soc-hinh-xam',
    excerpt: 'Những điều cần biết để chăm sóc hình xăm đúng cách sau khi hoàn thành...',
    active: true,
    createdAt: '2024-12-20',
    updatedAt: '2024-12-22',
  },
  {
    id: 2,
    title: 'Top 10 mẫu tattoo được yêu thích nhất 2024',
    slug: 'top-10-mau-tattoo-2024',
    excerpt: 'Tổng hợp những mẫu hình xăm hot nhất được khách hàng lựa chọn...',
    active: true,
    createdAt: '2024-12-18',
    updatedAt: '2024-12-18',
  },
  {
    id: 3,
    title: 'Ý nghĩa các hình xăm phổ biến',
    slug: 'y-nghia-cac-hinh-xam-pho-bien',
    excerpt: 'Tìm hiểu ý nghĩa đằng sau những hình xăm được nhiều người lựa chọn...',
    active: false,
    createdAt: '2024-12-15',
    updatedAt: '2024-12-16',
  },
  {
    id: 4,
    title: 'Giới thiệu về Trung Địa Tattoo Studio',
    slug: 'gioi-thieu-trung-dia-tattoo',
    excerpt: 'Câu chuyện hình thành và phát triển của Trung Địa Tattoo Studio...',
    active: true,
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10',
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error'; message: string }[]>([]);

  const pushToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const toggleStatus = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    const post = posts.find((p) => p.id === id);
    pushToast('success', post?.active ? 'Đã ẩn bài viết' : 'Đã hiển thị bài viết');
  };

  const handleDelete = (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá bài viết này?')) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    pushToast('success', 'Đã xoá bài viết');
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulk = (action: 'delete' | 'show' | 'hide') => {
    if (selectedIds.size === 0) return;
    
    if (action === 'delete') {
      if (!confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.size} bài viết?`)) return;
      setPosts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      pushToast('success', `Đã xoá ${selectedIds.size} bài viết`);
    } else {
      const active = action === 'show';
      setPosts((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, active } : p))
      );
      pushToast('success', active ? 'Đã bật hiển thị' : 'Đã ẩn bài viết');
    }
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý bài viết</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Danh sách bài viết và trạng thái hiển thị
          </p>
        </div>
        <Link
          href="/admin/posts/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          + Tạo bài viết
        </Link>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm text-slate-700 dark:text-slate-200">Bulk action:</span>
          <button
            onClick={() => handleBulk('show')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Eye size={16} /> Hiển thị
          </button>
          <button
            onClick={() => handleBulk('hide')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <EyeOff size={16} /> Ẩn
          </button>
          <button
            onClick={() => handleBulk('delete')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40"
          >
            <Trash2 size={16} /> Xoá ({selectedIds.size})
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
                    checked={selectedIds.size === posts.length && posts.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                  />
                </th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Cập nhật</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Chưa có bài viết nào
                  </td>
                </tr>
              ) : (
                posts.map((post, idx) => (
                  <tr
                    key={post.id}
                    className={`${
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-800/60' : 'bg-slate-50 dark:bg-slate-800/40'
                    } border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(post.id)}
                        onChange={() => toggleSelectRow(post.id)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{post.title}</div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-md">
                        {post.excerpt}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(post.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          post.active
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30'
                            : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {post.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {post.active ? 'Đang hiển thị' : 'Nháp / Ẩn'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
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
