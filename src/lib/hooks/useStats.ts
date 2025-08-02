"use client";

import { useState, useEffect } from 'react';

interface Stats {
  totalProducts: number;
  totalSellers: number;
  totalCategories: number;
  averagePrice: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем данные из JSON файлов
        const [productsResponse, sellersResponse] = await Promise.all([
          fetch('/data/products.json'),
          fetch('/data/sellers.json')
        ]);

        if (!productsResponse.ok || !sellersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [productsData, sellersData] = await Promise.all([
          productsResponse.json(),
          sellersResponse.json()
        ]);

        const products = productsData.products || [];
        const sellers = sellersData.sellers || [];

        // Вычисляем статистику
        const totalProducts = products.length;
        const totalSellers = sellers.length;
        
        // Подсчитываем уникальные категории
        const categories = [...new Set(products.map((p: { category: string }) => p.category))];
        const totalCategories = categories.length;

        // Средняя цена
        const totalPrice = products.reduce((sum: number, p: { price: number }) => sum + p.price, 0);
        const averagePrice = totalPrice / totalProducts;

        // Топ категории
        const categoryCounts: { [key: string]: number } = {};
        products.forEach((p: { category: string }) => {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });

        const topCategories = Object.entries(categoryCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Топ локации
        const locationCounts: { [key: string]: number } = {};
        products.forEach((p: { location: string }) => {
          locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
        });

        const topLocations = Object.entries(locationCounts)
          .map(([location, count]) => ({ location, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalProducts,
          totalSellers,
          totalCategories,
          averagePrice,
          topCategories,
          topLocations
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
} 