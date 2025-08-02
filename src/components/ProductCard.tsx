"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Product, ProductSeller } from "@/types/product";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { Suspense } from "react";
import { Heart, MapPin, User, Star, Shield, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { truncateProductTitleForCard } from "@/lib/utils";

interface ProductCardProps {
  product: Product & { seller?: ProductSeller | null };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <ProductCardContent product={product} />
    </Suspense>
  );
}

function ProductCardContent({ product }: ProductCardProps) {
  const { images, loading, error } = useProductImages({
    category: product.category,
    productId: product.id,
    count: 3
  });
  const { toggleFavorite, isFavorite } = useFavorites();

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

  // Если загрузка или ошибка, показываем скелетон
  if (loading || error || !images || images.length === 0) {
    return <ProductCardSkeleton />;
  }

  return (
    <Link href={`/product/${product.id}`} className="block">
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-0">
          {/* Image Carousel */}
          <div className="relative">
            <Carousel 
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.title} - фото ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="h-6 w-6 sm:h-8 sm:w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
                  <CarouselNext className="h-6 w-6 sm:h-8 sm:w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
                </>
              )}
            </Carousel>
            
            {/* Индикаторы для карусели */}
            {images.length > 1 && (
              <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/60 dark:bg-slate-900/60"
                  />
                ))}
              </div>
            )}
            
            {/* Condition Badge */}
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10">
              <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 sm:px-2 sm:py-1">
                {getConditionText(product.condition)}
              </Badge>
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 flex flex-col space-y-1">
              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-900/90"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(product);
                }}
                title="Добавить в избранное"
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  isFavorite(product.id) 
                    ? "text-red-500 fill-red-500" 
                    : "text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                }`} />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            {/* Title */}
            <h3 className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
              {truncateProductTitleForCard(product.title)}
            </h3>
            
            {/* Seller Info */}
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate font-medium text-slate-700 dark:text-slate-300 text-xs">
                  {product.seller?.name || 'Неизвестный продавец'}
                </span>
                {product.seller?.verified && (
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 flex-shrink-0" />
                )}
                {product.seller?.type === "company" && (
                  <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="text-xs">{product.seller?.rating || 'Н/Д'}</span>
                {product.seller?.totalSales && (
                  <>
                    <span className="text-slate-400 dark:text-slate-500 text-xs">•</span>
                    <span className="text-xs">{product.seller.totalSales} продаж</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center space-x-1">
                <div className="flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                  <MapPin className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">
                  {product.location || product.seller?.location || 'Местоположение не указано'}
                </span>
              </div>
              {product.address && (
                <div className="flex items-center space-x-1 ml-3 sm:ml-4">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
            
            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatPrice(product.price)} ₽
              </span>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="flex items-center space-x-0.5 sm:space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-xs">{product.views}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="border-0 bg-white dark:bg-slate-900 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 sm:w-20"></div>
            <div className="h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8 sm:w-12"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}