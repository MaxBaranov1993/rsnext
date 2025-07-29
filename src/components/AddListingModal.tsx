"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Upload, Plus, Trash2, Image as ImageIcon, Package, Briefcase } from "lucide-react";
import { ProductCategory, ProductCondition } from "@/types/product";

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ListingFormData) => void;
}

interface ListingFormData {
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  location: string;
  images: File[];
  type: 'product' | 'service';
}

const categories = [
  { value: "electronics", label: "Электроника" },
  { value: "clothing", label: "Одежда" },
  { value: "furniture", label: "Мебель" },
  { value: "cars", label: "Авто" },
  { value: "real_estate", label: "Недвижимость" },
  { value: "services", label: "Услуги" },
  { value: "kids", label: "Детям" },
  { value: "goods", label: "Товары" }
];

const conditions = [
  { value: "new", label: "Новый" },
  { value: "excellent", label: "Отличное" },
  { value: "good", label: "Хорошее" },
  { value: "fair", label: "Удовлетворительное" }
];

export function AddListingModal({ isOpen, onClose, onSubmit }: AddListingModalProps) {
  const [selectedType, setSelectedType] = useState<'product' | 'service' | null>(null);
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    price: 0,
    category: "goods",
    condition: "good",
    location: "",
    images: [],
    type: 'product'
  });

  const [dragActive, setDragActive] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ListingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: File[] = [];
    const newUrls: string[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        newUrls.push(URL.createObjectURL(file));
      }
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setImageUrls(prev => [...prev, ...newUrls]);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const handleTypeSelect = (type: 'product' | 'service') => {
    setSelectedType(type);
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'service' ? 'services' : 'goods'
    }));
  };

  const handleClose = () => {
    setSelectedType(null);
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "goods",
      condition: "good",
      location: "",
      images: [],
      type: 'product'
    });
    setImageUrls([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Добавить объявление</DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          // Выбор типа объявления
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                Выберите тип объявления
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Что вы хотите разместить?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Блок товаров */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-500"
                onClick={() => handleTypeSelect('product')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Товар
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Продажа физических товаров: электроника, одежда, мебель, авто и другие
                  </p>
                </CardContent>
              </Card>

              {/* Блок услуг */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500"
                onClick={() => handleTypeSelect('service')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Услуга
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Предоставление услуг: ремонт, консультации, доставка, обучение и другие
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Форма объявления
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Заголовок с типом */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedType === 'product' 
                  ? 'bg-orange-100 dark:bg-orange-900/20' 
                  : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                {selectedType === 'product' ? (
                  <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                ) : (
                  <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {selectedType === 'product' ? 'Товар' : 'Услуга'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Заполните информацию о вашем объявлении
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedType(null)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Название {selectedType === 'product' ? 'товара' : 'услуги'} *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={`Введите название ${selectedType === 'product' ? 'товара' : 'услуги'}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={`Подробно опишите ${selectedType === 'product' ? 'товар' : 'услугу'}`}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {selectedType === 'product' ? 'Цена (₽)' : 'Стоимость услуги (₽)'} *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      required
                    />
                    {formData.price > 0 && (
                      <p className="text-sm text-slate-500">
                        {formatPrice(formData.price)} ₽
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Местоположение *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Город, район"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value as ProductCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedType === 'product' && (
                    <div className="space-y-2">
                      <Label htmlFor="condition">Состояние *</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange('condition', value as ProductCondition)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите состояние" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Фотографии */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Фотографии</CardTitle>
                <p className="text-sm text-slate-500">
                  Добавьте до 10 фотографий. Первое фото будет главным.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag & Drop зона */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Перетащите фотографии сюда
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    или нажмите кнопку для выбора файлов
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Выбрать файлы
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400">
                    Поддерживаются форматы: JPG, PNG, GIF. Максимум 10 файлов.
                  </p>
                </div>

                {/* Предварительный просмотр изображений */}
                {imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      Загруженные фотографии ({imageUrls.length}/10)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img
                              src={url}
                              alt={`Фото ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 text-xs">
                              Главное
                            </Badge>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={!formData.title || !formData.price || !formData.location}>
                Опубликовать объявление
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 