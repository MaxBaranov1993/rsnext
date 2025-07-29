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

export interface CompanyInfo {
  legalName: string;
  inn: string;
  address: string;
  phone: string;
  website: string;
}

export interface ProductSeller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  memberSince: string;
  totalSales: number;
  responseTime: string;
  type: "individual" | "company";
  location: string;
  verified: boolean;
  description: string;
  companyInfo?: CompanyInfo;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  sellerId: string;
  condition: ProductCondition;
  views: number;
  publishedAt: string;
  description?: string;
  seller?: ProductSeller | null;
}

export interface ProductCardProps {
  product: Product;
}