import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

export function useSellers(limit: number = 10) {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchSellers = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const data = await api.getSellers({
        page: pageNum,
        limit: limit
      });
      
      if (pageNum === 1) {
        setSellers(data.sellers);
      } else {
        setSellers(prev => [...prev, ...data.sellers]);
      }
      
      setHasMore(data.pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продавцов');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchSellers(page + 1);
    }
  }, [loading, hasMore, page, fetchSellers]);

  useEffect(() => {
    fetchSellers(1);
  }, [fetchSellers]);

  return {
    sellers,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchSellers(1)
  };
}

export function useSeller(id: string) {
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeller = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getSeller(id);
      setSeller(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продавца');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSeller();
    }
  }, [fetchSeller]);

  return {
    seller,
    loading,
    error,
    refetch: fetchSeller
  };
} 