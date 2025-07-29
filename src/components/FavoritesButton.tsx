"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/contexts/FavoritesContext";
import { FavoritesModal } from "./FavoritesModal";

interface FavoritesButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showCount?: boolean;
}

export function FavoritesButton({ 
  variant = "outline", 
  size = "icon", 
  className = "",
  showCount = true 
}: FavoritesButtonProps) {
  const { favoritesCount } = useFavorites();

  return (
    <FavoritesModal
      trigger={
        <Button 
          variant={variant} 
          size={size} 
          className={`relative ${className}`}
        >
          <Heart className="h-4 w-4" />
          {showCount && favoritesCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {favoritesCount}
            </Badge>
          )}
        </Button>
      }
    />
  );
} 