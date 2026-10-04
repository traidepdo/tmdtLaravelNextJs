export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  cover_image?: string | null;
  description?: string | null;
  products_count?: number;
  followers_count?: number;
  is_followed?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  image?: string | null;
  products_count?: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  color_name: string;
  color_code: string;
  size: string;
  stock_quantity: number;
  price: number;
  sale_price?: number | null;
  image_url?: string | null;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string | null;
  is_thumbnail: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  brand_id: number;
  category_id: number;
  name: string;
  slug: string;
  sku_prefix: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  material?: string | null;
  care_instructions?: string | null;
  short_description?: string | null;
  description?: string | null;
  base_price: number;
  sale_price?: number | null;
  count_buy?: number;
  is_featured: boolean;
  is_active: boolean;
  is_saved?: boolean;
  brand?: Brand;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}
