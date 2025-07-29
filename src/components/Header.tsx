"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function Header() {
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

  return (
    <>
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
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-40">
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
              <Link href="/">
                <img src="/svg/logo.svg" alt="rSALE Logo" className="hidden sm:block h-6 w-auto sm:h-8" />
              </Link>
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
    </>
  );
}