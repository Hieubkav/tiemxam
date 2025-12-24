import { TattooProject, Testimonial, NewsPost } from './types';

export const HERO_IMAGES = [
  'https://picsum.photos/seed/tattoo_h1/1920/1080',
  'https://picsum.photos/seed/tattoo_h2/1920/1080',
  'https://picsum.photos/seed/tattoo_h3/1920/1080',
  'https://picsum.photos/seed/tattoo_h4/1920/1080',
];

export const PORTFOLIO_ITEMS: TattooProject[] = [
  { id: '1', title: 'Japanese Art', category: 'Oriental', imageUrl: 'https://picsum.photos/seed/t1/800/1000' },
  { id: '2', title: 'Back Piece', category: 'Oriental', imageUrl: 'https://picsum.photos/seed/t2/800/1000' },
  { id: '3', title: 'Blackwork', category: 'Modern', imageUrl: 'https://picsum.photos/seed/t3/800/1000' },
  { id: '4', title: 'Traditional', category: 'Classic', imageUrl: 'https://picsum.photos/seed/t4/800/1000' },
];

export const LATEST_ITEMS: TattooProject[] = [
  { id: '5', title: 'Realism', category: 'New', imageUrl: 'https://picsum.photos/seed/t5/800/1000' },
  { id: '6', title: 'Geometric', category: 'New', imageUrl: 'https://picsum.photos/seed/t6/800/1000' },
  { id: '7', title: 'Small Art', category: 'New', imageUrl: 'https://picsum.photos/seed/t7/800/1000' },
  { id: '8', title: 'Sleeve', category: 'New', imageUrl: 'https://picsum.photos/seed/t8/800/1000' },
];

export const SERVICE_LIST = [
  'Xăm hình nghệ thuật theo yêu cầu & thiết kế riêng',
  'Sửa hình xăm cũ, che khuyết điểm và sẹo lồi',
  'Xóa xăm bằng công nghệ Laser hiện đại không để lại sẹo',
  'Đào tạo học viên chuyên nghiệp từ cơ bản đến nâng cao'
];

export const QUALITY_LIST = [
  'Sử dụng kim xăm 1 lần (Single-use) vô trùng tuyệt đối',
  'Mực xăm nhập khẩu cao cấp, an toàn cho da',
  'Quy trình vệ sinh chuẩn y tế',
  'Máy xăm hiện đại giảm thiểu tối đa đau đớn'
];

export const TESTIMONIALS: Testimonial[] = [
  { 
    author: 'Hoàng Long', 
    rating: 5, 
    content: 'Kỹ thuật xăm rất tốt, đường nét sắc sảo đúng ý mình. Tuy nhiên tiệm khá đông nên phải chờ lâu dù đã đặt lịch trước, mong shop cải thiện khâu sắp xếp thời gian.' 
  },
  { 
    author: 'Minh Anh', 
    rating: 5, 
    content: 'Không gian sạch sẽ, dụng cụ niêm phong rõ ràng nên mình rất an tâm. Điểm trừ duy nhất là giá hơi cao so với mặt bằng chung nhưng chất lượng thì hoàn toàn xứng đáng.' 
  }
];

export const NEWS: NewsPost[] = [
  { date: '', month: '', title: 'Ý Nghĩa Dreamcatcher', excerpt: '', imageUrl: 'https://picsum.photos/seed/n1/500/500' },
  { date: '', month: '', title: 'Biểu Tượng Hình Voi', excerpt: '', imageUrl: 'https://picsum.photos/seed/n2/500/500' },
  { date: '', month: '', title: 'Hình Xăm Phật Giáo', excerpt: '', imageUrl: 'https://picsum.photos/seed/n3/500/500' },
  { date: '', month: '', title: 'Chăm Sóc Sau Xăm', excerpt: '', imageUrl: 'https://picsum.photos/seed/n4/500/500' },
];
