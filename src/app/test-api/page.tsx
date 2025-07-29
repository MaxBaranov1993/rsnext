'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function TestApiPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts({ limit: 5 });
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  const testSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSellers({ limit: 5 });
      setSellers(data.sellers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки продавцов');
    } finally {
      setLoading(false);
    }
  };

  const testStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Тестирование API</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Продукты</h2>
          <button
            onClick={testProducts}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Загрузить продукты'}
          </button>
          
          {products.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Найденные продукты:</h3>
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="border p-3 rounded">
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Название:</strong> {product.title}</p>
                    <p><strong>Цена:</strong> {product.price} RSD</p>
                    <p><strong>Категория:</strong> {product.category}</p>
                    <p><strong>Просмотры:</strong> {product.views}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Продавцы</h2>
          <button
            onClick={testSellers}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Загрузить продавцов'}
          </button>
          
          {sellers.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Найденные продавцы:</h3>
              <div className="space-y-2">
                {sellers.map((seller) => (
                  <div key={seller.id} className="border p-3 rounded">
                    <p><strong>ID:</strong> {seller.id}</p>
                    <p><strong>Имя:</strong> {seller.name}</p>
                    <p><strong>Рейтинг:</strong> {seller.rating}</p>
                    <p><strong>Продажи:</strong> {seller.totalSales}</p>
                    <p><strong>Верифицирован:</strong> {seller.verified ? 'Да' : 'Нет'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Статистика</h2>
          <button
            onClick={testStats}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Загрузить статистику'}
          </button>
          
          {stats && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Статистика:</h3>
              <div className="border p-3 rounded">
                <p><strong>Всего продавцов:</strong> {stats.sellers?.total}</p>
                <p><strong>Верифицированных продавцов:</strong> {stats.sellers?.verified}</p>
                <p><strong>Всего продуктов:</strong> {stats.products?.total}</p>
                <p><strong>Общее количество просмотров:</strong> {stats.products?.totalViews}</p>
                <p><strong>Средняя цена:</strong> {stats.products?.averagePrice} RSD</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Ошибка:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
} 