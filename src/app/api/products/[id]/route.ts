import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: productId } = await params;
    
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
    
    // Находим товар по ID
    const product = products.products.find((p: any) => p.id === productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }
    
    // Связываем товар с продавцом
    const productWithSeller = {
      ...product,
      seller: sellersMap.get(product.sellerId) || null
    };
    
    return NextResponse.json(productWithSeller);
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Путь к JSON файлу
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    // Читаем существующие данные
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);
    
    // Находим индекс продукта
    const productIndex = products.products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }
    
    // Обновляем продукт
    products.products[productIndex] = {
      ...products.products[productIndex],
      ...body
    };
    
    // Записываем обратно в файл
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(products.products[productIndex]);
    
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении продукта' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Путь к JSON файлу
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    // Читаем существующие данные
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);
    
    // Находим индекс продукта
    const productIndex = products.products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }
    
    // Удаляем продукт
    const deletedProduct = products.products.splice(productIndex, 1)[0];
    
    // Записываем обратно в файл
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ message: 'Продукт успешно удален', deletedProduct });
    
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении продукта' },
      { status: 500 }
    );
  }
} 