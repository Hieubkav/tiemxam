'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

const componentTypes = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'portfolio', label: 'Portfolio Grid' },
  { value: 'latest', label: 'Latest Works' },
  { value: 'services', label: 'Services' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'posts', label: 'Blog Posts' },
  { value: 'custom', label: 'Custom Section' },
];

export default function EditHomeComponentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as Id<'home_components'> | undefined;

  const selected = useQuery(api.homeComponents.getById, id ? { id } : 'skip');
  const updateComponent = useMutation(api.homeComponents.update);
  const removeComponent = useMutation(api.homeComponents.remove);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'hero',
    active: true,
    config: '',
  });

  useEffect(() => {
    if (!selected) return;
    setFormData({
      name: selected.name,
      type: selected.type,
      active: selected.active,
      config: selected.config ?? '',
    });
  }, [selected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);

    await updateComponent({
      id,
      name: formData.name,
      type: formData.type,
      active: formData.active,
      config: formData.config ? formData.config : undefined,
    });

    router.push('/admin/home-components');
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Bạn có chắc chắn muốn xóa component này?')) return;

    await removeComponent({ id });
    router.push('/admin/home-components');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home-components"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Chỉnh sửa component
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Cập nhật nội dung và cấu hình hiển thị
          </p>
        </div>
      </div>

      {selected === null && (
        <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
          Không tìm thấy component theo ID. Bạn có thể tạo mới hoặc cập nhật lại.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tên component
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="VD: Hero Slider"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Loại component
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {componentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Cấu hình (JSON)
            </label>
            <textarea
              value={formData.config}
              onChange={(e) => setFormData({ ...formData, config: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              rows={7}
              placeholder='{"title": "...", "items": []}'
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="active" className="text-sm text-slate-700 dark:text-slate-300">
              Hiển thị trên trang chủ
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={loading || !selected}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Đang lưu...' : 'Cập nhật'}
            </button>
            <Link
              href="/admin/home-components"
              className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-100 dark:hoverbg-slate-700 transition"
            >
              Hủy
            </Link>
          </div>
        </div>
      </form>

      <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Danger zone</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Xóa component sẽ loại bỏ khỏi danh sách hiển thị.
        </p>
        <button
          onClick={handleDelete}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <Trash2 size={16} /> Xóa component
        </button>
      </div>
    </div>
  );
}
