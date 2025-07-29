export type ProductCondition = "new" | "used" | "excellent" | "good";

export type ProductCategory = 
  | "electronics" 
  | "clothing" 
  | "furniture" 
  | "cars" 
  | "real_estate" 
  | "services" 
  | "kids" 
  | "goods";

export interface ProductSeller {
  name: string;
  avatar: string;
  rating: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  seller: ProductSeller;
  condition: ProductCondition;
  views: number;
  publishedAt: string;
}

export interface ProductCardProps {
  product: Product;
}