"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Filter, X, DollarSign } from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  location: string;
  condition: string[];
  sellerType: string[];
  verifiedOnly: boolean;
}

interface ProductFiltersProps {
  category: string;
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  totalProducts: number;
}

export function ProductFilters({ category, onFiltersChange, currentFilters, totalProducts }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);

  // Загружаем максимальную цену из данных товаров
  useEffect(() => {
    const loadMaxPrice = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        const prices = data.products.map((product: any) => product.price);
        const max = Math.max(...prices);
        setMaxPrice(max);
      } catch (error) {
        console.error('Ошибка загрузки максимальной цены:', error);
      }
    };

    loadMaxPrice();
  }, []);

  const getCategoryName = (categoryId: string): string => {
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
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...currentFilters,
      [key]: value
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    handleFilterChange('priceRange', [value[0], value[1]]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, maxPrice],
      location: "",
      condition: [],
      sellerType: [],
      verifiedOnly: false
    };
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return (
      currentFilters.priceRange[0] > 0 ||
      currentFilters.priceRange[1] < maxPrice ||
      currentFilters.location ||
      currentFilters.condition.length > 0 ||
      currentFilters.sellerType.length > 0 ||
      currentFilters.verifiedOnly
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Фильтры</span>
              {hasActiveFilters() && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Очистить
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Фильтр по цене */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-medium">Цена</h3>
              </div>
              
              {/* Ползунок цены */}
              <div className="space-y-3">
                <Slider
                  value={currentFilters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={maxPrice}
                  min={0}
                  step={1000}
                  className="w-full"
                />
                
                {/* Отображение выбранного диапазона */}
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>От {formatPrice(currentFilters.priceRange[0])} ₽</span>
                  <span>До {formatPrice(currentFilters.priceRange[1])} ₽</span>
                </div>
                
                {/* Быстрые кнопки для диапазонов цен */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([0, 50000])}
                    className="text-xs"
                  >
                    До 50k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([50000, 200000])}
                    className="text-xs"
                  >
                    50k-200k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([200000, 500000])}
                    className="text-xs"
                  >
                    200k-500k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([500000, maxPrice])}
                    className="text-xs"
                  >
                    500k+
                  </Button>
                </div>
              </div>
            </div>

            {/* Информация о результатах */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium">Категория: {getCategoryName(category)}</p>
              <p className="text-sm text-slate-500">Найдено товаров: {totalProducts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Button variant="outline" className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-2">
              Активные
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}