import { useState, useEffect, useCallback } from 'react';
import { getProductImages, getCategoryImages } from '../unsplash';

interface UseProductImagesProps {
  productTitle: string;
  category: string;
  count?: number;
}

export function useProductImages({ productTitle, category, count = 3 }: UseProductImagesProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Пытаемся получить изображения на основе названия товара
      const productImages = await getProductImages(productTitle, category, count);
      setImages(productImages);
    } catch (err) {
      console.error('Error loading product images:', err);
      setError('Не удалось загрузить изображения');
      
      // Пытаемся загрузить изображения по категории как fallback
      try {
        const categoryImages = await getCategoryImages(category, count);
        setImages(categoryImages);
      } catch (fallbackErr) {
        console.error('Error loading fallback images:', fallbackErr);
        // Используем статические fallback изображения
        setImages(getStaticFallbackImages(category, count));
      }
    } finally {
      setLoading(false);
    }
  }, [productTitle, category, count]);

  useEffect(() => {
    let isMounted = true;

    const loadImagesWithCleanup = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        setError(null);

        // Пытаемся получить изображения на основе названия товара
        const productImages = await getProductImages(productTitle, category, count);
        
        if (isMounted) {
          setImages(productImages);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading product images:', err);
          setError('Не удалось загрузить изображения');
          
          // Пытаемся загрузить изображения по категории как fallback
          try {
            const categoryImages = await getCategoryImages(category, count);
            if (isMounted) {
              setImages(categoryImages);
            }
          } catch (fallbackErr) {
            console.error('Error loading fallback images:', fallbackErr);
            if (isMounted) {
              // Используем статические fallback изображения
              setImages(getStaticFallbackImages(category, count));
            }
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImagesWithCleanup();

    return () => {
      isMounted = false;
    };
  }, [productTitle, category, count]);

  return { images, loading, error, reload: loadImages };
}

// Статические fallback изображения для случаев, когда API недоступен
function getStaticFallbackImages(category: string, count: number): string[] {
  const fallbackUrls = {
    electronics: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop'
    ],
    clothing: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop'
    ],
    furniture: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
    ],
    cars: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop'
    ],
    real_estate: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=400&fit=crop'
    ],
    services: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop'
    ],
    kids: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop'
    ],
    goods: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop'
    ]
  };

  const categoryImages = fallbackUrls[category as keyof typeof fallbackUrls] || fallbackUrls.goods;
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push(categoryImages[i % categoryImages.length]);
  }
  
  return result;
}