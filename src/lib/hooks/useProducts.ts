import { useState, useEffect, useCallback } from "react";
import { api, Product } from "../api";

export function useProducts(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const data = await api.getProducts({
        page: pageNum,
        limit: limit,
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });
      
      if (pageNum === 1) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      
      setHasMore(data.pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(page + 1);
    }
  }, [loading, hasMore, page, fetchProducts]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchProducts(1)
  };
}