"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000000]);

  // Загружаем максимальную цену из данных товаров
  useEffect(() => {
    const loadMaxPrice = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        const prices = data.products.map((product: any) => product.price);
        const max = Math.max(...prices);
        setMaxPrice(max);
        setLocalPriceRange([0, max]);
      } catch (error) {
        console.error('Ошибка загрузки максимальной цены:', error);
      }
    };

    loadMaxPrice();
  }, []);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setLocalPriceRange(currentFilters.priceRange);
  }, [currentFilters.priceRange]);

  const getCategoryName = useCallback((categoryId: string): string => {
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
  }, []);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...currentFilters,
      [key]: value
    });
  }, [currentFilters, onFiltersChange]);

  // Debounced функция для изменения цены
  const debouncedPriceChange = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: number[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleFilterChange('priceRange', [value[0], value[1]]);
        }, 300);
      };
    })(),
    [handleFilterChange]
  );

  const handlePriceRangeChange = useCallback((value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
    debouncedPriceChange(value);
  }, [debouncedPriceChange]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  }, []);

  const clearFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      priceRange: [0, maxPrice],
      location: "",
      condition: [],
      sellerType: [],
      verifiedOnly: false
    };
    onFiltersChange(defaultFilters);
  }, [maxPrice, onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      currentFilters.priceRange[0] > 0 ||
      currentFilters.priceRange[1] < maxPrice ||
      currentFilters.location ||
      currentFilters.condition.length > 0 ||
      currentFilters.sellerType.length > 0 ||
      currentFilters.verifiedOnly
    );
  }, [currentFilters, maxPrice]);

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
      <div className="hidden lg:block w-full">
        <Card className="h-fit min-h-[600px] w-full sticky top-4">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between min-h-[32px]">
              <span>Фильтры</span>
              <div className="min-w-[80px] flex justify-end">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Очистить
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 h-full w-full">
            {/* Фильтр по цене */}
            <div className="space-y-4 w-full">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <h3 className="text-sm font-medium">Цена</h3>
              </div>
              
              {/* Ползунок цены */}
              <div className="space-y-3 w-full">
                {/* Инпуты для диапазона цен */}
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">От</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={localPriceRange[0] === 0 ? "" : localPriceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        handlePriceRangeChange([value, localPriceRange[1]]);
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">До</label>
                    <Input
                      type="number"
                      placeholder={maxPrice.toString()}
                      value={localPriceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || maxPrice;
                        handlePriceRangeChange([localPriceRange[0], value]);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                {/* Отображение выбранного диапазона */}
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 min-h-[20px] w-full">
                  <span className="whitespace-nowrap">От {formatPrice(localPriceRange[0])} ₽</span>
                  <span className="whitespace-nowrap">До {formatPrice(localPriceRange[1])} ₽</span>
                </div>
                
                {/* Быстрые кнопки для диапазонов цен */}
                <div className="flex flex-wrap gap-2 min-h-[40px] w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([0, 50000])}
                    className="text-xs flex-shrink-0"
                  >
                    До 50k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([50000, 200000])}
                    className="text-xs flex-shrink-0"
                  >
                    50k-200k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([200000, 500000])}
                    className="text-xs flex-shrink-0"
                  >
                    200k-500k
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeChange([500000, maxPrice])}
                    className="text-xs flex-shrink-0"
                  >
                    500k+
                  </Button>
                </div>
              </div>
            </div>

            {/* Информация о результатах */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700 min-h-[80px] w-full">
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
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Активные
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}