import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const team = [
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

  const stats = [
    { label: "Клиентов", value: "10,000+", description: "Доверяют нам" },
    { label: "Продаж", value: "₽500M+", description: "Обработано" },
    { label: "Команда", value: "50+", description: "Профессионалов" },
    { label: "Страны", value: "15+", description: "Присутствие" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">
            О компании
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl mb-6">
            Мы создаем будущее
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}продаж
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            rSALE — это современная платформа для автоматизации продаж, которая помогает 
            компаниям расти и развиваться. Мы верим, что технологии должны работать на бизнес, 
            а не наоборот.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid gap-8 md:grid-cols-2 mb-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Наша миссия</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Мы стремимся сделать продажи простыми, эффективными и предсказуемыми. 
                Наша платформа объединяет лучшие практики и современные технологии, 
                чтобы помочь компаниям достигать выдающихся результатов.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Автоматизация рутинных процессов</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Аналитика в реальном времени</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Персонализированные стратегии</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Наши ценности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Инновации</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Мы постоянно ищем новые способы решения старых проблем
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Качество</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Каждая функция создается с вниманием к деталям
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Клиентоориентированность</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Успех наших клиентов — наш главный приоритет
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-4 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{stat.label}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-4">
              Наша команда
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Познакомьтесь с экспертами, которые создают будущее продаж
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Наша история</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-semibold mb-2">2019 - Начало</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Команда из 3 человек начала работу над первой версией платформы
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="font-semibold mb-2">2021 - Рост</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Первые 1000 клиентов и расширение команды до 20 человек
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="font-semibold mb-2">2024 - Лидерство</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Более 10,000 клиентов и признание как лидера в отрасли
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Присоединяйтесь к нам</CardTitle>
              <CardDescription className="text-blue-100">
                Станьте частью команды, которая меняет будущее продаж
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button size="lg" variant="secondary">
                  Посмотреть вакансии
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Связаться с нами
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}