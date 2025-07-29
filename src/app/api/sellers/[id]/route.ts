import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Путь к JSON файлу с данными продавцов и продуктов
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    // Читаем файлы
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    
    const sellers = JSON.parse(sellersData);
    const products = JSON.parse(productsData);
    
    // Находим продавца по ID
    const seller = sellers.sellers.find((s: any) => s.id === id);
    
    if (!seller) {
      return NextResponse.json(
        { error: 'Продавец не найден' },
        { status: 404 }
      );
    }
    
    // Находим все продукты этого продавца
    const sellerProducts = products.products.filter((p: any) => p.sellerId === id);
    
    // Возвращаем продавца с его продуктами
    return NextResponse.json({
      ...seller,
      products: sellerProducts,
      totalProducts: sellerProducts.length
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке продавца:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке продавца' },
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
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    
    // Читаем существующие данные
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const sellers = JSON.parse(sellersData);
    
    // Находим индекс продавца
    const sellerIndex = sellers.sellers.findIndex((s: any) => s.id === id);
    
    if (sellerIndex === -1) {
      return NextResponse.json(
        { error: 'Продавец не найден' },
        { status: 404 }
      );
    }
    
    // Обновляем продавца
    sellers.sellers[sellerIndex] = {
      ...sellers.sellers[sellerIndex],
      ...body
    };
    
    // Записываем обратно в файл
    fs.writeFileSync(sellersPath, JSON.stringify(sellers, null, 2));
    
    return NextResponse.json(sellers.sellers[sellerIndex]);
    
  } catch (error) {
    console.error('Ошибка при обновлении продавца:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении продавца' },
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
    
    // Путь к JSON файлам
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    // Читаем существующие данные
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    
    const sellers = JSON.parse(sellersData);
    const products = JSON.parse(productsData);
    
    // Находим индекс продавца
    const sellerIndex = sellers.sellers.findIndex((s: any) => s.id === id);
    
    if (sellerIndex === -1) {
      return NextResponse.json(
        { error: 'Продавец не найден' },
        { status: 404 }
      );
    }
    
    // Удаляем продавца
    const deletedSeller = sellers.sellers.splice(sellerIndex, 1)[0];
    
    // Удаляем все продукты этого продавца
    const deletedProducts = products.products.filter((p: any) => p.sellerId === id);
    products.products = products.products.filter((p: any) => p.sellerId !== id);
    
    // Записываем обратно в файлы
    fs.writeFileSync(sellersPath, JSON.stringify(sellers, null, 2));
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ 
      message: 'Продавец и его продукты успешно удалены', 
      deletedSeller,
      deletedProductsCount: deletedProducts.length
    });
    
  } catch (error) {
    console.error('Ошибка при удалении продавца:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении продавца' },
      { status: 500 }
    );
  }
} 