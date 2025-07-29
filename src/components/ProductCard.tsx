"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { ProductCardProps } from "@/types/product";

const conditionLabels = {
  new: "Новое",
  used: "Б/у",
  excellent: "Отличное",
  good: "Хорошее"
};

const conditionColors = {
  new: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  used: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  excellent: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  good: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Используем хук для загрузки изображений
  const { images, loading, error } = useProductImages({
    productTitle: product.title,
    category: product.category,
    count: 3
  });

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    // Если изображение не загрузилось, переключаемся на следующее
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  }, [images.length]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images.length]);

  const handleImageSelect = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentImageIndex(index);
  }, []);

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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Сегодня";
    if (diffDays === 2) return "Вчера";
    if (diffDays <= 7) return `${diffDays - 1} дней назад`;
    
    return date.toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex">
            {/* Левая часть - информация о товаре */}
            <div className="flex-1 p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-3">
                {formatPrice(product.price)}
              </div>
              
              {/* Продавец */}
              <div className="flex items-center mb-3">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {product.seller.name}
                  </p>
                  <div className="flex items-center">
                    {renderStars(product.seller.rating)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({product.seller.rating})
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Состояние товара */}
              <Badge className={`mb-3 ${conditionColors[product.condition]}`}>
                {conditionLabels[product.condition]}
              </Badge>
              
              {/* Просмотры и дата */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {product.views} просмотров
                </div>
                <span>{formatDate(product.publishedAt)}</span>
              </div>
            </div>
            
            {/* Правая часть - галерея */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
              {loading ? (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : error ? (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              ) : images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  
                  {/* Индикаторы изображений */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleImageSelect(e, index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Кнопка "Следующее изображение" */}
                  {images.length > 1 && (
                    <button
                      onClick={handleNextImage}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}