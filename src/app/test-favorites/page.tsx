"use client";

import { FavoritesButton } from "@/components/FavoritesButton";
import { FavoritesModal } from "@/components/FavoritesModal";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Minus } from "lucide-react";

export default function TestFavoritesPage() {
  const { favorites, favoritesCount, addToFavorites, removeFromFavorites, clearFavorites } = useFavorites();

  // Создаем тестовые товары
  const testProducts = [
    {
      id: "test-1",
      title: "Тестовый товар 1",
      price: 1000,
      category: "electronics" as const,
      condition: "new" as const,
      views: 100,
      publishedAt: "2024-01-01",
      description: "Описание тестового товара 1",
      sellerId: "seller-1",
      seller: {
        id: "seller-1",
        name: "Тестовый продавец",
        avatar: "https://picsum.photos/100/100",
        location: "Москва",
        rating: 4.5,
        totalSales: 50,
        memberSince: "2023-01-01",
        responseTime: "2 часа",
        verified: true,
        type: "individual" as const,
        description: "Описание продавца"
      }
    },
    {
      id: "test-2", 
      title: "Тестовый товар 2",
      price: 2000,
      category: "clothing" as const,
      condition: "excellent" as const,
      views: 200,
      publishedAt: "2024-01-02",
      description: "Описание тестового товара 2",
      sellerId: "seller-2",
      seller: {
        id: "seller-2",
        name: "Другой продавец",
        avatar: "https://picsum.photos/100/100",
        location: "Санкт-Петербург",
        rating: 4.8,
        totalSales: 100,
        memberSince: "2022-06-01",
        responseTime: "1 час",
        verified: true,
        type: "company" as const,
        description: "Описание продавца"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Тест функциональности избранного
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Проверьте работу счетчика в кнопке избранного
          </p>
        </div>

        {/* Текущий статус */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Текущий статус
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Избранных товаров: {favoritesCount}
                </span>
              </div>
              <Badge variant={favoritesCount > 0 ? "default" : "secondary"}>
                {favoritesCount > 0 ? "Есть избранные" : "Нет избранных"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Кнопка избранного */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Кнопка избранного в хедере
            </h2>
            <div className="flex items-center space-x-4">
              <FavoritesButton />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Счетчик показывается только когда есть избранные товары
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Управление тестовыми товарами */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Управление тестовыми товарами
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {product.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Цена: {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => addToFavorites(product)}
                      className="flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Добавить</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromFavorites(product.id)}
                      className="flex items-center space-x-1"
                    >
                      <Minus className="h-4 w-4" />
                      <span>Удалить</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="destructive"
                onClick={clearFavorites}
                className="flex items-center space-x-2"
              >
                <Minus className="h-4 w-4" />
                <span>Очистить все избранное</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Список избранных товаров */}
        {favorites.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Текущие избранные товары ({favorites.length})
              </h2>
              <div className="space-y-2">
                {favorites.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {product.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Модальное окно избранного */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Модальное окно избранного
            </h2>
            <FavoritesModal
              trigger={
                <Button className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Открыть избранное</span>
                  {favoritesCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {favoritesCount}
                    </Badge>
                  )}
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 