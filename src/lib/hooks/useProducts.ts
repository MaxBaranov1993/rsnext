import { useState, useEffect } from 'react';
import { Product, ProductSeller } from '@/types/product';

interface UseProductsReturn {
  products: (Product & { seller: ProductSeller })[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useProducts(initialCount: number = 15): UseProductsReturn {
  const [products, setProducts] = useState<(Product & { seller: ProductSeller })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем продукты и продавцов
        const [productsResponse, sellersResponse] = await Promise.all([
          fetch('/data/products.json'),
          fetch('/data/sellers.json')
        ]);
        
        if (!productsResponse.ok || !sellersResponse.ok) {
          throw new Error('Не удалось загрузить данные');
        }
        
        const productsData = await productsResponse.json();
        const sellersData = await sellersResponse.json();
        
        // Объединяем продукты с данными продавцов
        const productsWithSellers = productsData.products.map((product: Product) => {
          const seller = sellersData.sellers.find((s: ProductSeller) => s.id === product.sellerId);
          return { ...product, seller };
        }).filter((product: any) => product.seller);
        
        setProducts(productsWithSellers);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => prev + 15);
  };

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return {
    products: visibleProducts,
    loading,
    error,
    hasMore,
    loadMore
  };
}