"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";

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

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 1000000],
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
      currentFilters.priceRange[1] < 1000000 ||
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
            {/* Простой тест */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Фильтры для категории: {getCategoryName(category)}</p>
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