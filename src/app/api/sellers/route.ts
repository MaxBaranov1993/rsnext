import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Путь к JSON файлу с данными продавцов
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    
    // Читаем файл
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const sellers = JSON.parse(sellersData);
    
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const verified = searchParams.get('verified');
    
    let filteredSellers = sellers.sellers;
    
    // Фильтрация по поиску
    if (search) {
      filteredSellers = filteredSellers.filter((seller: any) =>
        seller.name.toLowerCase().includes(search.toLowerCase()) ||
        seller.location.toLowerCase().includes(search.toLowerCase()) ||
        seller.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Фильтрация по типу продавца
    if (type) {
      filteredSellers = filteredSellers.filter((seller: any) => seller.type === type);
    }
    
    // Фильтрация по верификации
    if (verified !== null) {
      const isVerified = verified === 'true';
      filteredSellers = filteredSellers.filter((seller: any) => seller.verified === isVerified);
    }
    
    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSellers = filteredSellers.slice(startIndex, endIndex);
    
    // Метаданные для пагинации
    const totalSellers = filteredSellers.length;
    const totalPages = Math.ceil(totalSellers / limit);
    
    return NextResponse.json({
      sellers: paginatedSellers,
      pagination: {
        currentPage: page,
        totalPages,
        totalSellers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке данных продавцов:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке данных продавцов' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Путь к JSON файлу
    const sellersPath = path.join(process.cwd(), 'public', 'data', 'sellers.json');
    
    // Читаем существующие данные
    const sellersData = fs.readFileSync(sellersPath, 'utf8');
    const sellers = JSON.parse(sellersData);
    
    // Генерируем новый ID
    const newId = (Math.max(...sellers.sellers.map((s: any) => parseInt(s.id))) + 1).toString();
    
    // Создаем нового продавца
    const newSeller = {
      id: newId,
      ...body,
      memberSince: body.memberSince || new Date().toISOString(),
      verified: body.verified || false
    };
    
    // Добавляем в массив
    sellers.sellers.push(newSeller);
    
    // Записываем обратно в файл
    fs.writeFileSync(sellersPath, JSON.stringify(sellers, null, 2));
    
    return NextResponse.json(newSeller, { status: 201 });
    
  } catch (error) {
    console.error('Ошибка при создании продавца:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании продавца' },
      { status: 500 }
    );
  }
} 