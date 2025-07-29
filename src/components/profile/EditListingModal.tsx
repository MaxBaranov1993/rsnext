"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductData } from "@/data/products";
import { Save, Loader2, Upload, X, Image, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditListingModalProps {
  listing: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedListing: ProductData) => void;
}

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  isNew?: boolean;
}

export function EditListingModal({ listing, isOpen, onClose, onSave }: EditListingModalProps) {
  const [formData, setFormData] = useState<Partial<ProductData>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (listing) {
      setFormData({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        description: listing.description,
        seller: listing.seller
      });
      setErrors({});
      
      // Инициализируем изображения (в реальном приложении здесь были бы URL изображений)
      setImages([
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          isNew: false
        },
        {
          id: '2', 
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          isNew: false
        }
      ]);
    }
  }, [listing]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Неподдерживаемый формат",
        description: "Пожалуйста, загрузите только изображения",
        variant: "destructive",
      });
      return;
    }

    if (images.length + imageFiles.length > 10) {
      toast({
        title: "Слишком много изображений",
        description: "Максимум 10 изображений на объявление",
        variant: "destructive",
      });
      return;
    }

    const newImages = imageFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));

    setImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "Изображения добавлены",
      description: `Добавлено ${imageFiles.length} изображений`,
    });
  }, [images, toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Неподдерживаемый формат",
        description: "Пожалуйста, выберите только изображения",
        variant: "destructive",
      });
      return;
    }

    if (images.length + imageFiles.length > 10) {
      toast({
        title: "Слишком много изображений",
        description: "Максимум 10 изображений на объявление",
        variant: "destructive",
      });
      return;
    }

    const newImages = imageFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));

    setImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "Изображения добавлены",
      description: `Добавлено ${imageFiles.length} изображений`,
    });
  }, [images, toast]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove?.isNew) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== imageId);
    });
    
    toast({
      title: "Изображение удалено",
      description: "Изображение было удалено из объявления",
    });
  }, [toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Цена должна быть больше 0";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Категория обязательна";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Описание обязательно";
    }

    if (images.length === 0) {
      newErrors.images = "Добавьте хотя бы одно изображение";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedListing: ProductData = {
        ...listing!,
        ...formData,
        publishedAt: new Date().toISOString() // Обновляем дату публикации
      };

      onSave(updatedListing);
      
      // Показываем уведомление об успешном сохранении
      toast({
        title: "Изменения сохранены",
        description: "Объявление успешно обновлено",
      });
      
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      
      // Показываем уведомление об ошибке
      toast({
        title: "Ошибка при сохранении",
        description: "Не удалось сохранить изменения. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getConditionText = (condition: string) => {
    const conditions = {
      new: "Новый",
      excellent: "Отличное",
      good: "Хорошее",
      fair: "Удовлетворительное"
    };
    return conditions[condition as keyof typeof conditions] || "Не указано";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (!listing) return null;

  return (
          <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>
            Редактировать объявление
          </DialogTitle>
          <DialogDescription>
            Внесите изменения в объявление и сохраните их
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Управление изображениями */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Фотографии объявления</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">
                  {images.length}/10
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={images.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </div>
            </div>

            {/* Drag and Drop зона */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Перетащите изображения сюда или
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={images.length >= 10}
              >
                выберите файлы
              </Button>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}

            {/* Галерея изображений */}
            {images.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Загруженные изображения
                </h4>
                
                {/* Карусель для предварительного просмотра */}
                <div className="relative">
                  <Carousel 
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={image.id}>
                          <div className="relative aspect-square overflow-hidden rounded-lg">
                            <img
                              src={image.url}
                              alt={`Изображение ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 bg-red-500/90 hover:bg-red-600/90"
                                onClick={() => removeImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {image.isNew && (
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="text-xs">
                                  Новое
                                </Badge>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="h-8 w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
                        <CarouselNext className="h-8 w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm" />
                      </>
                    )}
                  </Carousel>
                </div>

                {/* Миниатюры */}
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Миниатюра ${index + 1}`}
                        className="w-full h-20 object-cover rounded border-2 border-transparent group-hover:border-blue-500"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-1 -right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Предварительный просмотр */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Предварительный просмотр
            </h4>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[0].url}
                    alt="Превью"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <Image className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-slate-900 dark:text-slate-100">
                  {formData.title || listing.title}
                </h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {formData.category || listing.category}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formData.price ? formatPrice(formData.price) : formatPrice(listing.price)} ₽
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {formData.condition ? getConditionText(formData.condition) : getConditionText(listing.condition)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название объявления *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Введите название объявления"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена (₽) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", Number(e.target.value))}
                  placeholder="0"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Електроника">Електроника</SelectItem>
                    <SelectItem value="Аутомобили">Аутомобили</SelectItem>
                    <SelectItem value="Одећа">Одећа</SelectItem>
                    <SelectItem value="Намештај">Намештај</SelectItem>
                    <SelectItem value="Некретнине">Некретнине</SelectItem>
                    <SelectItem value="Услуге">Услуге</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Состояние</Label>
                <Select
                  value={formData.condition || ""}
                  onValueChange={(value) => handleInputChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите состояние" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="excellent">Отличное</SelectItem>
                    <SelectItem value="good">Хорошее</SelectItem>
                    <SelectItem value="fair">Удовлетворительное</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Подробно опишите товар..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="w-full sm:w-auto">
              Отмена
            </Button>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Сохранение...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Сохранить изменения</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 