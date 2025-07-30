"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Shield, 
  Truck, 
  CreditCard, 
  Star, 
  Users, 
  ShoppingBag, 
  Wrench,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  ArrowRight,
  Download,
  QrCode
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-slate-300">
      {/* Основной контент футера */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* О компании */}
          <div className="space-y-4">
                         <div className="flex items-center space-x-2">
             <Link href="/">
                 <img src="/svg/arrowlogo.svg" alt="rSALE Logo" className="h-6 w-auto filter brightness-0 invert" />
               </Link>
             </div>
            <p className="text-sm text-white leading-relaxed">
              Лучшая платформа для покупки и продажи товаров и услуг в Сербии. 
              Безопасные сделки, проверенные продавцы, качественные товары.
            </p>
            
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 pt-4">
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
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Facebook className="h-4 w-4 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Instagram className="h-4 w-4 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Twitter className="h-4 w-4 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-purple-600 hover:bg-purple-700 transition-colors">
                <Youtube className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Покупателям */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Покупателям</h3>
            <div className="space-y-3">
              <Link href="/products" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Все товары</span>
              </Link>
              <Link href="/products?category=electronics" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Электроника</span>
              </Link>
              <Link href="/products?category=clothing" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Одежда</span>
              </Link>
              <Link href="/products?category=furniture" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Мебель</span>
              </Link>
              <Link href="/products?category=cars" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Автомобили</span>
              </Link>
              <Link href="/products?category=real_estate" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Недвижимость</span>
              </Link>
              <Link href="/products?category=services" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Услуги</span>
              </Link>
            </div>

            {/* Преимущества */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <Shield className="h-3 w-3 text-green-400" />
                <span>Безопасные сделки</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="h-3 w-3 text-blue-400" />
                <span>Быстрая доставка</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <CreditCard className="h-3 w-3 text-purple-400" />
                <span>Удобная оплата</span>
              </div>
            </div>
          </div>

          {/* Продавцам */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Продавцам</h3>
            <div className="space-y-3">
              <Link href="/add-listing" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Добавить объявление</span>
              </Link>
              <Link href="/profile" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Личный кабинет</span>
              </Link>
              <Link href="/analytics" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Аналитика продаж</span>
              </Link>
              <Link href="/pricing" className="flex items-center space-x-2 text-sm hover:text-white transition-colors">
                <ArrowRight className="h-3 w-3" />
                <span>Тарифы</span>
              </Link>
            </div>

            {/* Статистика продавцов */}
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-100">Средний рейтинг</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-300 fill-current" />
                      <span className="text-xs text-white font-medium">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-100">Активных продавцов</span>
                    <span className="text-xs text-white font-medium">2.5K+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-100">Успешных сделок</span>
                    <span className="text-xs text-white font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Поддержка и контакты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Поддержка</h3>
            
            {/* Контактная информация */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+381 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-green-400" />
                <span>support@rsale.rs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-red-400" />
                <span>Белград, Сербия</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="h-4 w-4 text-purple-400" />
                <span>Онлайн чат</span>
              </div>
            </div>

            {/* Мобильное приложение */}
            <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Мобильное приложение</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    В разработке
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="h-8 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      <span className="text-xs">App Store</span>
                    </Button>
                    <Button size="sm" className="h-8 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      <span className="text-xs">Google Play</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR код */}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">QR код</div>
                <div className="text-xs text-gray-600">Отсканируйте для быстрого доступа</div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-purple-600" />

        {/* Нижняя часть футера */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm">
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Сербия</span>
            </div>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              Beta v1.0
            </Badge>
          </div>
        </div>

        {/* Копирайт */}
        <div className="text-center pt-6">
          <p className="text-xs text-slate-500">
            © 2024 rSALE. Все права защищены. Сделано с ❤️ в Сербии
          </p>
        </div>
      </div>
    </footer>
  );
} 