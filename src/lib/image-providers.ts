// Различные провайдеры изображений для обхода CORS

export const IMAGE_PROVIDERS = {
  // Picsum Photos - бесплатные случайные изображения
  picsum: (id: number, width: number = 800, height: number = 600) => 
    `https://picsum.photos/id/${id}/${width}/${height}`,
  
  // Lorem Picsum - альтернативный сервис
  lorem: (width: number = 800, height: number = 600) => 
    `https://loremflickr.com/${width}/${height}`,
  
  // Placeholder.com - для заглушек
  placeholder: (width: number = 800, height: number = 600, text?: string) => 
    `https://via.placeholder.com/${width}x${height}${text ? `/${encodeURIComponent(text)}` : ''}`,
  
  // Unsplash через прокси
  unsplashProxy: (photoId: string, width: number = 800, height: number = 600) => 
    `/api/unsplash?url=${encodeURIComponent(`https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format`)}`,
  
  // Локальные изображения
  local: (path: string) => path
};

// Демо-данные с разными провайдерами
export const DEMO_IMAGES = {
  phone: [
    IMAGE_PROVIDERS.picsum(1, 800, 600),
    IMAGE_PROVIDERS.picsum(2, 800, 600),
    IMAGE_PROVIDERS.picsum(3, 800, 600),
    IMAGE_PROVIDERS.picsum(4, 800, 600)
  ],
  car: [
    IMAGE_PROVIDERS.picsum(5, 800, 600),
    IMAGE_PROVIDERS.picsum(6, 800, 600),
    IMAGE_PROVIDERS.picsum(7, 800, 600),
    IMAGE_PROVIDERS.picsum(8, 800, 600)
  ],
  furniture: [
    IMAGE_PROVIDERS.picsum(9, 800, 600),
    IMAGE_PROVIDERS.picsum(10, 800, 600),
    IMAGE_PROVIDERS.picsum(11, 800, 600),
    IMAGE_PROVIDERS.picsum(12, 800, 600)
  ]
};