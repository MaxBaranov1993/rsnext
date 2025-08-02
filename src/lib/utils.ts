import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product, ProductSeller } from "@/types/product"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Загружаем данные товаров из JSON файла
async function loadProducts(): Promise<Product[]> {
  try {
    // Пытаемся загрузить через fetch (для клиента)
    if (typeof window !== 'undefined') {
      const response = await fetch('/data/products.json', {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Ошибка загрузки товаров:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      return data.products || [];
    } else {
      // Для сервера используем fs
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      return data.products || [];
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return [];
  }
}

// Загружаем данные продавцов из JSON файла
async function loadSellers(): Promise<ProductSeller[]> {
  try {
    // Пытаемся загрузить через fetch (для клиента)
    if (typeof window !== 'undefined') {
      const response = await fetch('/data/sellers.json', {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Ошибка загрузки продавцов:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      return data.sellers || [];
    } else {
      // Для сервера используем fs
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      return data.sellers || [];
    }
  } catch (error) {
    console.error('Ошибка загрузки продавцов:', error);
    return [];
  }
}

// Получаем товар по ID
export async function getProductById(id: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find(product => product.id === id) || null;
}

// Получаем продавца по ID
export async function getSellerById(id: string): Promise<ProductSeller | null> {
  const sellers = await loadSellers();
  return sellers.find(seller => seller.id === id) || null;
}

// Получаем товар с данными продавца
export async function getProductWithSeller(id: string): Promise<(Product & { seller: ProductSeller | null }) | null> {
  try {
    // Пытаемся загрузить через fetch (для клиента)
    if (typeof window !== 'undefined') {
      const [productsResponse, sellersResponse] = await Promise.all([
        fetch('/data/products.json', {
          headers: {
            'Accept': 'application/json',
          },
        }),
        fetch('/data/sellers.json', {
          headers: {
            'Accept': 'application/json',
          },
        })
      ]);

      if (!productsResponse.ok || !sellersResponse.ok) {
        console.error('Ошибка загрузки данных:', {
          productsOk: productsResponse.ok,
          sellersOk: sellersResponse.ok,
          productsStatus: productsResponse.status,
          sellersStatus: sellersResponse.status
        });
        return null;
      }

      const [productsData, sellersData] = await Promise.all([
        productsResponse.json(),
        sellersResponse.json()
      ]);

      const products = productsData.products || [];
      const sellers = sellersData.sellers || [];

      const product = products.find((p: Product) => p.id === id);
      if (!product) {
        console.error('Товар не найден:', id);
        return null;
      }

      const seller = sellers.find((s: ProductSeller) => s.id === product.sellerId);

      return {
        ...product,
        seller: seller || null
      };
    } else {
      // Для сервера используем fs
      const fs = await import('fs');
      const path = await import('path');
      const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
      const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
      
      const [productsContent, sellersContent] = await Promise.all([
        fs.promises.readFile(productsPath, 'utf8'),
        fs.promises.readFile(sellersPath, 'utf8')
      ]);
      
      const productsData = JSON.parse(productsContent);
      const sellersData = JSON.parse(sellersContent);
      
      const products = productsData.products || [];
      const sellers = sellersData.sellers || [];

      const product = products.find((p: Product) => p.id === id);
      if (!product) {
        console.error('Товар не найден:', id);
        return null;
      }

      const seller = sellers.find((s: ProductSeller) => s.id === product.sellerId);

      return {
        ...product,
        seller: seller || null
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки товара:', error);
    return null;
  }
}

// Получаем все ID товаров для генерации статических путей
export async function getAllProductIds(): Promise<string[]> {
  const products = await loadProducts();
  return products.map(product => product.id);
}

// Получаем все товары
export async function getAllProducts(): Promise<Product[]> {
  return await loadProducts();
}

// Получаем все товары с данными продавцов
export async function getAllProductsWithSellers(): Promise<(Product & { seller: ProductSeller | null })[]> {
  try {
    // Пытаемся загрузить через fetch (для клиента)
    if (typeof window !== 'undefined') {
      const [productsResponse, sellersResponse] = await Promise.all([
        fetch('/data/products.json', {
          headers: {
            'Accept': 'application/json',
          },
        }),
        fetch('/data/sellers.json', {
          headers: {
            'Accept': 'application/json',
          },
        })
      ]);

      if (!productsResponse.ok || !sellersResponse.ok) {
        console.error('Ошибка загрузки данных:', {
          productsOk: productsResponse.ok,
          sellersOk: sellersResponse.ok,
          productsStatus: productsResponse.status,
          sellersStatus: sellersResponse.status
        });
        throw new Error('Ошибка загрузки данных');
      }

      const [productsData, sellersData] = await Promise.all([
        productsResponse.json(),
        sellersResponse.json()
      ]);

      const products = productsData.products || [];
      const sellers = sellersData.sellers || [];

      // Объединяем товары с данными продавцов
      const productsWithSellers = products.map((product: Product) => {
        const seller = sellers.find((s: ProductSeller) => s.id === product.sellerId);
        return {
          ...product,
          seller: seller || null
        };
      });

      return productsWithSellers;
    } else {
      // Для сервера используем fs
      const fs = await import('fs');
      const path = await import('path');
      const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
      const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
      
      const [productsContent, sellersContent] = await Promise.all([
        fs.promises.readFile(productsPath, 'utf8'),
        fs.promises.readFile(sellersPath, 'utf8')
      ]);
      
      const productsData = JSON.parse(productsContent);
      const sellersData = JSON.parse(sellersContent);
      
      const products = productsData.products || [];
      const sellers = sellersData.sellers || [];

      // Объединяем товары с данными продавцов
      const productsWithSellers = products.map((product: Product) => {
        const seller = sellers.find((s: ProductSeller) => s.id === product.sellerId);
        return {
          ...product,
          seller: seller || null
        };
      });

      return productsWithSellers;
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return [];
  }
}

/**
 * Обрезает текст до указанной длины с добавлением многоточия
 * @param text - исходный текст
 * @param maxLength - максимальная длина
 * @returns обрезанный текст
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Обрезает название товара для хлебных крошек
 * @param title - название товара
 * @returns обрезанное название
 */
export function truncateProductTitleForBreadcrumbs(title: string): string {
  return truncateText(title, 40);
}

/**
 * Обрезает название товара для карточки товара
 * @param title - название товара
 * @returns обрезанное название
 */
export function truncateProductTitleForCard(title: string): string {
  return truncateText(title, 60);
}
