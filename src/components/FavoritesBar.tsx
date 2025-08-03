
import React from "react";
import { Star } from "lucide-react";

interface FavoritesBarProps {
  favorites: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  onSelect,
  onRemove,
}) => {
  if (favorites.length === 0) return null;
  return (
    <div className="flex gap-3 flex-wrap mb-8 w-full max-w-3xl mx-auto animate-fade-in">
      {favorites.map((city) => (
        <button
          key={city}
          onClick={() => onSelect(city)}
          className="flex items-center px-4 py-3 weather-card-glass rounded-2xl shadow-lg text-weather-text font-semibold group transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in"
        >
          <Star className="text-accent mr-2 group-hover:scale-110 transition-transform" size={18} />
          {city}
          <span
            className="ml-3 text-destructive text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125"
            onClick={e => { e.stopPropagation(); onRemove(city); }}
            title="Remove favorite"
          >
            ×
          </span>
        </button>
      ))}
    </div>
  );
};
