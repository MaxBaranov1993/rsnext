"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProductsWithSellers } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { Product, ProductSeller } from '@/types/product';
import { Header } from '@/components/Header';
import { ProductFilters } from '@/components/ProductFilters';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

interface FilterState {
  priceRange: [number, number];
  location: string;
  condition: string[];
  sellerType: string[];
  verifiedOnly: boolean;
  propertyType?: string[];
  rooms?: string[];
  area?: [number, number];
  floor?: [number, number];
  carBrand?: string[];
  carYear?: [number, number];
  carMileage?: [number, number];
  carFuel?: string[];
  electronicsBrand?: string[];
  electronicsCondition?: string[];
}

// Функция для получения названия категории
function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    cars: "Авто",
    real_estate: "Недвижимость", 
    electronics: "Электроника",
    clothing: "Одежда",
    furniture: "Мебель",
    services: "Услуги",
    kids: "Детям",
    goods: "Товары"
  };
  return categories[categoryId] || "Товары";
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [productsWithSellers, setProductsWithSellers] = useState<(Product & { seller: ProductSeller })[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const selectedCategory = searchParams.get('category');

  // Состояние фильтров
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    location: "",
    condition: [],
    sellerType: [],
    verifiedOnly: false
  });

  // Загружаем товары и устанавливаем максимальную цену
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await getAllProductsWithSellers();
        setProductsWithSellers(products);
        
        // Вычисляем максимальную цену
        const prices = products.map(product => product.price);
        const max = Math.max(...prices);
        setMaxPrice(max);
        
        // Обновляем фильтр по цене с правильным максимальным значением
        setFilters(prev => ({
          ...prev,
          priceRange: [0, max]
        }));
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Фильтруем товары с мемоизацией
  const filteredProducts = useMemo(() => {
    let filtered = productsWithSellers;

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Фильтр по цене
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Фильтр по локации
    if (filters.location) {
      filtered = filtered.filter(product => 
        product.seller.location.includes(filters.location)
      );
    }

    // Фильтр по состоянию
    if (filters.condition.length > 0) {
      filtered = filtered.filter(product => 
        filters.condition.includes(product.condition)
      );
    }

    // Фильтр по типу продавца
    if (filters.sellerType.length > 0) {
      filtered = filtered.filter(product => 
        filters.sellerType.includes(product.seller.type)
      );
    }

    // Фильтр по верификации
    if (filters.verifiedOnly) {
      filtered = filtered.filter(product => product.seller.verified);
    }

    // Специфичные фильтры для недвижимости
    if (selectedCategory === 'real_estate') {
      // Здесь можно добавить логику фильтрации по типу недвижимости, комнатам и т.д.
      // Пока используем базовые фильтры
    }

    // Специфичные фильтры для авто
    if (selectedCategory === 'cars') {
      // Здесь можно добавить логику фильтрации по марке, году и т.д.
    }

    // Специфичные фильтры для электроники
    if (selectedCategory === 'electronics') {
      // Здесь можно добавить логику фильтрации по бренду
    }

    return filtered;
  }, [productsWithSellers, selectedCategory, filters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Загрузка товаров...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <div className="mb-6">
          <Breadcrumbs 
            items={[
              { label: 'Товары', href: '/products' },
              ...(selectedCategory ? [{ label: getCategoryName(selectedCategory) }] : [])
            ]} 
          />
        </div>

        {/* Заголовок и фильтры */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {selectedCategory ? getCategoryName(selectedCategory) : 'Все товары'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Найдено {filteredProducts.length} товаров
                {selectedCategory && (
                  <span className="ml-2">
                    в категории "{getCategoryName(selectedCategory)}"
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Кнопка очистки фильтра */}
              {selectedCategory && (
                <Link href="/products">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <X className="h-4 w-4" />
                    <span>Очистить фильтр</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Активный фильтр */}
          {selectedCategory && (
            <div className="flex items-center space-x-2 mb-6">
              <Badge variant="secondary" className="text-sm">
                {getCategoryName(selectedCategory)}
              </Badge>
              <Link href="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                Очистить
              </Link>
            </div>
          )}
        </div>

        {/* Основной контент с фильтрами */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <ProductFilters
              category={selectedCategory || 'goods'}
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
              totalProducts={filteredProducts.length}
            />
          </div>

          {/* Сетка товаров */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((productWithSeller) => (
                <ProductCard key={productWithSeller.id} product={productWithSeller} />
              ))}
            </div>

            {/* Сообщение если товары не найдены */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {selectedCategory ? 'Товары не найдены' : 'Товары не загружены'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {selectedCategory 
                      ? `В категории "${getCategoryName(selectedCategory)}" пока нет товаров. Попробуйте изменить фильтры или выбрать другую категорию.`
                      : 'К сожалению, товары не загружены. Попробуйте обновить страницу.'
                    }
                  </p>
                  {selectedCategory && (
                    <Link href="/products">
                      <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Посмотреть все товары
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопка "Назад" для мобильных */}
        <div className="mt-8 lg:hidden">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}