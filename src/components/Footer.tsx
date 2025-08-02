"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Shield, 
  Truck, 
  CreditCard, 
  Star, 
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  ArrowRight,
  Download,
  QrCode
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black text-slate-300">
      {/* Основной контент футера */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* О компании */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image src="/svg/arrowlogo.svg" alt="rSALE Logo" width={24} height={24} className="h-6 w-auto filter brightness-0 invert" />
              </Link>
            </div>
            <p className="text-sm text-white leading-relaxed">
              Лучшая платформа для покупки и продажи товаров и услуг в Сербии. 
              Безопасные сделки, проверенные продавцы, качественные товары.
            </p>
            
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-slate-400">Активных пользователей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-xs text-slate-400">Успешных сделок</div>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="flex space-x-4 pt-6">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Twitter className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Youtube className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Покупателям */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Покупателям</h3>
            <div className="space-y-4">
              <Link href="/products" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Все товары</span>
              </Link>
              <Link href="/favorites" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Избранное</span>
              </Link>
              <Link href="/contact" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Поддержка</span>
              </Link>
            </div>

            {/* Преимущества */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Безопасные сделки</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-4 w-4 text-blue-400" />
                <span>Быстрая доставка</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CreditCard className="h-4 w-4 text-purple-400" />
                <span>Удобная оплата</span>
              </div>
            </div>
          </div>

          {/* Продавцам */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Продавцам</h3>
            <div className="space-y-4">
              <Link href="/add-listing" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Добавить объявление</span>
              </Link>
              <Link href="/profile" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Личный кабинет</span>
              </Link>
              <Link href="/analytics" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Аналитика продаж</span>
              </Link>
              <Link href="/pricing" className="flex items-center space-x-3 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-4 w-4" />
                <span>Тарифы</span>
              </Link>
            </div>

            {/* Статистика продавцов */}
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-100">Средний рейтинг</span>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-300 fill-current" />
                      <span className="text-sm text-white font-medium">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-100">Активных продавцов</span>
                    <span className="text-sm text-white font-medium">2.5K+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-100">Успешных сделок</span>
                    <span className="text-sm text-white font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Поддержка и контакты */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Поддержка</h3>
            
            {/* Контактная информация */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+381 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-green-400" />
                <span>support@rsale.rs</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-red-400" />
                <span>Белград, Сербия</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                <span>Онлайн чат</span>
              </div>
            </div>

            {/* Мобильное приложение */}
            <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-white">Мобильное приложение</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    В разработке
                  </p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="h-9 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      <span className="text-xs">App Store</span>
                    </Button>
                    <Button size="sm" className="h-9 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      <span className="text-xs">Google Play</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR код */}
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-lg">
              <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center">
                <QrCode className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">QR код</div>
                <div className="text-xs text-gray-600">Отсканируйте для быстрого доступа</div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-purple-600" />

        {/* Нижняя часть футера */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-8 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">
              О нас
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Контакты
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Условия использования
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5" />
              <span className="text-sm">Сербия</span>
            </div>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              Beta v1.0
            </Badge>
          </div>
        </div>

        {/* Копирайт */}
        <div className="text-center pt-8">
          <p className="text-xs text-slate-500">
            © 2024 rSALE. Все права защищены. Сделано с ❤️ в Сербии
          </p>
        </div>
      </div>
    </footer>
  );
} 