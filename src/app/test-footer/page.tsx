import { Header } from "@/components/Header";

export default function TestFooterPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            Тестовая страница для проверки футера
          </h1>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Проверка отображения футера
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Эта страница создана для проверки того, что футер отображается корректно.
                Прокрутите вниз, чтобы увидеть футер.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Контент для прокрутки
              </h3>
              <div className="space-y-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-400">
                      Блок контента #{i + 1} - прокрутите вниз, чтобы увидеть футер
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 