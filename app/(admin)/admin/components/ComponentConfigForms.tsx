'use client';

import { ImageUpload } from './ImageUpload';

// Định nghĩa các loại component và cấu hình của chúng
export const componentTypes = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'portfolio', label: 'Portfolio Grid' },
  { value: 'latest', label: 'Latest Works' },
  { value: 'services', label: 'Services' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'posts', label: 'Blog Posts' },
];

// Interface cho config của từng loại
export interface HeroConfig {
  title?: string;
  subtitle?: string;
  slides: Array<{
    storageId?: string;
  }>;
}

export interface PortfolioConfig {
  title?: string;
  items: Array<{
    title: string;
    category: string;
    storageId?: string;
  }>;
}

export interface LatestConfig {
  title?: string;
  items: Array<{
    title: string;
    category: string;
    storageId?: string;
  }>;
}

export interface ServicesConfig {
  title?: string;
  services: string[];
  qualities: string[];
}

export interface TestimonialsConfig {
  title?: string;
  items: Array<{
    author: string;
    content: string;
    rating: number;
  }>;
}

export interface PostsConfig {
  title?: string;
  count: number;
}

export interface CustomConfig {
  html?: string;
}

// Props cho các form
interface FormProps<T> {
  value: T;
  onChange: (value: T) => void;
}

// Form cho Hero Banner
export function HeroForm({ value, onChange }: FormProps<HeroConfig>) {
  const slides = value.slides || [];

  const updateSlide = (index: number, storageId: string | undefined) => {
    const newSlides = [...slides];
    newSlides[index] = { storageId };
    onChange({ ...value, slides: newSlides });
  };

  const addSlide = () => {
    onChange({ ...value, slides: [...slides, {}] });
  };

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    onChange({ ...value, slides: newSlides });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tiêu đề
        </label>
        <input
          type="text"
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          placeholder="Tiêu đề hero banner"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={value.subtitle || ''}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          placeholder="Subtitle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Slides ({slides.length})
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <ImageUpload
                value={slide.storageId}
                onChange={(storageId) => updateSlide(index, storageId)}
              />
              <button
                type="button"
                onClick={() => removeSlide(index)}
                className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="mt-3 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
        >
          + Thêm slide
        </button>
      </div>
    </div>
  );
}

// Form cho Portfolio Grid
export function PortfolioForm({ value, onChange }: FormProps<PortfolioConfig>) {
  const items = value.items || [];

  const updateItem = (
    index: number,
    field: string,
    val: string | undefined
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    onChange({ ...value, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...value,
      items: [...items, { title: '', category: '' }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...value, items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tiêu đề section
        </label>
        <input
          type="text"
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          placeholder="Hình Xăm Nổi Bật"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Hình ảnh ({items.length})
        </label>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <ImageUpload
                value={item.storageId}
                onChange={(storageId) => updateItem(index, 'storageId', storageId)}
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  placeholder="Tiêu đề"
                />
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => updateItem(index, 'category', e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  placeholder="Danh mục"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
        >
          + Thêm hình
        </button>
      </div>
    </div>
  );
}

// Form cho Latest Works (giống Portfolio)
export function LatestForm({ value, onChange }: FormProps<LatestConfig>) {
  return (
    <PortfolioForm
      value={value as PortfolioConfig}
      onChange={onChange as (v: PortfolioConfig) => void}
    />
  );
}

// Form cho Services
export function ServicesForm({ value, onChange }: FormProps<ServicesConfig>) {
  const services = value.services || [];
  const qualities = value.qualities || [];

  const updateList = (
    field: 'services' | 'qualities',
    index: number,
    val: string
  ) => {
    const list = field === 'services' ? [...services] : [...qualities];
    list[index] = val;
    onChange({ ...value, [field]: list });
  };

  const addToList = (field: 'services' | 'qualities') => {
    const list = field === 'services' ? [...services, ''] : [...qualities, ''];
    onChange({ ...value, [field]: list });
  };

  const removeFromList = (field: 'services' | 'qualities', index: number) => {
    const list = field === 'services' ? [...services] : [...qualities];
    list.splice(index, 1);
    onChange({ ...value, [field]: list });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tiêu đề section
        </label>
        <input
          type="text"
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          placeholder="Dịch vụ của chúng tôi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Danh sách dịch vụ ({services.length})
        </label>
        <div className="space-y-2">
          {services.map((service, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={service}
                onChange={(e) => updateList('services', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                placeholder="Tên dịch vụ"
              />
              <button
                type="button"
                onClick={() => removeFromList('services', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addToList('services')}
          className="mt-2 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
        >
          + Thêm dịch vụ
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Cam kết chất lượng ({qualities.length})
        </label>
        <div className="space-y-2">
          {qualities.map((quality, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={quality}
                onChange={(e) => updateList('qualities', index, e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                placeholder="Cam kết"
              />
              <button
                type="button"
                onClick={() => removeFromList('qualities', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addToList('qualities')}
          className="mt-2 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
        >
          + Thêm cam kết
        </button>
      </div>
    </div>
  );
}

// Form cho Testimonials
export function TestimonialsForm({
  value,
  onChange,
}: FormProps<TestimonialsConfig>) {
  const items = value.items || [];

  const updateItem = (
    index: number,
    field: string,
    val: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    onChange({ ...value, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...value,
      items: [...items, { author: '', content: '', rating: 5 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...value, items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tiêu đề section
        </label>
        <input
          type="text"
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          placeholder="Cảm nhận khách hàng"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Đánh giá ({items.length})
        </label>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3"
            >
              <input
                type="text"
                value={item.author}
                onChange={(e) => updateItem(index, 'author', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                placeholder="Tên khách hàng"
              />
              <textarea
                value={item.content}
                onChange={(e) => updateItem(index, 'content', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                rows={3}
                placeholder="Nội dung đánh giá"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Rating:</span>
                <select
                  value={item.rating}
                  onChange={(e) =>
                    updateItem(index, 'rating', parseInt(e.target.value))
                  }
                  className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} sao
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="ml-auto text-sm text-red-600 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
        >
          + Thêm đánh giá
        </button>
      </div>
    </div>
  );
}

// Form cho Posts
export function PostsForm({ value, onChange }: FormProps<PostsConfig>) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tiêu đề section
        </label>
        <input
          type="text"
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          placeholder="Bài viết"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Số bài viết hiển thị
        </label>
        <input
          type="number"
          value={value.count || 4}
          onChange={(e) =>
            onChange({ ...value, count: parseInt(e.target.value) || 4 })
          }
          className="w-32 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          min={1}
          max={12}
        />
      </div>
    </div>
  );
}

// Form cho Custom Section
export function CustomForm({ value, onChange }: FormProps<CustomConfig>) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Nội dung HTML
        </label>
        <textarea
          value={value.html || ''}
          onChange={(e) => onChange({ ...value, html: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          rows={10}
          placeholder="<div>Nội dung tùy chỉnh...</div>"
        />
      </div>
    </div>
  );
}

// Component chính render form dựa theo type
interface DynamicFormProps {
  type: string;
  config: unknown;
  onChange: (config: unknown) => void;
}

export function ComponentConfigForm({ type, config, onChange }: DynamicFormProps) {
  switch (type) {
    case 'hero':
      return (
        <HeroForm
          value={(config as HeroConfig) || { slides: [] }}
          onChange={onChange}
        />
      );
    case 'portfolio':
      return (
        <PortfolioForm
          value={(config as PortfolioConfig) || { items: [] }}
          onChange={onChange}
        />
      );
    case 'latest':
      return (
        <LatestForm
          value={(config as LatestConfig) || { items: [] }}
          onChange={onChange}
        />
      );
    case 'services':
      return (
        <ServicesForm
          value={(config as ServicesConfig) || { services: [], qualities: [] }}
          onChange={onChange}
        />
      );
    case 'testimonials':
      return (
        <TestimonialsForm
          value={(config as TestimonialsConfig) || { items: [] }}
          onChange={onChange}
        />
      );
    case 'posts':
      return (
        <PostsForm
          value={(config as PostsConfig) || { count: 4 }}
          onChange={onChange}
        />
      );
    case 'custom':
      return (
        <CustomForm
          value={(config as CustomConfig) || {}}
          onChange={onChange}
        />
      );
    default:
      return (
        <p className="text-slate-500 dark:text-slate-400">
          Không có form cho loại component này
        </p>
      );
  }
}
