// Типы для метрик производительности
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

export interface WebVitals {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

// Класс для мониторинга производительности
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined' && !this.isInitialized) {
      this.setupWebVitals();
      this.setupPerformanceObserver();
      this.isInitialized = true;
    }
  }

  // Настройка отслеживания Web Vitals
  private setupWebVitals() {
    if (typeof window !== 'undefined') {
      // Отслеживание FCP (First Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.recordMetric('FCP', entry.startTime, 'ms');
        }
      }).observe({ entryTypes: ['paint'] });

      // Отслеживание LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const lcpEntry = entry as PerformanceEntry & {
            element?: Element;
            size?: number;
          };
          this.recordMetric('LCP', entry.startTime, 'ms', {
            element: lcpEntry.element?.tagName,
            size: lcpEntry.size,
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Отслеживание FID (First Input Delay)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as PerformanceEntry & {
            processingStart?: number;
          };
          this.recordMetric('FID', (fidEntry.processingStart || 0) - entry.startTime, 'ms', {
            name: entry.name,
            type: entry.entryType,
          });
        }
      }).observe({ entryTypes: ['first-input'] });

      // Отслеживание CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value || 0;
            this.recordMetric('CLS', clsValue, 'score');
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Настройка общего Performance Observer
  private setupPerformanceObserver() {
    if (typeof window !== 'undefined') {
      // Отслеживание навигации
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming;
          this.recordMetric('TTFB', navEntry.responseStart - navEntry.requestStart, 'ms');
          this.recordMetric('DOMContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'ms');
          this.recordMetric('LoadComplete', navEntry.loadEventEnd - navEntry.loadEventStart, 'ms');
        }
      }).observe({ entryTypes: ['navigation'] });

      // Отслеживание ресурсов
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.initiatorType === 'img') {
            this.recordMetric('ImageLoad', resourceEntry.responseEnd - resourceEntry.responseStart, 'ms', {
              name: resourceEntry.name,
              size: resourceEntry.transferSize,
            });
          }
        }
      }).observe({ entryTypes: ['resource'] });
    }
  }

  // Запись метрики
  private recordMetric(name: string, value: number, unit: string, context?: Record<string, unknown>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context,
    };

    this.metrics.push(metric);

    // Отправка в аналитику
    this.sendToAnalytics(metric);

    // Логирование в development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric);
    }
  }

  // Отправка метрики в аналитику
  private sendToAnalytics(metric: PerformanceMetric) {
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'performance_metric', {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_unit: metric.unit,
          ...metric.context,
        });
      }

      // Собственная система аналитики
      this.sendToCustomAnalytics(metric);
    }
  }

  // Отправка в собственную систему аналитики
  private async sendToCustomAnalytics(_metric: PerformanceMetric) {
    try {
      // Здесь можно добавить отправку в собственную систему мониторинга
      // await fetch('/api/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(_metric),
      // });
      
      // Временно логируем для разработки
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance metric:', _metric);
      }
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  // Ручное измерение времени выполнения
  measureTime<T>(name: string, fn: () => T): T {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        this.recordMetric(name, duration, 'ms');
      }) as T;
    } else {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, 'ms');
      return result;
    }
  }

  // Измерение времени загрузки изображения
  measureImageLoad(imageUrl: string): Promise<number> {
    return new Promise((resolve) => {
      const start = performance.now();
      const img = new Image();
      
      img.onload = () => {
        const duration = performance.now() - start;
        this.recordMetric('ImageLoad', duration, 'ms', { url: imageUrl });
        resolve(duration);
      };
      
      img.onerror = () => {
        const duration = performance.now() - start;
        this.recordMetric('ImageLoadError', duration, 'ms', { url: imageUrl });
        resolve(duration);
      };
      
      img.src = imageUrl;
    });
  }

  // Получение всех метрик
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Получение метрик по имени
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  // Получение среднего значения метрики
  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  // Очистка метрик
  clearMetrics() {
    this.metrics = [];
  }

  // Получение Web Vitals
  getWebVitals(): Partial<WebVitals> {
    const vitals: Partial<WebVitals> = {};
    
    const fcp = this.getMetricsByName('FCP')[0];
    if (fcp) vitals.FCP = fcp.value;
    
    const lcp = this.getMetricsByName('LCP')[0];
    if (lcp) vitals.LCP = lcp.value;
    
    const fid = this.getMetricsByName('FID')[0];
    if (fid) vitals.FID = fid.value;
    
    const cls = this.getMetricsByName('CLS')[0];
    if (cls) vitals.CLS = cls.value;
    
    const ttfb = this.getMetricsByName('TTFB')[0];
    if (ttfb) vitals.TTFB = ttfb.value;
    
    return vitals;
  }
}

// Создание глобального экземпляра
export const performanceMonitor = new PerformanceMonitor();

// Хук для использования мониторинга производительности в компонентах
export function usePerformance() {
  return {
    measureTime: performanceMonitor.measureTime.bind(performanceMonitor) as <T>(name: string, fn: () => T) => T,
    measureImageLoad: performanceMonitor.measureImageLoad.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getWebVitals: performanceMonitor.getWebVitals.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor),
  };
}

// Утилита для измерения времени выполнения функции
export function measurePerformance<T>(name: string, fn: () => T): T {
  return performanceMonitor.measureTime(name, fn) as T;
}

// Утилита для измерения времени выполнения асинхронной функции
export async function measurePerformanceAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return performanceMonitor.measureTime(name, fn) as Promise<T>;
}