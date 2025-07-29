const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://your-production-api.com';

// Типы для API
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  seller: {
    id: number;
    name: string;
    rating: number;
    verified: boolean;
  };
  location: string;
  condition: 'new' | 'like_new' | 'used';
  createdAt: string;
  views: number;
  favorites: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: number;
  memberSince: string;
  totalSales: number;
  responseTime: string;
  type: 'individual' | 'company';
  location: string;
  verified: boolean;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
}

export interface Listing {
  id: number;
  userId: number;
  productId: number;
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// API класс для работы с JSON Server
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Общий метод для запросов
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ===== PRODUCTS API =====
  
  // Получить все продукты
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    condition?: string;
    sellerId?: string;
  }): Promise<{ products: Product[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.condition) searchParams.append('condition', params.condition);
    if (params?.sellerId) searchParams.append('sellerId', params.sellerId);

    const queryString = searchParams.toString();
    return this.request<{ products: Product[]; pagination: any }>(`/api/products${queryString ? `?${queryString}` : ''}`);
  }

  // Получить продукт по ID
  async getProduct(id: string): Promise<Product & { seller: any }> {
    return this.request<Product & { seller: any }>(`/api/products/${id}`);
  }

  // Создать новый продукт
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // Обновить продукт
  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  // Удалить продукт
  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== SELLERS API =====
  
  // Получить всех продавцов
  async getSellers(params?: {
    search?: string;
    type?: string;
    verified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ sellers: any[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.verified !== undefined) searchParams.append('verified', params.verified.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    return this.request<{ sellers: any[]; pagination: any }>(`/api/sellers${queryString ? `?${queryString}` : ''}`);
  }

  // Получить продавца по ID
  async getSeller(id: string): Promise<any> {
    return this.request<any>(`/api/sellers/${id}`);
  }

  // Создать продавца
  async createSeller(seller: Omit<any, 'id'>): Promise<any> {
    return this.request<any>('/api/sellers', {
      method: 'POST',
      body: JSON.stringify(seller),
    });
  }

  // Обновить продавца
  async updateSeller(id: string, seller: Partial<any>): Promise<any> {
    return this.request<any>(`/api/sellers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(seller),
    });
  }

  // Удалить продавца
  async deleteSeller(id: string): Promise<void> {
    return this.request<void>(`/api/sellers/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== USERS API =====
  
  // Получить всех пользователей
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  // Получить пользователя по ID
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // Создать пользователя
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Обновить пользователя
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  // ===== CATEGORIES API =====
  
  // Получить все категории
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  // ===== FAVORITES API =====
  
  // Получить избранное пользователя
  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return this.request<Favorite[]>(`/favorites?userId=${userId}`);
  }

  // Добавить в избранное
  async addToFavorites(userId: number, productId: number): Promise<Favorite> {
    return this.request<Favorite>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ userId, productId }),
    });
  }

  // Удалить из избранного
  async removeFromFavorites(id: number): Promise<void> {
    return this.request<void>(`/favorites/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== LISTINGS API =====
  
  // Получить объявления пользователя
  async getUserListings(userId: number, status?: string): Promise<Listing[]> {
    const params = new URLSearchParams();
    params.append('userId', userId.toString());
    if (status) params.append('status', status);
    
    return this.request<Listing[]>(`/listings?${params.toString()}`);
  }

  // Создать объявление
  async createListing(listing: Omit<Listing, 'id'>): Promise<Listing> {
    return this.request<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  }

  // Обновить статус объявления
  async updateListingStatus(id: number, status: Listing['status']): Promise<Listing> {
    return this.request<Listing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        status,
        updatedAt: new Date().toISOString()
      }),
    });
  }

  // ===== ADVANCED QUERIES =====
  
  // Получить продукты с информацией о продавце
  async getProductsWithSeller(): Promise<Product[]> {
    return this.request<Product[]>('/products?_embed=seller');
  }

  // Получить продукты по категории с пагинацией
  async getProductsByCategory(
    category: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<Product[]> {
    return this.request<Product[]>(
      `/products?category=${category}&_page=${page}&_limit=${limit}`
    );
  }

  // Поиск продуктов
  async searchProducts(query: string): Promise<Product[]> {
    return this.request<Product[]>(`/products?q=${encodeURIComponent(query)}`);
  }

  // Получить статистику
  async getStats(): Promise<any> {
    return this.request<any>('/api/stats');
  }
}

// Создаем экземпляр API сервиса
export const api = new ApiService(API_BASE);

// Экспортируем типы
export type { Product, User, Category, Favorite, Listing }; 