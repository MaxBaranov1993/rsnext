"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, Share2, MessageCircle, Eye, Phone, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { ProductData } from "@/data/products";
import Image from "next/image";
import { useErrorHandler } from "./ErrorBoundary";
import { useAnalytics } from "@/lib/analytics";

interface ProductPageClientProps {
  productData: ProductData;
}

// Компонент для отображения ошибки загрузки изображения
function ImageErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Не удалось загрузить изображение
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}

// Компонент для отображения скелетона загрузки
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPageClient({ productData }: ProductPageClientProps) {
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isFavorite, setIsFavorite] = useState(false);
  const { error, handleError, resetError } = useErrorHandler();
  const analytics = useAnalytics();
  
  const { images, loading: imagesLoading, error: imagesError } = useProductImages({
    category: productData.category,
    productId: productData.id,
    count: 5
  });

  useEffect(() => {
    if (images && images.length > 0) {
      setLoading(false);
    }
  }, [images]);

  useEffect(() => {
    if (imagesError) {
      handleError(new Error('Не удалось загрузить изображения товара'));
    }
  }, [imagesError, handleError]);

  // Отслеживание просмотра товара при загрузке
  useEffect(() => {
    if (!loading && productData) {
      analytics.trackProductView(productData.id, productData.category, productData.price);
    }
  }, [loading, productData, analytics]);

  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
    console.error(`Failed to load image ${index} for product ${productData.id}`);
  }, [productData.id]);

  const handleImageRetry = useCallback((index: number) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  }, []);

  const getConditionText = useCallback((condition: string) => {
    const conditions = {
      new: "Новый",
      excellent: "Отличное",
      good: "Хорошее",
      fair: "Удовлетворительное"
    };
    return conditions[condition as keyof typeof conditions] || "Не указано";
  }, []);

  const handleContactSeller = useCallback(() => {
    analytics.trackContactSeller(productData.id, productData.category, productData.price);
    // Здесь можно добавить логику открытия чата или формы
    console.log('Contact seller clicked');
  }, [productData, analytics]);

  const handleShowPhone = useCallback(() => {
    analytics.trackShowPhone(productData.id, productData.category, productData.price);
    // Здесь можно добавить логику показа телефона
    console.log('Show phone clicked');
  }, [productData, analytics]);

  const handleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
    analytics.trackFavorite(productData.id, productData.category, productData.price);
    console.log('Favorite toggled:', !isFavorite);
  }, [productData, analytics, isFavorite]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productData.title,
          text: productData.description,
          url: window.location.href,
        });
        analytics.trackShare(productData.id, productData.category, 'native');
      } else {
        // Fallback для браузеров без Web Share API
        await navigator.clipboard.writeText(window.location.href);
        analytics.trackShare(productData.id, productData.category, 'clipboard');
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  }, [productData, analytics]);

  // Обработка ошибок
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl">Ошибка загрузки</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              {error.message}
            </p>
            <Button onClick={resetError}>
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || imagesLoading) {
    return <ProductSkeleton />;
  }

  return (
    <article 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      itemScope 
      itemType="http://schema.org/Product"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square overflow-hidden">
                          {imageErrors.has(index) ? (
                            <ImageErrorFallback onRetry={() => handleImageRetry(index)} />
                          ) : (
                            <Image
                              src={image}
                              alt={`${productData.title} - фото ${index + 1}`}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                              priority={index === 0} // LCP optimization
                              onError={() => handleImageError(index)}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images && images.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              </CardContent>
            </Card>

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 
                    className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2"
                    itemProp="name"
                  >
                    {productData.title}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Опубликовано {new Date(productData.publishedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFavorite}
                    aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    aria-label="Поделиться"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Описание</CardTitle>
                </CardHeader>
                <CardContent>
                  <p 
                    className="text-slate-700 dark:text-slate-300"
                    itemProp="description"
                  >
                    {productData.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Price, Condition, Seller */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span 
                      className="text-2xl font-bold text-slate-900 dark:text-slate-100"
                      itemProp="price"
                      content={productData.price.toString()}
                    >
                      {formatPrice(productData.price)} ₽
                    </span>
                    <meta itemProp="priceCurrency" content="RUB" />
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Eye className="w-3 h-3" />
                      <span>{productData.views} просмотров</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getConditionText(productData.condition)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Condition Card */}
            <Card className="shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Состояние</span>
                  <Badge variant="outline" className="text-xs">
                    {getConditionText(productData.condition)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleShowPhone}
                aria-label="Показать телефон продавца"
              >
                <Phone className="w-4 h-4 mr-2" />
                Показать телефон
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleContactSeller}
                aria-label="Написать продавцу"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Написать продавцу
              </Button>
            </div>

            {/* Seller Info */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {productData.seller.name}
                    </h3>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <span>⭐ {productData.seller.rating}</span>
                        <span>•</span>
                        <span>{productData.seller.totalSales} объявлений</span>
                      </div>
                      <div>67 отзывов</div>
                      <div>На сайте с {new Date(productData.seller.memberSince).toLocaleDateString('ru-RU')}</div>
                      <div>Отвечает {productData.seller.responseTime}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Image
                      src={productData.seller.avatar}
                      alt={productData.seller.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="text-center">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        ⭐ {productData.seller.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </article>
  );
}