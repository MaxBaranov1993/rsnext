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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");

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
      id: "auto",
      name: "Авто",
      icon: "/svg/categoryCar.svg",
      color: "bg-green-100"
    },
    {
      id: "real-estate",
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
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        {/* Language Selector - Desktop Only */}
        <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-1">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">{selectedCity}</span>
                    <svg className="w-2 h-2 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                  {serbianCities.map((city) => (
                    <DropdownMenuItem 
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={selectedCity === city ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : ""}
                    >
                      {city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                    <img src={getCurrentLanguage().flag} alt={getCurrentLanguage().name} className="w-3 h-3 mr-1" />
                    <span className="text-xs">{selectedLanguage}</span>
                    <svg className="w-2 h-2 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((language) => (
                    <DropdownMenuItem 
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.name)}
                      className={selectedLanguage === language.name ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : ""}
                    >
                      <img src={language.flag} alt={language.name} className="w-4 h-4 mr-2" />
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Mobile Language and City Selector */}
        <div className="sm:hidden border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-1">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">{selectedCity}</span>
                    <svg className="w-2 h-2 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                  {serbianCities.map((city) => (
                    <DropdownMenuItem 
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={selectedCity === city ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : ""}
                    >
                      {city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                    <img src={getCurrentLanguage().flag} alt={getCurrentLanguage().name} className="w-3 h-3 mr-1" />
                    <span className="text-xs">{selectedLanguage}</span>
                    <svg className="w-2 h-2 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((language) => (
                    <DropdownMenuItem 
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.name)}
                      className={selectedLanguage === language.name ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : ""}
                    >
                      <img src={language.flag} alt={language.name} className="w-4 h-4 mr-2" />
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src="/svg/logo.svg" alt="rSALE Logo" className="hidden sm:block h-6 w-auto sm:h-8" />
              <Button variant="default" className="hidden sm:inline-flex bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-4">
                Категории
              </Button>
            </div>
            
            {/* Mobile Search */}
            <div className="sm:hidden flex-1 mx-4">
              <div className="relative">
                <Input 
                  placeholder="Поиск..." 
                  className="pr-16"
                />
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-orange-500 hover:bg-orange-600 text-white text-sm"
                  size="sm"
                >
                  Найти
                </Button>
              </div>
            </div>
            
            <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input 
                  placeholder="Поиск товаров, услуг, компаний..." 
                  className="pr-16"
                />
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-3 bg-orange-500 hover:bg-orange-600 text-white text-sm"
                  size="sm"
                >
                  Найти
                </Button>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-4">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/20 relative">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="hidden lg:inline">Сообщения</span>
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline">Войти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Grid - только для больших экранов */}
          <div className="hidden lg:grid lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <Card
                key={category.id}
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
            ))}
          </div>

          {/* Tablet and Mobile Carousel */}
          <div className="lg:hidden">
            <Carousel 
              showArrows={false} 
              showIndicators={false}
              enableSwipe={true}
            >
              {categoryChunks.map((chunk, chunkIndex) => (
                <CarouselItem key={chunkIndex}>
                  <div className="grid grid-cols-4 gap-3">
                    {chunk.map((category) => (
                      <Card
                        key={category.id}
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
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
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
          
          <button className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
