'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const sampleUsers = [
  {
    id: 1,
    name: 'Admin Trung Dia',
    email: 'admin@trungdiatattoo.vn',
    role: 'admin',
    active: true,
  },
  {
    id: 2,
    name: 'Le Anh',
    email: 'editor@trungdiatattoo.vn',
    role: 'editor',
    active: true,
  },
  {
    id: 3,
    name: 'Minh Chau',
    email: 'staff@trungdiatattoo.vn',
    role: 'staff',
    active: false,
  },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const userId = Number(rawId);

  const selected = useMemo(() => sampleUsers.find((u) => u.id === userId), [userId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
    password: '',
    confirm: '',
    active: true,
  });

  useEffect(() => {
    if (!selected) return;
    setFormData({
      name: selected.name,
      email: selected.email,
      role: selected.role,
      password: '',
      confirm: '',
      active: selected.active,
    });
  }, [selected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password && formData.password !== formData.confirm) {
      setError('Mật khẩu và xác nhận không khớp.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success('Cập nhật người dùng thành công!');
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
    alert('Đã xóa người dùng!');
    router.push('/admin/users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Chỉnh sửa người dùng</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Cập nhật thông tin và phân quyền tài khoản
          </p>
        </div>
      </div>

      {!selected && (
        <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
          Không tìm thấy người dùng theo ID. Bạn có thể tạo mới hoặc cập nhật lại.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-500/40">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhap ten nguoi dung"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="email@domain.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Mật khẩu mới (tuỳ chọn)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="********"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="********"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="staff">Staff</option>
                </select>
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
                  Kích hoạt tài khoản
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Đang lưu...' : 'Cập nhật'}
                </button>
              </div>
              <Link
                href="/admin/users"
                className="block text-center px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Huỷ
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Danger zone</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Xóa người dùng sẽ không thể khôi phục.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 size={16} /> Xóa người dùng
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
