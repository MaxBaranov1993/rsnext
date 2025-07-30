"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Trash2, MapPin, User, Star, ShoppingBag, Wrench } from 'lucide-react';
import { useFavorites } from '@/lib/contexts/FavoritesContext';
import { Product, ProductSeller } from '@/types/product';
import { useProductImages } from '@/lib/hooks/useProductImages';
import Link from 'next/link';
import { truncateProductTitleForCard } from '@/lib/utils';

interface FavoritesModalProps {
  trigger?: React.ReactNode;
}

export function FavoritesModal({ trigger }: FavoritesModalProps) {
  const { favorites, removeFromFavorites, clearFavorites, favoritesCount } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getConditionText = (condition: string) => {
    const conditions = {
      new: "Новый",
      excellent: "Отличное",
      good: "Хорошее",
      fair: "Удовлетворительное"
    };
    return conditions[condition as keyof typeof conditions] || "Не указано";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      electronics: "📱",
      clothing: "👕",
      furniture: "🪑",
      cars: "🚗",
      real_estate: "🏠",
      services: "🔧",
      kids: "🧸",
      goods: "📦"
    };
    return icons[category as keyof typeof icons] || "📦";
  };

  const getCategoryText = (category: string) => {
    const categories = {
      electronics: "Электроника",
      clothing: "Одежда",
      furniture: "Мебель",
      cars: "Автомобили",
      real_estate: "Недвижимость",
      services: "Услуги",
      kids: "Детские товары",
      goods: "Товары"
    };
    return categories[category as keyof typeof categories] || "Товары";
  };

  // Разделяем товары и услуги
  const products = favorites.filter(item => item.category !== 'services');
  const services = favorites.filter(item => item.category === 'services');

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
  };

  const handleClearFavorites = () => {
    clearFavorites();
  };

  const FavoriteItem = ({ product }: { product: Product }) => {
    const { images, loading } = useProductImages({
      productTitle: product.title,
      category: product.category,
      count: 1
    });

    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Изображение */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {!loading && images && images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {getCategoryIcon(product.category)}
                  </div>
                )}
              </div>
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 text-xs"
              >
                {getConditionText(product.condition)}
              </Badge>
            </div>

            {/* Информация о товаре */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/product/${product.id}`}
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                      {truncateProductTitleForCard(product.title)}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryText(product.category)}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {getCategoryIcon(product.category)}
                    </span>
                  </div>

                                     {/* Location and Address */}
                   <div className="mt-2 space-y-1">
                     <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                       <div className="flex items-center justify-center w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                         <MapPin className="w-2 h-2 text-blue-600 dark:text-blue-400" />
                       </div>
                       <span className="truncate font-medium">{product.location || 'Местоположение не указано'}</span>
                     </div>
                     {product.address && (
                       <div className="flex items-center gap-1 ml-4">
                         <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                         <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                           {product.street && product.houseNumber ? (
                             <>
                               <span className="text-slate-400 dark:text-slate-500">ул. </span>
                               <span className="text-slate-500 dark:text-slate-400">{product.street}</span>
                               <span className="text-slate-400 dark:text-slate-500">, </span>
                               <span className="text-slate-500 dark:text-slate-400">{product.houseNumber}</span>
                             </>
                           ) : (
                             product.address
                           )}
                         </span>
                       </div>
                     )}
                   </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(product.price)} ₽
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{product.views}</span>
                    </div>
                  </div>
                </div>

                {/* Кнопка удаления */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleRemoveFromFavorites(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className="relative">
            <Heart className="h-4 w-4" />
            {favoritesCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {favoritesCount}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Избранные товары и услуги
            {favoritesCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {favoritesCount}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {favoritesCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Список избранного пуст
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Добавьте товары и услуги в избранное, чтобы они отображались здесь
            </p>
            <Button onClick={() => setIsOpen(false)}>
              Перейти к товарам
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Кнопки управления */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Товары: {products.length}
                </span>
                <Wrench className="h-4 w-4 ml-4" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Услуги: {services.length}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFavorites}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить все
              </Button>
            </div>

            {/* Табы для товаров и услуг */}
            <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="all">Все ({favoritesCount})</TabsTrigger>
                <TabsTrigger value="products">Товары ({products.length})</TabsTrigger>
                <TabsTrigger value="services">Услуги ({services.length})</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4 min-h-0">
                <TabsContent value="all" className="space-y-3">
                  {favorites.map((product) => (
                    <FavoriteItem key={product.id} product={product} />
                  ))}
                </TabsContent>

                <TabsContent value="products" className="space-y-3">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <FavoriteItem key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      Нет избранных товаров
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="services" className="space-y-3">
                  {services.length > 0 ? (
                    services.map((product) => (
                      <FavoriteItem key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      Нет избранных услуг
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 