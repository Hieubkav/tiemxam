'use client';

import { useEffect, useState, useRef } from 'react';
import { Save, X, ChevronDown } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ImageUpload } from '../components/ImageUpload';

const POPULAR_COLORS = [
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Xám đậm', value: '#1F2937' },
  { name: 'Xám', value: '#6B7280' },
  { name: 'Xám nhạt', value: '#9CA3AF' },
  { name: 'Đỏ', value: '#EF4444' },
  { name: 'Đỏ đậm', value: '#DC2626' },
  { name: 'Đỏ tươi', value: '#F43F5E' },
  { name: 'Hồng', value: '#EC4899' },
  { name: 'Hồng nhạt', value: '#F472B6' },
  { name: 'Cam', value: '#F97316' },
  { name: 'Cam đậm', value: '#EA580C' },
  { name: 'Vàng', value: '#EAB308' },
  { name: 'Vàng đậm', value: '#CA8A04' },
  { name: 'Vàng nhạt', value: '#FDE047' },
  { name: 'Xanh lá', value: '#22C55E' },
  { name: 'Xanh lá đậm', value: '#16A34A' },
  { name: 'Xanh ngọc', value: '#10B981' },
  { name: 'Xanh ngọc đậm', value: '#059669' },
  { name: 'Xanh cyan', value: '#06B6D4' },
  { name: 'Xanh dương', value: '#3B82F6' },
  { name: 'Xanh dương đậm', value: '#2563EB' },
  { name: 'Xanh navy', value: '#1E3A8A' },
  { name: 'Xanh sky', value: '#0EA5E9' },
  { name: 'Tím', value: '#8B5CF6' },
  { name: 'Tím đậm', value: '#7C3AED' },
  { name: 'Tím hồng', value: '#A855F7' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Indigo đậm', value: '#4F46E5' },
  { name: 'Nâu', value: '#92400E' },
  { name: 'Nâu đậm', value: '#78350F' },
  { name: 'Nâu nhạt', value: '#D97706' },
  { name: 'Be', value: '#D4A574' },
  { name: 'Kem', value: '#FEF3C7' },
  { name: 'Vàng gold', value: '#D4AF37' },
  { name: 'Bạc', value: '#C0C0C0' },
  { name: 'Đồng', value: '#B87333' },
  { name: 'Xanh olive', value: '#808000' },
  { name: 'Xanh rêu', value: '#4D7C0F' },
  { name: 'Xanh forest', value: '#166534' },
  { name: 'Đỏ rượu', value: '#881337' },
  { name: 'Đỏ hồng', value: '#BE123C' },
  { name: 'Xanh teal', value: '#0D9488' },
  { name: 'Xanh slate', value: '#475569' },
  { name: 'Xanh zinc', value: '#3F3F46' },
  { name: 'Tím violet', value: '#5B21B6' },
  { name: 'Hồng fuchsia', value: '#C026D3' },
  { name: 'Xanh emerald', value: '#047857' },
  { name: 'Xanh lime', value: '#84CC16' },
  { name: 'Cam amber', value: '#F59E0B' },
];

export default function SettingsPage() {
  const settings = useQuery(api.settings.get, {});
  const upsertSettings = useMutation(api.settings.upsert);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(e.target as Node)) {
        setColorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [formData, setFormData] = useState({
    siteName: '',
    logoStorageId: undefined as string | undefined,
    faviconStorageId: undefined as string | undefined,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    primaryColor: '',
    phone: '',
    zalo: '',
    facebook: '',
    address: '',
  });

  useEffect(() => {
    if (!settings) return;
    setFormData({
      siteName: settings.siteName ?? '',
      logoStorageId: settings.logoStorageId,
      faviconStorageId: settings.faviconStorageId,
      seoTitle: settings.seoTitle ?? '',
      seoDescription: settings.seoDescription ?? '',
      seoKeywords: settings.seoKeywords ?? [],
      primaryColor: settings.primaryColor ?? '',
      phone: settings.phone ?? '',
      zalo: settings.zalo ?? '',
      facebook: settings.facebook ?? '',
      address: settings.address ?? '',
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await upsertSettings({
      siteName: formData.siteName || undefined,
      logoStorageId: formData.logoStorageId,
      faviconStorageId: formData.faviconStorageId,
      seoTitle: formData.seoTitle || undefined,
      seoDescription: formData.seoDescription || undefined,
      seoKeywords: formData.seoKeywords.length > 0 ? formData.seoKeywords : undefined,
      primaryColor: formData.primaryColor || undefined,
      phone: formData.phone || undefined,
      zalo: formData.zalo || undefined,
      facebook: formData.facebook || undefined,
      address: formData.address || undefined,
    });

    setLoading(false);
    setSaved(true);
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !formData.seoKeywords.includes(keyword)) {
      setFormData({ ...formData, seoKeywords: [...formData.seoKeywords, keyword] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      seoKeywords: formData.seoKeywords.filter((_, i) => i !== index),
    });
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cài đặt website</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Cấu hình thông tin hiển thị trên website
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tên website
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="Tiệm Xăm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Màu chủ đạo
              </label>
              <div className="relative" ref={colorDropdownRef}>
                <button
                  type="button"
                  onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer"
                >
                  <div
                    className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0"
                    style={{ backgroundColor: formData.primaryColor || '#E5E7EB' }}
                  />
                  <span className="flex-1 text-left">
                    {formData.primaryColor
                      ? POPULAR_COLORS.find((c) => c.value === formData.primaryColor)?.name || formData.primaryColor
                      : 'Chọn màu'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${colorDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {colorDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
                    {POPULAR_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, primaryColor: color.value });
                          setColorDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          formData.primaryColor === color.value ? 'bg-slate-100 dark:bg-slate-800' : ''
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex-shrink-0"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">{color.name}</span>
                        <span className="text-xs text-slate-400">{color.value}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logo và Favicon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Logo"
              value={formData.logoStorageId}
              onChange={(storageId) => setFormData({ ...formData, logoStorageId: storageId })}
            />
            <ImageUpload
              label="Favicon"
              value={formData.faviconStorageId}
              onChange={(storageId) => setFormData({ ...formData, faviconStorageId: storageId })}
            />
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              SEO
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                placeholder="Tiêu đề hiển thị trên Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                rows={3}
                placeholder="Mô tả hiển thị trên Google"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Từ khóa SEO
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Các từ khóa giúp khách hàng tìm thấy website (VD: tiệm xăm anh bảy, xăm hình quận 7,...)
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="Nhập từ khóa và nhấn Enter"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Thêm
                </button>
              </div>
              {formData.seoKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.seoKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="p-0.5 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Liên hệ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Thông tin liên hệ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="0123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Zalo
                </label>
                <input
                  type="text"
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="https://zalo.me/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="123 Đường ABC, Quận XYZ"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
            {saved && <span className="text-sm text-green-600">Đã lưu</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
