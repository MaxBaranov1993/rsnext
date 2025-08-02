"use client";

import { useState, useEffect } from 'react';
import { ProductSeller } from '@/types/product';

interface UseSellersOptions {
  type?: 'individual' | 'company';
  location?: string;
  verified?: boolean;
  limit?: number;
  sortBy?: 'rating' | 'totalSales' | 'memberSince';
  sortOrder?: 'asc' | 'desc';
}

export function useSellers(options: UseSellersOptions = {}) {
  const [sellers, setSellers] = useState<ProductSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем данные из JSON файла
        const response = await fetch('/data/sellers.json', {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sellers');
        }

        const data = await response.json();
        let filteredSellers = data.sellers || [];

        // Фильтрация по типу
        if (options.type) {
          filteredSellers = filteredSellers.filter(
            (seller: ProductSeller) => seller.type === options.type
          );
        }

        // Фильтрация по локации
        if (options.location) {
          filteredSellers = filteredSellers.filter(
            (seller: ProductSeller) => seller.location === options.location
          );
        }

        // Фильтрация по верификации
        if (options.verified !== undefined) {
          filteredSellers = filteredSellers.filter(
            (seller: ProductSeller) => seller.verified === options.verified
          );
        }

        // Сортировка
        if (options.sortBy) {
          filteredSellers.sort((a: ProductSeller, b: ProductSeller) => {
            let aValue: string | number = a[options.sortBy!];
            let bValue: string | number = b[options.sortBy!];

            // Обработка дат
            if (options.sortBy === 'memberSince') {
              aValue = new Date(aValue).getTime();
              bValue = new Date(bValue).getTime();
            }

            // Приведение к числу для арифметических операций
            const aNum = typeof aValue === 'number' ? aValue : Number(aValue);
            const bNum = typeof bValue === 'number' ? bValue : Number(bValue);

            if (options.sortOrder === 'desc') {
              return bNum - aNum;
            }
            return aNum - bNum;
          });
        }

        // Ограничение количества
        if (options.limit) {
          filteredSellers = filteredSellers.slice(0, options.limit);
        }

        setSellers(filteredSellers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [options.type, options.location, options.verified, options.limit, options.sortBy, options.sortOrder]);

  return { sellers, loading, error };
}

// Хук для получения одного продавца по ID
export function useSeller(id: string) {
  const [seller, setSeller] = useState<ProductSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/sellers.json', {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sellers');
        }

        const data = await response.json();
        const foundSeller = data.sellers.find((s: ProductSeller) => s.id === id);

        if (!foundSeller) {
          throw new Error('Seller not found');
        }

        setSeller(foundSeller);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch seller');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeller();
    }
  }, [id]);

  return { seller, loading, error };
} 