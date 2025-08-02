"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product, ProductSeller } from "@/types/product";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { Heart, MessageCircle, Share2, Star, MapPin, Eye, Calendar, Map, Phone, Shield, Building2, ArrowLeft, Users } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Header } from "./Header";
import { truncateProductTitleForBreadcrumbs, truncateText } from "@/lib/utils";
import { useNavigation } from "@/lib/hooks/useNavigation";
import Image from "next/image";

interface ProductDetailProps {
  product: Product & { seller?: ProductSeller | null };
  onMapClick?: () => void;
}

export function ProductDetail({ product, onMapClick }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const { images, loading, error } = useProductImages({
    category: product.category,
    productId: product.id,
    count: 5
  });

  const { toggleFavorite, isFavorite } = useFavorites();
  const { navigateToProducts, navigateToHome, goBack } = useNavigation();

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

  const getCategoryText = (category: string) => {
    const categories = {
      electronics: "Электроника",
      clothing: "Одежда",
      furniture: "Мебель",
      cars: "Авто",
      real_estate: "Недвижимость",
      services: "Услуги",
      kids: "Детям",
      goods: "Товары"
    };
    return categories[category as keyof typeof categories] || "Товары";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setIsDragging(false);
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, nextImage, prevImage]);

  if (loading || error || !images || images.length === 0) {
    return <ProductDetailSkeleton />;
  }

  const breadcrumbItems = [
    { label: "Товары", href: "/products" },
    { label: getCategoryText(product.category), href: `/products?category=${product.category}` },
    { label: truncateProductTitleForBreadcrumbs(product.title) }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <Header />

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 h-8 sm:h-9"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="text-xs sm:text-sm">Назад</span>
              </Button>
              <div className="flex-1 min-w-0 overflow-hidden">
                <Breadcrumbs items={breadcrumbItems} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            
            {/* Desktop Action Buttons */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToProducts()}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Все товары</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-3 sm:px-4 py-4 lg:py-8 max-w-6xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
          {/* Левая колонка - Изображения */}
          <div className="space-y-3 sm:space-y-4">
            <div 
              ref={imageContainerRef}
              className="relative cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="aspect-square overflow-hidden rounded-lg lg:rounded-xl">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${product.title} - фото ${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              </div>
              
              {/* Индикатор изображений */}
              {images.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Миниатюры */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <Image
                      src={image}
                      alt={`Миниатюра ${index + 1}`}
                      width={80}
                      height={80}
                      className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg transition-all duration-200 hover:opacity-80 ${
                        index === currentImageIndex 
                          ? 'opacity-100' 
                          : 'opacity-60 hover:opacity-80'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Правая колонка - Информация */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Заголовок и цена */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight flex-1 pr-2 min-w-0">
                  <span className="break-words">{truncateText(product.title, 80)}</span>
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(product)}
                  className={`h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatPrice(product.price)} ₽
                </span>
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  {getConditionText(product.condition)}
                </Badge>
              </div>
            </div>

            {/* Геолокация */}
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          Местоположение
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
                          {product.location || product.seller?.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Адрес */}
                    {product.address && (
                      <div className="ml-8 sm:ml-10">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"></div>
                          <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                            {product.street && product.houseNumber ? (
                              <>
                                <span className="text-slate-500 dark:text-slate-400">ул. </span>
                                <span className="text-slate-700 dark:text-slate-300">{product.street}</span>
                                <span className="text-slate-500 dark:text-slate-400">, </span>
                                <span className="text-slate-700 dark:text-slate-300">{product.houseNumber}</span>
                              </>
                            ) : (
                              product.address
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex-shrink-0 h-8 sm:h-9"
                    onClick={onMapClick}
                  >
                    <Map className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Карта</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Статистика */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex-wrap">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{product.views} просмотров</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{formatDate(product.publishedAt)}</span>
                <span className="sm:hidden">{new Date(product.publishedAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            {/* Продавец */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage src={product.seller?.avatar} alt={product.seller?.name || 'Продавец'} />
                    <AvatarFallback>{product.seller?.name?.charAt(0) || 'П'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-base">
                        {product.seller?.name || 'Неизвестный продавец'}
                      </h3>
                      {product.seller?.verified && (
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      )}
                      {product.seller?.type === "company" && (
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {product.seller?.rating || 'Н/Д'} ({product.seller?.totalSales || 0} продаж)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {product.seller?.memberSince ? `На сайте с ${formatMemberSince(product.seller.memberSince)}` : 'Информация недоступна'} • {product.seller?.responseTime || 'Время ответа не указано'}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0 h-8 sm:h-9">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Номер</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="space-y-3">
              <Button className="w-full h-10 sm:h-12 text-base sm:text-lg font-semibold">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Написать продавцу
              </Button>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button variant="outline" className="h-10 sm:h-12">
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Поделиться</span>
                </Button>
                <Button variant="outline" className="h-10 sm:h-12">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Номер</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Блок с описанием */}
        {product.description && (
          <div className="mt-6 sm:mt-8 lg:mt-12">
            <Card>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
                  Описание товара
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Навигационные кнопки */}
        <div className="mt-6 sm:mt-8 lg:mt-12">
          <Card>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
                Навигация
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigateToProducts()}
                  className="flex items-center justify-center gap-2 h-10 sm:h-12"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Все товары</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 h-10 sm:h-12"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Назад</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={navigateToHome}
                  className="flex items-center justify-center gap-2 h-10 sm:h-12"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-xs sm:text-sm">Главная</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-4 lg:py-8 max-w-6xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
          {/* Скелетон изображений */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex space-x-2 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>
          
          {/* Скелетон информации */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}