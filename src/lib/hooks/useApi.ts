import { useState, useEffect, useCallback } from 'react';
import { api, Product, User, Category, Favorite, Listing } from '../api';

// Хук для работы с продуктами
export function useProducts(params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await api.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      const updatedProduct = await api.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

// Хук для работы с одним продуктом
export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продукта');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

// Хук для работы с пользователями
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}

// Хук для работы с одним пользователем
export function useUser(id: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUser(id);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки пользователя');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

// Хук для работы с категориями
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

// Хук для работы с избранным
export function useFavorites(userId: number) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUserFavorites(userId);
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки избранного');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addToFavorites = async (productId: number) => {
    try {
      const newFavorite = await api.addToFavorites(userId, productId);
      setFavorites(prev => [...prev, newFavorite]);
      return newFavorite;
    } catch (err) {
      throw err;
    }
  };

  const removeFromFavorites = async (id: number) => {
    try {
      await api.removeFromFavorites(id);
      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    addToFavorites,
    removeFromFavorites,
  };
}

// Хук для работы с объявлениями
export function useListings(userId: number, status?: string) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUserListings(userId, status);
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки объявлений');
    } finally {
      setLoading(false);
    }
  }, [userId, status]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const createListing = async (listing: Omit<Listing, 'id'>) => {
    try {
      const newListing = await api.createListing(listing);
      setListings(prev => [...prev, newListing]);
      return newListing;
    } catch (err) {
      throw err;
    }
  };

  const updateListingStatus = async (id: number, status: Listing['status']) => {
    try {
      const updatedListing = await api.updateListingStatus(id, status);
      setListings(prev => prev.map(l => l.id === id ? updatedListing : l));
      return updatedListing;
    } catch (err) {
      throw err;
    }
  };

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
    createListing,
    updateListingStatus,
  };
}

// Хук для поиска продуктов
export function useProductSearch() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.searchProducts(query);
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка поиска');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchProducts,
  };
} 