"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product, ProductSeller } from "@/types/product";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { Heart, MessageCircle, Share2, Star, MapPin, Eye, Calendar, Map, Phone, Shield, Building2, ArrowLeft, Users, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  
  const { images, loading, error } = useProductImages({
    category: product.category,
    productId: product.id,
    count: 5
  });

  const { toggleFavorite, isFavorite } = useFavorites();
  const { navigateToProducts, navigateToHome, goBack } = useNavigation();

  // Вспомогательные функции
  const getCategoryText = useCallback((category: string) => {
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

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const formatMemberSince = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long'
    });
  }, []);

  // Мемоизированные вычисления для оптимизации производительности
  const breadcrumbItems = useMemo(() => [
    { label: "Товары", href: "/products" },
    { label: getCategoryText(product.category), href: `/products?category=${product.category}` },
    { label: truncateProductTitleForBreadcrumbs(product.title) }
  ], [product.category, product.title, getCategoryText]);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsImageLoading(true);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoading(true);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoading(true);
  }, [images.length]);

  // Оптимизированные touch handlers с debounce
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setCurrentX(e.touches[0].clientX);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
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
  }, [isDragging, startX, currentX, nextImage, prevImage]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
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
  }, [isDragging, startX, currentX, nextImage, prevImage]);

  // Keyboard navigation с улучшенной доступностью
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
        case 'Escape':
          event.preventDefault();
          goBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, goBack]);

  // Автоматический скролл миниатюр к активному изображению
  useEffect(() => {
    if (thumbnailRef.current) {
      const activeThumbnail = thumbnailRef.current.children[currentImageIndex] as HTMLElement;
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentImageIndex]);

  if (loading || error || !images || images.length === 0) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Мобильная навигация с улучшенным UX */}
      <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 h-9 w-9 p-0"
                aria-label="Назад"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0 overflow-hidden">
                <Breadcrumbs items={breadcrumbItems} />
              </div>
            </div>
            
            {/* Быстрые действия */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(product)}
                className={`h-9 w-9 p-0 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                aria-label="Поделиться"
              >
                <Share2 className="h-5 w-5" />
              </Button>
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

      {/* Основной контент с оптимизированной структурой */}
      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-6xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Левая колонка - Изображения с улучшенным UX */}
          <div className="space-y-4">
            <div 
              ref={imageContainerRef}
              className="relative cursor-grab active:cursor-grabbing w-full group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="aspect-square overflow-hidden rounded-xl lg:rounded-2xl w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${product.title} - фото ${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className={`w-full h-full object-cover select-none transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  draggable={false}
                  onLoad={() => setIsImageLoading(false)}
                  priority={currentImageIndex === 0}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl lg:rounded-2xl" />
                )}
              </div>
              
              {/* Навигационные кнопки для изображений */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 lg:opacity-100"
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 lg:opacity-100"
                    aria-label="Следующее изображение"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              {/* Индикатор изображений */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white shadow-lg scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Перейти к изображению ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Миниатюры с улучшенным скроллом */}
            {images.length > 1 && (
              <div 
                ref={thumbnailRef}
                className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide w-full snap-x snap-mandatory"
              >
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 cursor-pointer snap-start"
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <div className="relative">
                      <Image
                        src={image}
                        alt={`Миниатюра ${index + 1}`}
                        width={80}
                        height={80}
                        className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-lg transition-all duration-200 hover:opacity-80 ${
                          index === currentImageIndex 
                            ? 'opacity-100 ring-2 ring-blue-500 ring-offset-2' 
                            : 'opacity-60 hover:opacity-80'
                        }`}
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-blue-500/20 rounded-lg" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Правая колонка - Информация с улучшенной структурой */}
          <div className="space-y-6">
            {/* Заголовок и цена с улучшенной типографикой */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight flex-1 pr-2 min-w-0">
                  <span className="break-words">{truncateText(product.title, 80)}</span>
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(product)}
                  className={`h-10 w-10 flex-shrink-0 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                  aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                </Button>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {formatPrice(product.price)} ₽
                </span>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {getConditionText(product.condition)}
                </Badge>
              </div>
            </div>

            {/* Геолокация с улучшенным дизайном */}
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 w-full overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                          Местоположение
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
                          {product.location || product.seller?.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Адрес с улучшенным отображением */}
                    {product.address && (
                      <div className="ml-13 sm:ml-13">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 flex-shrink-0"></div>
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
                    className="border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex-shrink-0 h-10"
                    onClick={onMapClick}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    <span className="text-sm">Карта</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Статистика с улучшенным дизайном */}
            <div className="flex items-center gap-4 sm:gap-6 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800">
                  <Eye className="h-4 w-4" />
                </div>
                <span>{product.views} просмотров</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">{formatDate(product.publishedAt)}</span>
                <span className="sm:hidden">{new Date(product.publishedAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            {/* Продавец с улучшенной карточкой */}
            <Card className="w-full overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4 w-full">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                    <AvatarImage src={product.seller?.avatar} alt={product.seller?.name || 'Продавец'} />
                    <AvatarFallback className="text-lg">{product.seller?.name?.charAt(0) || 'П'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-base sm:text-lg">
                        {product.seller?.name || 'Неизвестный продавец'}
                      </h3>
                      {product.seller?.verified && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0">
                          <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {product.seller?.type === "company" && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                          <Building2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {product.seller?.rating || 'Н/Д'}
                        </span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {product.seller?.totalSales || 0} продаж
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {product.seller?.memberSince ? `На сайте с ${formatMemberSince(product.seller.memberSince)}` : 'Информация недоступна'} • {product.seller?.responseTime || 'Время ответа не указано'}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0 h-10">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">Номер</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий с улучшенным дизайном */}
            <div className="space-y-4">
              <Button className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                <MessageCircle className="h-5 w-5 mr-3" />
                Написать продавцу
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 sm:h-14">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="text-sm">Поделиться</span>
                </Button>
                <Button variant="outline" className="h-12 sm:h-14">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">Номер</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Блок с описанием с улучшенной типографикой */}
        {product.description && (
          <div className="mt-8 lg:mt-12 w-full">
            <Card className="w-full overflow-hidden">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
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

        {/* Навигационные кнопки с улучшенным дизайном */}
        <div className="mt-8 lg:mt-12 w-full">
          <Card className="w-full overflow-hidden">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
                Навигация
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigateToProducts()}
                  className="flex items-center justify-center gap-3 h-12 sm:h-14"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Все товары</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center justify-center gap-3 h-12 sm:h-14"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Назад</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={navigateToHome}
                  className="flex items-center justify-center gap-3 h-12 sm:h-14"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm sm:text-base">Главная</span>
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
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-x-hidden">
      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-6xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Скелетон изображений */}
          <div className="space-y-4 w-full">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl lg:rounded-2xl animate-pulse w-full"></div>
            <div className="flex space-x-3 overflow-x-auto w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>
          
          {/* Скелетон информации */}
          <div className="space-y-6 w-full">
            <div className="space-y-4">
              <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            </div>
            <div className="h-24 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-16 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}