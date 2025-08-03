"use client";

import { useState, useEffect } from 'react';
import { ProductDetail } from '@/components/ProductDetail';
import { Product } from '@/types/product';
import { ProductSeller } from '@/types/product';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProductPageClientProps {
  product: Product & { seller?: ProductSeller | null };
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
  }, []);

  const handleMapClick = () => {
    setShowMapModal(true);
  };

  const handleLogin = () => {
    router.push('/login');
    setShowAuthModal(false);
  };

  const handleRegister = () => {
    router.push('/register');
    setShowAuthModal(false);
  };

  return (
    <>
      <ProductDetail product={product} onMapClick={handleMapClick} />
      
      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                Карта
              </h2>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-4">
              <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
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
          </div>
        </div>
      )}

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
    </>
  );
} 