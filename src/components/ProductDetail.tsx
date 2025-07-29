"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product, ProductSeller } from "@/types/product";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { Heart, MessageCircle, Share2, Star, MapPin, Eye, Calendar, Map, Phone, Shield, Building2, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Header } from "./Header";
import { truncateProductTitleForBreadcrumbs, truncateText } from "@/lib/utils";
import Link from "next/link";

interface ProductDetailProps {
  product: Product & { seller: ProductSeller };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const { images, loading, error } = useProductImages({
    productTitle: product.title,
    category: product.category,
    count: 5
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
  }, [images.length]);

  if (loading || error || !images || images.length === 0) {
    return <ProductDetailSkeleton />;
  }

  const breadcrumbItems = [
    { label: getCategoryText(product.category), href: `/products?category=${product.category}` },
    { label: truncateProductTitleForBreadcrumbs(product.title) }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <Header />

      {/* Mobile Back Button */}
      <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link href={`/products?category=${product.category}`} className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm">Назад</span>
            </Link>
            <div className="flex-1">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Breadcrumbs */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Левая колонка - Изображения */}
          <div className="space-y-4">
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
                <img
                  src={images[currentImageIndex]}
                  alt={`${product.title} - фото ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              </div>
              
              {/* Индикатор изображений */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
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
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`Миниатюра ${index + 1}`}
                      className={`w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg transition-all duration-200 hover:opacity-80 ${
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
          <div className="space-y-4 lg:space-y-6">
            {/* Заголовок и цена */}
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight flex-1 pr-3">
                  {truncateText(product.title, 80)}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(product)}
                  className={`h-10 w-10 flex-shrink-0 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 lg:space-x-4">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatPrice(product.price)} ₽
                </span>
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  {getConditionText(product.condition)}
                </Badge>
              </div>
            </div>

            {/* Геолокация */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                <span>{product.seller.location}</span>
              </div>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700 w-full sm:w-auto">
                <Map className="h-4 w-4 mr-2" />
                Показать на карте
              </Button>
            </div>

            {/* Статистика */}
            <div className="flex items-center space-x-4 lg:space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{product.views} просмотров</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{formatDate(product.publishedAt)}</span>
                <span className="sm:hidden">{new Date(product.publishedAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            {/* Продавец */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                    <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {product.seller.name}
                      </h3>
                      {product.seller.verified && (
                        <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                      {product.seller.type === "company" && (
                        <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {product.seller.rating} ({product.seller.totalSales} продаж)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      На сайте с {formatMemberSince(product.seller.memberSince)} • {product.seller.responseTime}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Показать номер</span>
                    <span className="sm:hidden">Номер</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="space-y-3">
              <Button className="w-full h-12 text-lg font-semibold">
                <MessageCircle className="h-5 w-5 mr-2" />
                Написать продавцу
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Поделиться</span>
                  <span className="sm:hidden">Поделиться</span>
                </Button>
                <Button variant="outline" className="h-12">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Показать номер</span>
                  <span className="sm:hidden">Номер</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Блок с описанием */}
        {product.description && (
          <div className="mt-8 lg:mt-12">
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Описание товара
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm lg:text-base">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Скелетон изображений */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Скелетон информации */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}