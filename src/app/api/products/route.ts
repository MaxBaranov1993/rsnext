import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Путь к JSON файлам с данными
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    
    // Читаем файлы
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const products = JSON.parse(productsData);
    const sellers = JSON.parse(sellersData);
    
    // Создаем Map для быстрого поиска продавцов
    const sellersMap = new Map(sellers.sellers.map((seller: any) => [seller.id, seller]));
    
    // Связываем продукты с продавцами
    let productsWithSellers = products.products.map((product: any) => ({
      ...product,
      seller: sellersMap.get(product.sellerId) || null
    }));
    
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const condition = searchParams.get('condition') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sellerId = searchParams.get('sellerId') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    let filteredProducts = productsWithSellers;
    
    // Фильтрация по поиску
    if (search) {
      filteredProducts = filteredProducts.filter((product: any) =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Фильтрация по категории
    if (category) {
      filteredProducts = filteredProducts.filter((product: any) => product.category === category);
    }
    
    // Фильтрация по состоянию
    if (condition) {
      filteredProducts = filteredProducts.filter((product: any) => product.condition === condition);
    }
    
    // Фильтрация по цене
    if (minPrice) {
      filteredProducts = filteredProducts.filter((product: any) => product.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter((product: any) => product.price <= parseInt(maxPrice));
    }
    
    // Фильтрация по продавцу
    if (sellerId) {
      filteredProducts = filteredProducts.filter((product: any) => product.sellerId === sellerId);
    }
    
    // Сортировка
    filteredProducts.sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price' || sortBy === 'views') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (sortBy === 'publishedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Метаданные для пагинации
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке данных продуктов:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке данных продуктов' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Путь к JSON файлу
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    // Читаем существующие данные
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);
    
    // Генерируем новый ID
    const newId = (Math.max(...products.products.map((p: any) => parseInt(p.id))) + 1).toString();
    
    // Создаем новый продукт
    const newProduct = {
      id: newId,
      ...body,
      views: body.views || 0,
      publishedAt: body.publishedAt || new Date().toISOString()
    };
    
    // Добавляем в массив
    products.products.push(newProduct);
    
    // Записываем обратно в файл
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(newProduct, { status: 201 });
    
  } catch (error) {
    console.error('Ошибка при создании продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании продукта' },
      { status: 500 }
    );
  }
} 