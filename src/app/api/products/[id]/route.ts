import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Путь к JSON файлу с данными продуктов
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    
    // Читаем файлы
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    
    const products = JSON.parse(productsData);
    const sellers = JSON.parse(sellersData);
    
    // Находим продукт по ID
    const product = products.products.find((p: any) => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }
    
    // Находим продавца продукта
    const seller = sellers.sellers.find((s: any) => s.id === product.sellerId);
    
    // Увеличиваем количество просмотров
    product.views = (product.views || 0) + 1;
    
    // Обновляем файл с продуктами
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    // Возвращаем продукт с информацией о продавце
    return NextResponse.json({
      ...product,
      seller
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке продукта' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
    const { id } = params;
    
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