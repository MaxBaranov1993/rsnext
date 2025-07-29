const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

// Кэш для изображений по категориям
const imageCache = new Map<string, string[]>();

// Категории товаров и соответствующие запросы для Unsplash
const categoryQueries = {
  electronics: ['electronics', 'smartphone', 'laptop', 'computer', 'gadget'],
  clothing: ['fashion', 'clothing', 'shirt', 'dress', 'shoes'],
  furniture: ['furniture', 'chair', 'table', 'sofa', 'home decor'],
  cars: ['car', 'automobile', 'vehicle', 'transport'],
  real_estate: ['house', 'apartment', 'interior', 'architecture'],
  services: ['service', 'business', 'office', 'professional'],
  kids: ['toy', 'children', 'baby', 'kids'],
  goods: ['product', 'item', 'object', 'goods']
};

export async function getUnsplashImage(query: string, width: number = 800, height: number = 600) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found. Using fallback images.');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&w=${width}&h=${height}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash API');
    }

    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return null;
  }
}

export async function getCategoryImages(category: string, count: number = 3): Promise<string[]> {
  // Проверяем кэш
  const cacheKey = `${category}_${count}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found. Using fallback images.');
    return getFallbackImages(category, count);
  }

  const queries = categoryQueries[category as keyof typeof categoryQueries] || ['product'];
  const images: string[] = [];

  try {
    // Получаем несколько изображений для категории
    for (let i = 0; i < count; i++) {
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      const image = await getUnsplashImage(randomQuery, 400, 400);
      if (image) {
        images.push(image);
      }
    }

    // Если не удалось получить достаточно изображений, добавляем fallback
    while (images.length < count) {
      images.push(getFallbackImage(category));
    }

    // Кэшируем результат
    imageCache.set(cacheKey, images);
    return images;
  } catch (error) {
    console.error('Error fetching category images:', error);
    return getFallbackImages(category, count);
  }
}

export async function getProductImages(productTitle: string, category: string, count: number = 3): Promise<string[]> {
  // Извлекаем ключевые слова из названия товара
  const keywords = productTitle.toLowerCase().split(' ').filter(word => word.length > 3);
  
  if (!UNSPLASH_ACCESS_KEY) {
    return getFallbackImages(category, count);
  }

  const images: string[] = [];
  
  try {
    // Пытаемся найти изображения по ключевым словам из названия
    for (let i = 0; i < Math.min(count, keywords.length); i++) {
      const image = await getUnsplashImage(keywords[i], 400, 400);
      if (image) {
        images.push(image);
      }
    }

    // Если не хватает изображений, добавляем из категории
    if (images.length < count) {
      const categoryImages = await getCategoryImages(category, count - images.length);
      images.push(...categoryImages);
    }

    // Убираем дубликаты
    const uniqueImages = [...new Set(images)];
    
    // Если все еще не хватает, добавляем fallback
    while (uniqueImages.length < count) {
      uniqueImages.push(getFallbackImage(category));
    }

    return uniqueImages.slice(0, count);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return getFallbackImages(category, count);
  }
}

function getFallbackImages(category: string, count: number): string[] {
  const fallbackImages = [];
  for (let i = 0; i < count; i++) {
    fallbackImages.push(getFallbackImage(category));
  }
  return fallbackImages;
}

function getFallbackImage(category: string): string {
  // Fallback изображения для разных категорий
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
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
}

export function getUnsplashImageUrl(photoId: string, width: number = 800, height: number = 600) {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format`;
}

// Функция для очистки кэша (можно вызывать периодически)
export function clearImageCache() {
  imageCache.clear();
}