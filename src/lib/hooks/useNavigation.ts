"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Переход на страницу товара
  const navigateToProduct = useCallback((productId: string) => {
    router.push(`/product/${productId}`);
  }, [router]);

  // Переход на страницу товаров с фильтрами
  const navigateToProducts = useCallback((filters?: {
    category?: string;
    search?: string;
    priceRange?: [number, number];
    location?: string;
    condition?: string[];
    sellerType?: string[];
    verifiedOnly?: boolean;
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.set('category', filters.category);
    }
    
    if (filters?.search) {
      params.set('search', filters.search);
    }
    
    if (filters?.priceRange) {
      params.set('minPrice', filters.priceRange[0].toString());
      params.set('maxPrice', filters.priceRange[1].toString());
    }
    
    if (filters?.location) {
      params.set('location', filters.location);
    }
    
    if (filters?.condition && filters.condition.length > 0) {
      params.set('condition', filters.condition.join(','));
    }
    
    if (filters?.sellerType && filters.sellerType.length > 0) {
      params.set('sellerType', filters.sellerType.join(','));
    }
    
    if (filters?.verifiedOnly) {
      params.set('verifiedOnly', 'true');
    }
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    router.push(url);
  }, [router]);

  // Переход на главную страницу
  const navigateToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  // Переход на страницу профиля
  const navigateToProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  // Переход на страницу избранного
  const navigateToFavorites = useCallback(() => {
    router.push('/favorites');
  }, [router]);

  // Переход на страницу добавления товара
  const navigateToAddListing = useCallback(() => {
    router.push('/add-listing');
  }, [router]);

  // Переход назад
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // Получение текущих параметров поиска
  const getCurrentFilters = useCallback(() => {
    return {
      category: searchParams.get('category'),
      search: searchParams.get('search'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      location: searchParams.get('location'),
      condition: searchParams.get('condition')?.split(',') || [],
      sellerType: searchParams.get('sellerType')?.split(',') || [],
      verifiedOnly: searchParams.get('verifiedOnly') === 'true',
    };
  }, [searchParams]);

  return {
    navigateToProduct,
    navigateToProducts,
    navigateToHome,
    navigateToProfile,
    navigateToFavorites,
    navigateToAddListing,
    goBack,
    getCurrentFilters,
  };
} 