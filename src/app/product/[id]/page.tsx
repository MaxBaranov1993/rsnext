import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/ProductDetail';
import { getProductWithSeller, getAllProductIds, truncateText } from '@/lib/utils';

interface ProductPageProps {
  params: {
    id: string;
  };
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
  const productWithSeller = await getProductWithSeller(params.id);
  
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
  const productWithSeller = await getProductWithSeller(params.id);

  if (!productWithSeller) {
    notFound();
  }

  return <ProductDetail product={productWithSeller} />;
}