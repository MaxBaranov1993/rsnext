"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Shield, 
  Star, 
  Calendar,
  Save,
  Camera,
  ArrowLeft,
  Settings,
  MessageSquare,
  Heart,
  Package,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

interface ProfileData {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  memberSince: string;
  totalSales: number;
  responseTime: string;
  type: "individual" | "company";
  location: string;
  verified: boolean;
  description: string;
  email: string;
  phone: string;
  companyInfo?: {
    legalName: string;
    inn: string;
    address: string;
    phone: string;
    website: string;
  };
}

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "1",
    name: "Александар Петровић",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 4.7,
    memberSince: "2022-03-15T00:00:00Z",
    totalSales: 23,
    responseTime: "В течение 2 часов",
    type: "individual",
    location: "Београд",
    verified: true,
    description: "Продаю качественные товары. Всегда на связи, быстро отвечаю на сообщения.",
    email: "alexandar@example.com",
    phone: "+381 60 123-45-67"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Сербия"
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompanyInfoChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Имитация сохранения
    setTimeout(() => {
      setSaving(false);
      console.log("Профиль сохранен:", profileData);
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Имитация смены пароля
    setTimeout(() => {
      setSaving(false);
      console.log("Пароль изменен:", passwordData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 1000);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Имитация сохранения адреса
    setTimeout(() => {
      setSaving(false);
      console.log("Адрес сохранен:", addressData);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              <ArrowLeft className="h-5 w-5" />
              <span>Назад</span>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/svg/arrowlogo.svg" alt="rSALE" className="h-6 w-6" />
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Личный кабинет</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="company">Компания</TabsTrigger>
              <TabsTrigger value="activity">Активность</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            {/* Профиль */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Основная информация</span>
                  </CardTitle>
                  <CardDescription>
                    Редактируйте основную информацию о себе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Аватар и основная информация */}
                    <div className="flex items-start space-x-6">
                      <div className="space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileData.avatar} alt={profileData.name} />
                          <AvatarFallback className="text-lg">{profileData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="w-full">
                          <Camera className="h-4 w-4 mr-2" />
                          Изменить фото
                        </Button>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Имя и фамилия</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="name"
                                value={profileData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Телефон</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="phone"
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location">Город</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="location"
                                value={profileData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">О себе</Label>
                          <Textarea
                            id="description"
                            value={profileData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Расскажите о себе..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="responseTime">Время ответа</Label>
                          <Input
                            id="responseTime"
                            value={profileData.responseTime}
                            onChange={(e) => handleInputChange("responseTime", e.target.value)}
                            placeholder="Например: В течение 2 часов"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{profileData.rating}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{profileData.totalSales} продаж</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">С {formatDate(profileData.memberSince)}</span>
                        </div>
                        {profileData.verified && (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>Верифицирован</span>
                          </Badge>
                        )}
                      </div>

                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Сохранение...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Сохранить</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Информация о компании */}
            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Информация о компании</span>
                  </CardTitle>
                  <CardDescription>
                    Заполните информацию о вашей компании (если вы представляете компанию)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isCompany"
                        checked={profileData.type === "company"}
                        onChange={(e) => handleInputChange("type", e.target.checked ? "company" : "individual")}
                        className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                      />
                      <Label htmlFor="isCompany">Я представляю компанию</Label>
                    </div>

                    {profileData.type === "company" && (
                      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="legalName">Юридическое название</Label>
                            <Input
                              id="legalName"
                              value={profileData.companyInfo?.legalName || ""}
                              onChange={(e) => handleCompanyInfoChange("legalName", e.target.value)}
                              placeholder="ООО 'Название компании'"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="inn">ИНН</Label>
                            <Input
                              id="inn"
                              value={profileData.companyInfo?.inn || ""}
                              onChange={(e) => handleCompanyInfoChange("inn", e.target.value)}
                              placeholder="1234567890"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Юридический адрес</Label>
                            <Input
                              id="address"
                              value={profileData.companyInfo?.address || ""}
                              onChange={(e) => handleCompanyInfoChange("address", e.target.value)}
                              placeholder="г. Москва, ул. Примерная, д. 1, оф. 123"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="companyPhone">Телефон компании</Label>
                            <Input
                              id="companyPhone"
                              value={profileData.companyInfo?.phone || ""}
                              onChange={(e) => handleCompanyInfoChange("phone", e.target.value)}
                              placeholder="+7 (495) 123-45-67"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="website">Сайт компании</Label>
                            <Input
                              id="website"
                              value={profileData.companyInfo?.website || ""}
                              onChange={(e) => handleCompanyInfoChange("website", e.target.value)}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Активность */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Активность</span>
                  </CardTitle>
                  <CardDescription>
                    Ваша активность на платформе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{profileData.totalSales}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Продаж</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{profileData.rating}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Рейтинг</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">2</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Активных объявлений</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Настройки */}
            <TabsContent value="settings" className="space-y-6">
              {/* Смена пароля */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Смена пароля</span>
                  </CardTitle>
                  <CardDescription>
                    Измените пароль для вашего аккаунта
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Изменение пароля...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Изменить пароль</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Адрес */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Адрес доставки</span>
                  </CardTitle>
                  <CardDescription>
                    Укажите адрес для доставки товаров
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Улица и номер дома</Label>
                        <Input
                          id="street"
                          value={addressData.street}
                          onChange={(e) => handleAddressChange("street", e.target.value)}
                          placeholder="ул. Примерная, д. 123"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Город</Label>
                        <Input
                          id="city"
                          value={addressData.city}
                          onChange={(e) => handleAddressChange("city", e.target.value)}
                          placeholder="Белград"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Почтовый индекс</Label>
                        <Input
                          id="postalCode"
                          value={addressData.postalCode}
                          onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                          placeholder="11000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Страна</Label>
                        <Input
                          id="country"
                          value={addressData.country}
                          onChange={(e) => handleAddressChange("country", e.target.value)}
                          placeholder="Сербия"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Сохранение адреса...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Сохранить адрес</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}