export interface TattooProject {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface Testimonial {
  author: string;
  rating: number;
  content: string;
  role?: string;
}

export interface NewsPost {
  date: string;
  month: string;
  title: string;
  excerpt: string;
  imageUrl: string;
}
