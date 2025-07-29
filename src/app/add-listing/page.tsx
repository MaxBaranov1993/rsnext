"use client";

import { useState } from "react";
import { AddListingModal } from "@/components/AddListingModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";

export default function AddListingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Новое объявление:", data);
    // Здесь будет логика сохранения объявления
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Добавить объявление
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Создайте новое объявление для продажи товара или услуги. 
            Заполните все необходимые поля и добавьте фотографии.
          </p>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Создать объявление
          </Button>
        </div>

        <AddListingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 