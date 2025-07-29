import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Аналитика продаж
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Детальная аналитика ваших продаж и ключевых метрик
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
              <Badge variant="secondary" className="text-xs">+12%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽2,450,000</div>
              <p className="text-xs text-muted-foreground">
                +180,000 с прошлого месяца
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Продажи</CardTitle>
              <Badge variant="secondary" className="text-xs">+8%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +89 с прошлого месяца
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
              <Badge variant="secondary" className="text-xs">+5%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% с прошлого месяца
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
              <Badge variant="secondary" className="text-xs">+15%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽19,850</div>
              <p className="text-xs text-muted-foreground">
                +2,580 с прошлого месяца
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Продажи по месяцам</CardTitle>
              <CardDescription>
                Динамика продаж за последние 12 месяцев
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-slate-600 dark:text-slate-400">
                    График продаж
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Здесь будет интерактивный график
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Топ продуктов</CardTitle>
              <CardDescription>
                Самые продаваемые товары и услуги
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Продукт A</span>
                  </div>
                  <span className="text-sm font-medium">₽450,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Продукт B</span>
                  </div>
                  <span className="text-sm font-medium">₽380,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Продукт C</span>
                  </div>
                  <span className="text-sm font-medium">₽320,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Продукт D</span>
                  </div>
                  <span className="text-sm font-medium">₽280,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
            <CardDescription>
              Последние 10 продаж
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, customer: "ООО Рога и Копыта", amount: "₽125,000", status: "Завершена", date: "2024-01-15" },
                { id: 2, customer: "ИП Иванов", amount: "₽89,500", status: "В обработке", date: "2024-01-14" },
                { id: 3, customer: "АО Технологии", amount: "₽234,000", status: "Завершена", date: "2024-01-13" },
                { id: 4, customer: "ООО Инновации", amount: "₽156,750", status: "Завершена", date: "2024-01-12" },
                { id: 5, customer: "ИП Петров", amount: "₽67,800", status: "В обработке", date: "2024-01-11" },
              ].map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{transaction.customer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <Badge variant={transaction.status === "Завершена" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}