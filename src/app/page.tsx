"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect, Suspense } from "react";
import { useProductsWithSellers } from "@/lib/hooks/useProducts";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { MobileNavigation } from "@/components/MobileNavigation";
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
  Map
} from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [showMoreServices, setShowMoreServices] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  
  const { products } = useProductsWithSellers({ limit: 15, sortBy: 'publishedAt', sortOrder: 'desc' });
  const { favoritesCount } = useFavorites();
  const router = useRouter();

  // Фильтрация товаров и услуг
  const productsItems = products.filter(product => product.category !== 'services');
  const servicesItems = products.filter(product => product.category === 'services');
  
  // Ограничение до 3 рядов (15 товаров на больших экранах, 6 на средних)
  const maxProductsToShow = 15; // 3 ряда по 5 товаров
  const maxServicesToShow = 15; // 3 ряда по 5 услуг
  
  const displayedProducts = showMoreProducts ? productsItems : productsItems.slice(0, maxProductsToShow);
  const displayedServices = showMoreServices ? servicesItems : servicesItems.slice(0, maxServicesToShow);





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

  const handleLogin = () => {
    router.push('/login');
    setShowAuthModal(false);
  };

  const handleRegister = () => {
    router.push('/register');
    setShowAuthModal(false);
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
         <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
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
         <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Desktop Grid - только для больших экранов */}
          <div className="hidden lg:grid lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card
                  className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-800 h-24 overflow-hidden"
                >
                  <CardContent className="p-4 h-full flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-3 w-full text-center">
                      <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm flex-shrink-0`}>
                        <category.icon 
                          className="w-7 h-7 text-slate-600 group-hover:text-slate-800 transition-colors duration-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200 leading-tight break-words line-clamp-2">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

                     {/* Tablet and Mobile Grid - без карусели */}
           <div className="lg:hidden">
             <div className="mb-4 sm:mb-6">
               <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                 Категории
               </h2>
               <p className="text-sm text-slate-600 dark:text-slate-400">
                 Выберите интересующую вас категорию
               </p>
             </div>
             
                           <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.id}`}>
                    <Card
                      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-800 w-full h-20 sm:h-24 shadow-md hover:shadow-2xl"
                    >
                     <CardContent className="p-2 sm:p-3 h-full flex flex-col items-center justify-center">
                       <div className="flex flex-col items-center space-y-2 w-full">
                         <div className={`w-8 h-8 sm:w-10 sm:h-10 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                           <category.icon 
                             className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-slate-800 transition-colors duration-300"
                           />
                         </div>
                         <div className="text-center w-full">
                           <span className="text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 leading-tight truncate block">
                             {category.name}
                           </span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </Link>
               ))}
             </div>
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

      {/* Mobile Navigation */}
      <MobileNavigation 
        isAuthenticated={isAuthenticated}
        onAuthModalOpen={() => setShowAuthModal(true)}
      />

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



      

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-500" />
              Карта
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 min-h-0">
            <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Карта загружается...
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Mapbox API: pk.eyJ1IjoibWFrc2ltMTk5MyIsImEiOiJjbWRxMGgzc3AwMWY3MnNzZngzdzhoYnhmIn0.RAlxNWhEuSKhPR8E2Jy8Rw
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
