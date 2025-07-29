import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Товар не найден
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              К сожалению, запрашиваемый товар не существует или был удален.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Вернуться на главную
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Search className="h-4 w-4 mr-2" />
                Поиск товаров
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}