"use client";

import { useState, useEffect } from 'react';
import { IMAGE_PROVIDERS } from '../image-providers';

interface UseProductImagesOptions {
  category?: string;
  productId?: string;
  count?: number;
}

export function useProductImages(options: UseProductImagesOptions = {}) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImages = () => {
      try {
        setLoading(true);
        setError(null);

        const count = options.count || 4;
        const category = options.category || 'general';
        const productId = options.productId || '1';

        // Генерируем изображения на основе категории и ID продукта
        const generatedImages: string[] = [];

        for (let i = 0; i < count; i++) {
          let imageUrl: string;

          switch (category) {
            case 'electronics':
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 10, 800, 600);
              break;
            case 'cars':
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 20, 800, 600);
              break;
            case 'furniture':
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 30, 800, 600);
              break;
            case 'clothing':
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 40, 800, 600);
              break;
            case 'real_estate':
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 50, 800, 600);
              break;
            case 'services':
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 60, 800, 600);
              break;
            default:
              imageUrl = IMAGE_PROVIDERS.picsum(parseInt(productId) + i * 5, 800, 600);
          }

          generatedImages.push(imageUrl);
        }

        setImages(generatedImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate images');
      } finally {
        setLoading(false);
      }
    };

    generateImages();
  }, [options.category, options.productId, options.count]);

  return { images, loading, error };
} 