export interface ProductData {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: "new" | "excellent" | "good" | "fair";
  views: number;
  publishedAt: string;
  description: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    memberSince: string;
    totalSales: number;
    responseTime: string;
  };
}

export const productsData: Record<string, ProductData> = {
  "1": {
    id: "1",
    title: "iPhone 15 Pro Max 256GB - Нови смартфон са камером 48MP",
    price: 129990,
    category: "Електроника",
    condition: "new",
    views: 1247,
    publishedAt: "2024-01-15T10:30:00Z",
    description: "Новейший iPhone 15 Pro Max с камерой 48MP. Мощный процессор A17 Pro, титановый корпус, USB-C порт.",
    seller: {
      name: "Apple Store",
      avatar: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=face",
      rating: 4.8,
      memberSince: "2020-03-15T00:00:00Z",
      totalSales: 156,
      responseTime: "В течение 30 минут"
    }
  },
  "2": {
    id: "2",
    title: "MacBook Air M2 13 инча - Моћан лаптоп за посао",
    price: 159990,
    category: "Електроника",
    condition: "excellent",
    views: 892,
    publishedAt: "2024-01-14T14:20:00Z",
    description: "Мощный MacBook Air с процессором M2. Отличное состояние, полная комплектация, гарантия.",
    seller: {
      name: "Марија Стојановић",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      rating: 4.9,
      memberSince: "2021-08-20T00:00:00Z",
      totalSales: 45,
      responseTime: "В течение 1 часа"
    }
  },
  "3": {
    id: "3",
    title: "BMW X5 2023 године - Премијум теренски ауто у одличном стању",
    price: 8500000,
    category: "Аутомобили",
    condition: "excellent",
    views: 2156,
    publishedAt: "2024-01-13T09:15:00Z",
    description: "Люксовый BMW X5 2023 года. Отличное техническое состояние, полная комплектация, один владелец.",
    seller: {
      name: "Аутосалон Премијум",
      avatar: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop&crop=face",
      rating: 4.9,
      memberSince: "2019-06-10T00:00:00Z",
      totalSales: 342,
      responseTime: "В течение 2 часов"
    }
  },
  "4": {
    id: "4",
    title: "Кожна јакна од природне коже - Стилна горња одећа",
    price: 45000,
    category: "Одећа",
    condition: "good",
    views: 567,
    publishedAt: "2024-01-12T16:45:00Z",
    description: "Стильная кожаная куртка из натуральной кожи. Отличное качество, удобная посадка, подходит для любого случая.",
    seller: {
      name: "Јелена Вуковић",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      rating: 4.8,
      memberSince: "2022-01-10T00:00:00Z",
      totalSales: 78,
      responseTime: "В течение 2 часов"
    }
  },
  "5": {
    id: "5",
    title: "Кауч-кревет са механизмом еврокњига - Удобан намештај за дневну собу",
    price: 75000,
    category: "Намештај",
    condition: "new",
    views: 1234,
    publishedAt: "2024-01-11T11:30:00Z",
    description: "Удобный диван-кровать с механизмом еврокнижка. Отличное качество, мягкие подушки, удобное спальное место. Размеры: 200x160 см.",
    seller: {
      name: "Срђан Морозовић",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      rating: 4.6,
      memberSince: "2021-03-15T00:00:00Z",
      totalSales: 92,
      responseTime: "В течение 1 часа"
    }
  },
  "6": {
    id: "6",
    title: "3-собан стан у центру - Реновирање под кључ, намештај укључен",
    price: 12500000,
    category: "Некретнине",
    condition: "excellent",
    views: 3421,
    publishedAt: "2024-01-10T13:20:00Z",
    description: "Просторная 3-комнатная квартира в центре города. Ремонт под ключ, мебель включена. Отличное расположение, развитая инфраструктура.",
    seller: {
      name: "Александар Петровић",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      rating: 4.7,
      memberSince: "2020-09-20T00:00:00Z",
      totalSales: 156,
      responseTime: "В течение 30 минут"
    }
  },
  "7": {
    id: "7",
    title: "Услуге веб-развоја - Креирање сајтова и апликација",
    price: 150000,
    category: "Услуге",
    condition: "new",
    views: 234,
    publishedAt: "2024-01-09T08:45:00Z",
    description: "Профессиональные услуги веб-разработки. Создание современных сайтов и веб-приложений. Адаптивный дизайн, SEO-оптимизация.",
    seller: {
      name: "Димитрије Козловић",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      rating: 4.5,
      memberSince: "2022-06-10T00:00:00Z",
      totalSales: 34,
      responseTime: "В течение 2 часов"
    }
  },
  "8": {
    id: "8",
    title: "Самсунг Galaxy S24 Ultra 512GB - Најновији флагман",
    price: 145000,
    category: "Електроника",
    condition: "new",
    views: 1890,
    publishedAt: "2024-01-08T12:15:00Z",
    description: "Новейший флагман Samsung Galaxy S24 Ultra с объемом памяти 512GB. Мощный процессор, отличная камера, стилус S Pen в комплекте.",
    seller: {
      name: "Игор Николић",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
      rating: 4.7,
      memberSince: "2021-12-05T00:00:00Z",
      totalSales: 67,
      responseTime: "В течение 1 часа"
    }
  },
  "9": {
    id: "9",
    title: "Мерцедес C-Class 2023 - Луксозни седан",
    price: 6500000,
    category: "Аутомобили",
    condition: "excellent",
    views: 1567,
    publishedAt: "2024-01-07T10:30:00Z",
    description: "Люксовый седан Mercedes C-Class 2023 года выпуска. Отличное техническое состояние, полная комплектация, один владелец.",
    seller: {
      name: "Олга Романовић",
      avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=200&h=200&fit=crop&crop=face",
      rating: 4.9,
      memberSince: "2020-04-15T00:00:00Z",
      totalSales: 203,
      responseTime: "В течение 30 минут"
    }
  },
  "10": {
    id: "10",
    title: "Дизајнерска торба Луј Витон - Оригинална",
    price: 85000,
    category: "Одећа",
    condition: "good",
    views: 445,
    publishedAt: "2024-01-06T15:20:00Z",
    description: "Оригинальная дизайнерская сумка Louis Vuitton. Отличное состояние, все детали на месте, подлинность гарантирована.",
    seller: {
      name: "Ана Смиљанић",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      rating: 4.4,
      memberSince: "2021-11-20T00:00:00Z",
      totalSales: 89,
      responseTime: "В течение 3 часов"
    }
  }
} as const;

export type ProductId = keyof typeof productsData;