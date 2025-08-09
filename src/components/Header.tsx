"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FavoritesButton } from "@/components/FavoritesButton";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { Input } from "@/components/ui/input";
import { Menu, Plus, User, Heart, MessageCircle, Home, Package, Briefcase, Settings, LogOut, MapPin, Globe, ChevronDown } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedLanguage, setSelectedLanguage] = useState("Русский");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavoritesDialogOpen, setIsFavoritesDialogOpen] = useState(false);
  
  const { favorites, favoritesCount, removeFromFavorites, clearFavorites } = useFavorites();

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Проверяем авторизацию при загрузке (можно заменить на реальную проверку)
  useEffect(() => {
    // Имитация проверки авторизации - можно заменить на реальную логику
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
  }, []);



  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      setIsFavoritesDialogOpen(true);
      setIsMobileMenuOpen(false);
    } else {
      // Показать модальное окно авторизации или перенаправить на страницу входа
      window.location.href = '/login';
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.name === selectedLanguage) || languages[2]; // По умолчанию русский
  };

  return (
    <>


      <header className={`md:sticky md:top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-200 overflow-x-hidden ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        {/* Верхняя панель с городом и языком */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Выбор города */}
              <div className="flex items-center space-x-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200 rounded-lg"
                    >
                      <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm font-medium">{selectedCity}</span>
                      <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <div className="p-2">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">
                        Выберите город
                      </div>
                      {serbianCities.map((city) => (
                        <DropdownMenuItem 
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                            selectedCity === city 
                              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium" 
                              : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <MapPin className="w-3 h-3 mr-2 text-purple-500" />
                          {city}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Выбор языка */}
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-3 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200 rounded-lg"
                    >
                      <Globe className="w-4 h-4 mr-2 text-purple-500" />
                      <Image 
                        src={getCurrentLanguage().flag} 
                        alt={getCurrentLanguage().name} 
                        width={16} 
                        height={16} 
                        className="w-4 h-4 mr-2 rounded-sm" 
                      />
                      <span className="text-sm font-medium">{selectedLanguage}</span>
                      <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="p-2">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">
                        Выберите язык
                      </div>
                      {languages.map((language) => (
                        <DropdownMenuItem 
                          key={language.code}
                          onClick={() => handleLanguageSelect(language.name)}
                          className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                            selectedLanguage === language.name 
                              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium" 
                              : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Image 
                            src={language.flag} 
                            alt={language.name} 
                            width={20} 
                            height={20} 
                            className="w-5 h-5 mr-3 rounded-sm" 
                          />
                          <span>{language.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <Image 
                  src="/svg/logo.svg" 
                  alt="rSALE Logo" 
                  width={160} 
                  height={160} 
                  className="hidden sm:block h-12 w-12 sm:h-34 sm:w-34 transition-transform duration-200 group-hover:scale-105" 
                  priority
                />
              </Link>
            </div>
            
            {/* Mobile Search */}
            <div className="sm:hidden flex-1 mx-4">
              <div className="relative">
                <Input 
                  placeholder="Поиск..." 
                  className="pr-16 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors duration-200"
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
                  className="pr-16 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors duration-200"
                  size="sm"
                >
                  Найти
                </Button>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-3">
              {isAuthenticated && (
                <Button asChild variant="default" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link href="/add-listing">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Добавить объявление</span>
                    <span className="lg:hidden">Добавить</span>
                  </Link>
                </Button>
              )}
              
              <FavoritesButton />
              
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/20 relative transition-all duration-200 hover:border-purple-300 hover:text-purple-700">
                <MessageCircle className="w-4 h-4" />
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              
              {isAuthenticated ? (
                // Если пользователь авторизован - показываем только профиль
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 transition-all duration-200">
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden lg:inline">Профиль</span>
                      <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Личный кабинет
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Если пользователь не авторизован - показываем кнопки входа и регистрации
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/20 transition-all duration-200">
                      Войти
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Регистрация
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Мобильное меню */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle className="text-left">Меню</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Основные пункты меню */}
                  <div className="space-y-2">
                    <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Home className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">Главная</span>
                    </Link>
                    
                    <Link href="/products" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">Товары</span>
                    </Link>
                    
                    <Link href="/services" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <Briefcase className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">Услуги</span>
                    </Link>
                  </div>

                  {/* Кнопка добавления объявления */}
                  {isAuthenticated && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Link href="/add-listing" className="flex items-center space-x-3 p-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                        <Plus className="h-5 w-5" />
                        <span>Добавить объявление</span>
                      </Link>
                    </div>
                  )}

                  {/* Пользовательские функции */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <button 
                      onClick={handleFavoritesClick}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left transition-colors"
                    >
                      <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">Избранное</span>
                      {favoritesCount > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {favoritesCount}
                        </Badge>
                      )}
                    </button>
                    
                    <Link href="/messages" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <MessageCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-slate-100">Сообщения</span>
                      <Badge variant="destructive" className="ml-auto">3</Badge>
                    </Link>
                  </div>

                  {/* Профиль и авторизация */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Link href="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">Профиль</span>
                        </Link>
                        
                        <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">Настройки</span>
                        </Link>
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left transition-colors"
                        >
                          <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                          <span className="text-red-600 dark:text-red-400">Выйти</span>
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">Войти</span>
                        </Link>
                        
                        <Link href="/register" className="flex items-center space-x-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                          <User className="h-5 w-5" />
                          <span>Регистрация</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Favorites Dialog */}
      <Dialog open={isFavoritesDialogOpen} onOpenChange={setIsFavoritesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
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
              <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Список избранного пуст
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Добавьте товары и услуги в избранное, чтобы они отображались здесь
              </p>
              <Button onClick={() => setIsFavoritesDialogOpen(false)}>
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
                                onClick={() => setIsFavoritesDialogOpen(false)}
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
    </>
  );
}