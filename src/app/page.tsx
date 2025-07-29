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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { products, loading, error, hasMore, loadMore } = useProducts(15);
  const router = useRouter();

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
      icon: "/svg/categoryCar.svg",
      color: "bg-green-100"
    },
    {
      id: "real_estate",
      name: "Недвижимость",
      icon: "/svg/categoryEstate.svg",
      color: "bg-blue-100"
    },
    {
      id: "electronics",
      name: "Электроника",
      icon: "/svg/categoryComputer.svg",
      color: "bg-purple-100"
    },
    {
      id: "clothing",
      name: "Одежда",
      icon: "/svg/categoryClothes.svg",
      color: "bg-pink-100"
    },
    {
      id: "furniture",
      name: "Мебель",
      icon: "/svg/categoryFurniture.svg",
      color: "bg-orange-100"
    },
    {
      id: "services",
      name: "Услуги",
      icon: "/svg/categoryServices.svg",
      color: "bg-yellow-100"
    },
    {
      id: "kids",
      name: "Детям",
      icon: "/svg/categorykids.svg",
      color: "bg-indigo-100"
    },
    {
      id: "goods",
      name: "Товары",
      icon: "/svg/categoryGoods.svg",
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
                        <img 
                          src={category.icon} 
                          alt={category.name}
                          className="w-5 h-5 object-contain group-hover:drop-shadow-md transition-all duration-200"
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
            <Carousel>
              {categoryChunks.map((chunk, chunkIndex) => (
                <CarouselItem key={chunkIndex}>
                  <div className="grid grid-cols-4 gap-3">
                    {chunk.map((category) => (
                      <Link key={category.id} href={`/products?category=${category.id}`}>
                        <Card
                          className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-800 h-20"
                        >
                          <CardContent className="p-2 h-full flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center space-y-1">
                              <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                                <img 
                                  src={category.icon} 
                                  alt={category.name}
                                  className="w-6 h-6 object-contain group-hover:drop-shadow-md transition-all duration-200"
                                />
                              </div>
                              <div className="text-center">
                                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200 leading-tight">
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

      {/* Recommendations Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Рекомендации для вас
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Подборка товаров специально для вас
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/products">
                Все товары
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {products.map((product, index) => (
              <Suspense key={product.id} fallback={
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                      </div>
                      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              }>
                <ProductCard product={product} />
              </Suspense>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button 
                onClick={handleLoadMore}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Загрузить еще"}
              </Button>
            </div>
          )}
          
          {/* Mobile "Все товары" button */}
          <div className="mt-6 sm:hidden text-center">
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">
                Все товары
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Добро пожаловать в rSALE
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Главная страница очищена от всех секций
          </p>
        </div>
      </main>

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
          
          <button className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              5
            </div>
          </button>
          
          <button className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
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
    </div>
  );
}
