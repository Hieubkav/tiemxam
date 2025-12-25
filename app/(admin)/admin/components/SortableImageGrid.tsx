'use client';

import { useState, useRef, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Upload, X, Loader2, GripVertical, RefreshCw } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { convertToWebp, getWebpFileName } from '@/lib/imageUtils';

interface ImageItem {
  id: string;
  storageId?: string;
}

interface SortableImageGridProps {
  items: Array<{ storageId?: string }>;
  onChange: (items: Array<{ storageId?: string }>) => void;
  columns?: number;
}

function SortableImageItem({
  item,
  onRemove,
  onReplace,
}: {
  item: ImageItem;
  onRemove: () => void;
  onReplace: (storageId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [localPreview, setLocalPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  const storageUrl = useQuery(
    api.files.getUrl,
    item.storageId ? { storageId: item.storageId as Id<'_storage'> } : 'skip'
  );

  const preview = localPreview || storageUrl;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const processFile = useCallback(
    async (file: File, isReplace = false) => {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      setUploading(true);

      try {
        const webpBlob = await convertToWebp(file);
        const webpFile = new File([webpBlob], getWebpFileName(file.name), {
          type: 'image/webp',
        });

        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': webpFile.type },
          body: webpFile,
        });

        if (!response.ok) throw new Error('Upload failed');

        const { storageId } = await response.json();

        if (isReplace && item.storageId) {
          try {
            await deleteFile({ storageId: item.storageId as Id<'_storage'> });
          } catch {}
        }

        const previewUrl = URL.createObjectURL(webpBlob);
        setLocalPreview(previewUrl);
        onReplace(storageId);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Lỗi khi upload ảnh');
      } finally {
        setUploading(false);
      }
    },
    [item.storageId, generateUploadUrl, deleteFile, onReplace]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file, false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleReplaceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file, true);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (uploading) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0], !!item.storageId);
    }
  };

  const handleRemove = async () => {
    if (item.storageId) {
      try {
        await deleteFile({ storageId: item.storageId as Id<'_storage'> });
      } catch {}
    }
    onRemove();
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
          />
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 p-1.5 bg-black/50 text-white rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical size={16} />
          </div>
          {/* Replace button */}
          <button
            type="button"
            onClick={() => replaceInputRef.current?.click()}
            className="absolute top-2 right-10 p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Đổi hình"
          >
            <RefreshCw size={14} />
          </button>
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Xóa"
          >
            <X size={14} />
          </button>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/*"
            onChange={handleReplaceChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <label
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDraggingFile
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
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="mt-2 text-sm text-slate-500 text-center px-2">
                  Kéo thả hoặc click
                </span>
              </>
            )}
          </label>
          {/* Remove button for empty slot */}
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 flex items-center justify-center z-10"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
}

function SortableImageGridInner({
  items,
  onChange,
  columns = 4,
}: SortableImageGridProps) {
  const [internalItems, setInternalItems] = useState<ImageItem[]>(() =>
    items.map((item, index) => ({
      id: `item-${index}-${Date.now()}`,
      storageId: item.storageId,
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = internalItems.findIndex((item) => item.id === active.id);
      const newIndex = internalItems.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(internalItems, oldIndex, newIndex);
      setInternalItems(newItems);
      onChange(newItems.map((item) => ({ storageId: item.storageId })));
    }
  };

  const handleRemove = (index: number) => {
    const newItems = internalItems.filter((_, i) => i !== index);
    setInternalItems(newItems);
    onChange(newItems.map((item) => ({ storageId: item.storageId })));
  };

  const handleReplace = (index: number, storageId: string) => {
    const newItems = [...internalItems];
    newItems[index] = { ...newItems[index], storageId };
    setInternalItems(newItems);
    onChange(newItems.map((item) => ({ storageId: item.storageId })));
  };

  const handleAdd = () => {
    const newItem: ImageItem = {
      id: `item-${internalItems.length}-${Date.now()}`,
      storageId: undefined,
    };
    const newItems = [...internalItems, newItem];
    setInternalItems(newItems);
    onChange(newItems.map((item) => ({ storageId: item.storageId })));
  };

  const gridClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={internalItems.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className={`grid ${gridClass} gap-4`}>
            {internalItems.map((item, index) => (
              <SortableImageItem
                key={item.id}
                item={item}
                onRemove={() => handleRemove(index)}
                onReplace={(storageId) => handleReplace(index, storageId)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
      >
        + Thêm hình
      </button>
    </div>
  );
}

// Wrapper với key để force re-render khi items thay đổi từ bên ngoài
export function SortableImageGrid(props: SortableImageGridProps) {
  const key = props.items.length.toString();
  return <SortableImageGridInner key={key} {...props} />;
}
