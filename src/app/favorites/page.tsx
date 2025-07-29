import { FavoritesModal } from "@/components/FavoritesModal";
import { FavoritesButton } from "@/components/FavoritesButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Демонстрация компонента избранных товаров
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Тестируйте функциональность добавления товаров в избранное и просмотра списка
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Карточка с кнопкой избранного */}
          <Card>
            <CardHeader>
              <CardTitle>Кнопка избранного</CardTitle>
              <CardDescription>
                Кнопка с счетчиком избранных товаров
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <FavoritesButton />
                <FavoritesButton variant="default" />
                <FavoritesButton variant="ghost" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Кнопка автоматически показывает количество избранных товаров
              </p>
            </CardContent>
          </Card>

          {/* Карточка с модальным окном */}
          <Card>
            <CardHeader>
              <CardTitle>Модальное окно избранного</CardTitle>
              <CardDescription>
                Открытие модального окна с кастомной кнопкой
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FavoritesModal
                trigger={
                  <Button variant="outline" className="w-full">
                    Открыть избранное
                  </Button>
                }
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Модальное окно с полным функционалом управления избранными товарами
              </p>
            </CardContent>
          </Card>

          {/* Инструкции */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Как использовать</CardTitle>
              <CardDescription>
                Инструкции по использованию компонента избранных товаров
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">1. Добавление в избранное</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Перейдите на страницу товаров</li>
                    <li>• Нажмите на иконку сердца на карточке товара</li>
                    <li>• Товар добавится в избранное</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Просмотр избранного</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Нажмите на кнопку избранного в шапке</li>
                    <li>• Откроется модальное окно со списком</li>
                    <li>• Используйте табы для фильтрации</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Особенности компонента:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Автоматическое сохранение в localStorage</li>
                  <li>• Разделение товаров и услуг</li>
                  <li>• Возможность удаления отдельных товаров</li>
                  <li>• Кнопка очистки всего списка</li>
                  <li>• Адаптивный дизайн</li>
                  <li>• Поддержка темной темы</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 