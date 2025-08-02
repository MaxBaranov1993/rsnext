"use client";

import { useState, useEffect } from 'react';
import { Product, ProductSeller } from '@/types/product';

interface UseProductsOptions {
  category?: string;
  search?: string;
  limit?: number;
  sortBy?: 'price' | 'views' | 'publishedAt';
  sortOrder?: 'asc' | 'desc';
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем данные из JSON файла
        const response = await fetch('/data/products.json', {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        let filteredProducts = data.products || [];

        // Фильтрация по категории
        if (options.category) {
          filteredProducts = filteredProducts.filter(
            (product: Product) => product.category === options.category
          );
        }

        // Поиск по названию
        if (options.search) {
          const searchLower = options.search.toLowerCase();
          filteredProducts = filteredProducts.filter((product: Product) =>
            product.title.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
          );
        }

        // Сортировка
        if (options.sortBy) {
          filteredProducts.sort((a: Product, b: Product) => {
            let aValue: string | number = a[options.sortBy!];
            let bValue: string | number = b[options.sortBy!];

            // Обработка дат
            if (options.sortBy === 'publishedAt') {
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
          filteredProducts = filteredProducts.slice(0, options.limit);
        }

        setProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.category, options.search, options.limit, options.sortBy, options.sortOrder]);

  return { products, loading, error };
}

// Хук для получения одного продукта по ID
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/products.json', {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        const foundProduct = data.products.find((p: Product) => p.id === id);

        if (!foundProduct) {
          throw new Error('Product not found');
        }

        setProduct(foundProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

// Хук для получения товаров с данными продавцов
export function useProductsWithSellers(options: UseProductsOptions = {}) {
  const [productsWithSellers, setProductsWithSellers] = useState<(Product & { seller: ProductSeller | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsWithSellers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем данные товаров и продавцов
        const [productsResponse, sellersResponse] = await Promise.all([
          fetch('/data/products.json', {
            headers: {
              'Accept': 'application/json',
            },
          }),
          fetch('/data/sellers.json', {
            headers: {
              'Accept': 'application/json',
            },
          })
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

        // Объединяем товары с данными продавцов
        let productsWithSellers = products.map((product: Product) => {
          const seller = sellers.find((s: ProductSeller) => s.id === product.sellerId);
          return {
            ...product,
            seller: seller || null
          };
        });

        // Фильтрация по категории
        if (options.category) {
          productsWithSellers = productsWithSellers.filter(
            (product: Product & { seller: ProductSeller | null }) => product.category === options.category
          );
        }

        // Поиск по названию
        if (options.search) {
          const searchLower = options.search.toLowerCase();
          productsWithSellers = productsWithSellers.filter((product: Product & { seller: ProductSeller | null }) =>
            product.title.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
          );
        }

        // Сортировка
        if (options.sortBy) {
          productsWithSellers.sort((a: Product & { seller: ProductSeller | null }, b: Product & { seller: ProductSeller | null }) => {
            let aValue: string | number = a[options.sortBy!];
            let bValue: string | number = b[options.sortBy!];

            // Обработка дат
            if (options.sortBy === 'publishedAt') {
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
          productsWithSellers = productsWithSellers.slice(0, options.limit);
        }

        setProductsWithSellers(productsWithSellers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithSellers();
  }, [options.category, options.search, options.limit, options.sortBy, options.sortOrder]);

  return { products: productsWithSellers, loading, error };
}