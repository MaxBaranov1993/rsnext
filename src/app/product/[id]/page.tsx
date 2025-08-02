import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProductWithSeller, getAllProductIds, truncateText } from '@/lib/utils';
import { ProductPageClient } from './ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Генерируем статические пути для всех товаров
export async function generateStaticParams() {
  const productIds = await getAllProductIds();
  return productIds.map((id) => ({
    id: id,
  }));
}

// Получаем данные товара
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const productWithSeller = await getProductWithSeller(id);
  
  if (!productWithSeller) {
    return {
      title: 'Товар не найден',
    };
  }

  const truncatedTitle = truncateText(productWithSeller.title, 60);

  return {
    title: `${truncatedTitle} - rSALE`,
    description: truncatedTitle,
    openGraph: {
      title: truncatedTitle,
      description: `Цена: ${new Intl.NumberFormat('ru-RU').format(productWithSeller.price)} ₽`,
      images: [
        {
          url: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=1200&h=630&fit=crop`,
          width: 1200,
          height: 630,
          alt: truncatedTitle,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productWithSeller = await getProductWithSeller(id);

  if (!productWithSeller) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Загрузка товара...</p>
          </div>
        </div>
      </div>
    }>
      <ProductPageClient product={productWithSeller} />
    </Suspense>
  );
}