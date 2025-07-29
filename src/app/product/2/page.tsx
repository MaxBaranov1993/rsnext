"use client";

import { ProductDetail } from "@/components/ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Демо-данные для второго товара
const demoProductDetail2 = {
  id: "2",
  title: "MacBook Air M2 13-inch 8GB RAM 256GB SSD - Новый",
  price: 120000,
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&sat=-50",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&brightness=50",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&contrast=50"
  ],
  description: "Продаю новый MacBook Air M2 в оригинальной упаковке. Ноутбук куплен в официальном магазине Apple, имеет полную гарантию производителя. Модель с чипом M2, 8GB RAM и 256GB SSD. Цвет - серебристый. Идеально подходит для работы, учебы и творческих задач. Включает все аксессуары: зарядное устройство, кабель, документацию. Продаю в связи с изменением планов.",
  category: "Электроника",
  location: "Нови Сад, Сербия",
  seller: {
    name: "Анна Стојановић",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    memberSince: "2021-08-20T00:00:00Z",
    totalSales: 23,
    responseTime: "В течение 1 часа"
  },
  condition: "new" as const,
  views: 89,
  publishedAt: "2024-01-14T15:45:00Z",
  features: [
    "Чип Apple M2",
    "8GB RAM",
    "256GB SSD",
    "13.3-дюймовый дисплей",
    "Новый в упаковке",
    "Полная гарантия Apple",
    "Все аксессуары в комплекте",
    "Серебристый цвет"
  ],
  specifications: {
    "Модель": "MacBook Air M2",
    "Процессор": "Apple M2",
    "RAM": "8GB",
    "SSD": "256GB",
    "Экран": "13.3 дюйма",
    "Цвет": "Серебристый",
    "Состояние": "Новый",
    "Гарантия": "Полная Apple",
    "Комплектация": "Полная",
    "Страна производства": "Китай",
    "Дата покупки": "Декабрь 2023"
  }
};

export default function ProductPage2() {
  const product = demoProductDetail2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header с кнопкой "Назад" */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Просмотр товара
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <ProductDetail product={product} />
    </div>
  );
}