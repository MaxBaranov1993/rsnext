"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useCallback, useEffect, useRef } from "react";
import NextImage from "next/image";

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string;
    category: string;
    location: string;
    seller: {
      name: string;
      avatar: string;
      rating: number;
      memberSince: string;
      totalSales: number;
      responseTime: string;
    };
    condition: "new" | "used" | "excellent" | "good";
    views: number;
    publishedAt: string;
    features: string[];
    specifications: Record<string, string>;
  };
}

const conditionLabels = {
  new: "Новое",
  used: "Б/у",
  excellent: "Отличное",
  good: "Хорошее",
};

const conditionColors = {
  new: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  used: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  excellent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  good: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export function ProductDetail({ product }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Предзагрузка изображений
  useEffect(() => {
    product.images.forEach((imageUrl, index) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous"; // Добавляем CORS поддержку
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
      };
      img.onerror = () => {
        console.error(`Failed to preload image ${index}:`, imageUrl);
        // Не добавляем в loadedImages, чтобы показать ошибку
      };
      img.src = imageUrl;
    });
  }, [product.images]);

  // Сброс состояния загрузки при изменении изображения
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    
    // Если изображение уже загружено, сразу показываем его
    if (loadedImages.has(currentImageIndex)) {
      setImageLoading(false);
    }
  }, [currentImageIndex, loadedImages]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    console.error(`Failed to load image ${currentImageIndex}:`, product.images[currentImageIndex]);
  }, [currentImageIndex, product.images]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeFullscreen();
    }
  };

  // Touch/Swipe handlers
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

  // Mouse drag handlers
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
      if (!isFullscreen) return;
      
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
          closeFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Левая колонка - Галерея в стиле Авито */}
        <div>
          <div className="space-y-4">
            {/* Основное изображение */}
            <div className="relative">
              <div 
                ref={mainImageRef}
                className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
                onClick={openFullscreen}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {imageLoading && (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span className="ml-2 text-gray-500">Загрузка...</span>
                  </div>
                )}
                
                {!imageLoading && !imageError && product.images[currentImageIndex] && (
                  <NextImage
                    src={product.images[currentImageIndex]}
                    alt={`${product.title} - изображение ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority={currentImageIndex === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    crossOrigin="anonymous"
                  />
                )}
                
                {/* Показываем ошибку, если изображение не загрузилось */}
                {!imageLoading && imageError && (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Ошибка загрузки изображения</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        setImageLoading(true);
                        setImageError(false);
                        // Попробуем загрузить изображение снова
                        const img = new window.Image();
                        img.crossOrigin = "anonymous";
                        img.onload = () => {
                          setImageLoading(false);
                          setImageError(false);
                        };
                        img.onerror = () => {
                          setImageLoading(false);
                          setImageError(true);
                        };
                        img.src = product.images[currentImageIndex];
                      }}
                    >
                      Попробовать снова
                    </Button>
                  </div>
                )}
                
                {/* Кнопки навигации в стиле Авито */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-10"
                      aria-label="Предыдущее изображение"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-10"
                      aria-label="Следующее изображение"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Счетчик изображений в стиле Авито */}
                {product.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded">
                    {currentImageIndex + 1} из {product.images.length}
                  </div>
                )}
              </div>
            </div>
            
            {/* Миниатюры в стиле Авито */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${
                      index === currentImageIndex 
                        ? 'border-orange-500 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                    aria-label={`Выбрать изображение ${index + 1}`}
                  >
                    <NextImage
                      src={image}
                      alt={`${product.title} миниатюра ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        // Показываем fallback для миниатюры
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка - Информация */}
        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <Badge className={`mb-2 ${conditionColors[product.condition]}`}>
                  {conditionLabels[product.condition]}
                </Badge>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {product.title}
              </h1>
              
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                {formatPrice(product.price)}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {product.views} просмотров
                </div>
                <span>Опубликовано {formatDate(product.publishedAt)}</span>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Связаться с продавцом
                </Button>
                <Button variant="outline" className="w-full">
                  Добавить в избранное
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Продавец */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Продавец</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                  <AvatarFallback className="text-lg">{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {product.seller.name}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    {renderStars(product.seller.rating)}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {product.seller.rating} ({product.seller.totalSales} продаж)
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>На сайте с {formatDate(product.seller.memberSince)}</div>
                    <div>Время ответа: {product.seller.responseTime}</div>
                    <div>Локация: {product.location}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Нижняя секция - Описание и характеристики */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Описание */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {product.description}
              </p>
              
              {product.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Особенности:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Полноэкранный просмотр в стиле Авито */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer"
          onClick={handleBackgroundClick}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Кнопка закрытия в стиле Авито */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Закрыть полноэкранный просмотр"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Изображение */}
            {product.images[currentImageIndex] && (
              <NextImage
                src={product.images[currentImageIndex]}
                alt={`${product.title} - изображение ${currentImageIndex + 1}`}
                fill
                className="object-contain cursor-default"
                onClick={(e) => e.stopPropagation()}
                sizes="100vw"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Показываем fallback для полноэкранного просмотра
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center text-white">
                        <div class="text-center">
                          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p>Ошибка загрузки изображения</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            )}
            
            {/* Кнопки навигации в стиле Авито */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  aria-label="Предыдущее изображение"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  aria-label="Следующее изображение"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Индикатор изображений в стиле Авито */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectImage(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Перейти к изображению ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Счетчик изображений в стиле Авито */}
            <div className="absolute top-4 left-4 text-white text-sm bg-black/60 px-2 py-1 rounded">
              {currentImageIndex + 1} из {product.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}