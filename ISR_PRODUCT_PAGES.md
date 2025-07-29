# ISR Страницы товаров - rSALE

## Обзор

Реализована система страниц товаров с использованием Incremental Static Regeneration (ISR) в Next.js. Это позволяет генерировать статические страницы для каждого товара на этапе сборки, обеспечивая быструю загрузку и SEO-оптимизацию.

## Структура файлов

```
src/app/product/[id]/
├── page.tsx          # Основная страница товара с ISR
└── not-found.tsx     # Страница 404 для несуществующих товаров

src/components/
├── ProductCard.tsx   # Карточка товара для списков
└── ProductDetail.tsx # Детальная страница товара

src/lib/
└── utils.ts          # Функции для работы с данными товаров

src/app/products/
└── page.tsx          # Страница со всеми товарами
```

## Основные функции

### 1. Генерация статических путей

```typescript
// src/app/product/[id]/page.tsx
export async function generateStaticParams() {
  const productIds = await getAllProductIds();
  return productIds.map((id) => ({
    id: id,
  }));
}
```

Эта функция генерирует статические пути для всех товаров из JSON файла на этапе сборки.

### 2. Метаданные для SEO

```typescript
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductById(params.id);
  
  return {
    title: `${product.title} - rSALE`,
    description: product.title,
    openGraph: {
      title: product.title,
      description: `Цена: ${formatPrice(product.price)} ₽`,
      images: [...],
    },
  };
}
```

### 3. Работа с данными

```typescript
// src/lib/utils.ts
export async function getProductById(id: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find(product => product.id === id) || null;
}

export async function getAllProductIds(): Promise<string[]> {
  const products = await loadProducts();
  return products.map(product => product.id);
}
```

## Особенности реализации

### ISR (Incremental Static Regeneration)

- **Статическая генерация**: Все страницы товаров генерируются на этапе сборки
- **Динамическое обновление**: Страницы могут обновляться в фоне без пересборки
- **Кэширование**: Страницы кэшируются для быстрой загрузки

### Изображения товаров

- Используется хук `useProductImages` для загрузки изображений из Unsplash
- Fallback изображения для случаев, когда API недоступен
- Карусель изображений с навигацией

### Адаптивный дизайн

- Мобильная и десктопная версии
- Оптимизированные карточки товаров
- Современный UI с использованием Tailwind CSS

## Использование

### Переход к товару

```typescript
// В компоненте ProductCard
<Link href={`/product/${product.id}`} className="block">
  {/* Содержимое карточки */}
</Link>
```

### Навигация

1. **Главная страница** → Карточки товаров → Детальная страница
2. **Страница всех товаров** (`/products`) → Детальная страница
3. **Прямые ссылки** на `/product/[id]`

## Преимущества ISR

1. **Производительность**: Быстрая загрузка статических страниц
2. **SEO**: Полная индексация поисковыми системами
3. **Масштабируемость**: Эффективная обработка большого количества товаров
4. **Пользовательский опыт**: Мгновенная навигация между страницами

## Конфигурация

### Данные товаров

Товары загружаются из `public/data/products.json`:

```json
{
  "products": [
    {
      "id": "1",
      "title": "Название товара",
      "price": 100000,
      "category": "electronics",
      "seller": {
        "name": "Имя продавца",
        "avatar": "URL аватара",
        "rating": 4.8
      },
      "condition": "new",
      "views": 1234,
      "publishedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Пересборка страниц

Для обновления статических страниц:

```bash
# Пересборка всех страниц
npm run build

# Или перезапуск dev сервера
npm run dev
```

## Расширение функциональности

### Добавление новых товаров

1. Добавить товар в `public/data/products.json`
2. Пересобрать проект для генерации новой страницы

### Кастомизация дизайна

- Изменить компонент `ProductDetail.tsx` для изменения внешнего вида
- Настроить стили в `ProductCard.tsx` для карточек
- Добавить новые секции на страницу товара

### Интеграция с API

- Заменить `loadProducts()` на реальный API вызов
- Добавить пагинацию для больших списков товаров
- Реализовать поиск и фильтрацию