'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Image } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as Id<'posts'> | undefined;

  const selected = useQuery(api.posts.getById, id ? { id } : 'skip');
  const updatePost = useMutation(api.posts.update);
  const removePost = useMutation(api.posts.remove);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    active: true,
  });

  useEffect(() => {
    if (!selected) return;
    setFormData({
      title: selected.title,
      slug: selected.slug,
      excerpt: selected.excerpt ?? '',
      content: selected.content,
      thumbnail: selected.thumbnail ?? '',
      active: selected.active,
    });
  }, [selected]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/d/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);

    try {
      await updatePost({
        id,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt ? formData.excerpt : undefined,
        content: formData.content,
        thumbnail: formData.thumbnail ? formData.thumbnail : undefined,
        active: formData.active,
      });
      toast.success('Cập nhật bài viết thành công!');
    } catch (err) {
      toast.error('Không thể cập nhật bài viết. Vui lòng kiểm tra slug.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    await removePost({ id });
    router.push('/admin/posts');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Chỉnh sửa bài viết</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Cập nhật nội dung và trạng thái xuất bản
          </p>
        </div>
      </div>

      {selected === null && (
        <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
          Không tìm thấy bài viết theo ID. Bạn có thể tạo mới hoặc kiểm tra lại.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  placeholder="duong-dan-bai-viet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mô tả ngắn gọn về nội dung bài viết..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nội dung
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={12}
                  placeholder="Nội dung bài viết..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">Xuất bản</h3>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm text-slate-700 dark:text-slate-300">
                  Hiển thị bài viết
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={loading || !selected}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Đang lưu...' : 'Cập nhật'}
                </button>
              </div>
              <Link
                href="/admin/posts"
                className="block text-center px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Hủy
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Ảnh đại diện</h3>

              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
                <Image size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Kéo thả hoặc click để upload
                </p>
              </div>

              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Hoặc nhập URL ảnh"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Danger zone</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Xóa bài viết sẽ không thể khôi phục.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 size={16} /> Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
