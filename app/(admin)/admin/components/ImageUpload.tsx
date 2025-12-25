'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { convertToWebp, getWebpFileName } from '@/lib/imageUtils';

interface ImageUploadProps {
  value?: string; // storageId
  onChange: (storageId: string | undefined) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLLabelElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  // Lấy URL từ storage khi có value
  const storageUrl = useQuery(
    api.files.getUrl,
    value ? { storageId: value as Id<'_storage'> } : 'skip'
  );

  // Sử dụng local preview nếu vừa upload, ngược lại dùng URL từ storage
  const preview = localPreview || storageUrl;

  // Reset local preview khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (!value) {
      setLocalPreview(undefined);
    }
  }, [value]);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    setUploading(true);

    try {
      // Chuyển sang webp
      const webpBlob = await convertToWebp(file);
      const webpFile = new File([webpBlob], getWebpFileName(file.name), {
        type: 'image/webp',
      });

      // Lấy upload URL từ Convex
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': webpFile.type },
        body: webpFile,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await response.json();

      // Xóa file cũ nếu có
      if (value) {
        try {
          await deleteFile({ storageId: value as Id<'_storage'> });
        } catch {
          // Ignore error
        }
      }

      // Tạo local preview
      const previewUrl = URL.createObjectURL(webpBlob);
      setLocalPreview(previewUrl);

      onChange(storageId);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi upload ảnh');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [value, onChange, generateUploadUrl, deleteFile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Chỉ set false khi rời khỏi dropzone thực sự
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await deleteFile({ storageId: value as Id<'_storage'> });
      } catch {
        // Ignore error
      }
    }
    setLocalPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative inline-block w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          ) : isDragging ? (
            <>
              <Upload className="w-8 h-8 text-indigo-500" />
              <span className="mt-2 text-sm text-indigo-600 font-medium">Thả ảnh vào đây</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-400" />
              <span className="mt-2 text-sm text-slate-500 text-center px-2">
                Kéo thả hoặc click
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
