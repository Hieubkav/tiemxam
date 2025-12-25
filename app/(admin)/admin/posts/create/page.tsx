'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import LexicalEditor from '../../components/LexicalEditor';
import type { Id } from '@/convex/_generated/dataModel';

export default function CreatePostPage() {
  const router = useRouter();
  const createPost = useMutation(api.posts.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const contentStorageIdsRef = useRef<string[]>([]);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailStorageId, setThumbnailStorageId] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    thumbnail: '',
    active: true,
  });

  // Query URL từ storageId
  const thumbnailUrl = useQuery(
    api.files.getUrl,
    thumbnailStorageId ? { storageId: thumbnailStorageId as Id<'_storage'> } : 'skip'
  );

  // Cập nhật thumbnail URL khi có từ query
  useEffect(() => {
    if (thumbnailUrl) {
      setFormData((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
    }
  }, [thumbnailUrl]);

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
    setLoading(true);

    try {
      await createPost({
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        thumbnail: formData.thumbnail ? formData.thumbnail : undefined,
        active: formData.active,
        contentStorageIds: contentStorageIdsRef.current.length > 0 ? contentStorageIdsRef.current : undefined,
      });
      toast.success('Tạo bài viết thành công!');
      router.push('/admin/posts');
    } catch (err) {
      toast.error('Không thể tạo bài viết. Vui lòng kiểm tra slug.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (html: string, storageIds: string[]) => {
    setFormData({ ...formData, content: html });
    contentStorageIdsRef.current = storageIds;
  };

  const handleThumbnailUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) throw new Error('Upload failed');
      const { storageId } = (await res.json()) as { storageId: Id<'_storage'> };
      // Tạo local preview
      setLocalPreview(URL.createObjectURL(file));
      setThumbnailStorageId(storageId);
      toast.success('Upload ảnh thành công!');
    } catch {
      toast.error('Không thể upload ảnh');
    } finally {
      setUploading(false);
    }
  }, [generateUploadUrl]);

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleThumbnailUpload(file);
    e.target.value = '';
  };

  const handleThumbnailDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleThumbnailUpload(file);
  }, [handleThumbnailUpload]);

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: '' }));
    setThumbnailStorageId(null);
    setLocalPreview(null);
  };

  // Preview = local preview hoặc URL từ query
  const thumbnailPreview = localPreview || thumbnailUrl;

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tạo bài viết mới</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Viết và xuất bản bài viết
          </p>
        </div>
      </div>

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
                  Nội dung
                </label>
                <LexicalEditor
                  onChange={handleContentChange}
                  placeholder="Nhập nội dung bài viết..."
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
                  Xuất bản ngay
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Ảnh đại diện</h3>

              {thumbnailPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full max-h-48 object-contain rounded-lg bg-slate-100 dark:bg-slate-700"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  onDrop={handleThumbnailDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2" />
                      <p className="text-sm text-slate-500">Đang upload...</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kéo thả hoặc click để upload
                      </p>
                    </>
                  )}
                </div>
              )}

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
