// Типы для аналитики
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp?: number;
}

export interface ProductInteraction {
  productId: string;
  category: string;
  price: number;
  action: 'view' | 'contact_seller' | 'show_phone' | 'favorite' | 'share';
}

// Класс для управления аналитикой
class Analytics {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined' && !this.isInitialized) {
      // Здесь можно инициализировать Google Analytics, Mixpanel и т.д.
      this.isInitialized = true;
      console.log('Analytics initialized');
    }
  }

  // Отслеживание просмотра товара
  trackProductView(productId: string, category: string, price: number) {
    this.track('product_view', {
      product_id: productId,
      category,
      price,
      currency: 'RUB',
    });
  }

  // Отслеживание контакта с продавцом
  trackContactSeller(productId: string, category: string, price: number) {
    this.track('contact_seller', {
      product_id: productId,
      category,
      price,
      currency: 'RUB',
    });
  }

  // Отслеживание показа телефона
  trackShowPhone(productId: string, category: string, price: number) {
    this.track('show_phone', {
      product_id: productId,
      category,
      price,
      currency: 'RUB',
    });
  }

  // Отслеживание добавления в избранное
  trackFavorite(productId: string, category: string, price: number) {
    this.track('favorite_product', {
      product_id: productId,
      category,
      price,
      currency: 'RUB',
    });
  }

  // Отслеживание шаринга
  trackShare(productId: string, category: string, platform: string) {
    this.track('share_product', {
      product_id: productId,
      category,
      platform,
    });
  }

  // Отслеживание поиска
  trackSearch(query: string, resultsCount: number) {
    this.track('search', {
      query,
      results_count: resultsCount,
    });
  }

  // Отслеживание фильтрации
  trackFilter(category: string, filters: Record<string, any>) {
    this.track('filter_products', {
      category,
      filters,
    });
  }

  // Отслеживание ошибок
  trackError(error: Error, context: Record<string, any> = {}) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // Основной метод отслеживания
  private track(event: string, properties: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        user_agent: navigator.userAgent,
      },
    };

    // Отправка в Google Analytics (если настроен)
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', event, properties);
    }

    // Отправка в Mixpanel (если настроен)
    if (typeof window.mixpanel !== 'undefined') {
      window.mixpanel.track(event, properties);
    }

    // Локальное логирование для разработки
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
    }

    // Отправка в собственную систему аналитики
    this.sendToCustomAnalytics(eventData);
  }

  // Отправка в собственную систему аналитики
  private async sendToCustomAnalytics(eventData: AnalyticsEvent) {
    try {
      // Здесь можно добавить отправку в собственную систему аналитики
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData),
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Установка пользовательских свойств
  setUserProperties(properties: Record<string, any>) {
    if (typeof window === 'undefined') return;

    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'GA_MEASUREMENT_ID', properties);
    }

    // Mixpanel
    if (typeof window.mixpanel !== 'undefined') {
      window.mixpanel.people.set(properties);
    }
  }

  // Идентификация пользователя
  identify(userId: string, properties: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        ...properties,
      });
    }

    // Mixpanel
    if (typeof window.mixpanel !== 'undefined') {
      window.mixpanel.identify(userId);
      window.mixpanel.people.set(properties);
    }
  }
}

// Создание глобального экземпляра
export const analytics = new Analytics();

// Хук для использования аналитики в компонентах
export function useAnalytics() {
  return {
    trackProductView: analytics.trackProductView.bind(analytics),
    trackContactSeller: analytics.trackContactSeller.bind(analytics),
    trackShowPhone: analytics.trackShowPhone.bind(analytics),
    trackFavorite: analytics.trackFavorite.bind(analytics),
    trackShare: analytics.trackShare.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackFilter: analytics.trackFilter.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setUserProperties: analytics.setUserProperties.bind(analytics),
    identify: analytics.identify.bind(analytics),
  };
}

// Расширение типов для глобальных объектов
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    mixpanel?: {
      track: (event: string, properties?: Record<string, any>) => void;
      identify: (userId: string) => void;
      people: {
        set: (properties: Record<string, any>) => void;
      };
    };
  }
}