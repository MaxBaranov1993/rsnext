import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const plans = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Простые и прозрачные цены
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Выберите план, который подходит именно вам. Все планы включают 
            бесплатную пробную версию на 14 дней.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Популярный
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
            Часто задаваемые вопросы
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Можно ли изменить план позже?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Да, вы можете изменить план в любое время. Изменения вступят в силу 
                  со следующего платежного периода.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Есть ли скрытые комиссии?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Нет, все цены указаны без скрытых комиссий. Вы платите только 
                  за выбранный план.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как работает пробный период?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Вы получаете полный доступ ко всем функциям на 14 дней без 
                  необходимости указывать данные карты.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Какая поддержка включена?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Email поддержка для всех планов, приоритетная поддержка для Про 
                  и Бизнес планов, 24/7 поддержка для Бизнес плана.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Нужна помощь с выбором?</CardTitle>
              <CardDescription className="text-blue-100">
                Наша команда готова помочь вам выбрать оптимальный план для вашего бизнеса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button size="lg" variant="secondary">
                  Связаться с нами
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Заказать демо
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}