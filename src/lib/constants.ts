// Константы для навигации
export const NAVIGATION_ITEMS = [
  {
    title: "Продукты",
    href: "#",
    items: [
      {
        title: "Аналитика",
        href: "/analytics",
        description: "Подробная аналитика продаж"
      },
      {
        title: "Отчеты",
        href: "/reports",
        description: "Генерация отчетов"
      }
    ]
  },
  {
    title: "Цены",
    href: "/pricing"
  },
  {
    title: "О нас",
    href: "/about"
  },
  {
    title: "Контакты",
    href: "/contact"
  }
];

// Константы для тарифных планов
export const PRICING_PLANS = [
  {
    name: "Старт",
    price: "₽0",
    period: "в месяц",
    description: "Идеально для небольших команд и стартапов",
    features: [
      "До 5 пользователей",
      "Базовая аналитика",
      "Email поддержка",
      "5 ГБ хранилища",
      "Базовые отчеты"
    ],
    popular: false,
    buttonText: "Начать бесплатно",
    buttonVariant: "outline" as const
  },
  {
    name: "Про",
    price: "₽2,990",
    period: "в месяц",
    description: "Для растущих компаний с расширенными возможностями",
    features: [
      "До 25 пользователей",
      "Расширенная аналитика",
      "Приоритетная поддержка",
      "50 ГБ хранилища",
      "Продвинутые отчеты",
      "Интеграции с CRM",
      "API доступ"
    ],
    popular: true,
    buttonText: "Выбрать план",
    buttonVariant: "default" as const
  },
  {
    name: "Бизнес",
    price: "₽7,990",
    period: "в месяц",
    description: "Для крупных предприятий с максимальными возможностями",
    features: [
      "Неограниченное количество пользователей",
      "Полная аналитика и AI",
      "24/7 поддержка",
      "Неограниченное хранилище",
      "Кастомные отчеты",
      "Все интеграции",
      "Белый лейбл",
      "Персональный менеджер"
    ],
    popular: false,
    buttonText: "Связаться с нами",
    buttonVariant: "outline" as const
  }
];

// Константы для команды
export const TEAM_MEMBERS = [
  {
    name: "Александр Петров",
    role: "CEO & Основатель",
    avatar: "/avatars/01.png",
    description: "10+ лет опыта в SaaS и продажах. Бывший руководитель отдела продаж в крупных IT компаниях."
  },
  {
    name: "Мария Сидорова",
    role: "CTO",
    avatar: "/avatars/02.png",
    description: "Эксперт в области разработки и архитектуры. Специалист по масштабируемым решениям."
  },
  {
    name: "Дмитрий Козлов",
    role: "Head of Product",
    avatar: "/avatars/03.png",
    description: "Product Manager с опытом создания продуктов, которые любят пользователи."
  },
  {
    name: "Анна Волкова",
    role: "Head of Sales",
    avatar: "/avatars/04.png",
    description: "Профессионал в области B2B продаж с глубоким пониманием потребностей клиентов."
  }
];

// Константы для статистики
export const STATISTICS = [
  { label: "Клиентов", value: "10,000+", description: "Доверяют нам" },
  { label: "Продаж", value: "₽500M+", description: "Обработано" },
  { label: "Команда", value: "50+", description: "Профессионалов" },
  { label: "Страны", value: "15+", description: "Присутствие" }
];

// Константы для контактной информации
export const CONTACT_INFO = {
  email: "hello@rsale.ru",
  phone: "+7 (800) 555-35-35",
  address: "Москва, ул. Примерная, д. 123",
  workingHours: {
    weekdays: "9:00 - 18:00",
    saturday: "10:00 - 16:00",
    sunday: "Выходной"
  }
};

// Константы для метаданных
export const SITE_CONFIG = {
  name: "rSALE",
  description: "Платформа для умных продаж",
  url: "https://rsale.ru",
  ogImage: "/og-image.jpg",
  twitterHandle: "@rsale_platform"
};

// Константы для цветов
export const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a"
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    900: "#0f172a"
  }
};