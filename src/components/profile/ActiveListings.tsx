"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { productsData, ProductData } from "@/data/products";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { EditListingModal } from "@/components/profile/EditListingModal";
import { AddListingModal } from "../AddListingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, CheckCircle, XCircle, Package, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ActiveListingsProps {
  sellerName: string;
}

export function ActiveListings({ sellerName }: ActiveListingsProps) {
  const [activeListings, setActiveListings] = useState<ProductData[]>([]);
  const [soldListings, setSoldListings] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ProductData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      // Фильтруем продукты, принадлежащие текущему продавцу
      const userListings = Object.values(productsData).filter(
        product => product.seller?.name === sellerName
      );
      setActiveListings(userListings);
      setLoading(false);
    }, 500);
  }, [sellerName]);

  const handleEditListing = (listing: ProductData) => {
    setEditingListing(listing);
    setIsEditModalOpen(true);
  };

  const handleSaveListing = (updatedListing: ProductData) => {
    // Обновляем объявление в списке
    setActiveListings(prev => 
      prev.map(listing => 
        listing.id === updatedListing.id ? updatedListing : listing
      )
    );
    
    // В реальном приложении здесь был бы API запрос для сохранения
    console.log("Объявление обновлено:", updatedListing);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingListing(null);
  };

  const handleMarkAsSold = (listingId: string) => {
    setSoldListings(prev => new Set([...prev, listingId]));
    
    // Переключаемся на вкладку "Продано"
    setActiveTab('sold');
    
    // В реальном приложении здесь был бы API запрос для обновления статуса
    console.log("Объявление отмечено как проданное:", listingId);
  };

  const handleAddListing = (data: { title: string; description: string; price: number; category: string; condition: string; location: string; images: File[]; type: 'product' | 'service' }) => {
    // В реальном приложении здесь был бы API запрос для создания объявления
    console.log("Новое объявление:", data);
    
    // Имитация добавления нового объявления
    const newListing: ProductData = {
      id: Date.now().toString(),
      title: data.title,
      price: data.price,
      category: data.category,
      condition: data.condition as "new" | "excellent" | "good" | "fair",
      views: 0,
      publishedAt: new Date().toISOString(),
      description: data.description,
      seller: {
        name: sellerName,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        rating: 4.7,
        memberSince: "2022-03-15T00:00:00Z",
        totalSales: 23,
        responseTime: "В течение 2 часов"
      }
    };
    
    setActiveListings(prev => [newListing, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Мои объявления
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Управляйте своими товарами и услугами
            </p>
          </div>
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-slate-200 dark:border-slate-700 animate-pulse">
              <CardContent className="p-3 text-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Вкладки */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          
          {/* Карточки загрузки */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border border-slate-200 dark:border-slate-700 animate-pulse">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-32 sm:h-24 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1 p-3 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="flex gap-1">
                        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeListings.length === 0) {
    return (
      <div className="space-y-6">
        {/* Заголовок и кнопка добавления */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Мои объявления
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Управляйте своими товарами и услугами
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить объявление
          </Button>
        </div>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl text-slate-300 dark:text-slate-600">📝</div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                У вас пока нет активных объявлений
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Создайте первое объявление, чтобы начать продавать
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Создать объявление
              </Button>
            </div>
          </CardContent>
        </Card>

        <AddListingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddListing}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Мои объявления
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Управляйте своими товарами и услугами
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить объявление
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {activeListings.filter(listing => !soldListings.has(listing.id)).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Активных
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {soldListings.size}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Продано
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {activeListings.reduce((sum, listing) => sum + listing.views, 0)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Просмотров
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {activeListings.reduce((sum, listing) => sum + listing.price, 0).toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Общая стоимость
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Вкладки */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'sold')}>
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger value="active" className="text-sm">Активные</TabsTrigger>
          <TabsTrigger value="sold" className="text-sm">Продано</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {activeListings
              .filter(listing => !soldListings.has(listing.id))
              .map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={handleEditListing}
                  onMarkAsSold={handleMarkAsSold}
                  isSold={false}
                />
              ))}
          </div>
          {activeListings.filter(listing => !soldListings.has(listing.id)).length === 0 && (
            <div className="text-center py-8">
              <div className="text-slate-500 dark:text-slate-400 mb-4">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Нет активных объявлений</p>
                <p className="text-sm">Создайте первое объявление, чтобы начать продавать</p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Создать объявление
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {activeListings
              .filter(listing => soldListings.has(listing.id))
              .map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={handleEditListing}
                  onMarkAsSold={handleMarkAsSold}
                  isSold={true}
                />
              ))}
          </div>
          {activeListings.filter(listing => soldListings.has(listing.id)).length === 0 && (
            <div className="text-center py-8">
              <div className="text-slate-500 dark:text-slate-400 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Нет проданных товаров</p>
                <p className="text-sm">Здесь будут отображаться ваши проданные товары</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Модальные окна */}
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        listing={editingListing}
        onSave={handleSaveListing}
      />

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddListing}
      />
    </div>
  );
}

// Компонент карточки объявления с дизайном как ProductCard
function ListingCard({ 
  listing, 
  onEdit, 
  onMarkAsSold, 
  isSold 
}: { 
  listing: ProductData; 
  onEdit: (listing: ProductData) => void;
  onMarkAsSold: (listingId: string) => void;
  isSold: boolean;
}) {
  const { images, loading, error } = useProductImages({
    category: listing.category,
    productId: listing.id,
    count: 3
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden ${
      isSold ? "opacity-75" : ""
    }`}>
      <CardContent className="p-0">
        {/* Compact Layout */}
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative w-full sm:w-32 h-32 sm:h-24 flex-shrink-0">
            <Carousel 
              className="w-full h-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {loading ? (
                  <CarouselItem>
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </CarouselItem>
                ) : error || !images || images.length === 0 ? (
                  <CarouselItem>
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <div className="text-gray-400 dark:text-gray-600 text-xs">Нет фото</div>
                    </div>
                  </CarouselItem>
                ) : (
                  images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="w-full h-full overflow-hidden px-1 py-1">
                        <Image
                          src={image}
                          alt={`${listing.title} - фото ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-md"
                        />
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              {/* Убираем стрелочки навигации */}
            </Carousel>
            
            {/* Condition Badge */}
            <div className="absolute top-1 left-1 z-10">
              <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-slate-900/90">
                {getConditionText(listing.condition)}
              </Badge>
            </div>
            
            {/* Sold Badge */}
            {isSold && (
              <div className="absolute top-1 right-1 z-10">
                <Badge variant="secondary" className="text-xs bg-green-500 text-white">
                  Продано
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-3 min-w-0">
            {/* Title and Price Row */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight flex-1 mr-2">
                {listing.title}
              </h3>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 flex-shrink-0">
                {formatPrice(listing.price)} ₽
              </span>
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{listing.views} просмотров</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="w-3 h-3" />
                <span>{formatDate(listing.publishedAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" asChild>
                <Link href={`/product/${listing.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  Просмотр
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={() => onEdit(listing)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Редактировать
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-7 px-2 ${
                  isSold 
                    ? "border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20 cursor-not-allowed opacity-60" 
                    : "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400"
                }`}
                onClick={() => {
                  if (!isSold) {
                    onMarkAsSold(listing.id);
                  }
                }}
                disabled={isSold}
              >
                <CheckCircle className={`h-3 w-3 mr-1 ${isSold ? "fill-green-600" : ""}`} />
                {isSold ? "Продано" : "Продано"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                onClick={() => {
                  // Логика для удаления
                  console.log("Удалить объявление:", listing.id);
                }}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 