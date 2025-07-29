"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import { productsData, ProductData } from "@/data/products";
import { useProductImages } from "@/lib/hooks/useProductImages";
import { EditListingModal } from "@/components/profile/EditListingModal";
import { AddListingModal } from "../AddListingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Trash2, User, Star, MapPin, CheckCircle, XCircle, Package, Plus } from "lucide-react";
import Link from "next/link";

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

  const handleAddListing = (data: any) => {
    // В реальном приложении здесь был бы API запрос для создания объявления
    console.log("Новое объявление:", data);
    
    // Имитация добавления нового объявления
    const newListing: ProductData = {
      id: Date.now().toString(),
      title: data.title,
      price: data.price,
      category: data.category,
      condition: data.condition,
      views: 0,
      publishedAt: new Date().toISOString(),
      description: data.description,
      seller: {
        id: "1",
        name: sellerName,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        rating: 4.7,
        memberSince: "2022-03-15T00:00:00Z",
        totalSales: 23,
        responseTime: "В течение 2 часов",
        type: "individual",
        location: data.location,
        verified: true,
        description: "Продаю качественные товары."
      }
    };
    
    setActiveListings(prev => [newListing, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (activeListings.length === 0) {
    return (
      <div className="space-y-6">
        {/* Кнопка добавления */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Мои объявления
          </h2>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить объявление
          </Button>
        </div>

        <Card>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Мои объявления
        </h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить объявление
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {activeListings.filter(listing => !soldListings.has(listing.id)).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Активных объявлений
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {soldListings.size}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Продано
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {activeListings.reduce((sum, listing) => sum + listing.views, 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Просмотров
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {activeListings.reduce((sum, listing) => sum + listing.price, 0).toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Общая стоимость
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Вкладки */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'sold')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="sold">Продано</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="sold" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {/* Модальные окна */}
      <EditListingModal
        isOpen={isEditModalOpen}
        listing={editingListing}
        onClose={handleCloseEditModal}
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
    productTitle: listing.title,
    category: listing.category,
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
     <Card className={`group hover:shadow-lg transition-all duration-200 border-0 bg-white dark:bg-slate-900 overflow-hidden ${
       isSold ? "opacity-75" : ""
     }`}>
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
              {loading ? (
                <CarouselItem>
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </CarouselItem>
              ) : error || !images || images.length === 0 ? (
                <CarouselItem>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-600 text-sm">Нет фото</div>
                  </div>
                </CarouselItem>
              ) : (
                images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image}
                        alt={`${listing.title} - фото ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            {images && images.length > 1 && (
              <>
                <CarouselPrevious className="h-8 w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
                <CarouselNext className="h-8 w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
              </>
            )}
          </Carousel>
          
          {/* Индикаторы для карусели */}
          {images && images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/60 dark:bg-slate-900/60"
                />
              ))}
            </div>
          )}
          
                     {/* Condition Badge */}
           <div className="absolute top-2 left-2 z-10">
             <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-slate-900/90">
               {getConditionText(listing.condition)}
             </Badge>
           </div>
           
           {/* Sold Badge */}
           {isSold && (
             <div className="absolute top-2 right-2 z-10">
               <Badge variant="secondary" className="text-xs bg-green-500 text-white">
                 Продано
               </Badge>
             </div>
           )}
          

        </div>

        {/* Product Info */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
            {listing.title}
          </h3>
          
          {/* Seller Info */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <User className="w-3 h-3" />
            <span className="truncate">{listing.seller.name}</span>
            {listing.seller.verified && (
              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                ✓
              </Badge>
            )}
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{listing.seller.rating}</span>
            </div>
          </div>
          
          {/* Location */}
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{listing.seller.location}</span>
          </p>
          
          {/* Price and Views */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatPrice(listing.price)} ₽
            </span>
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
              <Eye className="w-3 h-3" />
              <span>{listing.views}</span>
            </div>
          </div>

          {/* Published Date */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Опубликовано: {formatDate(listing.publishedAt)}
          </div>
        </div>

                                   {/* Action Buttons */}
          <div className="p-3 pt-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/product/${listing.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  Просмотр
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onEdit(listing)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Редактировать
              </Button>
            </div>
            
                        {/* Additional Action Buttons */}
             <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
               <Button 
                 variant="outline" 
                 size="sm" 
                 className={`flex-1 ${
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
                 className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
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
      </CardContent>
    </Card>
  );
} 