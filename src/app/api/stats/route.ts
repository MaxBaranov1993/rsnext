import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Путь к JSON файлам
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
    
    // Читаем файлы
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    
    const sellers = JSON.parse(sellersData);
    const products = JSON.parse(productsData);
    
    // Статистика по продавцам
    const totalSellers = sellers.sellers.length;
    const verifiedSellers = sellers.sellers.filter((s: any) => s.verified).length;
    const individualSellers = sellers.sellers.filter((s: any) => s.type === 'individual').length;
    const companySellers = sellers.sellers.filter((s: any) => s.type === 'company').length;
    
    // Статистика по продуктам
    const totalProducts = products.products.length;
    const totalViews = products.products.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    const averagePrice = products.products.reduce((sum: number, p: any) => sum + p.price, 0) / totalProducts;
    
    // Статистика по категориям
    const categoryStats = products.products.reduce((acc: any, product: any) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          count: 0,
          totalViews: 0,
          averagePrice: 0,
          totalPrice: 0
        };
      }
      acc[product.category].count++;
      acc[product.category].totalViews += product.views || 0;
      acc[product.category].totalPrice += product.price;
      acc[product.category].averagePrice = acc[product.category].totalPrice / acc[product.category].count;
      return acc;
    }, {});
    
    // Статистика по состоянию товаров
    const conditionStats = products.products.reduce((acc: any, product: any) => {
      if (!acc[product.condition]) {
        acc[product.condition] = 0;
      }
      acc[product.condition]++;
      return acc;
    }, {});
    
    // Топ продавцов по количеству продаж
    const topSellers = sellers.sellers
      .sort((a: any, b: any) => b.totalSales - a.totalSales)
      .slice(0, 5)
      .map((seller: any) => ({
        id: seller.id,
        name: seller.name,
        totalSales: seller.totalSales,
        rating: seller.rating
      }));
    
    // Топ продуктов по просмотрам
    const topProducts = products.products
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        views: product.views || 0,
        price: product.price
      }));
    
    // Статистика по городам
    const locationStats = sellers.sellers.reduce((acc: any, seller: any) => {
      if (!acc[seller.location]) {
        acc[seller.location] = 0;
      }
      acc[seller.location]++;
      return acc;
    }, {});
    
    return NextResponse.json({
      sellers: {
        total: totalSellers,
        verified: verifiedSellers,
        individual: individualSellers,
        company: companySellers,
        topSellers
      },
      products: {
        total: totalProducts,
        totalViews,
        averagePrice: Math.round(averagePrice),
        topProducts
      },
      categories: categoryStats,
      conditions: conditionStats,
      locations: locationStats
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке статистики:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке статистики' },
      { status: 500 }
    );
  }
} 