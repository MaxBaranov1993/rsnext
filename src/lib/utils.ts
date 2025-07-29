import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product, ProductSeller } from "@/types/product"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Загружаем данные товаров из JSON файла
async function loadProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/products.json`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return [];
  }
}

// Загружаем данные продавцов из JSON файла
async function loadSellers(): Promise<ProductSeller[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/sellers.json`);
    const data = await response.json();
    return data.sellers || [];
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
export async function getProductWithSeller(id: string): Promise<(Product & { seller: ProductSeller }) | null> {
  const product = await getProductById(id);
  if (!product) return null;
  
  const seller = await getSellerById(product.sellerId);
  if (!seller) return null;
  
  return { ...product, seller };
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
export async function getAllProductsWithSellers(): Promise<(Product & { seller: ProductSeller })[]> {
  const products = await loadProducts();
  const sellers = await loadSellers();
  
  return products.map(product => {
    const seller = sellers.find(s => s.id === product.sellerId);
    return { ...product, seller: seller! };
  }).filter(product => product.seller);
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
