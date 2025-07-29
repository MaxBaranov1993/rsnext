# API Документация

## Обзор

API предоставляет доступ к данным продавцов и продуктов, хранящимся в JSON файлах. Все маршруты находятся под префиксом `/api`.

## Продукты

### Получить все продукты
```
GET /api/products
```

**Параметры запроса:**
- `page` (number) - номер страницы (по умолчанию: 1)
- `limit` (number) - количество элементов на странице (по умолчанию: 10)
- `search` (string) - поиск по названию и описанию
- `category` (string) - фильтр по категории
- `condition` (string) - фильтр по состоянию (new, excellent, good)
- `minPrice` (number) - минимальная цена
- `maxPrice` (number) - максимальная цена
- `sellerId` (string) - фильтр по продавцу
- `sortBy` (string) - поле для сортировки (price, views, publishedAt)
- `sortOrder` (string) - порядок сортировки (asc, desc)

**Пример ответа:**
```json
{
  "products": [
    {
      "id": "1",
      "title": "iPhone 15 Pro Max 256GB",
      "price": 129990,
      "category": "electronics",
      "sellerId": "9",
      "condition": "new",
      "views": 1247,
      "publishedAt": "2024-01-15T10:30:00Z",
      "description": "Новейший iPhone 15 Pro Max..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalProducts": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Получить продукт по ID
```
GET /api/products/{id}
```

**Пример ответа:**
```json
{
  "id": "1",
  "title": "iPhone 15 Pro Max 256GB",
  "price": 129990,
  "category": "electronics",
  "sellerId": "9",
  "condition": "new",
  "views": 1248,
  "publishedAt": "2024-01-15T10:30:00Z",
  "description": "Новейший iPhone 15 Pro Max...",
  "seller": {
    "id": "9",
    "name": "Apple Store",
    "rating": 4.8,
    "verified": true
  }
}
```

### Создать новый продукт
```
POST /api/products
```

**Тело запроса:**
```json
{
  "title": "Новый продукт",
  "price": 50000,
  "category": "electronics",
  "sellerId": "1",
  "condition": "new",
  "description": "Описание продукта"
}
```

### Обновить продукт
```
PUT /api/products/{id}
```

### Удалить продукт
```
DELETE /api/products/{id}
```

## Продавцы

### Получить всех продавцов
```
GET /api/sellers
```

**Параметры запроса:**
- `page` (number) - номер страницы
- `limit` (number) - количество элементов на странице
- `search` (string) - поиск по имени, местоположению и описанию
- `type` (string) - фильтр по типу (individual, company)
- `verified` (boolean) - фильтр по верификации

**Пример ответа:**
```json
{
  "sellers": [
    {
      "id": "1",
      "name": "Александар Петровић",
      "avatar": "https://images.unsplash.com/...",
      "rating": 4.7,
      "memberSince": "2022-03-15T00:00:00Z",
      "totalSales": 23,
      "responseTime": "В течение 2 часов",
      "type": "individual",
      "location": "Београд",
      "verified": true,
      "description": "Продаю качественные товары..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalSellers": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Получить продавца по ID
```
GET /api/sellers/{id}
```

**Пример ответа:**
```json
{
  "id": "1",
  "name": "Александар Петровић",
  "avatar": "https://images.unsplash.com/...",
  "rating": 4.7,
  "memberSince": "2022-03-15T00:00:00Z",
  "totalSales": 23,
  "responseTime": "В течение 2 часов",
  "type": "individual",
  "location": "Београд",
  "verified": true,
  "description": "Продаю качественные товары...",
  "products": [
    {
      "id": "1",
      "title": "iPhone 15 Pro Max 256GB",
      "price": 129990,
      "category": "electronics"
    }
  ],
  "totalProducts": 1
}
```

### Создать нового продавца
```
POST /api/sellers
```

**Тело запроса:**
```json
{
  "name": "Новый продавец",
  "avatar": "https://images.unsplash.com/...",
  "rating": 4.5,
  "totalSales": 0,
  "responseTime": "В течение 1 часа",
  "type": "individual",
  "location": "Београд",
  "verified": false,
  "description": "Описание продавца"
}
```

### Обновить продавца
```
PUT /api/sellers/{id}
```

### Удалить продавца
```
DELETE /api/sellers/{id}
```

## Статистика

### Получить статистику
```
GET /api/stats
```

**Пример ответа:**
```json
{
  "sellers": {
    "total": 10,
    "verified": 8,
    "individual": 8,
    "company": 2,
    "topSellers": [
      {
        "id": "8",
        "name": "Олга Романовић",
        "totalSales": 89,
        "rating": 4.9
      }
    ]
  },
  "products": {
    "total": 10,
    "totalViews": 12345,
    "averagePrice": 1500000,
    "topProducts": [
      {
        "id": "6",
        "title": "3-собан стан у центру",
        "views": 3421,
        "price": 12500000
      }
    ]
  },
  "categories": {
    "electronics": {
      "count": 3,
      "totalViews": 4027,
      "averagePrice": 145000
    }
  },
  "conditions": {
    "new": 4,
    "excellent": 4,
    "good": 2
  },
  "locations": {
    "Београд": 4,
    "Нови Сад": 1
  }
}
```

## Обработка ошибок

Все API маршруты возвращают ошибки в следующем формате:

```json
{
  "error": "Описание ошибки"
}
```

**Коды состояния:**
- `200` - Успешный запрос
- `201` - Ресурс создан
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Примеры использования

### Поиск продуктов
```
GET /api/products?search=iPhone&category=electronics&minPrice=100000&maxPrice=200000
```

### Фильтрация продавцов
```
GET /api/sellers?type=company&verified=true&limit=5
```

### Сортировка продуктов
```
GET /api/products?sortBy=price&sortOrder=desc&limit=10
```

### Пагинация
```
GET /api/products?page=2&limit=5
``` 