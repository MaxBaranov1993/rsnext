// Типы для компонентов
export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  description: string;
}

export interface Statistic {
  label: string;
  value: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "destructive";
}

export interface Transaction {
  id: number;
  customer: string;
  amount: string;
  status: "Завершена" | "В обработке" | "Отменена";
  date: string;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

// Типы для навигации
export interface NavigationItem {
  title: string;
  href: string;
  description?: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

// Типы для аналитики
export interface AnalyticsData {
  totalRevenue: number;
  sales: number;
  conversion: number;
  averageCheck: number;
  monthlyGrowth: number;
}

// Типы для тем
export type Theme = "light" | "dark" | "system";

// Типы для уведомлений
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp: Date;
}