"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddListingModal } from './AddListingModal'
import { useFavorites } from '@/lib/contexts/FavoritesContext'

interface MobileNavigationProps {
  isAuthenticated: boolean
  onAuthModalOpen: () => void
}

export function MobileNavigation({ isAuthenticated, onAuthModalOpen }: MobileNavigationProps) {
  const router = useRouter()
  const { favoritesCount } = useFavorites()
  const [showAddListingModal, setShowAddListingModal] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)

  const handleMobileSearchClick = () => {
    // Здесь можно добавить логику для открытия мобильного поиска
    console.log('Открыть мобильный поиск')
  }

  const handleFavoritesClick = () => {
    setShowFavoritesModal(true)
  }

  const handleAddListingClick = () => {
    if (isAuthenticated) {
      setShowAddListingModal(true)
    } else {
      onAuthModalOpen()
    }
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profile')
    } else {
      onAuthModalOpen()
    }
  }

  const handleAddListingSubmit = (data: { 
    title: string; 
    description: string; 
    price: number; 
    category: string; 
    condition: string; 
    location: string; 
    images: File[]; 
    type: 'product' | 'service' 
  }) => {
    console.log('Добавление объявления:', data)
    setShowAddListingModal(false)
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around py-3">
          {/* Кнопка поиска */}
          <button 
            className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            onClick={handleMobileSearchClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Кнопка избранного */}
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
          
          {/* Кнопка добавления объявления */}
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
          
          {/* Кнопка сообщений */}
          <button className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </div>
          </button>
          
          {/* Кнопка профиля */}
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
          <div className="flex-1 overflow-y-auto">
            {/* Здесь будет содержимое избранного */}
            <div className="text-center text-gray-500 py-8">
              {favoritesCount === 0 ? (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="mt-2">У вас пока нет избранных товаров</p>
                </div>
              ) : (
                <p>Список избранных товаров</p>
              )}
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
    </>
  )
} 