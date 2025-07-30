"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect, Suspense } from "react";
import { Product } from "@/types/product";
import { useProducts } from "@/lib/hooks/useProducts";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { AddListingModal } from "@/components/AddListingModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { ProductCategory } from "@/types/product";
import { ProductCondition } from "@/types/product";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { 
  Car, 
  Home as HomeIcon, 
  Monitor, 
  Shirt, 
  Sofa, 
  Wrench, 
  Baby, 
  Package,
  Heart,
  Plus,
  User,
  MessageCircle,
  Settings,
  LogOut,
  Search
} from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [showMoreServices, setShowMoreServices] = useState(false);
  
  const { products, loading, error, hasMore, loadMore } = useProducts(15);
  const { favorites, favoritesCount, removeFromFavorites, clearFavorites } = useFavorites();
  const router = useRouter();

  // Фильтрация товаров и услуг
  const productsItems = products.filter(product => product.category !== 'services');
  const servicesItems = products.filter(product => product.category === 'services');
  
  // Ограничение до 3 рядов (15 товаров на больших экранах, 6 на средних)
  const maxProductsToShow = 15; // 3 ряда по 5 товаров
  const maxServicesToShow = 15; // 3 ряда по 5 услуг
  
  const displayedProducts = showMoreProducts ? productsItems : productsItems.slice(0, maxProductsToShow);
  const displayedServices = showMoreServices ? servicesItems : servicesItems.slice(0, maxServicesToShow);

  const serbianCities = [
    "Белград",
    "Нови Сад", 
    "Ниш",
    "Крагуевац",
    "Суботица",
    "Зренянин",
    "Панчево",
    "Чачак",
    "Кралево",
    "Нови Пазар",
    "Крушевац",
    "Ужице",
    "Вране",
    "Шабац",
    "Сомбор",
    "Смедерево",
    "Лесковац",
    "Вальево",
    "Кикинда",
    "Вршац"
  ];

  const languages = [
    { name: "Српски", flag: "/svg/serbia.svg", code: "sr" },
    { name: "English", flag: "/svg/eng.svg", code: "en" },
    { name: "Русский", flag: "/svg/russia.svg", code: "ru" }
  ];

  // Категории товаров
  const categories = [
    {
      id: "cars",
      name: "Авто",
      icon: Car,
      color: "bg-green-100"
    },
    {
      id: "real_estate",
      name: "Недвижимость",
      icon: HomeIcon,
      color: "bg-blue-100"
    },
    {
      id: "electronics",
      name: "Электроника",
      icon: Monitor,
      color: "bg-purple-100"
    },
    {
      id: "clothing",
      name: "Одежда",
      icon: Shirt,
      color: "bg-pink-100"
    },
    {
      id: "furniture",
      name: "Мебель",
      icon: Sofa,
      color: "bg-orange-100"
    },
    {
      id: "services",
      name: "Услуги",
      icon: Wrench,
      color: "bg-yellow-100"
    },
    {
      id: "kids",
      name: "Детям",
      icon: Baby,
      color: "bg-indigo-100"
    },
    {
      id: "goods",
      name: "Товары",
      icon: Package,
      color: "bg-red-100"
    }
  ];

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileSearchClick = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleLoadMore = () => {
    loadMore(); // Используем функцию loadMore из хука
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogin = () => {
    router.push('/login');
    setShowAuthModal(false);
  };

  const handleRegister = () => {
    router.push('/register');
    setShowAuthModal(false);
  };

  const handleAddListingClick = () => {
    if (isAuthenticated) {
      setShowAddListingModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAddListingSubmit = (data: any) => {
    console.log("Новое объявление:", data);
    setShowAddListingModal(false);
    // Здесь будет логика сохранения объявления
  };

  const handleFavoritesClick = () => {
    if (isAuthenticated) {
      setShowFavoritesModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.name === selectedLanguage) || languages[2]; // По умолчанию русский
  };

  // Функция для группировки категорий по 4 для карусели
  const chunkCategories = (arr: typeof categories, size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const categoryChunks = chunkCategories(categories, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Search Overlay */}
      {showMobileSearch && isScrolled && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 z-50 p-4">
          <div className="relative">
            <Input 
              placeholder="Поиск..." 
              className="pr-16"
              autoFocus
            />
            <Button 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-orange-500 hover:bg-orange-600 text-white text-sm"
              size="sm"
            >
              Найти
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Categories Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Grid - только для больших экранов */}
          <div className="hidden lg:grid lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-800 h-16 overflow-hidden"
                >
                  <CardContent className="p-3 h-full flex items-center justify-center">
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm flex-shrink-0`}>
                        <category.icon 
                          className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200 truncate block">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Tablet and Mobile Carousel */}
          <div className="lg:hidden">
            <Carousel className="w-full">
              {categoryChunks.map((chunk, chunkIndex) => (
                <CarouselItem key={chunkIndex} className="pl-1">
                  <div className="grid grid-cols-4 gap-4 px-2">
                    {chunk.map((category) => (
                      <Link key={category.id} href={`/products?category=${category.id}`}>
                        <Card
                          className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-800 h-28 shadow-md hover:shadow-2xl"
                        >
                          <CardContent className="p-2 h-full flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center space-y-1">
                              <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                                <category.icon 
                                  className="w-6 h-6 text-slate-600 group-hover:text-slate-800 transition-colors duration-300"
                                />
                              </div>
                              <div className="text-center px-1">
                                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 leading-tight break-words">
                                  {category.name}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Товары
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Лучшие предложения товаров
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/products">
                Все товары
              </Link>
            </Button>
          </div>
          
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {displayedProducts.map((product) => (
                  <Suspense key={product.id} fallback={
                    <Card className="border-0 bg-white dark:bg-slate-900 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        <div className="p-3 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="flex items-center justify-between">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  }>
                    <ProductCard product={product} />
                  </Suspense>
                ))}
              </div>
              
              {/* Кнопка "Показать еще" для товаров */}
              {productsItems.length > maxProductsToShow && (
                <div className="text-center mt-8">
                  <Button 
                    onClick={() => setShowMoreProducts(!showMoreProducts)}
                    variant="outline"
                    className="bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-gray-300 dark:border-gray-600"
                  >
                    {showMoreProducts ? "Скрыть" : `Показать еще ${productsItems.length - maxProductsToShow} товаров`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">Товары загружаются...</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Услуги
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Профессиональные услуги от проверенных специалистов
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/products?category=services">
                Все услуги
              </Link>
            </Button>
          </div>
          
          {displayedServices.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {displayedServices.map((product) => (
                  <Suspense key={product.id} fallback={
                    <Card className="border-0 bg-white dark:bg-slate-900 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        <div className="p-3 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="flex items-center justify-between">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  }>
                    <ProductCard product={product} />
                  </Suspense>
                ))}
              </div>
              
              {/* Кнопка "Показать еще" для услуг */}
              {servicesItems.length > maxServicesToShow && (
                <div className="text-center mt-8">
                  <Button 
                    onClick={() => setShowMoreServices(!showMoreServices)}
                    variant="outline"
                    className="bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-gray-300 dark:border-gray-600"
                  >
                    {showMoreServices ? "Скрыть" : `Показать еще ${servicesItems.length - maxServicesToShow} услуг`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">Услуги загружаются...</p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Buttons */}
      <div className="mt-6 sm:hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">
                Все товары
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/products?category=services">
                Все услуги
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around py-3">
          <button 
            className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            onClick={handleMobileSearchClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button 
            className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 relative"
            onClick={handleFavoritesClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favoritesCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount}
              </div>
            )}
          </button>
          
          <button 
            className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            onClick={handleAddListingClick}
          >
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
          
          <button className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </div>
          </button>
          
          <button 
            className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            onClick={handleProfileClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Войти в аккаунт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Для доступа к профилю необходимо войти в аккаунт
            </p>
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleLogin}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Войти
              </Button>
              <Button 
                onClick={handleRegister}
                variant="outline"
                className="w-full"
              >
                Регистрация
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Listing Modal */}
      <AddListingModal 
        isOpen={showAddListingModal} 
        onClose={() => setShowAddListingModal(false)} 
        onSubmit={handleAddListingSubmit}
      />

      {/* Favorites Modal */}
      <Dialog open={showFavoritesModal} onOpenChange={setShowFavoritesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
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
              <svg className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Список избранного пуст
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Добавьте товары и услуги в избранное, чтобы они отображались здесь
              </p>
              <Button onClick={() => setShowFavoritesModal(false)}>
                Перейти к товарам
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Кнопка очистки */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFavorites}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Очистить все
                </Button>
              </div>

              {/* Список избранных товаров */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {favorites.map((product) => (
                  <Card key={product.id} className="group hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Изображение */}
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📦
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-1 -right-1 text-xs"
                          >
                            {product.condition === 'new' ? 'Новый' : 
                             product.condition === 'excellent' ? 'Отличное' :
                             product.condition === 'good' ? 'Хорошее' : 'Удовлетворительное'}
                          </Badge>
                        </div>

                        {/* Информация о товаре */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/product/${product.id}`}
                                className="block"
                                onClick={() => setShowFavoritesModal(false)}
                              >
                                <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                                  {product.title}
                                </h3>
                              </Link>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {product.category === 'electronics' ? 'Электроника' :
                                   product.category === 'clothing' ? 'Одежда' :
                                   product.category === 'furniture' ? 'Мебель' :
                                   product.category === 'cars' ? 'Автомобили' :
                                   product.category === 'real_estate' ? 'Недвижимость' :
                                   product.category === 'services' ? 'Услуги' :
                                   product.category === 'kids' ? 'Детские товары' : 'Товары'}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                  {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
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
                              onClick={() => removeFromFavorites(product.id)}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
