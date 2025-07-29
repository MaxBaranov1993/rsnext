import { ProductDetail } from "@/components/ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Демо-данные для детальной страницы товара
const demoProductDetail = {
  id: "1",
  title: "iPhone 14 Pro Max 256GB - Отличное состояние, полный комплект",
  price: 85000,
  images: [
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&sat=-50", 
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&brightness=50",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&contrast=50"
  ],
  description: "Продаю iPhone 14 Pro Max в отличном состоянии. Телефон куплен в официальном магазине Apple, имеет полную гарантию до декабря 2024 года. Все аксессуары в комплекте: зарядное устройство, кабель, наушники, документация. Телефон никогда не ронялся, нет царапин на экране и корпусе. Батарея держит заряд как новый телефон. Продаю в связи с переходом на новую модель.",
  category: "Электроника",
  location: "Белград, Сербия",
  seller: {
    name: "Милан Петрович",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    memberSince: "2022-03-15T00:00:00Z",
    totalSales: 47,
    responseTime: "В течение 2 часов"
  },
  condition: "excellent" as const,
  views: 127,
  publishedAt: "2024-01-15T10:30:00Z",
  features: [
    "256GB памяти",
    "Отличное состояние",
    "Полная гарантия",
    "Все аксессуары в комплекте",
    "Оригинальная упаковка",
    "Никогда не ремонтировался"
  ],
  specifications: {
    "Модель": "iPhone 14 Pro Max",
    "Память": "256GB",
    "Цвет": "Темно-фиолетовый",
    "Состояние": "Отличное",
    "Гарантия": "До декабря 2024",
    "Комплектация": "Полная",
    "Страна производства": "Китай",
    "Дата покупки": "Март 2023"
  }
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // В реальном приложении здесь был бы запрос к API для получения данных товара по ID
  const { id } = await params;
  const product = demoProductDetail;

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